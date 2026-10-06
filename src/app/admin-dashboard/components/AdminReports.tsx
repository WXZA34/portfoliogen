'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';
type ReportCategory = 'all' | 'content' | 'fraud' | 'spam' | 'harassment';
type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

interface Report {
  id: string;
  title: string;
  description: string;
  reportedBy: string;
  targetType: 'portfolio' | 'job' | 'user' | 'template' | 'message';
  targetId: string;
  category: 'content' | 'fraud' | 'spam' | 'harassment';
  status: ReportStatus;
  urgency: UrgencyLevel;
  submittedAt: string;
  assignedTo?: string;
  notes?: string;
}

const MOCK_REPORTS: Report[] = [
  { id: 'r1', title: 'Portfolio avec fausses informations', description: 'L\'utilisateur prétend avoir travaillé chez Google mais les informations semblent falsifiées.', reportedBy: 'Sophie Martin', targetType: 'portfolio', targetId: '#4821', category: 'content', status: 'pending', urgency: 'high', submittedAt: 'il y a 30 min' },
  { id: 'r2', title: 'Offre d\'emploi frauduleuse', description: 'Cette offre demande des frais d\'inscription et semble être une arnaque.', reportedBy: 'Thomas Dubois', targetType: 'job', targetId: '#312', category: 'fraud', status: 'investigating', urgency: 'critical', submittedAt: 'il y a 2h', assignedTo: 'Admin A' },
  { id: 'r3', title: 'Comportement de spam', description: 'Cet utilisateur envoie des messages en masse à tous les recruteurs.', reportedBy: 'Emma Lefebvre', targetType: 'user', targetId: '@spam_bot', category: 'spam', status: 'pending', urgency: 'medium', submittedAt: 'il y a 4h' },
  { id: 'r4', title: 'Harcèlement via messagerie', description: 'Messages répétés et menaçants envoyés à plusieurs utilisateurs.', reportedBy: 'Lucas Bernard', targetType: 'message', targetId: 'MSG-891', category: 'harassment', status: 'resolved', urgency: 'critical', submittedAt: 'il y a 1j', notes: 'Utilisateur suspendu et messages supprimés.' },
  { id: 'r5', title: 'Template plagié', description: 'Ce template est une copie exacte d\'un design protégé par copyright.', reportedBy: 'Antoine Moreau', targetType: 'template', targetId: '#89', category: 'content', status: 'resolved', urgency: 'low', submittedAt: 'il y a 2j', notes: 'Template retiré de la marketplace.' },
  { id: 'r6', title: 'Faux profil recruteur', description: 'Ce compte prétend représenter une grande entreprise sans en avoir l\'autorisation.', reportedBy: 'Marie Dupont', targetType: 'user', targetId: '@fake_recruiter', category: 'fraud', status: 'investigating', urgency: 'high', submittedAt: 'il y a 3h', assignedTo: 'Admin B' },
];

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-500/10', icon: 'ClockIcon' },
  investigating: { label: 'En cours', color: 'text-blue-600', bg: 'bg-blue-500/10', icon: 'SearchIcon' },
  resolved: { label: 'Résolu', color: 'text-emerald-600', bg: 'bg-emerald-500/10', icon: 'CheckCircleIcon' },
  dismissed: { label: 'Rejeté', color: 'text-muted-foreground', bg: 'bg-muted', icon: 'XCircleIcon' },
};

const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critique', color: 'text-red-600', bg: 'bg-red-500/10' },
  high: { label: 'Élevée', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  medium: { label: 'Moyenne', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  low: { label: 'Faible', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
};

const TARGET_ICONS: Record<string, string> = {
  portfolio: 'LayoutTemplateIcon',
  job: 'BriefcaseIcon',
  user: 'UserIcon',
  template: 'Layers2Icon',
  message: 'MessageSquareIcon',
};

export default function AdminReports() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filtered = MOCK_REPORTS.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const counts = {
    pending: MOCK_REPORTS.filter((r) => r.status === 'pending').length,
    investigating: MOCK_REPORTS.filter((r) => r.status === 'investigating').length,
    resolved: MOCK_REPORTS.filter((r) => r.status === 'resolved').length,
    dismissed: MOCK_REPORTS.filter((r) => r.status === 'dismissed').length,
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(counts) as [ReportStatus, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={`bg-card border rounded-2xl p-4 text-left transition-all hover:shadow-sm ${statusFilter === status ? 'border-rose-500/30 bg-rose-500/5' : 'border-border hover:border-rose-500/20'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                  <Icon name={cfg.icon as any} size={15} className={cfg.color} />
                </div>
                {status === 'pending' && count > 0 && (
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                )}
                {status === 'investigating' && count > 0 && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <p className="text-2xl font-800 text-foreground">{count}</p>
              <p className="text-xs font-600 text-foreground">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-600 text-muted-foreground">Catégorie :</span>
          {(['all', 'content', 'fraud', 'spam', 'harassment'] as ReportCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all border ${
                categoryFilter === cat ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat === 'content' ? 'Contenu' : cat === 'fraud' ? 'Fraude' : cat === 'spam' ? 'Spam' : 'Harcèlement'}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-xs font-600 text-muted-foreground hover:text-foreground transition-all border border-border">
          <Icon name="DownloadIcon" size={13} />
          Exporter rapport
        </button>
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.map((report) => {
          const statusCfg = STATUS_CONFIG[report.status];
          const urgencyCfg = URGENCY_CONFIG[report.urgency];
          return (
            <div
              key={report.id}
              className={`bg-card border rounded-2xl p-5 cursor-pointer hover:shadow-sm transition-all ${
                report.urgency === 'critical' ? 'border-red-500/30' :
                report.urgency === 'high'? 'border-rose-500/20' : 'border-border'
              }`}
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start gap-4">
                {/* Target icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  report.urgency === 'critical' ? 'bg-red-500/10' :
                  report.urgency === 'high'? 'bg-rose-500/10' : 'bg-muted'
                }`}>
                  <Icon
                    name={TARGET_ICONS[report.targetType] as any}
                    size={17}
                    className={report.urgency === 'critical' ? 'text-red-500' : report.urgency === 'high' ? 'text-rose-500' : 'text-muted-foreground'}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-700 text-foreground">{report.title}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-700 ${urgencyCfg.bg} ${urgencyCfg.color}`}>
                          {urgencyCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
                      <Icon name={statusCfg.icon as any} size={11} />
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="UserIcon" size={11} />
                      Signalé par {report.reportedBy}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name={TARGET_ICONS[report.targetType] as any} size={11} />
                      {report.targetType} {report.targetId}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="ClockIcon" size={11} />
                      {report.submittedAt}
                    </span>
                    {report.assignedTo && (
                      <span className="flex items-center gap-1 text-xs text-blue-600 font-600">
                        <Icon name="UserCheckIcon" size={11} />
                        Assigné à {report.assignedTo}
                      </span>
                    )}
                  </div>

                  {report.notes && (
                    <div className="mt-3 px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <p className="text-xs text-emerald-700 flex items-start gap-1.5">
                        <Icon name="CheckCircleIcon" size={12} className="flex-shrink-0 mt-0.5" />
                        {report.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {(report.status === 'pending' || report.status === 'investigating') && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-600 hover:bg-blue-500/20 transition-all">
                    <Icon name="SearchIcon" size={12} />
                    Enquêter
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-600 hover:bg-emerald-500/20 transition-all">
                    <Icon name="CheckIcon" size={12} />
                    Résoudre
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-600 hover:bg-rose-500/20 transition-all">
                    <Icon name="BanIcon" size={12} />
                    Suspendre l'auteur
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-600 hover:bg-border transition-all ml-auto">
                    <Icon name="XIcon" size={12} />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl py-16 text-center">
            <Icon name="FlagIcon" size={36} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-600 text-foreground">Aucun signalement trouvé</p>
            <p className="text-xs text-muted-foreground mt-1">Modifiez vos filtres pour voir plus de résultats</p>
          </div>
        )}
      </div>

      {/* Report detail modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Icon name="FlagIcon" size={16} className="text-rose-500" />
                <h3 className="font-700 text-foreground">Détail du signalement</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-1.5 rounded-lg hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-700 text-foreground">{selectedReport.title}</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-700 ${URGENCY_CONFIG[selectedReport.urgency].bg} ${URGENCY_CONFIG[selectedReport.urgency].color}`}>
                    {URGENCY_CONFIG[selectedReport.urgency].label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Signalé par', value: selectedReport.reportedBy },
                  { label: 'Cible', value: `${selectedReport.targetType} ${selectedReport.targetId}` },
                  { label: 'Catégorie', value: selectedReport.category },
                  { label: 'Soumis', value: selectedReport.submittedAt },
                  { label: 'Statut', value: STATUS_CONFIG[selectedReport.status].label },
                  { label: 'Assigné à', value: selectedReport.assignedTo ?? 'Non assigné' },
                ].map((row) => (
                  <div key={row.label} className="bg-muted rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{row.label}</p>
                    <p className="text-xs font-600 text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1.5 block">Note de résolution</label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Décrivez les actions prises..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                <Icon name="CheckIcon" size={14} />
                Marquer résolu
              </button>
              <button className="flex-1 py-2 rounded-xl bg-rose-500/10 text-sm font-600 text-rose-600 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
                <Icon name="BanIcon" size={14} />
                Suspendre l'auteur
              </button>
              <button className="py-2 px-3 rounded-xl bg-muted text-muted-foreground hover:bg-border transition-all">
                <Icon name="XIcon" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
