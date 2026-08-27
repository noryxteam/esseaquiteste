import { PageTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { routes } from "@/lib/app-routes";

export default async function MembroDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageTitle
        title="Detalhe do membro"
        description={`Membro #${id}`}
      />
      <Card>
        <p className="text-sm text-muted-foreground mb-4">
          Página de detalhe do membro da equipe. Em breve você poderá ver projetos, capacidade e histórico.
        </p>
        <StatusBadge label="Ativo" variant="green" />
        <div className="mt-6">
          <Link href={routes.equipe} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para equipe
          </Link>
        </div>
      </Card>
    </>
  );
}
