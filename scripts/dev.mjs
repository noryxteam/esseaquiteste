import { execSync, spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");
const ports = [3000, 3001];

function killPort(port) {
  if (process.platform === "win32") {
    try {
      execSync(
        `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`,
        { stdio: "ignore" }
      );
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

function cleanNextCache() {
  // NÃO apagar .next a cada `npm run dev` — isso força recompilação de
  // todas as rotas (10s–60s+ por navegação). Limpe só com NORAX_CLEAN_NEXT=1.
  if (process.env.NORAX_CLEAN_NEXT === "1" && fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log("[norax] Cache .next limpo (NORAX_CLEAN_NEXT=1).");
  }
}

console.log("[norax] Encerrando servidores antigos...");
for (const port of ports) killPort(port);

cleanNextCache();

console.log("[norax] Iniciando servidor de desenvolvimento...");
const child = spawn(process.execPath, [nextBin, "dev", "-p", "3000"], {
  cwd: root,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
