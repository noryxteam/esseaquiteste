"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button-shadcn";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">Algo deu errado</p>
      <h1 className="text-xl font-semibold">Não foi possível carregar esta página</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Tente recarregar. Se o erro persistir, pare o servidor e rode{" "}
        <code className="rounded bg-surface-elevated px-1.5 py-0.5 text-xs">npm run dev</code> novamente.
      </p>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Tentar novamente</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Recarregar
        </Button>
      </div>
    </div>
  );
}
