"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar, DashboardMobileSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { RoutePrefetcher } from "@/components/navigation/RoutePrefetcher";
import { getInstantDashboardPage } from "@/components/navigation/instant-dashboard-pages";
import { useAppState } from "@/contexts/app-context";
import { useAuth } from "@/contexts/auth-context";
import { FeedbackProvider } from "@/contexts/feedback-context";
import {
  OverlayChromeProvider,
  useOverlayChrome,
} from "@/contexts/overlay-chrome-context";
import {
  InstantNavProvider,
  useInstantNav,
} from "@/contexts/instant-nav-context";
import { NovoClienteProvider } from "@/contexts/novo-cliente-context";
import { ClientDetailPage } from "@/components/clientes/ClientDetailPage";
import { ProjectDetailPage } from "@/components/projetos/ProjectDetailPage";
import { AppBreadcrumb } from "@/components/navigation/AppBreadcrumb";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function DashboardMain({ children }: { children: React.ReactNode }) {
  const { activeHref } = useInstantNav();
  const InstantPage = getInstantDashboardPage(activeHref);
  const clientDetailId = /^\/clientes\/([^/]+)$/.exec(activeHref)?.[1];
  const projectDetailId = /^\/projetos\/([^/]+)$/.exec(activeHref)?.[1];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <AppBreadcrumb className="mb-4" />
      {clientDetailId ? (
        <ClientDetailPage clientId={clientDetailId} />
      ) : projectDetailId ? (
        <ProjectDetailPage projectId={projectDetailId} />
      ) : InstantPage ? (
        <InstantPage />
      ) : (
        children
      )}
    </div>
  );
}

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { unreadNotifications } = useAppState();
  const { user: authUser } = useAuth();
  const { overlayOpen, setOverlayOpen } = useOverlayChrome();

  useEffect(() => {
    setOverlayOpen(false);
    document.body.style.overflow = "";
    setMobileOpen(false);
  }, [pathname, setOverlayOpen]);

  const shellUser = useMemo(
    () => ({
      name: authUser?.nome ?? "Usuário",
      role: authUser?.roleLabel ?? authUser?.cargo ?? "—",
      initials: authUser ? getInitials(authUser.nome) : "U",
    }),
    [authUser]
  );

  return (
    <InstantNavProvider pathname={pathname}>
      <FeedbackProvider>
        <NovoClienteProvider>
          <div className="flex min-h-screen bg-background">
            <RoutePrefetcher />
            <DashboardSidebar user={shellUser} />
            <DashboardMobileSidebar
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              user={shellUser}
            />
            <div className="flex-1 flex flex-col min-w-0">
              <div className={overlayOpen ? "invisible h-0 overflow-hidden border-0" : undefined}>
                <DashboardTopbar
                  notifications={unreadNotifications}
                  userInitials={shellUser.initials}
                  onMenuClick={() => setMobileOpen(true)}
                />
              </div>
              <main className="flex-1 overflow-y-auto">
                <DashboardMain>{children}</DashboardMain>
              </main>
            </div>
          </div>
        </NovoClienteProvider>
      </FeedbackProvider>
    </InstantNavProvider>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <OverlayChromeProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </OverlayChromeProvider>
  );
}
