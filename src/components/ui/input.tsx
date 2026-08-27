import { cn } from "@/lib/utils";

export function Input({
  className,
  autoComplete = "off",
  autoCorrect = "off",
  spellCheck = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      spellCheck={spellCheck}
      data-1p-ignore
      data-lpignore="true"
      data-form-type="other"
      className={cn(
        "w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground transition-colors duration-150",
        "hover:border-border-strong focus:border-border-strong focus:outline-none",
        "focus:ring-2 focus:ring-accent-ring",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  autoComplete = "off",
  spellCheck = false,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      data-1p-ignore
      data-lpignore="true"
      data-form-type="other"
      className={cn(
        "w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-sm text-foreground min-h-[88px] resize-y",
        "placeholder:text-muted-foreground transition-colors duration-150",
        "hover:border-border-strong focus:border-border-strong focus:outline-none",
        "focus:ring-2 focus:ring-accent-ring",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-sm text-foreground",
        "transition-colors duration-150 hover:border-border-strong",
        "focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-accent-ring",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[13px] font-medium text-muted block mb-1.5">{children}</span>
  );
}
