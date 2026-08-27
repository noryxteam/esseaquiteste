import { PageTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { routes } from "@/lib/app-routes";

export default async function PropostaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageTitle
        title="Detalhe da proposta"
        description={`Proposta #${id}`}
      />
      <Card>
        <p className="text-sm text-muted-foreground mb-4">
          Página de detalhe da proposta. Em breve você poderá visualizar itens, valores, histórico e status de negociação.
        </p>
        <StatusBadge label="Em desenvolvimento" variant="blue" />
        <div className="mt-6">
          <Link href={routes.propostas} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para propostas
          </Link>
        </div>
      </Card>
    </>
  );
}
