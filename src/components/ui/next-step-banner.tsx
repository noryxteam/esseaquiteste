import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";

interface NextStepBannerProps {
  text: string;
  cta: string;
  onCta?: () => void;
  href?: string;
}

export function NextStepBanner({ text, cta, onCta, href }: NextStepBannerProps) {
  return (
    <div className="relative rounded-xl border border-border-strong bg-gradient-to-r from-accent-subtle to-transparent p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-foreground rounded-l-xl" />
      <div className="pl-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Próximo passo
        </p>
        <p className="mt-1 text-[13px] text-foreground-secondary leading-snug">{text}</p>
      </div>
      {href ? (
        <Link href={href}>
          <Button size="sm" className="shrink-0 gap-1.5">
            {cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      ) : (
        <Button size="sm" onClick={onCta} className="shrink-0 gap-1.5">
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
