import { Check, FileSignature, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/badges";

export type ContractLifecycleStatus =
  | "rascunho"
  | "aguardando-assinatura"
  | "assinado"
  | "finalizado"
  | "cancelado"
  | "expirado";

const STATUS_MAP: Record<ContractLifecycleStatus, { label: string; status: import("@/components/common/types").EntityStatus }> = {
  rascunho: { label: "Rascunho", status: "draft" },
  "aguardando-assinatura": { label: "Aguardando assinatura", status: "pending" },
  assinado: { label: "Assinado", status: "completed" },
  finalizado: { label: "Finalizado", status: "completed" },
  cancelado: { label: "Cancelado", status: "cancelled" },
  expirado: { label: "Expirado", status: "archived" },
};

interface ContractStatusProps {
  status: ContractLifecycleStatus;
  className?: string;
}

export function ContractStatus({ status, className }: ContractStatusProps) {
  const config = STATUS_MAP[status];
  return <StatusBadge status={config.status} label={config.label} className={className} />;
}

interface ContractSignatureProps {
  signed: boolean;
  signerName?: string;
  signedAt?: string;
  className?: string;
}

export function ContractSignature({ signed, signerName, signedAt, className }: ContractSignatureProps) {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <div className="h-8 w-8 rounded-md bg-surface-elevated border border-border-subtle flex items-center justify-center shrink-0">
        {signed ? <Check className="h-4 w-4 text-foreground/70" /> : <PenLine className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div>
        <p className="text-xs text-foreground">{signed ? "Assinado" : "Pendente de assinatura"}</p>
        {signerName && <p className="text-[10px] text-muted-foreground">{signerName}</p>}
        {signedAt && <p className="text-[10px] text-muted-foreground/70">{signedAt}</p>}
      </div>
    </div>
  );
}

interface ContractViewerProps {
  title: string;
  pages?: number;
  onView?: () => void;
  className?: string;
}

export function ContractViewer({ title, pages, onView, className }: ContractViewerProps) {
  return (
    <button
      type="button"
      onClick={onView}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg border border-border-subtle bg-surface/60 p-3 text-left hover:border-border hover:bg-surface-hover/60 transition-colors",
        className
      )}
    >
      <FileSignature className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{title}</p>
        {pages && <p className="text-[10px] text-muted-foreground">{pages} páginas</p>}
      </div>
    </button>
  );
}

export { Timeline as ContractTimeline } from "@/components/timeline";

interface ContractInfoProps {
  items: { label: string; value: string }[];
  className?: string;
}

export function ContractInfo({ items, className }: ContractInfoProps) {
  return (
    <dl className={cn("space-y-2.5", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-3">
          <dt className="text-[10px] text-muted-foreground">{item.label}</dt>
          <dd className="text-[11px] text-foreground/90 text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface ContractActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function ContractActions({ children, className }: ContractActionsProps) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}
