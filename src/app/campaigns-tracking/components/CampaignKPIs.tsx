import React from 'react';
import Icon from '@/components/ui/AppIcon';

const kpis = [
  { id: 'ckpi-001', label: 'Total Portfolio Views', value: '1,847', delta: '+23%', positive: true, icon: 'EyeIcon', bg: 'bg-primary/10', color: 'text-primary' },
  { id: 'ckpi-002', label: 'Unique Recruiters', value: '312', delta: '+18 this week', positive: true, icon: 'UsersIcon', bg: 'bg-accent/10', color: 'text-accent' },
  { id: 'ckpi-003', label: 'Avg Session Duration', value: '3m 42s', delta: '+18s vs last period', positive: true, icon: 'TimerIcon', bg: 'bg-info/10', color: 'text-info' },
  { id: 'ckpi-004', label: 'CV Downloads', value: '218', delta: '34.2% download rate', positive: true, icon: 'DownloadCloudIcon', bg: 'bg-warning/10', color: 'text-warning' },
];

export default function CampaignKPIs() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="bg-card border border-border rounded-xl p-4 shadow-card card-hover">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
              <Icon name={kpi.icon as any} size={17} className={kpi.color} />
            </div>
          </div>
          <p className="text-2xl font-800 text-foreground tabular-nums">{kpi.value}</p>
          <p className="text-xs font-600 text-foreground mt-1">{kpi.label}</p>
          <p className={`text-xs font-500 mt-1.5 ${kpi.positive ? 'text-positive' : 'text-negative'}`}>{kpi.delta}</p>
        </div>
      ))}
    </div>
  );
}