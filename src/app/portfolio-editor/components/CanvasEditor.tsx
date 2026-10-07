'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Block, PortfolioDesign } from './PortfolioEditorContent';

interface CanvasEditorProps {
  design: PortfolioDesign;
  selectedBlockId: string | null;
  previewMode: 'desktop' | 'tablet' | 'mobile';
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
}

const CANVAS_WIDTHS = {
  desktop: 'max-w-3xl w-full',
  tablet: 'max-w-md w-full',
  mobile: 'max-w-xs w-full',
};

const PADDING_MAP = { sm: 'py-6 px-6', md: 'py-10 px-8', lg: 'py-16 px-10' };
const ALIGN_MAP = { left: 'text-left items-start', center: 'text-center items-center', right: 'text-right items-end' };

export default function CanvasEditor({
  design, selectedBlockId, previewMode, showPreview, dragOverIndex,
  onSelectBlock, onDeleteBlock, onMoveBlock, onDragStart, onDrop, onDragOver, onOpenCustomize,
}: CanvasEditorProps) {
  const canvasWidth = CANVAS_WIDTHS[previewMode];

  return (
    <div className={`${canvasWidth} transition-all duration-300`}>
      {/* Canvas shadow wrapper */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        {/* Browser chrome */}
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

        {/* Blocks */}
        <div style={{ backgroundColor: design.globalStyle.bgColor }}>
          {design.blocks.map((block, index) => (
            <div key={block.id}>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
                onDrop={() => onDrop(index)}
                className={`h-1 transition-all ${dragOverIndex === index ? 'h-8 bg-primary/20 border-2 border-dashed border-primary rounded-lg mx-4 my-1' : ''}`}
              />

              {/* Block wrapper */}
              <div
                draggable
                onDragStart={() => onDragStart(block.id)}
                onDragEnd={() => onDragOver(null)}
                onClick={() => { onSelectBlock(block.id); onOpenCustomize(); }}
                className={`relative group cursor-pointer transition-all duration-150 ${
                  selectedBlockId === block.id ? 'ring-2 ring-primary ring-inset' : 'hover:ring-1 hover:ring-primary/40 hover:ring-inset'
                }`}
              >
                {/* Block controls overlay */}
                <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 transition-opacity ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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
                      <Icon name="Trash2Icon" size={12} className="text-red-500" />
                    </button>
                    <div className="p-1.5 cursor-grab active:cursor-grabbing" title="Déplacer">
                      <Icon name="GripVerticalIcon" size={12} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Block type label */}
                {selectedBlockId === block.id && (
                  <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-700 px-2 py-0.5 rounded-md capitalize">
                    {block.type}
                  </div>
                )}

                {/* Render block */}
                <BlockRenderer block={block} previewMode={previewMode} />
              </div>
            </div>
          ))}

          {/* Final drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); onDragOver(design.blocks.length); }}
            onDrop={() => onDrop(design.blocks.length)}
            className={`h-1 transition-all ${dragOverIndex === design.blocks.length ? 'h-8 bg-primary/20 border-2 border-dashed border-primary rounded-lg mx-4 my-1' : ''}`}
          />

          {/* Empty state */}
          {design.blocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Icon name="LayoutIcon" size={40} className="text-gray-300 mb-4" />
              <p className="text-sm font-600 text-gray-500">Canvas vide</p>
              <p className="text-xs text-gray-400 mt-1">Ajoutez des blocs depuis le panneau gauche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlockRenderer({ block, previewMode }: { block: Block; previewMode: string }) {
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
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-4`}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-900" style={{ backgroundColor: block.style.accentColor, color: '#fff' }}>
            {(block.content.name as string)?.[0] ?? 'A'}
          </div>
          <div className={`flex flex-col ${align} gap-2`}>
            <h1 className={`font-900 leading-tight ${isCompact ? 'text-2xl' : 'text-4xl'}`} style={{ color: block.style.textColor }}>
              {block.content.name as string}
            </h1>
            <p className={`font-600 ${isCompact ? 'text-base' : 'text-xl'}`} style={{ color: block.style.accentColor }}>
              {block.content.title as string}
            </p>
            <p className={`max-w-lg opacity-80 ${isCompact ? 'text-sm' : 'text-base'}`}>{block.content.tagline as string}</p>
          </div>
          <button className="px-6 py-2.5 rounded-xl text-sm font-700 mt-2" style={{ backgroundColor: block.style.accentColor, color: '#fff' }}>
            {block.content.cta as string}
          </button>
        </div>
      );

    case 'about':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-3`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: block.style.accentColor }} />
          <p className="max-w-2xl leading-relaxed opacity-90 text-sm">{block.content.text as string}</p>
        </div>
      );

    case 'skills':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-4`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(block.content.skills) ? block.content.skills : (block.content.skills as string).split(',')).map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-700"
                style={{ backgroundColor: `${block.style.accentColor}20`, color: block.style.accentColor, border: `1px solid ${block.style.accentColor}40` }}
              >
                {typeof skill === 'string' ? skill.trim() : skill}
              </span>
            ))}
          </div>
        </div>
      );

    case 'stats':
      return (
        <div style={baseStyle} className={`${padding}`}>
          <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
            {[1, 2, 3, 4].map((n) => block.content[`stat${n}`] && (
              <div key={n} className={`flex flex-col ${align} gap-1`}>
                <span className="text-3xl font-900" style={{ color: block.style.accentColor }}>{block.content[`stat${n}`] as string}</span>
                <span className="text-xs font-600 opacity-80">{block.content[`label${n}`] as string}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'projects':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-5`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-2'} gap-4 w-full`}>
            {[1, 2, 3].map((n) => block.content[`proj${n}`] && (
              <div key={n} className="p-4 rounded-xl border" style={{ borderColor: `${block.style.accentColor}30`, backgroundColor: `${block.style.accentColor}08` }}>
                <p className="text-sm font-700 mb-1">{block.content[`proj${n}`] as string}</p>
                <p className="text-xs opacity-70">{block.content[`proj${n}desc`] as string}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'experience':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-4`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          {[1, 2].map((n) => block.content[`job${n}`] && (
            <div key={n} className="flex gap-4 w-full">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: block.style.accentColor }} />
              <div>
                <p className="text-sm font-700">{block.content[`job${n}`] as string}</p>
                <p className="text-xs font-600 opacity-70">{block.content[`company${n}`] as string} · {block.content[`period${n}`] as string}</p>
                <p className="text-xs opacity-60 mt-1">{block.content[`desc${n}`] as string}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'education':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-3`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          {[1, 2].map((n) => block.content[`degree${n}`] && (
            <div key={n} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${block.style.accentColor}20` }}>
                <span className="text-xs">🎓</span>
              </div>
              <div>
                <p className="text-sm font-700">{block.content[`degree${n}`] as string}</p>
                <p className="text-xs opacity-70">{block.content[`school${n}`] as string} · {block.content[`year${n}`] as string}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'testimonials':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-5`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          {[1, 2].map((n) => block.content[`quote${n}`] && (
            <div key={n} className="p-4 rounded-xl" style={{ backgroundColor: `${block.style.accentColor}10`, borderLeft: `3px solid ${block.style.accentColor}` }}>
              <p className="text-sm italic opacity-90 mb-2">"{block.content[`quote${n}`] as string}"</p>
              <p className="text-xs font-700">{block.content[`author${n}`] as string}</p>
              <p className="text-xs opacity-60">{block.content[`role${n}`] as string}</p>
            </div>
          ))}
        </div>
      );

    case 'gallery':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-4`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-3'} gap-3 w-full`}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-video rounded-xl flex items-center justify-center" style={{ backgroundColor: `${block.style.accentColor}20` }}>
                <div className="text-center">
                  <span className="text-2xl">🖼️</span>
                  <p className="text-xs mt-1 opacity-70">{block.content[`caption${n}`] as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-4`}>
          <h2 className={`font-900 ${isCompact ? 'text-2xl' : 'text-3xl'}`}>{block.content.title as string}</h2>
          <p className="opacity-80 text-sm">{block.content.subtitle as string}</p>
          <button className="px-8 py-3 rounded-xl font-700 text-sm" style={{ backgroundColor: block.style.accentColor, color: '#fff' }}>
            {block.content.cta as string}
          </button>
        </div>
      );

    case 'contact':
      return (
        <div style={baseStyle} className={`${padding} flex flex-col ${align} gap-4`}>
          <h2 className="text-2xl font-800" style={{ color: block.style.accentColor }}>{block.content.title as string}</h2>
          <div className={`flex flex-col ${align} gap-2`}>
            {block.content.email && (
              <div className="flex items-center gap-2 text-sm opacity-80">
                <span>✉️</span><span>{block.content.email as string}</span>
              </div>
            )}
            {block.content.linkedin && (
              <div className="flex items-center gap-2 text-sm opacity-80">
                <span>💼</span><span>{block.content.linkedin as string}</span>
              </div>
            )}
            {block.content.github && (
              <div className="flex items-center gap-2 text-sm opacity-80">
                <span>🐙</span><span>{block.content.github as string}</span>
              </div>
            )}
          </div>
          {block.content.cta && (
            <button className="px-6 py-2.5 rounded-xl text-sm font-700 mt-2" style={{ backgroundColor: block.style.accentColor, color: '#fff' }}>
              {block.content.cta as string}
            </button>
          )}
        </div>
      );

    case 'divider':
      return (
        <div style={baseStyle} className="py-4 px-8">
          <div className="w-full h-px" style={{ backgroundColor: `${block.style.accentColor}30` }} />
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
