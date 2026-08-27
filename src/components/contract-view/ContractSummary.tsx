import { Building2, Clock, DollarSign, User } from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";

interface ContractSummaryProps {
  data: ContractDocumentData;
  compact?: boolean;
}

export function ContractSummary({ data, compact }: ContractSummaryProps) {
  const items = [
    { icon: User, label: "Cliente", value: data.client.name },
    { icon: Building2, label: "Empresa", value: data.company.legalName },
    { icon: DollarSign, label: "Valor", value: data.value },
    { icon: Clock, label: "Prazo", value: data.deadline },
  ];

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg border border-[#e4e4e7] bg-[#fafafa] ${
        compact ? "p-2 mb-3" : "p-4 mb-6"
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <item.icon className={`text-[#a1a1aa] mx-auto mb-1 ${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} />
          <p className={`text-[#a1a1aa] uppercase ${compact ? "text-[6px]" : "text-[8px]"}`}>{item.label}</p>
          <p className={`font-medium text-[#18181b] mt-0.5 line-clamp-2 ${compact ? "text-[7px]" : "text-[9px]"}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
