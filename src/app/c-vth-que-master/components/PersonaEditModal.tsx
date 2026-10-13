'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Modal from '@/components/ui/Modal';
import { PersonaItem, savePersona } from '@/lib/services/cvthequeService';
import { toast } from 'sonner';

interface PersonaEditModalProps {
  open: boolean;
  onClose: () => void;
  initialPersona?: PersonaItem | null;
  onSaved: (savedPersona: PersonaItem) => void;
}

const EMOJI_OPTIONS = ['💻', '🚀', '🏢', '🎨', '📰', '⚡', '🛡️', '🎯', '📊', '🤝'];

const COLOR_OPTIONS = [
  { label: 'Bleu', class: 'bg-primary/10 border-primary/20' },
  { label: 'Violet', class: 'bg-accent/10 border-accent/20' },
  { label: 'Bleu ciel', class: 'bg-info/10 border-info/20' },
  { label: 'Orange', class: 'bg-warning/10 border-warning/20' },
  { label: 'Rose / Rouge', class: 'bg-negative/10 border-negative/20' },
  { label: 'Émeraude', class: 'bg-emerald-500/10 border-emerald-500/20' },
];

export default function PersonaEditModal({
  open,
  onClose,
  initialPersona,
  onSaved,
}: PersonaEditModalProps) {
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('');
  const [expectations, setExpectations] = useState<string[]>([]);
  const [emoji, setEmoji] = useState('💻');
  const [color, setColor] = useState(COLOR_OPTIONS[0].class);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialPersona) {
      setName(initialPersona.name || '');
      setTargetRole(initialPersona.targetRole || '');
      setIndustry(initialPersona.industry || '');
      setToneOfVoice(initialPersona.toneOfVoice || '');
      setExpectations(initialPersona.expectations ? [...initialPersona.expectations] : []);
      setEmoji(initialPersona.emoji || '💻');
      setColor(initialPersona.color || COLOR_OPTIONS[0].class);
    } else {
      setName('');
      setTargetRole('Lead Tech / Architecte');
      setIndustry('Tech & SaaS');
      setToneOfVoice('Précis, orienté impact & architecture');
      setExpectations([
        'Stack technique détaillée et moderne',
        'Métriques d\'impact chiffrées (KPIs)',
        'Qualité du code et lien GitHub actif',
      ]);
      setEmoji('💻');
      setColor(COLOR_OPTIONS[0].class);
    }
  }, [initialPersona, open]);

  const handleAddExpectation = () => {
    if (expectations.length >= 6) {
      toast.info('Maximum 6 attentes clés recommandées.');
      return;
    }
    setExpectations([...expectations, '']);
  };

  const handleUpdateExpectation = (idx: number, val: string) => {
    const updated = [...expectations];
    updated[idx] = val;
    setExpectations(updated);
  };

  const handleRemoveExpectation = (idx: number) => {
    setExpectations(expectations.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Veuillez renseigner le titre du persona.');
      return;
    }
    if (!targetRole.trim()) {
      toast.error('Veuillez préciser le rôle cible visé.');
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<PersonaItem, 'id' | 'createdAt'> = {
        name: name.trim(),
        targetRole: targetRole.trim(),
        industry: industry.trim() || 'Tech',
        toneOfVoice: toneOfVoice.trim() || 'Professionnel',
        expectations: expectations.filter((exp) => exp.trim().length > 0),
        emoji,
        color,
        portfoliosLinked: initialPersona?.portfoliosLinked ?? 0,
      };

      const saved = await savePersona(payload, initialPersona?.id);
      toast.success(
        initialPersona
          ? `Persona "${saved.name}" mis à jour !`
          : `Nouveau persona "${saved.name}" ajouté à votre CVthèque Master !`
      );
      onSaved(saved);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement du persona.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialPersona ? 'Modifier le Persona cible' : 'Nouveau Persona cible'}
      subtitle="Un persona définit le profil du recruteur type (attentes, ton et rôle visé) pour générer des portfolios sur-mesure."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[78vh] overflow-y-auto pr-1">
        {/* Row 1: Emoji & Nom */}
        <div className="flex items-start gap-4">
          <div className="space-y-1.5 flex-shrink-0">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground block">
              Icône
            </label>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-2xl shadow-sm">
                {emoji}
              </div>
            </div>
            <div className="flex gap-1 flex-wrap max-w-[120px] pt-1">
              {EMOJI_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center transition-transform hover:scale-110 ${
                    emoji === em ? 'bg-primary/20 scale-110' : 'bg-muted/40'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
                Titre du Persona <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Recruteur Tech Senior, Fondateur Startup IA..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
                Thème de couleur
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.label}
                    type="button"
                    onClick={() => setColor(col.class)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-600 border transition-all ${col.class} ${
                      color === col.class ? 'ring-2 ring-primary ring-offset-1' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Rôle cible & Secteur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Poste / Rôle visé <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="ex: Lead Developer / Architecte"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Secteur d&apos;activité
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="ex: Tech & SaaS, Intelligence Artificielle..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Row 3: Tonalité */}
        <div className="space-y-1.5">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Tonalité de communication (Tone of voice)
          </label>
          <input
            type="text"
            value={toneOfVoice}
            onChange={(e) => setToneOfVoice(e.target.value)}
            placeholder="ex: Précis, technique, orienté résultats et valeur ajoutée"
            className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Row 4: Attentes clés */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Critères & Attentes prioritaires du recruteur
            </label>
            <button
              type="button"
              onClick={handleAddExpectation}
              className="text-xs font-600 text-primary hover:underline flex items-center gap-1"
            >
              <Icon name="PlusIcon" size={13} />
              Ajouter une attente
            </button>
          </div>

          <div className="space-y-2">
            {expectations.map((exp, idx) => (
              <div key={`exp-edit-${idx}`} className="flex items-center gap-2">
                <span className="text-primary flex-shrink-0">
                  <Icon name="CheckIcon" size={15} />
                </span>
                <input
                  type="text"
                  value={exp}
                  onChange={(e) => handleUpdateExpectation(idx, e.target.value)}
                  placeholder="ex: Stack technique détaillée, KPIs de performance..."
                  className="flex-1 px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExpectation(idx)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Icon name="TrashIcon" size={14} />
                </button>
              </div>
            ))}
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
                {initialPersona ? 'Mettre à jour' : 'Créer le Persona'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
