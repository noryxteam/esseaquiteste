import type { MeetingAnalysisResult, MeetingTranscriptEntry } from "@/modules/meeting-ai/types";
import { getMeetingIntelligence } from "@/lib/mock-data/meeting-intelligence";
import { mockBriefing, mockDecisions, mockExecutiveSummary, mockTasks } from "@/modules/meeting-ai/mock";

/**
 * Ponto de entrada futuro para análise de reuniões via IA.
 * Hoje retorna dados mockados; amanhã delega ao provider ativo.
 */
export async function analyzeMeeting(
  transcript: MeetingTranscriptEntry[],
  meetingId?: string
): Promise<MeetingAnalysisResult> {
  void transcript;

  if (meetingId) {
    const meeting = getMeetingIntelligence(meetingId);
    if (meeting) {
      const { analysis } = meeting;
      return {
        summary: analysis.summary,
        objectives: analysis.objectives,
        decisions: analysis.decisions,
        pending: analysis.pending,
        nextSteps: analysis.nextSteps.map((s) => ({
          description: s.description,
          responsible: s.assignee,
          date: s.dueDate,
        })),
        keywords: analysis.keywords,
        sentiment: analysis.sentiment,
        generatedTasks: analysis.generatedTasks.map((t) => ({
          id: t.id,
          title: t.description,
          description: t.description,
          priority: "medium" as const,
          responsible: t.assignee,
          responsibleInitials: t.assigneeInitials,
          deadline: t.dueDate,
          status: t.completed ? ("completed" as const) : ("pending" as const),
        })),
        participants: analysis.participants.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          company: p.company,
          initials: p.initials,
        })),
        risks: analysis.risks,
        observations: analysis.observations,
        scope: analysis.scope,
        checklist: analysis.checklist,
        speakingTime: analysis.speakingTime,
        importantQuestions: analysis.importantQuestions,
        actionItems: analysis.actionItems,
      };
    }
  }

  return {
    summary: mockExecutiveSummary,
    objectives: mockBriefing.objectives,
    decisions: mockDecisions.map((d) => d.title),
    pending: mockBriefing.pending,
    nextSteps: mockBriefing.nextSteps,
    keywords: mockBriefing.objectives,
    sentiment: {
      overall: "positivo",
      overallDescription: "Mock",
      timeline: [],
    },
    generatedTasks: mockTasks,
    participants: mockBriefing.participants,
    risks: mockBriefing.risks,
    observations: mockBriefing.observations,
  };
}

export function getMeetingAnalysis(meetingId: string) {
  const meeting = getMeetingIntelligence(meetingId);
  if (!meeting) return null;
  return meeting.analysis;
}
