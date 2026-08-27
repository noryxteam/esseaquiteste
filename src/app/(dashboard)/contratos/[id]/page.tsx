import { ContractDetailPage } from "@/components/contracts/ContractDetailPage";

export default async function ContratoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContractDetailPage contractId={id} />;
}
