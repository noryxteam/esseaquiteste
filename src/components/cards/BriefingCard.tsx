import { FileText } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { cn } from "@/lib/utils";

export interface BriefingSection {
  title: string;
  content: string | React.ReactNode;
}

export interface BriefingCardProps {
  title: string;
  subtitle?: string;
  sections?: BriefingSection[];
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function BriefingCard({ title, subtitle, sections, children, icon, className }: BriefingCardProps) {
  return (
    <BaseCard className={cn("space-y-5", className)}>
      <div className="flex items-center gap-2">
        {icon ?? <FileText className="h-4 w-4 text-muted-foreground" />}
        <div>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {sections?.map((section) => (
        <div key={section.title}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          <div className="mt-2 text-xs leading-relaxed text-foreground/90">
            {typeof section.content === "string" ? <p>{section.content}</p> : section.content}
          </div>
        </div>
      ))}

      {children}
    </BaseCard>
  );
}
