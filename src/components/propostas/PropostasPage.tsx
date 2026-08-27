"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/ui/section-title";
import { MetricCard } from "@/components/ui/metric-card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { ActionButton } from "@/components/ui/action-button";
import { AppModal } from "@/components/ui/app-modal";
import { FieldLabel, Input } from "@/components/ui/input";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";

interface Proposal {
  id: string;
  c: string;
  p: string;
  v: string;
  d: string;
  s: string;
  sv: "blue" | "orange" | "green" | "default";
}

const INITIAL_PROPOSALS: Proposal[] = [
  { id: "1", c: "Empresa ABC", p: "Site v2", v: "R$ 8.000", d: "15/07", s: "Enviada", sv: "blue" },
  { id: "2", c: "Startup Tech", p: "Landing", v: "R$ 5.500", d: "20/07", s: "Negociação", sv: "orange" },
  { id: "3", c: "Loja XYZ", p: "LP BF", v: "R$ 4.500", d: "10/07", s: "Aprovada", sv: "green" },
  { id: "4", c: "Agência Delta", p: "Sistema", v: "R$ 45.000", d: "—", s: "Rascunho", sv: "default" },
];

export function PropostasPage() {
  const router = useRouter();
  const { showSuccess } = useFeedback();
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleCreate = () => {
    if (!newClient.trim() || !newTitle.trim()) return;
    const item: Proposal = {
      id: String(Date.now()),
      c: newClient.trim(),
      p: newTitle.trim(),
      v: newValue.trim() || "R$ 0",
      d: "—",
      s: "Rascunho",
      sv: "default",
    };
    setProposals((prev) => [item, ...prev]);
    setModalOpen(false);
    setNewClient("");
    setNewTitle("");
    setNewValue("");
    showSuccess("Proposta criada com sucesso");
  };

  return (
    <>
      <PageTitle
        title="Propostas"
        description="Pipeline comercial — envio, negociação e conversão."
        action={<ActionButton size="sm" onClick={() => setModalOpen(true)}>Nova proposta</ActionButton>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Enviadas (mês)" value={18} format="number" change="+5" changeType="up" />
        <MetricCard label="Valor pipeline" value={186000} format="currency" />
        <MetricCard label="Taxa de aceite" value="38%" changeType="up" change="+2pp" />
        <MetricCard label="Sem resposta" value={4} format="number" changeType="down" change="> 7 dias" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader title="Propostas recentes" />
          <Table>
            <THead>
              <TH>Cliente</TH>
              <TH>Proposta</TH>
              <TH>Valor</TH>
              <TH>Validade</TH>
              <TH>Status</TH>
            </THead>
            <TBody>
              {proposals.map((r) => (
                <TR
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() => router.push(routes.proposta(r.id))}
                >
                  <TD className="font-medium text-foreground">{r.c}</TD>
                  <TD>{r.p}</TD>
                  <TD className="tabular-nums">{r.v}</TD>
                  <TD className="text-muted-foreground">{r.d}</TD>
                  <TD><StatusBadge label={r.s} variant={r.sv} /></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
        <Card>
          <CardHeader title="Valor por status" />
          <BarChart
            data={[
              { label: "Rascunho", value: 45, color: "bg-zinc-500" },
              { label: "Enviada", value: 82, color: "bg-blue-400" },
              { label: "Negoc.", value: 38, color: "bg-orange-400" },
              { label: "Ganha", value: 21, color: "bg-green-400" },
            ]}
          />
        </Card>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova proposta"
        footer={
          <>
            <ActionButton variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</ActionButton>
            <ActionButton size="sm" onClick={handleCreate}>Criar proposta</ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <label><FieldLabel>Cliente</FieldLabel><Input value={newClient} onChange={(e) => setNewClient(e.target.value)} placeholder="Nome do cliente" /></label>
          <label><FieldLabel>Título</FieldLabel><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ex: Site v2" /></label>
          <label><FieldLabel>Valor</FieldLabel><Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="R$ 0,00" /></label>
        </div>
      </AppModal>
    </>
  );
}
