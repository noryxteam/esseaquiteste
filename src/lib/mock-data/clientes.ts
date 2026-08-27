import type {
  ClientActivity,
  ClientRow,
  ClientStat,
  ClientesData,
  FunnelStage,
  StatusSegment,
} from "@/lib/mock-data/clientes-types";
import { formatCurrency } from "@/lib/utils";

const CLIENTS_STORAGE_KEY = "norax.clientes.v1";
let clientsHydrated = false;

function hydrateClientes(): void {
  if (clientsHydrated || typeof window === "undefined") return;
  clientsHydrated = true;
  try {
    const raw = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) return;
    const list = JSON.parse(raw) as ClientRow[];
    if (!Array.isArray(list)) return;
    clientsStore = list;
  } catch {
    // ignore
  }
}

function persistClientes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clientsStore));
  } catch {
    // ignore
  }
}

/** Lista mutável — métricas são derivadas em getClientesData(). */
let clientsStore: ClientRow[] = [];

function percentOf(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function buildStats(clients: ClientRow[]): ClientStat[] {
  const total = clients.length;
  const novos = clients.filter((c) => c.lastContact === "Hoje").length;
  const revenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const withProjects = clients.filter((c) => c.projects > 0).length;

  return [
    {
      id: "total",
      title: "Total de clientes",
      value: String(total),
    },
    {
      id: "new",
      title: "Novos clientes",
      value: String(novos),
    },
    {
      id: "projects",
      title: "Com projetos",
      value: String(withProjects),
    },
    {
      id: "revenue",
      title: "Receita ativa",
      value: formatCurrency(revenue),
    },
  ];
}

function buildFunnel(clients: ClientRow[]): FunnelStage[] {
  const total = clients.length;
  const withProjects = clients.filter((c) => c.projects > 0).length;
  const withRevenue = clients.filter((c) => c.revenue > 0).length;
  const novos = clients.filter((c) => c.lastContact === "Hoje").length;
  const top = Math.max(total, 1);

  const stages: Omit<FunnelStage, "percent">[] = [
    { id: "total", label: "Cadastrados", value: total, fill: "#fafafa" },
    { id: "novos", label: "Novos", value: novos, fill: "#d4d4d8" },
    { id: "projetos", label: "Com projeto", value: withProjects, fill: "#a1a1aa" },
    { id: "receita", label: "Com receita", value: withRevenue, fill: "#71717a" },
    { id: "base", label: "Base ativa", value: Math.max(withProjects, withRevenue), fill: "#52525b" },
  ];

  if (clients.length === 0) {
    return stages.map((s) => ({ ...s, value: 0, percent: 0 }));
  }

  return stages.map((s) => ({
    ...s,
    percent: percentOf(s.value, top),
  }));
}

function buildStatusSegments(clients: ClientRow[]): StatusSegment[] {
  const total = clients.length;
  const withProjects = clients.filter((c) => c.projects > 0).length;
  const withRevenue = clients.filter((c) => c.revenue > 0).length;
  const onlyCadastro = Math.max(0, total - Math.max(withProjects, withRevenue));

  return [
    {
      id: "projetos",
      label: "Com projeto",
      value: withProjects,
      percent: percentOf(withProjects, total),
      fill: "#fafafa",
    },
    {
      id: "receita",
      label: "Com receita",
      value: withRevenue,
      percent: percentOf(withRevenue, total),
      fill: "#a1a1aa",
    },
    {
      id: "cadastro",
      label: "Só cadastro",
      value: onlyCadastro,
      percent: percentOf(onlyCadastro, total),
      fill: "#52525b",
    },
  ];
}

function buildActivities(clients: ClientRow[]): ClientActivity[] {
  return clients.map((c) => ({
    id: c.id,
    title: c.name,
    description: "Cliente cadastrado",
    time: c.lastContact,
  }));
}

/** @deprecated Prefer getClientesData() — mantido para tipagem em props. */
export const clientesData: ClientesData = {
  totalClients: 0,
  stats: buildStats([]),
  clients: [],
  funnel: buildFunnel([]),
  statusSegments: buildStatusSegments([]),
  activities: [],
  tasks: [],
};

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function getClientesData(): ClientesData {
  hydrateClientes();
  const clients = clientsStore;
  return {
    totalClients: clients.length,
    clients: [...clients],
    stats: buildStats(clients),
    funnel: buildFunnel(clients),
    statusSegments: buildStatusSegments(clients),
    activities: buildActivities(clients),
    tasks: [],
  };
}

export function addCliente(input: { name: string; email?: string }): ClientRow {
  hydrateClientes();
  const name = input.name.trim();
  const client: ClientRow = {
    id: `cli-${Date.now()}`,
    name,
    initials: initialsFrom(name) || "NC",
    contactName: name,
    email: input.email?.trim() || "—",
    projects: 0,
    revenue: 0,
    status: "lead",
    lastContact: "Hoje",
    assignee: { name: "Murilo Lima", initials: "ML" },
  };
  clientsStore = [client, ...clientsStore];
  persistClientes();
  return client;
}

export function getClienteById(id: string): ClientRow | undefined {
  hydrateClientes();
  return clientsStore.find((c) => c.id === id);
}

export function removeCliente(id: string): boolean {
  hydrateClientes();
  const before = clientsStore.length;
  clientsStore = clientsStore.filter((c) => c.id !== id);
  if (clientsStore.length === before) return false;
  persistClientes();
  return true;
}
