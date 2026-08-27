"use client";

import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractThumbnail } from "@/components/contract-view/ContractThumbnail";

interface ContractSidebarProps {
  data: ContractDocumentData;
  currentPage: number;
  onPageChange: (page: number) => void;
  collapsed?: boolean;
}

export function ContractSidebar({ data, currentPage, onPageChange, collapsed }: ContractSidebarProps) {
  if (collapsed) return null;

  return (
    <aside className="w-[120px] shrink-0 border-r border-border-subtle bg-[#0c0c0c] flex flex-col">
      <p className="px-3 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Páginas
      </p>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2">
        {data.pages.map((page) => (
          <ContractThumbnail
            key={page.id}
            pageNumber={page.id}
            active={currentPage === page.id}
            onClick={() => onPageChange(page.id)}
          />
        ))}
      </div>
    </aside>
  );
}
