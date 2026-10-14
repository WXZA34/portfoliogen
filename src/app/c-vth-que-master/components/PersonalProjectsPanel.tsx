'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import {
  type PersonalProjectItem,
  fetchUserPersonalProjects,
  saveUserPersonalProject,
  deleteUserPersonalProject,
} from '@/lib/services/cvthequeService';

interface PersonalProjectsPanelProps {
  onCountChange?: (count: number) => void;
}

export default function PersonalProjectsPanel({ onCountChange }: PersonalProjectsPanelProps) {
  const [projects, setProjects] = useState<PersonalProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonalProjectItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2025');
  const [savoirFaireInput, setSavoirFaireInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [github, setGithub] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    let mounted = true;
    fetchUserPersonalProjects().then((items) => {
      if (mounted) {
        setProjects(items);
        setLoading(false);
        onCountChange?.(items.length);
      }
    });
    return () => {
      mounted = false;
    };
  }, [onCountChange]);

  const openNewModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setYear('2025');
    setSavoirFaireInput('Développement mobile, Autonomie, Rigueur');
    setTechStackInput('Java, Kotlin, Android');
    setGithub('');
    setUrl('');
    setImageUrl('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80');
    setStatus('published');
    setModalOpen(true);
  };

  const openEditModal = (item: PersonalProjectItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setYear(item.year || '2025');
    setSavoirFaireInput(item.savoirFaire.join(', '));
    setTechStackInput(item.techStack.join(', '));
    setGithub(item.github || '');
    setUrl(item.url || '');
    setImageUrl(item.imageUrl || '');
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sfList = savoirFaireInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const techList = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const saved = await saveUserPersonalProject(
      {
        title: title.trim(),
        description: description.trim(),
        year: year.trim(),
        savoirFaire: sfList.length > 0 ? sfList : ['Autonomie', 'Pratique technique'],
        techStack: techList.length > 0 ? techList : ['Code'],
        github: github.trim(),
        url: url.trim(),
        imageUrl: imageUrl.trim(),
        status,
      },
      editingItem?.id
    );

    const updated = editingItem
      ? projects.map((p) => (p.id === saved.id ? saved : p))
      : [saved, ...projects];

    setProjects(updated);
    setModalOpen(false);
    onCountChange?.(updated.length);
    toast.success('Projet personnel enregistré dans la CVthèque !');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet personnel de votre CVthèque ?')) return;
    await deleteUserPersonalProject(id);
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    onCountChange?.(updated.length);
    toast.success('Projet supprimé.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Icon name="Loader2Icon" size={24} className="animate-spin text-primary mr-2" />
        <span className="text-xs font-600">Chargement de vos projets personnels...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-800 text-foreground flex items-center gap-2">
            <Icon name="CodeBracketIcon" size={16} className="text-purple-600" />
            Rubrique Master : Projets Personnels (Savoir-Faire) ({projects.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mettez en avant vos réalisations techniques développées en toute autonomie hors cadre académique (apps mobiles, robotique perso, domotique, scripts IA).
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-700 hover:opacity-90 transition-all btn-press shadow-xs flex-shrink-0"
        >
          <Icon name="PlusIcon" size={13} />
          Ajouter un projet personnel
        </button>
      </div>

      {/* Grid of Personal Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs hover:border-purple-400/60 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Project Image */}
              {proj.imageUrl && (
                <div className="w-full h-36 bg-muted relative overflow-hidden">
                  <AppImage
                    src={proj.imageUrl}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <StatusBadge variant={proj.status} size="sm" />
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-800 text-foreground leading-snug group-hover:text-purple-600 transition-colors">
                    {proj.title}
                  </h3>
                  {proj.year && (
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                      {proj.year}
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>

                {/* Savoir-Faire tags */}
                {proj.savoirFaire && proj.savoirFaire.length > 0 && (
                  <div>
                    <p className="text-[10px] font-700 text-purple-700 uppercase tracking-wider mb-1">
                      Savoir-Faire démontré :
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {proj.savoirFaire.map((sf, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-600"
                        >
                          ★ {sf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 bg-muted border border-border text-foreground text-[10px] font-500 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with actions and links */}
            <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {proj.github && (
                  <a
                    href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                    title="Code source GitHub"
                  >
                    <Icon name="GithubIcon" size={13} />
                  </a>
                )}
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                    title="Démonstration"
                  >
                    <Icon name="GlobeAltIcon" size={13} />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(proj)}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="Modifier"
                >
                  <Icon name="PencilIcon" size={13} />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Supprimer"
                >
                  <Icon name="TrashIcon" size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Creation / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-800 text-foreground mb-4">
              {editingItem ? 'Modifier le projet personnel' : 'Nouveau projet personnel (Savoir-Faire)'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: App Sport & Chrono (Android)"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs font-700 text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Description & Démarche
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez ce que vous avez conçu en autonomie..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Savoir-Faire clés démontrés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={savoirFaireInput}
                  onChange={(e) => setSavoirFaireInput(e.target.value)}
                  placeholder="Ex: Autonomie, Vision par ordinateur, Traitement du signal..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Technologies utilisées (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="Ex: Python, OpenCV, MediaPipe..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Année
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Statut
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="published">Publié (Actif)</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Image URL d&apos;illustration
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Lien GitHub (optionnel)
                  </label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Lien Démo / Vidéo (optionnel)
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-700 hover:opacity-90 transition-all btn-press"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
