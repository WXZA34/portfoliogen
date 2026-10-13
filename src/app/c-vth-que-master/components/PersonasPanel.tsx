'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Modal from '@/components/ui/Modal';
import { useLanguage } from '@/lib/LanguageContext';
import {
  PersonaItem,
  fetchUserPersonas,
  deletePersona,
} from '@/lib/services/cvthequeService';
import PersonaEditModal from './PersonaEditModal';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PersonasPanelProps {
  onCountChange?: (count: number) => void;
}

export default function PersonasPanel({ onCountChange }: PersonasPanelProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const [personas, setPersonas] = useState<PersonaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<PersonaItem | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<PersonaItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const data = await fetchUserPersonas();
      setPersonas(data);
      if (onCountChange) onCountChange(data.length);
    } catch (err) {
      console.error(err);
      toast.error('Impossible de charger vos personas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonas();
  }, []);

  const handleOpenCreate = () => {
    setEditingPersona(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: PersonaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPersona(p);
    setModalOpen(true);
  };

  const handleDelete = async (p: PersonaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Supprimer le persona cible "${p.name}" de votre CVthèque Master ?`)) {
      return;
    }

    try {
      setDeletingId(p.id);
      await deletePersona(p.id);
      const updated = personas.filter((item) => item.id !== p.id);
      setPersonas(updated);
      if (onCountChange) onCountChange(updated.length);
      if (selectedPersona?.id === p.id) setSelectedPersona(null);
      toast.success(`Persona "${p.name}" supprimé.`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (saved: PersonaItem) => {
    setPersonas((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
      if (onCountChange) onCountChange(next.length);
      return next;
    });

    if (selectedPersona?.id === saved.id) {
      setSelectedPersona(saved);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-700 text-foreground">{t.cvtheque.personas.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.cvtheque.personas.subtitle}</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press shadow-sm"
        >
          <Icon name="PlusIcon" size={15} />
          {t.cvtheque.personas.addPersona}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={`skel-per-${i}`} className="bg-card border border-border rounded-xl p-5 h-56 animate-pulse" />
          ))}
        </div>
      ) : (
        /* Personas Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {personas.map((persona) => (
            <div
              key={persona.id}
              onClick={() => setSelectedPersona(persona)}
              className={`bg-card border rounded-xl p-5 shadow-card card-hover cursor-pointer group flex flex-col justify-between ${
                persona.color || 'bg-primary/10 border-primary/20'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-xl shadow-sm border border-border/50">
                      {persona.emoji || '🎯'}
                    </div>
                    <div>
                      <h4 className="text-sm font-700 text-foreground leading-tight group-hover:text-primary transition-colors">
                        {persona.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{persona.industry}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleOpenEdit(persona, e)}
                      className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-all shadow-xs"
                      title="Modifier"
                    >
                      <Icon name="PencilIcon" size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(persona, e)}
                      disabled={deletingId === persona.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                      title="Supprimer"
                    >
                      {deletingId === persona.id ? (
                        <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon name="TrashIcon" size={13} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wider mb-0.5">
                    {t.cvtheque.personas.targetRole}
                  </p>
                  <p className="text-xs font-700 text-foreground">{persona.targetRole}</p>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-700 text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t.cvtheque.personas.keyExpectations}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {persona.expectations.slice(0, 3).map((exp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-card/90 text-foreground text-[11px] font-500 rounded-md border border-border"
                      >
                        {exp}
                      </span>
                    ))}
                    {persona.expectations.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-600 rounded-md">
                        +{persona.expectations.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 font-500">
                  <Icon name="FolderIcon" size={12} className="text-primary" />
                  <span>
                    {persona.portfoliosLinked || 0} {t.cvtheque.personas.portfoliosLinked}
                  </span>
                </div>
                <div className="truncate max-w-[130px] italic">
                  {persona.toneOfVoice.split(',')[0]}
                </div>
              </div>
            </div>
          ))}

          {/* Add Persona Card */}
          <div
            onClick={handleOpenCreate}
            className="bg-card border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200 min-h-[220px]"
          >
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Icon name="PlusIcon" size={20} />
            </div>
            <p className="text-xs font-700 text-foreground">{t.cvtheque.personas.addPersona}</p>
            <p className="text-[11px] text-muted-foreground text-center max-w-[200px] leading-tight">
              Créez une cible recruteur personnalisée pour adapter vos futurs portfolios.
            </p>
          </div>
        </div>
      )}

      {/* Persona Detail Modal */}
      {selectedPersona && (
        <Modal
          open={!!selectedPersona}
          onClose={() => setSelectedPersona(null)}
          title={`${selectedPersona.emoji || '🎯'} ${selectedPersona.name}`}
          subtitle={`${selectedPersona.targetRole} · ${selectedPersona.industry}`}
          size="lg"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-1">
                  {t.cvtheque.personas.targetRole}
                </p>
                <p className="text-sm font-700 text-foreground">{selectedPersona.targetRole}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-1">
                  {t.cvtheque.personas.industry}
                </p>
                <p className="text-sm font-700 text-foreground">{selectedPersona.industry}</p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-xl border border-border">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-1.5">
                {t.cvtheque.personas.toneOfVoice}
              </p>
              <p className="text-sm text-foreground italic leading-relaxed">
                « {selectedPersona.toneOfVoice} »
              </p>
            </div>

            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2.5">
                {t.cvtheque.personas.keyExpectations}
              </p>
              <div className="space-y-2">
                {selectedPersona.expectations.map((exp, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border text-xs text-foreground"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                      <Icon name="CheckIcon" size={12} />
                    </div>
                    <span className="font-500">{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-secondary/40 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <Icon name="FolderIcon" size={16} className="text-primary" />
                <span className="text-xs font-600 text-foreground">
                  {selectedPersona.portfoliosLinked || 0} portfolio(s) ciblé(s) lié(s) à ce persona
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = selectedPersona;
                    setSelectedPersona(null);
                    handleOpenEdit(toEdit);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-600 hover:bg-muted"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/portfolio-studio');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 shadow-sm transition-all"
                >
                  <Icon name="PlusIcon" size={13} />
                  Créer un portfolio pour ce persona
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit / Create Modal */}
      <PersonaEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPersona={editingPersona}
        onSaved={handleSaved}
      />
    </div>
  );
}
