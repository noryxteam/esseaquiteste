"use client";

import { useEffect, useState } from "react";
import { PageTitle } from "@/components/ui/section-title";
import { Card, CardHeader } from "@/components/ui/card";
import { ActionButton } from "@/components/ui/action-button";
import { Input, FieldLabel, Select } from "@/components/ui/input";
import { TrustedDevicesSettings } from "@/modules/security/components/TrustedDevicesSettings";
import { useFeedback } from "@/contexts/feedback-context";
import { useAuth } from "@/contexts/auth-context";
import { getSettings, updateSettings } from "@/mock/settings";
import { cn } from "@/lib/utils";

const sections = [
  { id: "geral", label: "Geral" },
  { id: "empresa", label: "Empresa" },
  { id: "notificacoes", label: "Notificações" },
  { id: "faturamento", label: "Faturamento" },
  { id: "seguranca", label: "Segurança" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const PROFILE_STORAGE_KEY = "norax.profile.v1";

const TIMEZONES = [
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo (GMT-3)" },
  { value: "America/Manaus", label: "America/Manaus (GMT-4)" },
  { value: "America/Belem", label: "America/Belem (GMT-3)" },
  { value: "America/Fortaleza", label: "America/Fortaleza (GMT-3)" },
  { value: "America/Recife", label: "America/Recife (GMT-3)" },
  { value: "America/Noronha", label: "America/Noronha (GMT-2)" },
  { value: "UTC", label: "UTC (GMT+0)" },
];

interface ProfileForm {
  nome: string;
  email: string;
  fusoHorario: string;
}

function loadProfile(fallback: ProfileForm): ProfileForm {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw) as Partial<ProfileForm>;
    return {
      nome: saved.nome ?? fallback.nome,
      email: saved.email ?? fallback.email,
      fusoHorario: saved.fusoHorario ?? fallback.fusoHorario,
    };
  } catch {
    return fallback;
  }
}

export default function ConfiguracoesPage() {
  const [active, setActive] = useState<SectionId>("geral");
  const { showSuccess, showInfo } = useFeedback();
  const { user } = useAuth();
  const settings = getSettings();

  const [profile, setProfile] = useState<ProfileForm>({
    nome: user?.nome ?? "",
    email: user?.email ?? "",
    fusoHorario: settings.preferencias.fusoHorario || "America/Sao_Paulo",
  });

  const [empresa, setEmpresa] = useState(() => ({ ...settings.empresa }));

  useEffect(() => {
    const fallback: ProfileForm = {
      nome: user?.nome ?? "Murilo Lima",
      email: user?.email ?? "admin@norax.dev",
      fusoHorario: getSettings().preferencias.fusoHorario || "America/Sao_Paulo",
    };
    setProfile(loadProfile(fallback));
  }, [user?.nome, user?.email]);

  const saveProfile = () => {
    if (!profile.nome.trim()) {
      showInfo("Informe um nome.");
      return;
    }
    if (!profile.email.trim() || !profile.email.includes("@")) {
      showInfo("Informe um e-mail válido.");
      return;
    }
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    updateSettings({ preferencias: { fusoHorario: profile.fusoHorario } });
    showSuccess("Alterações salvas com sucesso");
  };

  const saveEmpresa = () => {
    updateSettings({ empresa });
    showSuccess("Dados da empresa salvos com sucesso");
  };

  const saveFaturamento = () => {
    updateSettings({
      empresa: {
        banco: empresa.banco,
        agencia: empresa.agencia,
        conta: empresa.conta,
        chavePix: empresa.chavePix,
        destinatarioPix: empresa.destinatarioPix,
      },
    });
    showSuccess("Dados de faturamento salvos");
  };

  return (
    <>
      <PageTitle title="Configurações" description="Preferências da conta e da empresa." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit" padding>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                  active === s.id
                    ? "bg-white/[0.06] text-foreground font-medium"
                    : "text-muted-foreground hover:bg-surface-hover"
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {active === "geral" && (
            <Card>
              <CardHeader title="Perfil" subtitle="Informações da sua conta" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <label>
                  <FieldLabel>Nome</FieldLabel>
                  <Input
                    value={profile.nome}
                    onChange={(e) => setProfile((p) => ({ ...p, nome: e.target.value }))}
                    placeholder="Seu nome"
                    autoComplete="off"
                  />
                </label>
                <label>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="text"
                    inputMode="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    placeholder="seu@email.com"
                    autoComplete="off"
                  />
                </label>
                <label className="sm:col-span-2">
                  <FieldLabel>Fuso horário</FieldLabel>
                  <Select
                    value={profile.fusoHorario}
                    onChange={(e) => setProfile((p) => ({ ...p, fusoHorario: e.target.value }))}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>
              <ActionButton size="sm" className="mt-4" onClick={saveProfile}>
                Salvar alterações
              </ActionButton>
            </Card>
          )}

          {active === "empresa" && (
            <Card>
              <CardHeader title="Empresa" subtitle="Dados da Norax usados nos contratos" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <label>
                  <FieldLabel>Razão social</FieldLabel>
                  <Input
                    value={empresa.razaoSocial}
                    onChange={(e) => setEmpresa((p) => ({ ...p, razaoSocial: e.target.value }))}
                  />
                </label>
                <label>
                  <FieldLabel>CNPJ</FieldLabel>
                  <Input
                    value={empresa.cnpj}
                    onChange={(e) => setEmpresa((p) => ({ ...p, cnpj: e.target.value }))}
                  />
                </label>
                <label>
                  <FieldLabel>E-mail</FieldLabel>
                  <Input
                    type="email"
                    value={empresa.email}
                    onChange={(e) => setEmpresa((p) => ({ ...p, email: e.target.value }))}
                  />
                </label>
                <label>
                  <FieldLabel>Telefone</FieldLabel>
                  <Input
                    value={empresa.telefone}
                    onChange={(e) => setEmpresa((p) => ({ ...p, telefone: e.target.value }))}
                  />
                </label>
                <label className="sm:col-span-2">
                  <FieldLabel>Endereço</FieldLabel>
                  <Input
                    value={empresa.endereco}
                    onChange={(e) => setEmpresa((p) => ({ ...p, endereco: e.target.value }))}
                  />
                </label>
              </div>
              <ActionButton size="sm" className="mt-4" onClick={saveEmpresa}>
                Salvar empresa
              </ActionButton>
            </Card>
          )}

          {active === "seguranca" && (
            <Card padding>
              <CardHeader title="Segurança" subtitle="Dispositivos confiáveis da Norax" />
              <TrustedDevicesSettings />
            </Card>
          )}

          {active === "notificacoes" && (
            <Card padding>
              <CardHeader title="Notificações" subtitle="Em breve" />
              <p className="text-sm text-muted-foreground">
                Configurações de notificação em desenvolvimento.
              </p>
            </Card>
          )}

          {active === "faturamento" && (
            <Card>
              <CardHeader title="Faturamento" subtitle="Dados bancários e PIX para contratos" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <label>
                  <FieldLabel>Banco</FieldLabel>
                  <Input
                    value={empresa.banco ?? ""}
                    onChange={(e) => setEmpresa((p) => ({ ...p, banco: e.target.value }))}
                  />
                </label>
                <label>
                  <FieldLabel>Agência</FieldLabel>
                  <Input
                    value={empresa.agencia ?? ""}
                    onChange={(e) => setEmpresa((p) => ({ ...p, agencia: e.target.value }))}
                  />
                </label>
                <label>
                  <FieldLabel>Conta</FieldLabel>
                  <Input
                    value={empresa.conta ?? ""}
                    onChange={(e) => setEmpresa((p) => ({ ...p, conta: e.target.value }))}
                  />
                </label>
                <label>
                  <FieldLabel>Destinatário PIX</FieldLabel>
                  <Input
                    value={empresa.destinatarioPix ?? ""}
                    onChange={(e) =>
                      setEmpresa((p) => ({ ...p, destinatarioPix: e.target.value }))
                    }
                  />
                </label>
                <label className="sm:col-span-2">
                  <FieldLabel>Chave PIX</FieldLabel>
                  <Input
                    value={empresa.chavePix ?? ""}
                    onChange={(e) => setEmpresa((p) => ({ ...p, chavePix: e.target.value }))}
                  />
                </label>
              </div>
              <ActionButton size="sm" className="mt-4" onClick={saveFaturamento}>
                Salvar faturamento
              </ActionButton>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
