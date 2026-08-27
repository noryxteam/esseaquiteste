import { DeviceAuthorizationPage } from "@/components/contracts/DeviceAuthorizationPage";

interface PageProps {
  params: Promise<{ token: string }>;
}

/** Página pública mínima: cliente escolhe Visualizador ou Assinante. */
export default async function AutorizarDispositivoRoute({ params }: PageProps) {
  const { token } = await params;
  return <DeviceAuthorizationPage token={token} />;
}
