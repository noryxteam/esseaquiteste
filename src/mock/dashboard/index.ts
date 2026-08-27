import { getSeedData } from "@/mock/seed";
import type { MockDashboard } from "./types";

export * from "./types";
export { dashboard } from "./data";

export function getDashboard(): MockDashboard {
  return getSeedData().dashboard;
}

export function getDashboardKpis() {
  const d = getSeedData().dashboard;
  return {
    totalClientes: d.totalClientes,
    clientesAtivos: d.clientesAtivos,
    projetosAtivos: d.projetosAtivos,
    projetosConcluidos: d.projetosConcluidos,
    receitaTotal: d.receitaTotal,
    receitaMes: d.receitaMes,
    despesasMes: d.despesasMes,
    lucroMes: d.lucroMes,
    contratosAtivos: d.contratosAtivos,
    contratosAguardandoAssinatura: d.contratosAguardandoAssinatura,
    reunioesHoje: d.reunioesHoje,
    reunioesSemana: d.reunioesSemana,
    briefingsTotal: d.briefingsTotal,
    tasksPendentes: d.tasksPendentes,
    tasksConcluidas: d.tasksConcluidas,
    margemMedia: d.margemMedia,
    notificacoesNaoLidas: d.notificacoesNaoLidas,
  };
}
