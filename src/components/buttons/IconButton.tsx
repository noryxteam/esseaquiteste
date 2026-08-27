import { Button, type ButtonProps } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

export type IconButtonProps = Omit<ButtonProps, "size"> & {
  "aria-label": string;
};

export function IconButton({
  className,
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(className)}
      {...props}
    />
  );
}
