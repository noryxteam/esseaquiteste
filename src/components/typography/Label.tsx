import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label className={cn(tokens.typography.label, className)} {...props}>
      {children}
      {required && <span className="text-state-red ml-0.5" aria-hidden>*</span>}
    </label>
  );
}
