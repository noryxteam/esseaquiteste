import { prisma } from "@/database";
import { softDeleteWhere } from "@/shared/repositories/base.repository";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export class ReportsService {
  async getDashboard() {
    const [
      totalClientes,
      clientesAtivos,
      projetosAtivos,
      projetosConcluidos,
      contratosAtivos,
      contratosAguardando,
      tasksPendentes,
      tasksConcluidas,
      briefingsTotal,
    ] = await Promise.all([
      prisma.client.count({ where: softDeleteWhere() }),
      prisma.client.count({ where: { ...softDeleteWhere(), status: "ATIVO" } }),
      prisma.project.count({ where: { ...softDeleteWhere(), status: { in: ["EM_ANDAMENTO", "PLANEJAMENTO"] } } }),
      prisma.project.count({ where: { ...softDeleteWhere(), status: "CONCLUIDO" } }),
      prisma.contract.count({ where: { ...softDeleteWhere(), status: { in: ["ASSINADO", "FINALIZADO"] } } }),
      prisma.contract.count({ where: { ...softDeleteWhere(), status: "AGUARDANDO_ASSINATURA" } }),
      prisma.task.count({ where: { ...softDeleteWhere(), status: { in: ["PENDENTE", "EM_ANDAMENTO"] } } }),
      prisma.task.count({ where: { ...softDeleteWhere(), status: "CONCLUIDA" } }),
      prisma.briefing.count({ where: softDeleteWhere() }),
    ]);

    const receitas = await prisma.financeMovement.findMany({
      where: { ...softDeleteWhere(), tipo: "RECEITA", status: "PAGO" },
      select: { valor: true, data: true },
    });

    const despesas = await prisma.financeMovement.findMany({
      where: { ...softDeleteWhere(), tipo: "DESPESA" },
      select: { valor: true, data: true },
    });

    const receitaTotal = receitas.reduce((s, r) => s + Number(r.valor), 0);
    const despesasTotal = despesas.reduce((s, d) => s + Number(d.valor), 0);
    const margemMedia = receitaTotal > 0 ? Math.round(((receitaTotal - despesasTotal) / receitaTotal) * 100) : 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const receitaMes = receitas
      .filter((r) => new Date(r.data).getMonth() === currentMonth)
      .reduce((s, r) => s + Number(r.valor), 0);
    const despesasMes = despesas
      .filter((d) => new Date(d.data).getMonth() === currentMonth)
      .reduce((s, d) => s + Number(d.valor), 0);

    return {
      totalClientes,
      clientesAtivos,
      projetosAtivos,
      projetosConcluidos,
      receitaTotal,
      receitaMes,
      despesasMes,
      lucroMes: receitaMes - despesasMes,
      contratosAtivos,
      contratosAguardandoAssinatura: contratosAguardando,
      briefingsTotal,
      tasksPendentes,
      tasksConcluidas,
      margemMedia,
    };
  }

  async getMonthlyReports() {
    const [finance, clients, projects] = await Promise.all([
      prisma.financeMovement.findMany({ where: softDeleteWhere() }),
      prisma.client.findMany({ where: softDeleteWhere(), select: { createdAt: true } }),
      prisma.project.findMany({ where: { ...softDeleteWhere(), status: "CONCLUIDO" }, select: { prazo: true, dataInicio: true } }),
    ]);

    const faturamentoMensal = MONTHS.map((mes, i) => ({
      mes,
      valor: finance
        .filter((f) => f.tipo === "RECEITA" && f.status === "PAGO" && new Date(f.data).getMonth() === i)
        .reduce((s, f) => s + Number(f.valor), 0),
    }));

    const despesasMensal = MONTHS.map((mes, i) => ({
      mes,
      valor: finance
        .filter((f) => f.tipo === "DESPESA" && new Date(f.data).getMonth() === i)
        .reduce((s, f) => s + Number(f.valor), 0),
    }));

    const lucroMensal = faturamentoMensal.map((f, i) => ({
      mes: f.mes,
      valor: f.valor - despesasMensal[i].valor,
    }));

    const totalReceita = faturamentoMensal.reduce((s, m) => s + m.valor, 0);
    const totalDespesa = despesasMensal.reduce((s, m) => s + m.valor, 0);

    const concluidos = projects.filter((p) => p.dataInicio && p.prazo);
    const tempoMedioEntrega =
      concluidos.length > 0
        ? Math.round(
            concluidos.reduce((sum, p) => {
              const dias = (new Date(p.prazo).getTime() - new Date(p.dataInicio).getTime()) / 86_400_000;
              return sum + dias;
            }, 0) / concluidos.length
          )
        : 0;

    return {
      faturamentoMensal,
      lucroMensal,
      receitasMensal: faturamentoMensal,
      despesasMensal,
      novosClientesMensal: MONTHS.map((mes, i) => ({
        mes,
        quantidade: clients.filter((c) => new Date(c.createdAt).getMonth() === i).length,
      })),
      projetosEntreguesMensal: MONTHS.map((mes, i) => ({
        mes,
        quantidade: projects.filter((p) => new Date(p.prazo).getMonth() === i).length,
      })),
      tempoMedioEntrega,
      margemMedia: totalReceita > 0 ? Math.round(((totalReceita - totalDespesa) / totalReceita) * 100) : 0,
    };
  }
}

export const reportsService = new ReportsService();
