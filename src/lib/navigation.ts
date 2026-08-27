import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Video,
  FileSignature,
  Wallet,
  ClipboardList,
  CheckSquare,
  UserCog,
  Files,
  BarChart3,
  Settings,
  Plug,
  FileText,
  Layers,
  Zap,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export const navigationGroups: NavGroup[] = [
  {
    items: [{ href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard }],
  },
  {
    label: "Principal",
    items: [
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/projetos", label: "Projetos", icon: FolderKanban },
      { href: "/reunioes", label: "Reuniões", icon: Video },
      { href: "/propostas", label: "Propostas", icon: FileText },
      { href: "/contratos", label: "Contratos", icon: FileSignature },
      { href: "/apaga-logo", label: "Apaga Logo", icon: Zap },
      { href: "/financeiro", label: "Financeiro", icon: Wallet },
      { href: "/briefings", label: "Briefings", icon: ClipboardList },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { href: "/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/equipe", label: "Equipe", icon: UserCog },
      { href: "/arquivos", label: "Arquivos", icon: Files },
      { href: "/modelos", label: "Modelos", icon: Layers },
      { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
    ],
  },
  {
    label: "Configurações",
    items: [
      { href: "/configuracoes", label: "Configurações", icon: Settings },
      { href: "/integracoes", label: "Integrações", icon: Plug },
    ],
  },
];

export const navigation = navigationGroups.flatMap((g) => g.items);
