"use client";

import { Drawer, type DrawerProps } from "./Drawer";

export function RightDrawer(props: Omit<DrawerProps, "side">) {
  return <Drawer side="right" {...props} />;
}

export function LeftDrawer(props: Omit<DrawerProps, "side">) {
  return <Drawer side="left" {...props} />;
}

export interface DetailItem {
  label: string;
  value: React.ReactNode;
}

export interface DetailsDrawerProps extends Omit<DrawerProps, "children"> {
  details: DetailItem[];
  children?: React.ReactNode;
}

export function DetailsDrawer({ details, children, ...props }: DetailsDrawerProps) {
  return (
    <Drawer {...props}>
      <div className="rounded-lg border border-border-subtle bg-surface/40 p-3">
        {details.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-4 py-2 border-b border-border-subtle last:border-0"
          >
            <span className="text-xs text-muted-foreground shrink-0">{item.label}</span>
            <span className="text-xs text-foreground text-right">{item.value}</span>
          </div>
        ))}
      </div>
      {children}
    </Drawer>
  );
}
