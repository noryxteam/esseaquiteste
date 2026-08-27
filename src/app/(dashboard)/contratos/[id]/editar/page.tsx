import { LazyContractEditPage } from "@/lib/lazy-pages";

export default async function ContratoEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LazyContractEditPage contractId={id} />;
}
