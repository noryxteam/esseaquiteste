"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import { ContractStatusBadge } from "@/components/contratos/ContractStatus";
import { ContractViewerToolbar } from "@/components/contract-view/ContractViewerToolbar";
import { ContractStatusCards } from "@/components/contract-view/ContractStatusCards";

interface ContractViewerHeaderProps {
  data: ContractViewData;
}

export function ContractViewerHeader({ data }: ContractViewerHeaderProps) {
  return (
    <header className="space-y-5">
      <Link
        href="/contratos"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar para contratos
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {data.title}
            </h1>
            <ContractStatusBadge
              status={data.statusVariant}
              label={data.statusLabel}
            />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{data.subtitle}</p>
        </div>
        <ContractViewerToolbar contractId={data.id} />
      </div>

      <ContractStatusCards data={data} />
    </header>
  );
}
