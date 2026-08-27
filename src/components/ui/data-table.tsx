import Link from "next/link";
import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function DataTableHead({
  children,
  columns,
}: {
  children?: React.ReactNode;
  columns?: string;
}) {
  return (
    <div
      className={cn(
        "hidden md:grid gap-4 px-4 py-2 border-b border-border bg-surface-inset",
        "text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
        columns
      )}
    >
      {children}
    </div>
  );
}

export function DataTableRow({
  children,
  href,
  className,
  columns,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  columns?: string;
}) {
  const classes = cn(
    "grid gap-2 md:gap-4 px-4 py-2.5 border-b border-border-subtle last:border-0 items-center interactive-row",
    columns,
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
