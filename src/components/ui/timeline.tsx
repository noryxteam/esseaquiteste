import Link from "next/link";
import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events, showLoadMore }: { events: TimelineEvent[]; showLoadMore?: boolean }) {
  if (events.length === 0) {
    return <p className="text-[13px] text-muted-foreground py-2">Nenhum evento registrado.</p>;
  }

  return (
    <div>
      {events.map((event, i) => (
        <div key={event.id} className="flex gap-3 group">
          <div className="flex flex-col items-center pt-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-border-strong ring-2 ring-surface group-hover:bg-foreground transition-colors" />
            {i < events.length - 1 && <div className="w-px flex-1 bg-border min-h-[20px] mt-1" />}
          </div>
          <div className="pb-3.5 flex-1 min-w-0">
            {event.link ? (
              <Link
                href={event.link}
                className="text-[13px] text-foreground-secondary hover:text-foreground transition-colors leading-snug"
              >
                {event.text}
              </Link>
            ) : (
              <p className="text-[13px] text-foreground-secondary leading-snug">{event.text}</p>
            )}
            <p className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">{event.relative}</p>
          </div>
        </div>
      ))}
      {showLoadMore && (
        <button
          type="button"
          className="text-[12px] text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          Carregar mais
        </button>
      )}
    </div>
  );
}
