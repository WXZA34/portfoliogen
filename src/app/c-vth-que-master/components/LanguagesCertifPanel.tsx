'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import {
  type LanguageItem,
  type CertificationItem,
  fetchUserLanguages,
  saveUserLanguage,
  deleteUserLanguage,
  fetchUserCertifications,
  saveUserCertification,
  deleteUserCertification,
} from '@/lib/services/cvthequeService';

interface LanguagesCertifPanelProps {
  onCountChange?: (count: number) => void;
}

export default function LanguagesCertifPanel({ onCountChange }: LanguagesCertifPanelProps) {
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states for Language
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<LanguageItem | null>(null);
  const [langName, setLangName] = useState('');
  const [langLevel, setLangLevel] = useState('Niveau B2 (Intermédiaire supérieur)');
  const [langFlag, setLangFlag] = useState('🇬🇧');
  const [langDetail, setLangDetail] = useState('');

  // Modal states for Certification
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('2025');
  const [certBadge, setCertBadge] = useState('');

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchUserLanguages(), fetchUserCertifications()]).then(([lList, cList]) => {
      if (mounted) {
        setLanguages(lList);
        setCertifications(cList);
        setLoading(false);
        onCountChange?.(lList.length + cList.length);
      }
    });
    return () => {
      mounted = false;
    };
  }, [onCountChange]);

  const openNewLang = () => {
    setEditingLang(null);
    setLangName('');
    setLangLevel('Niveau B2 (Technique / Professionnel)');
    setLangFlag('🇬🇧');
    setLangDetail('');
    setLangModalOpen(true);
  };

  const openEditLang = (l: LanguageItem) => {
    setEditingLang(l);
    setLangName(l.name);
    setLangLevel(l.level);
    setLangFlag(l.flag || '🌐');
    setLangDetail(l.detail || '');
    setLangModalOpen(true);
  };

  const handleSaveLang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langName.trim()) return;
    const saved = await saveUserLanguage(
      {
        name: langName.trim(),
        level: langLevel,
        flag: langFlag,
        detail: langDetail.trim(),
      },
      editingLang?.id
    );

    const updated = editingLang
      ? languages.map((l) => (l.id === saved.id ? saved : l))
      : [saved, ...languages];

    setLanguages(updated);
    setLangModalOpen(false);
    onCountChange?.(updated.length + certifications.length);
    toast.success('Langue enregistrée avec succès !');
  };

  const handleDeleteLang = async (id: string) => {
    await deleteUserLanguage(id);
    const updated = languages.filter((l) => l.id !== id);
    setLanguages(updated);
    onCountChange?.(updated.length + certifications.length);
    toast.success('Langue supprimée.');
  };

  const openNewCert = () => {
    setEditingCert(null);
    setCertTitle('');
    setCertIssuer('');
    setCertYear('2025');
    setCertBadge('⚡ Habilitation / Certif');
    setCertModalOpen(true);
  };

  const openEditCert = (c: CertificationItem) => {
    setEditingCert(c);
    setCertTitle(c.title);
    setCertIssuer(c.issuer);
    setCertYear(c.year);
    setCertBadge(c.badge || '');
    setCertModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;
    const saved = await saveUserCertification(
      {
        title: certTitle.trim(),
        issuer: certIssuer.trim() || 'Organisme de formation',
        year: certYear,
        badge: certBadge.trim(),
      },
      editingCert?.id
    );

    const updated = editingCert
      ? certifications.map((c) => (c.id === saved.id ? saved : c))
      : [saved, ...certifications];

    setCertifications(updated);
    setCertModalOpen(false);
    onCountChange?.(languages.length + updated.length);
    toast.success('Certification enregistrée !');
  };

  const handleDeleteCert = async (id: string) => {
    await deleteUserCertification(id);
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    onCountChange?.(languages.length + updated.length);
    toast.success('Certification supprimée.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Icon name="Loader2Icon" size={24} className="animate-spin text-primary mr-2" />
        <span className="text-xs font-600">Chargement des langues et certifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SECTION 1: LANGUES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-800 text-foreground flex items-center gap-2">
              <Icon name="GlobeAltIcon" size={16} className="text-primary" />
              Langues Maîtrisées ({languages.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Définissez vos niveaux de maîtrise pour les recruteurs internationaux et industriels.
            </p>
          </div>
          <button
            onClick={openNewLang}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 transition-all btn-press shadow-xs"
          >
            <Icon name="PlusIcon" size={12} />
            Ajouter une langue
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="bg-card border border-border rounded-xl p-4 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag || '🌐'}</span>
                    <h3 className="text-sm font-700 text-foreground">{lang.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditLang(lang)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="PencilIcon" size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteLang(lang.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="TrashIcon" size={12} />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-600 text-primary mb-1">{lang.level}</p>
                {lang.detail && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {lang.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: CERTIFICATIONS & HABILITATIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-800 text-foreground flex items-center gap-2">
              <Icon name="AcademicCapIcon" size={16} className="text-[#8A7D63]" />
              Certifications & Habilitations ({certifications.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Habilitations électriques, normes de sécurité, certifications industrielles et scores de langues.
            </p>
          </div>
          <button
            onClick={openNewCert}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 transition-all btn-press shadow-xs"
          >
            <Icon name="PlusIcon" size={12} />
            Ajouter une certification
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-card border border-border rounded-xl p-4 shadow-2xs hover:border-[#C2B59C] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-700 text-foreground leading-snug">
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => openEditCert(cert)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="PencilIcon" size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="TrashIcon" size={12} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground font-600">
                  {cert.issuer} · <span className="font-mono">{cert.year}</span>
                </p>

                {cert.badge && (
                  <div className="mt-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF8F3] border border-[#E1D9C6] text-[#6D624C] text-[11px] font-600">
                      {cert.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: Langue */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-800 text-foreground mb-4">
              {editingLang ? 'Modifier la langue' : 'Ajouter une nouvelle langue'}
            </h3>
            <form onSubmit={handleSaveLang} className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Drapeau
                  </label>
                  <input
                    type="text"
                    value={langFlag}
                    onChange={(e) => setLangFlag(e.target.value)}
                    className="w-full px-2 py-2 bg-muted border border-border rounded-lg text-sm text-center focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Nom de la langue
                  </label>
                  <input
                    type="text"
                    value={langName}
                    onChange={(e) => setLangName(e.target.value)}
                    placeholder="Ex: Anglais, Allemand..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Niveau de maîtrise
                </label>
                <select
                  value={langLevel}
                  onChange={(e) => setLangLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Langue maternelle">Langue maternelle (Natif)</option>
                  <option value="Bilingue">Bilingue / C2</option>
                  <option value="Niveau C1 (Courant / Autonome)">Niveau C1 (Courant / Autonome)</option>
                  <option value="Niveau B2 (Technique / Professionnel)">Niveau B2 (Technique / Professionnel)</option>
                  <option value="Niveau B1 (Intermédiaire)">Niveau B1 (Intermédiaire)</option>
                  <option value="Niveau A2 (Notions de base)">Niveau A2 (Notions de base)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Détail / Usage en milieu pro (optionnel)
                </label>
                <input
                  type="text"
                  value={langDetail}
                  onChange={(e) => setLangDetail(e.target.value)}
                  placeholder="Ex: Lecture fluide de datasheets, échanges par email..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLangModalOpen(false)}
                  className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-700 hover:opacity-90 transition-all btn-press"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Certification */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-800 text-foreground mb-4">
              {editingCert ? 'Modifier la certification' : 'Ajouter une certification'}
            </h3>
            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Intitulé de la certification / Habilitation
                </label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="Ex: Habilitation Électrique B1V / BR"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Organisme émetteur
                  </label>
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="Ex: IUT Sénart / Siemens"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Année d&apos;obtention
                  </label>
                  <input
                    type="text"
                    value={certYear}
                    onChange={(e) => setCertYear(e.target.value)}
                    placeholder="Ex: 2025"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Badge ou norme associée
                </label>
                <input
                  type="text"
                  value={certBadge}
                  onChange={(e) => setCertBadge(e.target.value)}
                  placeholder="Ex: ⚡ Norme NF C 18-510"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-700 hover:opacity-90 transition-all btn-press"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
