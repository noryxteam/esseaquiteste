import type {
  Action,
  AgendaItem,
  Client,
  DashboardMetrics,
  FileItem,
  Negotiation,
  Project,
  TimelineEvent,
} from "./types";

export const metrics: DashboardMetrics = {
  monthlyRevenue: 45000,
  revenueChange: 12,
  pipeline: 120000,
  pipelineCount: 4,
  activeProjects: 8,
  projectsAtRisk: 2,
  pendingPayments: 3,
  pendingPaymentsValue: 18500,
};

export const priorities: Action[] = [
  {
    id: "act-1",
    title: "Enviar proposta revisada",
    context: "Empresa ABC",
    due: "vence hoje",
    priority: "urgente",
    module: "Comercial",
    link: "/comercial/neg-1",
  },
  {
    id: "act-2",
    title: "Cobrar material pendente",
    context: "Site Institucional — Empresa ABC",
    due: "há 5 dias",
    priority: "urgente",
    module: "Projetos",
    link: "/projetos/proj-1",
  },
  {
    id: "act-3",
    title: "Preparar kickoff",
    context: "Startup Tech",
    due: "sex, 10/07",
    priority: "atencao",
    module: "Projetos",
    link: "/projetos/proj-2",
  },
];

export const allActions: Action[] = [
  ...priorities,
  {
    id: "act-4",
    title: "Registrar assinatura do contrato",
    context: "Landing Page XYZ",
    due: "vence amanhã",
    priority: "atencao",
    module: "Comercial",
    link: "/comercial/neg-2",
  },
  {
    id: "act-5",
    title: "Follow-up proposta",
    context: "Startup Tech",
    due: "sem resposta há 7 dias",
    priority: "informativo",
    module: "Comercial",
    link: "/comercial/neg-3",
  },
  {
    id: "act-6",
    title: "Revisar homepage",
    context: "Site XYZ",
    due: "vence amanhã",
    priority: "atencao",
    module: "Projetos",
    link: "/projetos/proj-1",
  },
];

export const agenda: AgendaItem[] = [
  {
    id: "ag-1",
    time: "10:00",
    title: "Kickoff — Site Empresa ABC",
    context: "Empresa ABC",
    link: "/projetos/proj-1",
  },
  {
    id: "ag-2",
    time: "14:00",
    title: "Revisão interna — Landing Page",
    context: "Landing Page XYZ",
    link: "/projetos/proj-2",
  },
  {
    id: "ag-3",
    time: "16:30",
    title: "Call comercial — Startup Tech",
    context: "Startup Tech",
    link: "/comercial/neg-3",
  },
];

export const recentActivity: TimelineEvent[] = [
  {
    id: "ra-1",
    text: "Material pendente há 5 dias — Site Institucional",
    timestamp: "2026-07-06T09:00:00",
    relative: "há 2h",
    category: "projetos",
    link: "/projetos/proj-1",
  },
  {
    id: "ra-2",
    text: "Proposta v2 enviada — Empresa ABC",
    timestamp: "2026-07-06T07:00:00",
    relative: "há 4h",
    category: "comercial",
    link: "/comercial/neg-1",
  },
  {
    id: "ra-3",
    text: "Cliente assinou contrato — Landing Page XYZ",
    timestamp: "2026-07-05T18:00:00",
    relative: "ontem",
    category: "comercial",
    link: "/comercial/neg-2",
  },
  {
    id: "ra-4",
    text: "Pagamento inicial recebido — R$ 4.000",
    timestamp: "2026-07-04T14:00:00",
    relative: "há 2 dias",
    category: "financeiro",
    link: "/financeiro",
  },
  {
    id: "ra-5",
    text: "Kickoff realizado — Startup Tech",
    timestamp: "2026-07-03T10:00:00",
    relative: "há 3 dias",
    category: "projetos",
    link: "/projetos/proj-2",
  },
];

const defaultScope = {
  objective: "Site institucional moderno para fortalecer presença digital",
  deliverables: [
    "Homepage responsiva",
    "Páginas: Sobre, Serviços, Contato",
    "Formulário de contato integrado",
    "SEO básico",
  ],
  exclusions: [
    "Blog",
    "E-commerce",
    "Manutenção pós-entrega (exceto garantia)",
  ],
  estimatedDeadline: "45 dias",
  internalValue: 8000,
};

export const clients: Client[] = [
  {
    id: "cli-1",
    name: "Empresa ABC",
    contact: "João Silva",
    phone: "(11) 99999-0001",
    email: "joao@empresaabc.com",
    status: "ativo",
    origin: "Indicação",
    notes:
      "Cliente estratégico. Prefere comunicação por WhatsApp. Decisor: João (CEO).",
    nextStep: "Cobrar textos da página Sobre",
    nextStepCta: "Abrir projeto",
    nextStepLink: "/projetos/proj-1",
    activeProjects: 2,
    activeNegotiationId: "neg-1",
    openValue: 8000,
  },
  {
    id: "cli-2",
    name: "Startup Tech",
    contact: "Maria Santos",
    phone: "(11) 98888-0002",
    email: "maria@startuptech.io",
    status: "lead",
    origin: "LinkedIn",
    notes: "Interessada em landing page para captação de leads.",
    nextStep: "Qualificar lead",
    nextStepCta: "Qualificar",
    nextStepLink: "/comercial/neg-3",
    activeProjects: 1,
    activeNegotiationId: "neg-3",
    openValue: 5500,
  },
  {
    id: "cli-3",
    name: "Cliente Novo",
    contact: "—",
    phone: "",
    email: "",
    status: "lead",
    notes: "",
    nextStep: "Cadastrar informações de contato",
    nextStepCta: "Editar cliente",
    nextStepLink: "/clientes/cli-3",
    activeProjects: 0,
    openValue: 0,
    isEmpty: true,
  },
  {
    id: "cli-4",
    name: "Inativo Corp",
    contact: "Pedro Lima",
    phone: "(21) 97777-0003",
    email: "pedro@inativocorp.com",
    status: "inativo",
    notes: "Projeto concluído em 2025. Possível reativação Q3.",
    nextStep: "Nova negociação",
    nextStepCta: "Nova negociação",
    nextStepLink: "/comercial",
    activeProjects: 0,
    openValue: 0,
  },
];

export const negotiations: Negotiation[] = [
  {
    id: "neg-1",
    clientId: "cli-1",
    title: "Site Institucional",
    serviceType: "Site institucional",
    status: "proposta_enviada",
    value: 8000,
    validUntil: "15/07/2026",
    sentDaysAgo: 3,
    revisionsUsed: 0,
    revisionsTotal: 2,
    nextStep: "Registrar resposta do cliente ou enviar follow-up",
    nextStepCta: "Registrar resposta",
    scope: defaultScope,
    proposals: [
      { version: 1, status: "enviada", sentAt: "28/06/2026", value: 7500 },
      { version: 2, status: "enviada", sentAt: "03/07/2026", value: 8000 },
    ],
    contract: { status: "pendente" },
    payments: [
      { id: "pay-1", label: "Parcela inicial", amount: 4000, status: "pendente" },
      { id: "pay-2", label: "Parcela final", amount: 4000, status: "pendente" },
    ],
    interactions: [
      { id: "int-1", type: "Ligação", summary: "Alinhou escopo e prazo", date: "25/06/2026" },
      { id: "int-2", type: "WhatsApp", summary: "Cliente pediu revisão de valor", date: "01/07/2026" },
    ],
    timeline: [
      { id: "nt-1", text: "Proposta v2 enviada — R$ 8.000", timestamp: "2026-07-03", relative: "há 3 dias", category: "comercial" },
      { id: "nt-2", text: "Escopo registrado — Site institucional", timestamp: "2026-06-25", relative: "há 11 dias", category: "comercial" },
      { id: "nt-3", text: "Negociação aberta", timestamp: "2026-06-20", relative: "há 16 dias", category: "comercial" },
    ],
  },
  {
    id: "neg-2",
    clientId: "cli-1",
    title: "Landing Page Black Friday",
    serviceType: "Landing page",
    status: "aguardando_pagamento",
    value: 4500,
    validUntil: "20/07/2026",
    revisionsUsed: 0,
    revisionsTotal: 1,
    nextStep: "Registrar pagamento inicial",
    nextStepCta: "Registrar pagamento",
    scope: {
      objective: "Landing page para campanha Black Friday",
      deliverables: ["LP responsiva", "Integração formulário", "Pixel Meta Ads"],
      exclusions: ["Tráfego pago", "Copywriting"],
      estimatedDeadline: "15 dias",
      internalValue: 4500,
    },
    proposals: [{ version: 1, status: "aprovada", sentAt: "01/07/2026", value: 4500 }],
    contract: { status: "assinado", sentAt: "02/07/2026", signedAt: "05/07/2026" },
    payments: [
      { id: "pay-3", label: "Parcela inicial", amount: 2250, status: "pendente", dueDate: "08/07/2026" },
      { id: "pay-4", label: "Parcela final", amount: 2250, status: "pendente", dueDate: "—" },
    ],
    interactions: [],
    timeline: [
      { id: "nt-4", text: "Contrato assinado", timestamp: "2026-07-05", relative: "ontem", category: "comercial" },
      { id: "nt-5", text: "Proposta aprovada", timestamp: "2026-07-01", relative: "há 5 dias", category: "comercial" },
    ],
    showHandoff: true,
  },
  {
    id: "neg-3",
    clientId: "cli-2",
    title: "Landing Page Captação",
    serviceType: "Landing page",
    status: "aberta",
    value: 5500,
    revisionsUsed: 0,
    revisionsTotal: 2,
    nextStep: "Qualificar lead ou agendar reunião de descoberta",
    nextStepCta: "Qualificar lead",
    interactions: [],
    proposals: [],
    payments: [],
    timeline: [
      { id: "nt-6", text: "Negociação aberta", timestamp: "2026-07-01", relative: "há 5 dias", category: "comercial" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    clientId: "cli-1",
    negotiationId: "neg-1",
    name: "Site Institucional",
    type: "Site institucional",
    status: "em_andamento",
    progress: 65,
    startDate: "01/06/2026",
    deadline: "15/07/2026",
    daysRemaining: 9,
    blockType: "cliente",
    blockDescription: "textos da página Sobre",
    blockDays: 5,
    nextStep: "Cobrar material OU avançar: Desenvolvimento Home",
    nextStepCta: "Registrar material",
    scopeSnapshot: defaultScope,
    materials: [
      { id: "mat-1", name: "Textos página Sobre", status: "pendente" },
      { id: "mat-2", name: "Logo em vetor", status: "recebido", receivedAt: "28/05/2026" },
      { id: "mat-3", name: "Fotos equipe", status: "recebido", receivedAt: "30/05/2026" },
    ],
    accessNotes: ["Hospedagem: aguardando credenciais", "Domínio: registrado pelo cliente"],
    kickoffNotes: "Kickoff realizado em 02/06. Cliente enviará textos até 05/06.",
    checklist: [
      { id: "ck-1", label: "Wireframe aprovado", done: true },
      { id: "ck-2", label: "Design Homepage", done: true },
      { id: "ck-3", label: "Desenvolvimento Home", done: false, highlighted: true },
      { id: "ck-4", label: "Página Sobre", done: false },
      { id: "ck-5", label: "Página Serviços", done: false },
      { id: "ck-6", label: "Página Contato", done: false },
      { id: "ck-7", label: "QA mobile", done: false },
      { id: "ck-8", label: "SEO básico", done: false },
    ],
    milestones: [
      { id: "ms-1", name: "Kickoff", date: "02/06/2026", status: "concluido" },
      { id: "ms-2", name: "Design aprovado", date: "15/06/2026", status: "concluido" },
      { id: "ms-3", name: "Preview ao cliente", date: "10/07/2026", status: "pendente" },
      { id: "ms-4", name: "Entrega", date: "15/07/2026", status: "pendente" },
    ],
    revisionsUsed: 0,
    revisionsTotal: 2,
    reviewRound: "Aguardando primeira apresentação",
    files: [
      { id: "f-1", name: "logo-vetor.svg", folder: "materiais-cliente/", date: "28/05/2026" },
      { id: "f-2", name: "wireframe-v2.pdf", folder: "entregas/", date: "10/06/2026" },
    ],
    timeline: [
      { id: "pt-1", text: "Bloqueio: aguardando textos página Sobre", timestamp: "2026-07-01", relative: "há 5 dias", category: "projetos" },
      { id: "pt-2", text: "Materiais parciais recebidos", timestamp: "2026-05-30", relative: "há 7 dias", category: "projetos" },
      { id: "pt-3", text: "Kickoff realizado", timestamp: "2026-06-02", relative: "há 34 dias", category: "projetos" },
      { id: "pt-4", text: "Projeto criado — handoff comercial", timestamp: "2026-06-01", relative: "há 35 dias", category: "projetos" },
    ],
    pendingNorax: ["Desenvolvimento Home", "QA mobile"],
    pendingClient: ["Textos página Sobre", "Aprovação rodada 1"],
  },
  {
    id: "proj-2",
    clientId: "cli-2",
    negotiationId: "neg-3",
    name: "Landing Page Captação",
    type: "Landing page",
    status: "planejamento",
    progress: 15,
    startDate: "03/07/2026",
    deadline: "30/07/2026",
    daysRemaining: 24,
    blockType: "nenhum",
    nextStep: "Realizar kickoff",
    nextStepCta: "Realizar kickoff",
    scopeSnapshot: {
      objective: "Landing page para captação de leads",
      deliverables: ["LP responsiva", "Formulário integrado"],
      exclusions: ["Copywriting"],
      estimatedDeadline: "20 dias",
      internalValue: 5500,
    },
    materials: [
      { id: "mat-4", name: "Briefing de marca", status: "pendente" },
      { id: "mat-5", name: "Referências visuais", status: "pendente" },
    ],
    accessNotes: [],
    kickoffNotes: "",
    checklist: [
      { id: "ck-9", label: "Kickoff", done: false, highlighted: true },
      { id: "ck-10", label: "Wireframe", done: false },
      { id: "ck-11", label: "Design", done: false },
      { id: "ck-12", label: "Desenvolvimento", done: false },
    ],
    milestones: [
      { id: "ms-5", name: "Kickoff", date: "10/07/2026", status: "pendente" },
      { id: "ms-6", name: "Entrega", date: "30/07/2026", status: "pendente" },
    ],
    revisionsUsed: 0,
    revisionsTotal: 2,
    reviewRound: "—",
    files: [],
    timeline: [
      { id: "pt-5", text: "Projeto criado", timestamp: "2026-07-03", relative: "há 3 dias", category: "projetos" },
    ],
    pendingNorax: ["Realizar kickoff"],
    pendingClient: ["Briefing de marca", "Referências visuais"],
  },
  {
    id: "proj-3",
    clientId: "cli-4",
    negotiationId: "neg-1",
    name: "Portal Interno",
    type: "Sistema web",
    status: "em_garantia",
    progress: 100,
    startDate: "01/01/2026",
    deadline: "01/04/2026",
    daysRemaining: 0,
    blockType: "nenhum",
    nextStep: "Monitorar garantia — 12 dias restantes",
    nextStepCta: "Registrar chamado",
    scopeSnapshot: defaultScope,
    materials: [],
    accessNotes: ["Produção: portal.inativocorp.com"],
    kickoffNotes: "Projeto entregue com sucesso.",
    checklist: [
      { id: "ck-13", label: "Desenvolvimento", done: true },
      { id: "ck-14", label: "QA", done: true },
      { id: "ck-15", label: "Entrega", done: true },
    ],
    milestones: [
      { id: "ms-7", name: "Entrega", date: "01/04/2026", status: "concluido" },
    ],
    revisionsUsed: 1,
    revisionsTotal: 2,
    reviewRound: "Aprovado",
    files: [
      { id: "f-3", name: "pacote-entrega.zip", folder: "entregas/", date: "01/04/2026" },
    ],
    warranty: { start: "01/04/2026", end: "01/05/2026", openTickets: 0 },
    timeline: [
      { id: "pt-6", text: "Projeto entregue", timestamp: "2026-04-01", relative: "há 3 meses", category: "projetos" },
      { id: "pt-7", text: "Garantia iniciada — 30 dias", timestamp: "2026-04-01", relative: "há 3 meses", category: "projetos" },
    ],
    pendingNorax: [],
    pendingClient: [],
  },
];

export const files: FileItem[] = [
  { id: "file-1", name: "proposta-v2.pdf", type: "PDF", date: "03/07/2026", clientId: "cli-1", source: "Comercial" },
  { id: "file-2", name: "contrato-assinado.pdf", type: "PDF", date: "05/07/2026", clientId: "cli-1", source: "Comercial" },
  { id: "file-3", name: "logo-vetor.svg", type: "SVG", date: "28/05/2026", clientId: "cli-1", projectId: "proj-1", source: "Projeto" },
  { id: "file-4", name: "wireframe-v2.pdf", type: "PDF", date: "10/06/2026", clientId: "cli-1", projectId: "proj-1", source: "Projeto" },
  { id: "file-5", name: "comprovante-pix.pdf", type: "PDF", date: "04/07/2026", clientId: "cli-1", source: "Financeiro" },
];

export function getClient(id: string) {
  return clients.find((c) => c.id === id);
}

export function getNegotiation(id: string) {
  return negotiations.find((n) => n.id === id);
}

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export function getClientProjects(clientId: string) {
  return projects.filter((p) => p.clientId === clientId);
}

export function getClientNegotiations(clientId: string) {
  return negotiations.filter((n) => n.clientId === clientId);
}

export function getClientTimeline(clientId: string): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  negotiations
    .filter((n) => n.clientId === clientId)
    .forEach((n) => events.push(...n.timeline));
  projects
    .filter((p) => p.clientId === clientId)
    .forEach((p) => events.push(...p.timeline));
  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const statusLabels: Record<string, string> = {
  lead: "Lead",
  ativo: "Ativo",
  inativo: "Inativo",
  perdido: "Perdido",
  aberta: "Aberta",
  descoberta: "Descoberta",
  proposta_enviada: "Proposta enviada",
  em_negociacao: "Em negociação",
  aguardando_contrato: "Aguardando contrato",
  aguardando_pagamento: "Aguardando pagamento",
  ganha: "Ganha",
  perdida: "Perdida",
  arquivada: "Arquivada",
  planejamento: "Planejamento",
  em_andamento: "Em andamento",
  em_revisao: "Em revisão",
  aguardando_cliente: "Aguardando cliente",
  aprovado: "Aprovado",
  entregue: "Entregue",
  em_garantia: "Em garantia",
  concluido: "Concluído",
  arquivado: "Arquivado",
};
