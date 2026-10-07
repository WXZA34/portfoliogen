'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import JobBoardTab from './JobBoardTab';
import ApplicationsTab from './ApplicationsTab';
import RecruiterMessagingTab from './RecruiterMessagingTab';
import AppointmentsTab from './AppointmentsTab';

type Tab = 'jobs' | 'applications' | 'messages' | 'appointments';

const TABS: { id: Tab; label: string; icon: string; badge?: number }[] = [
  { id: 'jobs', label: 'Offres d\'emploi', icon: 'BriefcaseIcon' },
  { id: 'applications', label: 'Candidatures', icon: 'FileTextIcon', badge: 4 },
  { id: 'messages', label: 'Messagerie', icon: 'MessageSquareIcon', badge: 2 },
  { id: 'appointments', label: 'Rendez-vous', icon: 'CalendarIcon' },
];

const STATS = [
  { label: 'Offres actives', value: '3', icon: 'BriefcaseIcon', color: 'text-primary', bg: 'bg-primary/10', delta: '+1 cette semaine' },
  { label: 'Candidatures reçues', value: '24', icon: 'UsersIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', delta: '+6 aujourd\'hui' },
  { label: 'Entretiens planifiés', value: '5', icon: 'CalendarCheckIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', delta: '2 cette semaine' },
  { label: 'Messages non lus', value: '2', icon: 'MessageCircleIcon', color: 'text-sky-600', bg: 'bg-sky-500/10', delta: 'Répondre maintenant' },
];

export default function RecruiterDashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon name="BuildingIcon" size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-800 text-foreground">Espace Recruteur</h1>
            <p className="text-sm text-muted-foreground">Recrutez via les portfolios — le CV est inclus</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Plateforme 100% intégrée
          </span>
        </div>
      </div>

      {/* Stats bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2 hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon name={s.icon as any} size={16} className={s.color} />
              </div>
              <span className="text-2xl font-800 text-foreground">{s.value}</span>
            </div>
            <div>
              <p className="text-xs font-600 text-foreground">{s.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.delta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-600 whitespace-nowrap transition-all relative flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="bg-negative text-white text-[10px] font-700 rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'jobs' && <JobBoardTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'messages' && <RecruiterMessagingTab />}
          {activeTab === 'appointments' && <AppointmentsTab />}
        </div>
      </div>
    </div>
  );
}
