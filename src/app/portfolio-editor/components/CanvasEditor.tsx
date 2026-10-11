'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Block, BlockElement, PortfolioDesign } from './PortfolioEditorContent';
import CanvasElement from './CanvasElement';

interface CanvasEditorProps {
  design: PortfolioDesign;
  selectedBlockId: string | null;
  previewMode: 'desktop' | 'tablet' | 'mobile' | 'presentation';
  showPreview: boolean;
  dragOverIndex: number | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (block: Block) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDragStart: (id: string) => void;
  onDrop: (index: number) => void;
  onDragOver: (index: number | null) => void;
  onOpenCustomize: () => void;
  isPresentationMode?: boolean;
}

const CANVAS_WIDTHS = {
  desktop: 'max-w-3xl w-full',
  tablet: 'max-w-md w-full',
  mobile: 'max-w-xs w-full',
  presentation: '',
};

const PADDING_MAP: Record<string, string> = { none: 'py-0 px-0', sm: 'py-6 px-6', md: 'py-10 px-8', lg: 'py-16 px-10', xl: 'py-24 px-12' };
const ALIGN_MAP = { left: 'text-left items-start', center: 'text-center items-center', right: 'text-right items-end' };

export default function CanvasEditor({
  design, selectedBlockId, previewMode, showPreview, dragOverIndex,
  onSelectBlock, onUpdateBlock, onDeleteBlock, onMoveBlock, onDragStart, onDrop, onDragOver, onOpenCustomize,
  isPresentationMode = false
}: CanvasEditorProps) {
  const presWidth = design.globalStyle.presentationWidth || 1280;
  const presHeight = design.globalStyle.presentationHeight || 720;
  
  const canvasWidth = isPresentationMode ? '' : CANVAS_WIDTHS[previewMode];
  
  const blocksToRender = isPresentationMode 
    ? design.blocks.filter(b => b.id === selectedBlockId)
    : design.blocks;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isPresentationMode) {
      setScale(1);
      return;
    }
    const updateScale = () => {
      if (wrapperRef.current && wrapperRef.current.parentElement) {
        const parentWidth = wrapperRef.current.parentElement.clientWidth - 48; // 48px padding
        const newScale = Math.min(1, parentWidth / presWidth);
        setScale(newScale);
      }
    };
    window.addEventListener('resize', updateScale);
    updateScale();
    setTimeout(updateScale, 50);
    return () => window.removeEventListener('resize', updateScale);
  }, [isPresentationMode, selectedBlockId, showPreview, presWidth]);

  return (
    <div ref={wrapperRef} className="flex justify-center w-full" style={isPresentationMode ? { height: presHeight * scale } : {}}>
      <div 
        style={isPresentationMode ? { transform: `scale(${scale})`, transformOrigin: 'top center', width: presWidth, height: presHeight } : { width: '100%' }}
        className="flex justify-center"
      >
        <div className={`${canvasWidth} transition-all duration-300 mx-auto`} style={isPresentationMode ? { width: presWidth, height: presHeight, flexShrink: 0 } : {}}>
          {/* Canvas shadow wrapper */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 h-full w-full flex flex-col">
        {/* Browser chrome */}
        {!isPresentationMode && (
        <div className="bg-gray-200 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 font-mono">
            portfoliogen.io/{design.name.toLowerCase().replace(/\s+/g, '-')}
          </div>
        </div>
        )}

        {/* Blocks */}
        <div id="portfolio-canvas-export" className="flex-1" style={{ backgroundColor: design.globalStyle.bgColor, height: isPresentationMode ? '100%' : 'auto' }}>
          {blocksToRender.map((block, index) => {
            // In presentation mode, we don't show drop zones above/below the single slide
            const originalIndex = design.blocks.findIndex(b => b.id === block.id);
            return (
            <div key={block.id}>
              {/* Drop zone */}
              {!isPresentationMode && (
              <div
                onDragOver={(e) => { e.preventDefault(); onDragOver(originalIndex); }}
                onDrop={() => onDrop(originalIndex)}
                className={`h-1 transition-all ${dragOverIndex === originalIndex ? 'h-8 bg-primary/20 border-2 border-dashed border-primary rounded-lg mx-4 my-1' : ''}`}
              />
              )}

              {/* Block wrapper */}
              <div
                draggable
                onDragStart={() => onDragStart(block.id)}
                onDragEnd={() => onDragOver(null)}
                onClick={() => { onSelectBlock(block.id); onOpenCustomize(); }}
                className={`relative group transition-all duration-150 ${
                  showPreview ? '' : 'cursor-pointer ' + (selectedBlockId === block.id ? 'ring-2 ring-primary ring-inset' : 'hover:ring-1 hover:ring-primary/40 hover:ring-inset')
                }`}
              >
                {/* Block controls overlay */}
                {!showPreview && <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 transition-opacity ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className="flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'up'); }}
                      disabled={index === 0}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      title="Monter"
                    >
                      <Icon name="ChevronUpIcon" size={12} className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'down'); }}
                      disabled={index === design.blocks.length - 1}
                      className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      title="Descendre"
                    >
                      <Icon name="ChevronDownIcon" size={12} className="text-gray-700" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-0.5" />
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}
                      className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Icon name="TrashIcon" size={12} className="text-red-500" />
                    </button>
                    <div className="p-1.5 cursor-grab active:cursor-grabbing" title="Déplacer">
                      <Icon name="Bars2Icon" size={12} className="text-gray-400" />
                    </div>
                  </div>
                </div>}

                {/* Block type label */}
                {!showPreview && selectedBlockId === block.id && (
                  <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-700 px-2 py-0.5 rounded-md capitalize">
                    {block.type}
                  </div>
                )}

                {/* Render block */}
                <BlockRenderer 
                  block={block} 
                  previewMode={previewMode} 
                  showPreview={showPreview}
                  selectedBlockId={selectedBlockId}
                  onUpdateBlock={onUpdateBlock}
                  scale={scale}
                />
              </div>
            </div>
            );
          })}

          {/* Final drop zone */}
          {!isPresentationMode && (
          <div
            onDragOver={(e) => { e.preventDefault(); onDragOver(design.blocks.length); }}
            onDrop={() => onDrop(design.blocks.length)}
            className={`h-1 transition-all ${dragOverIndex === design.blocks.length ? 'h-8 bg-primary/20 border-2 border-dashed border-primary rounded-lg mx-4 my-1' : ''}`}
          />
          )}

          {/* Empty state */}
          {design.blocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Icon name="QueueListIcon" size={40} className="text-gray-300 mb-4" />
              <p className="text-sm font-600 text-gray-500">Canvas vide</p>
              <p className="text-xs text-gray-400 mt-1">Ajoutez des blocs depuis le panneau gauche</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

function BlockRenderer({ 
  block, previewMode, showPreview = false, selectedBlockId = null, onUpdateBlock = () => {}, scale = 1
}: { 
  block: Block; 
  previewMode: string;
  showPreview?: boolean;
  selectedBlockId?: string | null;
  onUpdateBlock?: (block: Block) => void;
  scale?: number;
}) {
  const padding = PADDING_MAP[block.style.padding] ?? 'py-10 px-8';
  const align = ALIGN_MAP[block.style.align] ?? 'text-left items-start';
  const isCompact = previewMode === 'mobile';

  const baseStyle = {
    backgroundColor: block.style.bgColor,
    color: block.style.textColor,
    fontFamily: block.style.fontFamily,
  };

  switch (block.type) {
    case 'hero':
      return (
        <div style={{ ...baseStyle, backgroundImage: `radial-gradient(circle at 50% -20%, ${block.style.accentColor}20, transparent 70%)` }} className={`${padding} flex flex-col ${align} gap-6 relative overflow-hidden`}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-900 shadow-xl border-4" style={{ backgroundColor: block.style.accentColor, color: '#fff', borderColor: `${block.style.bgColor}` }}>
            {(block.content.name as string)?.[0] ?? 'A'}
          </div>
          <div className={`flex flex-col ${align} gap-3 z-10`}>
            <h1 className={`font-900 leading-tight tracking-tight ${isCompact ? 'text-4xl' : 'text-5xl lg:text-6xl'}`} style={{ color: block.style.textColor }}>
              {block.content.name as string}
            </h1>
            <p className={`font-600 tracking-wide uppercase ${isCompact ? 'text-sm' : 'text-sm lg:text-base'}`} style={{ color: block.style.accentColor }}>
              {block.content.title as string}
            </p>
            <p className={`max-w-2xl opacity-80 leading-relaxed ${isCompact ? 'text-base' : 'text-lg lg:text-xl'}`}>{block.content.tagline as string}</p>
          </div>
          <button className="px-8 py-3.5 rounded-full font-700 text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 z-10" style={{ backgroundColor: block.style.accentColor, color: '#fff' }}>
            {block.content.cta as string}
          </button>
        </div>
      );

    case 'about':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-5`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: block.style.accentColor }} />
          <div className="p-6 md:p-8 rounded-3xl border shadow-sm backdrop-blur-sm" style={{ backgroundColor: `${block.style.accentColor}05`, borderColor: `${block.style.accentColor}15` }}>
            <p className="max-w-3xl leading-loose opacity-90 md:text-lg">{block.content.text as string}</p>
          </div>
        </div>
      );

    case 'skills':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className="flex flex-wrap gap-3">
            {(Array.isArray(block.content.skills) ? block.content.skills : String(block.content.skills || '').split(',')).map((skill: any, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl text-sm font-700 shadow-sm transition-transform hover:-translate-y-1"
                style={{ backgroundColor: `${block.style.accentColor}15`, color: block.style.accentColor, border: `1px solid ${block.style.accentColor}30` }}
              >
                {typeof skill === 'string' ? skill.trim() : (skill.name || skill.skill || skill.label || JSON.stringify(skill))}
              </span>
            ))}
          </div>
        </div>
      );

    case 'stats':
      return (
        <div style={baseStyle} className={`${padding}`}>
          <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-4'} gap-6`}>
            {[1, 2, 3, 4].map((n) => block.content[`stat${n}`] && (
              <div key={n} className={`flex flex-col ${align} p-6 rounded-3xl border transition-all hover:shadow-md`} style={{ backgroundColor: `${block.style.accentColor}05`, borderColor: `${block.style.accentColor}10` }}>
                <span className="text-4xl lg:text-5xl font-900 mb-2" style={{ color: block.style.accentColor }}>{block.content[`stat${n}`] as string}</span>
                <span className="text-sm font-700 opacity-70 uppercase tracking-widest">{block.content[`label${n}`] as string}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'projects':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-2'} gap-6 w-full`}>
            {[1, 2, 3].map((n) => block.content[`proj${n}`] && (
              <div key={n} className="p-6 md:p-8 rounded-3xl border shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group relative overflow-hidden" style={{ borderColor: `${block.style.accentColor}20`, backgroundColor: `${block.style.accentColor}03` }}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: block.style.accentColor }} />
                <p className="text-xl font-800 mb-2 group-hover:text-primary transition-colors">{block.content[`proj${n}`] as string}</p>
                <p className="text-sm md:text-base opacity-70 leading-relaxed">{block.content[`proj${n}desc`] as string}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'experience':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-8`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className="w-full relative">
            <div className="absolute left-3 top-2 bottom-2 w-0.5" style={{ backgroundColor: `${block.style.accentColor}30` }} />
            <div className="flex flex-col gap-8">
              {[1, 2].map((n) => block.content[`job${n}`] && (
                <div key={n} className="flex gap-6 w-full relative z-10">
                  <div className="w-6 h-6 rounded-full mt-1 flex-shrink-0 border-4 shadow-sm" style={{ backgroundColor: block.style.bgColor, borderColor: block.style.accentColor }} />
                  <div className="flex-1 p-5 rounded-2xl border hover:shadow-md transition-shadow" style={{ borderColor: `${block.style.accentColor}20`, backgroundColor: `${block.style.accentColor}03` }}>
                    <p className="text-lg font-800">{block.content[`job${n}`] as string}</p>
                    <p className="text-sm font-700 mt-1" style={{ color: block.style.accentColor }}>{block.content[`company${n}`] as string} <span className="opacity-60 font-500 ml-2">· {block.content[`period${n}`] as string}</span></p>
                    <p className="text-sm md:text-base opacity-75 mt-3 leading-relaxed">{block.content[`desc${n}`] as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'education':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-2'} gap-4 w-full`}>
            {[1, 2].map((n) => block.content[`degree${n}`] && (
              <div key={n} className="flex items-center gap-4 p-5 rounded-2xl border" style={{ borderColor: `${block.style.accentColor}20`, backgroundColor: `${block.style.accentColor}05` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm" style={{ backgroundColor: `${block.style.accentColor}15`, color: block.style.accentColor }}>
                  🎓
                </div>
                <div>
                  <p className="text-base font-800">{block.content[`degree${n}`] as string}</p>
                  <p className="text-sm opacity-70 mt-1">{block.content[`school${n}`] as string} <span className="ml-1 opacity-60">· {block.content[`year${n}`] as string}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'testimonials':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-2'} gap-6 w-full`}>
            {[1, 2].map((n) => block.content[`quote${n}`] && (
              <div key={n} className="p-6 md:p-8 rounded-3xl relative" style={{ backgroundColor: `${block.style.accentColor}08` }}>
                <span className="absolute top-4 left-4 text-4xl opacity-20 font-serif" style={{ color: block.style.accentColor }}>"</span>
                <p className="text-base md:text-lg italic opacity-90 mb-6 relative z-10 leading-relaxed">{block.content[`quote${n}`] as string}</p>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: block.style.accentColor, color: '#fff' }}>
                    {(block.content[`author${n}`] as string)[0]}
                  </div>
                  <div>
                    <p className="text-sm font-800">{block.content[`author${n}`] as string}</p>
                    <p className="text-xs opacity-60 uppercase tracking-wider mt-0.5">{block.content[`role${n}`] as string}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-3'} gap-4 w-full`}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="group relative aspect-video rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: `${block.style.accentColor}15` }}>
                <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">🖼️</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-sm font-700 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{block.content[`caption${n}`] as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className={`${padding} flex flex-col items-center text-center gap-6 relative overflow-hidden rounded-3xl mx-4 my-8 p-12`} style={{ ...baseStyle, backgroundColor: block.style.accentColor, color: '#fff' }}>
          <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
          <h2 className={`font-900 tracking-tight relative z-10 ${isCompact ? 'text-3xl' : 'text-5xl'}`}>{block.content.title as string}</h2>
          <p className="opacity-90 text-lg md:text-xl relative z-10 max-w-xl">{block.content.subtitle as string}</p>
          <button className="px-10 py-4 rounded-full font-800 text-base shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-10 mt-4" style={{ backgroundColor: block.style.bgColor, color: block.style.accentColor }}>
            {block.content.cta as string}
          </button>
        </div>
      );

    case 'contact':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-8`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`flex flex-col md:flex-row ${align} gap-4 w-full`}>
            {block.content.email && (
              <div className="flex-1 p-6 rounded-2xl border flex flex-col items-center text-center hover:-translate-y-1 transition-transform" style={{ borderColor: `${block.style.accentColor}20`, backgroundColor: `${block.style.accentColor}05` }}>
                <span className="text-3xl mb-3">✉️</span>
                <span className="text-sm font-700">{block.content.email as string}</span>
              </div>
            )}
            {block.content.linkedin && (
              <div className="flex-1 p-6 rounded-2xl border flex flex-col items-center text-center hover:-translate-y-1 transition-transform" style={{ borderColor: `${block.style.accentColor}20`, backgroundColor: `${block.style.accentColor}05` }}>
                <span className="text-3xl mb-3">💼</span>
                <span className="text-sm font-700">{block.content.linkedin as string}</span>
              </div>
            )}
            {block.content.github && (
              <div className="flex-1 p-6 rounded-2xl border flex flex-col items-center text-center hover:-translate-y-1 transition-transform" style={{ borderColor: `${block.style.accentColor}20`, backgroundColor: `${block.style.accentColor}05` }}>
                <span className="text-3xl mb-3">🐙</span>
                <span className="text-sm font-700">{block.content.github as string}</span>
              </div>
            )}
          </div>
          {block.content.cta && (
            <button className="px-8 py-3.5 rounded-full text-sm font-800 mt-4 shadow-lg hover:-translate-y-1 transition-all self-center" style={{ backgroundColor: block.style.accentColor, color: '#fff' }}>
              {block.content.cta as string}
            </button>
          )}
        </div>
      );

    case 'divider':
      return (
        <div style={baseStyle} className="py-8 px-8 flex justify-center">
          <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: `${block.style.accentColor}40` }} />
        </div>
      );

    case 'languages':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-2'} gap-4 w-full`}>
            {[1, 2, 3].map((n) => block.content[`lang${n}`] && (
              <div key={n} className="flex items-center justify-between p-5 rounded-2xl border shadow-sm" style={{ borderColor: `${block.style.accentColor}20`, backgroundColor: `${block.style.accentColor}05` }}>
                <span className="font-800 text-base">{block.content[`lang${n}`] as string}</span>
                <span className="text-xs font-700 px-3 py-1.5 rounded-full uppercase tracking-wider" style={{ backgroundColor: `${block.style.accentColor}15`, color: block.style.accentColor }}>{block.content[`level${n}`] as string}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'video':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-8" style={{ borderColor: `${block.style.accentColor}10` }}>
            <iframe 
              className="w-full h-full" 
              src={block.content.url as string} 
              title="Video Pitch" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>
      );

    case 'faq':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-6`}>
          <h2 className="text-3xl font-900 tracking-tight" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className="w-full space-y-4">
            {[1, 2, 3].map((n) => block.content[`q${n}`] && (
              <div key={n} className="p-6 rounded-3xl border transition-all hover:shadow-md" style={{ borderColor: `${block.style.accentColor}15`, backgroundColor: `${block.style.bgColor}` }}>
                <p className="font-800 text-lg mb-2" style={{ color: block.style.accentColor }}>{block.content[`q${n}`] as string}</p>
                <p className="text-base opacity-80 leading-relaxed">{block.content[`a${n}`] as string}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'custom':
      if (block.layout?.type === 'freeform' && block.layout.elements) {
        return (
          <FreeformCanvas
            block={block}
            baseStyle={baseStyle}
            showPreview={showPreview}
            onUpdateBlock={onUpdateBlock}
            scale={scale}
          />
        );
      }
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-2`}>
          <p className="text-sm font-600 opacity-60 capitalize">[Bloc Custom non configuré]</p>
        </div>
      );

    default:
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-2`}>
          <p className="text-sm font-600 opacity-60 capitalize">[Bloc: {block.type}]</p>
        </div>
      );
  }
}

// ─── Freeform Canvas ──────────────────────────────────────────────────────────
function FreeformCanvas({ block, baseStyle, showPreview, onUpdateBlock, scale }: {
  block: Block;
  baseStyle: React.CSSProperties;
  showPreview: boolean;
  onUpdateBlock: (block: Block) => void;
  scale: number;
}) {
  const [selectedElId, setSelectedElId] = useState<string | null>(null);
  const elements = block.layout!.elements!;

  // Dynamic canvas height
  const CANVAS_W = 800;
  let maxH = 600;
  elements.forEach(el => {
    const y = typeof el.y === 'string' ? parseFloat(el.y) : (el.y || 0);
    const h = typeof el.height === 'string' ? parseFloat(el.height) : (el.height || 50);
    if (y + h > maxH) maxH = y + h + 80;
  });

  const handleUpdateEl = (updated: BlockElement) => {
    const newElements = elements.map(e => e.id === updated.id ? updated : e);
    onUpdateBlock({ ...block, layout: { ...block.layout!, elements: newElements } });
  };

  const handleDeleteEl = (id: string) => {
    const newElements = elements.filter(e => e.id !== id);
    onUpdateBlock({ ...block, layout: { ...block.layout!, elements: newElements } });
    if (selectedElId === id) setSelectedElId(null);
  };

  const renderElContent = (el: BlockElement) => {
    if (el.type === 'text') return (
      <div style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
        textDecoration: el.style?.textDecoration || 'none',
        fontWeight: el.style?.fontWeight || 'normal',
        fontStyle: el.style?.fontStyle || 'normal',
        fontFamily: el.style?.fontFamily || 'inherit',
        color: el.style?.color || 'inherit',
        backgroundColor: el.style?.backgroundColor || 'transparent',
        textAlign: (el.style?.textAlign as any) || 'left',
        fontSize: el.style?.fontSize || '16px',
      }}>{el.content}</div>
    );
    if (el.type === 'image') return (
      <img
        src={el.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: el.style?.borderRadius || '8px' }}
        draggable={false}
      />
    );
    if (el.type === 'button') return (
      <button style={{
        width: '100%', height: '100%',
        backgroundColor: el.style?.backgroundColor || block.style?.accentColor || '#7c3aed',
        color: el.style?.color || '#fff',
        borderRadius: el.style?.borderRadius || '9999px',
        fontWeight: 'bold', cursor: 'pointer', border: 'none'
      }}>{el.content}</button>
    );
    if (el.type === 'shape') return (
      <div style={{
        width: '100%', height: '100%',
        backgroundColor: el.style?.backgroundColor || '#ccc',
        borderRadius: el.style?.borderRadius || '0',
        border: el.style?.border || 'none',
        clipPath: el.style?.clipPath || 'none',
      }} />
    );
    return null;
  };

  return (
    <div
      style={{ ...baseStyle, position: 'relative', width: '100%', minHeight: `${maxH}px`, overflow: 'hidden' }}
      onClick={() => setSelectedElId(null)}
    >
      {elements.map(el => {
        if (showPreview) {
          const px = typeof el.x === 'string' ? parseFloat(el.x) : (el.x || 0);
          const py = typeof el.y === 'string' ? parseFloat(el.y) : (el.y || 0);
          const pw = typeof el.width === 'string' ? parseFloat(el.width) : (el.width || 200);
          const ph = typeof el.height === 'string' ? parseFloat(el.height) : (el.height || 50);
          const rot = (el.style as any)?.rotation || 0;
          return (
            <div key={el.id} style={{
              position: 'absolute', left: px, top: py, width: pw, height: ph,
              zIndex: el.zIndex || 1, transform: `rotate(${rot}deg)`, display: 'flex', alignItems: 'flex-start',
              ...el.style,
            }}>
              {renderElContent(el)}
            </div>
          );
        }

        return (
          <CanvasElement
            key={el.id}
            el={el}
            isSelected={selectedElId === el.id}
            canvasWidth={CANVAS_W}
            scale={scale}
            onSelect={(id) => setSelectedElId(id)}
            onUpdate={handleUpdateEl}
            onDelete={() => handleDeleteEl(el.id)}
          >
            {renderElContent(el)}
          </CanvasElement>
        );
      })}
    </div>
  );
}
