import { Building2, Clock, CreditCard, DollarSign, Handshake, User } from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";

interface ContractSummaryProps {
  data: ContractDocumentData;
  compact?: boolean;
}

export function ContractSummary({ data, compact }: ContractSummaryProps) {
  const isApagaLogo = Boolean(data.isApagaLogo);
  const items = [
    { icon: User, label: "Cliente", value: data.client.name },
    {
      icon: isApagaLogo ? Handshake : Building2,
      label: isApagaLogo ? "Contratado" : "Empresa",
      value: isApagaLogo
        ? data.company.legalName || data.company.representative || "—"
        : data.company.legalName,
    },
    { icon: DollarSign, label: "Valor", value: data.value },
    ...(isApagaLogo
      ? [{ icon: CreditCard, label: "Pagamento", value: data.paymentMethod || "50% antes\n50% no final" }]
      : []),
    { icon: Clock, label: "Prazo", value: data.deadline },
  ];

  return (
    <div
      className={`grid grid-cols-2 gap-3 rounded-lg border border-[#e4e4e7] bg-[#fafafa] ${
        isApagaLogo ? "sm:grid-cols-5" : "sm:grid-cols-4"
      } ${compact ? "p-2 mb-3" : "p-4 mb-6"}`}
    >
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <item.icon className={`text-[#a1a1aa] mx-auto mb-1 ${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} />
          <p className={`text-[#a1a1aa] uppercase ${compact ? "text-[6px]" : "text-[8px]"}`}>{item.label}</p>
          <p
            className={`font-medium text-[#18181b] mt-0.5 whitespace-pre-line ${compact ? "text-[7px]" : "text-[9px]"}`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
