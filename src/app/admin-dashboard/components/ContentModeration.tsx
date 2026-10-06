'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ModerationTab = 'portfolios' | 'jobs' | 'templates' | 'reports' | 'credentials';

interface ContentItem {
  id: string;
  title: string;
  author: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  type: string;
  reason?: string;
}

const PORTFOLIOS: ContentItem[] = [
  { id: 'p1', title: 'Portfolio UX/UI - Marie Dupont', author: 'Marie Dupont', submittedAt: 'il y a 2h', status: 'pending', type: 'portfolio' },
  { id: 'p2', title: 'Dev Full-Stack - Karim Benali', author: 'Karim Benali', submittedAt: 'il y a 5h', status: 'flagged', type: 'portfolio', reason: 'Contenu inapproprié signalé' },
  { id: 'p3', title: 'Data Science - Léa Rousseau', author: 'Léa Rousseau', submittedAt: 'il y a 1j', status: 'approved', type: 'portfolio' },
  { id: 'p4', title: 'Marketing Digital - Paul Girard', author: 'Paul Girard', submittedAt: 'il y a 2j', status: 'approved', type: 'portfolio' },
];

const JOB_OFFERS: ContentItem[] = [
  { id: 'j1', title: 'Développeur React Senior - TechCorp', author: 'TechCorp', submittedAt: 'il y a 1h', status: 'pending', type: 'job' },
  { id: 'j2', title: 'Chef de Projet Digital - Agence XYZ', author: 'Agence XYZ', submittedAt: 'il y a 3h', status: 'pending', type: 'job' },
  { id: 'j3', title: 'Data Analyst - BNP Paribas', author: 'BNP Paribas', submittedAt: 'il y a 6h', status: 'approved', type: 'job' },
  { id: 'j4', title: 'Offre suspecte - Inconnu', author: 'Inconnu', submittedAt: 'il y a 8h', status: 'flagged', type: 'job', reason: 'Offre potentiellement frauduleuse' },
];

const TEMPLATES: ContentItem[] = [
  { id: 't1', title: 'Minimal Pro v2', author: 'DesignStudio', submittedAt: 'il y a 4h', status: 'pending', type: 'template' },
  { id: 't2', title: 'Creative Bold', author: 'CreativeAgency', submittedAt: 'il y a 1j', status: 'pending', type: 'template' },
  { id: 't3', title: 'Corporate Clean', author: 'ProDesigns', submittedAt: 'il y a 2j', status: 'approved', type: 'template' },
  { id: 't4', title: 'Dark Portfolio', author: 'DarkThemes', submittedAt: 'il y a 3j', status: 'rejected', type: 'template', reason: 'Qualité insuffisante' },
];

const REPORTS: ContentItem[] = [
  { id: 'r1', title: 'Signalement : Portfolio #4821', author: 'Utilisateur anonyme', submittedAt: 'il y a 30 min', status: 'pending', type: 'report', reason: 'Contenu trompeur et fausses informations' },
  { id: 'r2', title: 'Signalement : Offre #312', author: 'Sophie Martin', submittedAt: 'il y a 2h', status: 'pending', type: 'report', reason: 'Offre d\'emploi frauduleuse' },
  { id: 'r3', title: 'Signalement : Utilisateur @spam_bot', author: 'Thomas Dubois', submittedAt: 'il y a 4h', status: 'pending', type: 'report', reason: 'Comportement de spam' },
  { id: 'r4', title: 'Signalement : Template #89', author: 'Lucas Bernard', submittedAt: 'il y a 1j', status: 'approved', type: 'report', reason: 'Plagiat de design' },
  { id: 'r5', title: 'Signalement : Message harcelant', author: 'Emma Lefebvre', submittedAt: 'il y a 2j', status: 'approved', type: 'report', reason: 'Harcèlement' },
];

const CREDENTIALS: ContentItem[] = [
  { id: 'c1', title: 'AWS Solutions Architect - Thomas M.', author: 'Thomas Moreau', submittedAt: 'il y a 1h', status: 'pending', type: 'credential' },
  { id: 'c2', title: 'Google Analytics Certified - Sophie L.', author: 'Sophie Laurent', submittedAt: 'il y a 3h', status: 'pending', type: 'credential' },
  { id: 'c3', title: 'PMP Certification - Antoine B.', author: 'Antoine Bernard', submittedAt: 'il y a 5h', status: 'pending', type: 'credential' },
  { id: 'c4', title: 'Scrum Master - Léa R.', author: 'Léa Rousseau', submittedAt: 'il y a 1j', status: 'approved', type: 'credential' },
];

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  approved: { label: 'Approuvé', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  rejected: { label: 'Rejeté', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  flagged: { label: 'Signalé', color: 'text-orange-600', bg: 'bg-orange-500/10' },
};

const TABS: { id: ModerationTab; label: string; icon: string; data: ContentItem[]; badge?: number }[] = [
  { id: 'portfolios', label: 'Portfolios', icon: 'LayoutTemplateIcon', data: PORTFOLIOS, badge: PORTFOLIOS.filter(p => p.status === 'pending' || p.status === 'flagged').length },
  { id: 'jobs', label: 'Offres d\'emploi', icon: 'BriefcaseIcon', data: JOB_OFFERS, badge: JOB_OFFERS.filter(j => j.status === 'pending' || j.status === 'flagged').length },
  { id: 'templates', label: 'Templates', icon: 'Layers2Icon', data: TEMPLATES, badge: TEMPLATES.filter(t => t.status === 'pending').length },
  { id: 'reports', label: 'Signalements', icon: 'FlagIcon', data: REPORTS, badge: REPORTS.filter(r => r.status === 'pending').length },
  { id: 'credentials', label: 'Credentials', icon: 'ShieldCheckIcon', data: CREDENTIALS, badge: CREDENTIALS.filter(c => c.status === 'pending').length },
];

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState<ModerationTab>('portfolios');

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const items = currentTab.data;

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-5 gap-3">
        {TABS.map((tab) => {
          const pending = tab.data.filter((i) => i.status === 'pending' || i.status === 'flagged').length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeTab === tab.id
                  ? 'border-rose-500/30 bg-rose-500/5' :'border-border bg-card hover:border-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon name={tab.icon as any} size={15} className={activeTab === tab.id ? 'text-rose-500' : 'text-muted-foreground'} />
                {pending > 0 && (
                  <span className="text-[10px] font-700 bg-rose-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                    {pending}
                  </span>
                )}
              </div>
              <p className={`text-xs font-600 ${activeTab === tab.id ? 'text-rose-600' : 'text-foreground'}`}>{tab.label}</p>
              <p className="text-[10px] text-muted-foreground">{tab.data.length} total</p>
            </button>
          );
        })}
      </div>

      {/* Content list */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name={currentTab.icon as any} size={16} className="text-muted-foreground" />
            <h3 className="font-700 text-foreground text-sm">{currentTab.label}</h3>
            {(currentTab.badge ?? 0) > 0 && (
              <span className="text-xs font-700 bg-rose-500 text-white rounded-full px-2 py-0.5">
                {currentTab.badge} en attente
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-600 text-muted-foreground hover:text-foreground transition-all">
              <Icon name="FilterIcon" size={12} />
              Filtrer
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {items.map((item) => {
            const statusCfg = STATUS_CONFIG[item.status];
            return (
              <div key={item.id} className="px-5 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.status === 'flagged' ? 'bg-orange-500/10' : item.status === 'pending' ? 'bg-amber-500/10' : item.status === 'approved' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                }`}>
                  <Icon
                    name={currentTab.icon as any}
                    size={15}
                    className={item.status === 'flagged' ? 'text-orange-500' : item.status === 'pending' ? 'text-amber-500' : item.status === 'approved' ? 'text-emerald-500' : 'text-rose-500'}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-600 text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Par {item.author} · {item.submittedAt}</p>
                      {item.reason && (
                        <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                          <Icon name="AlertTriangleIcon" size={11} />
                          {item.reason}
                        </p>
                      )}
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {(item.status === 'pending' || item.status === 'flagged') && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
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
      </div>
    </div>
  );
}
