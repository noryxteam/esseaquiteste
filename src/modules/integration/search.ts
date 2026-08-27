import {
  getBriefings,
  getClients,
  getContracts,
  getFiles,
  getMeetings,
  getProjects,
  getUsers,
} from "@/mock";
import type { SearchResultItem } from "@/modules/integration/types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matches(query: string, ...fields: (string | undefined | null)[]): boolean {
  const q = normalize(query);
  return fields.some((f) => f && normalize(f).includes(q));
}

export function searchGlobal(query: string, limit = 5): SearchResultItem[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  for (const c of getClients()) {
    if (matches(q, c.empresa, c.nome, c.email)) {
      results.push({
        id: c.id,
        type: "client",
        title: c.empresa,
        subtitle: c.nome,
        link: "/clientes",
      });
    }
  }

  for (const p of getProjects()) {
    if (matches(q, p.nome, p.descricao)) {
      const client = getClients().find((c) => c.id === p.clienteId);
      results.push({
        id: p.id,
        type: "project",
        title: p.nome,
        subtitle: client?.empresa ?? "",
        link: "/projetos",
      });
    }
  }

  for (const c of getContracts()) {
    if (matches(q, c.numeroContrato)) {
      results.push({
        id: c.id,
        type: "contract",
        title: c.numeroContrato,
        subtitle: c.status,
        link: "/contratos",
      });
    }
  }

  for (const m of getMeetings()) {
    if (matches(q, m.titulo)) {
      results.push({
        id: m.id,
        type: "meeting",
        title: m.titulo,
        subtitle: m.data,
        link: `/reunioes/${m.id}`,
      });
    }
  }

  for (const f of getFiles()) {
    if (matches(q, f.nome)) {
      results.push({
        id: f.id,
        type: "file",
        title: f.nome,
        subtitle: f.categoria,
        link: "/arquivos",
      });
    }
  }

  for (const b of getBriefings()) {
    if (matches(q, b.resumo)) {
      const project = getProjects().find((p) => p.id === b.projetoId);
      results.push({
        id: b.id,
        type: "briefing",
        title: b.resumo.slice(0, 60),
        subtitle: project?.nome ?? "",
        link: "/briefings",
      });
    }
  }

  for (const u of getUsers()) {
    if (matches(q, u.nome, u.email)) {
      results.push({
        id: u.id,
        type: "user",
        title: u.nome,
        subtitle: u.email,
        link: "/equipe",
      });
    }
  }

  return results.slice(0, limit * 7);
}

export const SEARCH_TYPE_LABELS: Record<SearchResultItem["type"], string> = {
  client: "Clientes",
  project: "Projetos",
  contract: "Contratos",
  meeting: "Reuniões",
  file: "Arquivos",
  briefing: "Briefings",
  user: "Usuários",
};
