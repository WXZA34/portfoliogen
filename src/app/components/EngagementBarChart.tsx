'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useLanguage } from '@/lib/LanguageContext';

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--info)', 'var(--warning)', 'var(--primary)', 'var(--muted-foreground)'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-md px-4 py-3">
        <p className="text-xs font-700 text-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={`bar-tt-${entry.dataKey}`} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-700 text-foreground tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function EngagementBarChart() {
  const { t } = useLanguage();

  const data = [
    { portfolio: t.dashboard.activePortfolios.fullstack, views: 487, duration: 264, cvClicks: 89 },
    { portfolio: t.dashboard.activePortfolios.aiEngineer, views: 312, duration: 198, cvClicks: 67 },
    { portfolio: t.dashboard.activePortfolios.openSource, views: 276, duration: 143, cvClicks: 41 },
    { portfolio: t.dashboard.activePortfolios.freelance, views: 198, duration: 87, cvClicks: 28 },
    { portfolio: t.dashboard.activePortfolios.startupCTO, views: 421, duration: 221, cvClicks: 74 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-700 text-foreground">{t.dashboard.charts.engagementByPortfolio}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.dashboard.charts.avgTimeSpent}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="portfolio" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="views" name={t.campaigns.charts.views} radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}