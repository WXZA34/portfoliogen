'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { id: 'ref-linkedin', name: 'LinkedIn', value: 612, color: 'var(--primary)' },
  { id: 'ref-direct', name: 'Direct', value: 489, color: 'var(--accent)' },
  { id: 'ref-email', name: 'Email Campaign', value: 334, color: 'var(--info)' },
  { id: 'ref-github', name: 'GitHub Profile', value: 218, color: 'var(--warning)' },
  { id: 'ref-twitter', name: 'X / Twitter', value: 194, color: 'var(--muted-foreground)' },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-md px-3 py-2">
        <p className="text-xs font-700 text-foreground">{item.name}</p>
        <p className="text-sm font-800 text-foreground tabular-nums">{item.value} views</p>
        <p className="text-xs text-muted-foreground">{Math.round((item.value / total) * 100)}% of total</p>
      </div>
    );
  }
  return null;
};

export default function RefSourceChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card h-full">
      <div className="mb-4">
        <h3 className="text-sm font-700 text-foreground">Traffic by Ref Source</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Where recruiters are finding your portfolios</p>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-700 text-foreground tabular-nums">{item.value}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">{Math.round((item.value / total) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}