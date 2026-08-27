"use client";

import type { ProjectHistoryEntry } from "@/modules/project-workspace/types";
import { formatDateTimeBR } from "@/modules/project-workspace/utils";

interface ProjectHistoryProps {
  entries: ProjectHistoryEntry[];
}

function statusPT(status?: string): string {
  if (!status) return "";
  if (status === "completed") return "Concluído";
  if (status === "in_progress") return "Em andamento";
  if (status === "pending") return "Pendente";
  return status;
}

export function ProjectHistory({ entries }: ProjectHistoryProps) {
  return (
    <section className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border-subtle">
        <h2 className="text-sm font-medium text-foreground">Histórico interno</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Registro automático — visível apenas para a equipe Norax.
        </p>
      </div>
      {entries.length === 0 ? (
        <p className="px-4 py-8 text-center text-xs text-muted-foreground">Sem eventos ainda.</p>
      ) : (
        <ul className="max-h-[320px] overflow-y-auto divide-y divide-border-subtle">
          {entries.map((entry) => (
            <li key={entry.id} className="px-4 py-3 flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/50 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-foreground">{entry.action}</p>
                {(entry.stepName || entry.previousStatus || entry.newStatus) && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {[
                      entry.stepName ? `Etapa: ${entry.stepName}` : null,
                      entry.previousStatus && entry.newStatus
                        ? `${statusPT(entry.previousStatus)} → ${statusPT(entry.newStatus)}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatDateTimeBR(entry.at)} · {entry.userName}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
