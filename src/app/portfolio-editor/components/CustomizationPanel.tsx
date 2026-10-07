'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Block, PortfolioDesign } from './PortfolioEditorContent';

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
              <Icon name="LayoutIcon" size={14} className="text-primary" />
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
                    <Icon name={a === 'left' ? 'AlignLeftIcon' : a === 'center' ? 'AlignCenterIcon' : 'AlignRightIcon'} size={12} />
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
            <Icon name="MousePointerIcon" size={32} className="text-muted-foreground mb-3" />
            <p className="text-sm font-600 text-foreground">Aucun bloc sélectionné</p>
            <p className="text-xs text-muted-foreground mt-1">Cliquez sur un bloc dans le canvas pour le personnaliser</p>
          </div>
        )}
      </div>
    </div>
  );
}
