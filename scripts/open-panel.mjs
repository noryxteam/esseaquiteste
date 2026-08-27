import {
  BACKEND,
  BACKEND_HEALTH_URL,
  PANEL_URL,
  PORTS,
  ROOT,
  ensureDeps,
  ensureProjectEnv,
  killPorts,
  log,
  openMicrosoftEdge,
  prepareBackend,
  registerShutdown,
  spawnService,
  sleep,
  waitForFrontendReady,
  waitForHttp,
  waitForPort,
} from "./lib/dev-utils.mjs";

async function main() {
  log("=== Abrindo painel Norax ===");

  ensureProjectEnv();

  log("Liberando portas ocupadas...");
  killPorts([PORTS.frontend, PORTS.frontendAlt, PORTS.backend]);
  await sleep(1500);

  ensureDeps(ROOT, "frontend");
  ensureDeps(BACKEND, "backend");
  prepareBackend();

  const children = [];

  log("Subindo backend...");
  children.push(spawnService("backend", "npm", ["run", "dev"], BACKEND));

  await waitForPort(PORTS.backend);
  await waitForHttp(BACKEND_HEALTH_URL);
  log("Backend pronto.");

  log("Subindo frontend...");
  children.push(spawnService("frontend", "npm", ["run", "dev:frontend"], ROOT));

  await waitForFrontendReady();
  log("Frontend pronto.");

  openMicrosoftEdge(PANEL_URL);
  log("Painel aberto no Microsoft Edge.");
  log("Pressione Ctrl+C para encerrar os servidores.");

  registerShutdown(children);

  await new Promise(() => {});
}

main().catch((error) => {
  console.error("[norax] Falha ao abrir o painel:", error.message);
  process.exit(1);
});
