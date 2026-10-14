'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';
import {
  type CreativeStudioItem,
  fetchUserCreativeStudioItems,
  saveUserCreativeStudioItem,
  deleteUserCreativeStudioItem,
} from '@/lib/services/cvthequeService';

interface CreativeStudioPanelProps {
  onCountChange?: (count: number) => void;
}

export default function CreativeStudioPanel({ onCountChange }: CreativeStudioPanelProps) {
  const [items, setItems] = useState<CreativeStudioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CreativeStudioItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [year, setYear] = useState('2025');
  const [mediaType, setMediaType] = useState<'video' | 'image' | 'audio' | 'article'>('video');
  const [softSkillsInput, setSoftSkillsInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    let mounted = true;
    fetchUserCreativeStudioItems().then((res) => {
      if (mounted) {
        setItems(res);
        setLoading(false);
        onCountChange?.(res.length);
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
    setRole('Coordinateur de projet & Montage');
    setYear('2025');
    setMediaType('video');
    setSoftSkillsInput('Travail en équipe, Vulgarisation technique, Storytelling, Montage vidéo');
    setMediaUrl('');
    setThumbnailUrl('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80');
    setStatus('published');
    setModalOpen(true);
  };

  const openEditModal = (item: CreativeStudioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setRole(item.role || '');
    setYear(item.year || '2025');
    setMediaType(item.mediaType);
    setSoftSkillsInput(item.softSkills.join(', '));
    setMediaUrl(item.mediaUrl || '');
    setThumbnailUrl(item.thumbnailUrl || '');
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const skillsList = softSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const saved = await saveUserCreativeStudioItem(
      {
        title: title.trim(),
        description: description.trim(),
        role: role.trim(),
        year: year.trim(),
        mediaType,
        softSkills: skillsList.length > 0 ? skillsList : ['Communication', 'Travail en équipe'],
        mediaUrl: mediaUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        status,
      },
      editingItem?.id
    );

    const updated = editingItem
      ? items.map((i) => (i.id === saved.id ? saved : i))
      : [saved, ...items];

    setItems(updated);
    setModalOpen(false);
    onCountChange?.(updated.length);
    toast.success('Réalisation créative enregistrée dans la CVthèque !');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément de votre Studio Créatif ?')) return;
    await deleteUserCreativeStudioItem(id);
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    onCountChange?.(updated.length);
    toast.success('Élément supprimé.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Icon name="Loader2Icon" size={24} className="animate-spin text-primary mr-2" />
        <span className="text-xs font-600">Chargement de votre Studio Créatif...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-800 text-foreground flex items-center gap-2">
            <Icon name="SparklesIcon" size={16} className="text-amber-600" />
            Rubrique Master : Studio Créatif (Savoir-Être) ({items.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            « La technique c&apos;est bien, savoir la communiquer en équipe c&apos;est mieux. » Présentez vos réalisations audiovisuelles, podcasts, infographies de prévention et pitchs qui illustrent vos compétences humaines.
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-700 hover:opacity-90 transition-all btn-press shadow-xs flex-shrink-0"
        >
          <Icon name="PlusIcon" size={13} />
          Ajouter une réalisation
        </button>
      </div>

      {/* Grid of Creative Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs hover:border-amber-400/60 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Media Thumbnail */}
              {item.thumbnailUrl && (
                <div className="w-full h-36 bg-muted relative overflow-hidden">
                  <AppImage
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-700 capitalize flex items-center gap-1">
                    {item.mediaType === 'video' && <Icon name="VideoCameraIcon" size={10} />}
                    {item.mediaType === 'audio' && <Icon name="MicrophoneIcon" size={10} />}
                    {item.mediaType === 'image' && <Icon name="PhotoIcon" size={10} />}
                    {item.mediaType === 'article' && <Icon name="DocumentTextIcon" size={10} />}
                    {item.mediaType}
                  </div>
                  <div className="absolute top-2 right-2">
                    <StatusBadge variant={item.status} size="sm" />
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-800 text-foreground leading-snug group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  {item.year && (
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border flex-shrink-0">
                      {item.year}
                    </span>
                  )}
                </div>

                {item.role && (
                  <p className="text-xs font-600 text-[#8A7D63]">
                    Rôle : {item.role}
                  </p>
                )}

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Soft Skills badges */}
                {item.softSkills && item.softSkills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-700 text-amber-700 uppercase tracking-wider mb-1">
                      Savoir-Être mobilisé :
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.softSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-600"
                        >
                          ✦ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
              <div>
                {item.mediaUrl && (
                  <a
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 font-600"
                  >
                    <Icon name="PlayIcon" size={12} />
                    Visionner / Écouter
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="Modifier"
                >
                  <Icon name="PencilIcon" size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
              {editingItem ? 'Modifier la réalisation créative' : 'Nouvelle réalisation (Studio Créatif)'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Titre du projet / Support
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Court-métrage & Pitch SAÉ : L'Impact de l'IA"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs font-700 text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Votre rôle dans l&apos;équipe
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ex: Coordinateur, Monteur..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-700 text-muted-foreground mb-1">
                    Format média
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="video">Vidéo / Court-métrage</option>
                    <option value="audio">Audio / Podcast</option>
                    <option value="image">Image / Infographie</option>
                    <option value="article">Article / Dossier rédigé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Description de la démarche
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez le contexte, le message clé et le travail d'équipe..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Compétences humaines / Soft Skills (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={softSkillsInput}
                  onChange={(e) => setSoftSkillsInput(e.target.value)}
                  placeholder="Ex: Travail en équipe, Storytelling, Vulgarisation..."
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
                  Vignette / Image URL d&apos;illustration
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Lien média (YouTube, Soundcloud, Drive, etc.)
                </label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
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
