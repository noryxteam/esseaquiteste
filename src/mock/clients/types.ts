export type ClientStatus = "ativo" | "inativo" | "prospecto" | "churn";

export interface MockClient {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  segmento: string;
  cidade: string;
  estado: string;
  status: ClientStatus;
  responsavelId: string;
  responsavel: string;
  avatar: string;
  ultimoContato: string;
  proximoContato: string;
  quantidadeProjetos: number;
  valorTotal: number;
  tags: string[];
  criadoEm: string;
}
