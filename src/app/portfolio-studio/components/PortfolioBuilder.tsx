'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import type { Portfolio } from './PortfolioStudioContent';
import { useLanguage } from '@/lib/LanguageContext';

const allProjects = [
  { id: 'proj-001', title: 'NeuralCommerce Platform', tags: ['React', 'Python', 'IA'] },
  { id: 'proj-002', title: 'DistributedDB Orchestrator', tags: ['Go', 'Kubernetes'] },
  { id: 'proj-003', title: 'RealTime Collaboration SDK', tags: ['TypeScript', 'WebSocket'] },
  { id: 'proj-004', title: 'Predictive DevOps Monitor', tags: ['Python', 'ML'] },
  { id: 'proj-005', title: 'Open Source CLI Framework', tags: ['TypeScript'] },
  { id: 'proj-006', title: 'FinTech Compliance Engine', tags: ['Java', 'Kafka'] },
];

const allSkillGroups = [
  { id: 'sk-001', name: 'TypeScript / JavaScript', category: 'Hard' },
  { id: 'sk-002', name: 'React / Next.js', category: 'Hard' },
  { id: 'sk-003', name: 'Node.js', category: 'Hard' },
  { id: 'sk-007', name: 'System Design', category: 'Hard' },
  { id: 'sk-008', name: 'Machine Learning', category: 'Hard' },
  { id: 'sk-011', name: 'Leadership Technique', category: 'Soft' },
  { id: 'sk-016', name: 'Collaboration à distance', category: 'Soft' },
];

interface PortfolioBuilderProps {
  portfolio: Portfolio;
  onUpdate: (p: Portfolio) => void;
  previewVisible: boolean;
  onTogglePreview: () => void;
}

export default function PortfolioBuilder({ portfolio, onUpdate, previewVisible, onTogglePreview }: PortfolioBuilderProps) {
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<'template' | 'content' | 'settings'>('template');
  const { t } = useLanguage();

  const templates = [
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

  const personas = [
    'Recruteur Tech', 'Startup IA', 'Fondateur Startup', 'Communauté OSS',
    'PME Startup', 'Agence Créative', 'DRH Grand Groupe', 'Directeur Artistique',
    'Rédacteur en Chef', 'Manager Aéronautique',
  ];

  const sectionLabels: Record<string, string> = {
    template: t.studio.templates.title,
    content: t.studio.builder.selectProjects,
    settings: t.studio.builder.portfolioName,
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`"${portfolio.name}" ${t.common.save.toLowerCase()} ✓`);
    }, 900);
  };

  const toggleProject = (projId: string) => {
    const current = portfolio.selectedProjects;
    const updated = current.includes(projId)
      ? current.filter((id) => id !== projId)
      : [...current, projId];
    onUpdate({ ...portfolio, selectedProjects: updated });
  };

  const toggleSkill = (skillId: string) => {
    const current = portfolio.selectedSkills;
    const updated = current.includes(skillId)
      ? current.filter((id) => id !== skillId)
      : [...current, skillId];
    onUpdate({ ...portfolio, selectedSkills: updated });
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <p className="text-sm font-700 text-foreground">{portfolio.name}</p>
          <p className="text-xs text-muted-foreground font-mono-data">portfoliogen.io/{portfolio.slug}</p>
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
            className={`flex-1 py-2.5 text-xs font-600 transition-all ${
              section === s ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'template' ? t.studio.templates.title : s === 'content' ? 'Contenu' : 'Réglages'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Template Selection */}
        {section === 'template' && (
          <div className="space-y-4">
            <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">{t.studio.templates.title}</p>
            <div className="space-y-3">
              {templates.map((tpl) => (
                <button
                  key={`tpl-${tpl.id}`}
                  onClick={() => onUpdate({ ...portfolio, template: tpl.id as Portfolio['template'] })}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all duration-150 text-left ${
                    portfolio.template === tpl.id ? 'template-card-active' : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className={`w-16 h-12 rounded-lg ${tpl.preview} border ${tpl.accent} flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-700 text-foreground">{tpl.label}</p>
                    <p className="text-xs text-muted-foreground">{tpl.description}</p>
                  </div>
                  {portfolio.template === tpl.id && (
                    <Icon name="CheckCircleIcon" size={16} className="text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>

            {/* Sync Mode */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-3">{t.studio.syncMode.title}</p>
              <div className="grid grid-cols-2 gap-3">
                {(['live', 'frozen'] as const).map((mode) => (
                  <button
                    key={`sync-${mode}`}
                    onClick={() => onUpdate({ ...portfolio, syncMode: mode })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      portfolio.syncMode === mode ? 'border-primary bg-secondary/50' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <p className="text-sm font-700 text-foreground mb-1">
                      {mode === 'live' ? `⚡ ${t.studio.syncMode.live}` : `❄ ${t.studio.syncMode.frozen}`}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {mode === 'live' ? t.studio.syncMode.liveDesc : t.studio.syncMode.frozenDesc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Selection */}
        {section === 'content' && (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-3">{t.studio.builder.selectProjects}</p>
              <div className="space-y-2">
                {allProjects.map((proj) => {
                  const isSelected = portfolio.selectedProjects.includes(proj.id);
                  return (
                    <label
                      key={`proj-check-${proj.id}`}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? 'border-primary/30 bg-secondary/30' : 'border-border hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProject(proj.id)}
                        className="mt-0.5 accent-primary"
                      />
                      <div>
                        <p className="text-xs font-600 text-foreground">{proj.title}</p>
                        <div className="flex gap-1 mt-1">
                          {proj.tags.map((tag) => (
                            <span key={`proj-tag-check-${proj.id}-${tag}`} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-3">{t.studio.builder.selectSkills}</p>
              <div className="flex flex-wrap gap-2">
                {allSkillGroups.map((skill) => {
                  const isSelected = portfolio.selectedSkills.includes(skill.id);
                  return (
                    <button
                      key={`skill-chip-${skill.id}`}
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-600 transition-all border ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-muted-foreground border-border hover:border-primary/30'
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {section === 'settings' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-700 text-foreground mb-1.5">{t.studio.builder.portfolioName}</label>
              <input
                type="text"
                defaultValue={portfolio.name}
                onChange={(e) => onUpdate({ ...portfolio, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-foreground mb-1.5">{t.studio.builder.persona}</label>
              <select
                defaultValue={portfolio.persona}
                onChange={(e) => onUpdate({ ...portfolio, persona: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-all"
              >
                {personas.map((p) => (
                  <option key={`persona-${p}`} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-700 text-foreground mb-1.5">{t.studio.builder.customSlug}</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono-data px-3 py-2.5 bg-muted border border-border rounded-l-xl border-r-0">
                  portfoliogen.io/
                </span>
                <input
                  type="text"
                  defaultValue={portfolio.slug}
                  className="flex-1 px-3 py-2.5 bg-muted border border-border rounded-r-xl text-sm font-mono-data text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 disabled:opacity-60 transition-all btn-press"
              >
                <Icon name="SaveIcon" size={15} />
                {t.studio.builder.save}
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-positive/10 text-positive border border-positive/20 rounded-xl text-sm font-600 hover:opacity-90 transition-all btn-press">
                <Icon name="GlobeIcon" size={15} />
                {t.studio.builder.publish}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}