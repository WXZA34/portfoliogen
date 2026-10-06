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
  reporterEmail?: string;
  targetType: 'portfolio' | 'job' | 'user' | 'template' | 'message';
  targetId: string;
  targetDetails?: string;
  category: 'content' | 'fraud' | 'spam' | 'harassment';
  status: ReportStatus;
  urgency: UrgencyLevel;
  submittedAt: string;
  assignedTo?: string;
  notes?: string;
  evidence?: string[];
  previousReports?: number;
}

const MOCK_REPORTS: Report[] = [
  {
    id: 'r1', title: 'Portfolio avec fausses informations',
    description: 'L\'utilisateur prétend avoir travaillé chez Google mais les informations semblent falsifiées. Le profil LinkedIn associé ne correspond pas aux informations du portfolio.',
    reportedBy: 'Sophie Martin', reporterEmail: 'sophie.martin@email.com',
    targetType: 'portfolio', targetId: '#4821',
    targetDetails: 'Portfolio "Dev Senior - Jean Dupuis" — Prétend 5 ans chez Google, mais aucune trace sur LinkedIn. Dates incohérentes.',
    category: 'content', status: 'pending', urgency: 'high', submittedAt: 'il y a 30 min',
    evidence: ['Capture d\'écran LinkedIn montrant un profil différent', 'Incohérence des dates d\'emploi (2019-2024 vs 2020-2023)'],
    previousReports: 0,
  },
  {
    id: 'r2', title: 'Offre d\'emploi frauduleuse',
    description: 'Cette offre demande des frais d\'inscription de 50€ pour "accéder au processus de recrutement". C\'est une arnaque classique ciblant les chercheurs d\'emploi.',
    reportedBy: 'Thomas Dubois', reporterEmail: 'thomas.dubois@email.com',
    targetType: 'job', targetId: '#312',
    targetDetails: 'Offre "Consultant Indépendant - Revenus Garantis" — Demande paiement avant entretien. Société non vérifiable.',
    category: 'fraud', status: 'investigating', urgency: 'critical', submittedAt: 'il y a 2h', assignedTo: 'Admin A',
    evidence: ['Email reçu demandant virement de 50€', 'Numéro SIRET invalide', '3 autres utilisateurs ont signalé la même offre'],
    previousReports: 3,
  },
  {
    id: 'r3', title: 'Comportement de spam',
    description: 'Cet utilisateur envoie des messages en masse à tous les recruteurs avec le même message copié-collé proposant des services de référencement SEO.',
    reportedBy: 'Emma Lefebvre', reporterEmail: 'emma.lefebvre@email.com',
    targetType: 'user', targetId: '@spam_bot',
    targetDetails: 'Compte créé il y a 3 jours. 47 messages envoyés en 24h. Tous identiques.',
    category: 'spam', status: 'pending', urgency: 'medium', submittedAt: 'il y a 4h',
    evidence: ['Capture d\'écran de 5 messages identiques', 'Log d\'activité : 47 messages en 24h'],
    previousReports: 5,
  },
  {
    id: 'r4', title: 'Harcèlement via messagerie',
    description: 'Messages répétés et menaçants envoyés à plusieurs utilisateurs après un refus de mise en relation. Contenu explicitement menaçant.',
    reportedBy: 'Lucas Bernard', reporterEmail: 'lucas.bernard@email.com',
    targetType: 'message', targetId: 'MSG-891',
    targetDetails: 'Fil de messages entre @user_agressif et 4 victimes. Menaces explicites après refus de contact.',
    category: 'harassment', status: 'resolved', urgency: 'critical', submittedAt: 'il y a 1j',
    notes: 'Utilisateur suspendu définitivement. Messages supprimés. Victimes notifiées.',
    evidence: ['Captures des messages menaçants', '4 victimes confirmées'],
    previousReports: 2,
  },
  {
    id: 'r5', title: 'Template plagié',
    description: 'Ce template est une copie exacte du template "Minimal Portfolio" de ThemeForest (ID: 23891). Vendu 29€ sans autorisation du créateur original.',
    reportedBy: 'Antoine Moreau', reporterEmail: 'antoine.moreau@email.com',
    targetType: 'template', targetId: '#89',
    targetDetails: 'Template "Dark Minimal" — Copie conforme du template ThemeForest #23891. Code CSS identique à 98%.',
    category: 'content', status: 'resolved', urgency: 'low', submittedAt: 'il y a 2j',
    notes: 'Template retiré de la marketplace. Auteur averti. Compte mis en surveillance.',
    evidence: ['Comparaison côte à côte des deux templates', 'Rapport de similarité CSS : 98%'],
    previousReports: 0,
  },
  {
    id: 'r6', title: 'Faux profil recruteur',
    description: 'Ce compte prétend représenter Amazon France pour recruter des développeurs. Amazon France a confirmé ne pas avoir de compte sur la plateforme.',
    reportedBy: 'Marie Dupont', reporterEmail: 'marie.dupont@email.com',
    targetType: 'user', targetId: '@fake_recruiter',
    targetDetails: 'Profil "Amazon France Recrutement" — Logo Amazon utilisé sans autorisation. Email de contact non-amazon.',
    category: 'fraud', status: 'investigating', urgency: 'high', submittedAt: 'il y a 3h', assignedTo: 'Admin B',
    evidence: ['Email de confirmation d\'Amazon France', 'Adresse email : amazon-recrutement@gmail.com (non officiel)'],
    previousReports: 1,
  },
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

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  content: { label: 'Contenu', color: 'text-purple-600', bg: 'bg-purple-500/10', icon: 'FileTextIcon' },
  fraud: { label: 'Fraude', color: 'text-red-600', bg: 'bg-red-500/10', icon: 'AlertOctagonIcon' },
  spam: { label: 'Spam', color: 'text-amber-600', bg: 'bg-amber-500/10', icon: 'MailXIcon' },
  harassment: { label: 'Harcèlement', color: 'text-rose-600', bg: 'bg-rose-500/10', icon: 'ShieldAlertIcon' },
};

const TARGET_ICONS: Record<string, string> = {
  portfolio: 'LayoutTemplateIcon',
  job: 'BriefcaseIcon',
  user: 'UserIcon',
  template: 'Layers2Icon',
  message: 'MessageSquareIcon',
};

// ─── Report Detail Modal ──────────────────────────────────────────────────────
function ReportDetailModal({
  report,
  onClose,
  onStatusChange,
}: {
  report: Report;
  onClose: () => void;
  onStatusChange: (id: string, status: ReportStatus, note?: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'actions'>('details');
  const [resolutionNote, setResolutionNote] = useState(report.notes || '');
  const [assignee, setAssignee] = useState(report.assignedTo || '');

  const statusCfg = STATUS_CONFIG[report.status];
  const urgencyCfg = URGENCY_CONFIG[report.urgency];
  const categoryCfg = CATEGORY_CONFIG[report.category];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${urgencyCfg.bg}`}>
              <Icon name="FlagIcon" size={16} className={urgencyCfg.color} />
            </div>
            <div>
              <h3 className="font-700 text-foreground text-sm">Détail du signalement</h3>
              <p className="text-xs text-muted-foreground">ID: {report.id} · {report.submittedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-700 ${urgencyCfg.bg} ${urgencyCfg.color}`}>
              {urgencyCfg.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
              <Icon name={statusCfg.icon as any} size={11} />
              {statusCfg.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-all">
              <Icon name="XIcon" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Report title & meta */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border flex-shrink-0">
          <p className="font-700 text-foreground text-base mb-2">{report.title}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${categoryCfg.bg} ${categoryCfg.color}`}>
              <Icon name={categoryCfg.icon as any} size={11} />
              {categoryCfg.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="UserIcon" size={11} />
              Signalé par <span className="font-600 text-foreground ml-1">{report.reportedBy}</span>
            </span>
            {report.reporterEmail && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="MailIcon" size={11} />
                {report.reporterEmail}
              </span>
            )}
            {report.previousReports !== undefined && report.previousReports > 0 && (
              <span className="flex items-center gap-1 text-xs text-rose-600 font-600">
                <Icon name="AlertTriangleIcon" size={11} />
                {report.previousReports} signalement(s) antérieur(s)
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-border flex-shrink-0">
          {[
            { id: 'details', label: 'Détails', icon: 'FileTextIcon' },
            { id: 'evidence', label: 'Preuves', icon: 'PaperclipIcon' },
            { id: 'actions', label: 'Actions', icon: 'ZapIcon' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-600 rounded-t-lg border-b-2 transition-all -mb-px ${
                activeTab === tab.id ? 'border-rose-500 text-rose-600' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon as any} size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {activeTab === 'details' && (
            <>
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Description du signalement</p>
                <div className="bg-muted/40 rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">{report.description}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Contenu signalé</p>
                <div className={`border rounded-xl p-4 ${report.urgency === 'critical' ? 'border-red-500/30 bg-red-500/5' : 'border-border bg-muted/20'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Icon name={TARGET_ICONS[report.targetType] as any} size={13} className="text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-xs font-700 text-foreground capitalize">{report.targetType}</span>
                      <span className="text-xs text-muted-foreground ml-2">{report.targetId}</span>
                    </div>
                  </div>
                  {report.targetDetails && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{report.targetDetails}</p>
                  )}
                </div>
              </div>

              {report.assignedTo && (
                <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <Icon name="UserCheckIcon" size={14} className="text-blue-500" />
                  <p className="text-xs text-blue-700 font-600">Assigné à {report.assignedTo}</p>
                </div>
              )}

              {report.notes && (
                <div className="px-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs font-700 text-emerald-700 mb-1 flex items-center gap-1.5">
                    <Icon name="CheckCircleIcon" size={12} />
                    Note de résolution
                  </p>
                  <p className="text-xs text-emerald-700">{report.notes}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-3">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide">Preuves soumises ({report.evidence?.length || 0})</p>
              {report.evidence && report.evidence.length > 0 ? (
                report.evidence.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-xl bg-muted/20">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon name="PaperclipIcon" size={12} className="text-muted-foreground" />
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{ev}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Icon name="PaperclipIcon" size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Aucune preuve soumise</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              {/* Assign */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Assigner à un admin</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Nom de l'admin..."
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-500/50"
                  />
                  <button className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 text-xs font-600 hover:bg-blue-500/20 transition-all">
                    Assigner
                  </button>
                </div>
              </div>

              {/* Resolution note */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Note de résolution</p>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Décrivez les actions prises et la résolution..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-500/50 resize-none"
                />
              </div>

              {/* Quick actions */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Actions rapides</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Supprimer le contenu', icon: 'Trash2Icon', color: 'text-rose-600', bg: 'bg-rose-500/10 hover:bg-rose-500/20' },
                    { label: 'Suspendre l\'auteur', icon: 'BanIcon', color: 'text-orange-600', bg: 'bg-orange-500/10 hover:bg-orange-500/20' },
                    { label: 'Avertir l\'auteur', icon: 'BellIcon', color: 'text-amber-600', bg: 'bg-amber-500/10 hover:bg-amber-500/20' },
                    { label: 'Contacter le plaignant', icon: 'MailIcon', color: 'text-blue-600', bg: 'bg-blue-500/10 hover:bg-blue-500/20' },
                  ].map((action) => (
                    <button key={action.label} className={`flex items-center gap-2 p-3 rounded-xl text-xs font-600 transition-all ${action.bg} ${action.color}`}>
                      <Icon name={action.icon as any} size={13} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {(report.status === 'pending' || report.status === 'investigating') && (
          <div className="px-6 py-4 border-t border-border flex gap-2 flex-shrink-0 flex-wrap">
            <button
              onClick={() => onStatusChange(report.id, 'investigating', resolutionNote)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500/10 text-sm font-600 text-blue-600 hover:bg-blue-500/20 transition-all"
            >
              <Icon name="SearchIcon" size={14} />
              Enquêter
            </button>
            <button
              onClick={() => onStatusChange(report.id, 'resolved', resolutionNote)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="CheckIcon" size={14} />
              Marquer résolu
            </button>
            <button
              onClick={() => onStatusChange(report.id, 'dismissed', resolutionNote)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted text-sm font-600 text-muted-foreground hover:bg-border transition-all"
            >
              <Icon name="XIcon" size={14} />
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminReports() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const filtered = reports.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const counts = {
    pending: reports.filter((r) => r.status === 'pending').length,
    investigating: reports.filter((r) => r.status === 'investigating').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    dismissed: reports.filter((r) => r.status === 'dismissed').length,
  };

  const handleStatusChange = (id: string, status: ReportStatus, note?: string) => {
    setReports((prev) =>
      prev.map((r) => r.id === id ? { ...r, status, notes: note || r.notes } : r)
    );
    setSelectedReport(null);
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
          const categoryCfg = CATEGORY_CONFIG[report.category];
          return (
            <div
              key={report.id}
              className={`bg-card border rounded-2xl p-5 cursor-pointer hover:shadow-sm transition-all group ${
                report.urgency === 'critical' ? 'border-red-500/30' :
                report.urgency === 'high' ? 'border-rose-500/20' : 'border-border'
              }`}
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  report.urgency === 'critical' ? 'bg-red-500/10' :
                  report.urgency === 'high' ? 'bg-rose-500/10' : 'bg-muted'
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
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-600 ${categoryCfg.bg} ${categoryCfg.color}`}>
                          {categoryCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{report.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
                        <Icon name={statusCfg.icon as any} size={11} />
                        {statusCfg.label}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                        <Icon name="EyeIcon" size={11} />
                        Voir
                      </span>
                    </div>
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
                    {report.previousReports !== undefined && report.previousReports > 0 && (
                      <span className="flex items-center gap-1 text-xs text-rose-600 font-600">
                        <Icon name="AlertTriangleIcon" size={11} />
                        {report.previousReports} signalement(s) antérieur(s)
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
                  <button
                    onClick={() => handleStatusChange(report.id, 'investigating')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-600 hover:bg-blue-500/20 transition-all"
                  >
                    <Icon name="SearchIcon" size={12} />
                    Enquêter
                  </button>
                  <button
                    onClick={() => handleStatusChange(report.id, 'resolved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-600 hover:bg-emerald-500/20 transition-all"
                  >
                    <Icon name="CheckIcon" size={12} />
                    Résoudre
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-600 hover:bg-rose-500/20 transition-all">
                    <Icon name="BanIcon" size={12} />
                    Suspendre l'auteur
                  </button>
                  <button
                    onClick={() => handleStatusChange(report.id, 'dismissed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-600 hover:bg-border transition-all ml-auto"
                  >
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
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
