"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  FileText,
  FolderKanban,
  Search,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import {
  SEARCH_TYPE_LABELS,
  searchGlobal,
  type SearchResultItem,
} from "@/modules/integration";

const TYPE_ICONS: Record<SearchResultItem["type"], React.ComponentType<{ className?: string }>> = {
  client: Users,
  project: FolderKanban,
  contract: FileText,
  meeting: Video,
  file: FileText,
  briefing: Briefcase,
  user: User,
};

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const results = useMemo(() => searchGlobal(query), [query]);

  const grouped = useMemo(() => {
    const map = new Map<SearchResultItem["type"], SearchResultItem[]>();
    for (const r of results) {
      const list = map.get(r.type) ?? [];
      list.push(r);
      map.set(r.type, list);
    }
    return map;
  }, [results]);

  const navigate = useCallback(
    (item: SearchResultItem) => {
      onOpenChange(false);
      router.push(item.link);
    },
    [onOpenChange, router]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Fechar busca"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Busca global"
        className="relative w-full max-w-xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar clientes, projetos, contratos..."
            className="border-0 shadow-none focus-visible:ring-0 h-9 px-0 flex-1"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {query.trim() === "" && (
            <p className="px-3 py-6 text-sm text-muted-foreground text-center">
              Digite para buscar em todos os módulos
            </p>
          )}
          {query.trim() !== "" && results.length === 0 && (
            <p className="px-3 py-6 text-sm text-muted-foreground text-center">
              Nenhum resultado para &quot;{query}&quot;
            </p>
          )}
          {Array.from(grouped.entries()).map(([type, items]) => {
            const Icon = TYPE_ICONS[type];
            return (
              <div key={type} className="mb-2">
                <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {SEARCH_TYPE_LABELS[type]}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <button
                        type="button"
                        onClick={() => navigate(item)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-md px-3 py-2 text-left",
                          "hover:bg-surface-elevated transition-colors"
                        )}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function useGlobalSearchShortcut(onOpen: () => void): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
