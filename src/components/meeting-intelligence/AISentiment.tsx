"use client";

import { Smile } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { SentimentData } from "@/lib/mock-data/meeting-intelligence-types";
import { cn } from "@/lib/utils";

interface AISentimentProps {
  sentiment: SentimentData;
}

const SENTIMENT_LABELS = [
  { key: "positivo", label: "Positivo" },
  { key: "neutro", label: "Neutro" },
  { key: "negativo", label: "Negativo" },
] as const;

export function AISentiment({ sentiment }: AISentimentProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5">
      <h3 className="text-xs font-medium text-foreground mb-4">Sentimento do cliente</h3>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center">
            <Smile className="h-4 w-4 text-foreground/70" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground capitalize">{sentiment.overall}</p>
            <p className="text-[10px] text-muted-foreground">{sentiment.overallDescription}</p>
          </div>
        </div>
      </div>

      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sentiment.timeline} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(250,250,250,0.08)" />
                <stop offset="100%" stopColor="rgba(250,250,250,0)" />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={[0, 100]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#fafafa"
              strokeWidth={1.5}
              fill="url(#sentimentGradient)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border-subtle">
        {SENTIMENT_LABELS.map(({ key, label }) => (
          <span
            key={key}
            className={cn(
              "text-[10px]",
              sentiment.overall === key ? "text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
