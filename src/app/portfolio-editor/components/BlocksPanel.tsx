'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { BlockType, Block, PortfolioDesign } from './PortfolioEditorContent';

interface BlockCategory {
  label: string;
  icon: string;
  blocks: { type: BlockType; label: string; description: string; icon: string }[];
}

const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    label: 'Essentiels',
    icon: 'StarIcon',
    blocks: [
      { type: 'hero', label: 'Hero / Bannière', description: 'Nom, titre et accroche principale', icon: 'UserCircleIcon' },
      { type: 'about', label: 'À propos', description: 'Présentation personnelle', icon: 'DocumentTextIcon' },
      { type: 'contact', label: 'Contact', description: 'Email, réseaux et CTA', icon: 'EnvelopeIcon' },
    ],
  },
  {
    label: 'Contenu',
    icon: 'QueueListIcon',
    blocks: [
      { type: 'projects', label: 'Projets', description: 'Showcase de vos réalisations', icon: 'FolderIcon' },
      { type: 'experience', label: 'Expérience', description: 'Parcours professionnel', icon: 'BriefcaseIcon' },
      { type: 'education', label: 'Formation', description: 'Diplômes et certifications', icon: 'AcademicCapIcon' },
      { type: 'skills', label: 'Compétences', description: 'Stack technique et soft skills', icon: 'BoltIcon' },
      { type: 'languages', label: 'Langues', description: 'Langues parlées', icon: 'GlobeAltIcon' },
      { type: 'gallery', label: 'Galerie', description: 'Visuels et captures d\'écran', icon: 'PhotoIcon' },
      { type: 'video', label: 'Vidéo Pitch', description: 'Présentation vidéo', icon: 'VideoCameraIcon' },
      { type: 'faq', label: 'FAQ', description: 'Questions fréquentes', icon: 'QuestionMarkCircleIcon' },
    ],
  },
  {
    label: 'Social Proof',
    icon: 'HandThumbUpIcon',
    blocks: [
      { type: 'testimonials', label: 'Témoignages', description: 'Avis et recommandations', icon: 'ChatBubbleLeftIcon' },
      { type: 'stats', label: 'Statistiques', description: 'Chiffres clés et métriques', icon: 'ChartBarIcon' },
    ],
  },
  {
    label: 'Mise en page',
    icon: 'AdjustmentsHorizontalIcon',
    blocks: [
      { type: 'cta', label: 'Appel à l\'action', description: 'Bouton et message d\'incitation', icon: 'CursorArrowRaysIcon' },
      { type: 'divider', label: 'Séparateur', description: 'Ligne ou vague de séparation', icon: 'MinusIcon' },
    ],
  },
];

interface BlocksPanelProps {
  onAddBlock: (type: BlockType) => void;
  selectedBlock?: Block;
  onUpdateBlock?: (block: Block) => void;
}

export default function BlocksPanel({ onAddBlock, selectedBlock, onUpdateBlock }: BlocksPanelProps) {
  const isFreeform = selectedBlock?.layout?.type === 'freeform' && selectedBlock?.layout?.elements;

  return (
    <div className="p-3 space-y-4">
      {isFreeform && onUpdateBlock && (
        <div className="mb-6">
          <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider px-1">Ajouter un élément</p>
          <p className="text-xs text-muted-foreground px-1 mb-2">Sur la page / diapositive actuelle</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => {
              const newEl = { id: `el-${Date.now()}`, type: 'text' as const, content: 'Nouveau texte', x: '50', y: '50', width: '300', height: '50', style: { color: '#000000', fontSize: '18px' } };
              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
            }} className="flex items-center justify-center gap-2 p-2 bg-muted hover:bg-primary/20 hover:text-primary rounded-xl text-xs font-600 transition-colors">
              <Icon name="DocumentTextIcon" size={14} /> Texte
            </button>
            <button onClick={() => {
              const newEl = { id: `el-${Date.now()}`, type: 'image' as const, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', x: '100', y: '50', width: '300', height: '200', style: { borderRadius: '8px' } };
              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
            }} className="flex items-center justify-center gap-2 p-2 bg-muted hover:bg-primary/20 hover:text-primary rounded-xl text-xs font-600 transition-colors">
              <Icon name="PhotoIcon" size={14} /> Image
            </button>
            <button onClick={() => {
              const newEl = { id: `el-${Date.now()}`, type: 'shape' as const, x: '50', y: '150', width: '200', height: '100', style: { backgroundColor: '#e2e8f0', borderRadius: '16px' } };
              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
            }} className="flex items-center justify-center gap-2 p-2 bg-muted hover:bg-primary/20 hover:text-primary rounded-xl text-xs font-600 transition-colors">
              <Icon name="StopIcon" size={14} /> Forme
            </button>
            <button onClick={() => {
              const newEl = { id: `el-${Date.now()}`, type: 'shape' as const, x: '50', y: '300', width: '150', height: '4', style: { backgroundColor: '#000000', borderRadius: '0' } };
              onUpdateBlock({ ...selectedBlock, layout: { ...selectedBlock.layout!, elements: [...selectedBlock.layout!.elements!, newEl] } });
            }} className="flex items-center justify-center gap-2 p-2 bg-muted hover:bg-primary/20 hover:text-primary rounded-xl text-xs font-600 transition-colors">
              <Icon name="MinusIcon" size={14} /> Ligne
            </button>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-border/50">
        <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider px-1">Ajouter une page / bloc</p>
        <p className="text-xs text-muted-foreground px-1 -mt-2">Cliquez pour ajouter à la fin</p>
      </div>

      {BLOCK_CATEGORIES.map((cat) => (
        <div key={cat.label}>
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <Icon name={cat.icon as any} size={12} className="text-muted-foreground" />
            <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider">{cat.label}</p>
          </div>
          <div className="space-y-1">
            {cat.blocks.map((block) => (
              <button
                key={block.type}
                onClick={() => onAddBlock(block.type)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/30 transition-all duration-150 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Icon name={block.icon as any} size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 text-foreground">{block.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{block.description}</p>
                </div>
                <Icon name="PlusIcon" size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
