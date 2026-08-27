import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
}

const defaultColors = ["bg-state-blue", "bg-state-purple", "bg-state-green", "bg-state-orange", "bg-foreground/60"];

export function BarChart({ data, maxValue, height = 160 }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end justify-between gap-3" style={{ height }}>
      {data.map((item, i) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div className="w-full flex justify-center flex-1 items-end">
            <div
              className={cn("w-full max-w-[48px] rounded-t-md transition-all", item.color ?? defaultColors[i % defaultColors.length])}
              style={{ height: `${(item.value / max) * 100}%`, minHeight: item.value > 0 ? 4 : 0 }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground text-center leading-tight">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({
  data,
  height = 120,
  color = "stroke-state-blue",
}: {
  data: number[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <polyline fill="none" className={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" points={points} />
      <polyline fill="url(#lineGrad)" className="opacity-20" points={`0,${height} ${points} ${w},${height}`} />
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" className="text-state-blue" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DonutChart({
  segments,
  size = 120,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {segments.map((seg) => {
          const dash = (seg.value / total) * c;
          const el = (
            <circle
              key={seg.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${c}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
            {seg.label}
            <span className="text-foreground tabular-nums ml-auto">{Math.round((seg.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
