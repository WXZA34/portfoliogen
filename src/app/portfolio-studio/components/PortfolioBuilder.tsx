'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import type { StudioPortfolio, StudioTemplateId, StudioPortfolioSections } from '@/lib/services/portfolioStudioService';
import { DEFAULT_STUDIO_SECTIONS } from '@/lib/services/portfolioStudioService';
import type {
  ProjectItem,
  SkillItem,
  ParcoursItem,
  PersonaItem,
  LanguageItem,
  CertificationItem,
  MediaFileItem,
  UserProfileInfo,
} from '@/lib/services/cvthequeService';
import { useLanguage } from '@/lib/LanguageContext';

interface PortfolioBuilderProps {
  portfolio: StudioPortfolio;
  onUpdate: (p: StudioPortfolio) => void;
  projects?: ProjectItem[];
  skills?: SkillItem[];
  parcours?: ParcoursItem[];
  personas?: PersonaItem[];
  languages?: LanguageItem[];
  certifications?: CertificationItem[];
  media?: MediaFileItem[];
  profile?: UserProfileInfo;
  previewVisible: boolean;
  onTogglePreview: () => void;
}

export default function PortfolioBuilder({
  portfolio,
  onUpdate,
  projects = [],
  skills = [],
  parcours = [],
  personas = [],
  languages = [],
  certifications = [],
  media = [],
  previewVisible,
  onTogglePreview,
}: PortfolioBuilderProps) {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'template' | 'sections' | 'content' | 'settings'>('sections');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<'all' | 'hard' | 'soft' | 'tools'>('all');
  const [projectCatFilter, setProjectCatFilter] = useState<string>('all');
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

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`"${portfolio.name}" enregistré ✓`);
    }, 600);
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
    { key: 'projects', title: 'Mes Réalisations & SAÉ', subtitle: 'Projets académiques IUT, TPs et développements', icon: 'FolderIcon' },
    { key: 'skills', title: 'Compétences Techniques', subtitle: 'Groupes d\'expertise et jauges de niveau %', icon: 'BrainIcon' },
    { key: 'tools', title: 'Outils & Matériel Industriel', subtitle: 'Logiciels CAO, automates et équipements', icon: 'WrenchScrewdriverIcon' },
    { key: 'parcours', title: 'Parcours & Formations', subtitle: 'Timeline chronologique des diplômes et stages', icon: 'GraduationCapIcon' },
    { key: 'languages', title: 'Langues & Certifications', subtitle: 'Habilitations électriques et niveaux linguistiques', icon: 'GlobeAltIcon' },
    { key: 'gallery', title: 'Galerie Médias', subtitle: 'Photographies de montages et réalisations', icon: 'ImageIcon' },
    { key: 'contact', title: 'Coordonnées & Pied de page', subtitle: 'Email, téléphone, LinkedIn, GitHub et CV', icon: 'EnvelopeIcon' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <p className="text-sm font-700 text-foreground truncate max-w-[200px]">
            {portfolio.name}
          </p>
          <p className="text-xs text-muted-foreground font-mono-data truncate max-w-[180px]">
            portfoliogen.io/{portfolio.slug}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePreview}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-600 hover:text-foreground transition-all"
          >
            <Icon name={previewVisible ? 'EyeOffIcon' : 'EyeIcon'} size={13} />
            {previewVisible ? t.studio.builder.togglePreview : t.studio.builder.showPreview}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 disabled:opacity-60 transition-all btn-press shadow-xs"
          >
            {saving ? (
              <Icon name="Loader2Icon" size={13} className="animate-spin" />
            ) : (
              <Icon name="SaveIcon" size={13} />
            )}
            {saving ? t.common.loading : t.studio.builder.save}
          </button>
        </div>
      </div>

      {/* 4 Tabs: Modèle | Sections | Contenu | Réglages */}
      <div className="flex border-b border-border text-xs font-600">
        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 py-2.5 text-center transition-all ${
            activeTab === 'template'
              ? 'border-b-2 border-primary text-primary font-700'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Modèle
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-2.5 text-center transition-all ${
            activeTab === 'sections'
              ? 'border-b-2 border-primary text-primary font-700'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sections
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2.5 text-center transition-all ${
            activeTab === 'content'
              ? 'border-b-2 border-primary text-primary font-700'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Contenu
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 text-center transition-all ${
            activeTab === 'settings'
              ? 'border-b-2 border-primary text-primary font-700'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Réglages
        </button>
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
                    onClick={() => onUpdate({ ...portfolio, template: tpl.id })}
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

            {/* Compétences de la CVthèque Master */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-700 text-foreground uppercase tracking-wider">
                    2. Compétences & Outils ({portfolio.selectedSkills.length}/{skills.length})
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
                3. Langues & Certifications
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
                  portfoliogen.io/
                </span>
                <input
                  type="text"
                  value={portfolio.slug}
                  onChange={(e) => onUpdate({ ...portfolio, slug: e.target.value })}
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
      </div>
    </div>
  );
}