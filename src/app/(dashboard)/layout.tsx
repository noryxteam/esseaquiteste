"use client";

import { ProtectedRoute } from "@/modules/auth/guards/ProtectedRoute";
import { AppProvider } from "@/contexts/app-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppProvider>
        <DashboardShell>{children}</DashboardShell>
      </AppProvider>
    </ProtectedRoute>
  );
}
