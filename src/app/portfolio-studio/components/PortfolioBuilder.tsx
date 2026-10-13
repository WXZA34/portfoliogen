'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import type { StudioPortfolio, StudioTemplateId } from '@/lib/services/portfolioStudioService';
import type { ProjectItem, SkillItem, ParcoursItem, PersonaItem } from '@/lib/services/cvthequeService';
import { useLanguage } from '@/lib/LanguageContext';

interface PortfolioBuilderProps {
  portfolio: StudioPortfolio;
  onUpdate: (p: StudioPortfolio) => void;
  projects?: ProjectItem[];
  skills?: SkillItem[];
  parcours?: ParcoursItem[];
  personas?: PersonaItem[];
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
  previewVisible,
  onTogglePreview,
}: PortfolioBuilderProps) {
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<'template' | 'content' | 'settings'>('template');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<'all' | 'hard' | 'soft' | 'tools'>('all');
  const { t } = useLanguage();

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
      description: 'Template académique & industriel avec sas d\'accueil, SAÉ et compétences dynamiques issues de la CVthèque',
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
      toast.success(`"${portfolio.name}" enregistré avec succès ✓`);
    }, 700);
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

  const selectAllProjects = () => {
    onUpdate({ ...portfolio, selectedProjects: projects.map((p) => p.id) });
  };

  const deselectAllProjects = () => {
    onUpdate({ ...portfolio, selectedProjects: [] });
  };

  const filteredSkills = skills.filter((s) => {
    if (skillCategoryFilter === 'all') return true;
    return s.category === skillCategoryFilter;
  });

  return (
    <div className="bg-card border border-border rounded-xl shadow-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <p className="text-sm font-700 text-foreground">{portfolio.name}</p>
          <p className="text-xs text-muted-foreground font-mono-data truncate max-w-[200px]">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 disabled:opacity-60 transition-all btn-press"
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

      {/* Section Tabs */}
      <div className="flex border-b border-border">
        {(['template', 'content', 'settings'] as const).map((s) => (
          <button
            key={`builder-tab-${s}`}
            onClick={() => setSection(s)}
            className={`flex-1 py-2.5 text-xs font-600 transition-all flex items-center justify-center gap-1.5 ${
              section === s
                ? 'border-b-2 border-primary text-primary font-700'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'template' && <Icon name="SwatchIcon" size={13} />}
            {s === 'content' && <Icon name="LayersIcon" size={13} />}
            {s === 'settings' && <Icon name="AdjustmentsHorizontalIcon" size={13} />}
            {s === 'template'
              ? t.studio.templates.title
              : s === 'content'
              ? `Contenu CVthèque (${portfolio.selectedProjects.length + portfolio.selectedSkills.length})`
              : 'Réglages & Couverture'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: Template Selection */}
        {section === 'template' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
                Templates Studio Disponibles
              </p>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {templates.length} modèles
              </span>
            </div>

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

        {/* TAB 2: Dynamic Content Selection from CVthèque Master */}
        {section === 'content' && (
          <div className="space-y-6">
            {/* CVthèque sync notice banner */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5">
              <Icon name="InformationCircleIcon" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <span className="font-700 text-foreground block">
                  Alimentation directe depuis la CVthèque Master
                </span>
                Cochez ci-dessous les éléments que vous souhaitez injecter dans les emplacements réservés de votre template.
              </div>
            </div>

            {/* Section A: Projets de la CVthèque Master */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <p className="text-xs font-700 text-foreground uppercase tracking-wider">
                    1. Projets & SAÉ ({portfolio.selectedProjects.length}/{projects.length})
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Emplacements dédiés aux fiches réalisations
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    onClick={selectAllProjects}
                    className="text-primary hover:underline font-600"
                  >
                    Tout cocher
                  </button>
                  <span className="text-muted-foreground">·</span>
                  <button
                    onClick={deselectAllProjects}
                    className="text-muted-foreground hover:underline"
                  >
                    Vider
                  </button>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Aucun projet dans votre CVthèque Master.
                  </p>
                  <Link
                    href="/c-vth-que-master"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-600 hover:opacity-90 transition-all"
                  >
                    <Icon name="PlusIcon" size={12} />
                    Ajouter un projet dans la CVthèque
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {projects.map((proj) => {
                    const isSelected = portfolio.selectedProjects.includes(proj.id);
                    return (
                      <label
                        key={`proj-check-${proj.id}`}
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
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-700 text-foreground truncate">
                              {proj.title}
                            </p>
                            {proj.year && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {proj.year}
                              </span>
                            )}
                          </div>
                          {proj.role && (
                            <p className="text-[11px] text-muted-foreground">
                              {proj.role} {proj.company && `· ${proj.company}`}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {proj.techStack.slice(0, 4).map((tech) => (
                              <span
                                key={`proj-tag-${proj.id}-${tech}`}
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

            {/* Section B: Compétences & Outils de la CVthèque Master */}
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

                {/* Filter tags */}
                <div className="flex gap-1 text-[10px]">
                  {(['all', 'hard', 'tools', 'soft'] as const).map((cat) => (
                    <button
                      key={`cat-filter-${cat}`}
                      onClick={() => setSkillCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-full capitalize transition-colors ${
                        skillCategoryFilter === cat
                          ? 'bg-primary text-primary-foreground font-700'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {cat === 'all' ? 'Toutes' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {skills.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Aucune compétence enregistrée dans votre CVthèque Master.
                  </p>
                  <Link
                    href="/c-vth-que-master"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-600 hover:opacity-90 transition-all"
                  >
                    <Icon name="PlusIcon" size={12} />
                    Ajouter des compétences
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-1 border border-border/60 rounded-xl bg-muted/20">
                  {filteredSkills.map((skill) => {
                    const isSelected = portfolio.selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={`skill-chip-${skill.id}`}
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-600 transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                            : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
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
              )}
            </div>

            {/* Section C: Parcours / Formations */}
            <div>
              <p className="text-xs font-700 text-foreground uppercase tracking-wider mb-1">
                3. Parcours & Formations ({parcours.length})
              </p>
              <p className="text-[11px] text-muted-foreground mb-2">
                Injecté automatiquement dans la timeline du portfolio
              </p>
              <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border">
                {parcours.length === 0 ? (
                  <p className="italic">Aucune expérience enregistrée dans la CVthèque.</p>
                ) : (
                  parcours.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-0.5">
                      <span className="font-600 text-foreground truncate max-w-[200px]">
                        {item.title} ({item.organization})
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.period}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Settings & Splash Screen Metadata */}
        {section === 'settings' && (
          <div className="space-y-5">
            {/* General Settings */}
            <div>
              <label className="block text-xs font-700 text-foreground mb-1.5">
                {t.studio.builder.portfolioName}
              </label>
              <input
                type="text"
                value={portfolio.name}
                onChange={(e) => onUpdate({ ...portfolio, name: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-600"
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-foreground mb-1.5">
                {t.studio.builder.persona}
              </label>
              <select
                value={portfolio.persona}
                onChange={(e) => onUpdate({ ...portfolio, persona: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all font-600"
              >
                {availablePersonas.map((p) => (
                  <option key={`persona-${p}`} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-700 text-foreground mb-1.5">
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
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-r-xl text-xs font-mono-data text-foreground focus:outline-none focus:border-primary transition-all font-600"
                />
              </div>
            </div>

            {/* Extra Metadata Section for IndustrialGEII / Portfolify Style */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex items-center gap-2">
                <Icon name="AcademicCapIcon" size={15} className="text-[#8A7D63]" />
                <p className="text-xs font-800 text-foreground uppercase tracking-wider">
                  Champs du Sas d&apos;accueil (Couverture & Intro)
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
                  className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all italic"
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
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all font-bold"
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
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all"
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
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all"
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
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-700 hover:opacity-90 disabled:opacity-60 transition-all btn-press shadow-xs"
              >
                <Icon name="SaveIcon" size={14} />
                {t.studio.builder.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}