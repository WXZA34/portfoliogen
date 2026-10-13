'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Modal from '@/components/ui/Modal';
import { ParcoursItem, saveParcours } from '@/lib/services/cvthequeService';
import { toast } from 'sonner';

interface ParcoursEditModalProps {
  open: boolean;
  onClose: () => void;
  initialItem?: ParcoursItem | null;
  defaultType?: 'experience' | 'formation';
  onSaved: (savedItem: ParcoursItem) => void;
}

const COMMON_TECH_SUGGESTIONS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'FastAPI',
  'Go',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'Kafka',
  'Redis',
  'GraphQL',
];

export default function ParcoursEditModal({
  open,
  onClose,
  initialItem,
  defaultType = 'experience',
  onSaved,
}: ParcoursEditModalProps) {
  const [type, setType] = useState<'experience' | 'formation'>(defaultType);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('');
  const [duration, setDuration] = useState('');
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [tech, setTech] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setType(initialItem.type);
      setTitle(initialItem.title || '');
      setOrganization(initialItem.organization || '');
      setLocation(initialItem.location || '');
      setPeriod(initialItem.period || '');
      setDuration(initialItem.duration || '');
      setCurrent(!!initialItem.current);
      setDescription(initialItem.description || '');
      setAchievements(initialItem.achievements ? [...initialItem.achievements] : []);
      setTech(initialItem.tech ? [...initialItem.tech] : []);
      setDocumentName(initialItem.document || '');
    } else {
      setType(defaultType);
      setTitle('');
      setOrganization('');
      setLocation('Paris, France');
      setPeriod(`${new Date().getFullYear()} — Présent`);
      setDuration('En cours');
      setCurrent(true);
      setDescription('');
      setAchievements([
        'Amélioration significative des performances et de la productivité d\'équipe',
      ]);
      setTech(['React', 'TypeScript', 'Node.js']);
      setDocumentName('');
    }
  }, [initialItem, defaultType, open]);

  const handleAddAchievement = () => {
    if (achievements.length >= 6) {
      toast.info('Maximum 6 réalisations recommandées pour une lecture fluide.');
      return;
    }
    setAchievements([...achievements, '']);
  };

  const handleUpdateAchievement = (idx: number, val: string) => {
    const updated = [...achievements];
    updated[idx] = val;
    setAchievements(updated);
  };

  const handleRemoveAchievement = (idx: number) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  const handleAddTech = (tag?: string) => {
    const val = (tag || newTag).trim();
    if (!val) return;
    if (!tech.includes(val)) {
      setTech([...tech, val]);
    }
    setNewTag('');
  };

  const handleRemoveTech = (tagToRemove: string) => {
    setTech(tech.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Veuillez préciser l\'intitulé (poste ou diplôme).');
      return;
    }
    if (!organization.trim()) {
      toast.error('Veuillez renseigner l\'entreprise, l\'école ou l\'organisme.');
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<ParcoursItem, 'id' | 'createdAt'> = {
        type,
        title: title.trim(),
        organization: organization.trim(),
        location: location.trim() || undefined,
        period: period.trim() || 'Période non définie',
        duration: duration.trim() || undefined,
        current,
        description: description.trim(),
        achievements: achievements.filter((a) => a.trim().length > 0),
        tech,
        document: documentName.trim() || null,
      };

      const saved = await saveParcours(payload, initialItem?.id);
      toast.success(
        initialItem
          ? `Étape "${saved.title}" mise à jour !`
          : `Nouvelle étape "${saved.title}" ajoutée à votre timeline Master !`
      );
      onSaved(saved);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement de l\'étape.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialItem ? 'Modifier l\'étape' : 'Nouvelle étape du parcours Master'}
      subtitle="Chaque expérience ou diplôme enrichit la timeline de votre CVthèque et vos profils recruteurs."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto pr-1 space-y-6">
        {/* Row 1: Type & Statut en cours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Nature de l&apos;étape
            </label>
            <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setType('experience')}
                className={`py-2 px-3 rounded-lg text-xs font-600 transition-all flex items-center justify-center gap-1.5 ${
                  type === 'experience'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="BriefcaseIcon" size={14} />
                Expérience Pro
              </button>
              <button
                type="button"
                onClick={() => setType('formation')}
                className={`py-2 px-3 rounded-lg text-xs font-600 transition-all flex items-center justify-center gap-1.5 ${
                  type === 'formation'
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="GraduationCapIcon" size={14} />
                Formation / Diplôme
              </button>
            </div>
          </div>

          <div className="space-y-1.5 sm:pt-5">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer hover:bg-muted/40 transition-colors">
              <input
                type="checkbox"
                checked={current}
                onChange={(e) => {
                  setCurrent(e.target.checked);
                  if (e.target.checked && !duration) setDuration('En cours');
                }}
                className="w-4 h-4 rounded text-primary border-border focus:ring-primary/20 accent-primary"
              />
              <span className="text-xs font-600 text-foreground">
                {type === 'experience'
                  ? 'J\'occupe actuellement ce poste'
                  : 'Formation actuellement en cours'}
              </span>
            </label>
          </div>
        </div>

        {/* Row 2: Intitulé & Organisme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              {type === 'experience' ? 'Intitulé du poste' : 'Intitulé du diplôme / certification'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'experience'
                  ? 'ex: Lead Tech Full-Stack'
                  : 'ex: Master 2 Génie Logiciel & IA'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              {type === 'experience' ? 'Entreprise / Client' : 'École / Université / Plateforme'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder={
                type === 'experience'
                  ? 'ex: Mistral AI, Qonto, Freelance...'
                  : 'ex: Université Paris-Saclay, 42...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        {/* Row 3: Lieu, Période, Durée */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Lieu / Ville
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex: Paris, France (ou Remote)"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Période affichée
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="ex: Jan 2025 — Présent"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Durée estimée
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ex: 1 an 9 mois"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Row 4: Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Description des missions & responsabilités
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Détaillez le contexte du projet, vos missions clés, l'équipe et les enjeux techniques..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-400 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed resize-y"
          />
        </div>

        {/* Row 5: Réalisations marquantes (Achievements) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Réalisations marquantes & Succès chiffrés
            </label>
            <button
              type="button"
              onClick={handleAddAchievement}
              className="text-xs font-600 text-primary hover:underline flex items-center gap-1"
            >
              <Icon name="PlusIcon" size={13} />
              Ajouter une réalisation
            </button>
          </div>

          {achievements.length === 0 ? (
            <p className="text-xs text-muted-foreground italic bg-muted/30 p-2.5 rounded-xl border border-dashed border-border text-center">
              Aucune réalisation renseignée. Indiquer des chiffres clés (+40% rapidité, 120k utilisateurs) valorise grandement votre profil auprès des recruteurs.
            </p>
          ) : (
            <div className="space-y-2">
              {achievements.map((ach, idx) => (
                <div key={`ach-edit-${idx}`} className="flex items-center gap-2">
                  <span className="text-emerald-500 flex-shrink-0">
                    <Icon name="CheckCircleIcon" size={16} />
                  </span>
                  <input
                    type="text"
                    value={ach}
                    onChange={(e) => handleUpdateAchievement(idx, e.target.value)}
                    placeholder="ex: Réduction de la latence de 40% sur les APIs critiques"
                    className="flex-1 px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(idx)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Icon name="TrashIcon" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 6: Stack & Outils */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Technologies & Méthodologies employées
          </label>

          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-muted/40 border border-border min-h-[46px] items-center">
            {tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary text-secondary-foreground border border-border rounded-lg text-xs font-600"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(t)}
                  className="hover:text-red-500 transition-colors"
                >
                  <Icon name="XMarkIcon" size={13} />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="+ Ajouter un tag..."
                className="bg-transparent text-xs font-500 px-2 py-1 outline-none text-foreground placeholder:text-muted-foreground w-28"
              />
              <button
                type="button"
                onClick={() => handleAddTech()}
                className="px-2 py-1 bg-card hover:bg-muted text-foreground border border-border rounded-md text-xs font-600"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground mr-1 font-500">Suggestions :</span>
            {COMMON_TECH_SUGGESTIONS.filter((s) => !tech.includes(s)).slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleAddTech(s)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Row 7: Document / Justificatif */}
        <div className="space-y-1.5">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Icon name="DocumentTextIcon" size={14} className="text-primary" />
            Justificatif ou attestation (optionnel)
          </label>
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="ex: lettre_recommandation_mistral.pdf ou diplome_m2.pdf"
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
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
                {initialItem ? 'Mettre à jour' : 'Ajouter l\'étape'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
