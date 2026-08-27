/** Ciclo de vida estrito — nenhuma etapa pode ser ignorada */
export type ContractLifecycleStep =
  | "criado"
  | "editado"
  | "campos_adicionados"
  | "revisado"
  | "definitivo"
  | "enviado"
  | "cliente_acessou"
  | "dispositivo_autorizado"
  | "cliente_leu"
  | "aceite_eletronico"
  | "cliente_assinou"
  | "norax_assinou"
  | "pdf_gerado"
  | "arquivado";

export type ElectronicContractStatus =
  | "rascunho"
  | "em-revisao"
  | "definitivo"
  | "aguardando-assinatura"
  | "parcialmente-assinado"
  | "assinado"
  | "finalizado"
  | "arquivado"
  | "cancelado"
  | "expirado";

export type FillableFieldType = "texto" | "data" | "assinatura" | "checkbox" | "numero";

export interface ContractFillableField {
  id: string;
  tipo: FillableFieldType;
  label: string;
  placeholder?: string;
  obrigatorio: boolean;
  valor?: string;
  pagina?: number;
}

export interface ContractClause {
  id: string;
  numero: string;
  titulo: string;
  paragrafos: string[];
}

export interface ContractVariableValues {
  cliente: string;
  empresa: string;
  cpf: string;
  cnpj: string;
  valor: string;
  data: string;
  projeto: string;
  endereco: string;
  telefone: string;
  email: string;
}

export interface ContractSignatureRecord {
  role: "cliente" | "norax";
  nome: string;
  documento: string;
  data: string;
  hora: string;
  aceiteEletronico: boolean;
  assinadoEm: string;
}

export interface AuthorizedDevice {
  id: string;
  fingerprint: string;
  label: string;
  autorizadoEm: string;
  ultimoAcesso: string;
  aprovadoPor?: string;
}

export interface DeviceAccessRequest {
  id: string;
  fingerprint: string;
  label: string;
  solicitadoEm: string;
  status: "pendente" | "aprovado" | "rejeitado";
}

export interface ContractTimelineEntry {
  id: string;
  step: ContractLifecycleStep;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  usuario: string;
}

export interface ContractSecurityLog {
  id: string;
  data: string;
  hora: string;
  acao: string;
  dispositivoId?: string;
  codigoUtilizado?: boolean;
  versao: number;
  hashDocumento: string;
}

export interface ContractEditorSettings {
  logoUrl?: string;
  cabecalho?: string;
  rodape?: string;
  observacoes?: string;
  origem?: "apaga-logo";
  fotoContratado?: string;
  fotoCliente?: string;
}

export interface ElectronicContract {
  id: string;
  numeroContrato: string;
  clienteId: string;
  projetoId: string;
  titulo: string;
  valor: number;
  formaPagamento: string;
  parcelas: number;
  prazo: string;
  responsavelId: string;
  responsavelNome: string;
  status: ElectronicContractStatus;
  lifecycleStep: ContractLifecycleStep;
  versao: number;
  isImmutable: boolean;
  uniqueSlug: string;
  accessCode: string | null;
  accessCodeUsed: boolean;
  shareLink: string;
  hashDocumento: string;
  dataCriacao: string;
  dataEnvio: string | null;
  dataAssinatura: string | null;
  clausulas: ContractClause[];
  campos: ContractFillableField[];
  variaveis: ContractVariableValues;
  editorSettings: ContractEditorSettings;
  assinaturas: ContractSignatureRecord[];
  dispositivosAutorizados: AuthorizedDevice[];
  solicitacoesDispositivo: DeviceAccessRequest[];
  timeline: ContractTimelineEntry[];
  securityLogs: ContractSecurityLog[];
  pdfUrl: string | null;
  conteudoResolvido: boolean;
}

export const CONTRACT_VARIABLES = [
  "{{cliente}}",
  "{{empresa}}",
  "{{cpf}}",
  "{{cnpj}}",
  "{{valor}}",
  "{{data}}",
  "{{projeto}}",
  "{{endereco}}",
  "{{telefone}}",
  "{{email}}",
] as const;

export type ContractVariableKey = (typeof CONTRACT_VARIABLES)[number];
