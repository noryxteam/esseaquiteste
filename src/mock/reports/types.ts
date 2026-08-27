export interface MonthlyMetric {
  mes: string;
  valor: number;
}

export interface MockReports {
  faturamentoMensal: MonthlyMetric[];
  lucroMensal: MonthlyMetric[];
  receitasMensal: MonthlyMetric[];
  despesasMensal: MonthlyMetric[];
  conversaoMensal: { mes: string; taxa: number }[];
  novosClientesMensal: { mes: string; quantidade: number }[];
  projetosEntreguesMensal: { mes: string; quantidade: number }[];
  tempoMedioEntrega: number;
  margemMedia: number;
}
