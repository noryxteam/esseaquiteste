"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Code,
  FileText,
  Globe,
  Layout,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ContractTemplate } from "@/lib/mock-data/contratos-types";
import { Button } from "@/components/ui/button-shadcn";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Globe,
  Code,
  Layout,
  Wrench,
  Briefcase,
};

interface ContractTemplateCardProps {
  template: ContractTemplate;
  index?: number;
}

export function ContractTemplateCard({ template, index = 0 }: ContractTemplateCardProps) {
  const Icon = ICON_MAP[template.icon] ?? FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="rounded-lg border border-border-subtle bg-surface/60 p-4 hover:border-border hover:bg-surface-hover/60 transition-colors group"
    >
      <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center mb-3">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="text-sm font-medium text-foreground">{template.name}</p>
      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full h-8 text-xs border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface-hover"
      >
        Usar modelo
      </Button>
    </motion.div>
  );
}

interface ContractTemplatesSectionProps {
  templates: ContractTemplate[];
}

export function ContractTemplatesSection({ templates }: ContractTemplatesSectionProps) {
  return (
    <section className="space-y-4 pt-4 border-t border-border-subtle">
      <h2 className="text-sm font-medium text-foreground">Modelos de contrato</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {templates.map((template, index) => (
          <ContractTemplateCard key={template.id} template={template} index={index} />
        ))}
      </div>
    </section>
  );
}
