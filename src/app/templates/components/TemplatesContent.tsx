'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getMarketplaceTemplates, type MarketplaceTemplateItem } from '@/lib/services/marketplaceService';
import TemplatePreviewModal from './TemplatePreviewModal';
import TemplateCard from './TemplateCard';

const categories = ['Tous', 'Tech', 'Design', 'Finance', 'Médecine', 'Journalisme', 'Architecture', 'Mode', 'Business'];
const themes = ['Tous', 'Minimaliste', 'Bold', 'Dark', 'Coloré', 'Pitch Deck'];

export default function TemplatesContent() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedTheme, setSelectedTheme] = useState('Tous');
  const [search, setSearch] = useState('');
  const [templatesList, setTemplatesList] = useState<MarketplaceTemplateItem[]>([]);
  const [myTemplateIds, setMyTemplateIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplateItem | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const items = await getMarketplaceTemplates();
      setTemplatesList(items);

      // Check saved templates from my_templates to know which ones belong to current user
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: myData } = await supabase.from('my_templates').select('id, name');
      if (myData) {
        const identifiers = myData.flatMap((d) => [d.id, d.name]);
        setMyTemplateIds(identifiers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromMarketplace = async (template: MarketplaceTemplateItem) => {
    if (!confirm(`Voulez-vous retirer le template "${template.name}" de la Marketplace ?`)) return;
    try {
      const { removeFromMarketplace } = await import('@/lib/services/marketplaceService');
      await removeFromMarketplace(template.id);
      if (template.originalTemplateId) await removeFromMarketplace(template.originalTemplateId);
      await removeFromMarketplace(template.name);
      toast.success(`Le template "${template.name}" a été retiré de la Marketplace.`);
      if (previewTemplate?.id === template.id) {
        setPreviewTemplate(null);
      }
      fetchTemplates();
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur lors du retrait du template : ' + err.message);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((template) => {
            const isMine =
              myTemplateIds.includes(template.id) ||
              (template.originalTemplateId && myTemplateIds.includes(template.originalTemplateId)) ||
              myTemplateIds.includes(template.name);

            return (
              <TemplateCard
                key={template.id}
                template={template}
                isMyTemplate={isMine}
                onPreview={(tpl) => setPreviewTemplate(tpl)}
                onUse={handleUseTemplate}
                onRemove={handleRemoveFromMarketplace}
              />
            );
          })}
        </div>
      )}

      {/* Interactive Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        isMyTemplate={
          !!previewTemplate &&
          (myTemplateIds.includes(previewTemplate.id) ||
            (previewTemplate.originalTemplateId && myTemplateIds.includes(previewTemplate.originalTemplateId)) ||
            myTemplateIds.includes(previewTemplate.name))
        }
        onClose={() => setPreviewTemplate(null)}
        onUse={(tpl) => {
          setPreviewTemplate(null);
          handleUseTemplate(tpl);
        }}
        onRemove={handleRemoveFromMarketplace}
        relatedTemplates={templatesList}
      />
    </div>
  );
}
