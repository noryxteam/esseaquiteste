import type { MeetingIntelligenceData } from "@/lib/mock-data/meeting-intelligence-types";

const infinityStoreMeeting: MeetingIntelligenceData = {
  id: "infinity-store",
  title: "Reunião com Infinity Store",
  status: "concluida",
  statusLabel: "Concluída",
  date: "2024-05-20",
  dateLabel: "20 de Maio, 2024",
  startTime: "14:00",
  endTime: "15:32",
  duration: "1h 32min",
  participants: [
    { id: "p1", name: "João", company: "Infinity Store", initials: "JS", role: "Cliente" },
    { id: "p2", name: "Murilo", company: "Norax", initials: "ML", role: "Account" },
    { id: "p3", name: "Ana", company: "Norax", initials: "AS", role: "Design" },
    { id: "p4", name: "Carlos", company: "Infinity Store", initials: "CM", role: "Marketing" },
    { id: "p5", name: "Julia", company: "Norax", initials: "JC", role: "Dev" },
  ],
  videos: [
    {
      id: "v1",
      name: "João",
      initials: "JS",
      isRecording: true,
    },
    {
      id: "v2",
      name: "Murilo",
      initials: "ML",
    },
  ],
  transcript: [
    {
      id: "t1",
      timestamp: "00:02:15",
      speakerName: "João",
      speakerCompany: "Infinity Store",
      message:
        "Bom, a ideia é ter um site que transmita mais autoridade. Hoje sentimos que a marca não passa a confiança que precisamos no digital.",
    },
    {
      id: "t2",
      timestamp: "00:04:32",
      speakerName: "Murilo",
      speakerCompany: "Norax",
      message:
        "Perfeito, João. Podemos estruturar um site institucional moderno com foco em conversão e uma área do cliente integrada.",
    },
    {
      id: "t3",
      timestamp: "00:08:10",
      speakerName: "João",
      speakerCompany: "Infinity Store",
      message:
        "Também precisamos integrar o WhatsApp para atendimento. A maioria dos nossos clientes chega por lá.",
    },
    {
      id: "t4",
      timestamp: "00:12:45",
      speakerName: "Ana",
      speakerCompany: "Norax",
      message:
        "Podemos trabalhar um layout clean, com tipografia forte e bastante espaço em branco. Algo premium, sem poluição visual.",
    },
    {
      id: "t5",
      timestamp: "00:18:20",
      speakerName: "Carlos",
      speakerCompany: "Infinity Store",
      message: "SEO é prioridade. Queremos ranquear para os principais termos do nosso segmento nos próximos 6 meses.",
    },
    {
      id: "t6",
      timestamp: "00:24:05",
      speakerName: "Murilo",
      speakerCompany: "Norax",
      message:
        "Vamos incluir blog para conteúdo, landing pages para campanhas e toda a estrutura de hospedagem na proposta.",
    },
    {
      id: "t7",
      timestamp: "00:31:40",
      speakerName: "João",
      speakerCompany: "Infinity Store",
      message: "Aprovado. O prazo de 8 semanas funciona para vocês? Precisamos lançar antes do segundo semestre.",
    },
    {
      id: "t8",
      timestamp: "00:38:15",
      speakerName: "Murilo",
      speakerCompany: "Norax",
      message:
        "Sim, com a estrutura definida hoje conseguimos manter o cronograma. Vou enviar a ata com todos os próximos passos.",
    },
    {
      id: "t9",
      timestamp: "00:45:50",
      speakerName: "João",
      speakerCompany: "Infinity Store",
      message: "Vou enviar o logo em vetor e as imagens do catálogo até sexta. Falta só definir a hospedagem.",
    },
    {
      id: "t10",
      timestamp: "00:52:30",
      speakerName: "Julia",
      speakerCompany: "Norax",
      message:
        "Assim que recebermos os materiais, iniciamos o wireframe. A integração com WhatsApp ficará na fase 2 do projeto.",
    },
  ],
  analysis: {
    summary:
      "Reunião de alinhamento com a Infinity Store para definição do novo site institucional. O cliente busca transmitir mais autoridade digital, melhorar conversão e integrar WhatsApp ao fluxo de atendimento. Foi aprovada a estrutura do projeto com prazo de 8 semanas, incluindo blog, landing pages, SEO e área do cliente. Pendências de envio de materiais pelo cliente e definição de hospedagem.",
    objectives: [
      "Transmitir mais autoridade",
      "Melhorar conversão",
      "Criar área do cliente",
      "Integrar WhatsApp",
    ],
    scope: [
      "Site institucional",
      "Blog",
      "Landing pages",
      "Área do cliente",
      "Integração WhatsApp (fase 2)",
    ],
    decisions: [
      "Estrutura aprovada",
      "Novo layout definido",
      "Prazo aprovado (8 semanas)",
      "Integração confirmada",
    ],
    pending: [
      "Cliente enviar logo",
      "Enviar domínio",
      "Enviar imagens",
      "Definir hospedagem",
    ],
    risks: ["Atraso no envio de materiais pelo cliente"],
    nextSteps: [
      {
        id: "ns1",
        description: "Enviar wireframe inicial",
        assignee: "Ana Silva",
        assigneeInitials: "AS",
        dueDate: "21/05",
      },
      {
        id: "ns2",
        description: "Preparar proposta comercial",
        assignee: "Murilo Lima",
        assigneeInitials: "ML",
        dueDate: "22/05",
      },
      {
        id: "ns3",
        description: "Configurar ambiente de hospedagem",
        assignee: "Julia Costa",
        assigneeInitials: "JC",
        dueDate: "24/05",
      },
      {
        id: "ns4",
        description: "Reunião de validação do wireframe",
        assignee: "João Santos",
        assigneeInitials: "JS",
        dueDate: "28/05",
      },
    ],
    keywords: [
      "Site institucional",
      "Landing Page",
      "WhatsApp",
      "SEO",
      "Blog",
      "Área do Cliente",
      "Design",
      "Hospedagem",
    ],
    sentiment: {
      overall: "positivo",
      overallDescription: "Confiante e motivado com o projeto",
      timeline: [
        { label: "Início", value: 55 },
        { label: "Meio", value: 62 },
        { label: "Decisões", value: 78 },
        { label: "Pendências", value: 70 },
        { label: "Encerramento", value: 85 },
      ],
    },
    generatedTasks: [
      {
        id: "gt1",
        description: "Criar wireframe do site institucional",
        assignee: "Ana Silva",
        assigneeInitials: "AS",
        dueDate: "21/05",
        completed: false,
      },
      {
        id: "gt2",
        description: "Enviar proposta comercial atualizada",
        assignee: "Murilo Lima",
        assigneeInitials: "ML",
        dueDate: "22/05",
        completed: false,
      },
      {
        id: "gt3",
        description: "Solicitar logo em vetor ao cliente",
        assignee: "Murilo Lima",
        assigneeInitials: "ML",
        dueDate: "21/05",
        completed: true,
      },
      {
        id: "gt4",
        description: "Definir stack de hospedagem",
        assignee: "Julia Costa",
        assigneeInitials: "JC",
        dueDate: "24/05",
        completed: false,
      },
      {
        id: "gt5",
        description: "Mapear palavras-chave SEO",
        assignee: "Carlos Mendes",
        assigneeInitials: "CM",
        dueDate: "25/05",
        completed: false,
      },
      {
        id: "gt6",
        description: "Agendar reunião de validação",
        assignee: "Murilo Lima",
        assigneeInitials: "ML",
        dueDate: "28/05",
        completed: false,
      },
    ],
    participants: [
      { id: "p1", name: "João", company: "Infinity Store", initials: "JS", role: "Cliente" },
      { id: "p2", name: "Murilo", company: "Norax", initials: "ML", role: "Account" },
      { id: "p3", name: "Ana", company: "Norax", initials: "AS", role: "Design" },
      { id: "p4", name: "Carlos", company: "Infinity Store", initials: "CM", role: "Marketing" },
      { id: "p5", name: "Julia", company: "Norax", initials: "JC", role: "Dev" },
    ],
    observations: ["Cliente demonstrou urgência para lançamento no segundo semestre"],
    checklist: ["Gravação disponível", "Transcrição concluída", "Análise IA processada"],
    speakingTime: [
      { name: "Murilo", minutes: 28 },
      { name: "João", minutes: 24 },
      { name: "Ana", minutes: 15 },
      { name: "Carlos", minutes: 12 },
      { name: "Julia", minutes: 13 },
    ],
    importantQuestions: [
      "Qual o prazo ideal para lançamento?",
      "Como será a integração com WhatsApp?",
    ],
    actionItems: ["Enviar materiais até sexta", "Validar wireframe na próxima semana"],
  },
  meetingInfo: [
    { id: "mi1", label: "Projeto relacionado", value: "Site Institucional", icon: "FolderKanban", status: "none" },
    { id: "mi2", label: "Cliente", value: "Infinity Store", icon: "Building2", status: "none" },
    { id: "mi3", label: "Tipo de reunião", value: "Comercial", icon: "Video", status: "none" },
    { id: "mi4", label: "Gravação", value: "Disponível", icon: "CircleDot", status: "done" },
    { id: "mi5", label: "Transcrição", value: "Concluída", icon: "FileText", status: "done" },
    { id: "mi6", label: "Análise IA", value: "Processada", icon: "Sparkles", status: "done" },
  ],
  nextMeeting: {
    date: "28 de Maio, 2024",
    time: "14:00",
    title: "Validação do wireframe — Infinity Store",
  },
};

const meetingsById: Record<string, MeetingIntelligenceData> = {
  [infinityStoreMeeting.id]: infinityStoreMeeting,
  m1: infinityStoreMeeting,
};

export function getMeetingIntelligence(id: string): MeetingIntelligenceData | null {
  return meetingsById[id] ?? null;
}

export function getAllMeetingIntelligenceIds(): string[] {
  return Object.keys(meetingsById);
}

export const defaultMeetingIntelligence = infinityStoreMeeting;
