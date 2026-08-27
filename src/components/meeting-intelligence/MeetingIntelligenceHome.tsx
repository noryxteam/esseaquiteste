"use client";

import { startTransition, useMemo, useState } from "react";
import type { MeetingIntelligenceData, MeetingIntelligenceTab } from "@/lib/mock-data/meeting-intelligence-types";
import { MeetingHeader } from "@/components/meeting-intelligence/MeetingHeader";
import { MeetingTabs } from "@/components/meeting-intelligence/MeetingTabs";
import { MeetingVideo } from "@/components/meeting-intelligence/MeetingVideo";
import { MeetingTranscript } from "@/components/meeting-intelligence/MeetingTranscript";
import { AIExecutiveSummary } from "@/components/meeting-intelligence/AIExecutiveSummary";
import { AIObjectives } from "@/components/meeting-intelligence/AIObjectives";
import { AIDecisions } from "@/components/meeting-intelligence/AIDecisions";
import { AIPending } from "@/components/meeting-intelligence/AIPending";
import { AINextSteps } from "@/components/meeting-intelligence/AINextSteps";
import { AIKeywords } from "@/components/meeting-intelligence/AIKeywords";
import { AISentiment } from "@/components/meeting-intelligence/AISentiment";
import { AITasks } from "@/components/meeting-intelligence/AITasks";
import { MeetingInfo } from "@/components/meeting-intelligence/MeetingInfo";
import { NextMeetingCard } from "@/components/meeting-intelligence/NextMeetingCard";
import { cn } from "@/lib/utils";

interface MeetingIntelligenceHomeProps {
  meeting: MeetingIntelligenceData;
}

export function MeetingIntelligenceHome({ meeting }: MeetingIntelligenceHomeProps) {
  const [activeTab, setActiveTab] = useState<MeetingIntelligenceTab>("resumo-ia");
  const [headerSearch, setHeaderSearch] = useState("");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [tasks, setTasks] = useState(meeting.analysis.generatedTasks);

  const filteredTranscript = useMemo(() => {
    const q = transcriptSearch.trim().toLowerCase();
    if (!q) return meeting.transcript;
    return meeting.transcript.filter(
      (msg) =>
        msg.message.toLowerCase().includes(q) ||
        msg.speakerName.toLowerCase().includes(q) ||
        msg.speakerCompany.toLowerCase().includes(q)
    );
  }, [meeting.transcript, transcriptSearch]);

  const handleTabChange = (tab: MeetingIntelligenceTab) => {
    startTransition(() => setActiveTab(tab));
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const { analysis } = meeting;

  return (
    <div className="space-y-5">
      <MeetingHeader
        meeting={meeting}
        searchQuery={headerSearch}
        onSearchChange={setHeaderSearch}
      />

      <MeetingTabs active={activeTab} onChange={handleTabChange} />

      <div className={cn(activeTab !== "resumo-ia" && "hidden")} aria-hidden={activeTab !== "resumo-ia"}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5">
          {/* Coluna 1 — Reunião */}
          <div className="lg:col-span-12 xl:col-span-3 space-y-4">
            <MeetingVideo participants={meeting.videos} />
            <MeetingTranscript
              messages={filteredTranscript}
              searchQuery={transcriptSearch}
              onSearchChange={setTranscriptSearch}
            />
          </div>

          {/* Coluna 2 — Análise IA */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-4">
            <AIExecutiveSummary summary={analysis.summary} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AIObjectives objectives={analysis.objectives} />
              <AIDecisions decisions={analysis.decisions} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AIPending pending={analysis.pending} />
              <AINextSteps nextSteps={analysis.nextSteps} />
            </div>

            <AIKeywords keywords={analysis.keywords} />
            <AISentiment sentiment={analysis.sentiment} />
          </div>

          {/* Coluna 3 — Ações */}
          <div className="lg:col-span-12 xl:col-span-3 space-y-4">
            <AITasks tasks={tasks} onToggle={handleTaskToggle} />
            <MeetingInfo items={meeting.meetingInfo} />
            <NextMeetingCard nextMeeting={meeting.nextMeeting} />
          </div>
        </div>
      </div>

      {activeTab === "transcricao" && (
        <div className="max-w-3xl">
          <MeetingTranscript
            messages={filteredTranscript}
            searchQuery={transcriptSearch}
            onSearchChange={setTranscriptSearch}
          />
        </div>
      )}

      {activeTab === "analise" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AIObjectives objectives={analysis.objectives} />
          <AIDecisions decisions={analysis.decisions} />
          <AIPending pending={analysis.pending} />
          <AINextSteps nextSteps={analysis.nextSteps} />
          <AIKeywords keywords={analysis.keywords} />
          <AISentiment sentiment={analysis.sentiment} />
        </div>
      )}

      {activeTab === "briefing" && (
        <div className="rounded-lg border border-border-subtle bg-surface/60 p-6 space-y-4">
          <p className="text-sm text-foreground font-medium">Briefing da reunião</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{analysis.summary}</p>
          <ul className="space-y-2">
            {analysis.objectives.map((o, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-foreground">•</span> {o}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="max-w-xl">
          <AITasks tasks={tasks} onToggle={handleTaskToggle} />
        </div>
      )}

      {activeTab === "historico" && (
        <div className="rounded-lg border border-border-subtle bg-surface/60 divide-y divide-border-subtle">
          {meeting.transcript.slice(0, 8).map((msg) => (
            <div key={msg.id} className="px-4 py-3">
              <p className="text-xs font-medium">{msg.speakerName}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{msg.timestamp}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
