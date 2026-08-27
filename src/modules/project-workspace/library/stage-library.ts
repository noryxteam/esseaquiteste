import type { LibraryStage } from "@/modules/project-workspace/types";

/** Biblioteca de etapas prontas (30+). */
export const STAGE_LIBRARY: LibraryStage[] = [
  { id: "briefing", name: "Briefing", category: "comercial", icon: "ClipboardList" },
  { id: "reuniao-inicial", name: "Reunião Inicial", category: "comercial", icon: "Users" },
  { id: "planejamento", name: "Planejamento", category: "comercial", icon: "Map" },
  { id: "proposta", name: "Proposta Comercial", category: "comercial", icon: "FileText" },
  { id: "contrato", name: "Contrato Assinado", category: "comercial", icon: "PenLine" },
  { id: "pagamento", name: "Pagamento Recebido", category: "financeiro", icon: "Wallet" },
  { id: "wireframe", name: "Wireframe", category: "design", icon: "LayoutTemplate" },
  { id: "pesquisa", name: "Pesquisa", category: "design", icon: "Search" },
  { id: "design", name: "Design", category: "design", icon: "Palette" },
  { id: "aprovacao-design", name: "Aprovação do Design", category: "design", icon: "CheckSquare" },
  { id: "identidade", name: "Identidade Visual", category: "design", icon: "Sparkles" },
  { id: "front", name: "Desenvolvimento Front-end", category: "desenvolvimento", icon: "Code2" },
  { id: "back", name: "Desenvolvimento Back-end", category: "desenvolvimento", icon: "Server" },
  { id: "banco", name: "Banco de Dados", category: "desenvolvimento", icon: "Database" },
  { id: "api", name: "API", category: "desenvolvimento", icon: "Webhook" },
  { id: "integracoes", name: "Integrações", category: "desenvolvimento", icon: "Link2" },
  { id: "admin", name: "Área Administrativa", category: "sistema", icon: "Settings" },
  { id: "login", name: "Login", category: "sistema", icon: "Lock" },
  { id: "dashboard", name: "Dashboard", category: "sistema", icon: "LayoutDashboard" },
  { id: "seo", name: "SEO", category: "marketing", icon: "TrendingUp" },
  { id: "analytics", name: "Analytics", category: "marketing", icon: "BarChart3" },
  { id: "meta-pixel", name: "Meta Pixel", category: "marketing", icon: "Target" },
  { id: "homologacao", name: "Homologação", category: "entrega", icon: "ShieldCheck" },
  { id: "testes", name: "Testes", category: "entrega", icon: "FlaskConical" },
  { id: "correcoes", name: "Correções", category: "entrega", icon: "Wrench" },
  { id: "otimizacao", name: "Otimização", category: "entrega", icon: "Gauge" },
  { id: "publicacao", name: "Publicação", category: "entrega", icon: "Rocket" },
  { id: "entrega", name: "Entrega", category: "entrega", icon: "PackageCheck" },
  { id: "treinamento", name: "Treinamento", category: "entrega", icon: "GraduationCap" },
  { id: "suporte", name: "Suporte", category: "entrega", icon: "LifeBuoy" },
  { id: "dominio", name: "Configuração de Domínio", category: "infraestrutura", icon: "Globe" },
  { id: "dns", name: "Configuração de DNS", category: "infraestrutura", icon: "Network" },
  { id: "hospedagem", name: "Hospedagem", category: "infraestrutura", icon: "Cloud" },
  { id: "ssl", name: "SSL / Certificado", category: "infraestrutura", icon: "Shield" },
  { id: "deploy", name: "Deploy", category: "infraestrutura", icon: "UploadCloud" },
  { id: "finalizado", name: "Projeto Finalizado", category: "entrega", icon: "Flag" },
];

export function getLibraryStage(id: string): LibraryStage | undefined {
  return STAGE_LIBRARY.find((s) => s.id === id);
}
