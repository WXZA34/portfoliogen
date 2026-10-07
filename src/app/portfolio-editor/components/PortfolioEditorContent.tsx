'use client';

import React, { useState, useCallback, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import TemplateLibrary from './TemplateLibrary';
import BlocksPanel from './BlocksPanel';
import CanvasEditor from './CanvasEditor';
import CustomizationPanel from './CustomizationPanel';

export type BlockType =
  | 'hero' |'about' |'skills' |'projects' |'experience' |'education' |'contact' |'testimonials' |'stats' |'gallery' |'cta' |'divider';

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, string | string[]>;
  style: {
    bgColor: string;
    textColor: string;
    accentColor: string;
    padding: 'sm' | 'md' | 'lg';
    align: 'left' | 'center' | 'right';
    fontFamily: string;
  };
}

export interface PortfolioDesign {
  id: string;
  name: string;
  templateId: string;
  blocks: Block[];
  globalStyle: {
    primaryColor: string;
    secondaryColor: string;
    bgColor: string;
    fontHeading: string;
    fontBody: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    darkMode: boolean;
  };
}

const defaultBlocks: Block[] = [
  {
    id: 'block-1',
    type: 'hero',
    content: {
      name: 'Alex Martin',
      title: 'Développeur Full-Stack & Architecte IA',
      tagline: 'Je construis des produits qui scalent — de l\'idée au déploiement.',
      cta: 'Voir mes projets',
    },
    style: { bgColor: '#0f0f1a', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' },
  },
  {
    id: 'block-2',
    type: 'stats',
    content: {
      stat1: '8+', label1: 'Années d\'expérience',
      stat2: '42', label2: 'Projets livrés',
      stat3: '12', label3: 'Clients satisfaits',
      stat4: '98%', label4: 'Taux de satisfaction',
    },
    style: { bgColor: '#7c3aed', textColor: '#ffffff', accentColor: '#a78bfa', padding: 'md', align: 'center', fontFamily: 'Plus Jakarta Sans' },
  },
  {
    id: 'block-3',
    type: 'about',
    content: {
      title: 'À propos',
      text: 'Passionné par la création de solutions techniques élégantes, je combine expertise en développement web moderne et intelligence artificielle pour construire des produits à fort impact.',
    },
    style: { bgColor: '#ffffff', textColor: '#111827', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' },
  },
  {
    id: 'block-4',
    type: 'skills',
    content: {
      title: 'Compétences',
      skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Machine Learning', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL'],
    },
    style: { bgColor: '#f9fafb', textColor: '#111827', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' },
  },
  {
    id: 'block-5',
    type: 'projects',
    content: {
      title: 'Projets Phares',
      proj1: 'NeuralCommerce Platform',
      proj1desc: 'Plateforme e-commerce avec recommandations IA en temps réel',
      proj2: 'DistributedDB Orchestrator',
      proj2desc: 'Orchestrateur de bases de données distribuées avec Kubernetes',
      proj3: 'RealTime Collaboration SDK',
      proj3desc: 'SDK TypeScript pour collaboration temps réel via WebSocket',
    },
    style: { bgColor: '#ffffff', textColor: '#111827', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' },
  },
  {
    id: 'block-6',
    type: 'contact',
    content: {
      title: 'Me Contacter',
      email: 'alex.martin@example.com',
      linkedin: 'linkedin.com/in/alex-martin',
      github: 'github.com/alex-martin',
      cta: 'Envoyer un message',
    },
    style: { bgColor: '#0f0f1a', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' },
  },
];

const initialDesign: PortfolioDesign = {
  id: 'design-1',
  name: 'Mon Portfolio Principal',
  templateId: 'dark-pro',
  blocks: defaultBlocks,
  globalStyle: {
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    bgColor: '#ffffff',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'DM Sans',
    borderRadius: 'md',
    darkMode: false,
  },
};

type PanelView = 'templates' | 'blocks' | 'customize';

export default function PortfolioEditorContent() {
  const [design, setDesign] = useState<PortfolioDesign>(initialDesign);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block-1');
  const [panelView, setPanelView] = useState<PanelView>('blocks');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragBlockId = useRef<string | null>(null);

  const selectedBlock = design.blocks.find((b) => b.id === selectedBlockId) ?? null;

  const handleAddBlock = useCallback((type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      style: {
        bgColor: '#ffffff',
        textColor: '#111827',
        accentColor: design.globalStyle.primaryColor,
        padding: 'md',
        align: 'left',
        fontFamily: design.globalStyle.fontBody,
      },
    };
    setDesign((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    setSelectedBlockId(newBlock.id);
    setPanelView('blocks');
  }, [design.globalStyle]);

  const handleUpdateBlock = useCallback((updated: Block) => {
    setDesign((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === updated.id ? updated : b)),
    }));
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setDesign((prev) => {
      const newBlocks = prev.blocks.filter((b) => b.id !== id);
      return { ...prev, blocks: newBlocks };
    });
    setSelectedBlockId(null);
  }, []);

  const handleMoveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    setDesign((prev) => {
      const idx = prev.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const newBlocks = [...prev.blocks];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newBlocks.length) return prev;
      [newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]];
      return { ...prev, blocks: newBlocks };
    });
  }, []);

  const handleDragStart = (id: string) => {
    dragBlockId.current = id;
  };

  const handleDrop = (targetIndex: number) => {
    if (!dragBlockId.current) return;
    const fromIndex = design.blocks.findIndex((b) => b.id === dragBlockId.current);
    if (fromIndex === -1 || fromIndex === targetIndex) return;
    const newBlocks = [...design.blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(targetIndex, 0, moved);
    setDesign((prev) => ({ ...prev, blocks: newBlocks }));
    dragBlockId.current = null;
    setDragOverIndex(null);
  };

  const handleApplyTemplate = (templateId: string, templateBlocks: Block[], globalStyle: PortfolioDesign['globalStyle']) => {
    setDesign((prev) => ({ ...prev, templateId, blocks: templateBlocks, globalStyle }));
    setSelectedBlockId(templateBlocks[0]?.id ?? null);
    setPanelView('blocks');
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] -mx-6 -mt-2">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <input
            value={design.name}
            onChange={(e) => setDesign((prev) => ({ ...prev, name: e.target.value }))}
            className="text-sm font-600 text-foreground bg-transparent border-none outline-none focus:bg-muted px-2 py-1 rounded-lg transition-all w-48"
          />
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Brouillon</span>
        </div>

        {/* Preview device switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                previewMode === mode ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={mode === 'desktop' ? 'MonitorIcon' : mode === 'tablet' ? 'TabletIcon' : 'SmartphoneIcon'} size={13} />
              <span className="hidden sm:inline capitalize">{mode === 'desktop' ? 'Bureau' : mode === 'tablet' ? 'Tablette' : 'Mobile'}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all border ${
              showPreview ? 'bg-primary/10 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="EyeIcon" size={13} />
            Aperçu
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 disabled:opacity-60 transition-all"
          >
            {saving ? <Icon name="Loader2Icon" size={13} className="animate-spin" /> : <Icon name="SaveIcon" size={13} />}
            {saving ? 'Sauvegarde...' : 'Publier'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-border">
            {([
              { key: 'templates', icon: 'LayoutTemplateIcon', label: 'Templates' },
              { key: 'blocks', icon: 'LayoutIcon', label: 'Blocs' },
              { key: 'customize', icon: 'PaletteIcon', label: 'Style' },
            ] as const).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setPanelView(key)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-600 transition-all border-b-2 ${
                  panelView === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={icon} size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {panelView === 'templates' && (
              <TemplateLibrary onApply={handleApplyTemplate} currentTemplateId={design.templateId} />
            )}
            {panelView === 'blocks' && (
              <BlocksPanel onAddBlock={handleAddBlock} />
            )}
            {panelView === 'customize' && (
              <CustomizationPanel
                design={design}
                selectedBlock={selectedBlock}
                onUpdateDesign={setDesign}
                onUpdateBlock={handleUpdateBlock}
              />
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-[#f0f0f5] flex items-start justify-center p-6">
          <CanvasEditor
            design={design}
            selectedBlockId={selectedBlockId}
            previewMode={previewMode}
            showPreview={showPreview}
            dragOverIndex={dragOverIndex}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={setDragOverIndex}
            onOpenCustomize={() => setPanelView('customize')}
          />
        </div>
      </div>
    </div>
  );
}

function getDefaultContent(type: BlockType): Record<string, string | string[]> {
  const defaults: Record<BlockType, Record<string, string | string[]>> = {
    hero: { name: 'Votre Nom', title: 'Votre Titre Professionnel', tagline: 'Votre accroche ici', cta: 'Voir mes projets' },
    about: { title: 'À propos de moi', text: 'Décrivez votre parcours, vos valeurs et ce qui vous passionne.' },
    skills: { title: 'Compétences', skills: ['Compétence 1', 'Compétence 2', 'Compétence 3'] },
    projects: { title: 'Mes Projets', proj1: 'Projet 1', proj1desc: 'Description du projet', proj2: 'Projet 2', proj2desc: 'Description du projet' },
    experience: { title: 'Expérience', job1: 'Poste 1', company1: 'Entreprise', period1: '2023 - Présent', desc1: 'Description du rôle' },
    education: { title: 'Formation', degree1: 'Diplôme', school1: 'École', year1: '2020' },
    contact: { title: 'Contact', email: 'votre@email.com', cta: 'Me contacter' },
    testimonials: { title: 'Témoignages', quote1: 'Excellent travail !', author1: 'Client satisfait', role1: 'CEO, Startup' },
    stats: { stat1: '5+', label1: 'Années', stat2: '20', label2: 'Projets', stat3: '100%', label3: 'Satisfaction' },
    gallery: { title: 'Galerie', caption1: 'Projet 1', caption2: 'Projet 2', caption3: 'Projet 3' },
    cta: { title: 'Prêt à collaborer ?', subtitle: 'Contactez-moi pour discuter de votre projet', cta: 'Démarrer un projet' },
    divider: { style: 'wave' },
  };
  return defaults[type] ?? {};
}
