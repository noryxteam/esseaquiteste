"use client";

import Link from "next/link";
import type { ElectronicContract } from "@/modules/electronic-contracts";
import { ContractStatus } from "@/components/contracts/ContractStatus";
import {
  getContractAdminPath,
  getContractEditPath,
  getContractViewPath,
} from "@/lib/contract-routes";
import { Button } from "@/components/ui/button-shadcn";
import { Eye, Pencil } from "lucide-react";

interface ContractAdminTableProps {
  contracts: ElectronicContract[];
}

export function ContractAdminTable({ contracts }: ContractAdminTableProps) {
  return (
    <div className="rounded-xl border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/60">
              {[
                "Número",
                "Cliente",
                "Projeto",
                "Status",
                "Valor",
                "Criação",
                "Envio",
                "Assinatura",
                "Pagamento",
                "Prazo",
                "Responsável",
                "Versão",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border-subtle last:border-0 hover:bg-surface/40 transition-colors"
              >
                <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">{c.numeroContrato}</td>
                <td className="px-3 py-3 whitespace-nowrap">{c.variaveis.empresa}</td>
                <td className="px-3 py-3 whitespace-nowrap max-w-[140px] truncate">{c.variaveis.projeto}</td>
                <td className="px-3 py-3">
                  <ContractStatus status={c.status} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{c.variaveis.valor}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.dataCriacao}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {c.dataEnvio ?? "—"}
                </td>
                <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {c.dataAssinatura ?? "—"}
                </td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">{c.formaPagamento}</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">{c.prazo}</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">{c.responsavelNome}</td>
                <td className="px-3 py-3 text-xs font-mono">v{c.versao}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={getContractAdminPath(c.id)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={getContractViewPath(c.uniqueSlug, { staffPreview: true })}>
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    {!c.isImmutable && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
                        <Link href={getContractEditPath(c.id)}>Editar</Link>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
