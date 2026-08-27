import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import type { NoraxInputProps, Size } from "../common/types";
import { Caption } from "../typography/Caption";
import { Label } from "../typography/Label";

const INPUT_SIZE: Record<Size, string> = {
  xs: tokens.input.sm,
  sm: tokens.input.sm,
  md: tokens.input.md,
  lg: tokens.input.lg,
  xl: tokens.input.lg,
};

export function inputSizeClass(size: Size = "md"): string {
  return INPUT_SIZE[size];
}

export interface InputFieldWrapperProps {
  label?: string;
  hint?: string;
  error?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function InputFieldWrapper({
  label,
  hint,
  error,
  children,
  className,
}: InputFieldWrapperProps) {
  if (!label && !hint) {
    return <>{children}</>;
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && (
        <Caption className={cn(error && "text-state-red")}>{hint}</Caption>
      )}
    </div>
  );
}

export type InputProps = NoraxInputProps;

export function Input({
  className,
  size = "md",
  error,
  label,
  hint,
  ...props
}: InputProps) {
  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <ShadcnInput
        className={cn(
          inputSizeClass(size),
          error && "border-state-red/50 focus-visible:ring-state-red/20",
          className
        )}
        {...props}
      />
    </InputFieldWrapper>
  );
}
