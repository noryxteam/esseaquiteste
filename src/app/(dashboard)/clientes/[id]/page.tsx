import { ClientDetailPage } from "@/components/clientes/ClientDetailPage";

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientDetailPage clientId={id} />;
}
