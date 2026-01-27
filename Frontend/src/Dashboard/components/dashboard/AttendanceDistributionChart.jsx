import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

export function AttendanceDistributionChart({ data }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const total = (data || []).reduce((sum, d) => sum + d.value, 0) || 1;

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 82;
  const stroke = 18;

  const segments = useMemo(() => {
    let angle = 0;

    const themeColors = {
      excellent: "#10b981",
      good: "#0ea5e9",
      fair: "#f59e0b",
      poor: "#ef4444",
    };

    const pickColor = (name, fallback) => {
      const n = String(name || "").toLowerCase();
      if (n.includes("excellent")) return themeColors.excellent;
      if (n.includes("good")) return themeColors.good;
      if (n.includes("fair")) return themeColors.fair;
      if (n.includes("poor")) return themeColors.poor;
      return fallback || "hsl(var(--primary))";
    };

    return (data || []).map((d) => {
      const pct = (d.value / total) * 100;
      const sweep = (d.value / total) * 360;
      const start = angle;
      const end = angle + sweep;
      angle = end;

      return {
        ...d,
        fill: pickColor(d.name, d.fill),
        pct,
        start,
        end,
      };
    });
  }, [data, total]);

  const activeSegment = activeIndex != null ? segments[activeIndex] : null;

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const x = (px / rect.width) * size;
    const y = (py / rect.height) * size;

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ringMin = r - stroke / 2 - 4;
    const ringMax = r + stroke / 2 + 4;
    if (dist < ringMin || dist > ringMax) {
      setActiveIndex(null);
      return;
    }

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    deg = (deg + 90 + 360) % 360;

    const idx = segments.findIndex((s) => deg >= s.start && deg <= s.end);
    setActiveIndex(idx >= 0 ? idx : null);
  };

  return (
    <Card className="animate-slide-up border-0 shadow-md" style={{ animationDelay: "400ms" }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent/10 p-2">
            <PieChartIcon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">Attendance Distribution</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Students by attendance category</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative flex items-center justify-center"
            onMouseMove={handleMove}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--border) / 0.35)" strokeWidth={stroke} />

              {segments.map((s) => {
                if (!s.value) return null;
                const arc = describeArc(cx, cy, r, s.start, s.end);
                const isActive = activeSegment?.name === s.name;
                return (
                  <path
                    key={s.name}
                    d={arc}
                    fill="none"
                    stroke={s.fill}
                    strokeWidth={isActive ? stroke + 4 : stroke}
                    strokeLinecap="round"
                    opacity={activeSegment ? (isActive ? 1 : 0.45) : 1}
                  />
                );
              })}

              <circle cx={cx} cy={cy} r={r - stroke / 2} fill="hsl(var(--background))" opacity="0.65" />
              <text x={cx} y={cy - 4} textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">
                Total
              </text>
              <text x={cx} y={cy + 18} textAnchor="middle" fontSize="20" fontWeight="700" fill="hsl(var(--foreground))">
                {total}
              </text>
            </svg>

            {activeSegment ? (
              <div
                className="absolute pointer-events-none rounded-lg border border-border bg-card/95 backdrop-blur-sm px-3 py-2 shadow-lg"
                style={{
                  left: "50%",
                  top: "10%",
                  transform: "translate(-50%, 0)",
                }}
              >
                <div className="text-xs font-semibold text-foreground">{activeSegment.name}</div>
                <div className="text-sm text-primary mt-0.5">
                  {activeSegment.value} ({Math.round(activeSegment.pct)}%)
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1">
            {segments.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.fill }} />
                <span className="whitespace-nowrap">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}