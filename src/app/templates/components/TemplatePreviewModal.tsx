'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import { extractTemplateSlides, type MarketplaceTemplateItem } from '@/lib/services/marketplaceService';
import SlideRenderer from './SlideRenderer';

interface TemplatePreviewModalProps {
  template: MarketplaceTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (template: MarketplaceTemplateItem) => void;
  onRemove?: (template: MarketplaceTemplateItem) => void;
  isMyTemplate?: boolean;
  relatedTemplates?: MarketplaceTemplateItem[];
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onUse,
  onRemove,
  isMyTemplate,
  relatedTemplates = [],
}: TemplatePreviewModalProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Compute slides array using high-fidelity extraction
  const slides = useMemo(() => {
    if (!template) return [];
    return extractTemplateSlides(template);
  }, [template]);

  const blocks = template?.designData?.blocks || [];
  const hasBlocks = blocks.length > 0;
  const totalSlides = hasBlocks ? blocks.length : (slides.length > 0 ? slides.length : 1);

  // Reset slide index on template change
  useEffect(() => {
    setActiveSlide(0);
  }, [template?.id]);

  // Keyboard navigation (Left, Right, Escape)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveSlide((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalSlides, onClose]);

  if (!isOpen || !template) return null;

  // Related templates from the same category or overall recommendations
  const sameCategoryList = relatedTemplates
    .filter((t) => t.id !== template.id)
    .slice(0, 8);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Top Floating Bar */}
        <div className="px-6 py-3.5 border-b border-border flex items-center justify-between bg-muted/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Marketplace</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs font-semibold text-foreground truncate max-w-[250px] sm:max-w-md">{template.name}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <Icon name="XIcon" size={18} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          
          {/* Main Top Section: Viewer on Left + Creator Info & Actions on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: 16:9 Presentation Stage & Slide Carousel Strip */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              
              {/* Main Stage (16:9) */}
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-950 relative shadow-xl border border-border group select-none">
                <SlideRenderer
                  block={hasBlocks ? blocks[activeSlide] : null}
                  template={template}
                  slideIndex={activeSlide}
                  fallbackUrl={slides[activeSlide] || slides[0] || template.previewThumbnail}
                  className="w-full h-full"
                />

                {/* Prev / Next Slide Arrows */}
                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                      disabled={activeSlide === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center disabled:opacity-20 transition-all shadow-md backdrop-blur-xs z-20 cursor-pointer"
                      title="Diapositive précédente"
                    >
                      <Icon name="ChevronLeftIcon" size={20} />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
                      disabled={activeSlide >= totalSlides - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center disabled:opacity-20 transition-all shadow-md backdrop-blur-xs z-20 cursor-pointer"
                      title="Diapositive suivante"
                    >
                      <Icon name="ChevronRightIcon" size={20} />
                    </button>
                  </>
                )}

                {/* Bottom Left Slide Badge */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-xs z-20">
                  {activeSlide + 1} sur {totalSlides}
                </div>
              </div>

              {/* Thumbnails Strip with Left/Right Buttons (Identical to Canva) */}
              {totalSlides > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`relative w-28 sm:w-32 aspect-[16/9] rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 border-2 cursor-pointer ${
                        activeSlide === idx
                          ? 'border-primary ring-2 ring-primary/30 scale-102 shadow-md'
                          : 'border-border/60 opacity-60 hover:opacity-100 hover:border-border'
                      }`}
                    >
                      <SlideRenderer
                        block={hasBlocks ? blocks[idx] : null}
                        template={template}
                        slideIndex={idx}
                        fallbackUrl={slides[idx] || slides[0] || template.previewThumbnail}
                        isThumbnail={true}
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/75 text-white z-10 pointer-events-none backdrop-blur-xs">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right 4 Cols: Creator Information, Badges & Action Buttons */}
            <div className="lg:col-span-4 flex flex-col space-y-5 bg-muted/15 p-5 rounded-2xl border border-border">
              
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
                  {template.name}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Présentation, 1920 × 1080 px • {template.category}
                </p>
              </div>

              {/* Creator Info Header with Avatar & Subscribe Button */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {template.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Voir plus de {template.author}</p>
                    <p className="text-[11px] text-muted-foreground">Créateur certifié PortfolioGen</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSubscribed
                      ? 'bg-muted text-foreground border-border'
                      : 'bg-card text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {isSubscribed ? 'Abonné' : "S'abonner"}
                </button>
              </div>

              {/* Primary Call To Actions (Personnaliser ce modèle) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUse(template)}
                    className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all"
                  >
                    <Icon name="PencilSquareIcon" size={16} />
                    Personnaliser ce modèle
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-xl border border-border transition-all ${
                      isFavorite ? 'text-amber-500 bg-amber-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title="Ajouter aux favoris"
                  >
                    <Icon name={isFavorite ? 'StarIcon' : 'BookmarkIcon'} size={18} />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Lien du template copié dans le presse-papier !');
                    }}
                    className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    title="Partager"
                  >
                    <Icon name="ShareIcon" size={18} />
                  </button>
                </div>

                <button
                  onClick={() => onUse(template)}
                  className="w-full py-2.5 px-4 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center text-[9px] text-white font-bold">
                    ✦
                  </span>
                  Modifier avec l'IA
                </button>

                {isMyTemplate && onRemove && (
                  <button
                    onClick={() => onRemove(template)}
                    className="w-full py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Icon name="TrashIcon" size={14} />
                    Retirer de la Marketplace
                  </button>
                )}
              </div>

              {/* Description & Tags */}
              <div className="pt-3 border-t border-border space-y-2">
                <h3 className="text-xs font-bold text-foreground">À propos de ce modèle</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.description || "Présentation professionnelle haute fidélité adaptée pour les portfolios, études de cas et pitch decks."}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {template.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats pill */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                <span className="flex items-center gap-1">
                  <Icon name="ArrowDownTrayIcon" size={13} />
                  {template.downloads.toLocaleString()} utilisations
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Icon name="StarIcon" size={13} />
                  {template.rating} / 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section: "Voir plus" (Recommendations from same category) */}
          <div className="pt-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground">Voir plus</h2>
                <p className="text-xs text-muted-foreground">Modèles similaires dans la catégorie {template.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sameCategoryList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveSlide(0);
                    // switch current preview template
                    onClose();
                    // trigger preview for this item
                    setTimeout(() => onUse(item), 50);
                  }}
                  className="group cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900 relative">
                    {item.previewThumbnail ? (
                      <img
                        src={item.previewThumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full p-3 flex flex-col justify-end text-white" style={{ backgroundColor: item.previewColor || '#1e293b' }}>
                        <p className="text-xs font-bold truncate">{item.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
