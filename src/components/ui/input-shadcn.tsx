import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Autocomplete desligado por padrão — evita popups do navegador
 * ("As informações foram salvas" / "Usado pela última vez").
 * Login e campos que precisem de autofill passam autoComplete explicitamente.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      autoComplete = "off",
      autoCorrect = "off",
      spellCheck = false,
      ...props
    },
    ref
  ) => {
    return (
      <input
        type={type}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
        className={cn(
          "flex h-10 w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
