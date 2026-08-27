"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/ui/section-title";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButton } from "@/components/ui/action-button";
import { AppModal } from "@/components/ui/app-modal";
import { FieldLabel, Input, Select } from "@/components/ui/input";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  projects: number;
  status: string;
  v: "green" | "orange";
  initials: string;
}

const INITIAL_TEAM: Member[] = [
  { id: "1", name: "Murilo Lima", role: "Fundador", email: "murilo@norax.dev", projects: 8, status: "Ativo", v: "green", initials: "ML" },
  { id: "2", name: "Ana Costa", role: "Designer", email: "ana@norax.dev", projects: 4, status: "Ativo", v: "green", initials: "AC" },
  { id: "3", name: "Pedro Santos", role: "Desenvolvedor", email: "pedro@norax.dev", projects: 5, status: "Ativo", v: "green", initials: "PS" },
  { id: "4", name: "Carla Mendes", role: "Comercial", email: "carla@norax.dev", projects: 2, status: "Férias", v: "orange", initials: "CM" },
];

export function EquipePage() {
  const router = useRouter();
  const { showSuccess } = useFeedback();
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Designer");

  const openInvite = () => setModalOpen(true);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const initials = inviteEmail.slice(0, 2).toUpperCase();
    const member: Member = {
      id: String(Date.now()),
      name: inviteEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      role: inviteRole,
      email: inviteEmail.trim(),
      projects: 0,
      status: "Convidado",
      v: "orange",
      initials,
    };
    setTeam((prev) => [...prev, member]);
    setModalOpen(false);
    setInviteEmail("");
    showSuccess("Convite enviado com sucesso");
  };

  return (
    <>
      <PageTitle
        title="Equipe"
        description="Membros, papéis e capacidade operacional."
        action={<ActionButton size="sm" onClick={openInvite}>Convidar membro</ActionButton>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard label="Membros" value={team.length} format="number" />
        <MetricCard label="Projetos / pessoa" value="4.8" suffix="média" />
        <MetricCard label="Disponibilidade" value="85%" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {team.map((m) => (
          <Card key={m.id} hover className="cursor-pointer" onClick={() => router.push(routes.membro(m.id))}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-sm font-medium">
                {m.initials}
              </div>
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{m.email}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{m.projects} projetos</span>
              <StatusBadge label={m.status} variant={m.v} />
            </div>
          </Card>
        ))}
        <Card className="border-dashed flex flex-col items-center justify-center min-h-[180px] text-center cursor-pointer hover:border-border-strong transition-colors" onClick={openInvite}>
          <p className="text-sm text-muted-foreground">Adicionar membro</p>
          <ActionButton variant="outline" size="sm" className="mt-3" onClick={(e) => { e.stopPropagation(); openInvite(); }}>Convidar</ActionButton>
        </Card>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Convidar membro"
        footer={
          <>
            <ActionButton variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</ActionButton>
            <ActionButton size="sm" onClick={handleInvite}>Enviar convite</ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <label><FieldLabel>Email</FieldLabel><Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@empresa.com" /></label>
          <label><FieldLabel>Papel</FieldLabel>
            <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
              <option>Designer</option><option>Desenvolvedor</option><option>Comercial</option><option>Gestor</option>
            </Select>
          </label>
        </div>
      </AppModal>
    </>
  );
}
