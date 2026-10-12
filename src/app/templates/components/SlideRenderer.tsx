'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import type { Block, BlockElement } from '@/app/portfolio-editor/components/PortfolioEditorContent';
import { BlockRenderer } from '@/app/portfolio-editor/components/CanvasEditor';
import type { MarketplaceTemplateItem } from '@/lib/services/marketplaceService';

interface SlideRendererProps {
  block?: Block | null;
  template?: MarketplaceTemplateItem | null;
  slideIndex?: number;
  fallbackUrl?: string;
  isThumbnail?: boolean;
  className?: string;
}

export default function SlideRenderer({
  block,
  template,
  slideIndex = 0,
  fallbackUrl,
  isThumbnail = false,
  className = '',
}: SlideRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Target slide presentation canvas resolution (16:9 standard: 1280x720)
  const presWidth = template?.designData?.globalStyle?.presentationWidth || 1280;
  const presHeight = template?.designData?.globalStyle?.presentationHeight || 720;

  // Scale state for proportional fitting inside the container
  const [scale, setScale] = useState<number>(isThumbnail ? 0.1 : 0.6);

  // Dynamically recalculate scale on resize to fit container width
  const updateScale = React.useCallback(() => {
    if (containerRef.current) {
      const cw = containerRef.current.clientWidth;
      if (cw > 0) {
        setScale(cw / presWidth);
      }
    }
  }, [presWidth]);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      updateScale();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  // Determine slide background color and image
  const globalBg = template?.designData?.globalStyle?.bgColor || template?.previewColor || '#0f172a';
  const slideBgColor = block?.style?.bgColor || globalBg;
  
  let slideBgImage: string | undefined = undefined;
  if (block?.style?.backgroundImage) {
    const raw = block.style.backgroundImage;
    const match = raw.match(/url\(['"]?([^'"]+)['"]?\)/);
    slideBgImage = match ? match[1] : raw;
  }

  // Check if we have freeform slide elements
  const isFreeform = block?.layout?.type === 'freeform' && Array.isArray(block.layout.elements) && block.layout.elements.length > 0;
  const elements: BlockElement[] = isFreeform ? (block!.layout!.elements!) : [];

  // If there is no block at all and we have a fallback image URL, render the image
  if (!block && fallbackUrl) {
    return (
      <div ref={containerRef} className={`w-full h-full relative overflow-hidden bg-neutral-950 ${className}`}>
        <img
          src={fallbackUrl}
          alt={`Slide ${slideIndex + 1}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    );
  }

  // If there's neither a block nor a fallback, render a clean procedural slide
  if (!block && !fallbackUrl) {
    return (
      <div
        ref={containerRef}
        className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-6 text-white select-none ${className}`}
        style={{ backgroundColor: globalBg }}
      >
        <div className="flex items-center justify-between text-[11px] opacity-70 uppercase tracking-widest font-bold">
          <span>{template?.category || 'Présentation'}</span>
          <span>Slide {slideIndex + 1}</span>
        </div>
        <div className="my-auto">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">{template?.name || 'Diapositive'}</h3>
          <p className="text-xs opacity-75 mt-1">{template?.description || 'Présentation professionnelle PortfolioGen'}</p>
        </div>
        <div className="text-[10px] opacity-50 flex items-center justify-between border-t border-white/10 pt-2">
          <span>{template?.author || 'PortfolioGen'}</span>
          <span>16:9 • 1920 × 1080</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none bg-neutral-950 ${className}`}
      style={{ aspectRatio: `${presWidth} / ${presHeight}` }}
    >
      {/* Absolute scaled slide canvas container */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${presWidth}px`,
          height: `${presHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          backgroundColor: slideBgColor,
          backgroundImage: slideBgImage ? `url(${slideBgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        {isFreeform ? (
          // Render full Freeform presentation slide with all elements in coordinate space
          elements.map((el) => {
            const px = typeof el.x === 'string' ? parseFloat(el.x) : (el.x || 0);
            const py = typeof el.y === 'string' ? parseFloat(el.y) : (el.y || 0);
            const pw = typeof el.width === 'string' ? parseFloat(el.width) : (el.width || 200);
            const ph = typeof el.height === 'string' ? parseFloat(el.height) : (el.height || 50);
            const rot = (el.style as any)?.rotation || 0;

            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${px}px`,
                  top: `${py}px`,
                  width: `${pw}px`,
                  height: `${ph}px`,
                  zIndex: el.zIndex || 1,
                  transform: rot ? `rotate(${rot}deg)` : undefined,
                  display: 'flex',
                  alignItems: 'flex-start',
                  ...el.style,
                }}
              >
                {el.type === 'text' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      fontSize: el.style?.fontSize || '16px',
                      fontFamily: el.style?.fontFamily || template?.designData?.globalStyle?.fontBody || 'inherit',
                      fontWeight: el.style?.fontWeight || 'normal',
                      fontStyle: el.style?.fontStyle || 'normal',
                      color: el.style?.color || block?.style?.textColor || '#ffffff',
                      backgroundColor: el.style?.backgroundColor || 'transparent',
                      textAlign: (el.style?.textAlign as any) || 'left',
                      lineHeight: el.style?.lineHeight || 1.3,
                      letterSpacing: el.style?.letterSpacing || 'normal',
                      textDecoration: el.style?.textDecoration || 'none',
                    }}
                  >
                    {el.content}
                  </div>
                )}

                {el.type === 'image' && (
                  <img
                    src={el.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: (el.style?.objectFit as any) || 'cover',
                      borderRadius: el.style?.borderRadius || '0px',
                      opacity: el.style?.opacity ?? 1,
                    }}
                    draggable={false}
                  />
                )}

                {el.type === 'shape' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: el.style?.backgroundColor || '#cccccc',
                      borderRadius: el.style?.borderRadius || '0px',
                      border: el.style?.border || 'none',
                      clipPath: el.style?.clipPath || 'none',
                      opacity: el.style?.opacity ?? 1,
                    }}
                  />
                )}

                {el.type === 'button' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: el.style?.backgroundColor || block?.style?.accentColor || '#7c3aed',
                      color: el.style?.color || '#ffffff',
                      borderRadius: el.style?.borderRadius || '9999px',
                      fontWeight: 'bold',
                      fontSize: el.style?.fontSize || '14px',
                    }}
                  >
                    {el.content}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Render standard Block type (hero, about, projects, etc.) scaled as a slide
          <div style={{ width: `${presWidth}px`, height: `${presHeight}px`, overflow: 'hidden' }}>
            <BlockRenderer
              block={block!}
              previewMode="desktop"
              showPreview={true}
              scale={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
