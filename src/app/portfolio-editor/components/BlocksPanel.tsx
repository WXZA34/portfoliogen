'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import type { BlockType } from './PortfolioEditorContent';

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
      { type: 'about', label: 'À propos', description: 'Présentation personnelle', icon: 'FileTextIcon' },
      { type: 'contact', label: 'Contact', description: 'Email, réseaux et CTA', icon: 'MailIcon' },
    ],
  },
  {
    label: 'Contenu',
    icon: 'LayoutIcon',
    blocks: [
      { type: 'projects', label: 'Projets', description: 'Showcase de vos réalisations', icon: 'FolderIcon' },
      { type: 'experience', label: 'Expérience', description: 'Parcours professionnel', icon: 'BriefcaseIcon' },
      { type: 'education', label: 'Formation', description: 'Diplômes et certifications', icon: 'GraduationCapIcon' },
      { type: 'skills', label: 'Compétences', description: 'Stack technique et soft skills', icon: 'ZapIcon' },
      { type: 'gallery', label: 'Galerie', description: 'Visuels et captures d\'écran', icon: 'ImageIcon' },
    ],
  },
  {
    label: 'Social Proof',
    icon: 'ThumbsUpIcon',
    blocks: [
      { type: 'testimonials', label: 'Témoignages', description: 'Avis et recommandations', icon: 'MessageSquareIcon' },
      { type: 'stats', label: 'Statistiques', description: 'Chiffres clés et métriques', icon: 'BarChart2Icon' },
    ],
  },
  {
    label: 'Mise en page',
    icon: 'SlidersIcon',
    blocks: [
      { type: 'cta', label: 'Appel à l\'action', description: 'Bouton et message d\'incitation', icon: 'MousePointerIcon' },
      { type: 'divider', label: 'Séparateur', description: 'Ligne ou vague de séparation', icon: 'MinusIcon' },
    ],
  },
];

interface BlocksPanelProps {
  onAddBlock: (type: BlockType) => void;
}

export default function BlocksPanel({ onAddBlock }: BlocksPanelProps) {
  return (
    <div className="p-3 space-y-4">
      <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider px-1">Ajouter un bloc</p>
      <p className="text-xs text-muted-foreground px-1 -mt-2">Cliquez pour ajouter à la fin du portfolio</p>

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
