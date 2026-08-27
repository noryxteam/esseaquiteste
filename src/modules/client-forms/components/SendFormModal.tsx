"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Mail, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { useOverlayChrome } from "@/contexts/overlay-chrome-context";
import { cn } from "@/lib/utils";
import { formatPhoneBr } from "@/modules/client-setup/input-masks";

export type SendChannel = "whatsapp" | "email";

export interface SendFormModalProps {
  open: boolean;
  onClose: () => void;
  formUrl: string;
  /** Prefill telefone do cliente (só dígitos ou formatado) */
  defaultPhone?: string;
  /** Prefill e-mail do cliente */
  defaultEmail?: string;
  formTitle?: string;
  /** Textos do modal — padrão = formulário */
  title?: string;
  description?: string;
  linkLabel?: string;
  linkHelp?: string;
  submitLabel?: string;
  subjectPrefix?: string;
  defaultWaMessage?: string;
  defaultEmailMessage?: string;
  onConfirm: (payload: {
    channel: SendChannel;
    phone?: string;
    email?: string;
    subject?: string;
    message: string;
  }) => void | Promise<void>;
}

const DEFAULT_WA_MSG =
  "Olá! Segue o link do formulário para você preencher:\n\n{{link}}";
const DEFAULT_EMAIL_MSG =
  "Olá!\n\nSegue o link do formulário para você preencher:\n\n{{link}}\n\nQualquer dúvida, estamos à disposição.";

export function SendFormModal({
  open,
  onClose,
  formUrl,
  defaultPhone = "",
  defaultEmail = "",
  formTitle = "Formulário",
  title = "Enviar formulário",
  description = "Escolha como deseja enviar o formulário para o cliente.",
  linkLabel = "Link do formulário",
  linkHelp = "Compartilhe este link com o cliente para que ele possa responder.",
  submitLabel = "Enviar formulário",
  subjectPrefix = "Formulário",
  defaultWaMessage = DEFAULT_WA_MSG,
  defaultEmailMessage = DEFAULT_EMAIL_MSG,
  onConfirm,
}: SendFormModalProps) {
  const { setOverlayOpen } = useOverlayChrome();
  const [channel, setChannel] = useState<SendChannel>("whatsapp");
  const [ddi, setDdi] = useState("+55");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    setChannel("whatsapp");
    setDdi("+55");
    setPhone(defaultPhone ? formatPhoneBr(defaultPhone.replace(/\D/g, "")) : "");
    setEmail(defaultEmail);
    setSubject(`${subjectPrefix} — ${formTitle}`);
    setMessage(defaultWaMessage.replace("{{link}}", formUrl));
    setCopied(false);
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      setOverlayOpen(false);
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [
    open,
    onClose,
    setOverlayOpen,
    defaultPhone,
    defaultEmail,
    formUrl,
    formTitle,
    subjectPrefix,
    defaultWaMessage,
  ]);

  useEffect(() => {
    if (!open) return;
    setMessage(
      (channel === "whatsapp" ? defaultWaMessage : defaultEmailMessage).replace(
        "{{link}}",
        formUrl
      )
    );
  }, [channel, formUrl, open, defaultWaMessage, defaultEmailMessage]);

  const messageLimit = channel === "whatsapp" ? 160 : 2000;
  const messageLen = message.length;

  const displayUrl = useMemo(() => {
    try {
      const u = new URL(formUrl);
      return u.href;
    } catch {
      return formUrl;
    }
  }, [formUrl]);

  if (!open || typeof document === "undefined") return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onConfirm({
        channel,
        phone: channel === "whatsapp" ? `${ddi} ${phone}`.trim() : undefined,
        email: channel === "email" ? email.trim() : undefined,
        subject: channel === "email" ? subject.trim() : undefined,
        message: message.replaceAll("{{link}}", formUrl),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        className="relative w-full max-w-lg max-h-[min(92vh,720px)] overflow-y-auto rounded-xl border border-border-subtle bg-background shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div>
            <h2 className="text-base font-semibold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 -mt-0.5"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-5 pb-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-foreground mb-2">{linkLabel}</p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={displayUrl}
                className="h-10 text-xs bg-surface-inset border-border-subtle font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 shrink-0 gap-1.5 text-xs border-border-subtle"
                onClick={() => void handleCopy()}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copiado" : "Copiar link"}
              </Button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {linkHelp}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground mb-2">Enviar por</p>
            <div className="grid grid-cols-2 gap-2.5">
              <ChannelCard
                active={channel === "whatsapp"}
                onClick={() => setChannel("whatsapp")}
                icon={<WhatsAppIcon className="h-5 w-5" />}
                title="WhatsApp"
                subtitle="Enviar via WhatsApp"
                accent="whatsapp"
              />
              <ChannelCard
                active={channel === "email"}
                onClick={() => setChannel("email")}
                icon={<Mail className="h-5 w-5" />}
                title="E-mail"
                subtitle="Enviar via e-mail"
                accent="email"
              />
            </div>
          </div>

          {channel === "whatsapp" ? (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">Número do WhatsApp</p>
                <div className="flex gap-2">
                  <select
                    value={ddi}
                    onChange={(e) => setDdi(e.target.value)}
                    className="h-10 w-[88px] shrink-0 rounded-lg border border-border-subtle bg-surface-inset px-2 text-xs text-foreground"
                  >
                    <option value="+55">+55</option>
                    <option value="+1">+1</option>
                    <option value="+351">+351</option>
                  </select>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneBr(e.target.value))}
                    placeholder="(11) 99999-9999"
                    inputMode="numeric"
                    className="h-10 text-xs bg-surface-inset border-border-subtle"
                  />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">
                  Mensagem personalizada (opcional)
                </p>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, messageLimit))}
                    rows={4}
                    className="w-full rounded-lg border border-border-subtle bg-surface-inset px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-white/10 resize-none"
                  />
                  <span className="absolute bottom-2 right-2.5 text-[10px] text-muted-foreground tabular-nums">
                    {messageLen}/{messageLimit}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">E-mail</p>
                <Input
                  type="text"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="h-10 text-xs bg-surface-inset border-border-subtle"
                />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">Assunto</p>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 text-xs bg-surface-inset border-border-subtle"
                />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">
                  Mensagem personalizada (opcional)
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, messageLimit))}
                  rows={4}
                  className="w-full rounded-lg border border-border-subtle bg-surface-inset px-3 py-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-white/10 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border-subtle bg-surface/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs border-border-subtle"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            className={cn(
              "h-9 text-xs gap-1.5",
              channel === "whatsapp"
                ? "bg-[#25D366] text-black hover:bg-[#25D366]/90"
                : "bg-foreground text-accent-foreground hover:bg-foreground/90"
            )}
            disabled={submitting}
            onClick={() => void handleSubmit()}
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Enviando…" : submitLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Ícone oficial do WhatsApp (marca), alinhado ao estilo outline do modal. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ChannelCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: "whatsapp" | "email";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3.5 py-3.5 text-left transition-colors",
        active
          ? accent === "whatsapp"
            ? "border-[#25D366]/60 bg-[#25D366]/10"
            : "border-white/30 bg-white/5"
          : "border-border-subtle bg-surface/40 hover:border-border hover:bg-surface-hover/40"
      )}
    >
      <div
        className={cn(
          "mb-2",
          active
            ? accent === "whatsapp"
              ? "text-[#25D366]"
              : "text-foreground"
            : "text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <p
        className={cn(
          "text-sm font-medium",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {title}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
    </button>
  );
}
