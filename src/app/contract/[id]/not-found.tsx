import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn";

export default function ContractNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">Contrato não encontrado</h1>
        <p className="text-sm text-muted-foreground">
          O contrato solicitado não existe ou foi removido.
        </p>
        <Button asChild variant="outline" className="border-border-subtle">
          <Link href="/contratos">Voltar para contratos</Link>
        </Button>
      </div>
    </div>
  );
}
