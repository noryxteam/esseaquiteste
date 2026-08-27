import {
  BACKEND,
  BACKEND_HEALTH_URL,
  PORTS,
  ROOT,
  ensureDeps,
  ensureProjectEnv,
  killPorts,
  log,
  prepareBackend,
  registerShutdown,
  sleep,
  spawnService,
  waitForFrontendReady,
  waitForHttp,
  waitForPort,
} from "./lib/dev-utils.mjs";

async function main() {
  log("Iniciando Norax (frontend + backend)...");

  ensureProjectEnv();

  killPorts([PORTS.frontend, PORTS.frontendAlt, PORTS.backend]);
  await sleep(1500);

  ensureDeps(ROOT, "frontend");
  ensureDeps(BACKEND, "backend");
  prepareBackend();

  const children = [];

  log("Subindo backend na porta 3333...");
  children.push(spawnService("backend", "npm", ["run", "dev"], BACKEND));

  await waitForPort(PORTS.backend);
  await waitForHttp(BACKEND_HEALTH_URL);
  log("Backend pronto.");

  log("Subindo frontend na porta 3000...");
  children.push(spawnService("frontend", "npm", ["run", "dev:frontend"], ROOT));

  await waitForFrontendReady();
  log("Frontend pronto.");
  log(`Painel disponível em http://localhost:${PORTS.frontend}/dashboard`);

  registerShutdown(children);

  await new Promise(() => {});
}

main().catch((error) => {
  console.error("[norax] Erro:", error.message);
  process.exit(1);
});
