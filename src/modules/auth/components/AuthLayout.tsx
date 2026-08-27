"use client";

import type { ReactNode } from "react";
import { tokens } from "@/components/common/tokens";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center p-6", tokens.page.bg)}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-elevated text-sm font-semibold">
            N
          </div>
          <h1 className={tokens.typography.pageTitle}>{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(tokens.card.elevated, "p-6 sm:p-8")}>{children}</div>
      </div>
    </div>
  );
}
