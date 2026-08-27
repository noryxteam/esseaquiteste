import type { MockNotification } from "@/mock/notifications/types";

export interface MockDashboard {
  totalClientes: number;
  clientesAtivos: number;
  projetosAtivos: number;
  projetosConcluidos: number;
  receitaTotal: number;
  receitaMes: number;
  despesasMes: number;
  lucroMes: number;
  contratosAtivos: number;
  contratosAguardandoAssinatura: number;
  reunioesHoje: number;
  reunioesSemana: number;
  briefingsTotal: number;
  tasksPendentes: number;
  tasksConcluidas: number;
  margemMedia: number;
  notificacoesNaoLidas: number;
  user: {
    name: string;
    role: string;
    initials: string;
    email: string;
  };
  notifications: MockNotification[];
}
