"use client";

/** Tela de espera do portal — evita “tela preta” sem feedback. */
export function ContractPortalLoading({
  label = "Carregando contrato…",
}: {
  label?: string;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-9 w-9 rounded-full border-2 border-white/20 border-t-white animate-spin"
        aria-hidden
      />
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}
