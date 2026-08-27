"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_EDGE = 320;

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Envie um arquivo de imagem."));
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível processar a imagem."));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler a imagem."));
    };
    img.src = url;
  });
}

export function PhotoDropField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const applyFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      onChange(await readImageFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível usar essa imagem.");
    }
  };

  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void applyFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "mt-1 relative flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-4 text-center transition-colors",
          dragging
            ? "border-foreground bg-foreground/[0.06]"
            : "border-border-subtle bg-surface-inset/60 hover:border-foreground/30"
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-1 ring-white/10"
            />
            <p className="text-[11px] text-muted-foreground">Arraste outra foto ou clique para trocar</p>
            <button
              type="button"
              className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              aria-label="Remover foto"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
            <p className="text-[12px] text-foreground/80">Arraste a imagem até aqui</p>
            <p className="text-[11px] text-muted-foreground">ou clique para escolher do computador</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => {
            void applyFile(e.target.files?.[0]);
            e.currentTarget.value = "";
          }}
        />
      </div>
      {error ? <p className="mt-1 text-[11px] text-state-red">{error}</p> : null}
    </div>
  );
}
