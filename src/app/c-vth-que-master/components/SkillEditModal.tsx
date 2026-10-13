'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Modal from '@/components/ui/Modal';
import { SkillItem, saveSkill } from '@/lib/services/cvthequeService';
import { toast } from 'sonner';

interface SkillEditModalProps {
  open: boolean;
  onClose: () => void;
  initialSkill?: SkillItem | null;
  defaultCategory?: 'hard' | 'soft' | 'tools';
  onSaved: (savedSkill: SkillItem) => void;
}

const CATEGORY_SUGGESTIONS: Record<'hard' | 'soft' | 'tools', string[]> = {
  hard: [
    'TypeScript',
    'React / Next.js',
    'Node.js',
    'Python',
    'Golang',
    'Rust',
    'PostgreSQL',
    'GraphQL',
    'Docker',
    'Kubernetes',
    'TailwindCSS',
    'System Design',
    'Machine Learning',
  ],
  soft: [
    'Leadership Technique',
    'Communication Transverse',
    'Mentoring & Code Review',
    'Gestion du Temps & Priorités',
    'Résolution de Problèmes Complexes',
    'Méthodologie Agile / Scrum',
    'Sens Produit & UX',
    'Travail en Équipe Distribuée',
  ],
  tools: [
    'VS Code',
    'GitHub / GitLab CI',
    'AWS (Cloud)',
    'Google Cloud (GCP)',
    'Terraform',
    'Figma',
    'Postman',
    'Datadog',
    'Linear / Jira',
    'Notion',
  ],
};

function getLevelInfo(level: number) {
  if (level >= 90) {
    return { label: 'Expert', desc: 'Maîtrise totale, capacité à concevoir et mentorer', color: 'text-emerald-500' };
  }
  if (level >= 75) {
    return { label: 'Avancé', desc: 'Très autonome sur les projets et systèmes complexes', color: 'text-primary' };
  }
  if (level >= 60) {
    return { label: 'Intermédiaire', desc: 'Bonne pratique courante et aisance technique', color: 'text-amber-500' };
  }
  return { label: 'Débutant / Notions', desc: 'Compréhension des principes fondamentaux', color: 'text-muted-foreground' };
}

export default function SkillEditModal({
  open,
  onClose,
  initialSkill,
  defaultCategory = 'hard',
  onSaved,
}: SkillEditModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'hard' | 'soft' | 'tools'>(defaultCategory);
  const [level, setLevel] = useState<number>(85);
  const [years, setYears] = useState<number>(3);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialSkill) {
      setName(initialSkill.name || '');
      setCategory(initialSkill.category || defaultCategory);
      setLevel(initialSkill.level ?? 80);
      setYears(initialSkill.years ?? 3);
      setIsFeatured(!!initialSkill.isFeatured);
    } else {
      setName('');
      setCategory(defaultCategory);
      setLevel(85);
      setYears(3);
      setIsFeatured(false);
    }
  }, [initialSkill, defaultCategory, open]);

  const levelInfo = getLevelInfo(level);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Veuillez renseigner le nom de la compétence.');
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<SkillItem, 'id' | 'createdAt'> = {
        name: name.trim(),
        category,
        level,
        years: Math.max(0, years),
        isFeatured,
      };

      const saved = await saveSkill(payload, initialSkill?.id);
      toast.success(
        initialSkill
          ? `Compétence "${saved.name}" mise à jour !`
          : `Compétence "${saved.name}" ajoutée à votre CVthèque Master !`
      );
      onSaved(saved);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement de la compétence.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialSkill ? 'Modifier la compétence' : 'Nouvelle compétence Master'}
      subtitle="Les compétences enregistrées dans la CVthèque Master alimentent vos personas et radars de compétences."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Catégorie */}
        <div className="space-y-1.5">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Type de compétence
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hard', label: 'Hard Skills', icon: 'CodeBracketIcon' },
              { id: 'soft', label: 'Soft Skills', icon: 'UserGroupIcon' },
              { id: 'tools', label: 'Outils & Plateformes', icon: 'WrenchScrewdriverIcon' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as any)}
                className={`py-2 px-2.5 rounded-xl text-xs font-600 transition-all border text-center ${
                  category === cat.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Nom de la compétence */}
        <div className="space-y-1.5">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Nom de la compétence <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: TypeScript, React, Leadership, Docker..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
            autoFocus
          />

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            <span className="text-[11px] text-muted-foreground font-500 mr-1 self-center">
              Idées :
            </span>
            {CATEGORY_SUGGESTIONS[category]
              .filter((s) => s.toLowerCase() !== name.toLowerCase())
              .slice(0, 5)
              .map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setName(sug)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  + {sug}
                </button>
              ))}
          </div>
        </div>

        {/* Row 3: Niveau de maîtrise (Slider) */}
        <div className="space-y-2 bg-muted/40 p-3.5 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Niveau de maîtrise
            </label>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-700 ${levelInfo.color}`}>
                {levelInfo.label}
              </span>
              <span className="text-sm font-800 text-foreground tabular-nums">
                {level}%
              </span>
            </div>
          </div>

          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <p className="text-[11px] text-muted-foreground italic leading-tight">
            {levelInfo.desc}
          </p>
        </div>

        {/* Row 4: Années d'expérience & Favori */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Années d&apos;expérience
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setYears(Math.max(0, years - 1))}
                className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center font-700 text-sm"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                max={40}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-center rounded-xl border border-border bg-background text-sm font-700 text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setYears(years + 1)}
                className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center font-700 text-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Mise en avant
            </label>
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-600 transition-all ${
                isFeatured
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-700'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                name="StarIcon"
                variant={isFeatured ? 'solid' : 'outline'}
                size={16}
                className={isFeatured ? 'text-amber-500' : 'text-muted-foreground'}
              />
              {isFeatured ? 'En vedette ⭐' : 'Standard'}
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-600 hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:opacity-90 shadow-sm transition-all flex items-center gap-2 btn-press"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Icon name="CheckIcon" size={16} />
                {initialSkill ? 'Mettre à jour' : 'Ajouter'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
