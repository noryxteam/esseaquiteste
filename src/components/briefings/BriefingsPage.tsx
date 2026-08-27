"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { PageTitle } from "@/components/ui/section-title";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ActionButton } from "@/components/ui/action-button";
import { AppModal } from "@/components/ui/app-modal";
import { AppDrawer } from "@/components/ui/app-drawer";
import { FieldLabel, Input, Select } from "@/components/ui/input";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

type BriefingStatus = "Completo" | "Em preenchimento" | "Não iniciado" | "Revisão";
type BriefingVariant = "green" | "orange" | "default" | "blue";

interface Briefing {
  id: string;
  title: string;
  client: string;
  progress: number;
  status: BriefingStatus;
  v: BriefingVariant;
}

const INITIAL_BRIEFINGS: Briefing[] = [
  { id: "1", title: "Briefing Site Institucional", client: "Empresa ABC", progress: 100, status: "Completo", v: "green" },
  { id: "2", title: "Briefing Landing Page", client: "Startup Tech", progress: 45, status: "Em preenchimento", v: "orange" },
  { id: "3", title: "Briefing E-commerce", client: "Loja Nova", progress: 0, status: "Não iniciado", v: "default" },
  { id: "4", title: "Briefing Sistema Web", client: "Tech Corp", progress: 80, status: "Revisão", v: "blue" },
  { id: "5", title: "Briefing Portal", client: "RH Plus", progress: 60, status: "Em preenchimento", v: "orange" },
];

type FilterKey = "all" | "pending" | "completion";

export function BriefingsPage() {
  const { showSuccess, showInfo } = useFeedback();
  const [briefings, setBriefings] = useState(INITIAL_BRIEFINGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Briefing | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");

  const filtered = useMemo(() => {
    if (filter === "pending") return briefings.filter((b) => b.progress < 100);
    return briefings;
  }, [briefings, filter]);

  const handleMetricClick = (key: FilterKey) => {
    if (key === "completion") {
      showInfo("Taxa de conclusão: 78% (+5% vs. mês anterior)");
      return;
    }
    setFilter(key);
    showInfo(key === "all" ? "Exibindo todos os briefings" : "Filtrando briefings pendentes");
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const item: Briefing = {
      id: String(Date.now()),
      title: newTitle.trim(),
      client: newClient.trim() || "Novo cliente",
      progress: 0,
      status: "Não iniciado",
      v: "default",
    };
    setBriefings((prev) => [item, ...prev]);
    setModalOpen(false);
    setNewTitle("");
    setNewClient("");
    showSuccess("Briefing criado com sucesso");
  };

  const openDrawer = (b: Briefing) => {
    setSelected(b);
    setDrawerOpen(true);
  };

  return (
    <>
      <PageTitle
        title="Briefings"
        description="Formulários de descoberta e coleta de requisitos dos clientes."
        action={<ActionButton size="sm" onClick={() => setModalOpen(true)}>Novo briefing</ActionButton>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button type="button" onClick={() => handleMetricClick("all")} className="text-left">
          <MetricCard label="Total" value={briefings.length} format="number" />
        </button>
        <button type="button" onClick={() => handleMetricClick("pending")} className="text-left">
          <MetricCard label="Pendentes" value={briefings.filter((b) => b.progress < 100).length} format="number" changeType="down" change="aguardando cliente" />
        </button>
        <button type="button" onClick={() => handleMetricClick("completion")} className="text-left">
          <MetricCard label="Taxa de conclusão" value="78%" changeType="up" change="+5%" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <Card
            key={b.id}
            hover
            className={cn("cursor-pointer", selected?.id === b.id && drawerOpen && "border-border-strong")}
            onClick={() => openDrawer(b)}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-surface-inset border border-border flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{b.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{b.client}</p>
                <div className="mt-3">
                  <ProgressBar value={b.progress} color={b.progress === 100 ? "green" : "blue"} />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{b.progress}%</span>
                    <StatusBadge label={b.status} variant={b.v} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo briefing"
        footer={
          <>
            <ActionButton variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</ActionButton>
            <ActionButton size="sm" onClick={handleCreate}>Criar briefing</ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <label><FieldLabel>Título</FieldLabel><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ex: Briefing Site Institucional" /></label>
          <label><FieldLabel>Cliente</FieldLabel><Input value={newClient} onChange={(e) => setNewClient(e.target.value)} placeholder="Nome do cliente" /></label>
          <label><FieldLabel>Modelo</FieldLabel><Select defaultValue="site"><option value="site">Briefing — Site</option><option value="ecommerce">Briefing — E-commerce</option></Select></label>
        </div>
      </AppModal>

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected?.title ?? ""}
        subtitle={selected?.client}
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Progresso</p>
              <ProgressBar value={selected.progress} color={selected.progress === 100 ? "green" : "blue"} />
              <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">{selected.progress}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <StatusBadge label={selected.status} variant={selected.v} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cliente</p>
              <p className="text-sm">{selected.client}</p>
            </div>
          </div>
        )}
      </AppDrawer>
    </>
  );
}
