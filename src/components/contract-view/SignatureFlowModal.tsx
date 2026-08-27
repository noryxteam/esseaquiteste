"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eraser, Loader2, PenLine, Type, X } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import {
  getSignatureFont,
  SIGNATURE_FONTS,
  type SignatureFontId,
} from "@/lib/signature-fonts";
import {
  documentLabel,
  formatCpfCnpj,
  isCompleteCpfCnpj,
} from "@/modules/client-setup/input-masks";

export type SignRole = "norax" | "cliente";

export interface SignatureResult {
  nome: string;
  documento: string;
  data: string;
  hora: string;
  aceiteEletronico: true;
  signatureDataUrl?: string;
  signatureText?: string;
  signatureMode?: "draw" | "type";
  signatureFont?: SignatureFontId;
}

interface SignatureFlowModalProps {
  open: boolean;
  role: SignRole;
  defaultName?: string;
  defaultDocument?: string;
  onClose: () => void;
  onComplete: (result: SignatureResult) => Promise<void>;
}

type Step = "identity" | "draw" | "confirm" | "saving";
type SignMode = "draw" | "type";

const ease = [0.22, 1, 0.36, 1] as const;

export function SignatureFlowModal({
  open,
  role,
  defaultName = "",
  defaultDocument = "",
  onClose,
  onComplete,
}: SignatureFlowModalProps) {
  const [step, setStep] = useState<Step>("identity");
  const [mode, setMode] = useState<SignMode>("draw");
  const [nome, setNome] = useState(defaultName);
  const [documento, setDocumento] = useState(defaultDocument);
  const [typedSig, setTypedSig] = useState("");
  const [sigFont, setSigFont] = useState<SignatureFontId>("elegant");
  const [error, setError] = useState("");
  const [hasInk, setHasInk] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (!open) return;
    setStep("identity");
    setMode("draw");
    setNome(defaultName);
    setDocumento(formatCpfCnpj(defaultDocument));
    setTypedSig(defaultName);
    setSigFont("elegant");
    setError("");
    setHasInk(false);
  }, [open, defaultName, defaultDocument]);

  useEffect(() => {
    if (step !== "draw" || mode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#18181b";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasInk(false);
  }, [step, mode]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasInk(true);
  };

  const onPointerUp = () => {
    drawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasInk(false);
  };

  const now = new Date();
  const data = now.toLocaleDateString("pt-BR");
  const hora = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const activeFont = getSignatureFont(sigFont);

  const goConfirm = () => {
    if (mode === "draw" && !hasInk) {
      setError("Desenhe sua assinatura para continuar.");
      return;
    }
    if (mode === "type" && !typedSig.trim()) {
      setError("Digite sua assinatura para continuar.");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const finish = async () => {
    setStep("saving");
    setError("");
    try {
      await onComplete({
        nome: nome.trim(),
        documento: documento.trim(),
        data,
        hora,
        aceiteEletronico: true,
        signatureMode: mode,
        signatureDataUrl:
          mode === "draw" ? canvasRef.current?.toDataURL("image/png") : undefined,
        signatureText: mode === "type" ? typedSig.trim() : undefined,
        signatureFont: mode === "type" ? sigFont : undefined,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao validar assinatura");
      setStep("confirm");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#111] shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <p className="text-sm font-medium text-white">Assinar contrato</p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  {role === "norax" ? "Assinatura do contratado" : "Assinatura do cliente"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-2 text-[10px] text-white/35">
                {(["identity", "draw", "confirm"] as const).map((s, i) => (
                  <span key={s} className="inline-flex items-center gap-2">
                    {i > 0 && <span className="h-px w-4 bg-white/10" />}
                    <span
                      className={
                        step === s || (step === "saving" && s === "confirm")
                          ? "text-white"
                          : ""
                      }
                    >
                      {s === "identity" ? "Identidade" : s === "draw" ? "Assinatura" : "Confirmar"}
                    </span>
                  </span>
                ))}
              </div>

              {step === "identity" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-white/45">Nome completo</label>
                    <Input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="mt-1 h-10 bg-black/30 border-white/[0.08]"
                      placeholder="Nome do signatário"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/45">
                      {documentLabel(documento)}
                    </label>
                    <Input
                      value={documento}
                      onChange={(e) => setDocumento(formatCpfCnpj(e.target.value))}
                      inputMode="numeric"
                      autoComplete="off"
                      className="mt-1 h-10 bg-black/30 border-white/[0.08] font-mono"
                      placeholder={
                        documentLabel(documento) === "CNPJ"
                          ? "00.000.000/0000-00"
                          : "000.000.000-00"
                      }
                    />
                    <p className="mt-1 text-[10px] text-white/30">
                      Digite só números — a pontuação entra sozinha. CPF (11) ou CNPJ (14).
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="w-full h-10 bg-white text-black hover:bg-white/90"
                    onClick={() => {
                      if (!nome.trim()) {
                        setError("Preencha o nome completo.");
                        return;
                      }
                      if (!isCompleteCpfCnpj(documento)) {
                        setError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
                        return;
                      }
                      setError("");
                      setTypedSig((prev) => prev.trim() || nome.trim());
                      setStep("draw");
                    }}
                  >
                    Continuar
                  </Button>
                </div>
              )}

              {step === "draw" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-black/30 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("draw");
                        setError("");
                      }}
                      className={cn(
                        "h-9 rounded-lg text-xs inline-flex items-center justify-center gap-1.5 transition-colors duration-200",
                        mode === "draw"
                          ? "bg-white text-black"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      <PenLine className="h-3.5 w-3.5" />
                      Desenhar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("type");
                        setError("");
                        if (!typedSig.trim()) setTypedSig(nome.trim());
                      }}
                      className={cn(
                        "h-9 rounded-lg text-xs inline-flex items-center justify-center gap-1.5 transition-colors duration-200",
                        mode === "type"
                          ? "bg-white text-black"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      <Type className="h-3.5 w-3.5" />
                      Digitar
                    </button>
                  </div>

                  {mode === "draw" ? (
                    <>
                      <p className="text-[11px] text-white/45">Desenhe sua assinatura abaixo</p>
                      <canvas
                        ref={canvasRef}
                        className="w-full h-40 rounded-xl border border-white/[0.1] bg-white cursor-crosshair touch-none"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] text-white/45">Digite sua assinatura</p>
                      <Input
                        value={typedSig}
                        onChange={(e) => setTypedSig(e.target.value)}
                        className="h-10 bg-black/30 border-white/[0.08]"
                        placeholder="Seu nome completo"
                        autoFocus
                      />

                      <div>
                        <p className="text-[11px] text-white/45 mb-2">Escolha a fonte</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {SIGNATURE_FONTS.map((font) => {
                            const selected = sigFont === font.id;
                            return (
                              <button
                                key={font.id}
                                type="button"
                                onClick={() => setSigFont(font.id)}
                                className={cn(
                                  "h-14 rounded-xl border px-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 bg-white",
                                  selected
                                    ? "border-[#18181b] ring-2 ring-white/35"
                                    : "border-white/10 opacity-75 hover:opacity-100"
                                )}
                                title={font.label}
                              >
                                <span
                                  className={cn(
                                    "text-[#18181b] text-lg leading-none truncate max-w-full",
                                    font.className
                                  )}
                                  style={font.style}
                                >
                                  Aa
                                </span>
                                <span className="text-[9px] text-[#71717a]">{font.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="w-full h-40 rounded-xl border border-white/[0.1] bg-white flex items-center justify-center px-4">
                        <p
                          className={cn(
                            "text-[#18181b] text-center text-2xl sm:text-3xl truncate max-w-full",
                            activeFont.className
                          )}
                          style={activeFont.style}
                        >
                          {typedSig.trim() || "Sua assinatura"}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 gap-1.5 border-white/[0.08] text-white/60"
                      onClick={() => {
                        if (mode === "draw") clearCanvas();
                        else setTypedSig("");
                      }}
                    >
                      <Eraser className="h-3.5 w-3.5" />
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 h-9 bg-white text-black hover:bg-white/90 gap-1.5"
                      onClick={goConfirm}
                    >
                      <PenLine className="h-3.5 w-3.5" />
                      Usar assinatura
                    </Button>
                  </div>
                </div>
              )}

              {(step === "confirm" || step === "saving") && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-2 text-xs">
                    <p className="text-white/80">{nome}</p>
                    <p className="text-white/45">{documento}</p>
                    <p className="text-white/45">
                      {data} às {hora}
                    </p>
                    <p className="text-white/35">
                      Modo: {mode === "draw" ? "Desenhada" : "Digitada"}
                      {mode === "type" && typedSig.trim() ? ` · “${typedSig.trim()}”` : ""}
                      {mode === "type" ? ` · ${activeFont.label}` : ""}
                    </p>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Ao confirmar, a assinatura será validada e vinculada ao contrato com validade
                    jurídica.
                  </p>
                  <Button
                    type="button"
                    className="w-full h-10 bg-white text-black hover:bg-white/90 gap-2"
                    disabled={step === "saving"}
                    onClick={finish}
                  >
                    {step === "saving" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Validando…
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Confirmar assinatura
                      </>
                    )}
                  </Button>
                </div>
              )}

              {error && <p className="text-xs text-red-400/90">{error}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
