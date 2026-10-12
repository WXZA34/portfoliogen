'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getMarketplaceTemplates, type MarketplaceTemplateItem } from '@/lib/services/marketplaceService';
import TemplatePreviewModal from './TemplatePreviewModal';

const categories = ['Tous', 'Tech', 'Design', 'Finance', 'Médecine', 'Journalisme', 'Architecture', 'Mode', 'Business'];
const themes = ['Tous', 'Minimaliste', 'Bold', 'Dark', 'Coloré', 'Pitch Deck'];

export default function TemplatesContent() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedTheme, setSelectedTheme] = useState('Tous');
  const [search, setSearch] = useState('');
  const [templatesList, setTemplatesList] = useState<MarketplaceTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplateItem | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const items = await getMarketplaceTemplates();
      setTemplatesList(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filtered = templatesList.filter((t) => {
    const matchCat = selectedCategory === 'Tous' || t.category === selectedCategory;
    const matchTheme = selectedTheme === 'Tous' || t.theme === selectedTheme;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
      t.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchTheme && matchSearch;
  });

  const handleUseTemplate = (template: MarketplaceTemplateItem) => {
    toast.success(`Chargement du template "${template.name}" dans l'éditeur...`);
    router.push(`/portfolio-editor?templateId=${encodeURIComponent(template.id)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un template, auteur ou tag..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => router.push('/portfolio-editor')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all flex-shrink-0 shadow-sm"
        >
          <Icon name="PlusIcon" size={15} />
          Créer dans l'Éditeur & Partager
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                selectedTheme === theme ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-600 text-foreground">{filtered.length} templates disponibles</span>
        <span>·</span>
        <span>{templatesList.filter((t) => t.isNew).length} nouveaux</span>
        <span>·</span>
        <span>
          {templatesList.reduce((acc, t) => acc + (t.downloads || 0), 0).toLocaleString()} utilisations au total
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Icon name="ArrowPathIcon" size={24} className="animate-spin mr-2" />
          <span>Chargement de la marketplace...</span>
        </div>
      ) : (
        /* Templates Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all group flex flex-col shadow-sm hover:shadow-md"
            >
              {/* Visual Preview Header */}
              <div
                className="h-44 relative flex items-center justify-center overflow-hidden p-4 cursor-pointer"
                onClick={() => setPreviewTemplate(template)}
                style={{
                  backgroundColor:
                    template.designData?.globalStyle?.bgColor ||
                    template.previewColor ||
                    '#1e293b',
                }}
              >
                {template.previewThumbnail ? (
                  <img
                    src={template.previewThumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover rounded-lg shadow-inner"
                  />
                ) : (
                  /* Simulated visual layout */
                  <div className="w-full h-full rounded-lg border border-white/10 bg-black/20 p-3 flex flex-col justify-between backdrop-blur-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                      </div>
                      <span className="text-[10px] text-white/70 font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-white/10">
                        {template.theme}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-white text-xs font-bold line-clamp-1 drop-shadow-sm">
                        {template.name}
                      </p>
                      <div className="h-1.5 rounded-full bg-white/20 w-3/4" />
                      <div className="h-1.5 rounded-full bg-white/15 w-1/2" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/60">
                      <span>{template.designData?.blocks?.length || 1} diapositives/blocs</span>
                      <span>{template.category}</span>
                    </div>
                  </div>
                )}

                {/* Hover overlay for preview */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-white/90 text-gray-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Icon name="EyeIcon" size={13} />
                    Aperçu interactif
                  </span>
                </div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                  {template.isNew && (
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-700 rounded-lg shadow-sm">
                      Nouveau
                    </span>
                  )}
                  {template.isPremium && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-700 rounded-lg shadow-sm">
                      Pro
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h3 className="font-700 text-foreground text-sm line-clamp-1">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">par {template.author}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-700">
                      <Icon name="StarIcon" size={13} />
                      {template.rating}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {template.description || 'Template de portfolio clé en main.'}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[11px] rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="ArrowDownTrayIcon" size={12} />
                    {template.downloads.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      title="Prévisualiser le template"
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      <Icon name="EyeIcon" size={14} />
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-700 hover:opacity-90 transition-all shadow-sm"
                    >
                      <Icon name="PencilSquareIcon" size={13} />
                      Utiliser
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={(tpl) => {
          setPreviewTemplate(null);
          handleUseTemplate(tpl);
        }}
      />
    </div>
  );
}
