"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
  iconClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, iconClassName, placeholder = "Buscar...", ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none",
            iconClassName
          )}
        />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn("pl-9 h-10 bg-surface-inset border-border-subtle", className)}
          {...props}
        />
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";
