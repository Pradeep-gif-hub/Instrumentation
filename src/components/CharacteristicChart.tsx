import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import type { CharacteristicCurveData } from '@/types/engineering';

export function CharacteristicChart({ curve }: { curve: CharacteristicCurveData }) {
  const { theme } = useApp();

  // Merge multi-series points cleanly along unified sorted X domain
  const xValues = Array.from(
    new Set(curve.series.flatMap((s) => s.points.map((p) => p.x))),
  ).sort((a, b) => a - b);

  const chartData = xValues.map((x) => {
    const row: Record<string, number | string> = { x };
    for (const s of curve.series) {
      const match = s.points.find((p) => p.x === x);
      if (match) {
        row[s.name] = match.y;
      }
    }
    return row;
  });

  const gridStroke = theme === 'light' ? 'rgba(20,20,20,0.09)' : 'rgba(255,255,255,0.08)';
  const axisTick = theme === 'light' ? '#525252' : '#a6a6a6';
  const tooltipBg = theme === 'light' ? '#ffffff' : '#1a1a1a';
  const tooltipBorder = theme === 'light' ? 'rgba(20,20,20,0.16)' : 'rgba(255,255,255,0.16)';

  const resolveColor = (raw: string) => {
    if (theme === 'light' && raw.toLowerCase() === '#c5f467') return '#4a7300';
    return raw;
  };

  return (
    <div className="sub p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-medium text-sm text-[var(--st-on)]">{curve.title}</p>
          <p className="muted text-xs">{curve.subtitle}</p>
        </div>
        <span className="pill mono text-[10px]">
          {curve.yLabel} ({curve.yUnit}) vs {curve.xLabel} ({curve.xUnit})
        </span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              stroke={axisTick}
              tick={{ fill: axisTick, fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              stroke={axisTick}
              tick={{ fill: axisTick, fontSize: 11, fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '14px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
                color: theme === 'light' ? '#141414' : '#f4f4f4',
              }}
              labelFormatter={(val) => `${curve.xLabel}: ${val} ${curve.xUnit}`}
              formatter={(value: number, name: string) => [`${value} ${curve.yUnit}`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '6px' }}
            />
            {curve.series.map((s) => (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={resolveColor(s.color)}
                strokeWidth={2.2}
                dot={{ r: 3.5, strokeWidth: 1.5 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

