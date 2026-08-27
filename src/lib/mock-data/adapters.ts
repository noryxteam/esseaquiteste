import { formatDateBR, initials } from "@/mock/common/utils";
import {
  getBriefings,
  getClients,
  getContracts,
  getDashboard,
  getFinanceMovements,
  getMeetings,
  getProjects,
  getReports,
  getTasks,
  getTimelineEvents,
  getUsers,
} from "@/mock";
import type { MockClient } from "@/mock/clients/types";
import type { MockContract } from "@/mock/contracts/types";
import type { MockFinanceMovement } from "@/mock/finance/types";
import type { MockMeeting } from "@/mock/meetings/types";
import type { MockProject } from "@/mock/projects/types";
import type { ClientesData, ClientRow, ClientStatus } from "@/lib/mock-data/clientes-types";
import type { ContratosData, Contract, ContractStatus } from "@/lib/mock-data/contratos-types";
import type { DashboardData } from "@/lib/mock-data/types";
import type { FinanceiroData, FinancialMovement } from "@/lib/mock-data/financeiro-types";
import type { ProjetosData, Project, ProjectCategory, ProjectStage } from "@/lib/mock-data/projetos-types";
import type { RelatoriosData, RelatoriosDataset } from "@/lib/mock-data/relatorios-types";
import type { ReunioesData, Meeting, MeetingType } from "@/lib/mock-data/reunioes-types";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mapClientStatus(status: MockClient["status"]): ClientStatus {
  if (status === "prospecto") return "lead";
  if (status === "churn" || status === "inativo") return "inativo";
  return "ativo";
}

function mapProjectCategory(status: MockProject["status"]): ProjectCategory {
  if (status === "concluido") return "concluido";
  if (status === "planejamento") return "planejamento";
  return "em-andamento";
}

function mapProjectStage(status: MockProject["status"]): { stage: ProjectStage; label: string } {
  const map: Record<MockProject["status"], { stage: ProjectStage; label: string }> = {
    planejamento: { stage: "planejamento", label: "Planejamento" },
    "em-andamento": { stage: "desenvolvimento", label: "Desenvolvimento" },
    pausado: { stage: "pausado", label: "Pausado" },
    concluido: { stage: "qa", label: "Concluído" },
    cancelado: { stage: "pausado", label: "Cancelado" },
  };
  return map[status];
}

function mapContractStatus(status: MockContract["status"]): ContractStatus {
  if (status === "aguardando-assinatura") return "aguardando-assinatura";
  return status;
}

const CONTRACT_STATUS_LABELS: Record<MockContract["status"], string> = {
  rascunho: "Rascunho",
  "aguardando-assinatura": "Aguardando assinatura",
  assinado: "Assinado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

const MEETING_TYPES: MeetingType[] = [
  "planejamento",
  "revisao",
  "apresentacao",
  "interna",
  "comercial",
];

const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  planejamento: "Planejamento",
  revisao: "Revisão",
  apresentacao: "Apresentação",
  interna: "Interna",
  comercial: "Comercial",
};

function mapFinanceMovement(
  f: MockFinanceMovement,
  clientMap: Map<string, MockClient>,
  projectMap: Map<string, MockProject>,
  contractMap: Map<string, MockContract>
): FinancialMovement {
  const client = clientMap.get(f.clienteId);
  const contract = f.contratoId ? contractMap.get(f.contratoId) : undefined;
  const project = contract ? projectMap.get(contract.projetoId) : undefined;

  const tipoMap: Record<MockFinanceMovement["tipo"], FinancialMovement["tipo"]> = {
    receita: f.status === "pago" ? "recebimento" : "a-receber",
    despesa: "pagamento",
    transferencia: "transferencia",
  };

  const statusMap: Record<MockFinanceMovement["status"], FinancialMovement["status"]> = {
    pago: f.tipo === "receita" ? "recebido" : "pago",
    pendente: f.tipo === "receita" ? "pendente" : "pendente",
    atrasado: "atrasado",
    cancelado: "pendente",
  };

  const statusLabelMap: Record<FinancialMovement["status"], string> = {
    recebido: "Recebido",
    pendente: "Pendente",
    pago: "Pago",
    parcial: "Parcial",
    atrasado: "Atrasado",
  };

  const status = statusMap[f.status];

  return {
    id: f.id,
    contratoId: f.contratoId ?? "",
    contratoNumero: contract?.numeroContrato ?? "—",
    cliente: client?.empresa ?? "—",
    projeto: project?.nome ?? "—",
    descricao: f.descricao,
    categoria: f.categoria,
    tipo: tipoMap[f.tipo],
    formaPagamento: f.formaPagamento as FinancialMovement["formaPagamento"],
    valor: f.valor,
    valorFormatted: formatBRL(f.valor),
    status,
    statusLabel: statusLabelMap[status],
    data: formatDateBR(f.data),
    hora: "10:00",
  };
}

function buildMeetingRow(
  m: MockMeeting,
  clientMap: Map<string, MockClient>,
  projectMap: Map<string, MockProject>,
  index: number
): Meeting {
  const client = clientMap.get(m.clienteId);
  const project = projectMap.get(m.projetoId);
  const type = MEETING_TYPES[index % MEETING_TYPES.length];

  return {
    id: m.id,
    title: m.titulo,
    project: project?.nome ?? "—",
    client: client?.empresa ?? "—",
    startTime: m.inicio,
    endTime: m.fim,
    duration: "1h",
    date: formatDateBR(m.data),
    participants: m.participantes.map((p) => ({
      id: p.userId,
      initials: p.initials,
      name: p.nome,
    })),
    lead: m.participantes[0]
      ? {
          id: m.participantes[0].userId,
          initials: m.participantes[0].initials,
          name: m.participantes[0].nome,
        }
      : { id: "lead-unknown", initials: "—", name: "—" },
    type,
    typeLabel: MEETING_TYPE_LABELS[type],
    hasMinutes: m.transcricao,
    status: m.status === "cancelada" ? "agendada" : m.status,
    isMine: index % 3 === 0,
  };
}

export function buildClientesData(): ClientesData {
  const clients = getClients();
  const dashboard = getDashboard();
  const totalRevenue = clients.reduce((s, c) => s + c.valorTotal, 0);
  const avgProjects =
    clients.length > 0
      ? (clients.reduce((s, c) => s + c.quantidadeProjetos, 0) / clients.length).toFixed(1)
      : "0";

  const clientRows: ClientRow[] = clients.map((c) => ({
    id: c.id,
    name: c.empresa,
    initials: initials(c.empresa),
    contactName: c.nome,
    email: c.email,
    projects: c.quantidadeProjetos,
    revenue: c.valorTotal,
    status: mapClientStatus(c.status),
    lastContact: formatDateBR(c.ultimoContato),
    assignee: { name: c.responsavel, initials: initials(c.responsavel) },
  }));

  const tasks = getTasks()
    .filter((t) => t.status !== "concluida")
    .slice(0, 5);

  const activities = getTimelineEvents()
    .filter((e) => e.clienteId)
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      title: e.titulo,
      description: e.descricao,
      time: formatDateBR(e.data),
    }));

  return {
    totalClients: clients.length,
    stats: [
      {
        id: "total",
        title: "Total de clientes",
        value: String(clients.length),
        trend: `${dashboard.projetosAtivos} projetos ativos`,
        trendDirection: "up" as const,
      },
      {
        id: "revenue",
        title: "Receita ativa",
        value: formatBRL(totalRevenue),
        trend: `${formatBRL(dashboard.receitaMes)} este mês`,
        trendDirection: "up" as const,
      },
      {
        id: "avg-projects",
        title: "Média de projetos",
        value: avgProjects.replace(".", ","),
        trend: `${dashboard.projetosAtivos} ativos`,
        trendDirection: "up" as const,
      },
      {
        id: "new",
        title: "Novos clientes",
        value: String(clientRows.filter((c) => c.lastContact.includes("Hoje") || c.lastContact === "Hoje").length || Math.min(clients.length, 3)),
        trendDirection: "neutral" as const,
      },
    ],
    clients: clientRows,
    funnel: (() => {
      const total = clientRows.length || 1;
      const withProjects = clientRows.filter((c) => c.projects > 0).length;
      const withRevenue = clientRows.filter((c) => c.revenue > 0).length;
      const novos = clientRows.filter((c) => c.lastContact === "Hoje" || c.lastContact.includes("Hoje")).length;
      return [
        { id: "total", label: "Cadastrados", value: clientRows.length, percent: 100, fill: "#fafafa" },
        { id: "novos", label: "Novos", value: novos, percent: Math.round((novos / total) * 100), fill: "#d4d4d8" },
        { id: "projetos", label: "Com projeto", value: withProjects, percent: Math.round((withProjects / total) * 100), fill: "#a1a1aa" },
        { id: "receita", label: "Com receita", value: withRevenue, percent: Math.round((withRevenue / total) * 100), fill: "#71717a" },
        { id: "base", label: "Base ativa", value: Math.max(withProjects, withRevenue), percent: Math.round((Math.max(withProjects, withRevenue) / total) * 100), fill: "#52525b" },
      ];
    })(),
    statusSegments: (() => {
      const total = clientRows.length;
      const withProjects = clientRows.filter((c) => c.projects > 0).length;
      const withRevenue = clientRows.filter((c) => c.revenue > 0).length;
      const onlyCadastro = Math.max(0, total - Math.max(withProjects, withRevenue));
      const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
      return [
        { id: "projetos", label: "Com projeto", value: withProjects, percent: pct(withProjects), fill: "#fafafa" },
        { id: "receita", label: "Com receita", value: withRevenue, percent: pct(withRevenue), fill: "#a1a1aa" },
        { id: "cadastro", label: "Só cadastro", value: onlyCadastro, percent: pct(onlyCadastro), fill: "#52525b" },
      ];
    })(),
    activities,
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.titulo,
      priority: t.prioridade === "urgente" ? "alta" : t.prioridade === "media" ? "media" : "baixa",
      time: formatDateBR(t.prazo),
      completed: false,
    })),
  };
}

export function buildProjetosData(): ProjetosData {
  const projects = getProjects();
  const clients = getClients();
  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const users = getUsers().filter((u) => u.role !== "cliente");

  const active = projects.filter((p) => p.status === "em-andamento").length;
  const planning = projects.filter((p) => p.status === "planejamento").length;
  const done = projects.filter((p) => p.status === "concluido").length;
  const late = projects.filter(
    (p) => p.status !== "concluido" && p.status !== "cancelado" && p.prazo < new Date().toISOString().split("T")[0]
  ).length;
  const rate = projects.length > 0 ? Math.round((done / projects.length) * 100) : 0;

  const mapped: Project[] = projects.map((p, i) => {
    const client = clientMap.get(p.clienteId);
    const stageInfo = mapProjectStage(p.status);
    const responsavelUser =
      users.find((u) => u.nome === p.responsavel) ??
      users.find((u) => u.initials === initials(p.responsavel));

    const extraUsers = users
      .filter((u) => u.id !== responsavelUser?.id)
      .slice(i % 3, (i % 3) + 2);

    const team: Project["team"] = [
      {
        id: responsavelUser?.id ?? `lead-${p.id}`,
        email: responsavelUser?.email,
        initials: initials(p.responsavel),
        name: p.responsavel,
      },
      ...extraUsers.map((u) => ({
        id: u.id,
        email: u.email,
        initials: u.initials,
        name: u.nome,
      })),
    ];

    const leadUser = responsavelUser ?? extraUsers[0];
    const lead: Project["lead"] = {
      id: leadUser?.id ?? `lead-${p.id}`,
      email: leadUser?.email,
      initials: initials(p.responsavel),
      name: p.responsavel,
    };

    return {
      id: p.id,
      name: p.nome,
      client: client?.empresa ?? "—",
      category: mapProjectCategory(p.status),
      stage: stageInfo.stage,
      stageLabel: stageInfo.label,
      progress: p.progresso,
      dueDate: formatDateBR(p.prazo),
      startDate: formatDateBR(p.dataInicio),
      completedDate: p.status === "concluido" ? formatDateBR(p.prazo) : undefined,
      team,
      lead,
      priority: p.prioridade === "urgente" ? "alta" : p.prioridade === "media" ? "media" : "baixa",
    };
  });

  const emAndamento = mapped.filter((p) => p.category === "em-andamento").map((p) => p.id);
  const planejamento = mapped.filter((p) => p.category === "planejamento").map((p) => p.id);
  const concluidos = mapped.filter((p) => p.category === "concluido").map((p) => p.id);

  return {
    stats: [
      { id: "active", title: "Projetos ativos", value: String(active + planning), icon: "FolderKanban", trend: `▲ ${planning} em planejamento`, trendDirection: "up" },
      { id: "running", title: "Em andamento", value: String(active), icon: "Play", trend: `▲ ${active}`, trendDirection: "up" },
      { id: "done", title: "Concluídos", value: String(done), icon: "CheckCircle2", trend: `▲ ${done}`, trendDirection: "up" },
      { id: "late", title: "Atrasados", value: String(late), icon: "AlertTriangle", trend: late > 0 ? `▼ ${late}` : "Nenhum", trendDirection: late > 0 ? "down" : "neutral" },
      { id: "rate", title: "Taxa de conclusão", value: `${rate}%`, icon: "TrendingUp", trend: `${done}/${projects.length}`, trendDirection: "up" },
    ],
    projects: mapped,
    sections: [
      { id: "em-andamento", title: "Em andamento", view: "grid", projectIds: emAndamento },
      { id: "planejamento", title: "Planejamento", view: "list", projectIds: planejamento },
      { id: "concluido", title: "Concluídos", view: "completed", projectIds: concluidos },
    ],
  };
}

export function buildContratosData(): ContratosData {
  const contracts = getContracts();
  const clients = getClients();
  const projects = getProjects();
  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const mapped: Contract[] = contracts.map((c) => {
    const client = clientMap.get(c.clienteId);
    const project = projectMap.get(c.projetoId);
    const resp = project?.responsavel ?? "—";

    return {
      id: c.id,
      number: c.numeroContrato,
      title: project?.nome ?? c.numeroContrato,
      type: "Prestação de serviços",
      client: client?.nome ?? "—",
      company: client?.empresa ?? "—",
      document: client?.email ?? "—",
      status: mapContractStatus(c.status),
      statusLabel: CONTRACT_STATUS_LABELS[c.status],
      value: c.valor,
      valueFormatted: formatBRL(c.valor),
      responsible: { initials: initials(resp), name: resp },
      createdBy: { initials: initials(resp), name: resp },
      createdAt: formatDateBR(c.dataCriacao),
      sentAt: c.status !== "rascunho" ? formatDateBR(c.dataCriacao) : undefined,
      signedAt: c.dataAssinatura ? formatDateBR(c.dataAssinatura) : undefined,
      updatedAt: formatDateBR(c.dataAssinatura ?? c.dataCriacao),
      phone: client?.telefone ?? "—",
      email: client?.email ?? "—",
      signaturesCount: c.assinado ? 1 : 0,
      signaturesTotal: 1,
    };
  });

  const assinados = contracts.filter((c) => c.status === "assinado" || c.status === "finalizado").length;
  const aguardando = contracts.filter((c) => c.status === "aguardando-assinatura").length;
  const valorTotal = contracts.reduce((s, c) => s + c.valor, 0);

  return {
    stats: [
      { id: "total", title: "Total de contratos", value: String(contracts.length), icon: "FileText", subtitle: formatBRL(valorTotal) },
      { id: "signed", title: "Assinados", value: String(assinados), icon: "CheckCircle2", subtitle: `${Math.round((assinados / (contracts.length || 1)) * 100)}%` },
      { id: "pending", title: "Aguardando", value: String(aguardando), icon: "Clock", subtitleDirection: aguardando > 0 ? "warning" : "neutral" },
      { id: "value", title: "Valor total", value: formatBRL(valorTotal), icon: "Wallet" },
    ],
    contracts: mapped,
    templates: [
      { id: "tpl-1", name: "Prestação de Serviços", description: "Contrato padrão de serviços digitais", icon: "FileText" },
      { id: "tpl-2", name: "Manutenção Mensal", description: "Contrato recorrente de suporte", icon: "RefreshCw" },
      { id: "tpl-3", name: "Projeto Fechado", description: "Escopo fixo com entregáveis", icon: "Package" },
    ],
  };
}

export function buildFinanceiroData(): FinanceiroData {
  const finance = getFinanceMovements();
  const clients = getClients();
  const projects = getProjects();
  const contracts = getContracts();
  const dashboard = getDashboard();
  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const contractMap = new Map(contracts.map((c) => [c.id, c]));

  const receitas = finance.filter((f) => f.tipo === "receita");
  const despesas = finance.filter((f) => f.tipo === "despesa");
  const receitasPagas = receitas.filter((f) => f.status === "pago");
  const pendentes = receitas.filter((f) => f.status === "pendente" || f.status === "atrasado");

  const movements = finance.map((f) => mapFinanceMovement(f, clientMap, projectMap, contractMap));

  const segmentColors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
  const segments = ["Receitas", "Despesas", "Pendentes", "Transferências"];
  const segmentValues = [
    receitasPagas.reduce((s, f) => s + f.valor, 0),
    despesas.reduce((s, f) => s + f.valor, 0),
    pendentes.reduce((s, f) => s + f.valor, 0),
    finance.filter((f) => f.tipo === "transferencia").reduce((s, f) => s + f.valor, 0),
  ];
  const segmentTotal = segmentValues.reduce((s, v) => s + v, 0) || 1;

  return {
    stats: [
      { id: "revenue", title: "Receita total", value: formatBRL(dashboard.receitaTotal), icon: "TrendingUp", iconTone: "green", subtitle: formatBRL(dashboard.receitaMes) + " este mês", subtitleDirection: "up" },
      { id: "expenses", title: "Despesas", value: formatBRL(dashboard.despesasMes), icon: "TrendingDown", iconTone: "red", subtitle: "Mês atual", subtitleDirection: "down" },
      { id: "profit", title: "Lucro", value: formatBRL(dashboard.lucroMes), icon: "Wallet", iconTone: "blue", subtitle: `${dashboard.margemMedia}% margem`, subtitleDirection: dashboard.lucroMes >= 0 ? "up" : "down" },
      { id: "pending", title: "A receber", value: formatBRL(pendentes.reduce((s, f) => s + f.valor, 0)), icon: "Clock", iconTone: "yellow", subtitle: `${pendentes.length} pendências`, subtitleDirection: "neutral" },
    ],
    flow: segments.map((label, i) => ({
      id: `seg-${i}`,
      label,
      value: segmentValues[i],
      valueFormatted: formatBRL(segmentValues[i]),
      color: segmentColors[i],
    })),
    movements,
    cashSummary: [
      { id: "balance", label: "Saldo", value: formatBRL(dashboard.receitaTotal - getFinanceMovements().filter((f) => f.tipo === "despesa").reduce((s, f) => s + f.valor, 0)), tone: "green" },
      { id: "receivable", label: "A receber", value: formatBRL(pendentes.reduce((s, f) => s + f.valor, 0)), tone: "yellow" },
      { id: "payable", label: "A pagar", value: formatBRL(despesas.filter((f) => f.status === "pendente").reduce((s, f) => s + f.valor, 0)), tone: "red" },
    ],
    upcomingPayments: pendentes.slice(0, 5).map((f, i) => {
      const contract = f.contratoId ? contractMap.get(f.contratoId) : undefined;
      const client = clientMap.get(f.clienteId);
      const [y, m, d] = f.data.split("-");
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      return {
        id: f.id,
        day: d,
        month: months[Number(m) - 1],
        cliente: client?.empresa ?? "—",
        contratoNumero: contract?.numeroContrato ?? "—",
        valor: formatBRL(f.valor),
        formaPagamento: f.formaPagamento as FinancialMovement["formaPagamento"],
      };
    }),
    revenueDistribution: segments.map((label, i) => ({
      id: `dist-${i}`,
      label,
      percentage: Math.round((segmentValues[i] / segmentTotal) * 100),
    })),
    relatedContracts: contracts.slice(0, 6).map((c) => {
      const client = clientMap.get(c.clienteId);
      const paid = finance.filter((f) => f.contratoId === c.id && f.status === "pago").reduce((s, f) => s + f.valor, 0);
      const pct = c.valor > 0 ? Math.round((paid / c.valor) * 100) : 0;
      return {
        id: c.id,
        contratoId: c.id,
        numero: c.numeroContrato,
        cliente: client?.empresa ?? "—",
        valor: formatBRL(c.valor),
        percentualRecebido: pct,
        status: pct >= 100 ? "recebido" : pct > 0 ? "parcial" : "pendente",
        statusLabel: pct >= 100 ? "Recebido" : pct > 0 ? "Parcial" : "Pendente",
      };
    }),
  };
}

export function buildReunioesData(): ReunioesData {
  const meetings = getMeetings();
  const clients = getClients();
  const projects = getProjects();
  const dashboard = getDashboard();
  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const allMeetings = meetings.map((m, i) => buildMeetingRow(m, clientMap, projectMap, i));
  const myMeetings = allMeetings.filter((m) => m.isMine);
  const recentMeetings = allMeetings.filter((m) => m.status === "concluida").slice(0, 8);
  const upcoming = meetings
    .filter((m) => m.status === "agendada")
    .slice(0, 5)
    .map((m) => ({
      id: m.id,
      title: m.titulo,
      dayLabel: formatDateBR(m.data),
      time: m.inicio,
    }));

  const timelineMeetings = meetings
    .sort((a, b) => (a.data > b.data ? 1 : -1))
    .slice(0, 12)
    .map((m, i) => buildMeetingRow(m, clientMap, projectMap, i));

  return {
    stats: [
      { id: "today", title: "Reuniões hoje", value: String(dashboard.reunioesHoje), icon: "Video" },
      { id: "week", title: "Esta semana", value: String(dashboard.reunioesSemana), icon: "Calendar" },
      { id: "done", title: "Concluídas", value: String(meetings.filter((m) => m.status === "concluida").length), icon: "CheckCircle2" },
      { id: "scheduled", title: "Agendadas", value: String(meetings.filter((m) => m.status === "agendada").length), icon: "Clock" },
    ],
    timelineMeetings,
    allMeetings,
    myMeetings,
    recentMeetings,
    upcoming,
    quickNotes: getTimelineEvents()
      .filter((e) => e.tipo === "reuniao-realizada")
      .slice(0, 4)
      .map((e) => ({ id: e.id, text: e.descricao, time: formatDateBR(e.data) })),
    selectedMeetingId: meetings[0]?.id ?? "",
  };
}

export function buildDashboardData(): DashboardData {
  const dashboard = getDashboard();
  const projects = getProjects();
  const clients = getClients();
  const meetings = getMeetings();
  const tasks = getTasks();
  const finance = getFinanceMovements();
  const contracts = getContracts();
  const briefingsList = getBriefings();

  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const pendingPayments = finance.filter(
    (f) => f.tipo === "receita" && (f.status === "pendente" || f.status === "atrasado")
  );
  const overdueTasks = tasks.filter(
    (t) => t.status !== "concluida" && t.prazo < new Date().toISOString().split("T")[0]
  );

  const revenueByDay = finance
    .filter((f) => f.tipo === "receita" && f.status === "pago")
    .reduce<Record<number, number>>((acc, f) => {
      const day = new Date(f.data).getDate();
      acc[day] = (acc[day] ?? 0) + f.valor;
      return acc;
    }, {});

  const revenueData = Object.entries(revenueByDay)
    .map(([dia, valor]) => ({ dia: Number(dia), valor }))
    .sort((a, b) => a.dia - b.dia)
    .slice(0, 13);

  const weekBuckets = projects.reduce<Record<string, number>>((acc, p, i) => {
    const week = `S${(i % 7) + 1}`;
    acc[week] = (acc[week] ?? 0) + 1;
    return acc;
  }, {});

  const nextMeeting = meetings
    .filter((m) => m.status === "agendada")
    .sort((a, b) => (a.data > b.data ? 1 : -1))[0];

  const activeProjects = projects
    .filter((p) => p.status === "em-andamento" || p.status === "planejamento")
    .slice(0, 5);

  const stageColors: Record<string, DashboardData["projects"][0]["stageColor"]> = {
    planejamento: "green",
    "em-andamento": "blue",
    pausado: "orange",
    concluido: "purple",
    cancelado: "red",
  };

  return {
    user: dashboard.user,
    notifications: dashboard.notificacoesNaoLidas,
    kpis: [
      {
        id: "meetings",
        title: "Reuniões hoje",
        value: dashboard.reunioesHoje,
        subtitle: nextMeeting ? `Próxima: ${nextMeeting.inicio}` : "Sem reuniões",
        icon: "Video",
        color: "blue",
        trend: { value: `${dashboard.reunioesSemana} na semana`, direction: "neutral" },
      },
      {
        id: "clients",
        title: "Clientes ativos",
        value: dashboard.clientesAtivos,
        subtitle: `${dashboard.totalClientes} no total`,
        icon: "Users",
        color: "green",
        trend: { value: `${dashboard.totalClientes}`, direction: "up" },
      },
      {
        id: "proposals",
        title: "Contratos aguardando",
        value: dashboard.contratosAguardandoAssinatura,
        subtitle: `${dashboard.contratosAtivos} ativos`,
        icon: "FileText",
        color: "orange",
        trend: { value: String(dashboard.contratosAtivos), direction: "neutral" },
      },
      {
        id: "payment",
        title: "Pagamento pendente",
        value: pendingPayments.length,
        subtitle: formatBRL(pendingPayments.reduce((s, f) => s + f.valor, 0)),
        icon: "Wallet",
        color: "red",
        trend: { value: `${finance.filter((f) => f.status === "atrasado").length} atrasada(s)`, direction: "down" },
      },
      {
        id: "deliveries",
        title: "Tasks pendentes",
        value: dashboard.tasksPendentes,
        subtitle: `${dashboard.tasksConcluidas} concluídas`,
        icon: "Package",
        color: "purple",
        trend: { value: `${overdueTasks.length} vencidas`, direction: overdueTasks.length > 0 ? "down" : "up" },
      },
    ],
    revenue: {
      total: dashboard.receitaMes,
      trend: `${dashboard.margemMedia}% margem`,
      trendDirection: dashboard.lucroMes >= 0 ? "up" : "down",
      period: "Este mês",
      data: revenueData.length > 0 ? revenueData : [{ dia: 1, valor: dashboard.receitaMes }],
    },
    projectsChart: {
      total: dashboard.projetosAtivos,
      trend: `${dashboard.projetosConcluidos} concluídos`,
      trendDirection: "up",
      data: Object.entries(weekBuckets).map(([semana, quantidade]) => ({ semana, quantidade })),
    },
    pending: [
      { id: "1", title: "Briefings pendentes", count: briefingsList.length, color: "orange" },
      { id: "2", title: "Contratos para assinar", count: dashboard.contratosAguardandoAssinatura, color: "purple" },
      { id: "3", title: "Pagamentos atrasados", count: finance.filter((f) => f.status === "atrasado").length, color: "red" },
      { id: "4", title: "Tasks vencidas", count: overdueTasks.length, color: "red" },
    ],
    agenda: meetings
      .filter((m) => m.status === "agendada")
      .slice(0, 4)
      .map((m, i) => {
        const client = clientMap.get(m.clienteId);
        const project = projects.find((p) => p.id === m.projetoId);
        const colors: DashboardData["agenda"][0]["color"][] = ["blue", "orange", "green", "purple"];
        return {
          id: m.id,
          time: m.inicio,
          title: m.titulo,
          project: project?.nome ?? "—",
          client: client?.empresa ?? "—",
          color: colors[i % colors.length],
        };
      }),
    tasks: tasks
      .filter((t) => t.status !== "concluida")
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        title: t.titulo,
        priority: t.prioridade === "urgente" || t.prioridade === "alta" ? "alta" : t.prioridade === "media" ? "media" : "baixa",
        completed: false,
      })),
    notes: getTimelineEvents()
      .slice(0, 3)
      .map((e) => ({
        id: e.id,
        content: e.descricao,
        createdAt: formatDateBR(e.data),
      })),
    projects: activeProjects.map((p) => {
      const client = clientMap.get(p.clienteId);
      return {
        id: p.id,
        name: p.nome,
        client: client?.empresa ?? "—",
        stage: mapProjectStage(p.status).label,
        stageColor: stageColors[p.status] ?? "blue",
        progress: p.progresso,
        dueDate: formatDateBR(p.prazo),
        assignee: { name: p.responsavel, initials: initials(p.responsavel) },
      };
    }),
    bottomMetrics: [
      { id: "clients", label: "Clientes totais", value: String(dashboard.totalClientes), trend: { value: `${dashboard.clientesAtivos} ativos`, direction: "up" } },
      { id: "active", label: "Projetos ativos", value: String(dashboard.projetosAtivos), trend: { value: `${dashboard.projetosConcluidos} concluídos`, direction: "up" } },
      { id: "done", label: "Projetos finalizados", value: String(dashboard.projetosConcluidos), trend: { value: `${dashboard.margemMedia}% margem`, direction: "up" } },
      { id: "rate", label: "Taxa de conclusão", value: `${projects.length > 0 ? Math.round((dashboard.projetosConcluidos / projects.length) * 100) : 0}%`, trend: { value: `${dashboard.tasksConcluidas} tasks`, direction: "neutral" } },
      { id: "satisfaction", label: "Contratos ativos", value: String(dashboard.contratosAtivos), trend: { value: formatBRL(dashboard.receitaMes), direction: "neutral" } },
    ],
  };
}

export function buildRelatoriosData(periodLabel: string): RelatoriosData {
  const reports = getReports();
  const clients = getClients();
  const projects = getProjects();
  const finance = getFinanceMovements();
  const dashboard = getDashboard();

  const revenueComparison = reports.receitasMensal.map((r, i) => ({
    label: r.mes,
    receitas: r.valor,
    despesas: reports.despesasMensal[i]?.valor ?? 0,
  }));

  const totalRevenue = reports.faturamentoMensal.reduce((s, m) => s + m.valor, 0);
  const segmentTotal = totalRevenue || 1;

  return {
    periodLabel,
    stats: [
      { id: "revenue", title: "Faturamento", value: formatBRL(totalRevenue), icon: "TrendingUp", comparison: formatBRL(dashboard.receitaMes), comparisonDirection: "up", sparkline: reports.faturamentoMensal.map((m) => m.valor) },
      { id: "profit", title: "Lucro", value: formatBRL(reports.lucroMensal.reduce((s, m) => s + m.valor, 0)), icon: "Wallet", comparison: `${reports.margemMedia}%`, comparisonDirection: "up", sparkline: reports.lucroMensal.map((m) => m.valor) },
      { id: "clients", title: "Novos clientes", value: String(reports.novosClientesMensal.reduce((s, m) => s + m.quantidade, 0)), icon: "Users", comparison: `${dashboard.clientesAtivos} ativos`, comparisonDirection: "up", sparkline: reports.novosClientesMensal.map((m) => m.quantidade) },
      { id: "projects", title: "Projetos entregues", value: String(reports.projetosEntreguesMensal.reduce((s, m) => s + m.quantidade, 0)), icon: "FolderKanban", comparison: `${reports.tempoMedioEntrega} dias médio`, comparisonDirection: "neutral", sparkline: reports.projetosEntreguesMensal.map((m) => m.quantidade) },
    ],
    revenueOverTime: {
      diario: reports.faturamentoMensal.slice(0, 7).map((m) => ({ label: m.mes, value: m.valor })),
      semanal: reports.faturamentoMensal.slice(0, 4).map((m) => ({ label: m.mes, value: m.valor })),
      mensal: reports.faturamentoMensal.map((m) => ({ label: m.mes, value: m.valor })),
      anual: [{ label: "2024", value: totalRevenue }],
    },
    revenueComparison,
    revenueDistribution: [
      { id: "services", label: "Serviços", value: Math.round(totalRevenue * 0.6), percentage: 60, fill: "#3b82f6" },
      { id: "recurring", label: "Recorrente", value: Math.round(totalRevenue * 0.25), percentage: 25, fill: "#22c55e" },
      { id: "other", label: "Outros", value: Math.round(totalRevenue * 0.15), percentage: 15, fill: "#f59e0b" },
    ],
    projectsPerformance: projects.slice(0, 8).map((p) => {
      const client = clients.find((c) => c.id === p.clienteId);
      const custo = Math.round(p.valor * 0.35);
      const lucro = p.valor - custo;
      return {
        id: p.id,
        projeto: p.nome,
        projetoId: p.id,
        cliente: client?.empresa ?? "—",
        faturamento: formatBRL(p.valor),
        custo: formatBRL(custo),
        lucro: formatBRL(lucro),
        margem: p.valor > 0 ? Math.round((lucro / p.valor) * 100) : 0,
        status: p.status === "concluido" ? "concluido" : p.status === "planejamento" ? "planejamento" : "em-andamento",
        statusLabel: mapProjectStage(p.status).label,
      };
    }),
    salesFunnel: [
      { id: "leads", label: "Prospectos", value: clients.filter((c) => c.status === "prospecto").length, width: 100, fill: "#3b82f6" },
      { id: "active", label: "Ativos", value: dashboard.clientesAtivos, width: 80, fill: "#22c55e" },
      { id: "projects", label: "Projetos", value: dashboard.projetosAtivos, width: 60, fill: "#8b5cf6" },
      { id: "contracts", label: "Contratos", value: dashboard.contratosAtivos, width: 40, fill: "#f59e0b" },
    ],
    productivityMetrics: [
      { id: "delivery", label: "Tempo médio de entrega", value: `${reports.tempoMedioEntrega} dias`, icon: "Clock" },
      { id: "conversion", label: "Taxa de conversão", value: `${reports.conversaoMensal.at(-1)?.taxa ?? 0}%`, icon: "TrendingUp" },
      { id: "margin", label: "Margem média", value: `${reports.margemMedia}%`, icon: "Percent" },
      { id: "tasks", label: "Tasks concluídas", value: String(dashboard.tasksConcluidas), icon: "CheckCircle2" },
    ],
    topClients: [...clients]
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 5)
      .map((c, i) => ({
        id: c.id,
        rank: i + 1,
        name: c.empresa,
        revenue: formatBRL(c.valorTotal),
        projects: c.quantidadeProjetos,
        lastProject: getProjects().find((p) => p.clienteId === c.id)?.nome ?? "—",
      })),
    recentActivity: getTimelineEvents()
      .slice(0, 6)
      .map((e) => ({
        id: e.id,
        title: e.titulo,
        description: e.descricao,
        date: formatDateBR(e.data),
        icon: "Activity",
      })),
  };
}

export function buildRelatoriosDataset(): RelatoriosDataset {
  return {
    "maio-2024": buildRelatoriosData("Maio 2024"),
    "abril-2024": buildRelatoriosData("Abril 2024"),
    "marco-2024": buildRelatoriosData("Março 2024"),
  };
}
