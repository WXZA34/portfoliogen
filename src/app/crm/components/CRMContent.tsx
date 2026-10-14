'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { crmService, CRMApplication, AppStatus, CRMApplicationInput, getCompanyEmoji } from '@/lib/services/crmService';
import { createClient } from '@/lib/supabase/client';

const statusConfig: Record<AppStatus, { label: string; color: string; bg: string; border: string }> = {
  candidaté: { label: 'Candidaté', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  entretien: { label: 'Entretien', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  offre: { label: 'Offre reçue', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  relance: { label: 'À relancer', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  refus: { label: 'Refus', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const contractTypes = ['Alternance', 'Stage', 'CDI', 'CDD', 'Freelance', 'Autre'];

export default function CRMContent() {
  const [applications, setApplications] = useState<CRMApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<CRMApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  // Available portfolios from candidate's Studio
  const [availablePortfolios, setAvailablePortfolios] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Form fields
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formStatus, setFormStatus] = useState<AppStatus>('candidaté');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPortfolioSlug, setFormPortfolioSlug] = useState('portfoliolarry');
  const [formContractType, setFormContractType] = useState('Alternance');
  const [formLocation, setFormLocation] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formContactName, setFormContactName] = useState('');
  const [formContactEmail, setFormContactEmail] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formNextAction, setFormNextAction] = useState('');
  const [formNextActionDate, setFormNextActionDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Note addition in detail view
  const [newNote, setNewNote] = useState('');

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const uid = user?.id;
        setCurrentUserId(uid);

        const [apps, ports] = await Promise.all([
          crmService.getApplications(uid),
          crmService.getAvailablePortfolios(uid),
        ]);

        setApplications(apps);
        setAvailablePortfolios(ports);
        if (ports.length > 0) {
          setFormPortfolioSlug(ports[0].slug);
        }
        if (apps.length > 0) {
          setSelectedApp(apps[0]);
        }
      } catch (err) {
        console.error('Error loading CRM data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered applications
  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        (app.contactName && app.contactName.toLowerCase().includes(q)) ||
        (app.location && app.location.toLowerCase().includes(q)) ||
        app.notes.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [applications, filterStatus, searchQuery]);

  // Counts for each status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: applications.length };
    (Object.keys(statusConfig) as AppStatus[]).forEach((key) => {
      counts[key] = applications.filter((a) => a.status === key).length;
    });
    return counts;
  }, [applications]);

  // Update status quickly
  const handleUpdateStatus = async (id: string, status: AppStatus) => {
    try {
      const updated = await crmService.saveApplication(currentUserId, { id, company: '', role: '', status });
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selectedApp?.id === id) {
        setSelectedApp((prev) => (prev ? { ...prev, status } : null));
      }
      toast.success(`Statut mis à jour : ${statusConfig[status].label}`);
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  // Add a quick note to selected application
  const handleAddNote = async () => {
    if (!selectedApp || !newNote.trim()) return;
    const timestamp = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    const appendedNotes = selectedApp.notes
      ? `${selectedApp.notes}\n\n[${timestamp}] ${newNote.trim()}`
      : `[${timestamp}] ${newNote.trim()}`;

    try {
      await crmService.saveApplication(currentUserId, {
        id: selectedApp.id,
        company: selectedApp.company,
        role: selectedApp.role,
        notes: appendedNotes,
      });

      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, notes: appendedNotes } : a))
      );
      setSelectedApp((prev) => (prev ? { ...prev, notes: appendedNotes } : null));
      setNewNote('');
      toast.success('Note enregistrée !');
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde de la note');
    }
  };

  // Delete an application
  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Supprimer la candidature auprès de "${company}" ?`)) return;
    try {
      await crmService.deleteApplication(currentUserId, id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selectedApp?.id === id) {
        const remaining = applications.filter((a) => a.id !== id);
        setSelectedApp(remaining.length > 0 ? remaining[0] : null);
      }
      toast.success(`Candidature pour ${company} supprimée`);
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Open modal in Create mode
  const openCreateModal = () => {
    setModalMode('create');
    setEditingAppId(null);
    setFormCompany('');
    setFormRole('Alternance Ingénieur GEII');
    setFormStatus('candidaté');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormContractType('Alternance');
    setFormLocation('');
    setFormSalary('');
    setFormContactName('');
    setFormContactEmail('');
    setFormContactPhone('');
    setFormNextAction('Relance email / téléphone');
    setFormNextActionDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setFormNotes('');
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (app: CRMApplication) => {
    setModalMode('edit');
    setEditingAppId(app.id);
    setFormCompany(app.company);
    setFormRole(app.role);
    setFormStatus(app.status);
    setFormDate(app.date);
    setFormPortfolioSlug(app.portfolioSlug || availablePortfolios[0]?.slug || 'portfoliolarry');
    setFormContractType(app.contractType || 'Alternance');
    setFormLocation(app.location || '');
    setFormSalary(app.salary || '');
    setFormContactName(app.contactName || '');
    setFormContactEmail(app.contactEmail || '');
    setFormContactPhone(app.contactPhone || '');
    setFormNextAction(app.nextAction || '');
    setFormNextActionDate(app.nextActionDate || '');
    setFormNotes(app.notes || '');
    setIsModalOpen(true);
  };

  // Submit modal form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim()) {
      toast.error('Veuillez renseigner le nom de l\'entreprise');
      return;
    }

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://portfoliogen.net';
    const cleanCompanyQuery = encodeURIComponent(formCompany.trim().replace(/\s+/g, ''));
    const generatedCustomUrl = `${siteUrl}/p/${formPortfolioSlug}?for=${cleanCompanyQuery}`;
    const selectedPortObj = availablePortfolios.find((p) => p.slug === formPortfolioSlug);

    const payload: CRMApplicationInput = {
      id: modalMode === 'edit' && editingAppId ? editingAppId : undefined,
      company: formCompany.trim(),
      role: formRole.trim() || 'Candidat',
      status: formStatus,
      date: formDate,
      portfolioSlug: formPortfolioSlug,
      portfolioName: selectedPortObj?.name || 'Portfolio',
      customUrl: generatedCustomUrl,
      contractType: formContractType,
      location: formLocation.trim() || undefined,
      salary: formSalary.trim() || undefined,
      contactName: formContactName.trim() || undefined,
      contactEmail: formContactEmail.trim() || undefined,
      contactPhone: formContactPhone.trim() || undefined,
      nextAction: formNextAction.trim() || undefined,
      nextActionDate: formNextActionDate || undefined,
      notes: formNotes.trim(),
      logo: getCompanyEmoji(formCompany),
    };

    try {
      const saved = await crmService.saveApplication(currentUserId, payload);
      if (modalMode === 'create') {
        setApplications((prev) => [saved, ...prev]);
        setSelectedApp(saved);
        toast.success(`Candidature pour "${saved.company}" créée avec succès !`);
      } else {
        setApplications((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
        setSelectedApp(saved);
        toast.success(`Candidature pour "${saved.company}" mise à jour !`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  // Computed preview for modal URL
  const modalComputedUrl = useMemo(() => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://portfoliogen.net';
    const comp = formCompany.trim() ? `?for=${encodeURIComponent(formCompany.trim().replace(/\s+/g, ''))}` : '';
    return `${siteUrl}/p/${formPortfolioSlug}${comp}`;
  }, [formCompany, formPortfolioSlug]);

  return (
    <div className="space-y-6">
      {/* KPI Strip & Status Filter */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
            filterStatus === 'all'
              ? 'border-primary bg-primary/10 shadow-xs'
              : 'bg-card border-border hover:border-primary/40'
          }`}
        >
          <p className="text-2xl font-800 text-foreground">{statusCounts.all || 0}</p>
          <p className="text-xs font-semibold mt-1 text-muted-foreground">Toutes</p>
        </button>

        {(Object.entries(statusConfig) as [AppStatus, typeof statusConfig[AppStatus]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
            className={`p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              filterStatus === key
                ? `border-primary bg-primary/10 shadow-xs`
                : 'bg-card border-border hover:border-primary/40'
            }`}
          >
            <p className="text-2xl font-800 text-foreground">{statusCounts[key] || 0}</p>
            <p className={`text-xs font-semibold mt-1 ${cfg.color}`}>{cfg.label}</p>
          </button>
        ))}
      </div>

      {/* Toolbar: Search, Counters, Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border rounded-xl p-3">
        <div className="relative flex-1">
          <Icon
            name="MagnifyingGlassIcon"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par entreprise, poste, recruteur, ville..."
            className="w-full pl-9 pr-3 py-2 bg-muted/60 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              <Icon name="XMarkIcon" size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-bold transition-all btn-press shadow-xs cursor-pointer w-full sm:w-auto"
          >
            <Icon name="PlusIcon" size={15} />
            <span>Ajouter une candidature</span>
          </button>
        </div>
      </div>

      {/* Main Content: Applications List & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Applications List (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-foreground text-sm">
              {filtered.length} candidature{filtered.length > 1 ? 's' : ''}
              {filterStatus !== 'all' && (
                <span className="ml-2 font-normal text-muted-foreground">
                  · {statusConfig[filterStatus].label}
                </span>
              )}
            </h3>
            {searchQuery && (
              <span className="text-xs text-muted-foreground">
                Filtre : &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
              <Icon name="Loader2Icon" size={24} className="animate-spin mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium">Chargement de votre CRM...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Icon name="BriefcaseIcon" size={24} />
              </div>
              <h4 className="font-bold text-foreground text-sm">Aucune candidature trouvée</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery || filterStatus !== 'all'
                  ? 'Aucun résultat ne correspond à vos filtres actuels.'
                  : 'Commencez à suivre vos candidatures et à lier les portfolios personnalisés envoyés aux recruteurs.'}
              </p>
              <button
                onClick={openCreateModal}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Icon name="PlusIcon" size={14} />
                Ajouter une candidature
              </button>
            </div>
          ) : (
            filtered.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              const cfg = statusConfig[app.status] || statusConfig.candidaté;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 shadow-xs ${
                    isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Company Emoji / Logo */}
                    <div className="w-11 h-11 rounded-xl bg-muted border border-border/60 flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
                      {app.logo || getCompanyEmoji(app.company)}
                    </div>

                    {/* App Core Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-bold text-foreground text-sm tracking-tight hover:text-primary transition-colors">
                            {app.company}
                          </h4>
                          <p className="text-xs font-medium text-foreground/80 truncate">
                            {app.role}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0 border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      {/* Metadata tags */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="CalendarIcon" size={12} />
                          {app.date}
                        </span>
                        {app.contractType && (
                          <span className="px-1.5 py-0.2 rounded bg-muted text-foreground/90 font-medium">
                            {app.contractType}
                          </span>
                        )}
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <Icon name="MapPinIcon" size={12} />
                            {app.location}
                          </span>
                        )}
                        {app.contactName && (
                          <span className="flex items-center gap-1 truncate max-w-[140px]">
                            <Icon name="UserIcon" size={12} />
                            {app.contactName}
                          </span>
                        )}
                      </div>

                      {/* Linked Custom Portfolio Link Bar */}
                      {app.customUrl && (
                        <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] gap-2">
                          <span className="text-primary font-mono truncate max-w-[280px] sm:max-w-[360px] flex items-center gap-1">
                            <Icon name="LinkIcon" size={12} />
                            {app.customUrl.replace(/^https?:\/\//, '')}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (app.customUrl) {
                                navigator.clipboard.writeText(app.customUrl);
                                toast.success(`Lien pour ${app.company} copié !`);
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 px-2 py-0.5 rounded hover:bg-muted transition-colors flex-shrink-0"
                            title="Copier le lien d'envoi"
                          >
                            <Icon name="ClipboardDocumentCheckIcon" size={12} />
                            Copier
                          </button>
                        </div>
                      )}

                      {/* Next Action Banner */}
                      {app.nextAction && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Icon name="BellIcon" size={12} />
                          <span className="truncate">
                            {app.nextAction}
                            {app.nextActionDate ? ` · prévu le ${app.nextActionDate}` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Application Detail Panel (1 col on lg) */}
        <div className="lg:col-span-1">
          {selectedApp ? (
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-4 space-y-5 shadow-xs">
              {/* Header with Logo & Title */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border/70 flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
                    {selectedApp.logo || getCompanyEmoji(selectedApp.company)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base leading-tight">
                      {selectedApp.company}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {selectedApp.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(selectedApp)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Modifier la candidature"
                  >
                    <Icon name="PencilSquareIcon" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedApp.id, selectedApp.company)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Supprimer la candidature"
                  >
                    <Icon name="TrashIcon" size={16} />
                  </button>
                </div>
              </div>

              {/* Status Switcher */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Statut de la candidature
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(Object.keys(statusConfig) as AppStatus[]).map((s) => {
                    const cfg = statusConfig[s];
                    const active = selectedApp.status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedApp.id, s)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${
                          active
                            ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-1 ring-current shadow-2xs`
                            : 'bg-muted/50 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Portfolio Link Box */}
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                    <Icon name="SparklesIcon" size={13} />
                    Lien personnalisé envoyé
                  </span>
                  {selectedApp.portfolioSlug && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {selectedApp.portfolioSlug}
                    </span>
                  )}
                </div>

                <div className="p-2 bg-background rounded-lg border border-border font-mono text-[11px] text-foreground break-all select-all font-semibold">
                  {selectedApp.customUrl ||
                    `https://portfoliogen.net/p/${selectedApp.portfolioSlug || 'portfoliolarry'}?for=${encodeURIComponent(
                      selectedApp.company.replace(/\s+/g, '')
                    )}`}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const url =
                        selectedApp.customUrl ||
                        `https://portfoliogen.net/p/${selectedApp.portfolioSlug || 'portfoliolarry'}?for=${encodeURIComponent(
                          selectedApp.company.replace(/\s+/g, '')
                        )}`;
                      navigator.clipboard.writeText(url);
                      toast.success('Lien copié dans le presse-papier !');
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity btn-press cursor-pointer"
                  >
                    <Icon name="ClipboardDocumentCheckIcon" size={13} />
                    <span>Copier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const fullUrl =
                        selectedApp.customUrl ||
                        `https://portfoliogen.net/p/${selectedApp.portfolioSlug || 'portfoliolarry'}?for=${encodeURIComponent(
                          selectedApp.company.replace(/\s+/g, '')
                        )}`;
                      const localTarget = fullUrl.startsWith('https://portfoliogen.net')
                        ? fullUrl.replace('https://portfoliogen.net', '')
                        : fullUrl;
                      window.open(localTarget, '_blank');
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1 border border-border transition-colors btn-press cursor-pointer"
                    title="Ouvrir le portfolio envoyé dans un nouvel onglet"
                  >
                    <Icon name="ArrowTopRightOnSquareIcon" size={13} />
                    <span>Tester</span>
                  </button>
                </div>
              </div>

              {/* Recruiter & Job Info */}
              <div className="space-y-2.5 text-xs">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Détails & Contacts
                </label>

                {selectedApp.contactName && (
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Icon name="UserIcon" size={14} className="text-muted-foreground flex-shrink-0" />
                    <span>{selectedApp.contactName}</span>
                  </div>
                )}

                {selectedApp.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Icon name="EnvelopeIcon" size={14} className="text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${selectedApp.contactEmail}`}
                      className="text-primary hover:underline font-mono truncate"
                    >
                      {selectedApp.contactEmail}
                    </a>
                  </div>
                )}

                {selectedApp.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Icon name="PhoneIcon" size={14} className="text-muted-foreground flex-shrink-0" />
                    <a
                      href={`tel:${selectedApp.contactPhone}`}
                      className="text-primary hover:underline font-mono"
                    >
                      {selectedApp.contactPhone}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="CalendarIcon" size={14} className="flex-shrink-0" />
                  <span>Candidaté le {selectedApp.date}</span>
                </div>

                {selectedApp.contractType && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="TagIcon" size={14} className="flex-shrink-0" />
                    <span>Contrat : {selectedApp.contractType}</span>
                  </div>
                )}

                {selectedApp.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="MapPinIcon" size={14} className="flex-shrink-0" />
                    <span>Lieu : {selectedApp.location}</span>
                  </div>
                )}

                {selectedApp.salary && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="BanknotesIcon" size={14} className="flex-shrink-0" />
                    <span>Rémunération : {selectedApp.salary}</span>
                  </div>
                )}
              </div>

              {/* Next Action Box */}
              {selectedApp.nextAction ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                    <Icon name="BellIcon" size={13} />
                    Prochaine action à mener
                  </p>
                  <p className="text-xs font-bold text-foreground">{selectedApp.nextAction}</p>
                  {selectedApp.nextActionDate && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Échéance : {selectedApp.nextActionDate}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-muted/40 border border-dashed border-border rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Aucune relance ou action planifiée</p>
                  <button
                    onClick={() => openEditModal(selectedApp)}
                    className="text-xs text-primary font-bold hover:underline mt-1 cursor-pointer"
                  >
                    + Définir une relance
                  </button>
                </div>
              )}

              {/* Notes Log */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Journal & Notes de suivi
                </label>
                {selectedApp.notes ? (
                  <div className="p-3 bg-muted/60 rounded-xl text-xs text-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-border/50">
                    {selectedApp.notes}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Aucune note enregistrée</p>
                )}

                {/* Add new note inline */}
                <div className="pt-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une note ou compte-rendu d'appel..."
                    rows={2}
                    className="w-full px-3 py-2 bg-muted/70 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="mt-1.5 w-full py-1.5 bg-primary disabled:opacity-50 text-primary-foreground rounded-lg text-xs font-bold transition-opacity cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Icon name="PlusIcon" size={13} />
                    <span>Enregistrer la note</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border border-dashed rounded-2xl p-8 text-center sticky top-4">
              <Icon name="CursorArrowRaysIcon" size={28} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">Aucune candidature sélectionnée</p>
              <p className="text-xs text-muted-foreground mt-1">
                Cliquez sur une candidature pour consulter ses détails et liens d&apos;envoi.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Ajouter ou Modifier une candidature */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name="BriefcaseIcon" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    {modalMode === 'create' ? 'Nouvelle candidature' : 'Modifier la candidature'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Suivez vos démarches et associez votre portfolio personnalisé
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Entreprise & Poste */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Entreprise ciblée <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="ex: Schneider Electric, Alstom"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Intitulé du poste / alternance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="ex: Alternance Ingénieur GEII"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Type de contrat & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Type de contrat
                  </label>
                  <select
                    value={formContractType}
                    onChange={(e) => setFormContractType(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {contractTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Statut initial
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as AppStatus)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {(Object.keys(statusConfig) as AppStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {statusConfig[s].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Date de candidature
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Choix du Portfolio & Live Custom URL Preview */}
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Icon name="LinkIcon" size={14} />
                    Portfolio & Lien personnalisé à envoyer
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                      Portfolio associé
                    </label>
                    <select
                      value={formPortfolioSlug}
                      onChange={(e) => setFormPortfolioSlug(e.target.value)}
                      className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground font-semibold"
                    >
                      {availablePortfolios.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name} (/p/{p.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                      Aperçu de l&apos;URL générée
                    </label>
                    <div className="p-2 bg-background border border-border rounded-lg font-mono text-[11px] text-foreground truncate select-all">
                      {modalComputedUrl}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruteur Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nom du contact RH / Tuteur
                  </label>
                  <input
                    type="text"
                    value={formContactName}
                    onChange={(e) => setFormContactName(e.target.value)}
                    placeholder="ex: M. Dupont"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={formContactEmail}
                    onChange={(e) => setFormContactEmail(e.target.value)}
                    placeholder="ex: contact@entreprise.com"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formContactPhone}
                    onChange={(e) => setFormContactPhone(e.target.value)}
                    placeholder="ex: 01 45 67 89 10"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Localisation & Rémunération */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Lieu / Ville / Télétravail
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="ex: Paris, Lyon, Hybride 2j"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Rémunération / Salaire
                  </label>
                  <input
                    type="text"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    placeholder="ex: 1 600 € / mois ou 42 k€"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Prochaine Action & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Prochaine action à mener
                  </label>
                  <input
                    type="text"
                    value={formNextAction}
                    onChange={(e) => setFormNextAction(e.target.value)}
                    placeholder="ex: Relance email, Entretien visio RH..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Date prévue pour l&apos;action
                  </label>
                  <input
                    type="date"
                    value={formNextActionDate}
                    onChange={(e) => setFormNextActionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Notes et observations
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Remarques importantes, contexte de l'offre, préparation d'entretien..."
                  rows={3}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-all btn-press shadow-xs cursor-pointer"
                >
                  {modalMode === 'create' ? 'Créer la candidature' : 'Sauvegarder les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
