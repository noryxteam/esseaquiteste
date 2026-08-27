#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/norax"
REPO_URL="https://github.com/noryxteam/esseaquiteste.git"
PUBLIC_HOST="${PUBLIC_HOST:-193.160.119.67}"
PUBLIC_PORT="${PUBLIC_PORT:-3076}"
PUBLIC_URL="http://${PUBLIC_HOST}:${PUBLIC_PORT}"
SECRETS_FILE="/root/.norax-secrets"

log() {
  echo "[norax-deploy] $*"
}

export DEBIAN_FRONTEND=noninteractive

log "Atualizando pacotes..."
apt-get update -y
apt-get install -y git curl ca-certificates nginx ufw openssl

if ! command -v node >/dev/null 2>&1; then
  log "Instalando Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

if ! command -v docker >/dev/null 2>&1; then
  log "Instalando Docker..."
  apt-get install -y docker.io docker-compose-v2
  systemctl enable --now docker
fi

if ! command -v pm2 >/dev/null 2>&1; then
  log "Instalando PM2..."
  npm install -g pm2
fi

mkdir -p /var/www
if [ ! -d "${APP_DIR}/.git" ]; then
  log "Clonando repositório..."
  git clone "${REPO_URL}" "${APP_DIR}"
else
  log "Atualizando repositório..."
  git -C "${APP_DIR}" fetch origin
  git -C "${APP_DIR}" reset --hard origin/main
fi

cd "${APP_DIR}"

if [ ! -f "${SECRETS_FILE}" ]; then
  log "Gerando senhas e chaves..."
  cat > "${SECRETS_FILE}" <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 16)
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
ACCESS_CODE_PEPPER=$(openssl rand -hex 24)
PORTAL_TOKEN_SECRET=$(openssl rand -hex 24)
EOF
  chmod 600 "${SECRETS_FILE}"
fi

# shellcheck disable=SC1090
source "${SECRETS_FILE}"

log "Escrevendo variáveis de produção..."
cat > "${APP_DIR}/backend/.env" <<EOF
NODE_ENV=production
PORT=3333
API_PREFIX=/api/v1
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
DATABASE_URL=postgresql://norax:${POSTGRES_PASSWORD}@127.0.0.1:5432/norax?schema=public
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=2000
UPLOAD_MAX_SIZE_MB=50
UPLOAD_LOCAL_PATH=./uploads
CORS_ORIGIN=${PUBLIC_URL}
ACCESS_CODE_PEPPER=${ACCESS_CODE_PEPPER}
PORTAL_TOKEN_SECRET=${PORTAL_TOKEN_SECRET}
APP_PUBLIC_URL=${PUBLIC_URL}
API_PUBLIC_URL=${PUBLIC_URL}/api/v1
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM_NAME=Norax
MAIL_FROM_EMAIL=
EOF
chmod 600 "${APP_DIR}/backend/.env"

cat > "${APP_DIR}/.env.local" <<EOF
NEXT_PUBLIC_API_URL=${PUBLIC_URL}/api/v1
EOF
chmod 600 "${APP_DIR}/.env.local"

log "Subindo PostgreSQL..."
docker compose --env-file "${APP_DIR}/backend/.env" -f "${APP_DIR}/deploy/docker-compose.prod.yml" up -d

log "Aguardando banco ficar pronto..."
for _ in $(seq 1 40); do
  if docker exec norax-postgres pg_isready -U norax -d norax >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

log "Instalando dependências..."
npm install --prefix "${APP_DIR}"
npm install --prefix "${APP_DIR}/backend"

log "Sincronizando banco..."
(
  cd "${APP_DIR}/backend"
  npx prisma generate
  npx prisma db push --skip-generate
  npx prisma db seed || true
)

log "Compilando frontend..."
npm run build --prefix "${APP_DIR}"

log "Configurando Nginx só na porta ${PUBLIC_PORT} (não mexe na 80)..."
cp "${APP_DIR}/deploy/nginx-norax.conf" /etc/nginx/sites-available/norax
ln -sfn /etc/nginx/sites-available/norax /etc/nginx/sites-enabled/norax
nginx -t
systemctl enable --now nginx
systemctl reload nginx

log "Liberando só a porta ${PUBLIC_PORT}..."
ufw allow "${PUBLIC_PORT}/tcp" >/dev/null 2>&1 || true

log "Iniciando painel com PM2..."
pm2 delete norax-api norax-web >/dev/null 2>&1 || true
pm2 start "${APP_DIR}/deploy/ecosystem.config.cjs"
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

log "Pronto."
log "Painel: ${PUBLIC_URL}/dashboard"
log "Login: admin@norax.dev / norax123"
