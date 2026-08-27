import { cn } from "@/lib/utils";

interface MeetingProgressProps {
  label: string;
  progress: number;
  className?: string;
}

export function MeetingProgress({ label, progress, className }: MeetingProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const filled = Math.round(clamped / 10);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-[10px] tabular-nums text-muted-foreground">{clamped}%</span>
      </div>
      <div className="font-mono text-[10px] text-foreground/80 tracking-widest">
        {"█".repeat(filled)}
        <span className="text-muted-foreground/40">{"░".repeat(10 - filled)}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-surface-inset overflow-hidden">
        <div
          className="h-full bg-foreground/80 transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
