import { BaseCard } from "./BaseCard";
import { cn } from "@/lib/utils";

export interface SummaryItem {
  label: string;
  value: string | number;
}

export interface SummaryCardProps {
  title: string;
  subtitle?: string;
  items?: SummaryItem[];
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function SummaryCard({ title, subtitle, items, footer, children, className }: SummaryCardProps) {
  return (
    <BaseCard className={className}>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {items && items.length > 0 && (
        <dl className="space-y-2.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="font-medium tabular-nums text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children && <div className={cn(items?.length ? "mt-4" : "")}>{children}</div>}
      {footer && <div className="mt-4 border-t border-border-subtle pt-3">{footer}</div>}
    </BaseCard>
  );
}
