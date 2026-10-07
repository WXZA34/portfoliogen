'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';

const data = [
  { date: 'Aug 14', views: 42, downloads: 12, messages: 1 },
  { date: 'Aug 17', views: 68, downloads: 19, messages: 3 },
  { date: 'Aug 20', views: 55, downloads: 14, messages: 2 },
  { date: 'Aug 23', views: 91, downloads: 28, messages: 4 },
  { date: 'Aug 26', views: 78, downloads: 22, messages: 2 },
  { date: 'Aug 29', views: 112, downloads: 34, messages: 5 },
  { date: 'Sep 01', views: 98, downloads: 31, messages: 3 },
  { date: 'Sep 04', views: 134, downloads: 47, messages: 6 },
  { date: 'Sep 07', views: 118, downloads: 39, messages: 4 },
  { date: 'Sep 10', views: 156, downloads: 52, messages: 7 },
  { date: 'Sep 11', views: 143, downloads: 48, messages: 5 },
  { date: 'Sep 12', views: 189, downloads: 64, messages: 9 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-md px-4 py-3">
        <p className="text-xs font-700 text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={`eng-tt-${entry.dataKey}`} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-700 text-foreground tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function EngagementTimelineChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="mb-5">
        <h3 className="text-sm font-700 text-foreground">Engagement Timeline</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Views, CV downloads, and messages over time</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="views" name="Views" stroke="var(--primary)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="downloads" name="Downloads" stroke="var(--accent)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="messages" name="Messages" stroke="var(--warning)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}