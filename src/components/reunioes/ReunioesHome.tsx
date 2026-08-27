"use client";

import { startTransition, useMemo, useState } from "react";
import { reunioesData } from "@/lib/mock-data/reunioes";
import type { Meeting, MeetingTab, MeetingType } from "@/lib/mock-data/reunioes-types";
import { MeetingHeader } from "@/components/reunioes/MeetingHeader";
import { MeetingStats } from "@/components/reunioes/MeetingStats";
import { SearchBar } from "@/components/reunioes/SearchBar";
import { MeetingTabs } from "@/components/reunioes/MeetingTabs";
import { MeetingFilters } from "@/components/reunioes/MeetingFilters";
import { MeetingTimeline } from "@/components/reunioes/MeetingTimeline";
import { MeetingCard } from "@/components/reunioes/MeetingCard";
import { MeetingHistory } from "@/components/reunioes/MeetingHistory";
import { UpcomingMeetingsCard } from "@/components/reunioes/UpcomingMeetingsCard";
import { MeetingSummaryCard } from "@/components/reunioes/MeetingSummaryCard";
import { QuickNotesCard } from "@/components/reunioes/QuickNotesCard";
import { useFeedback } from "@/contexts/feedback-context";

interface ReunioesHomeProps {
  data?: typeof reunioesData;
}

const MEETING_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "planejamento", label: "Planejamento" },
  { value: "revisao", label: "Revisão" },
  { value: "apresentacao", label: "Apresentação" },
  { value: "interna", label: "Interna" },
  { value: "comercial", label: "Comercial" },
];

function getMeetingsForTab(data: typeof reunioesData, tab: MeetingTab): Meeting[] {
  switch (tab) {
    case "agenda":
      return data.timelineMeetings;
    case "todas":
      return data.allMeetings;
    case "minhas":
      return data.myMeetings;
  }
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateToBR(date: Date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function matchesSearch(meeting: Meeting, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    meeting.title.toLowerCase().includes(q) ||
    meeting.project.toLowerCase().includes(q) ||
    meeting.client.toLowerCase().includes(q) ||
    meeting.lead.name.toLowerCase().includes(q) ||
    meeting.participants.some((p) => p.name.toLowerCase().includes(q))
  );
}

export function ReunioesHome({ data = reunioesData }: ReunioesHomeProps) {
  const { showInfo } = useFeedback();
  const today = useMemo(() => new Date(2024, 6, 8), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState<MeetingTab>("agenda");
  const [selectedMeetingId, setSelectedMeetingId] = useState(data.selectedMeetingId);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<string | null>(null);

  const tabMeetings = getMeetingsForTab(data, activeTab);

  const leadOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const m of tabMeetings) {
      if (!seen.has(m.lead.name)) seen.set(m.lead.name, m.lead.name);
    }
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [tabMeetings]);

  const meetings = useMemo(() => {
    const dateStr = dateToBR(selectedDate);
    return tabMeetings.filter((m) => {
      if (m.date !== dateStr) return false;
      if (typeFilter && m.type !== (typeFilter as MeetingType)) return false;
      if (leadFilter && m.lead.name !== leadFilter) return false;
      if (!matchesSearch(m, searchQuery)) return false;
      return true;
    });
  }, [tabMeetings, selectedDate, typeFilter, leadFilter, searchQuery]);

  const selectedMeeting = useMemo(
    () => meetings.find((m) => m.id === selectedMeetingId) ?? meetings.find((m) => m.status === "em-andamento"),
    [meetings, selectedMeetingId]
  );

  const isToday = isSameDay(selectedDate, today);

  const shiftDay = (delta: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + delta);
      return next;
    });
  };

  const handleTabChange = (tab: MeetingTab) => {
    startTransition(() => setActiveTab(tab));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
      <div className="flex-1 min-w-0 space-y-5">
        <MeetingHeader />
        <MeetingStats stats={data.stats} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <MeetingTabs active={activeTab} onChange={handleTabChange} />
        <MeetingFilters
          dateLabel={formatDateLabel(selectedDate)}
          isToday={isToday}
          onPrevDay={() => shiftDay(-1)}
          onNextDay={() => shiftDay(1)}
          onToday={() => setSelectedDate(today)}
          view={viewMode}
          onViewChange={setViewMode}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          leadFilter={leadFilter}
          onLeadFilterChange={setLeadFilter}
          typeOptions={MEETING_TYPE_OPTIONS}
          leadOptions={leadOptions}
          onMoreFilters={() => showInfo("Filtros avançados em breve.")}
        />

        <div className="rounded-lg border border-border-subtle bg-surface/30 p-4 sm:p-6">
          {meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma reunião encontrada para esta data.
            </p>
          ) : viewMode === "grid" ? (
            <MeetingTimeline
              meetings={meetings}
              selectedId={selectedMeetingId}
              onSelect={setSelectedMeetingId}
            />
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  isActive={meeting.id === selectedMeetingId}
                  compact
                  onClick={() => setSelectedMeetingId(meeting.id)}
                />
              ))}
            </div>
          )}
        </div>

        <MeetingHistory meetings={data.recentMeetings} />
      </div>

      <aside className="w-full xl:w-[280px] shrink-0 space-y-4 xl:sticky xl:top-20 xl:self-start">
        <UpcomingMeetingsCard meetings={data.upcoming} />
        <MeetingSummaryCard meeting={selectedMeeting} />
        <QuickNotesCard notes={data.quickNotes} />
      </aside>
    </div>
  );
}
