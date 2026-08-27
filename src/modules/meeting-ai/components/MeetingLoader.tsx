import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingLoaderProps {
  label?: string;
  className?: string;
}

export function MeetingLoader({ label = "Processando...", className }: MeetingLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}>
      <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
