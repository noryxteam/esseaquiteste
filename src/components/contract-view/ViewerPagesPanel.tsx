"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, PanelLeft } from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractThumbnail } from "@/components/contract-view/ContractThumbnail";
import { cn } from "@/lib/utils";

interface ViewerPagesPanelProps {
  data: ContractDocumentData;
  currentPage: number;
  open: boolean;
  onToggle: () => void;
  onPageChange: (page: number) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function ViewerPagesPanel({
  data,
  currentPage,
  open,
  onToggle,
  onPageChange,
}: ViewerPagesPanelProps) {
  return (
    <div className="relative flex shrink-0 h-[calc(100vh-64px)] sticky top-0 self-start">
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <motion.aside
            key="pages-rail"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 140, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="h-full border-r border-white/[0.06] bg-[#0a0a0a] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-3 py-3 w-[140px] shrink-0">
              <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                Páginas
              </p>
              <button
                type="button"
                onClick={onToggle}
                className="h-6 w-6 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
                aria-label="Recolher páginas"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2.5 pb-4 space-y-2.5 w-[140px]">
              {data.pages.map((page) => (
                <ContractThumbnail
                  key={page.id}
                  pageNumber={page.id}
                  active={currentPage === page.id}
                  onClick={() => onPageChange(page.id)}
                />
              ))}
            </div>
          </motion.aside>
        ) : (
          <motion.div
            key="pages-collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start pt-3 pl-3 pr-1 border-r border-white/[0.06] bg-[#0a0a0a] h-full"
          >
            <button
              type="button"
              onClick={onToggle}
              className={cn(
                "h-8 w-8 rounded-lg border border-white/[0.08]",
                "bg-[#111]/90 flex items-center justify-center",
                "text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors duration-200"
              )}
              aria-label="Abrir páginas"
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
