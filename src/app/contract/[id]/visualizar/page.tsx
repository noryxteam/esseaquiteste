import { ContractPublicView } from "@/components/contracts/ContractPublicView";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Visualização pública: documento carregado do banco pelo ID da URL. */
export default async function ContractVisualizarRoute({ params }: PageProps) {
  const { id: slug } = await params;
  return <ContractPublicView slug={slug} />;
}
