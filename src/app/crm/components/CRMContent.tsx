'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


type AppStatus = 'candidaté' | 'entretien' | 'offre' | 'refus' | 'relance';

interface Application {
  id: string;
  company: string;
  role: string;
  status: AppStatus;
  date: string;
  portfolio: string;
  contact: string;
  notes: string;
  nextAction?: string;
  nextActionDate?: string;
  logo: string;
}

const mockApplications: Application[] = [
  { id: '1', company: 'TechCorp Paris', role: 'Lead Dev Full-Stack', status: 'entretien', date: '2026-09-08', portfolio: 'Dev Full-Stack', contact: 'Sarah Chen', notes: 'Très intéressée par le projet OSS. Préparer démo live.', nextAction: 'Entretien technique', nextActionDate: '2026-09-15', logo: '🏢' },
  { id: '2', company: 'Google London', role: 'Senior Software Engineer', status: 'candidaté', date: '2026-09-05', portfolio: 'Ingénieur IA', contact: 'Priya Sharma', notes: 'Candidature via LinkedIn. Attente retour RH.', nextAction: 'Relance email', nextActionDate: '2026-09-19', logo: '🔍' },
  { id: '3', company: 'Startup IA Berlin', role: 'CTO', status: 'offre', date: '2026-08-28', portfolio: 'CTO Startup', contact: 'Marcus Webb', notes: 'Offre reçue : 95k€ + equity. À négocier.', logo: '🚀' },
  { id: '4', company: 'Freelance Amsterdam', role: 'Dev React Senior', status: 'refus', date: '2026-08-20', portfolio: 'Freelance Dev', contact: 'Anna K.', notes: 'Profil trop senior pour leur budget.', logo: '🌷' },
  { id: '5', company: 'OpenSource Corp', role: 'Staff Engineer', status: 'relance', date: '2026-09-01', portfolio: 'Open Source', contact: 'Tom B.', notes: 'Pas de réponse depuis 2 semaines.', nextAction: 'Relance LinkedIn', nextActionDate: '2026-09-14', logo: '⚡' },
];

const statusConfig: Record<AppStatus, { label: string; color: string; bg: string }> = {
  candidaté: { label: 'Candidaté', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  entretien: { label: 'Entretien', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  offre: { label: 'Offre reçue', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  refus: { label: 'Refus', color: 'text-red-600', bg: 'bg-red-500/10' },
  relance: { label: 'À relancer', color: 'text-purple-600', bg: 'bg-purple-500/10' },
};

export default function CRMContent() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState('');

  const filtered = filterStatus === 'all' ? applications : applications.filter(a => a.status === filterStatus);

  const statusCounts = Object.keys(statusConfig).reduce((acc, key) => {
    acc[key as AppStatus] = applications.filter(a => a.status === key).length;
    return acc;
  }, {} as Record<AppStatus, number>);

  const updateStatus = (id: string, status: AppStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.entries(statusConfig) as [AppStatus, typeof statusConfig[AppStatus]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterStatus === key ? 'border-primary bg-primary/5' : 'bg-card border-border hover:border-primary/30'
            }`}
          >
            <p className="text-2xl font-800 text-foreground">{statusCounts[key]}</p>
            <p className={`text-xs font-600 mt-1 ${cfg.color}`}>{cfg.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-700 text-foreground">
              {filtered.length} candidature{filtered.length > 1 ? 's' : ''}
              {filterStatus !== 'all' && <span className="ml-2 text-sm text-muted-foreground">· {statusConfig[filterStatus].label}</span>}
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-600"
            >
              <Icon name="PlusIcon" size={14} />
              Ajouter
            </button>
          </div>

          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 ${
                selectedApp?.id === app.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                  {app.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-700 text-foreground text-sm truncate">{app.company}</h4>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-600 flex-shrink-0 ${statusConfig[app.status].bg} ${statusConfig[app.status].color}`}>
                      {statusConfig[app.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{app.role}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="CalendarIcon" size={11} />{app.date}</span>
                    <span className="flex items-center gap-1"><Icon name="LinkIcon" size={11} />{app.portfolio}</span>
                  </div>
                  {app.nextAction && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-600">
                      <Icon name="BellIcon" size={11} />
                      {app.nextAction} · {app.nextActionDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedApp ? (
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">{selectedApp.logo}</div>
                <div>
                  <h3 className="font-700 text-foreground">{selectedApp.company}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApp.role}</p>
                </div>
              </div>

              {/* Status Changer */}
              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">Statut</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(statusConfig) as AppStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedApp.id, s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-600 transition-all ${
                        selectedApp.status === s
                          ? `${statusConfig[s].bg} ${statusConfig[s].color} ring-1 ring-current`
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="UserIcon" size={13} />
                  <span>{selectedApp.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="CalendarIcon" size={13} />
                  <span>Candidaté le {selectedApp.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="FileTextIcon" size={13} />
                  <span>Portfolio : {selectedApp.portfolio}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">Notes</p>
                <p className="text-sm text-foreground bg-muted/50 rounded-xl p-3 leading-relaxed">{selectedApp.notes}</p>
              </div>

              {/* Add Note */}
              <div>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ajouter une note..."
                  rows={2}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <button
                  onClick={() => {
                    if (newNote.trim()) {
                      setApplications(prev => prev.map(a =>
                        a.id === selectedApp.id ? { ...a, notes: a.notes + '\n' + newNote } : a
                      ));
                      setSelectedApp(prev => prev ? { ...prev, notes: prev.notes + '\n' + newNote } : null);
                      setNewNote('');
                    }
                  }}
                  className="mt-2 w-full py-2 bg-primary text-primary-foreground rounded-xl text-xs font-600"
                >
                  Sauvegarder la note
                </button>
              </div>

              {/* Next Action */}
              {selectedApp.nextAction && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-xs font-700 text-amber-600 mb-1 flex items-center gap-1.5">
                    <Icon name="BellIcon" size={12} /> Prochaine action
                  </p>
                  <p className="text-sm font-600 text-foreground">{selectedApp.nextAction}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedApp.nextActionDate}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-2xl p-8 text-center">
              <Icon name="MousePointerClickIcon" size={24} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Sélectionnez une candidature pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
