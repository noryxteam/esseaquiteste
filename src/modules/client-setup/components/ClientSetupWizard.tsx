"use client";

import { useMemo, useState } from "react";
import { WizardShell } from "@/modules/client-setup/components/WizardShell";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { clientSetupService } from "@/modules/client-setup/service";
import type {
  ClientPersonalData,
  PaymentConfig,
  PixCustomInstallment,
  ServiceInfo,
} from "@/modules/client-setup/types";
import {
  BRAZIL_STATES,
  PAYMENT_METHOD_LABELS,
  WIZARD_PAYMENT_METHODS,
} from "@/modules/client-setup/types";
import {
  documentLabel,
  formatCpfCnpj,
  formatMoneyInput,
  formatPhoneBr,
  moneyDigitsFromAmount,
} from "@/modules/client-setup/input-masks";
import { getUsers } from "@/mock";
import { useFeedback } from "@/contexts/feedback-context";
import { useAppState } from "@/contexts/app-context";
import { CheckCircle2 } from "lucide-react";

interface ClientSetupWizardProps {
  clientId: string;
  onComplete: () => void;
}

export function ClientSetupWizard({ clientId, onComplete }: ClientSetupWizardProps) {
  const { showSuccess, showInfo } = useFeedback();
  const { invalidate } = useAppState();
  const users = useMemo(
    () => getUsers().filter((u) => u.role !== "cliente"),
    []
  );

  const draft = clientSetupService.ensureDraft(clientId);
  const [step, setStep] = useState(1);
  const [personal, setPersonal] = useState<ClientPersonalData>(draft.personal);
  const [service, setService] = useState<ServiceInfo>(() => {
    const s = draft.service;
    if (!s.responsavelInternoId && users[0]) {
      return {
        ...s,
        responsavelInternoId: users[0].id,
        responsavelInternoNome: users[0].nome,
      };
    }
    return s;
  });
  const [payment, setPayment] = useState<PaymentConfig>(() => {
    const p = draft.payment;
    if (!WIZARD_PAYMENT_METHODS.includes(p.method)) {
      return { ...p, method: "pix_avista", installments: 1 };
    }
    return p;
  });
  const norax = draft.norax;
  const docKindLabel = documentLabel(personal.documento);
  const [valorDisplay, setValorDisplay] = useState(() =>
    formatMoneyInput(moneyDigitsFromAmount(draft.service.valorTotal)).display
  );

  const goNext = () => {
    if (step === 1) {
      if (!personal.nome.trim() || !personal.empresa.trim() || !personal.email.trim()) {
        showInfo("Preencha nome, empresa e e-mail.");
        return;
      }
      clientSetupService.savePersonal(clientId, personal);
    }
    if (step === 2) {
      if (!service.nomeProjeto.trim() || !service.valorTotal) {
        showInfo("Informe o nome do projeto e o valor total.");
        return;
      }
      clientSetupService.saveService(clientId, service);
    }
    if (step === 3) {
      if (payment.method === "cartao_parcelado" && payment.installments < 2) {
        showInfo("Informe a quantidade de parcelas.");
        return;
      }
      clientSetupService.savePayment(clientId, payment);
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    clientSetupService.savePersonal(clientId, personal);
    clientSetupService.saveService(clientId, service);
    clientSetupService.savePayment(clientId, payment);
    clientSetupService.complete(clientId);
    invalidate();
    showSuccess("Ficha do cliente configurada com sucesso.");
    onComplete();
  };

  const titles: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: "Dados do cliente",
      subtitle: "Informações cadastrais que alimentarão os contratos.",
    },
    2: {
      title: "Informações do serviço",
      subtitle: "Projeto, valor e responsável interno.",
    },
    3: {
      title: "Forma de pagamento",
      subtitle: "Como o cliente irá pagar pelos serviços.",
    },
    4: {
      title: "Dados da Norax",
      subtitle: "Carregados automaticamente das configurações da empresa.",
    },
    5: {
      title: "Tudo pronto",
      subtitle: "Revise e finalize para liberar a geração de contratos.",
    },
  };

  const meta = titles[step];

  return (
    <WizardShell
      step={step}
      title={meta.title}
      subtitle={meta.subtitle}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={goBack} disabled={step === 1}>
            Voltar
          </Button>
          <div className="flex gap-2">
            {step < 5 ? (
              <Button size="sm" className="bg-foreground text-accent-foreground" onClick={goNext}>
                Continuar
              </Button>
            ) : (
              <Button size="sm" className="bg-foreground text-accent-foreground" onClick={finish}>
                Finalizar configuração
              </Button>
            )}
          </div>
        </>
      }
    >
      {step === 1 && (
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <Field label="Nome do cliente">
            <Input
              name="nx-setup-client-name"
              value={personal.nome}
              onChange={(e) => setPersonal({ ...personal, nome: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Nome da empresa">
            <Input
              name="nx-setup-company"
              value={personal.empresa}
              onChange={(e) => setPersonal({ ...personal, empresa: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              autoComplete="new-password"
            />
          </Field>
          <Field label={docKindLabel}>
            <Input
              name="nx-setup-doc"
              value={personal.documento}
              onChange={(e) =>
                setPersonal({ ...personal, documento: formatCpfCnpj(e.target.value) })
              }
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              placeholder="Digite só os números"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={18}
            />
          </Field>
          <Field label="E-mail">
            <Input
              name="nx-setup-email"
              type="text"
              inputMode="email"
              value={personal.email}
              onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Telefone">
            <Input
              name="nx-setup-phone"
              value={personal.telefone}
              onChange={(e) =>
                setPersonal({ ...personal, telefone: formatPhoneBr(e.target.value) })
              }
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              placeholder="Digite só os números"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={15}
            />
          </Field>
          <Field label="Endereço">
            <Input
              name="nx-setup-address"
              value={personal.endereco}
              onChange={(e) => setPersonal({ ...personal, endereco: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Cidade">
            <Input
              name="nx-setup-city"
              value={personal.cidade}
              onChange={(e) => setPersonal({ ...personal, cidade: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Estado">
            <select
              name="nx-setup-state"
              value={personal.estado}
              onChange={(e) => setPersonal({ ...personal, estado: e.target.value })}
              autoComplete="off"
              className="w-full h-9 rounded-lg border border-border-subtle bg-surface-inset px-3 text-xs text-foreground"
            >
              {BRAZIL_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </Field>
        </form>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Nome do projeto">
            <Input
              value={service.nomeProjeto}
              onChange={(e) => setService({ ...service, nomeProjeto: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              placeholder="Ex: Site institucional"
            />
          </Field>
          <Field label="Valor total (R$)">
            <Input
              value={valorDisplay}
              onChange={(e) => {
                const { display, amount } = formatMoneyInput(e.target.value);
                setValorDisplay(display);
                setService({ ...service, valorTotal: amount });
              }}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              placeholder="Digite só os números"
              inputMode="numeric"
              autoComplete="off"
            />
          </Field>
          <Field label="Data de início">
            <Input
              type="date"
              value={service.dataInicio}
              onChange={(e) => setService({ ...service, dataInicio: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
            />
          </Field>
          <Field label="Prazo previsto">
            <Input
              value={service.prazoPrevisto}
              onChange={(e) => setService({ ...service, prazoPrevisto: e.target.value })}
              className="h-9 text-xs bg-surface-inset border-border-subtle"
              placeholder="Ex: 45 dias úteis"
            />
          </Field>
          <Field label="Responsável interno">
            <select
              value={service.responsavelInternoId}
              onChange={(e) => {
                const u = users.find((x) => x.id === e.target.value);
                setService({
                  ...service,
                  responsavelInternoId: e.target.value,
                  responsavelInternoNome: u?.nome ?? "",
                });
              }}
              className="w-full h-9 rounded-lg border border-border-subtle bg-surface-inset px-3 text-xs text-foreground"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Email de recuperação">
              <Input
                type="text"
                inputMode="email"
                name="nx-setup-recovery-email"
                value={service.emailRecuperacao}
                onChange={(e) => setService({ ...service, emailRecuperacao: e.target.value })}
                className="h-9 text-xs bg-surface-inset border-border-subtle"
                placeholder="gmail do cliente para notificações"
                autoComplete="new-password"
              />
            </Field>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Gmail onde o cliente receberá as notificações.
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {WIZARD_PAYMENT_METHODS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setPayment({
                    ...payment,
                    method: id,
                    installments:
                      id === "cartao_parcelado" ? Math.max(2, payment.installments) : 1,
                  })
                }
                className={`text-left rounded-lg border px-3 py-2.5 text-xs transition-colors ${
                  payment.method === id
                    ? "border-foreground bg-foreground/10 text-foreground"
                    : "border-border-subtle text-muted-foreground hover:text-foreground"
                }`}
              >
                {PAYMENT_METHOD_LABELS[id]}
              </button>
            ))}
          </div>

          {payment.method === "cartao_parcelado" && (
            <Field label="Quantidade de parcelas">
              <Input
                value={payment.installments ? String(payment.installments) : ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
                  const n = digits ? Number(digits) : 0;
                  setPayment({
                    ...payment,
                    installments: n > 24 ? 24 : n,
                  });
                }}
                className="h-9 text-xs bg-surface-inset border-border-subtle"
                placeholder="Ex: 12"
                inputMode="numeric"
                autoComplete="off"
              />
            </Field>
          )}

          {payment.method === "pix_personalizado" && (
            <PixCustomEditor payment={payment} onChange={setPayment} />
          )}
        </div>
      )}

      {step === 4 && (
        <div className="rounded-xl border border-border-subtle bg-surface/40 p-4 space-y-2">
          <p className="text-xs text-muted-foreground mb-3">
            Estes dados vêm das configurações da empresa e não precisam ser digitados.
          </p>
          {[
            ["Empresa", norax.razaoSocial],
            ["CNPJ", norax.cnpj],
            ["Banco", norax.banco],
            ["Chave PIX", norax.chavePix],
            ["Destinatário", norax.destinatarioPix],
            ["Telefone", norax.telefone],
            ["E-mail", norax.email],
            ["Endereço", norax.endereco],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-xs py-1.5 border-b border-border-subtle last:border-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground text-right">{value}</span>
            </div>
          ))}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{personal.empresa || personal.nome}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {service.nomeProjeto} ·{" "}
              {service.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ·{" "}
              {PAYMENT_METHOD_LABELS[payment.method]}
            </p>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Após finalizar, o assistente não será exibido novamente. Você poderá editar a ficha
            depois e gerar contratos com um clique.
          </p>
        </div>
      )}
    </WizardShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function PixCustomEditor({
  payment,
  onChange,
}: {
  payment: PaymentConfig;
  onChange: (p: PaymentConfig) => void;
}) {
  const schedule = payment.customSchedule ?? [];

  const addRow = () => {
    const row: PixCustomInstallment = {
      id: `pix-${Date.now()}`,
      label: `Parcela ${schedule.length + 1}`,
      percent: 0,
      date: "",
    };
    onChange({
      ...payment,
      customSchedule: [...schedule, row],
      installments: schedule.length + 1,
    });
  };

  return (
    <div className="space-y-3 rounded-lg border border-border-subtle p-3">
      <Field label="Entrada (%)">
        <Input
          value={payment.entryPercent != null && payment.entryPercent > 0 ? String(payment.entryPercent) : ""}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
            const n = digits ? Number(digits) : 0;
            onChange({ ...payment, entryPercent: n > 100 ? 100 : n });
          }}
          className="h-9 text-xs bg-surface-inset border-border-subtle"
          placeholder="0"
          inputMode="numeric"
          autoComplete="off"
        />
      </Field>
      {schedule.map((row, idx) => (
        <div key={row.id} className="grid grid-cols-3 gap-2">
          <Input
            value={row.label}
            onChange={(e) => {
              const next = [...schedule];
              next[idx] = { ...row, label: e.target.value };
              onChange({ ...payment, customSchedule: next });
            }}
            className="h-8 text-xs bg-surface-inset border-border-subtle"
            placeholder="Label"
          />
          <Input
            value={row.percent ? String(row.percent) : ""}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
              const n = digits ? Number(digits) : 0;
              const next = [...schedule];
              next[idx] = { ...row, percent: n > 100 ? 100 : n };
              onChange({ ...payment, customSchedule: next });
            }}
            className="h-8 text-xs bg-surface-inset border-border-subtle"
            placeholder="%"
            inputMode="numeric"
            autoComplete="off"
          />
          <Input
            type="date"
            value={row.date}
            onChange={(e) => {
              const next = [...schedule];
              next[idx] = { ...row, date: e.target.value };
              onChange({ ...payment, customSchedule: next });
            }}
            className="h-8 text-xs bg-surface-inset border-border-subtle"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-full h-8 text-xs" onClick={addRow}>
        + Adicionar parcela
      </Button>
    </div>
  );
}
