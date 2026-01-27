import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";

function polarClamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function catmullRomToBezierPath(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const d = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
  }

  return d.join(" ");
}

export function AttendanceTrendChart({ data }) {
  const containerRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const W = 640;
  const H = 260;
  const P = { l: 52, r: 18, t: 18, b: 42 };

  const yMin = 80;
  const yMax = 100;
  const span = Math.max(1, yMax - yMin);

  const points = useMemo(() => {
    const n = data?.length || 0;
    const xStep = n > 1 ? (W - P.l - P.r) / (n - 1) : 0;

    return (data || []).map((d, i) => {
      const x = P.l + i * xStep;
      const clamped = polarClamp(d.attendance, yMin, yMax);
      const y = P.t + ((yMax - clamped) / span) * (H - P.t - P.b);
      return { x, y, label: d.week, value: d.attendance };
    });
  }, [data]);

  const linePath = useMemo(() => catmullRomToBezierPath(points), [points]);

  const areaPath = useMemo(() => {
    if (!points.length) return "";
    const baselineY = H - P.b;
    return `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${baselineY.toFixed(2)} L ${points[0].x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
  }, [linePath, points]);

  const yTicks = [80, 85, 90, 95, 100];

  const activePoint = hoverIndex != null ? points[hoverIndex] : null;

  const handleMouseMove = (e) => {
    if (!containerRef.current || !points.length) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const x = (xPx / rect.width) * W;

    const n = points.length;
    const xStep = n > 1 ? (W - P.l - P.r) / (n - 1) : 0;
    const idx = xStep > 0 ? Math.round((x - P.l) / xStep) : 0;
    setHoverIndex(polarClamp(idx, 0, n - 1));
  };

  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: "300ms" }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">Weekly Attendance Trend</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Average class attendance over time</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative w-full h-56"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
              <defs>
                <linearGradient id="attendanceTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.02)" />
                </linearGradient>
              </defs>

              {yTicks.map((tick) => {
                const y = P.t + ((yMax - tick) / span) * (H - P.t - P.b);
                return (
                  <g key={tick}>
                    <line x1={P.l} y1={y} x2={W - P.r} y2={y} stroke="hsl(var(--border) / 0.5)" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={P.l - 10} y={y + 4} textAnchor="end" fontSize="12" fill="hsl(var(--muted-foreground))">
                      {tick}%
                    </text>
                  </g>
                );
              })}

              {areaPath ? <path d={areaPath} fill="url(#attendanceTrendFill)" /> : null}
              {linePath ? (
                <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              ) : null}

              {activePoint ? (
                <line x1={activePoint.x} y1={P.t} x2={activePoint.x} y2={H - P.b} stroke="hsl(var(--border) / 0.8)" strokeWidth="1" />
              ) : null}

              {points.map((p, idx) => {
                const isActive = idx === hoverIndex;
                return (
                  <g key={p.label}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 6 : 4.5}
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--primary))"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </g>
                );
              })}

              {points.map((p, idx) => (
                <text
                  key={`${p.label}-x`}
                  x={p.x}
                  y={H - 14}
                  textAnchor="middle"
                  fontSize="12"
                  fill="hsl(var(--muted-foreground))"
                  opacity={idx % 2 === 1 ? 0.9 : 1}
                >
                  {p.label}
                </text>
              ))}
            </svg>

            {activePoint ? (
              <div
                className="absolute pointer-events-none rounded-lg border border-border bg-card/95 backdrop-blur-sm px-3 py-2 shadow-lg"
                style={{
                  left: `${(activePoint.x / W) * 100}%`,
                  top: `${(activePoint.y / H) * 100}%`,
                  transform:
                    hoverIndex === 0
                      ? "translate(0%, -115%)"
                      : hoverIndex === points.length - 1
                        ? "translate(-100%, -115%)"
                        : "translate(-50%, -115%)",
                }}
              >
                <div className="text-xs font-semibold text-foreground">{activePoint.label}</div>
                <div className="text-sm text-primary mt-0.5">
                  Attendance : <span className="font-semibold">{activePoint.value}%</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}