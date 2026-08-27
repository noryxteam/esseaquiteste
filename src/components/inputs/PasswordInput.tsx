"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import type { NoraxInputProps } from "../common/types";
import { IconButton } from "../buttons/IconButton";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";

export type PasswordInputProps = Omit<NoraxInputProps, "type">;

export function PasswordInput({
  className,
  size = "md",
  error,
  label,
  hint,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <div className="relative">
        <ShadcnInput
          type={visible ? "text" : "password"}
          className={cn(
            inputSizeClass(size),
            "pr-10",
            error && "border-state-red/50 focus-visible:ring-state-red/20",
            className
          )}
          {...props}
        />
        <IconButton
          type="button"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </IconButton>
      </div>
    </InputFieldWrapper>
  );
}
