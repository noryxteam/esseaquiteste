import { ContractAccessPage } from "@/components/contract-view/ContractAccessPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Acesso público: resolve o contrato no banco pelo ID da URL. */
export default async function ContractAccessRoute({ params }: PageProps) {
  const { id: slug } = await params;
  return <ContractAccessPage slug={slug} />;
}
