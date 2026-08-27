"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigationGroups } from "@/lib/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useInstantNav } from "@/contexts/instant-nav-context";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  user: { name: string; role: string; initials: string };
  mobile?: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ user, mobile, onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { activeHref, setPendingHref } = useInstantNav();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [userMenuOpen]);

  const goTo = useCallback(
    (href: string) => {
      onNavigate?.();
      setUserMenuOpen(false);
      if (href === pathname) {
        setPendingHref(null);
        return;
      }
      // Troca o conteúdo no mesmo instante; URL atualiza em seguida
      setPendingHref(href);
      router.push(href);
    },
    [onNavigate, pathname, router, setPendingHref]
  );

  const currentPath = activeHref || pathname;

  const aside = (
    <>
      <div
        className={cn(
          "flex items-center justify-center h-12 border-b border-border-subtle shrink-0 px-3",
          !mobile && collapsed && "px-2"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/norax-mark.svg"
          alt="Norax"
          className={cn(
            "object-contain brightness-0 invert",
            !mobile && collapsed ? "h-7 w-auto" : "h-8 w-auto"
          )}
          draggable={false}
        />
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto py-2 px-1.5">
        {navigationGroups.map((group, gi) => (
          <div key={group.label ?? gi} className={cn(gi > 0 && "mt-2")}>
            {group.label && (!collapsed || mobile) && (
              <p className="px-2.5 mb-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                {group.label}
              </p>
            )}
            {gi > 0 && collapsed && !mobile && (
              <div className="my-1.5 mx-1.5 border-t border-border-subtle" />
            )}
            <div className="space-y-px">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = currentPath === href || currentPath.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch
                    scroll={false}
                    onMouseEnter={() => router.prefetch(href)}
                    onMouseDown={() => {
                      if (href !== pathname) router.prefetch(href);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(href);
                    }}
                    title={collapsed && !mobile ? label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] leading-none transition-colors duration-100",
                      active
                        ? "bg-surface-elevated text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover",
                      !mobile && collapsed && "justify-center px-2 py-2"
                    )}
                  >
                    <Icon className={cn("h-[15px] w-[15px] shrink-0", active && "text-foreground")} />
                    {(!collapsed || mobile) && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-1.5 space-y-px shrink-0">
        {!mobile && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <>
                <ChevronLeft className="h-3.5 w-3.5" /> Recolher
              </>
            )}
          </button>
        )}
        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            aria-expanded={userMenuOpen}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-hover transition-colors",
              !mobile && collapsed && "justify-center px-2"
            )}
          >
            <div className="h-7 w-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-medium shrink-0">
              {user.initials}
            </div>
            {(!collapsed || mobile) && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[11px] font-medium truncate leading-none">{user.name}</p>
                  <p className="text-[9px] text-muted-foreground truncate mt-0.5">{user.role}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-muted-foreground shrink-0 transition-transform",
                    userMenuOpen && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
          {userMenuOpen && (
            <div
              className={cn(
                "absolute z-50 min-w-[160px] rounded-lg border border-border-subtle bg-background shadow-lg py-1",
                collapsed && !mobile ? "left-full bottom-0 ml-1" : "left-0 bottom-full mb-1 w-full"
              )}
            >
              <button
                type="button"
                onClick={() => goTo(routes.configuracoes)}
                className="block w-full text-left px-3 py-2 text-xs text-foreground hover:bg-surface-hover transition-colors"
              >
                Configurações
              </button>
              <button
                type="button"
                onClick={() => goTo(routes.integracoes)}
                className="block w-full text-left px-3 py-2 text-xs text-foreground hover:bg-surface-hover transition-colors"
              >
                Integrações
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  void logout();
                }}
                className="w-full text-left px-3 py-2 text-xs text-state-red hover:bg-state-red/10 transition-colors"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (mobile) return <div className="flex flex-col h-full">{aside}</div>;

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-surface h-screen sticky top-0 z-40 transition-[width] duration-200",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {aside}
    </aside>
  );
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  return <SidebarContent {...props} />;
}

export function DashboardMobileSidebar({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: DashboardSidebarProps["user"];
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-[240px] bg-surface border-r border-border z-10">
        <DashboardSidebar user={user} mobile onNavigate={onClose} />
      </aside>
    </div>
  );
}
