import { addCliente } from "@/lib/mock-data/clientes";
import type { ClientRow } from "@/lib/mock-data/clientes-types";
import { clientSetupService } from "@/modules/client-setup/service";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STRUCTURE_KEY = "norax.client-structure.v1";

function persistStructure(clientId: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STRUCTURE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    map[clientId] = payload;
    window.localStorage.setItem(STRUCTURE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function removeClientStructure(clientId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STRUCTURE_KEY);
    if (!raw) return;
    const map = JSON.parse(raw) as Record<string, unknown>;
    if (!(clientId in map)) return;
    delete map[clientId];
    window.localStorage.setItem(STRUCTURE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export interface BootstrapClientInput {
  name: string;
  email: string;
}

/**
 * Prepara a estrutura completa do cliente enquanto a tela de criação é exibida.
 */
export async function bootstrapNewClient(input: BootstrapClientInput): Promise<ClientRow> {
  const name = input.name.trim();
  const email = input.email.trim();

  if (!name) {
    throw new Error("Informe o nome da empresa.");
  }

  await sleep(380);

  const client = addCliente({ name, email });

  await sleep(420);

  clientSetupService.ensureDraft(client.id, {
    empresa: name,
    email: email || "",
  });

  await sleep(400);

  persistStructure(client.id, {
    filesFolder: `clientes/${client.id}`,
    createdAt: new Date().toISOString(),
    defaults: {
      status: "lead",
      privateProfile: true,
      notifications: true,
    },
  });

  await sleep(450);

  persistStructure(client.id, {
    filesFolder: `clientes/${client.id}`,
    createdAt: new Date().toISOString(),
    defaults: {
      status: "lead",
      privateProfile: true,
      notifications: true,
    },
    folders: ["contratos", "briefings", "arquivos", "financeiro"],
    privateProfile: {
      clientId: client.id,
      visibility: "internal",
    },
  });

  await sleep(380);

  return client;
}
