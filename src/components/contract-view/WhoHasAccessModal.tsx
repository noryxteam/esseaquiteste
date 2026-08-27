"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { MonitorSmartphone, X } from "lucide-react";
import { securityApi } from "@/modules/security/api/security.api";
import type {
  AuthorizationHistoryEntry,
  AuthorizedDevice,
  PendingDeviceRequest,
} from "@/modules/security/types";
import { DEVICE_PERMISSION_LABELS } from "@/modules/security/types";
import { electronicContractService } from "@/modules/electronic-contracts";
import { getDeviceFingerprint } from "@/modules/security/services/device-fingerprint";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/modules/auth/types/auth.types";

export interface AccessPersonRow {
  id: string;
  device: string;
  detail: string;
  requestedAt: string;
  grantedAt: string;
  lastAccessAt: string;
  status: string;
  statusTone: "active" | "pending" | "revoked" | "other";
  isCurrent: boolean;
  accessLabel?: string;
}

interface WhoHasAccessModalProps {
  open: boolean;
  contractId: string;
  onClose: () => void;
}

const ROLE_SHORT: Partial<Record<UserRole, string>> = {
  ADMINISTRADOR: "Administrador",
  COMERCIAL: "Comercial",
  DESIGNER: "Designer",
  DESENVOLVEDOR: "Desenvolvedor",
  FINANCEIRO: "Financeiro",
  CLIENTE: "Cliente",
};

function statusLabel(raw: string): { label: string; tone: AccessPersonRow["statusTone"] } {
  const s = raw.toUpperCase();
  if (s === "ACTIVE" || s === "APPROVED" || s === "APROVADO") {
    return { label: "Com acesso", tone: "active" };
  }
  if (s === "PENDING" || s === "PENDENTE") {
    return { label: "Aguardando", tone: "pending" };
  }
  if (s === "REVOKED" || s === "DENIED" || s === "REJECTED" || s === "REJEITADO") {
    return { label: "Revogado / negado", tone: "revoked" };
  }
  if (s === "EXPIRED" || s === "EXPIRADO") {
    return { label: "Expirado", tone: "other" };
  }
  return { label: raw || "—", tone: "other" };
}

function buildRows(
  devices: AuthorizedDevice[],
  history: AuthorizationHistoryEntry[],
  pending: PendingDeviceRequest[],
  currentFp: string,
  viewer?: { nome: string; role: UserRole } | null
): AccessPersonRow[] {
  const historyByFp = new Map<string, AuthorizationHistoryEntry>();
  for (const h of history) {
    if (h.fingerprint && !historyByFp.has(h.fingerprint)) {
      historyByFp.set(h.fingerprint, h);
    }
  }

  const roleLabel = viewer?.role ? ROLE_SHORT[viewer.role] ?? "Funcionário" : "Funcionário";
  const viewerName = viewer?.nome?.trim() || "Você";

  const rows: AccessPersonRow[] = devices.map((d) => {
    const match = d.fingerprint ? historyByFp.get(d.fingerprint) : undefined;
    const st = statusLabel(d.statusRaw || d.status);
    const isCurrent = Boolean(currentFp && d.fingerprint && d.fingerprint === currentFp);
    const permission =
      d.permissionLabel ||
      (d.permission ? DEVICE_PERMISSION_LABELS[d.permission] : null) ||
      "acesso";

    const deviceInfo = [d.deviceType, d.os, d.browser]
      .filter((x) => x && x !== "—")
      .join(" · ");

    if (isCurrent) {
      return {
        id: d.id,
        device: "Eu",
        detail: `${viewerName} · ${roleLabel} · acesso ${permission}`,
        requestedAt: match?.createdAt || "—",
        grantedAt: d.authorizedAt || match?.decidedAt || d.firstAccess || "—",
        lastAccessAt: d.lastAccess || "—",
        status: "Este dispositivo",
        statusTone: "active",
        isCurrent: true,
        accessLabel: deviceInfo || undefined,
      };
    }

    return {
      id: d.id,
      device: d.label || "Dispositivo",
      detail: deviceInfo,
      requestedAt: match?.createdAt || "—",
      grantedAt: d.authorizedAt || match?.decidedAt || d.firstAccess || "—",
      lastAccessAt: d.lastAccess || "—",
      status: st.label,
      statusTone: st.tone,
      isCurrent: false,
    };
  });

  for (const p of pending) {
    const st = statusLabel(p.status);
    rows.push({
      id: `pending-${p.id}`,
      device: p.label || "Dispositivo",
      detail: [p.os, p.browser].filter((x) => x && x !== "—").join(" · "),
      requestedAt: p.createdAt || "—",
      grantedAt: "—",
      lastAccessAt: "—",
      status: st.label,
      statusTone: st.tone,
      isCurrent: false,
    });
  }

  const covered = new Set(
    devices.map((d) => d.fingerprint).filter(Boolean) as string[]
  );
  for (const h of history) {
    if (h.fingerprint && covered.has(h.fingerprint)) continue;
    if (h.status === "PENDING" || h.status === "APPROVED") continue;
    const st = statusLabel(h.status);
    const isCurrent = Boolean(currentFp && h.fingerprint === currentFp);
    rows.push({
      id: `hist-${h.id}`,
      device: isCurrent ? "Eu" : h.label || "Dispositivo",
      detail: isCurrent
        ? `${viewerName} · ${roleLabel}`
        : [h.os, h.browser].filter((x) => x && x !== "—").join(" · "),
      requestedAt: h.createdAt || "—",
      grantedAt: h.decidedAt || "—",
      lastAccessAt: "—",
      status: isCurrent ? "Este dispositivo" : st.label,
      statusTone: isCurrent ? "active" : st.tone,
      isCurrent,
    });
  }

  // Dispositivo atual primeiro
  return rows.sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
}

function buildLocalFallback(
  contractId: string,
  currentFp: string,
  viewer?: { nome: string; role: UserRole } | null
): AccessPersonRow[] {
  const contract = electronicContractService.getById(contractId);
  if (!contract) return [];

  const roleLabel = viewer?.role ? ROLE_SHORT[viewer.role] ?? "Funcionário" : "Funcionário";
  const viewerName = viewer?.nome?.trim() || "Você";

  const rows: AccessPersonRow[] = contract.dispositivosAutorizados.map((d) => {
    const isCurrent = Boolean(currentFp && d.fingerprint === currentFp);
    return {
      id: d.id,
      device: isCurrent ? "Eu" : d.label || "Dispositivo",
      detail: isCurrent
        ? `${viewerName} · ${roleLabel} · com acesso`
        : d.fingerprint
          ? `ID ${d.fingerprint.slice(0, 8)}…`
          : "",
      requestedAt: "—",
      grantedAt: d.autorizadoEm || "—",
      lastAccessAt: d.ultimoAcesso || "—",
      status: isCurrent ? "Este dispositivo" : "Com acesso",
      statusTone: "active",
      isCurrent,
    };
  });

  for (const r of contract.solicitacoesDispositivo) {
    const st = statusLabel(r.status);
    rows.push({
      id: r.id,
      device: r.label || "Dispositivo",
      detail: "",
      requestedAt: r.solicitadoEm || "—",
      grantedAt: r.status === "aprovado" ? r.solicitadoEm : "—",
      lastAccessAt: "—",
      status: st.label,
      statusTone: st.tone,
      isCurrent: false,
    });
  }

  return rows.sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
}

export function WhoHasAccessModal({ open, contractId, onClose }: WhoHasAccessModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<AccessPersonRow[]>([]);

  useEffect(() => {
    if (!open || !contractId) return;
    let cancelled = false;
    const currentFp = getDeviceFingerprint();
    const viewer = user ? { nome: user.nome, role: user.role } : null;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [dev, hist, pending] = await Promise.all([
          securityApi.listDevices(contractId),
          securityApi.listAuthorizationHistory(contractId),
          securityApi.listPendingRequests(contractId),
        ]);
        if (cancelled) return;
        const built = buildRows(dev.data, hist.data, pending.data, currentFp, viewer);
        setRows(built.length ? built : buildLocalFallback(contractId, currentFp, viewer));
      } catch {
        if (cancelled) return;
        setRows(buildLocalFallback(contractId, currentFp, viewer));
        setError("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [open, contractId, user]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quem tem acesso"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        aria-label="Fechar"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 w-full max-w-lg max-h-[min(80vh,640px)] flex flex-col rounded-2xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-white/10">
          <div>
            <p className="text-base font-medium text-white tracking-tight">Quem tem acesso</p>
            <p className="mt-1 text-xs text-white/50">
              Dispositivos autorizados e pedidos de acesso a este contrato.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-white/60 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loading ? (
            <p className="text-sm text-white/50 text-center py-10">Carregando…</p>
          ) : error ? (
            <p className="text-sm text-red-400 text-center py-10">{error}</p>
          ) : rows.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <MonitorSmartphone className="h-8 w-8 text-white/25 mx-auto" />
              <p className="text-sm text-white/55">Ninguém tem acesso ainda.</p>
              <p className="text-xs text-white/35">
                Quando o cliente pedir acesso em um dispositivo novo, aparece aqui.
              </p>
            </div>
          ) : (
            rows.map((row) => (
              <article
                key={row.id}
                className={cn(
                  "rounded-xl border px-4 py-3 space-y-2.5",
                  row.isCurrent
                    ? "border-emerald-500/35 bg-emerald-500/[0.07]"
                    : "border-white/10 bg-white/[0.03]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{row.device}</p>
                    {row.detail ? (
                      <p className="text-[11px] text-white/45 mt-0.5 truncate">{row.detail}</p>
                    ) : null}
                    {row.accessLabel ? (
                      <p className="text-[10px] text-white/30 mt-0.5 truncate">{row.accessLabel}</p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-[10px] rounded-full px-2 py-0.5 border",
                      row.statusTone === "active" &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                      row.statusTone === "pending" &&
                        "border-amber-500/30 bg-amber-500/10 text-amber-300",
                      row.statusTone === "revoked" &&
                        "border-red-500/30 bg-red-500/10 text-red-300",
                      row.statusTone === "other" &&
                        "border-white/15 bg-white/5 text-white/50"
                    )}
                  >
                    {row.status}
                  </span>
                </div>

                <dl className="grid grid-cols-1 gap-1.5 text-[11px]">
                  <Meta label="Pediu acesso" value={row.requestedAt} />
                  <Meta label="Conseguiu entrar" value={row.grantedAt} />
                  <Meta label="Último acesso" value={row.lastAccessAt} />
                </dl>
              </article>
            ))
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-white/40">{label}</dt>
      <dd className="text-white/80 text-right tabular-nums">{value}</dd>
    </div>
  );
}
