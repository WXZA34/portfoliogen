'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';
import type {
  StudioPortfolio,
  StudioTemplateId,
  StudioPortfolioSections,
  SectionColors,
  SectionTexts,
} from '@/lib/services/portfolioStudioService';
import { DEFAULT_STUDIO_SECTIONS, DEFAULT_STARTER_PORTFOLIOS, TEMPLATE_COLOR_PRESETS, saveStudioPortfolio } from '@/lib/services/portfolioStudioService';
import type {
  ProjectItem,
  PersonalProjectItem,
  CreativeStudioItem,
  SkillItem,
  ParcoursItem,
  PersonaItem,
  LanguageItem,
  CertificationItem,
  MediaFileItem,
  UserProfileInfo,
} from '@/lib/services/cvthequeService';
import { saveUserProfileInfo } from '@/lib/services/cvthequeService';
import { uploadMediaFromPC, openDocumentSafe, downloadDocumentSafe } from '@/lib/utils/mediaUploadHelper';
import { crmService } from '@/lib/services/crmService';
import { useLanguage } from '@/lib/LanguageContext';

interface PortfolioBuilderProps {
  portfolio: StudioPortfolio;
  onUpdate: (p: StudioPortfolio) => void;
  projects?: ProjectItem[];
  personalProjects?: PersonalProjectItem[];
  creativeStudio?: CreativeStudioItem[];
  skills?: SkillItem[];
  parcours?: ParcoursItem[];
  personas?: PersonaItem[];
  languages?: LanguageItem[];
  certifications?: CertificationItem[];
  media?: MediaFileItem[];
  profile?: UserProfileInfo;
  onProfileUpdate?: (profile: UserProfileInfo) => void;
  previewVisible: boolean;
  onTogglePreview: () => void;
}

export default function PortfolioBuilder({
  portfolio,
  onUpdate,
  projects = [],
  personalProjects = [],
  creativeStudio = [],
  skills = [],
  parcours = [],
  personas = [],
  languages = [],
  certifications = [],
  media = [],
  profile,
  onProfileUpdate,
  previewVisible,
  onTogglePreview,
}: PortfolioBuilderProps) {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'template' | 'sections' | 'content' | 'colors' | 'texts' | 'settings'>('sections');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<'all' | 'hard' | 'soft' | 'tools'>('all');
  const [projectCatFilter, setProjectCatFilter] = useState<string>('all');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const enabledSections: StudioPortfolioSections = portfolio.enabledSections || { ...DEFAULT_STUDIO_SECTIONS };

  const templates: {
    id: StudioTemplateId;
    label: string;
    description: string;
    preview: string;
    accent: string;
    badge?: string;
  }[] = [
    {
      id: 'IndustrialGEII',
      label: 'Ingénierie & B.U.T. (Style Portfolify)',
      description: 'Template modulaire académique & industriel avec sas d\'accueil, SAÉ et compétences dynamiques issues de la CVthèque',
      preview: 'bg-[#FAF8F3]',
      accent: 'border-[#C2B59C]',
      badge: 'Style Référence',
    },
    {
      id: 'ClassicCream',
      label: t.studio.templates.classicCream,
      description: t.studio.templates.classicDesc,
      preview: 'bg-amber-50',
      accent: 'border-amber-300',
    },
    {
      id: 'BentoMinimal',
      label: t.studio.templates.bentoMinimal,
      description: t.studio.templates.bentoDesc,
      preview: 'bg-slate-50',
      accent: 'border-slate-300',
    },
    {
      id: 'DarkTech',
      label: t.studio.templates.darkTech,
      description: t.studio.templates.darkDesc,
      preview: 'bg-gray-900',
      accent: 'border-gray-600',
    },
    {
      id: 'EditorialBold',
      label: t.studio.templates.editorialBold,
      description: t.studio.templates.editorialDesc,
      preview: 'bg-rose-50',
      accent: 'border-rose-300',
    },
  ];

  const defaultPersonasNames = [
    'Recruteur Industriel & AII',
    'Tech Recruiter',
    'Startup IA',
    'Fondateur Startup',
    'Manager Aéronautique',
    'Directeur Technique (CTO)',
  ];

  const availablePersonas = Array.from(
    new Set([
      ...personas.map((p) => p.name),
      ...defaultPersonasNames,
      portfolio.persona,
    ].filter(Boolean))
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const portfolioToSave: StudioPortfolio = {
        ...portfolio,
        authorAvatar: portfolio.authorAvatar || profile?.avatarUrl || '',
        cvPdfUrl: portfolio.cvPdfUrl || profile?.cvPdfUrl || '',
        cvFileName: portfolio.cvFileName || profile?.cvFileName || '',
        cvFileSize: portfolio.cvFileSize || profile?.cvFileSize || '',
        authorName: portfolio.authorName || profile?.fullName || 'KOKOU DUSSEY',
        profileInfo: profile || undefined,
        cvthequeData: {
          projects,
          personalProjects,
          creativeStudio,
          skills,
          parcours,
          languages,
          certifications,
          media,
        },
      };

      const saved = await saveStudioPortfolio(portfolioToSave, profile, {
        projects,
        personalProjects,
        creativeStudio,
        skills,
        parcours,
        languages,
        certifications,
        media,
      });
      onUpdate(saved || portfolioToSave);
      toast.success(`"${portfolio.name}" enregistré et synchronisé avec le lien public ✓`);
    } catch (err: any) {
      console.error('Error saving portfolio:', err);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setTimeout(() => setSaving(false), 300);
    }
  };

  const toggleSection = (key: keyof StudioPortfolioSections) => {
    const updated = {
      ...enabledSections,
      [key]: !enabledSections[key],
    };
    onUpdate({ ...portfolio, enabledSections: updated });
  };

  const toggleProject = (projId: string) => {
    const current = portfolio.selectedProjects || [];
    const updated = current.includes(projId)
      ? current.filter((id) => id !== projId)
      : [...current, projId];
    onUpdate({ ...portfolio, selectedProjects: updated });
  };

  const togglePersonalProject = (id: string) => {
    const current = portfolio.selectedPersonalProjects || personalProjects.map((p) => p.id);
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onUpdate({ ...portfolio, selectedPersonalProjects: updated });
  };

  const toggleCreativeStudio = (id: string) => {
    const current = portfolio.selectedCreativeStudio || creativeStudio.map((c) => c.id);
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onUpdate({ ...portfolio, selectedCreativeStudio: updated });
  };

  const toggleSkill = (skillId: string) => {
    const current = portfolio.selectedSkills || [];
    const updated = current.includes(skillId)
      ? current.filter((id) => id !== skillId)
      : [...current, skillId];
    onUpdate({ ...portfolio, selectedSkills: updated });
  };

  const toggleLanguage = (langId: string) => {
    const current = portfolio.selectedLanguages || languages.map((l) => l.id);
    const updated = current.includes(langId)
      ? current.filter((id) => id !== langId)
      : [...current, langId];
    onUpdate({ ...portfolio, selectedLanguages: updated });
  };

  const toggleCertification = (certId: string) => {
    const current = portfolio.selectedCertifications || certifications.map((c) => c.id);
    const updated = current.includes(certId)
      ? current.filter((id) => id !== certId)
      : [...current, certId];
    onUpdate({ ...portfolio, selectedCertifications: updated });
  };

  const filteredSkills = skills.filter((s) => {
    if (skillCategoryFilter === 'all') return true;
    return s.category === skillCategoryFilter;
  });

  const filteredProjects = projects.filter((p) => {
    if (projectCatFilter === 'all') return true;
    return p.category === projectCatFilter;
  });

  // Section list definition for the Section Manager
  const sectionList: {
    key: keyof StudioPortfolioSections;
    title: string;
    subtitle: string;
    icon: string;
  }[] = [
    { key: 'cover', title: 'Page de garde (Sas d\'accueil)', subtitle: 'Couverture B.U.T. avec bouton d\'accès', icon: 'ShieldCheckIcon' },
    { key: 'hero', title: 'Section Accueil (Hero & Slogan)', subtitle: 'Phrase d\'accroche, avatar et badges contact', icon: 'SparklesIcon' },
    { key: 'about', title: 'Profil & Projet Professionnel (À propos)', subtitle: 'Bio détaillée, alternance recherchée et démarche', icon: 'UserIcon' },
    { key: 'projects', title: 'Mes Réalisations & SAÉ (IUT)', subtitle: 'Situations d\'apprentissage et travaux pratiques', icon: 'FolderIcon' },
    { key: 'personalProjects', title: 'Projets Personnels (Savoir-Faire)', subtitle: 'Développements autonomes, applications mobiles et IoT', icon: 'CommandLineIcon' },
    { key: 'creativeStudio', title: 'Studio Créatif (Savoir-Être)', subtitle: 'Audiovisuel, communication d\'équipe et vulgarisation', icon: 'SparklesIcon' },
    { key: 'skills', title: 'Compétences Techniques', subtitle: 'Groupes d\'expertise et jauges de niveau %', icon: 'BrainIcon' },
    { key: 'tools', title: 'Outils & Matériel Industriel', subtitle: 'Logiciels CAO, automates et équipements', icon: 'WrenchScrewdriverIcon' },
    { key: 'parcours', title: 'Parcours & Formations', subtitle: 'Timeline chronologique des diplômes et stages', icon: 'GraduationCapIcon' },
    { key: 'languages', title: 'Langues & Certifications', subtitle: 'Habilitations électriques et niveaux linguistiques', icon: 'GlobeAltIcon' },
    { key: 'gallery', title: 'Galerie Médias', subtitle: 'Photographies de montages et réalisations', icon: 'ImageIcon' },
    { key: 'contact', title: 'Coordonnées & Pied de page', subtitle: 'Email, téléphone, LinkedIn, GitHub et CV', icon: 'EnvelopeIcon' },
  ];

  // Theme colors and editable section texts with defaults
  const themeColors: SectionColors = portfolio.themeColors || { ...DEFAULT_STARTER_PORTFOLIOS[0].themeColors };
  const sectionTexts: SectionTexts = portfolio.sectionTexts || { ...DEFAULT_STARTER_PORTFOLIOS[0].sectionTexts };

  const updateThemeColor = (key: keyof SectionColors, value: string) => {
    onUpdate({
      ...portfolio,
      themeColors: {
        ...themeColors,
        [key]: value,
      },
    });
  };

  const updateSectionText = (key: string, value: string) => {
    onUpdate({
      ...portfolio,
      sectionTexts: {
        ...sectionTexts,
        [key]: value,
      },
    });
  };


  return (
    <div className="bg-card border border-border rounded-xl shadow-card flex flex-col h-full">
      {/* Header with clean 2-tier layout to prevent button collisions */}
      <div className="p-4 border-b border-border space-y-3">
        {/* Tier 1: Title, Status and Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <h2 className="text-sm font-bold text-foreground truncate" title={portfolio.name}>
              {portfolio.name}
            </h2>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 flex-shrink-0 whitespace-nowrap">
              En cours d&apos;édition
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onTogglePreview}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-semibold hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer whitespace-nowrap"
            >
              <Icon name={previewVisible ? 'EyeOffIcon' : 'EyeIcon'} size={13} />
              <span>{previewVisible ? t.studio.builder.togglePreview : t.studio.builder.showPreview}</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-all btn-press shadow-xs cursor-pointer whitespace-nowrap"
            >
              {saving ? (
                <Icon name="Loader2Icon" size={13} className="animate-spin" />
              ) : (
                <Icon name="SaveIcon" size={13} />
              )}
              <span>{saving ? t.common.loading : t.studio.builder.save}</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Dedicated Public URL Bar with 1-Click Copy */}
        {(() => {
          const activeSlug = (portfolio.slug && portfolio.slug.trim().toLowerCase().replace(/[^a-z0-9-_/]/g, '')) || portfolio.id;
          const companyQuery = portfolio.recipientCompany && portfolio.recipientCompany.trim()
            ? `?for=${encodeURIComponent(portfolio.recipientCompany.trim().replace(/\s+/g, ''))}`
            : '';
          const fullDisplayPath = `portfoliogen.net/p/${activeSlug}${companyQuery}`;
          const fullClickableUrl = `/p/${activeSlug}${companyQuery}`;
          const fullClipboardUrl = `https://portfoliogen.net/p/${activeSlug}${companyQuery}`;

          return (
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/70 text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-primary font-bold text-[11px] uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
                  <Icon name="LinkIcon" size={12} />
                  Lien public :
                </span>
                <a
                  href={fullClickableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary hover:underline font-bold truncate flex items-center gap-1 min-w-0"
                  title="Ouvrir ce portfolio personnalisé en public dans un nouvel onglet"
                >
                  <span className="truncate">{fullDisplayPath}</span>
                  <Icon name="ArrowTopRightOnSquareIcon" size={11} className="flex-shrink-0 opacity-80" />
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(fullClipboardUrl);
                    toast.success(`Lien personnalisé copié : ${fullClipboardUrl}`);
                  }
                }}
                className="px-2 py-1 rounded bg-card hover:bg-card/80 text-foreground border border-border/80 text-[11px] font-semibold flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
                title="Copier le lien public personnalisé"
              >
                <Icon name="ShareIcon" size={12} className="text-primary" />
                <span>Copier</span>
              </button>
            </div>
          );
        })()}
      </div>

      {/* 6 Tabs: Modèle | Sections | Contenu | Couleurs | Textes | Réglages */}
      <div className="flex border-b border-border text-xs font-semibold overflow-x-auto scrollbar-none">
        {[
          { id: 'template', label: 'Modèle' },
          { id: 'sections', label: 'Sections' },
          { id: 'content', label: 'Contenu' },
          { id: 'colors', label: 'Couleurs' },
          { id: 'texts', label: 'Textes' },
          { id: 'settings', label: 'Réglages' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[62px] py-2.5 text-center transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* =================================================================== */}
        {/* TAB 1: TEMPLATE SELECTION */}
        {/* =================================================================== */}
        {activeTab === 'template' && (
          <div className="space-y-4">
            <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
              Choix du Template
            </p>

            <div className="space-y-3">
              {templates.map((tpl) => {
                const isSelected = portfolio.template === tpl.id;
                return (
                  <button
                    key={`tpl-${tpl.id}`}
                    onClick={() => {
                      const newTpl = tpl.id;
                      const newColors = TEMPLATE_COLOR_PRESETS[newTpl] || portfolio.themeColors;
                      onUpdate({
                        ...portfolio,
                        template: newTpl,
                        themeColors: {
                          ...portfolio.themeColors,
                          ...newColors,
                        },
                      });
                      toast.success(`Modèle "${tpl.label}" appliqué avec son style visuel`);
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all duration-150 text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-xs'
                        : 'border-border hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div
                      className={`w-16 h-14 rounded-lg ${tpl.preview} border ${tpl.accent} flex items-center justify-center flex-shrink-0 shadow-2xs font-bold text-xs text-[#8A7D63]`}
                    >
                      {tpl.id === 'IndustrialGEII' ? 'B.U.T.' : tpl.id.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-700 text-foreground leading-tight">
                          {tpl.label}
                        </p>
                        {tpl.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-700">
                            {tpl.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {tpl.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Icon name="CheckCircleIcon" size={18} className="text-primary flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sync Mode */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2.5">
                {t.studio.syncMode.title}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(['live', 'frozen'] as const).map((mode) => (
                  <button
                    key={`sync-${mode}`}
                    onClick={() => onUpdate({ ...portfolio, syncMode: mode })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      portfolio.syncMode === mode
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <p className="text-xs font-700 text-foreground mb-1">
                      {mode === 'live' ? `⚡ ${t.studio.syncMode.live}` : `❄ ${t.studio.syncMode.frozen}`}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {mode === 'live'
                        ? 'Actualise le template automatiquement quand la CVthèque change'
                        : 'Garde une copie figée du contenu'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: SECTIONS MANAGER (ACTIVATION / DÉSACTIVATION DES SECTIONS) */}
        {/* =================================================================== */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5">
              <Icon name="AdjustmentsHorizontalIcon" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <span className="font-700 text-foreground block">
                  Gestionnaire modulaire des rubriques
                </span>
                Activez ou désactivez n&apos;importe quelle section pour adapter le portfolio au recruteur ciblé.
              </div>
            </div>

            <div className="space-y-2">
              {sectionList.map((sec) => {
                const isEnabled = enabledSections[sec.key];
                return (
                  <div
                    key={`sec-toggle-${sec.key}`}
                    onClick={() => toggleSection(sec.key)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isEnabled
                        ? 'border-primary/40 bg-card hover:border-primary shadow-2xs'
                        : 'border-border bg-muted/40 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon name={sec.icon as any} size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-700 text-foreground leading-tight">
                          {sec.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {sec.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center flex-shrink-0">
                      <div
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          isEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: CONTENU CVTHÈQUE (SÉLECTION PAR SECTION) */}
        {/* =================================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Projets de la CVthèque Master */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-700 text-foreground uppercase tracking-wider">
                    1. Projets & SAÉ ({portfolio.selectedProjects.length}/{projects.length})
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Cochez les projets à afficher dans le portfolio
                  </p>
                </div>
                <Link
                  href="/c-vth-que-master"
                  className="text-[11px] text-primary hover:underline font-600 flex items-center gap-1"
                >
                  <Icon name="PlusIcon" size={11} />
                  Gérer CVthèque
                </Link>
              </div>

              {/* Filter by project category */}
              <div className="flex gap-1 mb-2 text-[10px] overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'academic', label: 'SAÉ IUT' },
                  { id: 'mini', label: 'TPs' },
                  { id: 'personal', label: 'Perso' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setProjectCatFilter(f.id)}
                    className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                      projectCatFilter === f.id
                        ? 'bg-primary text-primary-foreground font-700'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredProjects.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                  Aucun projet trouvé dans cette catégorie.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {filteredProjects.map((proj) => {
                    const isSelected = portfolio.selectedProjects.includes(proj.id);
                    return (
                      <label
                        key={`proj-chk-${proj.id}`}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary/40 bg-primary/5 shadow-2xs'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProject(proj.id)}
                          className="mt-1 accent-primary rounded w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-700 text-foreground truncate">
                            {proj.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {proj.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.techStack.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-500 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Projets Personnels (Savoir-Faire) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-700 text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
                    2. Projets Personnels (Savoir-Faire) ({(portfolio.selectedPersonalProjects || []).length}/{personalProjects.length})
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Développements personnels, applications et explorations techniques
                  </p>
                </div>
                <Link
                  href="/c-vth-que-master"
                  className="text-[11px] text-primary hover:underline font-600 flex items-center gap-1"
                >
                  <Icon name="PlusIcon" size={11} />
                  Gérer CVthèque
                </Link>
              </div>

              {personalProjects.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                  Aucun projet personnel dans la CVthèque Master.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {personalProjects.map((perso) => {
                    const isSelected = (portfolio.selectedPersonalProjects || []).includes(perso.id);
                    return (
                      <label
                        key={`perso-chk-${perso.id}`}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-300 bg-purple-50/20 shadow-2xs'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePersonalProject(perso.id)}
                          className="mt-1 accent-purple-600 rounded w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-700 text-foreground truncate">
                              {perso.title}
                            </p>
                            {perso.category && (
                              <span className="px-1.5 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-700 rounded">
                                {perso.category}
                              </span>
                            )}
                          </div>
                          {perso.savoirFaire && (
                            <p className="text-[10px] text-purple-800 font-600 truncate mt-0.5">
                              ⚡ {perso.savoirFaire}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {perso.description}
                          </p>
                          {perso.techStack && perso.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {perso.techStack.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-500 rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Studio Créatif (Savoir-Être) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-700 text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    3. Studio Créatif (Savoir-Être) ({(portfolio.selectedCreativeStudio || []).length}/{creativeStudio.length})
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Productions audiovisuelles, communication d&apos;équipe et pitch
                  </p>
                </div>
                <Link
                  href="/c-vth-que-master"
                  className="text-[11px] text-primary hover:underline font-600 flex items-center gap-1"
                >
                  <Icon name="PlusIcon" size={11} />
                  Gérer CVthèque
                </Link>
              </div>

              {creativeStudio.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                  Aucune réalisation créative dans la CVthèque Master.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {creativeStudio.map((crea) => {
                    const isSelected = (portfolio.selectedCreativeStudio || []).includes(crea.id);
                    return (
                      <label
                        key={`crea-chk-${crea.id}`}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-300 bg-amber-50/20 shadow-2xs'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCreativeStudio(crea.id)}
                          className="mt-1 accent-amber-600 rounded w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-700 text-foreground truncate">
                              {crea.title}
                            </p>
                            <span className="px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-700 rounded capitalize">
                              {crea.mediaType}
                            </span>
                          </div>
                          {crea.role && (
                            <p className="text-[10px] text-[#8A7D63] font-600 truncate mt-0.5">
                              {crea.role}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {crea.description}
                          </p>
                          {crea.softSkills && crea.softSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crea.softSkills.slice(0, 3).map((ss) => (
                                <span
                                  key={ss}
                                  className="px-1.5 py-0.5 bg-amber-50/60 text-amber-900 border border-amber-200/50 text-[10px] font-500 rounded"
                                >
                                  {ss}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Compétences de la CVthèque Master */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-700 text-foreground uppercase tracking-wider">
                    4. Compétences & Outils ({portfolio.selectedSkills.length}/{skills.length})
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Alimentent la matrice technique et les jauges
                  </p>
                </div>
                <div className="flex gap-1 text-[10px]">
                  {(['all', 'hard', 'tools', 'soft'] as const).map((cat) => (
                    <button
                      key={`cat-filter-${cat}`}
                      onClick={() => setSkillCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-full capitalize transition-colors ${
                        skillCategoryFilter === cat
                          ? 'bg-primary text-primary-foreground font-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {cat === 'all' ? 'Toutes' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1.5 border border-border/60 rounded-xl bg-muted/20">
                {filteredSkills.map((skill) => {
                  const isSelected = portfolio.selectedSkills.includes(skill.id);
                  return (
                    <button
                      key={`skill-btn-${skill.id}`}
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-600 transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      {isSelected && <Icon name="CheckIcon" size={11} />}
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className={`text-[10px] opacity-75 font-mono ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                          {skill.level}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Langues & Certifications */}
            <div>
              <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-2">
                5. Langues & Certifications
              </p>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((l) => {
                    const isSelected = !portfolio.selectedLanguages || portfolio.selectedLanguages.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => toggleLanguage(l.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-600 border flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-primary/10 text-primary border-primary/40'
                            : 'bg-muted/40 text-muted-foreground border-border opacity-60'
                        }`}
                      >
                        <span>{l.flag || '🌐'}</span>
                        <span>{l.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {certifications.map((c) => {
                    const isSelected = !portfolio.selectedCertifications || portfolio.selectedCertifications.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCertification(c.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-600 border flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#C2B59C]/20 text-[#8A7D63] border-[#C2B59C]/50'
                            : 'bg-muted/40 text-muted-foreground border-border opacity-60'
                        }`}
                      >
                        <Icon name="AcademicCapIcon" size={12} />
                        <span className="truncate max-w-[180px]">{c.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: RÉGLAGES, TEXTES & COUVERTURE */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-700 text-foreground mb-1">
                {t.studio.builder.portfolioName}
              </label>
              <input
                type="text"
                value={portfolio.name}
                onChange={(e) => onUpdate({ ...portfolio, name: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary font-600"
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-foreground mb-1">
                {t.studio.builder.persona}
              </label>
              <select
                value={portfolio.persona}
                onChange={(e) => onUpdate({ ...portfolio, persona: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary font-600"
              >
                {availablePersonas.map((p) => (
                  <option key={`persona-${p}`} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-700 text-foreground mb-1">
                {t.studio.builder.customSlug}
              </label>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground font-mono-data px-3 py-2 bg-muted border border-border rounded-l-xl border-r-0">
                  portfoliogen.net/p/
                </span>
                <input
                  type="text"
                  value={portfolio.slug || ''}
                  onChange={(e) =>
                    onUpdate({
                      ...portfolio,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_/]/g, ''),
                    })
                  }
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-r-xl text-xs font-mono-data text-foreground focus:outline-none focus:border-primary font-600"
                />
              </div>
            </div>

            {/* Champs de la page de couverture et du hero */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex items-center gap-2">
                <Icon name="AcademicCapIcon" size={15} className="text-[#8A7D63]" />
                <p className="text-xs font-800 text-foreground uppercase tracking-wider">
                  Champs de la Page de Garde & Hero
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-700 text-muted-foreground mb-1">
                  Phrase d&apos;accroche / Slogan
                </label>
                <input
                  type="text"
                  value={portfolio.customIntro || ''}
                  placeholder="Ex: Concevoir la logique. Piloter le système."
                  onChange={(e) => onUpdate({ ...portfolio, customIntro: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-700 text-muted-foreground mb-1">
                    Nom de l&apos;auteur
                  </label>
                  <input
                    type="text"
                    value={portfolio.authorName || ''}
                    placeholder="Ex: KOKOU DUSSEY"
                    onChange={(e) => onUpdate({ ...portfolio, authorName: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-700 text-muted-foreground mb-1">
                    Promotion
                  </label>
                  <input
                    type="text"
                    value={portfolio.promotion || ''}
                    placeholder="Ex: PROMOTION 2025–2026"
                    onChange={(e) => onUpdate({ ...portfolio, promotion: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-700 text-muted-foreground mb-1">
                    Établissement
                  </label>
                  <input
                    type="text"
                    value={portfolio.institution || ''}
                    placeholder="Ex: IUT SÉNART-FONTAINEBLEAU"
                    onChange={(e) => onUpdate({ ...portfolio, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-700 text-muted-foreground mb-1">
                    Diplôme / Mention
                  </label>
                  <input
                    type="text"
                    value={portfolio.degree || ''}
                    placeholder="Ex: BACHELOR UNIVERSITAIRE DE TECHNOLOGIE"
                    onChange={(e) => onUpdate({ ...portfolio, degree: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: COULEURS (ARRIÈRE-PLAN & COULEUR PAR SECTION) */}
        {/* =================================================================== */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Palette & Arrière-plans
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Personnalisez la couleur de fond générale ainsi que la couleur d&apos;accent propre à chaque section.
              </p>
            </div>

            {/* Global Backgrounds Card */}
            <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-4">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="SwatchIcon" size={14} className="text-primary" />
                Arrière-plans Globaux
              </p>

              {/* 1. Page Background */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Fond de la page
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeColors.backgroundColor || '#FAF8F3'}
                      onChange={(e) => updateThemeColor('backgroundColor', e.target.value)}
                      className="w-7 h-7 rounded-lg border border-border cursor-pointer p-0.5 bg-card"
                    />
                    <input
                      type="text"
                      value={themeColors.backgroundColor || '#FAF8F3'}
                      onChange={(e) => updateThemeColor('backgroundColor', e.target.value)}
                      className="w-20 px-2 py-1 text-xs font-mono-data bg-card border border-border rounded-md text-foreground"
                    />
                  </div>
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-muted-foreground">Préréglages :</span>
                  {[
                    { name: 'Crème', hex: '#FAF8F3' },
                    { name: 'Sable', hex: '#F5EFE6' },
                    { name: 'Blanc', hex: '#FFFFFF' },
                    { name: 'Gris ardoise', hex: '#F1F5F9' },
                    { name: 'Zinc sombre', hex: '#18181B' },
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => updateThemeColor('backgroundColor', preset.hex)}
                      className={`w-5 h-5 rounded-full border shadow-2xs transition-transform hover:scale-110 ${
                        themeColors.backgroundColor === preset.hex ? 'ring-2 ring-primary ring-offset-1' : 'border-border'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={`${preset.name} (${preset.hex})`}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Card Background */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Fond des cartes & blocs
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeColors.cardBackground || '#EFEAE1'}
                      onChange={(e) => updateThemeColor('cardBackground', e.target.value)}
                      className="w-7 h-7 rounded-lg border border-border cursor-pointer p-0.5 bg-card"
                    />
                    <input
                      type="text"
                      value={themeColors.cardBackground || '#EFEAE1'}
                      onChange={(e) => updateThemeColor('cardBackground', e.target.value)}
                      className="w-20 px-2 py-1 text-xs font-mono-data bg-card border border-border rounded-md text-foreground"
                    />
                  </div>
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-muted-foreground">Préréglages :</span>
                  {[
                    { name: 'Beige crème', hex: '#EFEAE1' },
                    { name: 'Crème doux', hex: '#F0ECE1' },
                    { name: 'Blanc pur', hex: '#FFFFFF' },
                    { name: 'Gris doux', hex: '#F8F6F0' },
                    { name: 'Zinc foncé', hex: '#27272A' },
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => updateThemeColor('cardBackground', preset.hex)}
                      className={`w-5 h-5 rounded-full border shadow-2xs transition-transform hover:scale-110 ${
                        themeColors.cardBackground === preset.hex ? 'ring-2 ring-primary ring-offset-1' : 'border-border'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={`${preset.name} (${preset.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Section Accent Colors */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="SparklesIcon" size={14} className="text-primary" />
                Couleurs d&apos;Accent par Section
              </p>

              {[
                {
                  key: 'projects' as keyof SectionColors,
                  label: "Situations d'Apprentissage & Évaluation (SAÉ)",
                  defaultColor: '#1A1815',
                  icon: 'FolderIcon',
                  presets: ['#1A1815', '#1E293B', '#8A7D63', '#059669', '#9333EA', '#DC2626'],
                },
                {
                  key: 'personalProjects' as keyof SectionColors,
                  label: 'Projets Personnels (Savoir-Faire)',
                  defaultColor: '#059669',
                  icon: 'CommandLineIcon',
                  presets: ['#059669', '#10B981', '#0284C7', '#7C3AED', '#D97706', '#E11D48'],
                },
                {
                  key: 'creativeStudio' as keyof SectionColors,
                  label: 'Studio Créatif (Savoir-Être)',
                  defaultColor: '#9333EA',
                  icon: 'SparklesIcon',
                  presets: ['#9333EA', '#7C3AED', '#C026D3', '#DB2777', '#4F46E5', '#2563EB'],
                },
                {
                  key: 'hero' as keyof SectionColors,
                  label: 'Accueil (Hero & Slogan)',
                  defaultColor: '#8A7D63',
                  icon: 'SparklesIcon',
                  presets: ['#8A7D63', '#A4967A', '#1A1815', '#2563EB', '#059669', '#D97706'],
                },
                {
                  key: 'about' as keyof SectionColors,
                  label: 'À propos & Profil',
                  defaultColor: '#8A7D63',
                  icon: 'UserIcon',
                  presets: ['#8A7D63', '#A4967A', '#1A1815', '#059669', '#7C3AED', '#2563EB'],
                },
                {
                  key: 'skills' as keyof SectionColors,
                  label: 'Compétences Techniques',
                  defaultColor: '#D97706',
                  icon: 'BrainIcon',
                  presets: ['#D97706', '#F59E0B', '#059669', '#2563EB', '#9333EA', '#475569'],
                },
                {
                  key: 'tools' as keyof SectionColors,
                  label: 'Outils & Matériel Industriel',
                  defaultColor: '#475569',
                  icon: 'WrenchScrewdriverIcon',
                  presets: ['#475569', '#64748B', '#334155', '#0D9488', '#B45309', '#1E293B'],
                },
                {
                  key: 'parcours' as keyof SectionColors,
                  label: 'Parcours & Formations',
                  defaultColor: '#2563EB',
                  icon: 'GraduationCapIcon',
                  presets: ['#2563EB', '#3B82F6', '#1D4ED8', '#059669', '#9333EA', '#475569'],
                },
                {
                  key: 'languages' as keyof SectionColors,
                  label: 'Langues & Certifications',
                  defaultColor: '#0D9488',
                  icon: 'GlobeAltIcon',
                  presets: ['#0D9488', '#14B8A6', '#0284C7', '#2563EB', '#D97706', '#8A7D63'],
                },
                {
                  key: 'gallery' as keyof SectionColors,
                  label: 'Galerie Médias',
                  defaultColor: '#E11D48',
                  icon: 'ImageIcon',
                  presets: ['#E11D48', '#F43F5E', '#DB2777', '#9333EA', '#8A7D63', '#1A1815'],
                },
                {
                  key: 'contact' as keyof SectionColors,
                  label: 'Contact & Coordonnées',
                  defaultColor: '#4F46E5',
                  icon: 'EnvelopeIcon',
                  presets: ['#4F46E5', '#6366F1', '#2563EB', '#059669', '#8A7D63', '#1A1815'],
                },
              ].map((item) => {
                const currentColor = (themeColors as any)[item.key] || item.defaultColor;
                return (
                  <div
                    key={item.key}
                    className="p-3 bg-card border border-border rounded-xl space-y-2 hover:border-border/80 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: currentColor }}
                        />
                        <span className="text-xs font-bold text-foreground truncate">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => updateThemeColor(item.key, e.target.value)}
                          className="w-6 h-6 rounded-md border border-border cursor-pointer p-0.5 bg-card"
                        />
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => updateThemeColor(item.key, e.target.value)}
                          className="w-20 px-2 py-0.5 text-xs font-mono-data bg-muted border border-border rounded text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-muted-foreground">Palettes :</span>
                      {item.presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => updateThemeColor(item.key, preset)}
                          className={`w-4 h-4 rounded-full border shadow-2xs transition-transform hover:scale-110 ${
                            currentColor === preset ? 'ring-2 ring-primary ring-offset-1' : 'border-border'
                          }`}
                          style={{ backgroundColor: preset }}
                          title={preset}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: TEXTES (TOUTES LES PHRASES MODIFIABLES) */}
        {/* =================================================================== */}
        {activeTab === 'texts' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Édition Complète des Textes & Phrases
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Modifiez chaque phrase, titre, sous-titre et paragraphe individuellement avec aperçu en temps réel.
              </p>
            </div>

            {/* 1. Page de garde & Couverture */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Icon name="ShieldCheckIcon" size={14} className="text-primary" />
                  1. Page de Garde (Sas d&apos;accueil) - Tout Modifiable
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  100% Modifiable
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Département / En-tête supérieur
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.coverDepartment || ''}
                    placeholder="DÉPARTEMENT GÉNIE ÉLECTRIQUE ET INFORMATIQUE INDUSTRIELLE"
                    onChange={(e) => updateSectionText('coverDepartment', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Grand Titre Principal
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.coverMainTitle || ''}
                      placeholder="B.U.T."
                      onChange={(e) => updateSectionText('coverMainTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-black uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Diplôme complet (Sous B.U.T.)
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.coverDegree || ''}
                      placeholder="BACHELOR UNIVERSITAIRE DE TECHNOLOGIE"
                      onChange={(e) => updateSectionText('coverDegree', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary uppercase font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Sous-titre / Semestre
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.coverSubtitle || ''}
                    placeholder="Portfolio Semestre 2"
                    onChange={(e) => updateSectionText('coverSubtitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary italic"
                  />
                </div>

                {/* Bloc Auteur / Réalisé par */}
                <div className="p-3 rounded-lg bg-muted/60 border border-border/80 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Encart Auteur Central
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                        Libellé encart
                      </label>
                      <input
                        type="text"
                        value={sectionTexts.coverRealiseParLabel || ''}
                        placeholder="RÉALISÉ PAR"
                        onChange={(e) => updateSectionText('coverRealiseParLabel', e.target.value)}
                        className="w-full px-2.5 py-1 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-primary uppercase font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                        Nom de l&apos;étudiant / Auteur
                      </label>
                      <input
                        type="text"
                        value={sectionTexts.coverAuthorName || ''}
                        placeholder="KOKOU DUSSEY"
                        onChange={(e) => updateSectionText('coverAuthorName', e.target.value)}
                        className="w-full px-2.5 py-1 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-primary uppercase font-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                      Spécialité / Sous-titre auteur
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.coverHeadline || ''}
                      placeholder="Étudiant en B.U.T. GEII & Automatisme"
                      onChange={(e) => updateSectionText('coverHeadline', e.target.value)}
                      className="w-full px-2.5 py-1 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Bas de page et bouton */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Établissement / Université
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.coverInstitution || ''}
                      placeholder="IUT SÉNART-FONTAINEBLEAU"
                      onChange={(e) => updateSectionText('coverInstitution', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Promotion
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.coverPromotion || ''}
                      placeholder="PROMOTION 2025–2026"
                      onChange={(e) => updateSectionText('coverPromotion', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Mention de spécialité complémentaire (optionnelle)
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.coverSpeciality || ''}
                    placeholder="Spécialité Automatisme et Informatique Industrielle (AII)"
                    onChange={(e) => updateSectionText('coverSpeciality', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Libellé du bouton d&apos;entrée vers le portfolio
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.coverButton || ''}
                    placeholder="Accéder au portfolio"
                    onChange={(e) => updateSectionText('coverButton', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Section Accueil (Hero & Slogan) */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="SparklesIcon" size={14} className="text-primary" />
                2. Section Accueil (Hero & Slogan)
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Phrase d&apos;accroche / Slogan principal
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.heroSlogan || ''}
                    placeholder="Concevoir la logique. Piloter le système."
                    onChange={(e) => updateSectionText('heroSlogan', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary italic"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Sous-titre / Spécialité détaillée
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.heroHeadline || ''}
                    placeholder="Étudiant en B.U.T. GEII & Automatisme"
                    onChange={(e) => updateSectionText('heroHeadline', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Badge disponibilité
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.heroAvailability || ''}
                      placeholder="Recherche alternance 2026-2028"
                      onChange={(e) => updateSectionText('heroAvailability', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Bouton Télécharger CV
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.heroDownloadCv || ''}
                      placeholder="Télécharger CV"
                      onChange={(e) => updateSectionText('heroDownloadCv', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Section À propos & Projet Professionnel */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="UserIcon" size={14} className="text-primary" />
                3. Section À propos & Projet Professionnel
              </p>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Titre de la section
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.aboutTitle || ''}
                      placeholder="À propos & Projet Professionnel"
                      onChange={(e) => updateSectionText('aboutTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.aboutSubtitle || ''}
                      placeholder="Présentation, démarche d'ingénierie et recherche d'alternance"
                      onChange={(e) => updateSectionText('aboutSubtitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Titre bloc présentation
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.aboutBioTitle || ''}
                    placeholder="Présentation personnelle"
                    onChange={(e) => updateSectionText('aboutBioTitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Paragraphe de présentation personnelle
                  </label>
                  <textarea
                    rows={3}
                    value={sectionTexts.aboutBio || ''}
                    placeholder="Votre biographie complète..."
                    onChange={(e) => updateSectionText('aboutBio', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Titre bloc objectif
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.aboutObjectiveTitle || ''}
                    placeholder="Objectif professionnel ciblé"
                    onChange={(e) => updateSectionText('aboutObjectiveTitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Paragraphe objectif professionnel
                  </label>
                  <textarea
                    rows={2}
                    value={sectionTexts.aboutObjective || ''}
                    placeholder="Votre recherche d'alternance, stage ou emploi..."
                    onChange={(e) => updateSectionText('aboutObjective', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Situations d'Apprentissage & Évaluation (SAÉ) */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="FolderIcon" size={14} className="text-primary" />
                4. Situations d&apos;Apprentissage et d&apos;Évaluation (SAÉ)
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Titre de la section
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.projectsTitle || ''}
                    placeholder="Situations d'Apprentissage et d'Évaluation (SAÉ)"
                    onChange={(e) => updateSectionText('projectsTitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Sous-titre explicatif
                  </label>
                  <textarea
                    rows={2}
                    value={sectionTexts.projectsSubtitle || ''}
                    placeholder="Activités pratiques d'ingénierie, simulation et pilotage de systèmes automatisés"
                    onChange={(e) => updateSectionText('projectsSubtitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. Projets Personnels (Savoir-Faire) */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="CommandLineIcon" size={14} className="text-emerald-600" />
                5. Projets Personnels (Savoir-Faire)
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Titre de la section
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.personalProjectsTitle || ''}
                    placeholder="Projets Personnels (Savoir-Faire)"
                    onChange={(e) => updateSectionText('personalProjectsTitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Sous-titre explicatif
                  </label>
                  <textarea
                    rows={2}
                    value={sectionTexts.personalProjectsSubtitle || ''}
                    placeholder="Développements autonomes, applications web/mobiles et intégration de technologies émergentes"
                    onChange={(e) => updateSectionText('personalProjectsSubtitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 6. Studio Créatif (Savoir-Être) */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="SparklesIcon" size={14} className="text-purple-600" />
                6. Studio Créatif (Savoir-Être)
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Titre de la section
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.creativeStudioTitle || ''}
                    placeholder="Studio Créatif (Savoir-Être)"
                    onChange={(e) => updateSectionText('creativeStudioTitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-bold text-purple-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Citation d&apos;accroche / Paragraphe de vulgarisation
                  </label>
                  <textarea
                    rows={3}
                    value={sectionTexts.creativeStudioSubtitle || ''}
                    placeholder="La technique c'est bien, savoir la communiquer en équipe c'est mieux. Voici quelques réalisations audiovisuelles produites en groupe..."
                    onChange={(e) => updateSectionText('creativeStudioSubtitle', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 7. Compétences & Outils */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="BrainIcon" size={14} className="text-primary" />
                7. Compétences Techniques & Outils
              </p>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Titre section Compétences
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.skillsTitle || ''}
                      placeholder="Compétences & Outils Industriels"
                      onChange={(e) => updateSectionText('skillsTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Sous-titre Compétences
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.skillsSubtitle || ''}
                      placeholder="Groupes techniques, programmation d'automates..."
                      onChange={(e) => updateSectionText('skillsSubtitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Titre section Outils
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.toolsTitle || ''}
                      placeholder="Outils & Matériel Industriel"
                      onChange={(e) => updateSectionText('toolsTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Titre bloc Savoir-Être
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.toolsSoftTitle || ''}
                      placeholder="Savoir-Être"
                      onChange={(e) => updateSectionText('toolsSoftTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Parcours, Langues & Galerie */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="GraduationCapIcon" size={14} className="text-primary" />
                8. Parcours, Langues & Galerie
              </p>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Titre Parcours
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.parcoursTitle || ''}
                      placeholder="Parcours & Formations"
                      onChange={(e) => updateSectionText('parcoursTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Sous-titre Parcours
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.parcoursSubtitle || ''}
                      placeholder="Timeline chronologique des diplômes, études et stages"
                      onChange={(e) => updateSectionText('parcoursSubtitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Titre Langues
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.languagesTitle || ''}
                      placeholder="Langues & Certifications"
                      onChange={(e) => updateSectionText('languagesTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Titre Galerie
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.galleryTitle || ''}
                      placeholder="Galerie de Réalisations"
                      onChange={(e) => updateSectionText('galleryTitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 9. Contact & Pied de page */}
            <div className="p-4 bg-card border border-border rounded-xl space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-2">
                <Icon name="EnvelopeIcon" size={14} className="text-primary" />
                9. Contact, Boutons & Pied de page
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Grand titre d&apos;appel contact
                  </label>
                  <input
                    type="text"
                    value={sectionTexts.contactHeading || ''}
                    placeholder="Me contacter pour un stage ou une alternance"
                    onChange={(e) => updateSectionText('contactHeading', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Phrase d&apos;invitation au contact
                  </label>
                  <textarea
                    rows={2}
                    value={sectionTexts.contactDescription || ''}
                    placeholder="Disponible pour échanger sur vos projets industriels et besoins techniques."
                    onChange={(e) => updateSectionText('contactDescription', e.target.value)}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Libellé des cartes (&quot;En savoir plus&quot;)
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.learnMoreText || ''}
                      placeholder="En savoir plus →"
                      onChange={(e) => updateSectionText('learnMoreText', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Phrase du pied de page
                    </label>
                    <input
                      type="text"
                      value={sectionTexts.footerText || ''}
                      placeholder="Portfolio ciblé généré via PortfolioGen Studio..."
                      onChange={(e) => updateSectionText('footerText', e.target.value)}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: RÉGLAGES & URL PERSONNALISÉE (CONFIGURATION D'ENVOI) */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (() => {
          const activeSlug = (portfolio.slug && portfolio.slug.trim().toLowerCase().replace(/[^a-z0-9-_/]/g, '')) || portfolio.id;
          const companyQuery = portfolio.recipientCompany && portfolio.recipientCompany.trim()
            ? `?for=${encodeURIComponent(portfolio.recipientCompany.trim().replace(/\s+/g, ''))}`
            : '';
          const computedShareUrl = (() => {
            if (portfolio.customShareUrl && portfolio.customShareUrl.trim() && !portfolio.customShareUrl.includes('portfoliogen.net/p/')) {
              return portfolio.customShareUrl.trim();
            }
            return `https://portfoliogen.net/p/${activeSlug}${companyQuery}`;
          })();

          return (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Configuration de l&apos;URL Personnalisée & Partage
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configurez le lien unique à envoyer aux recruteurs, personnalisez le slug et suivez les entreprises ciblées.
                </p>
              </div>

              {/* 0. Carte Photo de Profil & Document CV */}
              <div className="p-4 bg-card border border-border rounded-xl space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Icon name="UserCircleIcon" size={15} className="text-primary" />
                    Photo de Profil & Document CV
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Synchronisé
                  </span>
                </div>

                {/* Avatar uploader */}
                <div className="p-4 rounded-xl bg-muted/60 border border-border/80 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-3 border-primary/40 bg-card flex-shrink-0 flex items-center justify-center shadow-md ring-4 ring-primary/10">
                    {(portfolio.authorAvatar || profile?.avatarUrl) ? (
                      <AppImage
                        src={portfolio.authorAvatar || profile?.avatarUrl || ''}
                        alt="Photo de profil"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Icon name="UserIcon" size={44} className="text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">
                      Photo de profil / Avatar
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      Affichée dans l&apos;en-tête, la couverture et le CV
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingAvatar(true);
                          const tid = toast.loading(`Import de "${file.name}"...`);
                          try {
                            const res = await uploadMediaFromPC(file);
                            onUpdate({ ...portfolio, authorAvatar: res.url });
                            if (profile) {
                              const updatedProf = { ...profile, avatarUrl: res.url };
                              saveUserProfileInfo(updatedProf).catch(() => {});
                              onProfileUpdate?.(updatedProf);
                            }
                            toast.success('Photo de profil mise à jour !', { id: tid });
                          } catch (err: any) {
                            toast.error(err?.message || 'Erreur d\'import', { id: tid });
                          } finally {
                            setUploadingAvatar(false);
                            if (avatarInputRef.current) avatarInputRef.current.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={uploadingAvatar}
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-2.5 py-1 bg-primary text-primary-foreground text-[11px] font-bold rounded-md hover:opacity-90 flex items-center gap-1 transition-opacity btn-press cursor-pointer"
                      >
                        {uploadingAvatar ? (
                          <Icon name="ArrowPathIcon" size={12} className="animate-spin" />
                        ) : (
                          <Icon name="ArrowUpTrayIcon" size={12} />
                        )}
                        <span>Importer depuis mon PC</span>
                      </button>

                      {(portfolio.authorAvatar || profile?.avatarUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdate({ ...portfolio, authorAvatar: '' });
                            if (profile) {
                              const updatedProf = { ...profile, avatarUrl: '' };
                              saveUserProfileInfo(updatedProf).catch(() => {});
                              onProfileUpdate?.(updatedProf);
                            }
                            toast.info('Photo de profil retirée.');
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-red-500 rounded-md transition-colors cursor-pointer"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* CV Document uploader */}
                <div className="p-3 rounded-lg bg-muted/60 border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Icon name="DocumentTextIcon" size={13} className="text-primary" />
                      Document CV (PDF)
                    </p>
                    {profile?.cvPdfUrl && (
                      <span className="text-[10px] font-bold text-emerald-600">✓ CV prêt</span>
                    )}
                  </div>

                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingCv(true);
                      const tid = toast.loading(`Import du CV "${file.name}"...`);
                      try {
                        const res = await uploadMediaFromPC(file);
                        const updatedPortfolio: StudioPortfolio = {
                          ...portfolio,
                          cvPdfUrl: res.url,
                          cvFileName: file.name,
                          cvFileSize: res.fileSize,
                        };
                        onUpdate(updatedPortfolio);

                        if (profile) {
                          const updatedProf = {
                            ...profile,
                            cvPdfUrl: res.url,
                            cvFileName: file.name,
                            cvFileSize: res.fileSize,
                          };
                          await saveUserProfileInfo(updatedProf);
                          onProfileUpdate?.(updatedProf);
                        }
                        toast.success(`CV "${file.name}" importé et lié à vos portfolios !`, { id: tid });
                      } catch (err: any) {
                        toast.error(err?.message || 'Erreur d\'import du CV', { id: tid });
                      } finally {
                        setUploadingCv(false);
                        if (cvInputRef.current) cvInputRef.current.value = '';
                      }
                    }}
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={uploadingCv}
                      onClick={() => cvInputRef.current?.click()}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors btn-press cursor-pointer"
                    >
                      {uploadingCv ? (
                        <Icon name="ArrowPathIcon" size={12} className="animate-spin" />
                      ) : (
                        <Icon name="ArrowUpTrayIcon" size={12} />
                      )}
                      <span>Importer CV depuis mon PC (PDF)</span>
                    </button>

                    {(portfolio.cvPdfUrl || profile?.cvPdfUrl) && (() => {
                      const activeCv = portfolio.cvPdfUrl || profile?.cvPdfUrl || '';
                      const activeName = portfolio.cvFileName || profile?.cvFileName || `CV_${(portfolio.authorName || profile?.fullName || 'Candidat').replace(/\s+/g, '_')}.pdf`;
                      return (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openDocumentSafe(activeCv, activeName)}
                            className="px-2.5 py-1.5 bg-muted text-foreground hover:bg-muted/80 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Visualiser le CV dans un nouvel onglet"
                          >
                            <Icon name="ArrowTopRightOnSquareIcon" size={12} />
                            Visualiser
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadDocumentSafe(activeCv, activeName)}
                            className="px-2.5 py-1.5 bg-muted text-foreground hover:bg-muted/80 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Télécharger le document CV sur votre ordinateur"
                          >
                            <Icon name="ArrowDownTrayIcon" size={12} />
                            Télécharger
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdate({ ...portfolio, cvPdfUrl: '', cvFileName: '', cvFileSize: '' });
                              if (profile) {
                                const updatedProf = { ...profile, cvPdfUrl: '', cvFileName: '', cvFileSize: '' };
                                saveUserProfileInfo(updatedProf).catch(() => {});
                                onProfileUpdate?.(updatedProf);
                              }
                              toast.info('Document CV retiré.');
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-red-500 rounded-md transition-colors cursor-pointer"
                          >
                            Supprimer
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* 1. Carte URL Personnalisée & Partage 1-Click */}
              <div className="p-4 bg-card border border-border rounded-xl space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Icon name="LinkIcon" size={14} className="text-primary" />
                    Lien Personnalisé à Envoyer
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Prêt à envoyer
                  </span>
                </div>

                {/* Slug personnalisé */}
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Identifiant d&apos;URL (Slug personnalisé)
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-border bg-muted">
                    <span className="px-2.5 py-1.5 bg-muted/80 text-muted-foreground text-xs font-mono font-medium border-r border-border flex items-center select-none">
                      portfoliogen.net/p/
                    </span>
                    <input
                      type="text"
                      value={portfolio.slug || ''}
                      placeholder="mon-portfolio-geii"
                      onChange={(e) =>
                        onUpdate({
                          ...portfolio,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_/]/g, ''),
                        })
                      }
                      className="flex-1 px-3 py-1.5 bg-background text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Lettres minuscules, chiffres et tirets uniquement.
                  </p>
                </div>

                {/* Ciblage Recruteur / Entreprise */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Entreprise ciblée (Paramètre d&apos;URL)
                    </label>
                    <input
                      type="text"
                      value={portfolio.recipientCompany || ''}
                      placeholder="ex: Schneider Electric, Alstom"
                      onChange={(e) => onUpdate({ ...portfolio, recipientCompany: e.target.value })}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Nom ou titre du recruteur
                    </label>
                    <input
                      type="text"
                      value={portfolio.recipientName || ''}
                      placeholder="ex: M. Dupont / DRH"
                      onChange={(e) => onUpdate({ ...portfolio, recipientName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Computed Live URL Box */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                      <Icon name="SparklesIcon" size={13} />
                      URL d&apos;envoi personnalisée générée
                    </span>
                    {portfolio.recipientCompany && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Pour : {portfolio.recipientCompany}
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 bg-background rounded-lg border border-border font-mono text-xs text-foreground break-all select-all font-semibold">
                    {computedShareUrl}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(computedShareUrl);
                        toast.success('Lien personnalisé copié dans le presse-papier !');
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity btn-press shadow-xs cursor-pointer min-w-[170px]"
                    >
                      <Icon name="ClipboardDocumentCheckIcon" size={14} />
                      Copier le lien personnalisé
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const tid = toast.loading('Synchronisation du lien en cours...');
                        try {
                          const portfolioToSave: StudioPortfolio = {
                            ...portfolio,
                            authorAvatar: portfolio.authorAvatar || profile?.avatarUrl || '',
                            cvPdfUrl: portfolio.cvPdfUrl || profile?.cvPdfUrl || '',
                            cvFileName: portfolio.cvFileName || profile?.cvFileName || '',
                            cvFileSize: portfolio.cvFileSize || profile?.cvFileSize || '',
                            authorName: portfolio.authorName || profile?.fullName || 'KOKOU DUSSEY',
                            profileInfo: profile || undefined,
                            cvthequeData: {
                              projects,
                              personalProjects,
                              creativeStudio,
                              skills,
                              parcours,
                              languages,
                              certifications,
                              media,
                            },
                          };
                          await saveStudioPortfolio(portfolioToSave, profile, {
                            projects,
                            personalProjects,
                            creativeStudio,
                            skills,
                            parcours,
                            languages,
                            certifications,
                            media,
                          });
                          onUpdate(portfolioToSave);
                          toast.success('Lien synchronisé ! Ouverture...', { id: tid });
                        } catch {
                          toast.dismiss(tid);
                        }
                        const testUrl = computedShareUrl.startsWith('https://portfoliogen.net')
                          ? computedShareUrl.replace('https://portfoliogen.net', '')
                          : computedShareUrl;
                        window.open(testUrl, '_blank');
                      }}
                      className="py-2 px-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5 border border-border transition-colors btn-press cursor-pointer"
                      title="Enregistrer et ouvrir dans un nouvel onglet"
                    >
                      <Icon name="ArrowTopRightOnSquareIcon" size={14} />
                      Tester le lien
                    </button>
                    {portfolio.recipientCompany && portfolio.recipientCompany.trim() && (
                      <button
                        type="button"
                        onClick={async () => {
                          const tid = toast.loading(`Enregistrement dans le CRM pour ${portfolio.recipientCompany}...`);
                          try {
                            const { createClient } = await import('@/lib/supabase/client');
                            const user = (await createClient().auth.getUser()).data.user;
                            await crmService.syncFromStudio(
                              user?.id,
                              portfolio,
                              portfolio.recipientCompany || '',
                              portfolio.persona || portfolio.name,
                              portfolio.recipientName
                            );
                            toast.success(`Candidature pour "${portfolio.recipientCompany}" synchronisée dans votre CRM !`, {
                              id: tid,
                              action: {
                                label: 'Ouvrir CRM',
                                onClick: () => window.location.href = '/crm',
                              },
                            });
                          } catch (err: any) {
                            toast.error(err.message || 'Erreur lors de l\'enregistrement dans le CRM', { id: tid });
                          }
                        }}
                        className="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors btn-press shadow-xs cursor-pointer"
                        title="Créer ou mettre à jour la candidature dans votre CRM Candidatures"
                      >
                        <Icon name="BriefcaseIcon" size={14} />
                        <span>Ajouter au CRM</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors btn-press shadow-xs cursor-pointer min-w-[130px]"
                      title="Enregistrer et synchroniser immédiatement"
                    >
                      {saving ? (
                        <Icon name="Loader2Icon" size={14} className="animate-spin" />
                      ) : (
                        <Icon name="CheckCircleIcon" size={14} />
                      )}
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>

                {/* Surcharge URL ou Domaine Custom */}
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Domaine ou URL personnalisée propre (optionnel)
                  </label>
                  <input
                    type="text"
                    value={portfolio.customShareUrl || ''}
                    placeholder="https://mon-domaine-perso.fr"
                    onChange={(e) => onUpdate({ ...portfolio, customShareUrl: e.target.value })}
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Si renseigné, cette URL écrasera l&apos;URL par défaut lors du partage.
                  </p>
                </div>
              </div>

              {/* 2. Statut et Synchronisation */}
              <div className="p-4 bg-card border border-border rounded-xl space-y-3">
                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Icon name="Cog6ToothIcon" size={14} className="text-primary" />
                  Statut & Synchronisation avec la CVthèque
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Statut de visibilité
                    </label>
                    <select
                      value={portfolio.status}
                      onChange={(e) => onUpdate({ ...portfolio, status: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="active">Actif (Lien accessible)</option>
                      <option value="draft">Brouillon (Privé)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Mode de synchronisation
                    </label>
                    <select
                      value={portfolio.syncMode}
                      onChange={(e) => onUpdate({ ...portfolio, syncMode: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="live">Live (Synchronisé en direct)</option>
                      <option value="frozen">Figé (Instantané figé)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Page de Garde (Sas d'accueil) - Raccourci Réglages */}
              <div className="p-4 bg-card border border-border rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Icon name="ShieldCheckIcon" size={14} className="text-primary" />
                    Page de Garde (Sas d&apos;accueil B.U.T.)
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledSections.cover !== false}
                      onChange={(e) =>
                        onUpdate({
                          ...portfolio,
                          enabledSections: {
                            ...enabledSections,
                            cover: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Affiche la couverture style My-Portfolify avant l&apos;entrée dans le portfolio. Pour modifier chaque phrase individuellement, rendez-vous dans l&apos;onglet <strong>Textes</strong>.
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}