'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import type { StudioPortfolio } from '@/lib/services/portfolioStudioService';
import { useLanguage } from '@/lib/LanguageContext';

interface PortfolioListProps {
  portfolios: StudioPortfolio[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateNew?: () => void;
  onDelete?: (id: string) => void;
}

export default function PortfolioList({
  portfolios,
  selectedId,
  onSelect,
  onCreateNew,
  onDelete,
}: PortfolioListProps) {
  const { t } = useLanguage();

  const handleCopyLink = (slug: string) => {
    const fullUrl = `https://portfoliogen.net/p/${slug}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
    }
    toast.success(`Lien copié : ${fullUrl}`);
  };

  const getTemplateBadge = (tpl: string) => {
    switch (tpl) {
      case 'IndustrialGEII':
        return { label: 'B.U.T. GEII (Portfolify)', color: 'bg-[#C2B59C]/20 text-[#8A7D63] border-[#C2B59C]/40' };
      case 'ClassicCream':
        return { label: 'Classic Cream', color: 'bg-amber-100/60 text-amber-800 border-amber-200' };
      case 'BentoMinimal':
        return { label: 'Bento Minimal', color: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'DarkTech':
        return { label: 'Dark Tech', color: 'bg-neutral-800 text-neutral-200 border-neutral-700' };
      default:
        return { label: tpl, color: 'bg-muted text-muted-foreground border-border' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="text-sm font-700 text-foreground">{t.studio.title}</h3>
          <p className="text-[11px] text-muted-foreground">{portfolios.length} portfolio{portfolios.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 transition-all btn-press shadow-xs"
        >
          <Icon name="PlusIcon" size={12} />
          {t.studio.newPortfolio}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {portfolios.map((portfolio) => {
          const badge = getTemplateBadge(portfolio.template);
          const isSelected = selectedId === portfolio.id;
          return (
            <div
              key={portfolio.id}
              onClick={() => onSelect(portfolio.id)}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 group relative ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20 scale-[1.01]'
                  : 'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/50 hover:shadow-2xs'
              }`}
            >
              {/* Left active accent strip */}
              {isSelected && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
              )}

              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-bold leading-tight truncate ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {portfolio.name}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
                    /p/{portfolio.slug}
                  </p>
                </div>

                {isSelected ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary text-primary-foreground flex items-center gap-1 shadow-xs flex-shrink-0 animate-in fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    En cours
                  </span>
                ) : (
                  <StatusBadge variant={portfolio.status} size="sm" />
                )}
              </div>

              <p className="text-[11px] text-muted-foreground mb-2 truncate">
                {portfolio.persona}
              </p>

              <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                <span
                  className={`text-[10px] font-600 px-2 py-0.5 rounded-full ${
                    portfolio.syncMode === 'live' ? 'sync-live' : 'sync-frozen'
                  }`}
                >
                  {portfolio.syncMode === 'live' ? '⚡ Live' : '❄ Figé'}
                </span>
                <span
                  className={`text-[10px] font-600 px-2 py-0.5 rounded-md border ${badge.color}`}
                >
                  {badge.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
                <span className="font-mono-data text-[10px] text-muted-foreground">
                  {portfolio.views} {t.studio.list.views}
                </span>

                <div className="flex items-center gap-1">
                  {isSelected && (
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 mr-1">
                      <Icon name="CheckCircleIcon" size={12} className="text-primary" />
                      Actif
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(portfolio.slug);
                    }}
                    className={`p-1 rounded transition-colors ${
                      isSelected
                        ? 'bg-primary/15 text-primary hover:bg-primary/25'
                        : 'opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    title="Copier le lien public"
                  >
                    <Icon name="CopyIcon" size={12} />
                  </button>

                  {onDelete && portfolios.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Supprimer le portfolio "${portfolio.name}" ?`)) {
                          onDelete(portfolio.id);
                        }
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Supprimer"
                    >
                      <Icon name="TrashIcon" size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}