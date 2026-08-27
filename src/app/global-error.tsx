"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: "#09090b", color: "#fafafa", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <p style={{ color: "#71717a", fontSize: 14 }}>Erro inesperado</p>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Norax encontrou um problema</h1>
          <p style={{ color: "#71717a", fontSize: 14, maxWidth: 400 }}>
            Pare o servidor atual e execute <code style={{ background: "#1c1c21", padding: "2px 6px", borderRadius: 4 }}>npm run dev</code> para reiniciar com cache limpo.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ background: "#fafafa", color: "#09090b", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
