'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import type { Portfolio } from './PortfolioStudioContent';
import { useLanguage } from '@/lib/LanguageContext';

interface PortfolioListProps {
  portfolios: Portfolio[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PortfolioList({ portfolios, selectedId, onSelect }: PortfolioListProps) {
  const { t } = useLanguage();

  const handleCopyLink = (slug: string) => {
    toast.success(`Lien copié : portfoliogen.io/${slug}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-700 text-foreground">{t.studio.title}</h3>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 transition-all btn-press">
          <Icon name="PlusIcon" size={12} />
          {t.studio.newPortfolio}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            onClick={() => onSelect(portfolio.id)}
            className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 group ${
              selectedId === portfolio.id
                ? 'border-primary/40 bg-secondary/50' :'border-border hover:border-border/80 hover:bg-muted'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-xs font-700 text-foreground leading-tight">{portfolio.name}</p>
              <StatusBadge variant={portfolio.status} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mb-2">{portfolio.persona}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${portfolio.syncMode === 'live' ? 'sync-live' : 'sync-frozen'}`}>
                {portfolio.syncMode === 'live' ? `⚡ ${t.studio.syncMode.live}` : `❄ ${t.studio.syncMode.frozen}`}
              </span>
              <span className="text-xs text-muted-foreground">{portfolio.template}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-data text-muted-foreground">{portfolio.views} {t.studio.list.views}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopyLink(portfolio.slug); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-card transition-all"
                title={t.studio.builder.copyLink}
              >
                <Icon name="CopyIcon" size={11} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}