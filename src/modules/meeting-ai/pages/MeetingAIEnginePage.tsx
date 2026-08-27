"use client";

import { MeetingAIProvider } from "@/modules/meeting-ai/providers/MeetingAIProvider";
import { MeetingProcessing } from "@/modules/meeting-ai/components/MeetingProcessing";

interface MeetingAIEnginePageProps {
  meetingId: string;
  meetingTitle?: string;
}

export function MeetingAIEnginePage({ meetingId, meetingTitle }: MeetingAIEnginePageProps) {
  return (
    <MeetingAIProvider defaultProvider="mock">
      <MeetingProcessing meetingId={meetingId} meetingTitle={meetingTitle} />
    </MeetingAIProvider>
  );
}
