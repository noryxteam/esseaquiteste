"use client";

import { getContractView } from "@/lib/mock-data/contract-view";
import { electronicContractService } from "@/modules/electronic-contracts";
import { toContractDocumentData } from "@/modules/electronic-contracts/adapter";
import { ContractViewerPage } from "@/components/contract-view/ContractViewerPage";

interface ContractDetailPageProps {
  contractId: string;
}

export function ContractDetailPage({ contractId }: ContractDetailPageProps) {
  const electronic = electronicContractService.getById(contractId);
  const data = electronic
    ? toContractDocumentData(electronic)
    : getContractView(contractId);

  if (!data) {
    return <p className="text-muted-foreground">Contrato não encontrado.</p>;
  }

  return <ContractViewerPage data={data} />;
}
