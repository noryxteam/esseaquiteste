import { cn } from "@/lib/utils";

interface NoraxLogoProps {
  className?: string;
  /** Marca d'água bem sutil no documento */
  watermark?: boolean;
  /** Inverte para usar em fundo escuro */
  invert?: boolean;
}

/** Logo oficial Norax (SVG) — substitui o “N” tipográfico. */
export function NoraxLogo({ className, watermark, invert }: NoraxLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/norax-mark.svg"
      alt=""
      aria-hidden
      draggable={false}
      className={cn(
        "object-contain select-none pointer-events-none",
        watermark && "opacity-[0.07]",
        invert && "brightness-0 invert",
        className
      )}
    />
  );
}
