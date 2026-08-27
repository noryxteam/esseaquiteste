export interface MockSettings {
  empresa: {
    nome: string;
    razaoSocial: string;
    cnpj: string;
    email: string;
    telefone: string;
    endereco: string;
    banco?: string;
    agencia?: string;
    conta?: string;
    chavePix?: string;
    destinatarioPix?: string;
  };
  preferencias: {
    tema: "dark";
    idioma: "pt-BR";
    fusoHorario: string;
    notificacoesEmail: boolean;
    notificacoesPush: boolean;
  };
  integracoes: {
    stripe: boolean;
    clicksign: boolean;
    googleCalendar: boolean;
    slack: boolean;
  };
}
