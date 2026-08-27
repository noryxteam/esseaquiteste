"use client";

import { motion } from "framer-motion";
import type { Meeting } from "@/lib/mock-data/reunioes-types";
import { MeetingCard } from "@/components/reunioes/MeetingCard";
import { cn } from "@/lib/utils";

interface MeetingTimelineProps {
  meetings: Meeting[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

function parseTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function MeetingTimeline({ meetings, selectedId, onSelect }: MeetingTimelineProps) {
  const sorted = [...meetings].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

  return (
    <div className="relative">
      {sorted.map((meeting, index) => {
        const isLast = index === sorted.length - 1;
        const isActive = meeting.id === selectedId;

        return (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className="grid grid-cols-[56px_24px_1fr] sm:grid-cols-[64px_32px_1fr] gap-x-2 sm:gap-x-4"
          >
            <div className="pt-1 text-right pr-1">
              <p className="text-xs font-medium text-foreground tabular-nums">{meeting.startTime}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{meeting.duration}</p>
            </div>

            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "h-2 w-2 rounded-full shrink-0 mt-1.5 z-10",
                  isActive ? "bg-foreground" : "bg-white/30"
                )}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-border-subtle min-h-[60px] mt-1" />
              )}
            </div>

            <div className={cn("pb-6", isLast && "pb-0")}>
              <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-px bg-border-subtle pointer-events-none" />
                <div className="relative pt-0">
                  <MeetingCard
                    meeting={meeting}
                    isActive={isActive}
                    onClick={() => onSelect?.(meeting.id)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
