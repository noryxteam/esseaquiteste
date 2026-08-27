import { PageTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { routes } from "@/lib/app-routes";

export default async function ModeloDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageTitle
        title="Detalhe do modelo"
        description={`Modelo #${id}`}
      />
      <Card>
        <p className="text-sm text-muted-foreground mb-4">
          Página de detalhe do modelo. Em breve você poderá editar o conteúdo, variáveis e histórico de uso.
        </p>
        <StatusBadge label="Rascunho" variant="default" />
        <div className="mt-6">
          <Link href={routes.modelos} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para modelos
          </Link>
        </div>
      </Card>
    </>
  );
}
