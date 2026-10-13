'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  ParcoursItem,
  fetchUserParcours,
  deleteParcours,
} from '@/lib/services/cvthequeService';
import ParcoursEditModal from './ParcoursEditModal';
import { toast } from 'sonner';

interface ParcoursTimelineProps {
  onCountChange?: (count: number) => void;
}

export default function ParcoursTimeline({ onCountChange }: ParcoursTimelineProps) {
  const [parcours, setParcours] = useState<ParcoursItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'experience' | 'formation'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ParcoursItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadParcours = async () => {
    try {
      setLoading(true);
      const data = await fetchUserParcours();
      setParcours(data);
      if (data.length > 0) {
        setExpandedId(data[0].id);
      }
      if (onCountChange) onCountChange(data.length);
    } catch (err) {
      console.error(err);
      toast.error('Impossible de charger votre parcours.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParcours();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ParcoursItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: ParcoursItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Supprimer l'étape "${item.title}" (${item.organization}) de votre CVthèque Master ?`)) {
      return;
    }

    try {
      setDeletingId(item.id);
      await deleteParcours(item.id);
      const updated = parcours.filter((p) => p.id !== item.id);
      setParcours(updated);
      if (onCountChange) onCountChange(updated.length);
      if (expandedId === item.id) setExpandedId(null);
      toast.success(`Étape "${item.title}" supprimée.`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (saved: ParcoursItem) => {
    setParcours((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
      if (onCountChange) onCountChange(next.length);
      return next;
    });
    setExpandedId(saved.id);
  };

  const expCount = parcours.filter((p) => p.type === 'experience').length;
  const formCount = parcours.filter((p) => p.type === 'formation').length;

  const filtered = parcours.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.organization.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.tech && item.tech.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Type */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                filterType === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tout ({parcours.length})
            </button>
            <button
              onClick={() => setFilterType('experience')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all flex items-center gap-1.5 ${
                filterType === 'experience'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-primary-foreground inline-block" />
              Expériences ({expCount})
            </button>
            <button
              onClick={() => setFilterType('formation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all flex items-center gap-1.5 ${
                filterType === 'formation'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              Formations ({formCount})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[180px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une étape..."
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

        {/* Add Entry Button */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press shadow-sm"
        >
          <Icon name="PlusIcon" size={16} />
          Ajouter une étape
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4 pl-12 relative animate-pulse">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />
          {[1, 2, 3].map((i) => (
            <div key={`skel-p-${i}`} className="bg-card border border-border rounded-xl p-4 h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed border-border rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Icon name="GraduationCapIcon" size={28} />
          </div>
          <h3 className="text-base font-700 text-foreground mb-1">
            {searchQuery
              ? 'Aucune étape ne correspond à votre recherche'
              : 'Aucune étape dans cette catégorie'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
            {searchQuery
              ? 'Essayez avec un autre mot-clé ou réinitialisez le filtre.'
              : 'Ajoutez vos expériences professionnelles, diplômes et certifications pour retracer votre trajectoire.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-600 rounded-xl hover:bg-secondary/80"
            >
              Effacer la recherche
            </button>
          ) : (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-600 hover:opacity-90"
            >
              <Icon name="PlusIcon" size={14} />
              Ajouter ma première étape
            </button>
          )}
        </div>
      ) : (
        /* Timeline */
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-border" />

          <div className="space-y-4">
            {filtered.map((entry) => {
              const isExp = entry.type === 'experience';
              const isExpanded = expandedId === entry.id;

              return (
                <div key={entry.id} className="relative pl-12 sm:pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-3 top-4 w-4 h-4 rounded-full border-2 border-card flex items-center justify-center ${
                      isExp ? 'bg-primary' : 'bg-accent'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div
                    className={`bg-card border rounded-xl shadow-card transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-primary/40 ring-1 ring-primary/20'
                        : 'border-border hover:border-border/80'
                    }`}
                  >
                    {/* Header bar / clickable trigger */}
                    <div
                      className="w-full flex items-start justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      <div className="flex items-start gap-3 flex-1 pr-2">
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                            isExp ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                          }`}
                        >
                          <Icon
                            name={isExp ? 'BriefcaseIcon' : 'GraduationCapIcon'}
                            size={18}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-700 text-foreground leading-tight">
                              {entry.title}
                            </p>
                            {entry.current && (
                              <StatusBadge variant="active" label="En cours" size="sm" />
                            )}
                          </div>
                          <p className="text-xs font-600 text-primary mt-0.5">
                            {entry.organization}
                            {entry.location && (
                              <span className="text-muted-foreground font-normal">
                                {' '}
                                · {entry.location}
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {entry.period}
                            {entry.duration && ` · ${entry.duration}`}
                          </p>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => handleOpenEdit(entry, e)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Modifier"
                        >
                          <Icon name="PencilIcon" size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(entry, e)}
                          disabled={deletingId === entry.id}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          {deletingId === entry.id ? (
                            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Icon name="TrashIcon" size={13} />
                          )}
                        </button>
                        <div className="p-1.5 text-muted-foreground">
                          <Icon
                            name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                            size={16}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border pt-4 animate-fade-in bg-muted/10 space-y-4">
                        {entry.description && (
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                            {entry.description}
                          </p>
                        )}

                        {/* Achievements */}
                        {entry.achievements && entry.achievements.length > 0 && (
                          <div>
                            <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-2">
                              Réalisations clés & Impact
                            </p>
                            <ul className="space-y-1.5">
                              {entry.achievements.map((ach, idx) => (
                                <li
                                  key={`ach-${entry.id}-${idx}`}
                                  className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed"
                                >
                                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">
                                    <Icon name="CheckCircleIcon" size={14} />
                                  </span>
                                  {ach}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tech tags */}
                        {entry.tech && entry.tech.length > 0 && (
                          <div>
                            <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-1.5">
                              Technologies & Compétences mobilisées
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {entry.tech.map((t) => (
                                <span
                                  key={`tech-${entry.id}-${t}`}
                                  className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-500 rounded-lg"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Document & Bottom Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          {entry.document ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-500 text-foreground">
                              <Icon name="DocumentTextIcon" size={14} className="text-primary" />
                              <span>{entry.document}</span>
                            </div>
                          ) : (
                            <div />
                          )}

                          <button
                            onClick={(e) => handleOpenEdit(entry, e)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-600 transition-colors"
                          >
                            <Icon name="PencilIcon" size={12} />
                            Modifier cette étape
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      <ParcoursEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialItem={editingItem}
        defaultType={filterType === 'all' ? 'experience' : filterType}
        onSaved={handleSaved}
      />
    </div>
  );
}