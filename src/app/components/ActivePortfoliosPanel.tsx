'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import { useLanguage } from '@/lib/LanguageContext';

export default function ActivePortfoliosPanel() {
  const { t } = useLanguage();

  const portfolios = [
    { id: 'pf-001', name: t?.dashboard?.activePortfolios?.fullstack, persona: t?.dashboard?.activePortfolios?.techRecruiter, template: 'BentoMinimal', sync: 'live', views: 487, score: 91 },
    { id: 'pf-002', name: t?.dashboard?.activePortfolios?.aiEngineer, persona: t?.dashboard?.activePortfolios?.aiStartup, template: 'ClassicCream', sync: 'live', views: 312, score: 88 },
    { id: 'pf-003', name: t?.dashboard?.activePortfolios?.startupCTO, persona: t?.dashboard?.activePortfolios?.startupFounder, template: 'BentoMinimal', sync: 'frozen', views: 421, score: 76 },
    { id: 'pf-004', name: t?.dashboard?.activePortfolios?.openSource, persona: t?.dashboard?.activePortfolios?.ossComm, template: 'ClassicCream', sync: 'live', views: 276, score: 83 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-700 text-foreground">{t?.dashboard?.charts?.activePortfolios}</h3>
        <Link href="/portfolio-studio" className="text-xs text-primary font-600 hover:underline">{t?.dashboard?.charts?.manageAll}</Link>
      </div>
      <div className="space-y-3">
        {portfolios?.map((pf) => (
          <div key={pf?.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Icon name="LayoutTemplateIcon" size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-700 text-foreground truncate">{pf?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{pf?.persona}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge variant={pf?.sync === 'live' ? 'live' : 'frozen'} size="sm" />
              <span className="text-xs font-mono-data text-muted-foreground">{pf?.views} {t?.dashboard?.activePortfolios?.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}