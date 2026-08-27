import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  backHref,
  backLabel,
  title,
  subtitle,
  badge,
  actions,
  meta,
}: {
  backHref?: string;
  backLabel?: string;
  title: string;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <header className="mb-5 animate-slide-up">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-3 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {backLabel ?? "Voltar"}
        </Link>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <div className="mt-1 text-[13px] text-muted leading-relaxed">{subtitle}</div>
          )}
          {meta && <div className="mt-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

export function SectionTitle({
  title,
  href,
  linkLabel,
  count,
  className,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between mb-2.5", className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-[10px] font-medium text-muted-foreground bg-surface-elevated px-1.5 py-0.5 rounded">
            {count}
          </span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-[12px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 group"
        >
          {linkLabel}
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
