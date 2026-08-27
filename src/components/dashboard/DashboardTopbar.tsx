"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, Sparkles } from "lucide-react";
import { NovoClienteButton } from "@/components/clientes/SearchBar";
import { Input } from "@/components/ui/input-shadcn";
import { Button } from "@/components/ui/button-shadcn";
import { AppDrawer } from "@/components/ui/app-drawer";
import { cn } from "@/lib/utils";
import { useGlobalSearchShortcut } from "@/components/navigation/GlobalSearchDialog";
import { useFeedback } from "@/contexts/feedback-context";
import { useInstantNav } from "@/contexts/instant-nav-context";
import { routes } from "@/lib/app-routes";

const GlobalSearchDialog = dynamic(
  () =>
    import("@/components/navigation/GlobalSearchDialog").then((m) => ({
      default: m.GlobalSearchDialog,
    })),
  { ssr: false }
);

const NOTIFICATIONS = [
  { id: "1", title: "Contrato assinado", description: "M. Beauty assinou o contrato de branding.", time: "Há 5 min" },
  { id: "2", title: "Reunião em 30 min", description: "Kickoff Infinity Store às 14:00.", time: "Há 15 min" },
  { id: "3", title: "Pagamento recebido", description: "R$ 12.800 de AlphaFit LTDA.", time: "Há 1 hora" },
];

interface DashboardTopbarProps {
  notifications: number;
  userInitials: string;
  onMenuClick?: () => void;
}

function TopbarComponent({ notifications, userInitials, onMenuClick }: DashboardTopbarProps) {
  const pathname = usePathname();
  const { activeHref } = useInstantNav();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { showInfo } = useFeedback();
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const showNovoCliente = (activeHref || pathname) === "/clientes";

  useGlobalSearchShortcut(openSearch);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/90 backdrop-blur-xl flex items-center gap-3 px-4 lg:px-6 shrink-0">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden shrink-0" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            readOnly
            onClick={openSearch}
            onFocus={openSearch}
            placeholder="Buscar clientes, projetos, arquivos..."
            className="pl-9 pr-16 h-10 bg-surface border-border-subtle cursor-pointer"
          />
          <button
            type="button"
            onClick={openSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-surface-elevated px-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
          >
            ⌘K
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {showNovoCliente && <NovoClienteButton />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => showInfo("Nenhuma atualização nova no momento.")}
            className="hidden md:inline-flex text-muted-foreground gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">Atualizações</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(true)}
            className="relative text-muted-foreground"
            aria-label="Notificações"
          >
            <Bell className="h-[18px] w-[18px]" />
            {notifications > 0 && (
              <span
                className={cn(
                  "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-state-red text-[10px] font-semibold text-white flex items-center justify-center border-2 border-background"
                )}
              >
                {notifications}
              </span>
            )}
          </Button>
          <Link
            href={routes.configuracoes}
            className="h-8 w-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-xs font-medium ml-1 hover:bg-surface-hover transition-colors"
          >
            {userInitials}
          </Link>
        </div>
      </header>

      {searchOpen && <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />}

      <AppDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notificações"
        subtitle={notifications > 0 ? `${notifications} não lidas` : undefined}
      >
        <ul className="space-y-3">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="rounded-lg border border-border-subtle p-3 hover:bg-surface-hover transition-colors">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
            </li>
          ))}
        </ul>
      </AppDrawer>
    </>
  );
}

export const DashboardTopbar = memo(TopbarComponent);
