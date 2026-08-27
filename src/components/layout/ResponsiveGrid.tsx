import { cn } from "@/lib/utils";

type ColCount = 1 | 2 | 3 | 4 | 5 | 6;

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: ColCount;
    sm?: ColCount;
    md?: ColCount;
    lg?: ColCount;
    xl?: ColCount;
  };
  gap?: "2" | "3" | "4" | "5" | "6";
}

const colMap: Record<ColCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const gapMap = {
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
} as const;

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = "3",
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid",
        cols.default && colMap[cols.default],
        cols.sm && `sm:${colMap[cols.sm]}`,
        cols.md && `md:${colMap[cols.md]}`,
        cols.lg && `lg:${colMap[cols.lg]}`,
        cols.xl && `xl:${colMap[cols.xl]}`,
        gapMap[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
