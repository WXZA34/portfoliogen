'use client';

import React from 'react';

interface AuditScoreRingProps {
  score: number;
}

export default function AuditScoreRing({ score }: AuditScoreRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'var(--positive)';
    if (s >= 70) return 'var(--primary)';
    if (s >= 50) return 'var(--warning)';
    return 'var(--negative)';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Needs Work';
    return 'Critical';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card flex flex-col items-center justify-center h-full">
      <h3 className="text-sm font-700 text-foreground mb-4">Overall Audit Score</h3>
      <div className="relative w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          <circle cx="72" cy="72" r={radius} className="score-ring-track" />
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="score-ring-fill"
            style={{
              stroke: getScoreColor(score),
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-800 text-foreground tabular-nums">{score}</span>
          <span className="text-xs font-600 text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-700 mt-3" style={{ color: getScoreColor(score) }}>
        {getScoreLabel(score)}
      </p>
      <p className="text-xs text-muted-foreground text-center mt-1">
        3 critical issues dragging score down
      </p>
      <div className="mt-4 w-full space-y-1.5">
        {[
          { label: 'Resolved this week', value: 5, color: 'bg-positive' },
          { label: 'Remaining issues', value: 12, color: 'bg-negative' },
        ].map((stat) => (
          <div key={`score-stat-${stat.label}`} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${stat.color}`} />
              {stat.label}
            </span>
            <span className="font-700 text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}