"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { HealthScore } from "@/lib/types";

const SIZE = 140;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

function tierColor(tier: HealthScore["tier"]) {
  if (tier === "green") return "var(--color-success)";
  if (tier === "amber") return "var(--color-warning)";
  return "var(--color-danger)";
}

export function HealthScoreRing({ health }: { health: HealthScore }) {
  const offset = CIRC - (CIRC * health.score) / 100;
  const stroke = tierColor(health.tier);

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="inline-flex flex-col items-center cursor-help"
            role="img"
            aria-label={`Domain health score ${health.score} of 100`}
          >
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="transparent"
                stroke="var(--color-border)"
                strokeWidth={STROKE}
              />
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="transparent"
                stroke={stroke}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                style={{ transition: "stroke-dashoffset 600ms ease-out" }}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-display tabular-nums"
                fontSize="36"
                fontWeight="700"
                fill="currentColor"
              >
                {health.score}
              </text>
            </svg>
            <p className="text-xs text-muted mt-1 uppercase tracking-wide">
              Health score
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="!max-w-sm p-0">
          <ul className="divide-y divide-border">
            {health.breakdown.map((b) => (
              <li
                key={b.label}
                className="flex items-start justify-between gap-3 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{b.label}</p>
                  <p className="text-xs text-muted">
                    {b.detail}
                  </p>
                </div>
                <span
                  className="text-sm font-mono tabular-nums"
                  style={{
                    color:
                      b.status === "ok"
                        ? "var(--color-success)"
                        : b.status === "warn"
                          ? "var(--color-warning)"
                          : "var(--color-danger)",
                  }}
                >
                  {b.points}/{b.max}
                </span>
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
