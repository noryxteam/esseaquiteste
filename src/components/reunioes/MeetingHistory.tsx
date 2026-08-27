"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import type { Meeting } from "@/lib/mock-data/reunioes-types";
import { MeetingParticipants } from "@/components/reunioes/MeetingParticipants";
import { Button } from "@/components/ui/button-shadcn";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface MeetingHistoryProps {
  meetings: Meeting[];
}

export function MeetingHistory({ meetings }: MeetingHistoryProps) {
  const router = useRouter();

  const handleRowClick = (meeting: Meeting) => {
    router.push(routes.reuniao(meeting.id));
  };

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <h2 className="text-sm font-medium text-foreground">Reuniões recentes</h2>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <Link href={routes.reunioes}>Ver todas</Link>
        </Button>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Reunião</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Projeto / Cliente</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Data</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Duração</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Participantes</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Responsável</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground w-12 text-center">Ata</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr
                key={meeting.id}
                onClick={() => handleRowClick(meeting)}
                className="border-b border-border-subtle last:border-0 transition-colors hover:bg-surface-hover/40 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <Link
                    href={routes.reuniao(meeting.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-medium text-foreground truncate max-w-[180px] block hover:underline"
                  >
                    {meeting.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-foreground/80 truncate max-w-[160px]">{meeting.project}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{meeting.client}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{meeting.date}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                  {meeting.duration}
                </td>
                <td className="px-4 py-3">
                  <MeetingParticipants participants={meeting.participants} max={3} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[9px] font-medium shrink-0">
                      {meeting.lead.initials}
                    </div>
                    <span className="text-xs text-muted-foreground truncate max-w-[100px]">{meeting.lead.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {meeting.hasMinutes ? (
                    <CheckCircle2 className="h-4 w-4 text-state-green mx-auto" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-border-subtle">
        {meetings.map((meeting) => (
          <Link
            key={meeting.id}
            href={routes.reuniao(meeting.id)}
            className="block px-4 py-3 space-y-2 hover:bg-surface-hover/40"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-foreground">{meeting.title}</p>
              {meeting.hasMinutes ? (
                <CheckCircle2 className="h-4 w-4 text-state-green shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {meeting.project} · {meeting.client}
            </p>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{meeting.date}</span>
              <span>{meeting.duration}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
