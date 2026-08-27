"use client";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { cn } from "@/lib/utils";

export function AppBreadcrumb({ className }: { className?: string }) {
  const items = useBreadcrumb();
  if (items.length <= 1) return null;
  return <Breadcrumb items={items} className={cn(className)} />;
}
