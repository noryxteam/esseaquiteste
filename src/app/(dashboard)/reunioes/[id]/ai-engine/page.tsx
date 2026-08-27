import { notFound } from "next/navigation";
import { LazyMeetingAIEnginePage } from "@/lib/lazy-pages";
import { getMeetingIntelligence } from "@/lib/mock-data/meeting-intelligence";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingAIEngineRoute({ params }: PageProps) {
  const { id } = await params;
  const meeting = getMeetingIntelligence(id);

  if (!meeting) {
    notFound();
  }

  return <LazyMeetingAIEnginePage meetingId={id} meetingTitle={meeting.title} />;
}
