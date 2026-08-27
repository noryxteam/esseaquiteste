import type { Contract } from "@/lib/mock-data/contratos-types";
import { ContractCard } from "@/components/contratos/ContractCard";

interface ContractGridProps {
  contracts: Contract[];
  onSelect?: (contract: Contract) => void;
}

export function ContractGrid({ contracts, onSelect }: ContractGridProps) {
  if (contracts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        Nenhum contrato encontrado para os filtros selecionados.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contracts.map((contract, index) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          index={index}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
