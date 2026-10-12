'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import TemplateLibrary from './TemplateLibrary';
import BlocksPanel from './BlocksPanel';
import CanvasEditor from './CanvasEditor';
import CustomizationPanel from './CustomizationPanel';
import PageStrip from './PageStrip';
import MediaPanel from './MediaPanel';
import { useHistory } from '../hooks/useHistory';
import { exportToPNG, exportToPDF, exportToPPTX } from '../utils/exportCanvas';
import { parsePptxClient } from '../utils/parsePptxClient';
import { createClient } from '@/lib/supabase/client';
import PublishTemplateModal from './PublishTemplateModal';

export type BlockType =
  | 'hero' |'about' |'skills' |'projects' |'experience' |'education' |'contact' |'testimonials' |'stats' |'gallery' |'cta' |'divider' |'languages' |'video' |'faq' | 'custom';

export interface BlockElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'shape';
  content?: string;
  url?: string;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  zIndex?: number;
  style?: Record<string, any>;
}

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  style: {
    bgColor: string;
    textColor: string;
    accentColor: string;
    padding: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    align: 'left' | 'center' | 'right';
    fontFamily: string;
    backgroundImage?: string;
    backgroundSize?: 'cover' | 'contain' | 'auto';
    opacity?: number;
  };
  layout?: {
    type: 'default' | 'split' | 'grid' | 'freeform';
    imagePosition?: 'left' | 'right' | 'top' | 'bottom';
    imageWidth?: '25%' | '33%' | '50%' | '66%';
    columns?: number;
    elements?: BlockElement[];
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
    presentationWidth?: number;
    presentationHeight?: number;
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
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    },
    style: { bgColor: '#0f0f1a', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' },
    layout: {
      type: 'split',
      imagePosition: 'right',
      imageWidth: '50%',
    },
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

type PanelView = 'templates' | 'blocks' | 'customize' | 'media' | 'saved';

export default function PortfolioEditorContent() {
  const { state: design, setState: setDesign, undo, redo, canUndo, canRedo } = useHistory<PortfolioDesign>(initialDesign);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block-1');
  const [panelView, setPanelView] = useState<PanelView>('blocks');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile' | 'presentation'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<'png' | 'pdf' | 'pptx' | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingPptx, setUploadingPptx] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragBlockId = useRef<string | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // ─── Check for template from URL (e.g. /portfolio-editor?templateId=xxx) ───
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('templateId');
    if (templateId) {
      import('@/lib/services/marketplaceService').then(({ getMarketplaceTemplates }) => {
        getMarketplaceTemplates().then((tpls) => {
          const match = tpls.find((t) => t.id === templateId);
          if (match && match.designData) {
            setDesign((prev) => ({
              ...prev,
              id: `design-${Date.now()}`,
              name: match.name,
              templateId: match.id,
              blocks: match.designData.blocks,
              globalStyle: match.designData.globalStyle || prev.globalStyle,
            }));
            if (match.designData.globalStyle?.presentationWidth) {
              setPreviewMode('presentation');
            }
            if (match.designData.blocks?.[0]?.id) {
              setSelectedBlockId(match.designData.blocks[0].id);
            }
          }
        });
      });
    }
  }, []);

  // ─── Keyboard shortcuts: Ctrl+Z / Ctrl+Y ───────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // ─── Export handlers ────────────────────────────────────────────
  const handleExportPNG = async () => {
    setExporting('png');
    await new Promise(r => setTimeout(r, 150));
    try { await exportToPNG('portfolio-canvas-export', `${design.name}.png`); }
    catch (e: any) { alert('Erreur export PNG: ' + e.message); }
    finally { setExporting(null); }
  };
  const handleExportPDF = async () => {
    setExporting('pdf');
    await new Promise(r => setTimeout(r, 150));
    try { await exportToPDF('portfolio-canvas-export', `${design.name}.pdf`); }
    catch (e: any) { alert('Erreur export PDF: ' + e.message); }
    finally { setExporting(null); }
  };
  const handleExportPPTX = async () => {
    setExporting('pptx');
    await new Promise(r => setTimeout(r, 150));
    try { await exportToPPTX('portfolio-canvas-export', `${design.name}.pptx`); }
    catch (e: any) { alert('Erreur export PPTX: ' + e.message); }
    finally { setExporting(null); }
  };

  // ─── Insert image into current freeform canvas ──────────────────────────
  const handleInsertImage = useCallback((url: string) => {
    const newEl = {
      id: Math.random().toString(36).slice(2),
      type: 'image' as const,
      url,
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      zIndex: 10,
      style: { borderRadius: '8px' },
    };
    // Add to selected block if freeform, else create new freeform block
    const targetBlock = design.blocks.find(b => b.id === selectedBlockId && b.layout?.type === 'freeform');
    if (targetBlock) {
      const updated = { ...targetBlock, layout: { ...targetBlock.layout!, elements: [...(targetBlock.layout!.elements || []), newEl] } };
      setDesign(prev => ({ ...prev, blocks: prev.blocks.map(b => b.id === updated.id ? updated : b) }));
    } else {
      const block = {
        id: `block-img-${Date.now()}`,
        type: 'custom' as const,
        content: { title: 'Image' },
        style: { bgColor: '#ffffff', textColor: '#000', accentColor: '#3b82f6', padding: 'none' as const, align: 'left' as const, fontFamily: 'Plus Jakarta Sans' },
        layout: { type: 'freeform' as const, elements: [newEl] },
      };
      setDesign(prev => ({ ...prev, blocks: [block, ...prev.blocks] }));
      setSelectedBlockId(block.id);
    }
  }, [design.blocks, selectedBlockId]);

  const [publishedTemplateIds, setPublishedTemplateIds] = useState<string[]>([]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editingTemplateName, setEditingTemplateName] = useState<string>('');

  const loadSavedTemplates = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('my_templates').select('*').order('created_at', { ascending: false });
    if (data) setSavedTemplates(data);

    // Fetch marketplace templates to check publication status
    try {
      const { getMarketplaceTemplates } = await import('@/lib/services/marketplaceService');
      const mkt = await getMarketplaceTemplates();
      const pubIds = mkt.map(m => m.originalTemplateId || m.id).filter(Boolean) as string[];
      setPublishedTemplateIds(pubIds);
    } catch {
      // ignore
    }
  };

  const handleSaveTemplateRename = async (templateId: string) => {
    const trimmed = editingTemplateName.trim();
    if (!trimmed) return;
    try {
      const supabase = createClient();
      const target = savedTemplates.find((s) => s.id === templateId);
      const updatedModified = target?.modified_design ? { ...target.modified_design, name: trimmed } : undefined;
      const updatedOriginal = target?.original_design ? { ...target.original_design, name: trimmed } : undefined;

      await supabase.from('my_templates').update({
        name: trimmed,
        ...(updatedModified ? { modified_design: updatedModified } : {}),
        ...(updatedOriginal ? { original_design: updatedOriginal } : {}),
      }).eq('id', templateId);

      // If published to marketplace, update marketplace template name as well
      try {
        const { getMarketplaceTemplates } = await import('@/lib/services/marketplaceService');
        const mkt = await getMarketplaceTemplates();
        const mktMatch = mkt.find(m => m.originalTemplateId === templateId || m.id === templateId);
        if (mktMatch) {
          await supabase.from('marketplace_templates').update({ name: trimmed }).eq('id', mktMatch.id);
        }
      } catch {
        // ignore
      }

      // If active design is this template, update current design name too
      if (design.id === templateId) {
        setDesign((prev) => ({ ...prev, name: trimmed }));
      }

      setEditingTemplateId(null);
      await loadSavedTemplates();
    } catch (err: any) {
      console.error('Error renaming template', err);
      alert('Erreur lors du renommage : ' + err.message);
    }
  };

  const handleCreateNewPortfolio = () => {
    const newName = prompt('Nom du nouveau portfolio :', 'Mon Nouveau Portfolio');
    if (!newName || !newName.trim()) return;
    setDesign({
      ...initialDesign,
      id: `design-${Date.now()}`,
      name: newName.trim(),
      blocks: defaultBlocks,
    });
    setSelectedBlockId('block-1');
    setPanelView('blocks');
  };

  const handleAutoSaveName = async () => {
    const dbId = design.id.startsWith('design-') ? undefined : design.id;
    if (dbId && design.name.trim()) {
      try {
        const supabase = createClient();
        await supabase.from('my_templates').update({
          name: design.name.trim(),
        }).eq('id', dbId);
      } catch (err) {
        console.warn('Auto-save name error', err);
      }
    }
  };

  useEffect(() => {
    if (panelView === 'saved') loadSavedTemplates();
  }, [panelView]);

  const selectedBlock = design.blocks.find((b) => b.id === selectedBlockId) ?? null;

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (300MB)
    if (file.size > 300 * 1024 * 1024) {
      alert("Ce fichier PDF est trop volumineux. La limite est fixée à 300 Mo.");
      return;
    }

    setUploadingPdf(true);
    try {
      // Use the new native PDF parser (100% fidelity) instead of AI
      const { parsePdfClient } = await import('../utils/parsePdfClient');
      const result = await parsePdfClient(file) as any;
      const blocks = result.blocks;
      
      if (blocks && blocks.length > 0) {
        const cleanPdfName = file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ') || 'Document PDF';
        setDesign(prev => ({
          ...prev,
          id: `design-${Date.now()}`,
          name: cleanPdfName,
          blocks: blocks,
          globalStyle: {
            ...prev.globalStyle,
            presentationWidth: result.presentationWidth,
            presentationHeight: result.presentationHeight
          }
        }));
        setPreviewMode('presentation');
        setSelectedBlockId(blocks[0]?.id || null);
        setPanelView('blocks');
      } else {
        alert("Erreur: aucune page n'a été trouvée dans le PDF.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Une erreur est survenue lors de l'analyse du PDF.");
    } finally {
      setUploadingPdf(false);
      if (e.target) e.target.value = '';
    }
  };

  const handlePptxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPptx(true);
    try {
      const result = await parsePptxClient(file) as any;
      const blocks = result.blocks;
      if (blocks && blocks.length > 0) {
        const cleanPptxName = file.name.replace(/\.pptx$/i, '').replace(/[_-]/g, ' ') || 'Présentation PPTX';
        setDesign(prev => ({
          ...prev,
          id: `design-${Date.now()}`,
          name: cleanPptxName,
          blocks: blocks,
          globalStyle: {
            ...prev.globalStyle,
            presentationWidth: result.presentationWidth,
            presentationHeight: result.presentationHeight
          }
        }));
        setPreviewMode('presentation');
        setSelectedBlockId(blocks[0]?.id || null);
        setPanelView('blocks');
      } else {
        alert("Erreur: aucune diapositive n'a été trouvée.");
      }
    } catch(err) {
      console.error(err);
      alert("Erreur lors du traitement du fichier PPTX.");
    } finally {
      setUploadingPptx(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddBlock = useCallback((type: BlockType = 'custom') => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: previewMode === 'presentation' && type === 'custom' ? { title: 'Nouvelle Slide' } : getDefaultContent(type),
      style: {
        bgColor: '#ffffff',
        textColor: '#111827',
        accentColor: design.globalStyle.primaryColor,
        padding: 'md',
        align: 'left',
        fontFamily: design.globalStyle.fontBody,
      },
      layout: previewMode === 'presentation' && type === 'custom' ? { type: 'freeform', elements: [] } : { type: 'default' }
    };
    setDesign((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    setSelectedBlockId(newBlock.id);
    setPanelView('blocks');
  }, [design.globalStyle, previewMode]);

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
    setDesign((prev) => ({
      ...prev,
      id: `design-${Date.now()}`,
      templateId,
      blocks: templateBlocks,
      globalStyle,
    }));
    setSelectedBlockId(templateBlocks[0]?.id ?? null);
    if (templateId.startsWith('blank-')) {
      setPreviewMode('presentation');
    }
    setPanelView('blocks');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      let dbId = design.id.startsWith('design-') ? undefined : design.id;
      
      if (dbId) {
        // Update
        const { error } = await supabase.from('my_templates').update({
          name: design.name,
          modified_design: design,
        }).eq('id', dbId);
        if (error) throw error;
        alert(`Portfolio "${design.name}" mis à jour avec succès !`);
      } else {
        // Insert
        const { data, error } = await supabase.from('my_templates').insert({
          name: design.name,
          original_design: design,
          modified_design: design,
        }).select().single();
        if (error) throw error;
        if (data) setDesign(prev => ({ ...prev, id: data.id }));
        alert(`Nouveau portfolio "${design.name}" enregistré avec succès !`);
      }
      loadSavedTemplates();
    } catch (e: any) {
      console.error(e);
      alert("Erreur de sauvegarde: " + e.message);
    }
    setSaving(false);
  };

  const handleSaveAsNew = async () => {
    const copyName = prompt("Nom pour cette nouvelle copie de portfolio :", `${design.name} (Nouveau)`);
    if (!copyName || !copyName.trim()) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const newDesign = {
        ...design,
        id: `design-${Date.now()}`,
        name: copyName.trim(),
      };

      const { data, error } = await supabase.from('my_templates').insert({
        name: copyName.trim(),
        original_design: newDesign,
        modified_design: newDesign,
      }).select().single();

      if (error) throw error;
      if (data) {
        setDesign({ ...newDesign, id: data.id });
      }
      alert(`Nouveau portfolio "${copyName.trim()}" enregistré avec succès !`);
      loadSavedTemplates();
    } catch (e: any) {
      console.error(e);
      alert("Erreur: " + e.message);
    }
    setSaving(false);
  };

  const handleDuplicateTemplate = async (templateItem: any) => {
    const copyName = `${templateItem.name} (Copie)`;
    try {
      const supabase = createClient();
      const newDesign = {
        ...(templateItem.modified_design || templateItem.original_design || initialDesign),
        id: `design-${Date.now()}`,
        name: copyName,
      };

      const { error } = await supabase.from('my_templates').insert({
        name: copyName,
        original_design: newDesign,
        modified_design: newDesign,
      });

      if (error) throw error;
      alert(`Portfolio dupliqué sous le nom "${copyName}" !`);
      loadSavedTemplates();
    } catch (e: any) {
      console.error(e);
      alert("Erreur de duplication: " + e.message);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] -mx-6 -mt-2">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/60 hover:border-border focus-within:border-primary focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
            <Icon name="PencilSquareIcon" size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            <input
              value={design.name}
              onChange={(e) => setDesign((prev) => ({ ...prev, name: e.target.value }))}
              onBlur={handleAutoSaveName}
              placeholder="Nom de votre portfolio..."
              className="text-sm font-bold text-foreground bg-transparent border-none outline-none w-44 sm:w-64 truncate"
              title="Cliquez pour modifier le nom du portfolio"
            />
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full hidden sm:inline">
            Brouillon
          </span>
        </div>

        {/* Preview device switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {(['desktop', 'tablet', 'mobile', 'presentation'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                previewMode === mode ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={mode === 'desktop' ? 'ComputerDesktopIcon' : mode === 'tablet' ? 'DeviceTabletIcon' : mode === 'mobile' ? 'DevicePhoneMobileIcon' : 'PresentationChartBarIcon'} size={13} />
              <span className="hidden sm:inline capitalize">{mode === 'desktop' ? 'Bureau' : mode === 'tablet' ? 'Tablette' : mode === 'mobile' ? 'Mobile' : 'Diapo (16:9)'}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Annuler (Ctrl+Z)"
              className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-600 transition-all disabled:opacity-30 text-muted-foreground hover:text-foreground hover:bg-card"
            >
              <Icon name="ArrowUturnLeftIcon" size={13} />
              <span className="hidden lg:inline">Annuler</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Rétablir (Ctrl+Y)"
              className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-600 transition-all disabled:opacity-30 text-muted-foreground hover:text-foreground hover:bg-card"
            >
              <Icon name="ArrowUturnRightIcon" size={13} />
              <span className="hidden lg:inline">Rétablir</span>
            </button>
          </div>

          {/* Import Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowImportMenu(!showImportMenu);
                setShowExportMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all border border-border text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              <Icon name="ArrowUpTrayIcon" size={13} />
              Importer
              <Icon name="ChevronDownIcon" size={12} className={`transition-transform ${showImportMenu ? 'rotate-180' : ''}`} />
            </button>
            {showImportMenu && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 flex flex-col">
                <label className={`flex items-center gap-2 px-3 py-2 text-xs font-600 transition-all text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer whitespace-nowrap ${uploadingPptx ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Icon name={uploadingPptx ? "ArrowPathIcon" : "PresentationChartBarIcon"} size={13} className={uploadingPptx ? "animate-spin" : ""} />
                  Fichier PPTX
                  <input 
                    type="file" 
                    accept=".pptx" 
                    className="hidden" 
                    onChange={(e) => {
                      setShowImportMenu(false);
                      handlePptxUpload(e);
                    }}
                    disabled={uploadingPptx}
                  />
                </label>
                <label className={`flex items-center gap-2 px-3 py-2 text-xs font-600 transition-all text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer whitespace-nowrap ${uploadingPdf ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Icon name={uploadingPdf ? "ArrowPathIcon" : "DocumentTextIcon"} size={13} className={uploadingPdf ? "animate-spin" : ""} />
                  Fichier PDF
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={(e) => {
                      setShowImportMenu(false);
                      handlePdfUpload(e);
                    }}
                    disabled={uploadingPdf}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowImportMenu(false);
              }}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all border border-border text-muted-foreground hover:text-foreground disabled:opacity-50 whitespace-nowrap"
            >
              {exporting ? <Icon name="ArrowPathIcon" size={13} className="animate-spin" /> : <Icon name="ArrowDownTrayIcon" size={13} />}
              Exporter
              <Icon name="ChevronDownIcon" size={12} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            {showExportMenu && !exporting && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 flex flex-col">
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    handleExportPNG();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-600 transition-all text-muted-foreground hover:text-foreground hover:bg-muted text-left w-full"
                >
                  <Icon name="PhotoIcon" size={13} />
                  Image PNG
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    handleExportPDF();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-600 transition-all text-muted-foreground hover:text-foreground hover:bg-muted text-left w-full border-t border-border"
                >
                  <Icon name="DocumentIcon" size={13} />
                  Document PDF
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    handleExportPPTX();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-600 transition-all text-muted-foreground hover:text-foreground hover:bg-muted text-left w-full border-t border-border"
                >
                  <Icon name="PresentationChartBarIcon" size={13} />
                  PowerPoint PPTX
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all border whitespace-nowrap ${
              showPreview ? 'bg-primary/10 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="EyeIcon" size={13} />
            Aperçu
          </button>
          {/* Nouveau Portfolio */}
          <button
            onClick={handleCreateNewPortfolio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-all cursor-pointer whitespace-nowrap"
            title="Créer un tout nouveau portfolio vierge sans écraser le portfolio actuel"
          >
            <Icon name="PlusIcon" size={13} />
            <span className="hidden sm:inline">Nouveau</span>
          </button>

          {/* Enregistrer sous / Nouveau Portfolio */}
          <button
            onClick={handleSaveAsNew}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-foreground hover:bg-muted/80 border border-border transition-all whitespace-nowrap cursor-pointer"
            title="Créer un nouveau portfolio distinct avec ce contenu"
          >
            <Icon name="DocumentDuplicateIcon" size={13} />
            <span className="hidden lg:inline">Enregistrer sous...</span>
          </button>

          {/* Enregistrer (Met à jour ou Crée) */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-60 transition-all whitespace-nowrap shadow-xs cursor-pointer"
            title="Enregistrer les modifications"
          >
            {saving ? <Icon name="ArrowPathIcon" size={13} className="animate-spin" /> : <Icon name="CloudArrowUpIcon" size={13} />}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>

          {/* Partager Template Marketplace */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 whitespace-nowrap cursor-pointer"
            title="Partager ce modèle sur la Marketplace publique"
          >
            <Icon name="GlobeAltIcon" size={13} />
            <span className="hidden md:inline">Partager en Template</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-border flex-wrap">
            {([
              { key: 'templates', icon: 'RectangleGroupIcon', label: 'Templates' },
              { key: 'blocks', icon: 'QueueListIcon', label: 'Blocs' },
              { key: 'customize', icon: 'SwatchIcon', label: 'Style' },
              { key: 'media', icon: 'PhotoIcon', label: 'Médias' },
              { key: 'saved', icon: 'HeartIcon', label: 'Modèles' },
            ] as const).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setPanelView(key)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-600 transition-all border-b-2 min-w-[44px] ${
                  panelView === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={icon} size={14} />
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {panelView === 'templates' && (
              <TemplateLibrary onApply={handleApplyTemplate} currentTemplateId={design.templateId} />
            )}
            {panelView === 'blocks' && (
              <BlocksPanel 
                onAddBlock={handleAddBlock}
                selectedBlock={selectedBlock || undefined}
                onUpdateBlock={handleUpdateBlock}
              />
            )}
            {panelView === 'customize' && (
              <CustomizationPanel
                design={design}
                selectedBlock={selectedBlock}
                onUpdateDesign={setDesign}
                onUpdateBlock={handleUpdateBlock}
              />
            )}
            {panelView === 'media' && (
              <MediaPanel onInsertImage={handleInsertImage} />
            )}
            {panelView === 'saved' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Mes Modèles</h3>
                    <p className="text-[11px] text-muted-foreground">{savedTemplates.length} portfolio{savedTemplates.length > 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={handleCreateNewPortfolio}
                    className="text-xs bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg font-bold hover:opacity-90 flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    title="Créer un nouveau portfolio vierge"
                  >
                    <Icon name="PlusIcon" size={13} /> Nouveau
                  </button>
                </div>
                {savedTemplates.map((t) => (
                  <div key={t.id} className="p-3.5 border border-border rounded-xl bg-muted/20 space-y-3 hover:border-border/80 transition-all">
                    {/* Header: Name with Inline Renaming */}
                    {editingTemplateId === t.id ? (
                      <div className="space-y-1.5 bg-card p-2 rounded-lg border border-primary/50 shadow-xs">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Modifier le nom</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingTemplateName}
                            onChange={(e) => setEditingTemplateName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveTemplateRename(t.id);
                              if (e.key === 'Escape') setEditingTemplateId(null);
                            }}
                            className="flex-1 text-xs font-bold px-2 py-1.5 rounded-md border border-border bg-muted/30 text-foreground outline-none focus:border-primary"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveTemplateRename(t.id)}
                            className="px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                            title="Valider le nom"
                          >
                            <Icon name="CheckIcon" size={12} />
                          </button>
                          <button
                            onClick={() => setEditingTemplateId(null)}
                            className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                            title="Annuler"
                          >
                            <Icon name="XMarkIcon" size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-foreground truncate" title={t.name}>
                            {t.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Sauvegardé le {new Date(t.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingTemplateId(t.id);
                            setEditingTemplateName(t.name);
                          }}
                          className="px-2 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-1 text-xs border border-border/50 cursor-pointer"
                          title="Renommer ce portfolio"
                        >
                          <Icon name="PencilSquareIcon" size={12} />
                          <span className="text-[10px] font-bold">Renommer</span>
                        </button>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <button onClick={() => {
                        const url = `${window.location.origin}/p/${t.id}`;
                        navigator.clipboard.writeText(url);
                        alert(`Lien copié : ${url}`);
                      }} className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-600 hover:bg-emerald-200 flex items-center justify-center gap-2">
                        <Icon name="LinkIcon" size={12} /> Copier le lien public
                      </button>
                      <button onClick={() => setDesign(t.modified_design || t.original_design)} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-600 hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer">
                        <Icon name="PencilIcon" size={12} /> Charger (Version Modifiée)
                      </button>
                      <button onClick={() => setDesign(t.original_design)} className="text-xs bg-card border border-border text-foreground px-3 py-1.5 rounded-lg font-600 hover:bg-muted flex items-center justify-center gap-2 cursor-pointer">
                        <Icon name="ClockIcon" size={12} /> Charger (Version Originale)
                      </button>
                      <button onClick={() => handleDuplicateTemplate(t)} className="text-xs bg-muted text-foreground border border-border px-3 py-1.5 rounded-lg font-600 hover:bg-muted/80 flex items-center justify-center gap-2 transition-all cursor-pointer" title="Créer une copie indépendante de ce portfolio">
                        <Icon name="DocumentDuplicateIcon" size={12} /> Dupliquer ce portfolio
                      </button>
                    </div>

                    {/* Marketplace Toggle / Status */}
                    <div className="pt-2 border-t border-border flex flex-col gap-1.5">
                      {publishedTemplateIds.includes(t.id) ? (
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                          <span className="text-[11px] font-700 text-emerald-600 flex items-center gap-1">
                            <Icon name="CheckCircleIcon" size={12} /> Sur la Marketplace
                          </span>
                          <button
                            onClick={async () => {
                              if (!confirm("Retirer ce modèle de la Marketplace publique ?")) return;
                              const { removeFromMarketplace } = await import('@/lib/services/marketplaceService');
                              await removeFromMarketplace(t.id);
                              loadSavedTemplates();
                            }}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 underline"
                          >
                            Retirer
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setDesign(t.modified_design || t.original_design);
                            setShowPublishModal(true);
                          }}
                          className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg font-700 hover:bg-primary/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Icon name="GlobeAltIcon" size={13} />
                          Mettre sur la Marketplace
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border mt-1">
                      <button onClick={async () => {
                        if (!confirm("Voulez-vous vraiment supprimer ce modèle ?")) return;
                        const supabase = createClient();
                        await supabase.from('my_templates').delete().eq('id', t.id);
                        // Also remove from marketplace if was published
                        const { removeFromMarketplace } = await import('@/lib/services/marketplaceService');
                        await removeFromMarketplace(t.id);
                        loadSavedTemplates();
                      }} className="text-xs text-red-500 hover:text-red-600 font-600 w-full text-center flex items-center justify-center gap-1">
                        <Icon name="TrashIcon" size={12} /> Supprimer définitivement
                      </button>
                    </div>
                  </div>
                ))}
                {savedTemplates.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="FolderIcon" size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Aucun modèle sauvegardé pour le moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#f0f0f5]">
          <div className="flex-1 overflow-auto flex items-start justify-center p-6 pb-8">
            <CanvasEditor
              design={design}
              selectedBlockId={selectedBlockId}
              previewMode={previewMode}
              showPreview={showPreview || !!exporting}
              dragOverIndex={dragOverIndex}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={setDragOverIndex}
              onOpenCustomize={() => setPanelView('customize')}
              isPresentationMode={previewMode === 'presentation'}
            />
          </div>
          
          {/* PageStrip (Visible only in presentation mode) */}
          {previewMode === 'presentation' && (
            <div className="flex-shrink-0 w-full z-50">
              <PageStrip
                blocks={design.blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onAddBlock={() => handleAddBlock('custom')}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal for publishing template to Marketplace */}
      <PublishTemplateModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        design={design}
        onSuccess={() => {
          // Open notification or redirect optionally
        }}
      />
    </div>
  );
}

function getDefaultContent(type: BlockType): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
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
    languages: { title: 'Langues', lang1: 'Français', level1: 'Natif', lang2: 'Anglais', level2: 'Bilingue' },
    video: { title: 'Présentation Vidéo', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    faq: { title: 'Questions fréquentes', q1: 'Êtes-vous ouvert aux opportunités ?', a1: 'Oui, je suis actuellement à l\'écoute du marché.', q2: 'Quels sont vos tarifs ?', a2: 'Mes tarifs dépendent de la complexité du projet, contactez-moi.' },
  };
  return defaults[type] ?? {};
}
