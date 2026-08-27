import { notFound } from "next/navigation";
import { LazyMeetingIntelligenceHome } from "@/lib/lazy-pages";
import { getMeetingIntelligence } from "@/lib/mock-data/meeting-intelligence";

interface MeetingIntelligencePageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingIntelligencePage({ params }: MeetingIntelligencePageProps) {
  const { id } = await params;
  const meeting = getMeetingIntelligence(id);

  if (!meeting) {
    notFound();
  }

  return <LazyMeetingIntelligenceHome meeting={meeting} />;
}
