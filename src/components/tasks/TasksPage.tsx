"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { PageTitle } from "@/components/ui/section-title";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardHeader } from "@/components/ui/card";
import { DonutChart } from "@/components/ui/chart";
import { ActionButton } from "@/components/ui/action-button";
import { AppModal } from "@/components/ui/app-modal";
import { AppDrawer } from "@/components/ui/app-drawer";
import { FieldLabel, Input, Select } from "@/components/ui/input";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  t: string;
  ctx: string;
  due: string;
  completed: boolean;
  group: string;
  groupColor: string;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", t: "Cobrar material — Site ABC", ctx: "Projeto", due: "Hoje", completed: false, group: "Urgente", groupColor: "text-state-red" },
  { id: "2", t: "Enviar proposta revisada", ctx: "Comercial", due: "Hoje", completed: false, group: "Urgente", groupColor: "text-state-red" },
  { id: "3", t: "Preparar kickoff — Startup", ctx: "Projeto", due: "Sex", completed: false, group: "Esta semana", groupColor: "text-state-orange" },
  { id: "4", t: "Registrar assinatura contrato", ctx: "Comercial", due: "Qui", completed: false, group: "Esta semana", groupColor: "text-state-orange" },
  { id: "5", t: "QA mobile — Landing XYZ", ctx: "Projeto", due: "Sex", completed: false, group: "Esta semana", groupColor: "text-state-orange" },
  { id: "6", t: "Atualizar modelo de proposta", ctx: "Modelos", due: "—", completed: false, group: "Backlog", groupColor: "text-muted-foreground" },
  { id: "7", t: "Revisar briefings pendentes", ctx: "Briefings", due: "—", completed: false, group: "Backlog", groupColor: "text-muted-foreground" },
];

export function TasksPage() {
  const { showSuccess } = useFeedback();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCtx, setNewCtx] = useState("Projeto");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.t.toLowerCase().includes(q) || t.ctx.toLowerCase().includes(q));
  }, [tasks, search]);

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; color: string; tasks: Task[] }>();
    for (const task of filtered) {
      if (!map.has(task.group)) map.set(task.group, { label: task.group, color: task.groupColor, tasks: [] });
      map.get(task.group)!.tasks.push(task);
    }
    return Array.from(map.values());
  }, [filtered]);

  const openCount = tasks.filter((t) => !t.completed).length;
  const doneCount = tasks.filter((t) => t.completed).length;

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: String(Date.now()),
      t: newTitle.trim(),
      ctx: newCtx,
      due: "—",
      completed: false,
      group: "Backlog",
      groupColor: "text-muted-foreground",
    };
    setTasks((prev) => [...prev, task]);
    setModalOpen(false);
    setNewTitle("");
    showSuccess("Task criada com sucesso");
  };

  return (
    <>
      <PageTitle
        title="Tasks"
        description="Tarefas operacionais — o que precisa ser feito."
        action={<ActionButton size="sm" onClick={() => setModalOpen(true)}>Nova task</ActionButton>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Abertas" value={openCount} format="number" />
        <MetricCard label="Vencidas" value={2} format="number" changeType="down" change="atenção" />
        <MetricCard label="Concluídas (semana)" value={doneCount + 24} format="number" changeType="up" change="+8" />
        <MetricCard label="Taxa conclusão" value="86%" />
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tasks..."
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {groups.length > 0 ? groups.map((g) => (
            <div key={g.label}>
              <h3 className={cn("text-xs font-semibold uppercase tracking-wider mb-3", g.color)}>{g.label}</h3>
              <div className="space-y-2">
                {g.tasks.map((task) => (
                  <Card
                    key={task.id}
                    padding
                    className="flex items-center gap-4 py-3 cursor-pointer"
                    onClick={() => { setSelected(task); setDrawerOpen(true); }}
                  >
                    <button
                      type="button"
                      onClick={(e) => toggleComplete(task.id, e)}
                      className={cn(
                        "h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-colors",
                        task.completed ? "bg-accent border-accent" : "border-border-strong hover:border-foreground"
                      )}
                      aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
                    >
                      {task.completed && <Check className="h-3 w-3 text-accent-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>{task.t}</p>
                      <p className="text-xs text-muted-foreground">{task.ctx}</p>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">{task.due}</span>
                  </Card>
                ))}
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma task encontrada.</p>
          )}
        </div>
        <Card>
          <CardHeader title="Por módulo" />
          <DonutChart
            segments={[
              { value: 8, color: "#60a5fa", label: "Projetos" },
              { value: 5, color: "#a78bfa", label: "Comercial" },
              { value: 3, color: "#4ade80", label: "Financeiro" },
              { value: 2, color: "#fb923c", label: "Outros" },
            ]}
          />
        </Card>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova task"
        footer={
          <>
            <ActionButton variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</ActionButton>
            <ActionButton size="sm" onClick={handleCreate}>Criar task</ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <label><FieldLabel>Título</FieldLabel><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Descreva a tarefa" /></label>
          <label><FieldLabel>Módulo</FieldLabel>
            <Select value={newCtx} onChange={(e) => setNewCtx(e.target.value)}>
              <option>Projeto</option><option>Comercial</option><option>Modelos</option><option>Briefings</option>
            </Select>
          </label>
        </div>
      </AppModal>

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected?.t ?? ""}
        subtitle={selected?.ctx}
      >
        {selected && (
          <div className="space-y-4">
            <div><p className="text-xs text-muted-foreground mb-1">Prazo</p><p className="text-sm">{selected.due}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Grupo</p><p className="text-sm">{selected.group}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Status</p><p className="text-sm">{selected.completed ? "Concluída" : "Pendente"}</p></div>
          </div>
        )}
      </AppDrawer>
    </>
  );
}
