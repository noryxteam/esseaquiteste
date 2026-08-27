/**
 * Norax Design System — tokens visuais compartilhados.
 * Background #090909, cards escuros, bordas discretas, monocromático.
 */
export const tokens = {
  card: {
    base: "rounded-lg border border-border-subtle bg-surface/60",
    hover: "hover:border-border hover:bg-surface-hover/60 transition-colors",
    elevated: "rounded-lg border border-border-subtle bg-surface-elevated",
    header: "",
    body: "",
    footer: "mt-4 pt-4 border-t border-border-subtle",
  },
  input: {
    base: "w-full rounded-lg border border-border-subtle bg-surface-inset text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10 transition-colors",
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-sm",
  },
  button: {
    primary: "bg-foreground text-accent-foreground hover:bg-foreground/90",
    secondary: "bg-surface-elevated text-foreground border border-border-subtle hover:bg-surface-hover",
    outline: "border border-border bg-transparent hover:bg-surface-hover text-foreground",
    ghost: "hover:bg-surface-hover text-muted-foreground hover:text-foreground",
    danger: "bg-state-red/90 text-white hover:bg-state-red",
    success: "bg-foreground text-accent-foreground hover:bg-foreground/90",
  },
  radius: {
    md: "rounded-lg",
    full: "rounded-full",
  },
  badge: {
    base: "inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-elevated font-medium text-muted-foreground",
    sm: "px-2 py-0.5 text-[10px]",
    dot: "h-1.5 w-1.5 rounded-full shrink-0",
  },
  avatar: {
    base: "rounded-full bg-surface-elevated border border-border flex items-center justify-center font-medium text-foreground/80 shrink-0",
    xs: "h-5 w-5 text-[8px]",
    sm: "h-6 w-6 text-[9px]",
    md: "h-7 w-7 text-[10px]",
    lg: "h-8 w-8 text-[11px]",
    xl: "h-10 w-10 text-xs",
  },
  typography: {
    pageTitle: "text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground",
    sectionTitle: "text-sm font-medium text-foreground",
    text: "text-sm text-foreground",
    label: "text-xs font-medium text-foreground",
    caption: "text-[10px] text-muted-foreground",
  },
  state: {
    dotNeutral: "bg-muted-foreground/60",
    dotBlue: "bg-state-blue",
    dotGreen: "bg-state-green",
    dotOrange: "bg-state-orange",
    dotRed: "bg-state-red",
    dotPurple: "bg-state-purple",
  },
  page: {
    bg: "bg-background",
  },
} as const;
