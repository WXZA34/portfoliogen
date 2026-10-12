'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { MarketplaceTemplateItem } from '@/lib/services/marketplaceService';

interface TemplatePreviewModalProps {
  template: MarketplaceTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (template: MarketplaceTemplateItem) => void;
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onUse,
}: TemplatePreviewModalProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen || !template) return null;

  const blocks = template.designData?.blocks || [];
  const currentBlock = blocks[activeSlide] || blocks[0];
  const globalStyle = template.designData?.globalStyle;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-sm"
              style={{ backgroundColor: globalStyle?.primaryColor || template.previewColor || '#7c3aed' }}
            >
              {template.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{template.name}</h2>
                {template.isPremium && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">PRO</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Créé par <span className="font-semibold text-foreground">{template.author}</span> • Catégorie {template.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUse(template)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 shadow-md transition-all"
            >
              <Icon name="PencilSquareIcon" size={14} />
              Utiliser ce template
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon name="XIcon" size={18} />
            </button>
          </div>
        </div>

        {/* Center Preview Stage */}
        <div className="flex-1 bg-neutral-900/95 overflow-hidden flex flex-col relative p-4 items-center justify-center">
          {/* Main Slide / Page Canvas Simulation */}
          <div className="w-full h-full max-w-3xl max-h-[500px] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-white/10 relative transition-all"
               style={{ backgroundColor: currentBlock?.style?.bgColor || globalStyle?.bgColor || '#ffffff' }}>
            {/* Header of the simulated page */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-between"
                 style={{ color: currentBlock?.style?.textColor || '#000000' }}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {currentBlock?.type || 'Page'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
                  {currentBlock?.content?.name || currentBlock?.content?.title || template.name}
                </h1>
                <p className="text-sm opacity-80 mt-2 max-w-lg leading-relaxed">
                  {currentBlock?.content?.tagline || currentBlock?.content?.text || template.description}
                </p>
              </div>

              {/* Elements or Cards Simulation */}
              {currentBlock?.layout?.elements && currentBlock.layout.elements.length > 0 ? (
                <div className="relative w-full h-44 rounded-lg bg-black/5 border border-dashed border-black/10 overflow-hidden mt-4">
                  {currentBlock.layout.elements.slice(0, 5).map((el, i) => (
                    <div
                      key={el.id || i}
                      className="absolute p-2 rounded text-xs truncate shadow-xs"
                      style={{
                        left: `${Math.min(Number(el.x) || 20, 300)}px`,
                        top: `${Math.min(Number(el.y) || 20, 100)}px`,
                        backgroundColor: el.style?.backgroundColor || '#ffffff',
                        color: el.style?.color || '#000000',
                      }}
                    >
                      {el.content || el.type}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {['Projet 1', 'Projet 2', 'Projet 3'].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-black/10 bg-black/5 flex flex-col justify-between h-20"
                    >
                      <p className="text-xs font-bold truncate">{item}</p>
                      <div className="h-1.5 rounded-full bg-black/20 w-3/4" />
                    </div>
                  ))}
                </div>
              )}

              {/* Footer CTA of Slide */}
              <div className="pt-4 flex items-center justify-between border-t border-black/10 text-xs opacity-70">
                <span>Page {activeSlide + 1} sur {blocks.length || 1}</span>
                <span className="font-semibold">{template.theme} Style</span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {blocks.length > 1 && (
            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none">
              <button
                onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                disabled={activeSlide === 0}
                className="w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black pointer-events-auto disabled:opacity-30 transition-all shadow-lg"
              >
                <Icon name="ChevronLeftIcon" size={20} />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => Math.min(blocks.length - 1, prev + 1))}
                disabled={activeSlide >= blocks.length - 1}
                className="w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black pointer-events-auto disabled:opacity-30 transition-all shadow-lg"
              >
                <Icon name="ChevronRightIcon" size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Page Thumbnails Strip */}
        <div className="p-3 bg-muted/40 border-t border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {blocks.map((b, idx) => (
              <button
                key={b.id || idx}
                onClick={() => setActiveSlide(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeSlide === idx
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Diapo {idx + 1} : {b.type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
            <span className="flex items-center gap-1">
              <Icon name="ArrowDownTrayIcon" size={13} /> {template.downloads}
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Icon name="StarIcon" size={13} /> {template.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
