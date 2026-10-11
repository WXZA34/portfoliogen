'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Block, PortfolioDesign } from './PortfolioEditorContent';
import { createClient } from '@/lib/supabase/client';

const COLORS = [
  '#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706', '#0891b2',
  '#7c3aed', '#db2777', '#111827', '#374151', '#6b7280', '#ffffff',
];

const FONTS = [
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Manrope', value: 'Manrope' },
  { label: 'Fraunces (Serif)', value: 'Fraunces' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
];

const RADIUS_OPTIONS = [
  { label: 'Aucun', value: 'none' },
  { label: 'Petit', value: 'sm' },
  { label: 'Moyen', value: 'md' },
  { label: 'Grand', value: 'lg' },
  { label: 'Complet', value: 'full' },
];

interface CustomizationPanelProps {
  design: PortfolioDesign;
  selectedBlock: Block | null;
  onUpdateDesign: React.Dispatch<React.SetStateAction<PortfolioDesign>>;
  onUpdateBlock: (block: Block) => void;
}

type Tab = 'global' | 'block';

export default function CustomizationPanel({ design, selectedBlock, onUpdateDesign, onUpdateBlock }: CustomizationPanelProps) {
  const [tab, setTab] = useState<Tab>(selectedBlock ? 'block' : 'global');
  const [openGalleryId, setOpenGalleryId] = useState<string | null>(null);

  const updateGlobal = (key: keyof PortfolioDesign['globalStyle'], value: string | boolean) => {
    onUpdateDesign((prev) => ({ ...prev, globalStyle: { ...prev.globalStyle, [key]: value } }));
  };

  const updateBlockStyle = (key: keyof Block['style'], value: string) => {
    if (!selectedBlock) return;
    onUpdateBlock({ ...selectedBlock, style: { ...selectedBlock.style, [key]: value } });
  };

  const updateBlockContent = (key: string, value: string) => {
    if (!selectedBlock) return;
    onUpdateBlock({ ...selectedBlock, content: { ...selectedBlock.content, [key]: value } });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab('global')}
          className={`flex-1 py-2.5 text-xs font-600 transition-all border-b-2 ${tab === 'global' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Style Global
        </button>
        <button
          onClick={() => setTab('block')}
          disabled={!selectedBlock}
          className={`flex-1 py-2.5 text-xs font-600 transition-all border-b-2 disabled:opacity-40 ${tab === 'block' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Bloc Sélectionné
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {tab === 'global' && (
          <>
            {/* Theme Presets */}
            <div className="mb-4">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Thèmes Prédéfinis</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cyberpunk', label: 'Cyberpunk', bg: '#0f172a', primary: '#10b981', dark: true, fontHead: 'JetBrains Mono' },
                  { id: 'minimalist', label: 'Minimaliste', bg: '#ffffff', primary: '#111827', dark: false, fontHead: 'DM Sans' },
                  { id: 'elegant', label: 'Élégant', bg: '#fdfbf7', primary: '#9d174d', dark: false, fontHead: 'Fraunces' },
                  { id: 'corporate', label: 'Corporate', bg: '#f8fafc', primary: '#2563eb', dark: false, fontHead: 'Plus Jakarta Sans' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      updateGlobal('bgColor', preset.bg);
                      updateGlobal('primaryColor', preset.primary);
                      updateGlobal('darkMode', preset.dark);
                      updateGlobal('fontHeading', preset.fontHead);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all group"
                  >
                    <div className="w-full h-8 rounded-md mb-2 flex overflow-hidden shadow-sm border border-border/50">
                      <div className="flex-1" style={{ backgroundColor: preset.bg }}></div>
                      <div className="w-1/3" style={{ backgroundColor: preset.primary }}></div>
                    </div>
                    <span className="text-xs font-700 text-foreground group-hover:text-primary transition-colors">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Color */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Couleur Principale</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateGlobal('primaryColor', color)}
                    className={`w-7 h-7 rounded-lg border-2 transition-all ${design.globalStyle.primaryColor === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.globalStyle.primaryColor}
                  onChange={(e) => updateGlobal('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={design.globalStyle.primaryColor}
                  onChange={(e) => updateGlobal('primaryColor', e.target.value)}
                  className="flex-1 text-xs font-mono bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Couleur Secondaire</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.globalStyle.secondaryColor}
                  onChange={(e) => updateGlobal('secondaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={design.globalStyle.secondaryColor}
                  onChange={(e) => updateGlobal('secondaryColor', e.target.value)}
                  className="flex-1 text-xs font-mono bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Fond Global</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.globalStyle.bgColor}
                  onChange={(e) => updateGlobal('bgColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={design.globalStyle.bgColor}
                  onChange={(e) => updateGlobal('bgColor', e.target.value)}
                  className="flex-1 text-xs font-mono bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                />
              </div>
            </div>

            {/* Typography */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Police Titres</p>
              <select
                value={design.globalStyle.fontHeading}
                onChange={(e) => updateGlobal('fontHeading', e.target.value)}
                className="w-full text-xs bg-muted border border-border rounded-lg px-2 py-2 text-foreground"
              >
                {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Police Corps</p>
              <select
                value={design.globalStyle.fontBody}
                onChange={(e) => updateGlobal('fontBody', e.target.value)}
                className="w-full text-xs bg-muted border border-border rounded-lg px-2 py-2 text-foreground"
              >
                {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            {/* Border Radius */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Arrondi des Coins</p>
              <div className="grid grid-cols-5 gap-1">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => updateGlobal('borderRadius', r.value)}
                    className={`py-1.5 text-xs font-600 rounded-lg transition-all ${design.globalStyle.borderRadius === r.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <div>
                <p className="text-xs font-700 text-foreground">Mode Sombre</p>
                <p className="text-xs text-muted-foreground">Thème dark pour le portfolio</p>
              </div>
              <button
                onClick={() => updateGlobal('darkMode', !design.globalStyle.darkMode)}
                className={`relative w-10 h-5 rounded-full transition-colors ${design.globalStyle.darkMode ? 'bg-primary' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${design.globalStyle.darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </>
        )}

        {tab === 'block' && selectedBlock && (
          <>
            <div className="flex items-center gap-2 p-2.5 bg-secondary/30 rounded-xl border border-border">
              <Icon name="QueueListIcon" size={14} className="text-primary" />
              <p className="text-xs font-700 text-foreground capitalize">{selectedBlock.type}</p>
              <span className="text-xs text-muted-foreground ml-auto">#{selectedBlock.id.slice(-4)}</span>
            </div>

            {/* Block Content Editing */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Contenu</p>
              <div className="space-y-2">
                {Object.entries(selectedBlock.content).map(([key, value]) => {
                  if (Array.isArray(value)) {
                    return (
                      <div key={key}>
                        <label className="text-xs text-muted-foreground capitalize mb-1 block">{key}</label>
                        <textarea
                          value={(value as string[]).join(', ')}
                          onChange={(e) => updateBlockContent(key, e.target.value)}
                          rows={2}
                          className="w-full text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground resize-none"
                          placeholder="Séparés par des virgules"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground capitalize mb-1 block">{key}</label>
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => updateBlockContent(key, e.target.value)}
                        className="w-full text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedBlock.layout?.type === 'freeform' && selectedBlock.layout.elements && (
              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">Éléments Libres</p>
                  <div className="flex gap-1">
                    <button onClick={() => {
                      const newEl = { id: `el-${Date.now()}`, type: 'text' as const, content: 'Nouveau texte', x: '50', y: '50', width: '300', height: '50', style: { color: '#000000', fontSize: '18px' } };
                      onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
                    }} className="p-1 bg-muted hover:bg-primary/20 hover:text-primary rounded" title="Ajouter Texte"><Icon name="DocumentTextIcon" size={12} /></button>
                    <button onClick={() => {
                      const newEl = { id: `el-${Date.now()}`, type: 'image' as const, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', x: '100', y: '50', width: '300', height: '200', style: { borderRadius: '8px' } };
                      onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
                    }} className="p-1 bg-muted hover:bg-primary/20 hover:text-primary rounded" title="Ajouter Image"><Icon name="PhotoIcon" size={12} /></button>
                    <button onClick={() => {
                      const newEl = { id: `el-${Date.now()}`, type: 'shape' as const, x: '50', y: '150', width: '200', height: '100', style: { backgroundColor: '#e2e8f0', borderRadius: '16px' } };
                      onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
                    }} className="p-1 bg-muted hover:bg-primary/20 hover:text-primary rounded" title="Ajouter Forme/Cadre"><Icon name="StopIcon" size={12} /></button>
                    <button onClick={() => {
                      const newEl = { id: `el-${Date.now()}`, type: 'shape' as const, x: '50', y: '300', width: '150', height: '4', style: { backgroundColor: '#000000', borderRadius: '0' } };
                      onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
                    }} className="p-1 bg-muted hover:bg-primary/20 hover:text-primary rounded" title="Ajouter Ligne/Flèche"><Icon name="ArrowRightIcon" size={12} /></button>
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedBlock.layout.elements.map(el => (
                    <div key={el.id} className="p-2 border border-border rounded-lg bg-card space-y-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-700 uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground flex-1">{el.type}</span>
                          <button onClick={() => {
                            const currentZ = el.zIndex || 1;
                            const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, zIndex: currentZ + 1 } : e2);
                            onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                          }} className="text-muted-foreground hover:bg-muted p-1 rounded transition-colors" title="Mettre en avant (+Z)">
                            <Icon name="ArrowUpIcon" size={12} />
                          </button>
                          <button onClick={() => {
                            const currentZ = el.zIndex || 1;
                            const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, zIndex: Math.max(0, currentZ - 1) } : e2);
                            onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                          }} className="text-muted-foreground hover:bg-muted p-1 rounded transition-colors" title="Mettre en arrière (-Z)">
                            <Icon name="ArrowDownIcon" size={12} />
                          </button>
                          <button onClick={() => {
                            const newElements = selectedBlock.layout!.elements!.filter(e2 => e2.id !== el.id);
                            onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                          }} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors" title="Supprimer cet élément">
                            <Icon name="TrashIcon" size={12} />
                          </button>
                        </div>
                        
                        {/* Position et Taille */}
                        <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground w-3">X:</span>
                            <input type="text" value={el.x || ''} onChange={e => {
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, x: e.target.value } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }} className="w-full text-xs bg-muted border border-border rounded px-1.5 py-1" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground w-3">Y:</span>
                            <input type="text" value={el.y || ''} onChange={e => {
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, y: e.target.value } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }} className="w-full text-xs bg-muted border border-border rounded px-1.5 py-1" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground w-3">W:</span>
                            <input type="text" value={el.width || ''} onChange={e => {
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, width: e.target.value } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }} className="w-full text-xs bg-muted border border-border rounded px-1.5 py-1" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground w-3">H:</span>
                            <input type="text" value={el.height || ''} onChange={e => {
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, height: e.target.value } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }} className="w-full text-xs bg-muted border border-border rounded px-1.5 py-1" />
                          </div>
                        </div>

                        {/* Content / URL */}
                        {el.type === 'text' || el.type === 'button' ? (
                        <textarea
                          value={el.content || ''}
                          onChange={(e) => {
                            const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, content: e.target.value } : e2);
                            onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                          }}
                          className="w-full text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground resize-none"
                          rows={2}
                        />
                        ) : el.type === 'image' ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={el.url || ''}
                              onChange={(e) => {
                                const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, url: e.target.value } : e2);
                                onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                              }}
                              placeholder="URL de l'image"
                              className="w-full text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                            />
                            <div className="flex gap-2">
                              <label className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg text-[10px] font-700 cursor-pointer hover:bg-primary/20 transition-colors">
                                <Icon name="ArrowUpTrayIcon" size={10} /> Importer du PC
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  
                                  const supabase = createClient();
                                  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                                  
                                  // Alert user of upload start
                                  const btnLabel = e.target.parentElement;
                                  if (btnLabel) btnLabel.style.opacity = '0.5';

                                  const { data, error } = await supabase.storage.from('portfolios').upload(fileName, file);
                                  
                                  if (btnLabel) btnLabel.style.opacity = '1';

                                  if (error) {
                                    alert("Erreur d'importation Supabase : " + error.message + "\nAssurez-vous d'avoir créé un bucket 'portfolios' public dans votre projet Supabase.");
                                    console.error(error);
                                    return;
                                  }

                                  const { data: publicData } = supabase.storage.from('portfolios').getPublicUrl(fileName);
                                  const publicUrl = publicData.publicUrl;

                                  // Save to local library (just the URL)
                                  const lib = JSON.parse(localStorage.getItem('portfolio_images_lib') || '[]');
                                  localStorage.setItem('portfolio_images_lib', JSON.stringify([publicUrl, ...lib].slice(0, 10)));
                                  
                                  // Update element
                                  const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, url: publicUrl } : e2);
                                  onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                                }} />
                              </label>
                              <button onClick={() => {
                                setOpenGalleryId(openGalleryId === el.id ? null : el.id);
                              }} className="px-2 py-1.5 bg-muted text-muted-foreground border border-border rounded-lg text-[10px] font-700 hover:bg-muted/80 transition-colors" title="Ouvrir la galerie">
                                <Icon name="PhotoIcon" size={10} /> Galerie
                              </button>
                            </div>
                            
                            {openGalleryId === el.id && (
                              <div className="mt-2 p-2 border border-border rounded bg-muted/30 grid grid-cols-3 gap-2">
                                {JSON.parse(localStorage.getItem('portfolio_images_lib') || '[]').map((imgUrl: string, idx: number) => (
                                  <img 
                                    key={idx} 
                                    src={imgUrl} 
                                    alt="Gallery item" 
                                    className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 border border-transparent hover:border-primary"
                                    onClick={() => {
                                      const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, url: imgUrl } : e2);
                                      onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                                      setOpenGalleryId(null);
                                    }}
                                  />
                                ))}
                                {JSON.parse(localStorage.getItem('portfolio_images_lib') || '[]').length === 0 && (
                                  <div className="col-span-3 text-[10px] text-muted-foreground text-center py-2">La galerie est vide.</div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : null}

                      {/* Color (for text/button) */}
                      {(el.type === 'text' || el.type === 'button' || el.type === 'shape') && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Couleur:</span>
                          <input
                            type="color"
                            value={el.style?.color || el.style?.backgroundColor || '#000000'}
                            onChange={(e) => {
                              const prop = el.type === 'text' ? 'color' : 'backgroundColor';
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, [prop]: e.target.value } } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }}
                            className="w-6 h-6 rounded border border-border cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Font Size (for text) */}
                      {el.type === 'text' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Taille:</span>
                          <input
                            type="text"
                            value={el.style?.fontSize || '16px'}
                            onChange={(e) => {
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, fontSize: e.target.value } } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }}
                            className="flex-1 text-xs bg-muted border border-border rounded px-2 py-1 text-foreground"
                          />
                        </div>
                      )}

                      {/* Font Family (for text) */}
                      {el.type === 'text' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Police:</span>
                          <select
                            value={el.style?.fontFamily || ''}
                            onChange={(e) => {
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, fontFamily: e.target.value } } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }}
                            className="flex-1 text-xs bg-muted border border-border rounded px-2 py-1 text-foreground"
                          >
                            <option value="">Par défaut</option>
                            {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                          </select>
                        </div>
                      )}

                      {/* Text Decoration (underline) and Bold */}
                      {el.type === 'text' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Style:</span>
                          <button
                            onClick={() => {
                              const isBold = el.style?.fontWeight === 'bold';
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, fontWeight: isBold ? 'normal' : 'bold' } } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }}
                            className={`p-1.5 rounded border transition-colors ${el.style?.fontWeight === 'bold' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-border'}`}
                            title="Gras"
                          >
                            <Icon name="BoldIcon" size={12} />
                          </button>
                          <button
                            onClick={() => {
                              const isUnderline = el.style?.textDecoration === 'underline';
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, textDecoration: isUnderline ? 'none' : 'underline' } } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }}
                            className={`p-1.5 rounded border transition-colors ${el.style?.textDecoration === 'underline' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-border'}`}
                            title="Souligner"
                          >
                            <Icon name="UnderlineIcon" size={12} />
                          </button>
                          <button
                            onClick={() => {
                              const aligns = ['left', 'center', 'right'];
                              const currentAlign = el.style?.textAlign || 'left';
                              const nextAlign = aligns[(aligns.indexOf(currentAlign) + 1) % aligns.length];
                              const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, textAlign: nextAlign } } : e2);
                              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                            }}
                            className={`p-1.5 rounded border transition-colors bg-muted border-border text-muted-foreground hover:bg-border`}
                            title="Alignement"
                          >
                            <Icon name={el.style?.textAlign === 'center' ? 'Bars3Icon' : el.style?.textAlign === 'right' ? 'Bars3BottomRightIcon' : 'Bars3BottomLeftIcon'} size={12} />
                          </button>
                        </div>
                      )}

                      {/* Shape properties */}
                      {el.type === 'shape' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Forme:</span>
                          <button onClick={() => {
                            const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, borderRadius: '0', clipPath: 'none' } } : e2);
                            onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                          }} className={`p-1.5 rounded border transition-colors ${!el.style?.borderRadius || el.style?.borderRadius === '0' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}`} title="Rectangle">
                            <Icon name="StopIcon" size={12} />
                          </button>
                          <button onClick={() => {
                            const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, borderRadius: '9999px', clipPath: 'none' } } : e2);
                            onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                          }} className={`p-1.5 rounded border transition-colors ${el.style?.borderRadius === '9999px' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}`} title="Rond">
                            <Icon name="GlobeAltIcon" size={12} />
                          </button>
                          <button onClick={() => {
                            // Triangle
                            const newElements = selectedBlock.layout!.elements!.map(e2 => e2.id === el.id ? { ...e2, style: { ...e2.style, borderRadius: '0', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' } } : e2);
                            onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: newElements } });
                          }} className={`p-1.5 rounded border transition-colors ${el.style?.clipPath?.includes('polygon') ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}`} title="Triangle">
                            <Icon name="PlayIcon" size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Block Style */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Fond du Bloc</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedBlock.style.bgColor}
                  onChange={(e) => updateBlockStyle('bgColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedBlock.style.bgColor}
                  onChange={(e) => updateBlockStyle('bgColor', e.target.value)}
                  className="flex-1 text-xs font-mono bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Couleur du Texte</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedBlock.style.textColor}
                  onChange={(e) => updateBlockStyle('textColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedBlock.style.textColor}
                  onChange={(e) => updateBlockStyle('textColor', e.target.value)}
                  className="flex-1 text-xs font-mono bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Couleur d'Accent</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedBlock.style.accentColor}
                  onChange={(e) => updateBlockStyle('accentColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedBlock.style.accentColor}
                  onChange={(e) => updateBlockStyle('accentColor', e.target.value)}
                  className="flex-1 text-xs font-mono bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground"
                />
              </div>
            </div>

            {/* Padding */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Espacement</p>
              <div className="grid grid-cols-3 gap-1">
                {(['sm', 'md', 'lg'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateBlockStyle('padding', p)}
                    className={`py-1.5 text-xs font-600 rounded-lg transition-all ${selectedBlock.style.padding === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    {p === 'sm' ? 'Compact' : p === 'md' ? 'Normal' : 'Large'}
                  </button>
                ))}
              </div>
            </div>

            {/* Alignment */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Alignement</p>
              <div className="grid grid-cols-3 gap-1">
                {(['left', 'center', 'right'] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => updateBlockStyle('align', a)}
                    className={`py-1.5 text-xs font-600 rounded-lg transition-all flex items-center justify-center gap-1 ${selectedBlock.style.align === a ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    <Icon name={a === 'left' ? 'Bars3BottomLeftIcon' : a === 'center' ? 'Bars3Icon' : 'Bars3BottomRightIcon'} size={12} />
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Police</p>
              <select
                value={selectedBlock.style.fontFamily}
                onChange={(e) => updateBlockStyle('fontFamily', e.target.value)}
                className="w-full text-xs bg-muted border border-border rounded-lg px-2 py-2 text-foreground"
              >
                {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </>
        )}

        {tab === 'block' && !selectedBlock && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon name="CursorArrowRaysIcon" size={32} className="text-muted-foreground mb-3" />
            <p className="text-sm font-600 text-foreground">Aucun bloc sélectionné</p>
            <p className="text-xs text-muted-foreground mt-1">Cliquez sur un bloc dans le canvas pour le personnaliser</p>
          </div>
        )}
      </div>
    </div>
  );
}
