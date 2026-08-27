"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Mail, FileSignature, ClipboardList } from "lucide-react";
import { PageTitle } from "@/components/ui/section-title";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActionButton } from "@/components/ui/action-button";
import { AppModal } from "@/components/ui/app-modal";
import { FieldLabel, Input, Select } from "@/components/ui/input";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";

interface ModelItem {
  id: string;
  name: string;
  uses: number;
  updated: string;
}

const categories = [
  {
    title: "Propostas",
    icon: FileText,
    items: [
      { id: "prop-site", name: "Proposta — Site Institucional", uses: 24, updated: "01/07" },
      { id: "prop-landing", name: "Proposta — Landing Page", uses: 18, updated: "15/06" },
      { id: "prop-sistema", name: "Proposta — Sistema Web", uses: 8, updated: "20/05" },
    ],
  },
  {
    title: "Contratos",
    icon: FileSignature,
    items: [
      { id: "cont-pj", name: "Contrato padrão — PJ", uses: 32, updated: "10/06" },
      { id: "cont-manut", name: "Contrato — Manutenção", uses: 12, updated: "01/05" },
    ],
  },
  {
    title: "Emails",
    icon: Mail,
    items: [
      { id: "email-follow", name: "Follow-up proposta", uses: 45, updated: "28/06" },
      { id: "email-cobr", name: "Cobrança material", uses: 38, updated: "20/06" },
    ],
  },
  {
    title: "Briefings",
    icon: ClipboardList,
    items: [
      { id: "brief-site", name: "Briefing — Site", uses: 20, updated: "05/07" },
      { id: "brief-ecom", name: "Briefing — E-commerce", uses: 6, updated: "12/04" },
    ],
  },
];

export function ModelosPage() {
  const router = useRouter();
  const { showSuccess } = useFeedback();
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Propostas");
  const [extraItems, setExtraItems] = useState<Record<string, ModelItem[]>>({});

  const allCategories = categories.map((cat) => ({
    ...cat,
    items: [...cat.items, ...(extraItems[cat.title] ?? [])],
  }));

  const handleCreate = () => {
    if (!newName.trim()) return;
    const item: ModelItem = {
      id: String(Date.now()),
      name: newName.trim(),
      uses: 0,
      updated: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    };
    setExtraItems((prev) => ({
      ...prev,
      [newCategory]: [...(prev[newCategory] ?? []), item],
    }));
    setModalOpen(false);
    setNewName("");
    showSuccess("Modelo criado com sucesso");
  };

  return (
    <>
      <PageTitle
        title="Modelos"
        description="Templates reutilizáveis — propostas, contratos, emails e briefings."
        action={<ActionButton size="sm" onClick={() => setModalOpen(true)}>Criar modelo</ActionButton>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allCategories.map((cat) => (
          <Card key={cat.title}>
            <CardHeader
              title={cat.title}
              action={<cat.icon className="h-4 w-4 text-muted-foreground" />}
            />
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => router.push(routes.modelo(item.id))}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 w-full text-left hover:bg-surface-hover transition-colors"
                  >
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Atualizado {item.updated}</p>
                    </div>
                    <StatusBadge label={`${item.uses} usos`} variant="default" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Criar modelo"
        footer={
          <>
            <ActionButton variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</ActionButton>
            <ActionButton size="sm" onClick={handleCreate}>Criar</ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <label><FieldLabel>Nome</FieldLabel><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do modelo" /></label>
          <label><FieldLabel>Categoria</FieldLabel>
            <Select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
              {categories.map((c) => <option key={c.title}>{c.title}</option>)}
            </Select>
          </label>
        </div>
      </AppModal>
    </>
  );
}
