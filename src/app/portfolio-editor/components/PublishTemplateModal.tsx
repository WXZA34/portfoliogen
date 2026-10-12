'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { PortfolioDesign } from './PortfolioEditorContent';
import { publishToMarketplace } from '@/lib/services/marketplaceService';
import { toast } from 'sonner';

interface PublishTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: PortfolioDesign;
  onSuccess?: (templateId: string) => void;
}

const CATEGORIES = ['Tech', 'Design', 'Créatif', 'Business', 'Finance', 'Architecture', 'Santé'];
const THEMES = ['Minimaliste', 'Dark', 'Bold', 'Coloré', 'Éditorial', 'Pitch Deck'];

export default function PublishTemplateModal({
  isOpen,
  onClose,
  design,
  onSuccess,
}: PublishTemplateModalProps) {
  const [name, setName] = useState(design.name || 'Mon Modèle');
  const [author, setAuthor] = useState('Créateur PortfolioGen');
  const [category, setCategory] = useState('Tech');
  const [theme, setTheme] = useState('Minimaliste');
  const [description, setDescription] = useState(
    'Un template moderne et personnalisable créé avec l\'éditeur PortfolioGen.'
  );
  const [tagInput, setTagInput] = useState('Portfolio, Showcase, Web');
  const [isPremium, setIsPremium] = useState(false);
  const [publishing, setPublishing] = useState(false);

  if (!isOpen) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Veuillez entrer un titre pour votre modèle.');
      return;
    }

    setPublishing(true);
    try {
      const tags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let thumbnail: string | undefined = undefined;
      try {
        const { captureCanvasThumbnail } = await import('../utils/exportCanvas');
        const captured = await captureCanvasThumbnail('portfolio-canvas-export');
        if (captured) thumbnail = captured;
      } catch (err) {
        console.warn('Could not capture preview thumbnail', err);
      }

      const published = await publishToMarketplace({
        originalTemplateId: design.id,
        name: name.trim(),
        author: author.trim() || 'Anonyme',
        category,
        theme,
        description: description.trim(),
        previewThumbnail: thumbnail,
        previewColor: design.globalStyle.primaryColor || '#7c3aed',
        tags,
        isPremium,
        designData: {
          templateId: design.id,
          blocks: design.blocks,
          globalStyle: design.globalStyle,
        },
      });

      toast.success(`Le modèle "${published.name}" a été publié sur la Marketplace !`);
      if (onSuccess) onSuccess(published.id);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erreur lors de la publication du template.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="GlobeAltIcon" size={20} />
            </div>
            <div>
              <h2 className="text-base font-700 text-foreground">Publier sur la Marketplace</h2>
              <p className="text-xs text-muted-foreground">Partagez votre design avec toute la communauté</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <Icon name="XIcon" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Preview banner */}
          <div
            className="h-28 rounded-xl p-4 flex flex-col justify-end relative overflow-hidden text-white shadow-inner"
            style={{
              backgroundColor: design.globalStyle.bgColor || '#0f172a',
              border: `2px solid ${design.globalStyle.primaryColor || '#7c3aed'}`,
            }}
          >
            <div
              className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-700 tracking-wide uppercase text-white shadow-sm"
              style={{ backgroundColor: design.globalStyle.primaryColor || '#7c3aed' }}
            >
              {design.blocks.length} {design.blocks.length > 1 ? 'pages / blocs' : 'page'}
            </div>
            <p className="text-sm font-bold truncate drop-shadow">{name || 'Aperçu du Template'}</p>
            <p className="text-xs opacity-80 truncate">{author} • {category}</p>
          </div>

          <div>
            <label className="text-xs font-700 text-foreground block mb-1">Nom du template *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Portfolio Architecte Minimaliste"
              className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-700 text-foreground block mb-1">Auteur / Créateur</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Votre nom ou studio"
                className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="text-xs font-700 text-foreground block mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-700 text-foreground block mb-1">Thème visuel</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-700 text-foreground block mb-1">Tags (séparés par virgules)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="ex: UI, UX, Clean, Figma"
                className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-700 text-foreground block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez à qui s'adresse ce template et ses points forts..."
              className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          {/* Premium toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center gap-2">
              <Icon name="SparklesIcon" size={16} className="text-amber-500" />
              <div>
                <p className="text-xs font-700 text-foreground">Badge Pro / Premium</p>
                <p className="text-[11px] text-muted-foreground">Marquer ce template comme modèle exclusif</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={publishing}
              className="px-4 py-2 rounded-xl border border-border text-xs font-600 text-muted-foreground hover:text-foreground transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={publishing}
              className="flex items-center gap-1.5 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-700 hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
            >
              {publishing ? (
                <>
                  <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Icon name="GlobeAltIcon" size={14} />
                  Mettre en ligne
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
