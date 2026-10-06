'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ModerationTab = 'portfolios' | 'jobs' | 'templates' | 'credentials';

interface ContentItem {
  id: string;
  title: string;
  author: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  type: string;
  reason?: string;
  preview?: string;
  views?: number;
  category?: string;
}

const PORTFOLIOS: ContentItem[] = [
  { id: 'p1', title: 'Portfolio UX/UI - Marie Dupont', author: 'Marie Dupont', submittedAt: 'il y a 2h', status: 'pending', type: 'portfolio', category: 'Design', views: 0 },
  { id: 'p2', title: 'Dev Full-Stack - Karim Benali', author: 'Karim Benali', submittedAt: 'il y a 5h', status: 'flagged', type: 'portfolio', reason: 'Contenu inapproprié signalé', category: 'Développement', views: 124 },
  { id: 'p3', title: 'Data Science - Léa Rousseau', author: 'Léa Rousseau', submittedAt: 'il y a 1j', status: 'approved', type: 'portfolio', category: 'Data', views: 892 },
  { id: 'p4', title: 'Marketing Digital - Paul Girard', author: 'Paul Girard', submittedAt: 'il y a 2j', status: 'approved', type: 'portfolio', category: 'Marketing', views: 456 },
];

const JOB_OFFERS: ContentItem[] = [
  { id: 'j1', title: 'Développeur React Senior - TechCorp', author: 'TechCorp', submittedAt: 'il y a 1h', status: 'pending', type: 'job', category: 'CDI', views: 0 },
  { id: 'j2', title: 'Chef de Projet Digital - Agence XYZ', author: 'Agence XYZ', submittedAt: 'il y a 3h', status: 'pending', type: 'job', category: 'CDI', views: 0 },
  { id: 'j3', title: 'Data Analyst - BNP Paribas', author: 'BNP Paribas', submittedAt: 'il y a 6h', status: 'approved', type: 'job', category: 'CDI', views: 234 },
  { id: 'j4', title: 'Offre suspecte - Inconnu', author: 'Inconnu', submittedAt: 'il y a 8h', status: 'flagged', type: 'job', reason: 'Offre potentiellement frauduleuse', category: 'Inconnu', views: 45 },
];

const TEMPLATES: ContentItem[] = [
  { id: 't1', title: 'Minimal Pro v2', author: 'DesignStudio', submittedAt: 'il y a 4h', status: 'pending', type: 'template', category: 'Minimaliste' },
  { id: 't2', title: 'Creative Bold', author: 'CreativeAgency', submittedAt: 'il y a 1j', status: 'pending', type: 'template', category: 'Créatif' },
  { id: 't3', title: 'Corporate Clean', author: 'ProDesigns', submittedAt: 'il y a 2j', status: 'approved', type: 'template', category: 'Corporate' },
  { id: 't4', title: 'Dark Portfolio', author: 'DarkThemes', submittedAt: 'il y a 3j', status: 'rejected', type: 'template', reason: 'Qualité insuffisante', category: 'Dark' },
];

const CREDENTIALS: ContentItem[] = [
  { id: 'c1', title: 'AWS Solutions Architect - Thomas M.', author: 'Thomas Moreau', submittedAt: 'il y a 1h', status: 'pending', type: 'credential', category: 'Cloud' },
  { id: 'c2', title: 'Google Analytics Certified - Sophie L.', author: 'Sophie Laurent', submittedAt: 'il y a 3h', status: 'pending', type: 'credential', category: 'Marketing' },
  { id: 'c3', title: 'PMP Certification - Antoine B.', author: 'Antoine Bernard', submittedAt: 'il y a 5h', status: 'pending', type: 'credential', category: 'Management' },
  { id: 'c4', title: 'Scrum Master - Léa R.', author: 'Léa Rousseau', submittedAt: 'il y a 1j', status: 'approved', type: 'credential', category: 'Agile' },
];

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-500/10', icon: 'ClockIcon' },
  approved: { label: 'Approuvé', color: 'text-emerald-600', bg: 'bg-emerald-500/10', icon: 'CheckCircleIcon' },
  rejected: { label: 'Rejeté', color: 'text-rose-600', bg: 'bg-rose-500/10', icon: 'XCircleIcon' },
  flagged: { label: 'Signalé', color: 'text-orange-600', bg: 'bg-orange-500/10', icon: 'AlertTriangleIcon' },
};

const TABS: { id: ModerationTab; label: string; icon: string; data: ContentItem[] }[] = [
  { id: 'portfolios', label: 'Portfolios', icon: 'LayoutTemplateIcon', data: PORTFOLIOS },
  { id: 'jobs', label: 'Offres d\'emploi', icon: 'BriefcaseIcon', data: JOB_OFFERS },
  { id: 'templates', label: 'Templates', icon: 'Layers2Icon', data: TEMPLATES },
  { id: 'credentials', label: 'Credentials', icon: 'ShieldCheckIcon', data: CREDENTIALS },
];

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState<ModerationTab>('portfolios');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const items = currentTab.data.filter((i) => statusFilter === 'all' || i.status === statusFilter);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TABS.map((tab) => {
          const pending = tab.data.filter((i) => i.status === 'pending' || i.status === 'flagged').length;
          const approved = tab.data.filter((i) => i.status === 'approved').length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all hover:shadow-sm ${
                activeTab === tab.id ? 'border-rose-500/30 bg-rose-500/5' : 'border-border bg-card hover:border-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-rose-500/10' : 'bg-muted'}`}>
                  <Icon name={tab.icon as any} size={15} className={activeTab === tab.id ? 'text-rose-500' : 'text-muted-foreground'} />
                </div>
                {pending > 0 && (
                  <span className="text-[10px] font-700 bg-rose-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                    {pending}
                  </span>
                )}
              </div>
              <p className={`text-sm font-700 ${activeTab === tab.id ? 'text-rose-600' : 'text-foreground'}`}>{tab.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-amber-600 font-600">{pending} en attente</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-emerald-600 font-600">{approved} approuvés</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content list */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Icon name={currentTab.icon as any} size={16} className="text-muted-foreground" />
            <h3 className="font-700 text-foreground text-sm">{currentTab.label}</h3>
            <span className="text-xs text-muted-foreground">({currentTab.data.length} total)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              {['all', 'pending', 'flagged', 'approved', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-600 transition-all ${statusFilter === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {s === 'all' ? 'Tous' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {items.map((item) => {
            const statusCfg = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.id}
                className="px-5 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusCfg.bg}`}>
                  <Icon name={currentTab.icon as any} size={16} className={statusCfg.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-700 text-foreground">{item.title}</p>
                        {item.category && (
                          <span className="text-[10px] font-600 px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">{item.category}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Par {item.author} · {item.submittedAt}</p>
                      {item.reason && (
                        <p className="text-xs text-orange-600 mt-1.5 flex items-center gap-1">
                          <Icon name="AlertTriangleIcon" size={11} />
                          {item.reason}
                        </p>
                      )}
                      {item.views !== undefined && item.views > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Icon name="EyeIcon" size={11} />
                          {item.views} vues
                        </p>
                      )}
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
                      <Icon name={statusCfg.icon as any} size={11} />
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {(item.status === 'pending' || item.status === 'flagged') && (
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-600 hover:bg-emerald-500/20 transition-all">
                      <Icon name="CheckIcon" size={12} />
                      Approuver
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-600 hover:bg-rose-500/20 transition-all">
                      <Icon name="XIcon" size={12} />
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="py-12 text-center">
            <Icon name={currentTab.icon as any} size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucun élément dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-700 text-foreground">Détail du contenu</h3>
              <button onClick={() => setSelectedItem(null)} className="p-1.5 rounded-lg hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="font-700 text-foreground text-base">{selectedItem.title}</p>
                <p className="text-sm text-muted-foreground mt-1">Par {selectedItem.author}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Type', value: selectedItem.type },
                  { label: 'Catégorie', value: selectedItem.category ?? '—' },
                  { label: 'Soumis', value: selectedItem.submittedAt },
                  { label: 'Statut', value: STATUS_CONFIG[selectedItem.status].label },
                ].map((row) => (
                  <div key={row.label} className="bg-muted rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{row.label}</p>
                    <p className="text-xs font-600 text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>
              {selectedItem.reason && (
                <div className="px-3 py-2.5 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <p className="text-xs text-orange-700 flex items-start gap-1.5">
                    <Icon name="AlertTriangleIcon" size={12} className="flex-shrink-0 mt-0.5" />
                    {selectedItem.reason}
                  </p>
                </div>
              )}
            </div>
            {(selectedItem.status === 'pending' || selectedItem.status === 'flagged') && (
              <div className="px-6 py-4 border-t border-border flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                  <Icon name="CheckIcon" size={14} />
                  Approuver
                </button>
                <button className="flex-1 py-2 rounded-xl bg-rose-500/10 text-sm font-600 text-rose-600 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
                  <Icon name="XIcon" size={14} />
                  Rejeter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
