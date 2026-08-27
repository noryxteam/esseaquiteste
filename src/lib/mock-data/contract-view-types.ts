export type SignatureStatus = "pendente" | "assinado";

export interface ContractSignature {
  role: "empresa" | "cliente";
  roleLabel: string;
  name: string;
  document: string;
  date?: string;
  time?: string;
  code?: string;
  status: SignatureStatus;
}

export interface ContractTimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  pending?: boolean;
}

export interface ContractViewData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  status: string;
  statusLabel: string;
  statusVariant: "aguardando-assinatura" | "assinado" | "finalizado" | "rascunho";
  company: {
    name: string;
    legalName: string;
    cnpj: string;
    address: string;
    city: string;
    email: string;
    phone: string;
    representative: string;
  };
  client: {
    name: string;
    company: string;
    cpfCnpj: string;
    address: string;
    city: string;
    email: string;
    phone: string;
    representative: string;
  };
  value: string;
  valueRaw: number;
  paymentMethod: string;
  installments: string;
  deadline: string;
  template: string;
  createdAt: string;
  createdTime: string;
  sentAt: string;
  sentTime: string;
  contractDate: string;
  link: string;
  signaturesCount: number;
  signaturesTotal: number;
  uniqueCode: string;
  /** Slug público para /contract/[slug]/visualizar */
  uniqueSlug?: string;
  /** Código de segurança enviado ao cliente para acessar o contrato. */
  accessCode?: string | null;
  hash: string;
  hashShort: string;
  issuedAt: string;
  lastValidation: string;
  protected: boolean;
  signatures: ContractSignature[];
  timeline: ContractTimelineEvent[];
  metadata: {
    internalId: string;
    version: string;
    views: number;
    authorizedDevices: number;
    lastAccess: string;
    ip: string;
  };
}
