import { prisma } from "@/database";
import { softDeleteWhere } from "@/shared/repositories/base.repository";

const TAKE_PER_TYPE = 5;

export interface SearchResultItem {
  id: string;
  type: "client" | "project" | "contract" | "meeting" | "file" | "briefing" | "user";
  title: string;
  subtitle: string;
  link: string;
}

export class SearchRepository {
  async globalSearch(query: string, limit = TAKE_PER_TYPE): Promise<SearchResultItem[]> {
    const q = query.trim();
    if (!q) return [];

    const contains = { contains: q, mode: "insensitive" as const };
    const base = softDeleteWhere();

    const [clients, projects, contracts, meetings, files, briefings, users] = await Promise.all([
      prisma.client.findMany({
        where: { ...base, OR: [{ nome: contains }, { empresa: contains }, { email: contains }] },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, nome: true, empresa: true },
      }),
      prisma.project.findMany({
        where: { ...base, OR: [{ nome: contains }, { descricao: contains }] },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, nome: true, cliente: { select: { empresa: true } } },
      }),
      prisma.contract.findMany({
        where: { ...base, numeroContrato: contains },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, numeroContrato: true, valor: true },
      }),
      prisma.meeting.findMany({
        where: { ...base, titulo: contains },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, titulo: true, data: true },
      }),
      prisma.file.findMany({
        where: { ...base, nome: contains },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, nome: true, categoria: true },
      }),
      prisma.briefing.findMany({
        where: { ...base, resumo: contains },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, resumo: true, projeto: { select: { nome: true } } },
      }),
      prisma.user.findMany({
        where: { ...base, OR: [{ nome: contains }, { email: contains }] },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, nome: true, email: true, role: true },
      }),
    ]);

    const results: SearchResultItem[] = [
      ...clients.map((c) => ({
        id: c.id,
        type: "client" as const,
        title: c.empresa,
        subtitle: c.nome,
        link: `/clientes`,
      })),
      ...projects.map((p) => ({
        id: p.id,
        type: "project" as const,
        title: p.nome,
        subtitle: p.cliente.empresa,
        link: `/projetos`,
      })),
      ...contracts.map((c) => ({
        id: c.id,
        type: "contract" as const,
        title: c.numeroContrato,
        subtitle: `R$ ${Number(c.valor).toLocaleString("pt-BR")}`,
        link: `/contratos`,
      })),
      ...meetings.map((m) => ({
        id: m.id,
        type: "meeting" as const,
        title: m.titulo,
        subtitle: m.data.toISOString().split("T")[0],
        link: `/reunioes/${m.id}`,
      })),
      ...files.map((f) => ({
        id: f.id,
        type: "file" as const,
        title: f.nome,
        subtitle: f.categoria,
        link: `/arquivos`,
      })),
      ...briefings.map((b) => ({
        id: b.id,
        type: "briefing" as const,
        title: b.resumo.slice(0, 60),
        subtitle: b.projeto.nome,
        link: `/briefings`,
      })),
      ...users.map((u) => ({
        id: u.id,
        type: "user" as const,
        title: u.nome,
        subtitle: u.email,
        link: `/equipe`,
      })),
    ];

    return results;
  }
}

export const searchRepository = new SearchRepository();
