"use client";

import { useState } from "react";
import Link from "next/link";
import { PageTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButton } from "@/components/ui/action-button";
import { AppModal } from "@/components/ui/app-modal";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";

interface Integration {
  name: string;
  desc: string;
  status: string;
  connected: boolean;
  color: "green" | "default" | "purple";
}

const integrations: Integration[] = [
  { name: "Stripe", desc: "Pagamentos e assinaturas", status: "Conectado", connected: true, color: "green" },
  { name: "Clicksign", desc: "Assinatura digital de contratos", status: "Conectado", connected: true, color: "green" },
  { name: "Google Calendar", desc: "Sincronizar reuniões", status: "Conectado", connected: true, color: "green" },
  { name: "Slack", desc: "Notificações da equipe", status: "Desconectado", connected: false, color: "default" },
  { name: "WhatsApp Business", desc: "Comunicação com clientes", status: "Em breve", connected: false, color: "purple" },
  { name: "Notion", desc: "Documentação interna", status: "Desconectado", connected: false, color: "default" },
];

export function IntegracoesPage() {
  const { showSuccess, showInfo } = useFeedback();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Integration | null>(null);

  const handleAction = (int: Integration) => {
    if (int.status === "Em breve") {
      showInfo(`${int.name} estará disponível em breve`);
      return;
    }
    setSelected(int);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (!selected) return;
    if (selected.connected) {
      showInfo(`Gerenciando integração ${selected.name}. Acesse as configurações para mais opções.`);
    } else {
      showSuccess(`${selected.name} conectado com sucesso`);
    }
    setModalOpen(false);
  };

  return (
    <>
      <PageTitle
        title="Integrações"
        description="Conecte ferramentas externas à Norax."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((int) => (
          <Card key={int.name} hover>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-surface-inset border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                {int.name.slice(0, 2).toUpperCase()}
              </div>
              <StatusBadge label={int.status} variant={int.color} />
            </div>
            <p className="text-sm font-medium">{int.name}</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">{int.desc}</p>
            <ActionButton
              variant={int.connected ? "outline" : "primary"}
              size="sm"
              className="w-full"
              disabled={int.status === "Em breve"}
              onClick={() => handleAction(int)}
            >
              {int.connected ? "Gerenciar" : int.status === "Em breve" ? "Em breve" : "Conectar"}
            </ActionButton>
          </Card>
        ))}
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selected?.connected ? `Gerenciar ${selected?.name}` : `Conectar ${selected?.name}`}
        footer={
          <>
            <ActionButton variant="outline" size="sm" onClick={() => setModalOpen(false)}>Fechar</ActionButton>
            <ActionButton size="sm" onClick={handleConfirm}>
              {selected?.connected ? "Abrir configurações" : "Conectar agora"}
            </ActionButton>
          </>
        }
      >
        {selected && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{selected.desc}</p>
            <p className="text-sm">
              Status atual: <StatusBadge label={selected.status} variant={selected.color} />
            </p>
            {selected.connected ? (
              <p className="text-xs text-muted-foreground">
                A integração está ativa. Você pode revisar permissões e sincronização em{" "}
                <Link href={routes.integracoes} className="text-foreground underline">Integrações</Link>.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Ao conectar, a Norax solicitará autorização para sincronizar dados com {selected.name}.
              </p>
            )}
          </div>
        )}
      </AppModal>
    </>
  );
}
