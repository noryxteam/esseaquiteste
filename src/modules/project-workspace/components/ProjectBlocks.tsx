"use client";

import { useRef, useState } from "react";
import { Download, Eye, FileText, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import {
  addBlock,
  addProjectFile,
  removeBlock,
  removeProjectFile,
  updateBlockBody,
} from "@/modules/project-workspace/store";
import type {
  ProjectBlock,
  ProjectBlockKind,
  ProjectFileItem,
} from "@/modules/project-workspace/types";
import { BLOCK_KIND_LABELS } from "@/modules/project-workspace/types";
import { formatDateTimeBR } from "@/modules/project-workspace/utils";

const ACCEPTED =
  ".pdf,.docx,.png,.jpg,.jpeg,.zip,.fig,.mp4,application/pdf,image/png,image/jpeg,application/zip,video/mp4";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

interface ProjectBlocksProps {
  projectId: string;
  blocks: ProjectBlock[];
  files: ProjectFileItem[];
  userName: string;
  readOnly?: boolean;
  /** Esconde blocos internos + arquivos internos */
  clientMode?: boolean;
}

export function ProjectBlocks({
  projectId,
  blocks,
  files,
  userName,
  readOnly = false,
  clientMode = false,
}: ProjectBlocksProps) {
  const [addOpen, setAddOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const visibleBlocks = clientMode
    ? blocks.filter((b) => !b.internalOnly && b.kind !== "arquivos")
    : blocks;
  const visibleFiles = clientMode ? files.filter((f) => !f.internalOnly) : files;
  const hasFilesBlock =
    visibleBlocks.some((b) => b.kind === "arquivos") || (!clientMode && visibleFiles.length > 0);

  const onUpload = async (list: FileList | null) => {
    if (!list?.length) return;
    for (const file of Array.from(list)) {
      if (file.size > MAX_FILE_BYTES) {
        window.alert(`Arquivo "${file.name}" excede 2 MB (limite do protótipo).`);
        continue;
      }
      const dataUrl = await readAsDataUrl(file);
      addProjectFile(
        projectId,
        {
          name: file.name,
          mime: file.type || "application/octet-stream",
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: userName,
          dataUrl,
          internalOnly: true,
        },
        userName
      );
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Blocos do projeto</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Módulos opcionais — adicione só o que este projeto precisa.
          </p>
        </div>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs border-border-subtle gap-1"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar bloco
          </Button>
        )}
      </div>

      {visibleBlocks.length === 0 && visibleFiles.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-4 py-10 text-center">
          <p className="text-xs text-muted-foreground">Nenhum bloco adicionado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleBlocks.map((block) => (
            <div
              key={block.id}
              className="rounded-lg border border-border bg-surface overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border-subtle">
                <div>
                  <p className="text-sm font-medium text-foreground">{block.title}</p>
                  {block.internalOnly && !clientMode && (
                    <p className="text-[10px] text-muted-foreground">Interno — oculto do cliente</p>
                  )}
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-state-red"
                    onClick={() => {
                      if (window.confirm(`Remover bloco "${block.title}"?`)) {
                        removeBlock(projectId, block.id, userName);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="p-4">
                {block.kind === "arquivos" ? (
                  <FilesPanel
                    files={visibleFiles}
                    readOnly={readOnly}
                    onUpload={() => fileRef.current?.click()}
                    onRemove={(id) => removeProjectFile(projectId, id, userName)}
                  />
                ) : readOnly ? (
                  <p className="text-xs text-foreground/80 whitespace-pre-wrap min-h-[2rem]">
                    {block.body || "—"}
                  </p>
                ) : (
                  <textarea
                    value={block.body}
                    onChange={(e) => updateBlockBody(projectId, block.id, e.target.value, userName)}
                    rows={4}
                    placeholder={`Conteúdo de ${block.title.toLowerCase()}...`}
                    className="w-full rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border resize-y min-h-[80px]"
                  />
                )}
              </div>
            </div>
          ))}

          {!visibleBlocks.some((b) => b.kind === "arquivos") && visibleFiles.length > 0 && (
            <div className="rounded-lg border border-border bg-surface overflow-hidden">
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="text-sm font-medium text-foreground">Arquivos</p>
              </div>
              <div className="p-4">
                <FilesPanel
                  files={visibleFiles}
                  readOnly={readOnly}
                  onUpload={() => fileRef.current?.click()}
                  onRemove={(id) => removeProjectFile(projectId, id, userName)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!readOnly && (
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => {
            void onUpload(e.target.files);
            e.target.value = "";
          }}
        />
      )}

      {!readOnly && !hasFilesBlock && (
        <div className="rounded-lg border border-dashed border-border-subtle bg-surface/40 px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Área de arquivos — PDF, DOCX, PNG, JPG, ZIP, FIG, MP4
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs border-border-subtle gap-1"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
        </div>
      )}

      <AppModal open={addOpen} onClose={() => setAddOpen(false)} title="Adicionar bloco" size="md">
        <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
          {(Object.keys(BLOCK_KIND_LABELS) as ProjectBlockKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              className="rounded-lg border border-border-subtle px-3 py-2.5 text-left text-xs hover:bg-surface-hover transition-colors"
              onClick={() => {
                addBlock(projectId, kind, userName);
                setAddOpen(false);
              }}
            >
              {BLOCK_KIND_LABELS[kind]}
            </button>
          ))}
        </div>
      </AppModal>
    </section>
  );
}

function FilesPanel({
  files,
  readOnly,
  onUpload,
  onRemove,
}: {
  files: ProjectFileItem[];
  readOnly: boolean;
  onUpload: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs border-border-subtle gap-1"
          onClick={onUpload}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </Button>
      )}
      {files.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhum arquivo.</p>
      ) : (
        <ul className="divide-y divide-border-subtle rounded-md border border-border-subtle">
          {files.map((file) => (
            <li key={file.id} className="flex items-center gap-3 px-3 py-2.5">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground truncate">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatBytes(file.size)} · {formatDateTimeBR(file.uploadedAt)} · {file.uploadedBy}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {file.dataUrl && (
                  <>
                    <a
                      href={file.dataUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                      title="Visualizar"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={file.dataUrl}
                      download={file.name}
                      className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                      title="Baixar"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </>
                )}
                {!readOnly && (
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-state-red"
                    onClick={() => onRemove(file.id)}
                    title="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
