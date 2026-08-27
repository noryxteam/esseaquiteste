import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";

export interface PageTitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageTitle({ title, description, action, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8",
        className
      )}
    >
      <div>
        <h1 className={tokens.typography.pageTitle}>{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="flex gap-2 shrink-0">{action}</div>}
    </div>
  );
}
