'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  SkillItem,
  fetchUserSkills,
  saveSkill,
  deleteSkill,
} from '@/lib/services/cvthequeService';
import SkillEditModal from './SkillEditModal';
import { toast } from 'sonner';

interface SkillsMatrixProps {
  onCountChange?: (count: number) => void;
}

type SkillCategoryFilter = 'all' | 'hard' | 'soft' | 'tools';

const categoryLabels: Record<
  SkillCategoryFilter,
  { label: string; color: string; bg: string; border: string }
> = {
  all: { label: 'Toutes les compétences', color: 'text-foreground', bg: 'bg-primary', border: 'border-primary/20' },
  hard: { label: 'Hard Skills (Tech)', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/20' },
  soft: { label: 'Soft Skills (Humain)', color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500/20' },
  tools: { label: 'Outils & Plateformes', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500/20' },
};

function getLevelLabel(level: number) {
  if (level >= 90) return 'Expert';
  if (level >= 75) return 'Avancé';
  if (level >= 60) return 'Intermédiaire';
  return 'Notions';
}

export default function SkillsMatrix({ onCountChange }: SkillsMatrixProps) {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<SkillCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await fetchUserSkills();
      setSkills(data);
      if (onCountChange) onCountChange(data.length);
    } catch (err) {
      console.error(err);
      toast.error('Impossible de charger vos compétences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (skill: SkillItem) => {
    setEditingSkill(skill);
    setModalOpen(true);
  };

  const handleDelete = async (skill: SkillItem) => {
    if (!confirm(`Supprimer la compétence "${skill.name}" de votre CVthèque Master ?`)) {
      return;
    }

    try {
      setDeletingId(skill.id);
      await deleteSkill(skill.id);
      const updated = skills.filter((s) => s.id !== skill.id);
      setSkills(updated);
      if (onCountChange) onCountChange(updated.length);
      toast.success(`Compétence "${skill.name}" supprimée.`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (skill: SkillItem) => {
    try {
      const updatedItem: SkillItem = {
        ...skill,
        isFeatured: !skill.isFeatured,
      };
      setSkills((prev) => prev.map((s) => (s.id === skill.id ? updatedItem : s)));

      await saveSkill(
        {
          name: updatedItem.name,
          category: updatedItem.category,
          level: updatedItem.level,
          years: updatedItem.years,
          isFeatured: updatedItem.isFeatured,
        },
        skill.id
      );

      toast.success(
        updatedItem.isFeatured
          ? `"${skill.name}" ajoutée aux compétences en vedette ⭐`
          : `"${skill.name}" retirée des vedettes`
      );
    } catch (err) {
      console.error(err);
      toast.error('Impossible de modifier le statut vedette');
    }
  };

  const handleSkillSaved = (saved: SkillItem) => {
    setSkills((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      const next = exists
        ? prev.map((s) => (s.id === saved.id ? saved : s))
        : [saved, ...prev];
      if (onCountChange) onCountChange(next.length);
      return next;
    });
  };

  // Counts per category
  const hardCount = skills.filter((s) => s.category === 'hard').length;
  const softCount = skills.filter((s) => s.category === 'soft').length;
  const toolsCount = skills.filter((s) => s.category === 'tools').length;
  const featuredCount = skills.filter((s) => s.isFeatured).length;

  // Filtered skills
  const filtered = skills.filter((s) => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (onlyFeatured && !s.isFeatured) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Toutes ({skills.length})
            </button>
            <button
              onClick={() => setActiveCategory('hard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                activeCategory === 'hard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hard ({hardCount})
            </button>
            <button
              onClick={() => setActiveCategory('soft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                activeCategory === 'soft'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Soft ({softCount})
            </button>
            <button
              onClick={() => setActiveCategory('tools')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                activeCategory === 'tools'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Outils ({toolsCount})
            </button>
          </div>

          {/* Featured toggle button */}
          <button
            onClick={() => setOnlyFeatured(!onlyFeatured)}
            className={`px-3 py-1.5 rounded-xl text-xs font-600 border flex items-center gap-1.5 transition-all ${
              onlyFeatured
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-700'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon
              name="StarIcon"
              variant={onlyFeatured ? 'solid' : 'outline'}
              size={13}
              className={onlyFeatured ? 'text-amber-500' : 'text-muted-foreground'}
            />
            En vedette ({featuredCount})
          </button>

          {/* Search Bar */}
          <div className="relative min-w-[180px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer une compétence..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div className="absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none">
              <Icon name="MagnifyingGlassIcon" size={13} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Add Skill Button */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press shadow-sm"
        >
          <Icon name="PlusIcon" size={16} />
          Ajouter une compétence
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 6, 7].map((i) => (
            <div
              key={`skel-skill-${i}`}
              className="bg-card border border-border rounded-xl p-4 h-28 animate-pulse flex flex-col justify-between"
            >
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-2 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed border-border rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Icon name="BrainIcon" size={28} />
          </div>
          <h3 className="text-base font-700 text-foreground mb-1">
            {searchQuery || onlyFeatured
              ? 'Aucune compétence trouvée avec ces filtres'
              : 'Aucune compétence dans cette catégorie'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
            {searchQuery || onlyFeatured
              ? 'Essayez de réinitialiser la recherche ou le filtre de favoris.'
              : 'Enrichissez votre CVthèque Master en renseignant votre niveau et vos années d\'expérience.'}
          </p>
          {searchQuery || onlyFeatured ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setOnlyFeatured(false);
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-600 rounded-xl hover:bg-secondary/80"
            >
              Réinitialiser les filtres
            </button>
          ) : (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-600 hover:opacity-90"
            >
              <Icon name="PlusIcon" size={14} />
              Ajouter ma première compétence
            </button>
          )}
        </div>
      ) : (
        /* Skills Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filtered.map((skill) => {
            const catStyle = categoryLabels[skill.category] || categoryLabels.hard;

            return (
              <div
                key={skill.id}
                className="bg-card border border-border rounded-xl p-4 shadow-card group hover:border-primary/40 hover:shadow-md transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-700 text-foreground leading-tight">
                          {skill.name}
                        </p>
                        {skill.isFeatured && (
                          <span
                            className="text-amber-500 text-xs"
                            title="Compétence en vedette"
                          >
                            ⭐
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{skill.years} an{skill.years > 1 ? 's' : ''} d&apos;exp.</span>
                        <span>·</span>
                        <span className={`font-600 ${catStyle.color}`}>
                          {getLevelLabel(skill.level)}
                        </span>
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleFeatured(skill)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors"
                        title={
                          skill.isFeatured
                            ? 'Retirer des favoris'
                            : 'Marquer comme compétence clé'
                        }
                      >
                        <Icon
                          name="StarIcon"
                          variant={skill.isFeatured ? 'solid' : 'outline'}
                          size={14}
                          className={skill.isFeatured ? 'text-amber-500' : ''}
                        />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Modifier cette compétence"
                      >
                        <Icon name="PencilIcon" size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill)}
                        disabled={deletingId === skill.id}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Supprimer cette compétence"
                      >
                        {deletingId === skill.id ? (
                          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Icon name="TrashIcon" size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] mb-1 font-medium text-muted-foreground">
                    <span className="capitalize text-[10px] uppercase tracking-wider font-600">
                      {skill.category === 'hard'
                        ? 'Hard Skill'
                        : skill.category === 'soft'
                        ? 'Soft Skill'
                        : 'Outil'}
                    </span>
                    <span className="text-xs font-800 text-foreground tabular-nums">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${catStyle.bg} transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      <SkillEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialSkill={editingSkill}
        defaultCategory={activeCategory === 'all' ? 'hard' : activeCategory}
        onSaved={handleSkillSaved}
      />
    </div>
  );
}