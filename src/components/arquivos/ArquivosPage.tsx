"use client";

import { useMemo, useState } from "react";
import { FileText, Image, File, Folder, Upload } from "lucide-react";
import { PageTitle } from "@/components/ui/section-title";
import { Card, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ActionButton } from "@/components/ui/action-button";
import { AppModal } from "@/components/ui/app-modal";
import { AppDrawer } from "@/components/ui/app-drawer";
import { FieldLabel, Select } from "@/components/ui/input";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

type FileIcon = typeof FileText;

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  folder: string;
  icon: FileIcon;
}

const FOLDERS = ["Todos", "Comercial", "Projetos", "Contratos", "Financeiro"];

const INITIAL_FILES: FileItem[] = [
  { id: "1", name: "proposta-v2-empresa-abc.pdf", type: "PDF", size: "2.4 MB", date: "03/07", folder: "Comercial", icon: FileText },
  { id: "2", name: "logo-vetor.svg", type: "SVG", size: "128 KB", date: "28/06", folder: "Projetos", icon: Image },
  { id: "3", name: "contrato-assinado-xyz.pdf", type: "PDF", size: "1.1 MB", date: "05/07", folder: "Contratos", icon: FileText },
  { id: "4", name: "wireframe-homepage.fig", type: "FIG", size: "8.2 MB", date: "10/06", folder: "Projetos", icon: File },
  { id: "5", name: "comprovante-pix.pdf", type: "PDF", size: "340 KB", date: "04/07", folder: "Financeiro", icon: FileText },
];

const FOLDER_COUNTS: Record<string, number> = {
  Comercial: 42,
  Projetos: 128,
  Contratos: 24,
  Financeiro: 18,
};

export function ArquivosPage() {
  const { showSuccess } = useFeedback();
  const [files, setFiles] = useState(INITIAL_FILES);
  const [activeFolder, setActiveFolder] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<FileItem | null>(null);
  const [uploadFolder, setUploadFolder] = useState("Comercial");

  const filtered = useMemo(() => {
    if (activeFolder === "Todos") return files;
    return files.filter((f) => f.folder === activeFolder);
  }, [files, activeFolder]);

  const openPreview = (f: FileItem) => {
    setSelected(f);
    setDrawerOpen(true);
  };

  const handleUpload = () => {
    const item: FileItem = {
      id: String(Date.now()),
      name: `novo-arquivo-${Date.now()}.pdf`,
      type: "PDF",
      size: "1.0 MB",
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      folder: uploadFolder,
      icon: FileText,
    };
    setFiles((prev) => [item, ...prev]);
    setModalOpen(false);
    showSuccess("Arquivo enviado com sucesso");
  };

  return (
    <>
      <PageTitle
        title="Arquivos"
        description="Biblioteca central de documentos da agência."
        action={<ActionButton size="sm" onClick={() => setModalOpen(true)}>Upload</ActionButton>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader title="Pastas" />
          <ul className="space-y-1">
            {FOLDERS.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => setActiveFolder(name)}
                  className={cn(
                    "flex items-center gap-2 w-full rounded-lg px-2 py-2 text-sm transition-colors",
                    activeFolder === name
                      ? "text-foreground bg-surface-hover font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                  )}
                >
                  <Folder className="h-4 w-4" />
                  {name}
                  {name !== "Todos" && (
                    <span className="ml-auto text-xs tabular-nums">{FOLDER_COUNTS[name]}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Armazenamento</p>
            <ProgressBar value={34} color="blue" />
            <p className="text-[10px] text-muted-foreground mt-1">3.4 GB de 10 GB</p>
          </div>
        </Card>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {filtered.slice(0, 3).map((f) => (
              <Card key={f.id} hover padding className="text-center cursor-pointer" onClick={() => openPreview(f)}>
                <f.icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs font-medium truncate">{f.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{f.size}</p>
              </Card>
            ))}
          </div>
          <Card padding={false}>
            <div className="divide-y divide-border-subtle">
              {filtered.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => openPreview(f)}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-surface-hover transition-colors"
                >
                  <f.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.type} · {f.size}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{f.date}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">Nenhum arquivo nesta pasta.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload de arquivo"
        footer={
          <>
            <ActionButton variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</ActionButton>
            <ActionButton size="sm" onClick={handleUpload}>Enviar</ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Arraste arquivos ou clique para selecionar</p>
          </div>
          <label><FieldLabel>Pasta destino</FieldLabel>
            <Select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)}>
              {FOLDERS.filter((f) => f !== "Todos").map((f) => <option key={f}>{f}</option>)}
            </Select>
          </label>
        </div>
      </AppModal>

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected?.name ?? ""}
        subtitle={selected?.folder}
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-inset p-8 text-center">
              <selected.icon className="h-12 w-12 text-muted-foreground mx-auto" />
            </div>
            <div><p className="text-xs text-muted-foreground mb-1">Tipo</p><p className="text-sm">{selected.type}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Tamanho</p><p className="text-sm">{selected.size}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Data</p><p className="text-sm">{selected.date}</p></div>
          </div>
        )}
      </AppDrawer>
    </>
  );
}
