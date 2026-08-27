"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";

export function ActionMenu() {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
      <MoreVertical className="h-4 w-4" />
    </Button>
  );
}
