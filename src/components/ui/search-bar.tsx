import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className, placeholder = "Buscar..." }: { className?: string; placeholder?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        placeholder={placeholder}
        readOnly
        className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-surface-inset text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-strong"
      />
    </div>
  );
}
