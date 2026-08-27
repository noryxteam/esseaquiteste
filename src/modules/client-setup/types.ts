/** Tipagens do assistente de configuração do cliente e ficha completa */

export type PaymentMethodId =
  | "pix_avista"
  | "pix_50_50"
  | "pix_personalizado"
  | "cartao"
  | "cartao_parcelado"
  | "boleto"
  | "outro";

export interface PixCustomInstallment {
  id: string;
  label: string;
  percent: number;
  date: string;
}

export interface PaymentConfig {
  method: PaymentMethodId;
  installments: number;
  /** PIX personalizado */
  entryPercent?: number;
  customSchedule?: PixCustomInstallment[];
  notes?: string;
}

export interface ClientPersonalData {
  nome: string;
  empresa: string;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
}

export interface ServiceInfo {
  tipoServico: string;
  nomeProjeto: string;
  valorTotal: number;
  dataInicio: string;
  prazoPrevisto: string;
  responsavelInternoId: string;
  responsavelInternoNome: string;
  /** Gmail do cliente para receber notificações do contrato / sistema. */
  emailRecuperacao: string;
}

export interface NoraxCompanySnapshot {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  banco: string;
  agencia: string;
  conta: string;
  chavePix: string;
  destinatarioPix: string;
}

export interface ClientSetupProfile {
  clientId: string;
  setupComplete: boolean;
  setupCompletedAt: string | null;
  personal: ClientPersonalData;
  service: ServiceInfo;
  payment: PaymentConfig;
  norax: NoraxCompanySnapshot;
  updatedAt: string;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  pix_avista: "PIX à vista",
  pix_50_50: "PIX 50% antes e 50% depois",
  pix_personalizado: "PIX de %",
  cartao: "Cartão",
  cartao_parcelado: "Cartão parcelado",
  boleto: "Boleto",
  outro: "Outro",
};

/** Opções exibidas no assistente de configuração */
export const WIZARD_PAYMENT_METHODS: PaymentMethodId[] = [
  "pix_avista",
  "pix_personalizado",
  "cartao",
  "cartao_parcelado",
];

export const SERVICE_TYPES = [
  "Site Institucional",
  "Landing Page",
  "Sistema Web",
  "Aplicativo",
  "Loja Virtual",
  "Identidade Visual",
  "Hospedagem",
  "Manutenção",
  "Consultoria",
  "Outro",
] as const;

export const BRAZIL_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
