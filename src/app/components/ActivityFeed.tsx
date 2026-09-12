'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/lib/LanguageContext';

export default function ActivityFeed() {
  const { t } = useLanguage();

  const activities = [
    {
      id: 'act-001',
      type: 'view',
      icon: 'EyeIcon',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      message: t.dashboard.activity.sarahViewed,
      meta: t.dashboard.activity.sarahMeta,
      time: '2m',
    },
    {
      id: 'act-002',
      type: 'download',
      icon: 'DownloadIcon',
      iconBg: 'bg-positive/10',
      iconColor: 'text-positive',
      message: t.dashboard.activity.cvDownloaded,
      meta: t.dashboard.activity.cvMeta,
      time: '18m',
    },
    {
      id: 'act-003',
      type: 'message',
      icon: 'MessageCircleIcon',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      message: t.dashboard.activity.marcusSent,
      meta: t.dashboard.activity.marcusMeta,
      time: '1h',
    },
    {
      id: 'act-004',
      type: 'view',
      icon: 'EyeIcon',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      message: t.dashboard.activity.priyaViewed,
      meta: t.dashboard.activity.priyaMeta,
      time: '2h',
    },
    {
      id: 'act-005',
      type: 'view',
      icon: 'EyeIcon',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      message: t.dashboard.activity.anonVisited,
      meta: t.dashboard.activity.anonMeta,
      time: '3h',
    },
    {
      id: 'act-006',
      type: 'download',
      icon: 'DownloadIcon',
      iconBg: 'bg-positive/10',
      iconColor: 'text-positive',
      message: t.dashboard.activity.cvFreelance,
      meta: t.dashboard.activity.cvFreelanceMeta,
      time: '5h',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-700 text-foreground">{t.dashboard.charts.recentActivity}</h3>
        <span className="text-xs text-primary font-600 cursor-pointer hover:underline">{t.dashboard.charts.viewAll}</span>
      </div>
      <div className="space-y-3">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${act.iconBg} flex items-center justify-center`}>
              <Icon name={act.icon as any} size={14} className={act.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-foreground leading-snug">{act.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{act.meta}</p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}