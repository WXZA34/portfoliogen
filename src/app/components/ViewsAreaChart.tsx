'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '@/lib/LanguageContext';

const data = [
  { date: '14 août', views: 42, sessions: 31 },
  { date: '17 août', views: 68, sessions: 51 },
  { date: '20 août', views: 55, sessions: 40 },
  { date: '23 août', views: 91, sessions: 72 },
  { date: '26 août', views: 78, sessions: 58 },
  { date: '29 août', views: 112, sessions: 89 },
  { date: '1 sep.', views: 98, sessions: 74 },
  { date: '4 sep.', views: 134, sessions: 105 },
  { date: '7 sep.', views: 118, sessions: 91 },
  { date: '10 sep.', views: 156, sessions: 122 },
  { date: '11 sep.', views: 143, sessions: 109 },
  { date: '12 sep.', views: 189, sessions: 147 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-md px-4 py-3">
        <p className="text-xs font-600 text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={`tt-${entry.dataKey}`} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
            <span className="font-700 text-foreground tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ViewsAreaChart() {
  const { t } = useLanguage();

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-700 text-foreground">{t.dashboard.charts.portfolioViews}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.dashboard.charts.viewsOverTime}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-3 h-0.5 rounded bg-primary inline-block" />
            {t.campaigns.charts.views}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-3 h-0.5 rounded bg-accent inline-block" />
            Sessions
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="views" stroke="var(--primary)" strokeWidth={2} fill="url(#viewsGrad)" />
          <Area type="monotone" dataKey="sessions" stroke="var(--accent)" strokeWidth={2} fill="url(#sessionsGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}