'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/lib/LanguageContext';

export default function MetricsBentoGrid() {
  const { t } = useLanguage();

  const metrics = [
    {
      id: 'metric-views',
      label: t.dashboard.metrics.totalViews,
      sublabel: t.dashboard.metrics.last7days,
      value: '1 847',
      delta: '+23%',
      deltaPositive: true,
      icon: 'EyeIcon',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      hero: true,
      sparkValues: [120, 145, 98, 210, 187, 265, 312, 298, 341, 389],
    },
    {
      id: 'metric-portfolios',
      label: t.dashboard.metrics.activePortfolios,
      sublabel: t.dashboard.metrics.draftsPending,
      value: '7',
      delta: `+2 ${t.dashboard.metrics.thisMonth}`,
      deltaPositive: true,
      icon: 'LayoutTemplateIcon',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      hero: false,
    },
    {
      id: 'metric-duration',
      label: t.dashboard.metrics.avgSession,
      sublabel: t.dashboard.metrics.acrossAll,
      value: '3m 42s',
      delta: `+18s ${t.dashboard.metrics.vsLastWeek}`,
      deltaPositive: true,
      icon: 'TimerIcon',
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
      hero: false,
    },
    {
      id: 'metric-cv',
      label: t.dashboard.metrics.cvDownload,
      sublabel: t.dashboard.metrics.visitorsDownloaded,
      value: '34.2%',
      delta: `-2.1% ${t.dashboard.metrics.vsLastWeek}`,
      deltaPositive: false,
      icon: 'DownloadCloudIcon',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      hero: false,
    },
    {
      id: 'metric-audit',
      label: t.dashboard.metrics.auditScore,
      sublabel: t.dashboard.metrics.criticalIssues,
      value: '87/100',
      delta: `-5 pts ${t.dashboard.metrics.sinceLastAudit}`,
      deltaPositive: false,
      icon: 'ShieldAlertIcon',
      iconBg: 'bg-negative/10',
      iconColor: 'text-negative',
      hero: false,
      alert: true,
    },
    {
      id: 'metric-messages',
      label: t.dashboard.metrics.unreadMessages,
      sublabel: t.dashboard.metrics.fromRecruiters,
      value: '4',
      delta: `2 ${t.dashboard.metrics.newToday}`,
      deltaPositive: true,
      icon: 'MessageCircleIcon',
      iconBg: 'bg-secondary',
      iconColor: 'text-primary',
      hero: false,
    },
  ];

  const hero = metrics.find((m) => m.hero);
  const regular = metrics.filter((m) => !m.hero);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-4 mb-0">
      {hero && (
        <div className="col-span-2 bg-card border border-border rounded-xl p-5 shadow-card card-hover relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${hero.iconBg} flex items-center justify-center`}>
              <Icon name={hero.icon as any} size={20} className={hero.iconColor} />
            </div>
            <span className={`text-xs font-600 px-2 py-1 rounded-full ${hero.deltaPositive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
              {hero.delta}
            </span>
          </div>
          <p className="text-3xl font-800 text-foreground tabular-nums">{hero.value}</p>
          <p className="text-sm font-600 text-foreground mt-1">{hero.label}</p>
          <p className="text-xs text-muted-foreground">{hero.sublabel}</p>
          <div className="absolute bottom-0 right-0 opacity-10">
            <svg width="120" height="50" viewBox="0 0 120 50">
              <polyline
                points={hero.sparkValues?.map((v, i) => `${i * 13},${50 - (v / 400) * 50}`).join(' ')}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      )}
      {regular.map((metric) => (
        <div
          key={metric.id}
          className={`bg-card border rounded-xl p-4 shadow-card card-hover ${metric.alert ? 'border-negative/30 bg-negative/5' : 'border-border'}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl ${metric.iconBg} flex items-center justify-center`}>
              <Icon name={metric.icon as any} size={17} className={metric.iconColor} />
            </div>
            {metric.alert && (
              <Icon name="AlertCircleIcon" size={14} className="text-negative" />
            )}
          </div>
          <p className="text-2xl font-800 text-foreground tabular-nums">{metric.value}</p>
          <p className="text-xs font-600 text-foreground mt-1 leading-tight">{metric.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{metric.sublabel}</p>
          <p className={`text-xs font-500 mt-2 ${metric.deltaPositive ? 'text-positive' : 'text-negative'}`}>
            {metric.delta}
          </p>
        </div>
      ))}
    </div>
  );
}