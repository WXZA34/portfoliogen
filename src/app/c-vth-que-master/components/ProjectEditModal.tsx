'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import Modal from '@/components/ui/Modal';
import { ProjectItem, ProjectKPI, saveProject } from '@/lib/services/cvthequeService';
import { toast } from 'sonner';

interface ProjectEditModalProps {
  open: boolean;
  onClose: () => void;
  initialProject?: ProjectItem | null;
  onSaved: (savedProject: ProjectItem) => void;
}

const SUGGESTED_TAGS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'TailwindCSS',
  'Supabase',
  'PostgreSQL',
  'Docker',
  'AWS',
  'GraphQL',
  'Vue.js',
  'Flutter',
];

const PRESET_COVERS = [
  {
    label: 'IA & Réseaux',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Cloud & Infrastructure',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Collaboration & Team',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'DevOps & Monitoring',
    url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'Terminal & Code',
    url: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1200&auto=format&fit=crop',
  },
  {
    label: 'FinTech & Analytics',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function ProjectEditModal({
  open,
  onClose,
  initialProject,
  onSaved,
}: ProjectEditModalProps) {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [year, setYear] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [url, setUrl] = useState('');
  const [github, setGithub] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [kpis, setKpis] = useState<ProjectKPI[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title || '');
      setRole(initialProject.role || '');
      setCompany(initialProject.company || '');
      setYear(initialProject.year || '');
      setDuration(initialProject.duration || '');
      setStatus(initialProject.status || 'published');
      setDescription(initialProject.description || '');
      setTechStack(initialProject.techStack || []);
      setUrl(initialProject.url || '');
      setGithub(initialProject.github || '');
      setImageUrl(initialProject.imageUrl || '');
      setKpis(initialProject.kpis ? [...initialProject.kpis] : []);
    } else {
      // Defaults for new project
      setTitle('');
      setRole('Lead Tech');
      setCompany('');
      setYear(new Date().getFullYear().toString());
      setDuration('3 mois');
      setStatus('published');
      setDescription('');
      setTechStack(['React', 'TypeScript', 'TailwindCSS']);
      setUrl('');
      setGithub('');
      setImageUrl(PRESET_COVERS[0].url);
      setKpis([
        { label: 'Utilisateurs', value: '1.5k+' },
        { label: 'Performance', value: '98%' },
      ]);
    }
  }, [initialProject, open]);

  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd || newTag).trim();
    if (!val) return;
    if (!techStack.includes(val)) {
      setTechStack([...techStack, val]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleAddKPI = () => {
    if (kpis.length >= 4) {
      toast.info('Maximum 4 indicateurs clés recommandés pour un affichage optimal.');
      return;
    }
    setKpis([...kpis, { label: 'Métrique', value: '100%' }]);
  };

  const handleUpdateKPI = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...kpis];
    updated[index] = { ...updated[index], [field]: val };
    setKpis(updated);
  };

  const handleRemoveKPI = (index: number) => {
    setKpis(kpis.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Téléversement de l'image...");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors du téléversement');
      }

      setImageUrl(data.url);
      toast.success('Image importée avec succès !', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Impossible de téléverser l\'image', { id: toastId });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Veuillez renseigner un titre pour le projet.');
      return;
    }

    setSaving(true);
    try {
      const projectPayload: Omit<ProjectItem, 'id' | 'createdAt'> = {
        title: title.trim(),
        role: role.trim(),
        company: company.trim(),
        year: year.trim(),
        duration: duration.trim(),
        status,
        description: description.trim(),
        techStack,
        url: url.trim() || undefined,
        github: github.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        imageAlt: title.trim(),
        kpis: kpis.filter((k) => k.label.trim() && k.value.trim()),
      };

      const saved = await saveProject(projectPayload, initialProject?.id);
      toast.success(initialProject ? 'Projet mis à jour avec succès !' : 'Nouveau projet ajouté à votre CVthèque !');
      onSaved(saved);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement du projet.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialProject ? 'Modifier le projet' : 'Nouveau Projet Master'}
      subtitle="Ce projet sera stocké dans votre CVthèque Master et pourra être sélectionné dans vos portfolios ciblés."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto pr-1 space-y-6">
        {/* Row 1: Titre & Statut */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Titre du projet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: NeuralCommerce Platform"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Statut
            </label>
            <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`py-1.5 px-3 rounded-lg text-xs font-600 transition-all ${
                  status === 'published'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Publié
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`py-1.5 px-3 rounded-lg text-xs font-600 transition-all ${
                  status === 'draft'
                    ? 'bg-card text-foreground shadow-sm font-700 border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Brouillon
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Rôle, Entreprise, Année, Durée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Rôle / Poste
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ex: Lead Developer"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Entreprise / Client
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="ex: TechCorp ou Perso"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Année / Période
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="ex: 2026"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Durée
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ex: 6 mois / En cours"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Description détaillée du projet
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Décrivez les objectifs atteints, l'impact métier, les défis techniques surmontés et les technologies mises en œuvre..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-400 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed resize-y"
          />
        </div>

        {/* Row 4: Stack Technique */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Stack Technique & Compétences associées
          </label>

          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-muted/40 border border-border min-h-[46px] items-center">
            {techStack.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-600 transition-all"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500 hover:scale-110 transition-transform"
                >
                  <Icon name="XMarkIcon" size={13} />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1 ml-auto sm:ml-0">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="+ Ajouter un tag..."
                className="bg-transparent text-xs font-500 px-2 py-1 outline-none text-foreground placeholder:text-muted-foreground w-28"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-2 py-1 bg-card hover:bg-muted text-foreground border border-border rounded-md text-xs font-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground mr-1 font-500">Suggestions :</span>
            {SUGGESTED_TAGS.filter((t) => !techStack.includes(t)).slice(0, 8).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleAddTag(t)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-secondary hover:bg-primary/15 hover:text-primary text-secondary-foreground transition-colors"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>

        {/* Row 5: Visuel & Image */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
            Image de présentation / Bannière
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Preview Box */}
            <div className="relative h-28 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center group">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs font-600 shadow"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-3 text-muted-foreground">
                  <Icon name="PhotoIcon" size={24} className="mx-auto mb-1 opacity-50" />
                  <span className="text-[11px]">Aucune image</span>
                </div>
              )}
            </div>

            {/* Upload & URL input */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Collez une URL d'image (https://...)"
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl text-xs font-600 transition-colors whitespace-nowrap"
                >
                  <Icon name="ArrowUpTrayIcon" size={14} />
                  {uploadingImage ? 'Téléversement...' : 'Importer'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[11px] text-muted-foreground flex-shrink-0">Préréglages :</span>
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-all whitespace-nowrap ${
                      imageUrl === preset.url
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 6: Indicateurs clés (KPIs) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
              Indicateurs de succès & Métriques clés (KPIs)
            </label>
            <button
              type="button"
              onClick={handleAddKPI}
              className="text-xs font-600 text-primary hover:underline flex items-center gap-1"
            >
              <Icon name="PlusIcon" size={13} />
              Ajouter un indicateur
            </button>
          </div>

          {kpis.length === 0 ? (
            <p className="text-xs text-muted-foreground italic bg-muted/30 p-2.5 rounded-xl border border-dashed border-border text-center">
              Aucun KPI ajouté. Les KPIs renforcent l&apos;impact de vos projets auprès des recruteurs (ex: +30% conversion, 99.9% uptime).
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {kpis.map((kpi, idx) => (
                <div
                  key={`kpi-edit-${idx}`}
                  className="flex items-center gap-2 p-2 bg-muted/40 border border-border rounded-xl"
                >
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={kpi.label}
                      onChange={(e) => handleUpdateKPI(idx, 'label', e.target.value)}
                      placeholder="Intitulé (ex: Utilisateurs)"
                      className="w-full px-2 py-1 bg-card rounded-lg border border-border text-xs text-foreground placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="w-28 space-y-1">
                    <input
                      type="text"
                      value={kpi.value}
                      onChange={(e) => handleUpdateKPI(idx, 'value', e.target.value)}
                      placeholder="Valeur (ex: 2.1M)"
                      className="w-full px-2 py-1 bg-card rounded-lg border border-border text-xs font-700 text-primary placeholder:text-muted-foreground/60 tabular-nums"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveKPI(idx)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Icon name="TrashIcon" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 7: Liens Live & GitHub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Icon name="GlobeAltIcon" size={14} className="text-primary" />
              Lien de démonstration / Site en ligne
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://monsite.com"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Icon name="GithubIcon" size={14} className="text-foreground" />
              Lien GitHub / Dépôt de code
            </label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="github.com/moncompte/monprojet"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-500 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono-data"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:opacity-90 shadow-sm transition-all flex items-center gap-2 btn-press"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Icon name="CheckIcon" size={16} />
                {initialProject ? 'Mettre à jour le projet' : 'Créer le projet'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
