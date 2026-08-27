import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseCard } from "@/components/common/BaseCard";
import { StatusBadge } from "@/components/badges";
import { formatCurrencyFull } from "@/lib/utils";

interface InvoiceCardProps {
  number: string;
  client: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  className?: string;
}

export function InvoiceCard({ number, client, amount, dueDate, status, className }: InvoiceCardProps) {
  const statusMap = {
    pending: { label: "Pendente", s: "pending" as const },
    paid: { label: "Pago", s: "completed" as const },
    overdue: { label: "Atrasado", s: "error" as const },
    cancelled: { label: "Cancelado", s: "cancelled" as const },
  };
  const st = statusMap[status];

  return (
    <BaseCard className={className} hover>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-foreground">{number}</p>
            <p className="text-[10px] text-muted-foreground">{client}</p>
          </div>
        </div>
        <StatusBadge status={st.s} label={st.label} />
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
        <span className="text-sm font-semibold tabular-nums text-foreground">{formatCurrencyFull(amount)}</span>
        <span className="text-[10px] text-muted-foreground">{dueDate}</span>
      </div>
    </BaseCard>
  );
}

interface TransactionCardProps {
  description: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  date: string;
  className?: string;
}

export function TransactionCard({ description, amount, type, date, className }: TransactionCardProps) {
  const Icon = type === "income" ? ArrowDownLeft : type === "expense" ? ArrowUpRight : Receipt;
  return (
    <BaseCard className={className}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-surface-elevated border border-border-subtle flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground truncate">{description}</p>
          <p className="text-[10px] text-muted-foreground">{date}</p>
        </div>
        <span className={cn("text-xs font-medium tabular-nums shrink-0", type === "income" ? "text-foreground" : "text-muted-foreground")}>
          {type === "expense" ? "−" : type === "income" ? "+" : ""}{formatCurrencyFull(Math.abs(amount))}
        </span>
      </div>
    </BaseCard>
  );
}

interface RevenueCardProps {
  label: string;
  value: number;
  trend?: string;
  className?: string;
}

export function RevenueCard({ label, value, trend, className }: RevenueCardProps) {
  return (
    <BaseCard className={className}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums text-foreground mt-1">{formatCurrencyFull(value)}</p>
      {trend && <p className="text-[10px] text-muted-foreground mt-1">{trend}</p>}
    </BaseCard>
  );
}

interface ExpenseCardProps {
  label: string;
  value: number;
  percentage?: number;
  className?: string;
}

export function ExpenseCard({ label, value, percentage, className }: ExpenseCardProps) {
  return (
    <BaseCard className={className}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums text-foreground mt-1">{formatCurrencyFull(value)}</p>
      {percentage !== undefined && (
        <div className="mt-2 h-1 rounded-full bg-surface-inset overflow-hidden">
          <div className="h-full bg-foreground/50 rounded-full" style={{ width: `${percentage}%` }} />
        </div>
      )}
    </BaseCard>
  );
}

export type FinancePaymentStatus = "pending" | "paid" | "overdue" | "refunded";

const PAYMENT_STATUS: Record<FinancePaymentStatus, { label: string; status: import("@/components/common/types").EntityStatus }> = {
  pending: { label: "Pendente", status: "pending" },
  paid: { label: "Pago", status: "completed" },
  overdue: { label: "Atrasado", status: "error" },
  refunded: { label: "Estornado", status: "archived" },
};

export function PaymentStatus({ status, className }: { status: FinancePaymentStatus; className?: string }) {
  const config = PAYMENT_STATUS[status];
  return <StatusBadge status={config.status} label={config.label} className={className} />;
}
