"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  FileText,
  Flag,
  FlaskConical,
  Gauge,
  Globe,
  GraduationCap,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  Link2,
  Lock,
  Map,
  Network,
  PackageCheck,
  Palette,
  PenLine,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
  Users,
  Wallet,
  Webhook,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LibraryStage } from "@/modules/project-workspace/types";

const ICONS: Record<string, LucideIcon> = {
  ClipboardList,
  Users,
  Map,
  FileText,
  PenLine,
  Wallet,
  LayoutTemplate,
  Search,
  Palette,
  CheckSquare,
  Sparkles,
  Code2,
  Server,
  Database,
  Webhook,
  Link2,
  Settings,
  Lock,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Target,
  ShieldCheck,
  FlaskConical,
  Wrench,
  Gauge,
  Rocket,
  PackageCheck,
  GraduationCap,
  LifeBuoy,
  Globe,
  Network,
  Cloud,
  Shield,
  UploadCloud,
  Flag,
};

interface StageLibraryCardProps {
  stage: LibraryStage;
  selected: boolean;
  onToggle: () => void;
}

export function StageLibraryCard({ stage, selected, onToggle }: StageLibraryCardProps) {
  const Icon = ICONS[stage.icon] ?? ClipboardList;

  return (
    <motion.button
      type="button"
      layout
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onToggle}
      className={cn(
        "flex flex-col items-start gap-2.5 rounded-lg border p-3 text-left transition-colors",
        selected
          ? "bg-surface-elevated border-foreground/40 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
          : "bg-surface/60 border-border-subtle hover:border-border hover:bg-surface-hover/50"
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-md flex items-center justify-center",
          selected ? "bg-white/15" : "bg-white/8"
        )}
      >
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <span className="text-xs font-medium text-foreground leading-snug">{stage.name}</span>
    </motion.button>
  );
}
