import type {
  MeetingAudio,
  MeetingBriefing,
  MeetingDecision,
  MeetingInsight,
  MeetingParticipant,
  MeetingSession,
  MeetingTask,
  MeetingTimelineEvent,
  MeetingTranscriptEntry,
} from "@/modules/meeting-ai/types";

export const MOCK_MEETING_ID = "infinity-store";

export const mockParticipants: MeetingParticipant[] = [
  { id: "p1", name: "Murilo Lima", role: "Account Manager", company: "Norax", initials: "ML", isHost: true },
  { id: "p2", name: "João Santos", role: "Diretor", company: "Infinity Store", initials: "JS" },
  { id: "p3", name: "Ana Silva", role: "Designer", company: "Norax", initials: "AS" },
  { id: "p4", name: "Pedro Costa", role: "Programador", company: "Norax", initials: "PC" },
];

export const mockSession: MeetingSession = {
  id: MOCK_MEETING_ID,
  title: "Reunião com Infinity Store — Kickoff do site institucional",
  startedAt: "2024-05-20T09:00:00",
  endedAt: "2024-05-20T09:55:00",
  durationMinutes: 55,
  participants: mockParticipants,
};

export const mockAudio: MeetingAudio = {
  id: "audio-infinity-store-001",
  duration: 3300,
  size: 48_200_000,
  format: "webm",
  language: "pt-BR",
  sampleRate: 48000,
  participants: mockParticipants.map((p) => p.id),
  status: "processed",
  createdAt: "2024-05-20T09:55:12",
};

export const mockTimeline: MeetingTimelineEvent[] = [
  { id: "e1", time: "09:00", label: "Reunião iniciada", type: "system" },
  { id: "e2", time: "09:02", label: "João entrou", type: "join" },
  { id: "e3", time: "09:05", label: "Ana entrou", type: "join" },
  { id: "e4", time: "09:08", label: "Pedro entrou", type: "join" },
  { id: "e5", time: "09:15", label: "Discussão sobre objetivos do site", type: "system" },
  { id: "e6", time: "09:32", label: "Compartilhamento de tela", type: "share" },
  { id: "e7", time: "09:41", label: "Aprovação da estrutura do projeto", type: "decision" },
  { id: "e8", time: "09:48", label: "Definição de prazos e entregas", type: "decision" },
  { id: "e9", time: "09:54", label: "Reunião encerrada", type: "system" },
];

export const mockTranscript: MeetingTranscriptEntry[] = [
  { id: "t1", speaker: "Murilo Lima", speakerRole: "Norax", text: "Bom dia a todos. Vamos iniciar o kickoff do site institucional da Infinity Store.", startTime: "00:00:15", endTime: "00:00:28", confidence: 0.97 },
  { id: "t2", speaker: "João Santos", speakerRole: "Infinity Store", text: "Perfeito. Nossa prioridade é transmitir mais autoridade e melhorar a conversão no digital.", startTime: "00:01:02", endTime: "00:01:18", confidence: 0.95 },
  { id: "t3", speaker: "Ana Silva", speakerRole: "Norax", text: "Pensei em um layout clean, tipografia forte e bastante espaço em branco. Algo premium.", startTime: "00:05:40", endTime: "00:05:58", confidence: 0.96 },
  { id: "t4", speaker: "João Santos", speakerRole: "Infinity Store", text: "Gostei. Também precisamos de uma área do cliente e integração com WhatsApp.", startTime: "00:08:12", endTime: "00:08:30", confidence: 0.94 },
  { id: "t5", speaker: "Pedro Costa", speakerRole: "Norax", text: "A integração com WhatsApp pode ficar na fase 2. Primeiro entregamos o institucional com blog e SEO.", startTime: "00:12:05", endTime: "00:12:28", confidence: 0.93 },
  { id: "t6", speaker: "João Santos", speakerRole: "Infinity Store", text: "Faz sentido. SEO é crítico para nós. Queremos ranquear nos principais termos do segmento.", startTime: "00:18:20", endTime: "00:18:38", confidence: 0.96 },
  { id: "t7", speaker: "Murilo Lima", speakerRole: "Norax", text: "Vou compartilhar a estrutura proposta com sitemap, páginas e cronograma de 8 semanas.", startTime: "00:22:10", endTime: "00:22:30", confidence: 0.98 },
  { id: "t8", speaker: "João Santos", speakerRole: "Infinity Store", text: "Aprovado. O prazo funciona. Só preciso enviar o logo em vetor e as imagens do catálogo.", startTime: "00:35:45", endTime: "00:36:05", confidence: 0.95 },
  { id: "t9", speaker: "Ana Silva", speakerRole: "Norax", text: "Com os materiais, iniciamos o wireframe em até 3 dias úteis.", startTime: "00:41:10", endTime: "00:41:25", confidence: 0.97 },
  { id: "t10", speaker: "Pedro Costa", speakerRole: "Norax", text: "Sobre hospedagem, recomendo Vercel com domínio na Cloudflare. Posso configurar o ambiente.", startTime: "00:45:30", endTime: "00:45:55", confidence: 0.94 },
  { id: "t11", speaker: "João Santos", speakerRole: "Infinity Store", text: "Ainda não definimos hospedagem. Vou alinhar com o time e retorno até sexta.", startTime: "00:48:00", endTime: "00:48:18", confidence: 0.92 },
  { id: "t12", speaker: "Murilo Lima", speakerRole: "Norax", text: "Combinado. Envio a ata com decisões, pendências e próximos passos ainda hoje.", startTime: "00:52:40", endTime: "00:52:58", confidence: 0.98 },
];

export const mockTasks: MeetingTask[] = [
  { id: "tk1", title: "Criar wireframe do site", description: "Wireframe completo das páginas institucionais", priority: "high", responsible: "Ana Silva", responsibleInitials: "AS", deadline: "23/05/2024", status: "pending" },
  { id: "tk2", title: "Enviar proposta comercial", description: "Atualizar proposta com escopo aprovado", priority: "high", responsible: "Murilo Lima", responsibleInitials: "ML", deadline: "22/05/2024", status: "pending" },
  { id: "tk3", title: "Configurar ambiente", description: "Setup de hospedagem e domínio", priority: "medium", responsible: "Pedro Costa", responsibleInitials: "PC", deadline: "27/05/2024", status: "pending" },
  { id: "tk4", title: "Enviar logo em vetor", description: "Material do cliente para design", priority: "urgent", responsible: "João Santos", responsibleInitials: "JS", deadline: "24/05/2024", status: "pending" },
  { id: "tk5", title: "Mapear palavras-chave SEO", description: "Pesquisa de termos do segmento", priority: "medium", responsible: "Murilo Lima", responsibleInitials: "ML", deadline: "28/05/2024", status: "pending" },
  { id: "tk6", title: "Agendar validação wireframe", description: "Reunião de aprovação com cliente", priority: "medium", responsible: "Murilo Lima", responsibleInitials: "ML", deadline: "30/05/2024", status: "pending" },
];

export const mockDecisions: MeetingDecision[] = [
  { id: "d1", title: "Estrutura aprovada", description: "Sitemap e páginas do site institucional aprovados pelo cliente.", responsible: "João Santos", date: "20/05/2024", impact: "high" },
  { id: "d2", title: "Layout premium definido", description: "Direção visual clean com tipografia forte aprovada.", responsible: "Ana Silva", date: "20/05/2024", impact: "medium" },
  { id: "d3", title: "Prazo de 8 semanas", description: "Cronograma de entrega aprovado para lançamento no segundo semestre.", responsible: "Murilo Lima", date: "20/05/2024", impact: "high" },
  { id: "d4", title: "WhatsApp na fase 2", description: "Integração com WhatsApp adiada para segunda fase do projeto.", responsible: "Pedro Costa", date: "20/05/2024", impact: "medium" },
];

export const mockInsights: MeetingInsight[] = [
  { id: "i1", type: "important", title: "SEO é prioridade do cliente", description: "Cliente enfatizou ranqueamento orgânico como objetivo crítico." },
  { id: "i2", type: "risk", title: "Hospedagem indefinida", description: "Cliente ainda não definiu provedor de hospedagem — pode atrasar deploy." },
  { id: "i3", type: "pending", title: "Materiais pendentes", description: "Logo em vetor e imagens do catálogo aguardando envio." },
  { id: "i4", type: "suggestion", title: "Blog para SEO", description: "Sugerir calendário editorial para acelerar ranqueamento." },
  { id: "i5", type: "improvement", title: "Área do cliente", description: "Considerar portal de acompanhamento na fase 2." },
];

export const mockBriefing: MeetingBriefing = {
  title: "Briefing — Site Institucional Infinity Store",
  project: "Site Institucional",
  client: "Infinity Store",
  responsible: "Murilo Lima",
  participants: mockParticipants,
  executiveSummary:
    "Reunião de kickoff de 55 minutos com a Infinity Store para alinhamento do novo site institucional. Cliente busca transmitir autoridade digital, melhorar conversão e integrar WhatsApp. Aprovada estrutura com blog, SEO e área do cliente. Prazo de 8 semanas confirmado. Pendências de materiais e definição de hospedagem.",
  objectives: [
    "Transmitir mais autoridade no digital",
    "Melhorar taxa de conversão",
    "Criar área do cliente",
    "Integrar WhatsApp (fase 2)",
    "Ranquear nos principais termos de SEO",
  ],
  discussedTopics: [
    "Objetivos do site institucional",
    "Direção visual e layout premium",
    "Estrutura de páginas e sitemap",
    "Integração WhatsApp e fases do projeto",
    "SEO e estratégia de conteúdo",
    "Hospedagem e domínio",
    "Cronograma e entregas",
  ],
  decisions: mockDecisions,
  pending: [
    "Cliente enviar logo em vetor",
    "Cliente enviar imagens do catálogo",
    "Cliente definir hospedagem",
    "Cliente enviar acesso ao domínio",
  ],
  nextSteps: [
    { description: "Enviar wireframe inicial", responsible: "Ana Silva", date: "23/05/2024" },
    { description: "Enviar proposta atualizada", responsible: "Murilo Lima", date: "22/05/2024" },
    { description: "Configurar ambiente de staging", responsible: "Pedro Costa", date: "27/05/2024" },
    { description: "Reunião de validação do wireframe", responsible: "Murilo Lima", date: "30/05/2024" },
  ],
  tasks: mockTasks,
  observations: [
    "Cliente demonstrou urgência para lançamento no segundo semestre",
    "Tom da reunião foi positivo e colaborativo",
    "Compartilhamento de tela utilizado para apresentar sitemap",
  ],
  risks: [
    "Atraso no envio de materiais pelo cliente",
    "Indefinição de hospedagem pode impactar cronograma de deploy",
  ],
  date: "20 de Maio, 2024",
  time: "09:00 – 09:55",
  duration: "55 minutos",
  version: "1.0",
};

export const mockExecutiveSummary =
  "Reunião de kickoff de 55 minutos com a Infinity Store. Aprovada estrutura do site institucional com foco em autoridade digital, conversão e SEO. Prazo de 8 semanas confirmado. Pendências: envio de logo, imagens e definição de hospedagem. Próximos passos incluem wireframe, proposta comercial e validação com cliente.";

export function countWords(transcript: MeetingTranscriptEntry[]): number {
  return transcript.reduce((acc, entry) => acc + entry.text.split(/\s+/).length, 0);
}
