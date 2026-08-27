import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(__dirname, "../..");
export const BACKEND = path.join(ROOT, "backend");

export const PORTS = {
  frontend: 3000,
  frontendAlt: 3001,
  backend: 3333,
};

export const PANEL_URL = "http://localhost:3000/dashboard";
export const LOGIN_URL = "http://127.0.0.1:3000/login";
export const BACKEND_HEALTH_URL = "http://127.0.0.1:3333/health";

export function log(message) {
  console.log(`[norax] ${message}`);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function killPort(port) {
  if (process.platform === "win32") {
    try {
      // netstat/taskkill — evita bug do PowerShell com $_ em shells aninhados
      const out = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        if (!/LISTENING/i.test(line)) continue;
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        } catch {
          /* já encerrado */
        }
      }
    } catch {
      /* porta livre */
    }
    return;
  }

  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: "ignore", shell: true });
  } catch {
    /* porta livre */
  }
}

export function killPorts(ports) {
  for (const port of ports) killPort(port);
}

export function isPortOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    socket.setTimeout(1000);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

export async function waitForPort(port, { timeout = 300_000, host = "127.0.0.1" } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await isPortOpen(port, host)) return;
    await sleep(500);
  }
  throw new Error(`Porta ${port} não ficou pronta em ${timeout / 1000}s`);
}

function httpGetStatus(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 8000 }, (res) => {
      res.resume();
      resolve(res.statusCode ?? 0);
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

export async function waitForHttp(url, { timeout = 180_000, expectedStatus = 200 } = {}) {
  const start = Date.now();
  const target = url.replace("localhost", "127.0.0.1");

  while (Date.now() - start < timeout) {
    try {
      const status = await httpGetStatus(target);
      if (status === expectedStatus || (expectedStatus === 200 && status > 0 && status < 500)) {
        return;
      }
    } catch {
      /* aguarda próxima tentativa */
    }
    await sleep(1000);
  }

  throw new Error(`URL ${url} não respondeu em ${timeout / 1000}s`);
}

export function ensureEnvFile(targetPath, examplePath) {
  if (!fs.existsSync(targetPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, targetPath);
    log(`Criado ${path.basename(targetPath)} a partir do exemplo.`);
  }
}

export function ensureProjectEnv() {
  ensureEnvFile(path.join(ROOT, ".env.local"), path.join(ROOT, ".env.local.example"));
  ensureEnvFile(path.join(BACKEND, ".env"), path.join(BACKEND, ".env.example"));
}

export function needsInstall(cwd) {
  const nodeModules = path.join(cwd, "node_modules");
  if (!fs.existsSync(nodeModules)) return true;

  // Frontend
  if (fs.existsSync(path.join(cwd, "package.json"))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));
      if (pkg.dependencies?.next && !fs.existsSync(path.join(nodeModules, "next"))) return true;
      if (pkg.dependencies?.express && !fs.existsSync(path.join(nodeModules, "express"))) return true;
    } catch {
      return !fs.existsSync(path.join(nodeModules, ".package-lock.json"));
    }
  }

  return false;
}

export function installDeps(cwd, label) {
  log(`Instalando dependências (${label})...`);
  execSync("npm install", { cwd, stdio: "inherit" });
}

export function ensureDeps(cwd, label) {
  if (needsInstall(cwd)) {
    installDeps(cwd, label);
  }
}

export function prepareBackend() {
  log("Preparando backend (Prisma)...");

  const prismaClient = path.join(BACKEND, "node_modules", ".prisma", "client", "index.js");

  try {
    execSync("npx prisma generate", { cwd: BACKEND, stdio: "inherit" });
  } catch {
    if (fs.existsSync(prismaClient)) {
      log("Prisma client já gerado — continuando.");
    } else {
      log("Prisma generate falhou — reinstalando dependências do backend...");
      installDeps(BACKEND, "backend");
      execSync("npx prisma generate", { cwd: BACKEND, stdio: "inherit" });
    }
  }

  try {
    execSync("npx prisma db push --skip-generate", { cwd: BACKEND, stdio: "pipe" });
    log("Schema do banco sincronizado.");
  } catch {
    log("Aviso: não foi possível sincronizar o banco. Verifique se o PostgreSQL está rodando.");
  }

  try {
    execSync("npx prisma db seed", { cwd: BACKEND, stdio: "pipe" });
  } catch {
    /* seed opcional */
  }
}

export function spawnService(name, command, args, cwd) {
  const child =
    process.platform === "win32"
      ? spawn(`${command} ${args.join(" ")}`, {
          cwd,
          stdio: "inherit",
          shell: true,
          env: { ...process.env },
        })
      : spawn(command, args, {
          cwd,
          stdio: "inherit",
          shell: false,
          env: { ...process.env },
        });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      log(`${name} encerrou com código ${code}`);
    }
  });

  return child;
}

export async function waitForFrontendReady({ timeout = 300_000 } = {}) {
  await waitForPort(PORTS.frontend, { timeout });
  try {
    await waitForHttp(LOGIN_URL, { timeout });
  } catch (error) {
    log(`Aviso: login ainda compilando (${error.message}). Abrindo mesmo assim.`);
  }
  await sleep(500);
}

export function openMicrosoftEdge(url) {
  log(`Abrindo painel em ${url}`);

  if (process.platform === "win32") {
    execSync(
      `powershell -NoProfile -Command "Start-Process msedge '${url}'"`,
      { stdio: "ignore" }
    );
    return;
  }

  if (process.platform === "darwin") {
    try {
      execSync(`open -a "Microsoft Edge" "${url}"`, { stdio: "ignore" });
      return;
    } catch {
      execSync(`open "${url}"`, { stdio: "ignore" });
      return;
    }
  }

  execSync(`xdg-open "${url}"`, { stdio: "ignore" });
}

export function registerShutdown(children) {
  const shutdown = () => {
    log("Encerrando servidores...");
    for (const child of children) {
      try {
        child.kill("SIGTERM");
      } catch {
        /* já encerrado */
      }
    }
    killPorts([PORTS.frontend, PORTS.frontendAlt, PORTS.backend]);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
