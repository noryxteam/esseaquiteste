/** Rotas centralizadas da aplicação */

export const routes = {
  dashboard: "/dashboard",
  clientes: "/clientes",
  cliente: (id: string) => `/clientes/${id}`,
  projetos: "/projetos",
  projeto: (id: string) => `/projetos/${id}`,
  reunioes: "/reunioes",
  reuniao: (id: string) => `/reunioes/${id}`,
  reuniaoAi: (id: string) => `/reunioes/${id}/ai-engine`,
  contratos: "/contratos",
  contrato: (id: string) => `/contratos/${id}`,
  contratoNovo: "/contratos/novo",
  contratoEditar: (id: string) => `/contratos/${id}/editar`,
  apagaLogo: "/apaga-logo",
  financeiro: "/financeiro",
  briefings: "/briefings",
  briefing: (id: string) => `/briefings/${id}`,
  tasks: "/tasks",
  equipe: "/equipe",
  membro: (id: string) => `/equipe/${id}`,
  arquivos: "/arquivos",
  modelo: (id: string) => `/modelos/${id}`,
  modelos: "/modelos",
  propostas: "/propostas",
  proposta: (id: string) => `/propostas/${id}`,
  relatorios: "/relatorios",
  configuracoes: "/configuracoes",
  integracoes: "/integracoes",
} as const;

export const KPI_ROUTES: Record<string, string> = {
  meetings: routes.reunioes,
  clients: routes.clientes,
  proposals: routes.contratos,
  payment: routes.financeiro,
  deliveries: routes.tasks,
};

export const BOTTOM_METRIC_ROUTES: Record<string, string> = {
  receita: routes.financeiro,
  projetos: routes.projetos,
  clientes: routes.clientes,
  contratos: routes.contratos,
  tasks: routes.tasks,
};
