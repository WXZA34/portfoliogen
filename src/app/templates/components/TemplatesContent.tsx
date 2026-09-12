'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  author: string;
  category: string;
  theme: string;
  downloads: number;
  rating: number;
  preview: string;
  tags: string[];
  isPremium: boolean;
  isNew?: boolean;
}

const categories = ['Tous', 'Tech', 'Design', 'Finance', 'Médecine', 'Journalisme', 'Architecture', 'Mode'];
const themes = ['Tous', 'Minimaliste', 'Bold', 'Dark', 'Coloré', 'Saisonnier'];

const templates: Template[] = [
  { id: '1', name: 'Dev Minimal Pro', author: 'Lucas M.', category: 'Tech', theme: 'Minimaliste', downloads: 1240, rating: 4.8, preview: '⬜', tags: ['React', 'TypeScript', 'Clean'], isPremium: false, isNew: false },
  { id: '2', name: 'Creative Bold', author: 'Emma R.', category: 'Design', theme: 'Bold', downloads: 876, rating: 4.9, preview: '🟦', tags: ['UI/UX', 'Branding', 'Creative'], isPremium: true, isNew: true },
  { id: '3', name: 'Dark Engineer', author: 'Karim B.', category: 'Tech', theme: 'Dark', downloads: 2100, rating: 4.7, preview: '⬛', tags: ['Backend', 'DevOps', 'Dark'], isPremium: false },
  { id: '4', name: 'Medical Clean', author: 'Sophie L.', category: 'Médecine', theme: 'Minimaliste', downloads: 432, rating: 4.6, preview: '🟩', tags: ['Santé', 'Clinique', 'Pro'], isPremium: false },
  { id: '5', name: 'Finance Elite', author: 'Marc D.', category: 'Finance', theme: 'Bold', downloads: 654, rating: 4.5, preview: '🟨', tags: ['Finance', 'Consulting', 'Premium'], isPremium: true },
  { id: '6', name: 'Journaliste Story', author: 'Léa P.', category: 'Journalisme', theme: 'Coloré', downloads: 321, rating: 4.4, preview: '🟧', tags: ['Presse', 'Rédaction', 'Story'], isPremium: false, isNew: true },
  { id: '7', name: 'Archi Blueprint', author: 'Tom A.', category: 'Architecture', theme: 'Minimaliste', downloads: 567, rating: 4.7, preview: '🟫', tags: ['Architecture', 'CAD', 'Portfolio'], isPremium: false },
  { id: '8', name: 'Mode Éditoriale', author: 'Chloé V.', category: 'Mode', theme: 'Bold', downloads: 789, rating: 4.8, preview: '🟪', tags: ['Fashion', 'Luxe', 'Éditorial'], isPremium: true, isNew: true },
  { id: '9', name: 'Hiver 2026', author: 'PortfolioGen', category: 'Tech', theme: 'Saisonnier', downloads: 1890, rating: 4.9, preview: '❄️', tags: ['Saisonnier', 'Hiver', 'Tendance'], isPremium: false, isNew: true },
];

export default function TemplatesContent() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedTheme, setSelectedTheme] = useState('Tous');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const filtered = templates.filter((t) => {
    const matchCat = selectedCategory === 'Tous' || t.category === selectedCategory;
    const matchTheme = selectedTheme === 'Tous' || t.theme === selectedTheme;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchTheme && matchSearch;
  });

  const handleUseTemplate = (template: Template) => {
    toast.success(`Template "${template.name}" appliqué à votre studio !`);
  };

  const handlePublishTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Donnez un nom à votre template');
      return;
    }
    toast.success(`Template "${newTemplateName}" publié sur la marketplace !`);
    setShowCreateModal(false);
    setNewTemplateName('');
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
            placeholder="Rechercher un template..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all flex-shrink-0"
        >
          <Icon name="PlusIcon" size={15} />
          Créer & partager
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
                selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
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
        <span className="font-600 text-foreground">{filtered.length} templates</span>
        <span>·</span>
        <span>{templates.filter(t => t.isNew).length} nouveaux cette semaine</span>
        <span>·</span>
        <span>{templates.reduce((acc, t) => acc + t.downloads, 0).toLocaleString()} téléchargements au total</span>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div key={template.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group">
            {/* Preview */}
            <div className="h-40 bg-muted flex items-center justify-center text-6xl relative">
              {template.preview}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-all" />
              <div className="absolute top-3 right-3 flex gap-1.5">
                {template.isNew && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-700 rounded-lg">Nouveau</span>
                )}
                {template.isPremium && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-700 rounded-lg">Pro</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-700 text-foreground text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">par {template.author}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-700">
                  <Icon name="StarIcon" size={12} />
                  {template.rating}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map((tag, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Icon name="DownloadIcon" size={11} />
                  {template.downloads.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-all">
                    <Icon name="EyeIcon" size={13} />
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 transition-all"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-modal">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-700 text-foreground">Créer un template</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="XIcon" size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Nom du template</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Mon Super Template"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Catégorie</label>
                <select className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {categories.filter(c => c !== 'Tous').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez votre template..."
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-muted text-muted-foreground rounded-xl text-sm font-600">
                  Annuler
                </button>
                <button onClick={handlePublishTemplate} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-600">
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
