'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/lib/LanguageContext';

export default function QuickActions() {
  const { t } = useLanguage();

  const actions = [
    { label: t.dashboard.quickActions.newPortfolio, desc: t.dashboard.quickActions.newPortfolioDesc, href: '/portfolio-studio', icon: 'PlusCircleIcon', color: 'bg-primary text-primary-foreground' },
    { label: t.dashboard.quickActions.addProject, desc: t.dashboard.quickActions.addProjectDesc, href: '/c-vth-que-master', icon: 'FolderPlusIcon', color: 'bg-accent text-accent-foreground' },
    { label: t.dashboard.quickActions.runAudit, desc: t.dashboard.quickActions.runAuditDesc, href: '/portfolio-audit', icon: 'ShieldCheckIcon', color: 'bg-warning/10 text-warning border border-warning/20' },
    { label: t.dashboard.quickActions.createCampaign, desc: t.dashboard.quickActions.createCampaignDesc, href: '/campaigns-tracking', icon: 'BarChart2Icon', color: 'bg-info/10 text-info border border-info/20' },
  ];

  return (
    <div className="mb-6">
      <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-3">{t.dashboard.quickActions.title}</p>
      <div className="flex items-center gap-3 flex-wrap">
        {actions.map((action) => (
          <Link
            key={`qa-${action.href}`}
            href={action.href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-600 transition-all duration-150 btn-press hover:opacity-90 ${action.color}`}
          >
            <Icon name={action.icon as any} size={15} />
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}