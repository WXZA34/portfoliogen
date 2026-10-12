'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { extractTemplateSlides, type MarketplaceTemplateItem } from '@/lib/services/marketplaceService';
import SlideRenderer from './SlideRenderer';

interface TemplateCardProps {
  template: MarketplaceTemplateItem;
  onPreview: (template: MarketplaceTemplateItem) => void;
  onUse: (template: MarketplaceTemplateItem) => void;
}

export default function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Extract all high-fidelity slides (from previewSlides, PDF image elements, or design blocks)
  const slides = React.useMemo(() => {
    return extractTemplateSlides(template);
  }, [template]);

  const blocks = template.designData?.blocks || [];
  const hasBlocks = blocks.length > 0;
  const totalSlidesCount = hasBlocks ? blocks.length : (slides.length || 1);

  // When mouse enters, start auto-scrolling through slides like Canva
  useEffect(() => {
    if (isHovered && totalSlidesCount > 1) {
      timerRef.current = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % totalSlidesCount);
      }, 1200); // 1.2s per slide for dynamic, smooth presentation cycling
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSlideIndex(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, totalSlidesCount]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all group flex flex-col shadow-xs hover:shadow-xl duration-300"
    >
      {/* 16:9 Presentation Canvas Container */}
      <div
        className="w-full aspect-[16/9] relative overflow-hidden bg-neutral-900 cursor-pointer select-none"
        onClick={() => onPreview(template)}
      >
        <SlideRenderer
          block={hasBlocks ? blocks[slideIndex % blocks.length] : null}
          template={template}
          slideIndex={slideIndex}
          fallbackUrl={slides[slideIndex % Math.max(1, slides.length)] || template.previewThumbnail}
          className="w-full h-full"
        />

        {/* Canva-style slide progress pill indicator on hover */}
        {totalSlidesCount > 1 && isHovered && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full z-20 animate-in fade-in duration-200 max-w-[75%] overflow-hidden">
            {Array.from({ length: Math.min(totalSlidesCount, 10) }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === (slideIndex % Math.min(totalSlidesCount, 10)) ? 'w-3.5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter badge (like "3 sur 12" on Canva) */}
        <div className="absolute bottom-2.5 left-2.5 z-20">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs shadow-sm">
            {totalSlidesCount > 1 && isHovered
              ? `${slideIndex + 1} sur ${totalSlidesCount}`
              : `${totalSlidesCount} page${totalSlidesCount > 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Top Badges (New, Pro, etc.) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          {template.isNew && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-md shadow-xs">
              Nouveau
            </span>
          )}
          {template.isPremium && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md shadow-xs">
              PRO
            </span>
          )}
        </div>

        {/* Quick Preview Hover Trigger */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/95 text-gray-950 text-xs font-bold shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
            <Icon name="EyeIcon" size={13} />
            Aperçu plein écran
          </div>
        </div>
      </div>

      {/* Card Details Footer */}
      <div className="p-3.5 flex-1 flex flex-col justify-between bg-card">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {template.name}
              </h3>
              <p className="text-[11px] text-muted-foreground">par {template.author}</p>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold flex-shrink-0">
              <Icon name="StarIcon" size={12} />
              {template.rating}
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1 mb-2.5">
            {template.description || 'Template prêt à l\'emploi.'}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {template.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-border mt-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Icon name="ArrowDownTrayIcon" size={11} />
            {template.downloads.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPreview(template)}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              title="Aperçu du modèle"
            >
              <Icon name="EyeIcon" size={13} />
            </button>
            <button
              onClick={() => onUse(template)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-xs"
            >
              <Icon name="PencilSquareIcon" size={12} />
              Personnaliser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
