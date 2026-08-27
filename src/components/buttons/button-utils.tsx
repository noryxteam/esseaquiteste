import { Button, type ButtonProps } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import type { Size } from "../common/types";

const SIZE_MAP: Record<Size, NonNullable<ButtonProps["size"]>> = {
  xs: "sm",
  sm: "sm",
  md: "default",
  lg: "lg",
  xl: "lg",
};

export function mapButtonSize(size: Size = "md"): NonNullable<ButtonProps["size"]> {
  return SIZE_MAP[size];
}

export interface NoraxButtonBaseProps extends Omit<ButtonProps, "size"> {
  size?: Size;
  loading?: boolean;
}

export function NoraxButton({
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: NoraxButtonBaseProps) {
  const isDisabled = Boolean(disabled || loading);
  return (
    <Button
      size={mapButtonSize(size)}
      className={cn(className)}
      disabled={isDisabled || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
