import { useId } from "react";

interface SparklineProps {
  values: number[];
  /** Stroke colour (hex). */
  color: string;
  width?: number;
  height?: number;
  label: string;
}

/**
 * Tiny dependency-free trend line (no axes) for stat cards. The exact figure
 * and its change are printed beside it, so the shape is supplementary.
 */
export function Sparkline({ values, color, width = 120, height = 44, label }: SparklineProps) {
  const id = useId();
  if (values.length < 2) return null;

  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (width - pad * 2) / (values.length - 1);
  const points = values.map((v, i) => [pad + i * step, pad + (height - pad * 2) * (1 - (v - min) / span)] as const);

  // Smooth curve through the points (Catmull-Rom → cubic Bézier).
  const line = points.reduce((path, [x, y], i, arr) => {
    if (i === 0) return `M ${x} ${y}`;
    const [x0, y0] = arr[i - 2] ?? arr[i - 1];
    const [x1, y1] = arr[i - 1];
    const [x3, y3] = arr[i + 1] ?? [x, y];
    const c1 = [x1 + (x - x0) / 6, y1 + (y - y0) / 6];
    const c2 = [x - (x3 - x1) / 6, y - (y3 - y1) / 6];
    return `${path} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${x} ${y}`;
  }, "");
  const [lastX, lastY] = points[points.length - 1];
  const area = `${line} L ${lastX} ${height} L ${points[0][0]} ${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={3.5} fill={color} stroke="white" strokeWidth={1.5} />
    </svg>
  );
}
