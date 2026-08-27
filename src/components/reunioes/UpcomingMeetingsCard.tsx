"use client";

import Link from "next/link";
import type { UpcomingMeeting } from "@/lib/mock-data/reunioes-types";
import { routes } from "@/lib/app-routes";

interface UpcomingMeetingsCardProps {
  meetings: UpcomingMeeting[];
}

export function UpcomingMeetingsCard({ meetings }: UpcomingMeetingsCardProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <h3 className="text-xs font-medium text-foreground mb-3">Próximas reuniões</h3>
      <ul className="space-y-3">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <Link
              href={routes.reuniao(meeting.id)}
              className="flex items-start gap-3 rounded-md -mx-1 px-1 py-0.5 hover:bg-surface-hover/60 transition-colors"
            >
              <div className="shrink-0 text-center min-w-[36px]">
                <p className="text-[10px] text-muted-foreground leading-tight">{meeting.dayLabel}</p>
                <p className="text-xs font-medium text-foreground tabular-nums mt-0.5">{meeting.time}</p>
              </div>
              <p className="text-xs text-foreground/80 leading-snug pt-0.5">{meeting.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
