import type { MeetingType } from "@/lib/mock-data/reunioes-types";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<MeetingType, { dot: string; text: string }> = {
  planejamento: { dot: "bg-white/60", text: "text-foreground/70" },
  revisao: { dot: "bg-state-purple/80", text: "text-foreground/70" },
  apresentacao: { dot: "bg-state-orange/80", text: "text-foreground/70" },
  interna: { dot: "bg-state-blue/80", text: "text-foreground/70" },
  comercial: { dot: "bg-state-green/80", text: "text-foreground/70" },
};

interface MeetingBadgeProps {
  type: MeetingType;
  label: string;
  className?: string;
}

export function MeetingBadge({ type, label, className }: MeetingBadgeProps) {
  const styles = TYPE_STYLES[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-medium whitespace-nowrap",
        styles.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", styles.dot)} />
      {label}
    </span>
  );
}
