"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UpcomingPayment } from "@/lib/mock-data/financeiro-types";
import { Button } from "@/components/ui/button-shadcn";
import { routes } from "@/lib/app-routes";

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[];
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-foreground">Próximos recebimentos</h2>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <Link href={routes.financeiro}>Ver todos</Link>
        </Button>
      </div>

      <ul className="space-y-3">
        {payments.map((payment) => (
          <li key={payment.id}>
            <button
              type="button"
              onClick={() => router.push(routes.financeiro)}
              className="flex items-start gap-3 w-full text-left rounded-md -mx-1 px-1 py-0.5 hover:bg-surface-hover/60 transition-colors"
            >
              <div className="shrink-0 w-10 text-center rounded-md border border-border-subtle bg-surface-inset py-1.5">
                <p className="text-sm font-semibold text-foreground tabular-nums leading-none">
                  {payment.day}
                </p>
                <p className="text-[8px] text-muted-foreground uppercase mt-0.5">{payment.month}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{payment.cliente}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {payment.contratoNumero}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-state-green tabular-nums">{payment.valor}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{payment.formaPagamento}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
