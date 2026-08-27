import {
  addDays,
  CITIES,
  COMPANY_PREFIXES,
  COMPANY_SUFFIXES,
  FIRST_NAMES,
  initials,
  isoDate,
  LAST_NAMES,
  padId,
  pick,
  pickRandom,
  randomAmount,
  SEGMENTS,
  slugify,
} from "@/mock/common/utils";
import type { MockBriefing } from "@/mock/briefings/types";
import type { MockClient } from "@/mock/clients/types";
import type { MockContract } from "@/mock/contracts/types";
import type { MockDashboard } from "@/mock/dashboard/types";
import type { MockFile } from "@/mock/files/types";
import type { MockFinanceMovement } from "@/mock/finance/types";
import type { MockMeeting } from "@/mock/meetings/types";
import type { MockNotification } from "@/mock/notifications/types";
import type { MockProject } from "@/mock/projects/types";
import type { MockReports } from "@/mock/reports/types";
import type { MockSettings } from "@/mock/settings/types";
import type { MockTask } from "@/mock/tasks/types";
import type { MockTimelineEvent } from "@/mock/timeline/types";
import type { MockUser } from "@/mock/users/types";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const PROJECT_NAMES = [
  "Site Institucional",
  "E-commerce",
  "Landing Page",
  "App Mobile",
  "Portal do Cliente",
  "Rebranding",
  "SEO & Conteúdo",
  "Automação de Marketing",
  "Dashboard Analytics",
  "Integração ERP",
];

const TASK_TITLES = [
  "Revisar wireframe",
  "Enviar proposta",
  "Configurar domínio",
  "Criar layout homepage",
  "Implementar checkout",
  "Testes de usabilidade",
  "Publicar versão beta",
  "Reunião de alinhamento",
  "Atualizar documentação",
  "Otimizar performance",
];

const FILE_TYPES = ["PDF", "PNG", "SVG", "DOCX", "XLSX", "MP4", "ZIP", "FIG", "PSD"];

const FILE_CATEGORIES: MockFile["categoria"][] = [
  "contrato",
  "briefing",
  "design",
  "documento",
  "imagem",
  "video",
  "planilha",
  "outro",
];

export interface MockSeedData {
  users: MockUser[];
  clients: MockClient[];
  projects: MockProject[];
  contracts: MockContract[];
  meetings: MockMeeting[];
  briefings: MockBriefing[];
  finance: MockFinanceMovement[];
  tasks: MockTask[];
  files: MockFile[];
  timeline: MockTimelineEvent[];
  notifications: MockNotification[];
  settings: MockSettings;
  reports: MockReports;
  dashboard: MockDashboard;
}

function buildUsers(): MockUser[] {
  const roles: MockUser["role"][] = [
    "administrador",
    "designer",
    "desenvolvedor",
    "financeiro",
    "comercial",
    "cliente",
  ];
  const roleLabels: Record<MockUser["role"], string> = {
    administrador: "Administrador",
    designer: "Designer",
    desenvolvedor: "Desenvolvedor",
    financeiro: "Financeiro",
    comercial: "Comercial",
    cliente: "Cliente",
  };

  const team: MockUser[] = roles.map((role, i) => {
    const nome = `${pick(FIRST_NAMES, i)} ${pick(LAST_NAMES, i + 2)}`;
    return {
      id: padId("usr", i + 1),
      nome,
      email: `${slugify(nome).replace(/-/g, ".")}@norax.dev`,
      role,
      roleLabel: roleLabels[role],
      avatar: "",
      initials: initials(nome),
      ativo: true,
      criadoEm: isoDate(2023, 1 + (i % 12), 5 + i),
    };
  });

  const extraClients: MockUser[] = Array.from({ length: 6 }, (_, i) => {
    const nome = `${pick(FIRST_NAMES, i + 6)} ${pick(LAST_NAMES, i + 4)}`;
    return {
      id: padId("usr", 10 + i),
      nome,
      email: `${slugify(nome).replace(/-/g, ".")}@cliente.com.br`,
      role: "cliente" as const,
      roleLabel: "Cliente",
      avatar: "",
      initials: initials(nome),
      ativo: true,
      criadoEm: isoDate(2024, 2 + i, 10),
    };
  });

  return [...team, ...extraClients];
}

function buildClients(users: MockUser[]): MockClient[] {
  const commercial = users.find((u) => u.role === "comercial")!;
  const statuses: MockClient["status"][] = ["ativo", "ativo", "ativo", "prospecto", "inativo", "churn"];

  return Array.from({ length: 30 }, (_, i) => {
    const prefix = pick(COMPANY_PREFIXES, i);
    const suffix = pick(COMPANY_SUFFIXES, i + 3);
    const empresa = `${prefix} ${suffix}`;
    const nome = `${pick(FIRST_NAMES, i + 1)} ${pick(LAST_NAMES, i)}`;
    const loc = pick(CITIES, i);
    const criadoEm = isoDate(2023 + (i % 2), 1 + (i % 12), 1 + (i % 28));
    const segmento = pick(SEGMENTS, i);

    return {
      id: padId("cli", i + 1),
      nome,
      empresa,
      email: `contato@${slugify(empresa)}.com.br`,
      telefone: `(11) 9${String(8000 + i * 17).slice(-4)}-${String(1000 + i * 23).slice(-4)}`,
      segmento,
      cidade: loc.city,
      estado: loc.state,
      status: pick(statuses, i),
      responsavelId: commercial.id,
      responsavel: commercial.nome,
      avatar: "",
      ultimoContato: addDays(criadoEm, 15 + (i % 40)),
      proximoContato: addDays(criadoEm, 45 + (i % 30)),
      quantidadeProjetos: 0,
      valorTotal: 0,
      tags: [segmento, loc.state, i % 3 === 0 ? "Premium" : "Standard"],
      criadoEm,
    };
  });
}

function buildProjects(clients: MockClient[], users: MockUser[]): MockProject[] {
  const statuses: MockProject["status"][] = [
    "planejamento",
    "em-andamento",
    "em-andamento",
    "pausado",
    "concluido",
    "cancelado",
  ];
  const priorities: MockProject["prioridade"][] = ["baixa", "media", "alta", "urgente"];
  const responsaveis = users.filter((u) =>
    ["designer", "desenvolvedor", "comercial", "administrador"].includes(u.role)
  );

  return Array.from({ length: 40 }, (_, i) => {
    const client = clients[i % clients.length];
    const resp = pick(responsaveis, i);
    const dataInicio = addDays(client.criadoEm, 7 + (i % 20));
    const status = pick(statuses, i);
    const progresso =
      status === "concluido" ? 100 : status === "planejamento" ? 10 + (i % 20) : 20 + (i % 70);

    return {
      id: padId("proj", i + 1),
      clienteId: client.id,
      nome: `${pick(PROJECT_NAMES, i)} — ${client.empresa.split(" ")[0]}`,
      descricao: `Projeto de ${pick(PROJECT_NAMES, i).toLowerCase()} para ${client.empresa}.`,
      status,
      progresso,
      responsavelId: resp.id,
      responsavel: resp.nome,
      dataInicio,
      prazo: addDays(dataInicio, 30 + (i % 60)),
      prioridade: pick(priorities, i),
      valor: randomAmount(i, 8000, 120000),
      briefingId: null,
      contratoId: null,
    };
  });
}

function buildBriefings(projects: MockProject[]): MockBriefing[] {
  const selected = projects.slice(0, 30);
  return selected.map((proj, i) => ({
    id: padId("brf", i + 1),
    clienteId: proj.clienteId,
    projetoId: proj.id,
    resumo: `Briefing do projeto ${proj.nome}. Alinhamento de escopo, objetivos e entregáveis.`,
    objetivos: [
      "Aumentar conversão digital",
      "Fortalecer presença da marca",
      "Melhorar experiência do usuário",
    ],
    escopo: ["Discovery", "Design", "Desenvolvimento", "Homologação", "Go-live"],
    decisoes: i % 2 === 0 ? ["Escopo aprovado", "Prazo definido"] : ["Aguardando materiais"],
    pendencias: i % 3 === 0 ? ["Enviar logo", "Definir hospedagem"] : ["Validar wireframe"],
    tarefas: ["Criar wireframe", "Configurar ambiente", "Reunião de kickoff"],
    observacoes: ["Cliente demonstrou urgência no lançamento"],
    criadoEm: addDays(proj.dataInicio, -5),
  }));
}

function linkBriefings(projects: MockProject[], briefings: MockBriefing[]) {
  briefings.forEach((b) => {
    const p = projects.find((x) => x.id === b.projetoId);
    if (p) p.briefingId = b.id;
  });
}

function buildContracts(projects: MockProject[]): MockContract[] {
  const statuses: MockContract["status"][] = [
    "rascunho",
    "aguardando-assinatura",
    "assinado",
    "finalizado",
    "cancelado",
    "expirado",
  ];
  const payments = ["PIX", "Boleto", "Cartão", "Transferência"];

  return Array.from({ length: 30 }, (_, i) => {
    const proj = projects[i];
    const status = pick(statuses, i);
    const assinado = status === "assinado" || status === "finalizado";
    const dataCriacao = addDays(proj.dataInicio, -3);

    return {
      id: padId("ctr", i + 1),
      clienteId: proj.clienteId,
      projetoId: proj.id,
      numeroContrato: `NX-${2024}${String(i + 1).padStart(4, "0")}`,
      valor: proj.valor,
      status,
      dataCriacao,
      dataAssinatura: assinado ? addDays(dataCriacao, 5 + (i % 10)) : null,
      formaPagamento: pick(payments, i),
      parcelas: 1 + (i % 6),
      assinado,
      link: `/contract/${padId("ctr", i + 1)}/visualizar`,
      token: `tok_${String(i + 1).padStart(6, "0")}`,
      hashDocumento: `sha256:${String(i * 999983).padStart(12, "0")}`,
    };
  });
}

function linkContracts(projects: MockProject[], contracts: MockContract[]) {
  contracts.forEach((c) => {
    const p = projects.find((x) => x.id === c.projetoId);
    if (p) p.contratoId = c.id;
  });
}

function buildMeetings(
  projects: MockProject[],
  users: MockUser[],
  briefings: MockBriefing[]
): MockMeeting[] {
  const statuses: MockMeeting["status"][] = [
    "agendada",
    "concluida",
    "concluida",
    "em-andamento",
    "cancelada",
  ];
  const team = users.filter((u) => u.role !== "cliente").slice(0, 5);

  return Array.from({ length: 60 }, (_, i) => {
    const proj = projects[i % projects.length];
    const day = addDays(proj.dataInicio, i % 45);
    const hour = 8 + (i % 9);
    const status = pick(statuses, i);
    const briefing = briefings.find((b) => b.projetoId === proj.id) ?? null;

    const participants = [
      { userId: team[0].id, nome: team[0].nome, initials: team[0].initials },
      {
        userId: team[1 % team.length].id,
        nome: team[1 % team.length].nome,
        initials: team[1 % team.length].initials,
      },
    ];

    return {
      id: padId("meet", i + 1),
      clienteId: proj.clienteId,
      projetoId: proj.id,
      titulo: `Reunião — ${proj.nome.split(" — ")[0]}`,
      data: day,
      inicio: `${String(hour).padStart(2, "0")}:00`,
      fim: `${String(hour + 1).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
      participantes: participants,
      status,
      gravacao: status === "concluida",
      transcricao: status === "concluida" && i % 2 === 0,
      briefingId: briefing?.id ?? null,
    };
  });
}

function buildFinance(clients: MockClient[], contracts: MockContract[]): MockFinanceMovement[] {
  const statuses: MockFinanceMovement["status"][] = ["pago", "pendente", "atrasado", "cancelado"];
  const payments = ["PIX", "Boleto", "Cartão", "Transferência"];
  const movements: MockFinanceMovement[] = [];

  for (let i = 0; i < 120; i++) {
    const contract = contracts[i % contracts.length];
    const client = clients.find((c) => c.id === contract.clienteId)!;
    const isReceita = i % 4 !== 0;
    const tipo: MockFinanceMovement["tipo"] =
      isReceita ? "receita" : i % 2 === 0 ? "despesa" : "transferencia";
    const valor = isReceita
      ? Math.round(contract.valor / contract.parcelas)
      : randomAmount(i, 200, 15000);

    movements.push({
      id: padId("fin", i + 1),
      clienteId: client.id,
      contratoId: tipo === "receita" ? contract.id : null,
      tipo,
      categoria: tipo,
      valor,
      status: pick(statuses, i),
      data: addDays(contract.dataCriacao, i % 90),
      formaPagamento: pick(payments, i),
      descricao: isReceita
        ? `Parcela ${(i % contract.parcelas) + 1} — ${contract.numeroContrato}`
        : `Despesa operacional — ${client.empresa}`,
    });
  }

  return movements;
}

function buildTasks(
  projects: MockProject[],
  clients: MockClient[],
  users: MockUser[]
): MockTask[] {
  const statuses: MockTask["status"][] = ["pendente", "em-andamento", "concluida", "cancelada"];
  const priorities: MockTask["prioridade"][] = ["baixa", "media", "alta", "urgente"];
  const team = users.filter((u) =>
    ["designer", "desenvolvedor", "comercial", "administrador"].includes(u.role)
  );
  const clientMap = new Map(clients.map((c) => [c.id, c]));

  return Array.from({ length: 150 }, (_, i) => {
    const proj = projects[i % projects.length];
    const client = clientMap.get(proj.clienteId);
    const resp = pick(team, i);
    const status = pick(statuses, i);
    const prazo = addDays(proj.dataInicio, 5 + (i % 40));

    return {
      id: padId("task", i + 1),
      projetoId: proj.id,
      clienteId: proj.clienteId,
      titulo: `${pick(TASK_TITLES, i)} — ${client?.empresa ?? proj.nome}`,
      descricao: `Tarefa vinculada ao projeto ${proj.nome}.`,
      status,
      responsavelId: resp.id,
      responsavel: resp.nome,
      prioridade: pick(priorities, i),
      prazo,
      concluidoEm: status === "concluida" ? addDays(prazo, -1) : null,
    };
  });
}

function buildFiles(projects: MockProject[]): MockFile[] {
  return Array.from({ length: 100 }, (_, i) => {
    const proj = projects[i % projects.length];
    const tipo = pick(FILE_TYPES, i);
    const nome = `${slugify(proj.nome.split(" — ")[0])}-${i + 1}.${tipo.toLowerCase()}`;

    return {
      id: padId("file", i + 1),
      clienteId: proj.clienteId,
      projetoId: proj.id,
      nome,
      tipo,
      tamanho: 50_000 + ((i * 17_341) % 5_000_000),
      url: `/files/${nome}`,
      criadoEm: addDays(proj.dataInicio, i % 30),
      categoria: pick(FILE_CATEGORIES, i),
    };
  });
}

function enrichClients(clients: MockClient[], projects: MockProject[]) {
  clients.forEach((client) => {
    const clientProjects = projects.filter((p) => p.clienteId === client.id);
    client.quantidadeProjetos = clientProjects.length;
    client.valorTotal = clientProjects.reduce((sum, p) => sum + p.valor, 0);
  });
}

function buildTimeline(
  clients: MockClient[],
  projects: MockProject[],
  contracts: MockContract[],
  meetings: MockMeeting[],
  files: MockFile[],
  briefings: MockBriefing[],
  tasks: MockTask[],
  finance: MockFinanceMovement[],
  users: MockUser[]
): MockTimelineEvent[] {
  const events: MockTimelineEvent[] = [];
  let n = 0;

  const push = (partial: Omit<MockTimelineEvent, "id">) => {
    n += 1;
    events.push({ id: padId("evt", n), ...partial });
  };

  clients.forEach((c) => {
    push({
      tipo: "cliente-criado",
      titulo: "Cliente criado",
      descricao: `${c.empresa} adicionado à base`,
      data: c.criadoEm,
      hora: "09:00",
      clienteId: c.id,
      projetoId: null,
      contratoId: null,
      reuniaoId: null,
      arquivoId: null,
      usuarioId: c.responsavelId,
    });
  });

  projects.forEach((p) => {
    push({
      tipo: "projeto-iniciado",
      titulo: "Projeto iniciado",
      descricao: p.nome,
      data: p.dataInicio,
      hora: "10:00",
      clienteId: p.clienteId,
      projetoId: p.id,
      contratoId: null,
      reuniaoId: null,
      arquivoId: null,
      usuarioId: p.responsavelId,
    });
    if (p.progresso >= 50 && p.status !== "cancelado") {
      push({
        tipo: "projeto-aprovado",
        titulo: "Projeto aprovado",
        descricao: p.nome,
        data: addDays(p.dataInicio, 14),
        hora: "11:00",
        clienteId: p.clienteId,
        projetoId: p.id,
        contratoId: null,
        reuniaoId: null,
        arquivoId: null,
        usuarioId: p.responsavelId,
      });
    }
    if (p.status === "concluido") {
      push({
        tipo: "projeto-concluido",
        titulo: "Projeto concluído",
        descricao: p.nome,
        data: p.prazo,
        hora: "17:00",
        clienteId: p.clienteId,
        projetoId: p.id,
        contratoId: null,
        reuniaoId: null,
        arquivoId: null,
        usuarioId: p.responsavelId,
      });
    }
  });

  contracts.forEach((c) => {
    push({
      tipo: "contrato-enviado",
      titulo: "Contrato enviado",
      descricao: c.numeroContrato,
      data: c.dataCriacao,
      hora: "11:30",
      clienteId: c.clienteId,
      projetoId: c.projetoId,
      contratoId: c.id,
      reuniaoId: null,
      arquivoId: null,
      usuarioId: null,
    });
    if (c.assinado && c.dataAssinatura) {
      push({
        tipo: "contrato-assinado",
        titulo: "Contrato assinado",
        descricao: c.numeroContrato,
        data: c.dataAssinatura,
        hora: "15:45",
        clienteId: c.clienteId,
        projetoId: c.projetoId,
        contratoId: c.id,
        reuniaoId: null,
        arquivoId: null,
        usuarioId: null,
      });
    }
  });

  finance
    .filter((f) => f.tipo === "receita" && f.status === "pago")
    .forEach((f) => {
      push({
        tipo: "pagamento-recebido",
        titulo: "Pagamento recebido",
        descricao: f.descricao,
        data: f.data,
        hora: "10:30",
        clienteId: f.clienteId,
        projetoId: null,
        contratoId: f.contratoId,
        reuniaoId: null,
        arquivoId: null,
        usuarioId: users.find((u) => u.role === "financeiro")?.id ?? null,
      });
    });

  finance
    .filter((f) => f.tipo === "receita" && (f.status === "pendente" || f.status === "atrasado"))
    .forEach((f) => {
      push({
        tipo: "pagamento-pendente",
        titulo: "Pagamento pendente",
        descricao: f.descricao,
        data: f.data,
        hora: "14:15",
        clienteId: f.clienteId,
        projetoId: null,
        contratoId: f.contratoId,
        reuniaoId: null,
        arquivoId: null,
        usuarioId: users.find((u) => u.role === "financeiro")?.id ?? null,
      });
    });

  meetings
    .filter((m) => m.status === "concluida")
    .forEach((m) => {
      push({
        tipo: "reuniao-realizada",
        titulo: "Reunião realizada",
        descricao: m.titulo,
        data: m.data,
        hora: m.inicio,
        clienteId: m.clienteId,
        projetoId: m.projetoId,
        contratoId: null,
        reuniaoId: m.id,
        arquivoId: null,
        usuarioId: m.participantes[0]?.userId ?? null,
      });
    });

  briefings.forEach((b) => {
    push({
      tipo: "briefing-criado",
      titulo: "Briefing criado",
      descricao: `Briefing do projeto ${b.projetoId}`,
      data: b.criadoEm,
      hora: "14:00",
      clienteId: b.clienteId,
      projetoId: b.projetoId,
      contratoId: null,
      reuniaoId: null,
      arquivoId: null,
      usuarioId: null,
    });
  });

  files.forEach((f) => {
    push({
      tipo: "arquivo-enviado",
      titulo: "Arquivo enviado",
      descricao: f.nome,
      data: f.criadoEm,
      hora: "16:20",
      clienteId: f.clienteId,
      projetoId: f.projetoId,
      contratoId: null,
      reuniaoId: null,
      arquivoId: f.id,
      usuarioId: null,
    });
  });

  tasks
    .filter((t) => t.status === "concluida" && t.concluidoEm)
    .forEach((t) => {
      push({
        tipo: "tarefa-concluida",
        titulo: "Tarefa concluída",
        descricao: t.titulo,
        data: t.concluidoEm!,
        hora: "18:00",
        clienteId: t.clienteId,
        projetoId: t.projetoId,
        contratoId: null,
        reuniaoId: null,
        arquivoId: null,
        usuarioId: t.responsavelId,
      });
    });

  return events.sort((a, b) => (a.data < b.data ? 1 : -1)).slice(0, 250);
}

function buildReports(
  finance: MockFinanceMovement[],
  clients: MockClient[],
  projects: MockProject[]
): MockReports {
  const monthly = MONTHS.map((mes, i) => {
    const receitas = finance
      .filter((f) => f.tipo === "receita" && f.status === "pago" && new Date(f.data).getMonth() === i)
      .reduce((s, f) => s + f.valor, 0);
    const despesas = finance
      .filter((f) => f.tipo === "despesa" && new Date(f.data).getMonth() === i)
      .reduce((s, f) => s + f.valor, 0);
    return { mes, receitas, despesas, lucro: receitas - despesas };
  });

  const faturamentoMensal = monthly.map((m) => ({ mes: m.mes, valor: m.receitas }));
  const despesasMensal = monthly.map((m) => ({ mes: m.mes, valor: m.despesas }));
  const lucroMensal = monthly.map((m) => ({ mes: m.mes, valor: m.lucro }));

  const totalReceita = faturamentoMensal.reduce((s, m) => s + m.valor, 0);
  const totalDespesa = despesasMensal.reduce((s, m) => s + m.valor, 0);
  const margemMedia =
    totalReceita > 0 ? Math.round(((totalReceita - totalDespesa) / totalReceita) * 100) : 0;

  const concluidos = projects.filter((p) => p.status === "concluido");
  const tempoMedioEntrega =
    concluidos.length > 0
      ? Math.round(
          concluidos.reduce((sum, p) => {
            const dias =
              (new Date(p.prazo).getTime() - new Date(p.dataInicio).getTime()) / 86_400_000;
            return sum + dias;
          }, 0) / concluidos.length
        )
      : 0;

  const prospects = clients.filter((c) => c.status === "prospecto").length;
  const ativos = clients.filter((c) => c.status === "ativo").length;
  const taxaBase = prospects + ativos > 0 ? Math.round((ativos / (prospects + ativos)) * 100) : 0;

  return {
    faturamentoMensal,
    lucroMensal,
    receitasMensal: faturamentoMensal,
    despesasMensal,
    conversaoMensal: MONTHS.map((mes, i) => ({
      mes,
      taxa: Math.max(0, Math.min(100, taxaBase + (i % 5) - 2)),
    })),
    novosClientesMensal: MONTHS.map((mes, i) => ({
      mes,
      quantidade: clients.filter((c) => new Date(c.criadoEm).getMonth() === i).length,
    })),
    projetosEntreguesMensal: MONTHS.map((mes, i) => ({
      mes,
      quantidade: projects.filter(
        (p) => p.status === "concluido" && new Date(p.prazo).getMonth() === i
      ).length,
    })),
    tempoMedioEntrega,
    margemMedia,
  };
}

function buildNotifications(users: MockUser[]): MockNotification[] {
  const admin = users.find((u) => u.role === "administrador")!;
  const types: MockNotification["tipo"][] = ["info", "success", "warning", "error"];

  return Array.from({ length: 12 }, (_, i) => ({
    id: padId("ntf", i + 1),
    titulo: pick(["Nova tarefa", "Contrato assinado", "Pagamento recebido", "Reunião amanhã"], i),
    mensagem: pick(
      [
        "Uma nova tarefa foi atribuída a você.",
        "O cliente assinou o contrato.",
        "Pagamento confirmado no financeiro.",
        "Lembrete de reunião agendada.",
      ],
      i
    ),
    tipo: pick(types, i),
    lida: i > 2,
    criadoEm: isoDate(2024, 7, 1 + (i % 7)),
    link: i % 2 === 0 ? "/contratos" : null,
    usuarioId: admin.id,
  }));
}

function buildSettings(): MockSettings {
  return {
    empresa: {
      nome: "Norax",
      razaoSocial: "Norax Digital Ltda",
      cnpj: "12.345.678/0001-90",
      email: "contato@norax.dev",
      telefone: "(11) 3000-0000",
      endereco: "Av. Paulista, 1000 — Bela Vista, São Paulo — SP",
      banco: "Banco Inter",
      agencia: "0001",
      conta: "12345678-9",
      chavePix: "financeiro@norax.dev",
      destinatarioPix: "Norax Digital Ltda",
    },
    preferencias: {
      tema: "dark",
      idioma: "pt-BR",
      fusoHorario: "America/Sao_Paulo",
      notificacoesEmail: true,
      notificacoesPush: true,
    },
    integracoes: {
      stripe: true,
      clicksign: true,
      googleCalendar: true,
      slack: false,
    },
  };
}

function buildDashboard(
  clients: MockClient[],
  projects: MockProject[],
  contracts: MockContract[],
  meetings: MockMeeting[],
  briefings: MockBriefing[],
  tasks: MockTask[],
  finance: MockFinanceMovement[],
  notifications: MockNotification[],
  reports: MockReports,
  users: MockUser[]
): MockDashboard {
  const referenceDate = meetings.reduce(
    (latest, m) => (m.data > latest ? m.data : latest),
    meetings[0]?.data ?? isoDate(2024, 7, 8)
  );
  const currentMonth = new Date(referenceDate).getMonth();

  const receitaMes = finance
    .filter(
      (f) =>
        f.tipo === "receita" &&
        f.status === "pago" &&
        new Date(f.data).getMonth() === currentMonth
    )
    .reduce((s, f) => s + f.valor, 0);

  const despesasMes = finance
    .filter((f) => f.tipo === "despesa" && new Date(f.data).getMonth() === currentMonth)
    .reduce((s, f) => s + f.valor, 0);

  const admin = users.find((u) => u.role === "administrador")!;

  return {
    totalClientes: clients.length,
    clientesAtivos: clients.filter((c) => c.status === "ativo").length,
    projetosAtivos: projects.filter(
      (p) => p.status === "em-andamento" || p.status === "planejamento"
    ).length,
    projetosConcluidos: projects.filter((p) => p.status === "concluido").length,
    receitaTotal: finance
      .filter((f) => f.tipo === "receita" && f.status === "pago")
      .reduce((s, f) => s + f.valor, 0),
    receitaMes,
    despesasMes,
    lucroMes: receitaMes - despesasMes,
    contratosAtivos: contracts.filter(
      (c) => c.status === "assinado" || c.status === "finalizado"
    ).length,
    contratosAguardandoAssinatura: contracts.filter(
      (c) => c.status === "aguardando-assinatura"
    ).length,
    reunioesHoje: meetings.filter((m) => m.data === referenceDate).length,
    reunioesSemana: meetings.filter((m) => {
      const diff = Math.abs(new Date(m.data).getTime() - new Date(referenceDate).getTime());
      return diff <= 7 * 86_400_000;
    }).length,
    briefingsTotal: briefings.length,
    tasksPendentes: tasks.filter((t) => t.status === "pendente" || t.status === "em-andamento")
      .length,
    tasksConcluidas: tasks.filter((t) => t.status === "concluida").length,
    margemMedia: reports.margemMedia,
    notificacoesNaoLidas: notifications.filter((n) => !n.lida).length,
    user: {
      name: admin.nome.split(" ")[0],
      role: admin.roleLabel,
      initials: admin.initials,
      email: admin.email,
    },
    notifications,
  };
}

export function buildMockSeedData(): MockSeedData {
  const users = buildUsers();
  const clients = buildClients(users);
  const projects = buildProjects(clients, users);
  const briefings = buildBriefings(projects);
  linkBriefings(projects, briefings);
  const contracts = buildContracts(projects);
  linkContracts(projects, contracts);
  enrichClients(clients, projects);
  const meetings = buildMeetings(projects, users, briefings);
  const finance = buildFinance(clients, contracts);
  const tasks = buildTasks(projects, clients, users);
  const files = buildFiles(projects);
  const timeline = buildTimeline(
    clients,
    projects,
    contracts,
    meetings,
    files,
    briefings,
    tasks,
    finance,
    users
  );
  const notifications = buildNotifications(users);
  const settings = buildSettings();
  const reports = buildReports(finance, clients, projects);
  const dashboard = buildDashboard(
    clients,
    projects,
    contracts,
    meetings,
    briefings,
    tasks,
    finance,
    notifications,
    reports,
    users
  );

  return {
    users,
    clients,
    projects,
    contracts,
    meetings,
    briefings,
    finance,
    tasks,
    files,
    timeline,
    notifications,
    settings,
    reports,
    dashboard,
  };
}

/** Recalcula dashboard e relatórios a partir dos dados atuais do seed */
export function recomputeDerivedState(data: MockSeedData): void {
  data.reports = buildReports(data.finance, data.clients, data.projects);
  data.dashboard = buildDashboard(
    data.clients,
    data.projects,
    data.contracts,
    data.meetings,
    data.briefings,
    data.tasks,
    data.finance,
    data.notifications,
    data.reports,
    data.users
  );
}
