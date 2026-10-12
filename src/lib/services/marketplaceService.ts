import { createClient } from '@/lib/supabase/client';
import type { Block, PortfolioDesign } from '../app/portfolio-editor/components/PortfolioEditorContent';

export interface MarketplaceTemplateItem {
  id: string;
  name: string;
  author: string;
  category: string;
  theme: string;
  description: string;
  downloads: number;
  likesCount?: number;
  rating: number;
  previewThumbnail?: string;
  previewColor?: string;
  tags: string[];
  isPremium: boolean;
  isNew?: boolean;
  createdAt: string;
  designData: {
    blocks: Block[];
    globalStyle: PortfolioDesign['globalStyle'];
    templateId?: string;
  };
}

const LOCAL_STORAGE_KEY = 'portfoliogen_marketplace_templates';

// Default starter templates in Marketplace
export const DEFAULT_MARKETPLACE_TEMPLATES: MarketplaceTemplateItem[] = [
  {
    id: 'mkt-dark-pro',
    name: 'Dark Pro Engineer',
    author: 'Alex Martin',
    category: 'Tech',
    theme: 'Dark',
    description: 'Portfolio sombre & percutant orienté ingénierie logicielle et IA.',
    downloads: 1420,
    rating: 4.9,
    previewColor: '#7c3aed',
    tags: ['Tech', 'FullStack', 'Dark', 'IA'],
    isPremium: false,
    isNew: false,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'dark-pro',
      globalStyle: { primaryColor: '#7c3aed', secondaryColor: '#a78bfa', bgColor: '#0f0f1a', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'md', darkMode: true },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Alex Martin', title: 'Développeur Full-Stack & Architecte IA', tagline: 'Code. Scale. Ship. De l\'idée à la production.', cta: 'Voir mes projets', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' }, style: { bgColor: '#0f0f1a', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' }, layout: { type: 'split', imagePosition: 'right', imageWidth: '50%' } },
        { id: 'b2', type: 'stats', content: { stat1: '8+', label1: 'Années d\'expérience', stat2: '42', label2: 'Projets livrés', stat3: '98%', label3: 'Satisfaction client', stat4: '12', label4: 'Startups accompagnées' }, style: { bgColor: '#7c3aed', textColor: '#ffffff', accentColor: '#a78bfa', padding: 'md', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
        { id: 'b3', type: 'skills', content: { title: 'Stack & Compétences', skills: ['TypeScript', 'Next.js', 'Python / PyTorch', 'Node.js', 'PostgreSQL', 'Docker & K8s'] }, style: { bgColor: '#111827', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
        { id: 'b4', type: 'projects', content: { title: 'Projets Phares', proj1: 'NeuralCommerce Platform', proj1desc: 'Recommandation e-commerce IA temps réel', proj2: 'DistributedDB Orchestrator', proj2desc: 'Orchestrateur cloud natif distribué' }, style: { bgColor: '#0f0f1a', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
        { id: 'b5', type: 'contact', content: { title: 'Démarrons un projet ensemble', email: 'alex@example.com', cta: 'Prendre contact' }, style: { bgColor: '#7c3aed', textColor: '#ffffff', accentColor: '#a78bfa', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
      ],
    },
  },
  {
    id: 'mkt-minimal-light',
    name: 'Minimal Light Studio',
    author: 'Sophie Durand',
    category: 'Design',
    theme: 'Minimaliste',
    description: 'Épuré et élégant avec mise en valeur éditoriale de vos réalisations.',
    downloads: 980,
    rating: 4.8,
    previewColor: '#111827',
    tags: ['Design', 'UI/UX', 'Minimaliste', 'Clean'],
    isPremium: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'minimal-light',
      globalStyle: { primaryColor: '#111827', secondaryColor: '#6b7280', bgColor: '#fafafa', fontHeading: 'Manrope', fontBody: 'DM Sans', borderRadius: 'sm', darkMode: false },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Sophie Durand', title: 'Product & UX/UI Designer', tagline: 'Concevoir des interfaces mémorables, simples et intuitives.', cta: 'Découvrir mon portfolio', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' }, style: { bgColor: '#fafafa', textColor: '#111827', accentColor: '#111827', padding: 'lg', align: 'left', fontFamily: 'Manrope' }, layout: { type: 'split', imagePosition: 'right', imageWidth: '50%' } },
        { id: 'b2', type: 'about', content: { title: 'Mon Approche', text: 'Je conçois des systèmes d\'interfaces pensés pour l\'humain, alliant esthétique rigoureuse et conversion business.' }, style: { bgColor: '#ffffff', textColor: '#374151', accentColor: '#111827', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
        { id: 'b3', type: 'projects', content: { title: 'Études de Cas', proj1: 'Refonte Banque Mobile', proj1desc: 'Expérience fluide pour +2M utilisateurs actifs', proj2: 'Design System SaaS', proj2desc: 'Bibliothèque de 80+ composants Figma & code' }, style: { bgColor: '#f9fafb', textColor: '#111827', accentColor: '#111827', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
        { id: 'b4', type: 'contact', content: { title: 'Collaborons', email: 'sophie@example.com', cta: 'Planifier un appel' }, style: { bgColor: '#111827', textColor: '#ffffff', accentColor: '#ffffff', padding: 'lg', align: 'center', fontFamily: 'Manrope' } },
      ],
    },
  },
  {
    id: 'mkt-creative-bold',
    name: 'Creative Pulse & Motion',
    author: 'Lucas Bernard',
    category: 'Créatif',
    theme: 'Coloré',
    description: 'Palette dynamique et impactante pour artistes et studios créatifs.',
    downloads: 750,
    rating: 4.9,
    previewColor: '#f59e0b',
    tags: ['Motion', 'Vidéo', 'Créatif', 'Bold'],
    isPremium: true,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'vibrant-creative',
      globalStyle: { primaryColor: '#f59e0b', secondaryColor: '#fbbf24', bgColor: '#fffbeb', fontHeading: 'Cabinet Grotesk', fontBody: 'Plus Jakarta Sans', borderRadius: 'lg', darkMode: false },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Lucas Bernard', title: 'Directeur Artistique & Motion', tagline: 'Donner du rythme et de l\'émotion à vos récits de marque.', cta: 'Voir le Showreel' }, style: { bgColor: '#fef3c7', textColor: '#111827', accentColor: '#f59e0b', padding: 'lg', align: 'center', fontFamily: 'Cabinet Grotesk' } },
        { id: 'b2', type: 'stats', content: { stat1: '6+', label1: 'Années d\'exp.', stat2: '120+', label2: 'Animations', stat3: '35', label3: 'Grandes marques', stat4: '5', label4: 'Distinctions' }, style: { bgColor: '#f59e0b', textColor: '#ffffff', accentColor: '#fbbf24', padding: 'md', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
        { id: 'b3', type: 'gallery', content: { title: 'Galerie Réalisations', caption1: 'Spot Publicitaire', caption2: 'Identité Visuelle 3D', caption3: 'Générique Web-Série' }, style: { bgColor: '#fffbeb', textColor: '#111827', accentColor: '#f59e0b', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' } },
        { id: 'b4', type: 'cta', content: { title: 'Un projet en tête ?', subtitle: 'Donnons-lui vie ensemble', cta: 'Lancer une collaboration' }, style: { bgColor: '#111827', textColor: '#ffffff', accentColor: '#f59e0b', padding: 'lg', align: 'center', fontFamily: 'Cabinet Grotesk' } },
      ],
    },
  },
  {
    id: 'mkt-presentation-pitch',
    name: 'Investor Pitch Deck 16:9',
    author: 'PortfolioGen Team',
    category: 'Business',
    theme: 'Bold',
    description: 'Format diapositives 16:9 optimisé pour présenter sa startup ou ses projets.',
    downloads: 1120,
    rating: 4.9,
    previewColor: '#2563eb',
    tags: ['Slides', 'Pitch Deck', '16:9', 'Investisseurs'],
    isPremium: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'pitch-deck-16-9',
      globalStyle: { primaryColor: '#2563eb', secondaryColor: '#60a5fa', bgColor: '#ffffff', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'md', darkMode: false, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        {
          id: 'slide-1',
          type: 'custom',
          content: { title: 'Slide 1 — Couverture' },
          style: { bgColor: '#0f172a', textColor: '#ffffff', accentColor: '#38bdf8', padding: 'none', align: 'left', fontFamily: 'Plus Jakarta Sans' },
          layout: {
            type: 'freeform',
            elements: [
              { id: 's1-title', type: 'text', content: 'PortfolioGen Inc.', x: 100, y: 220, width: 800, height: 80, zIndex: 10, style: { fontSize: '54px', fontWeight: 'bold', color: '#ffffff' } },
              { id: 's1-sub', type: 'text', content: 'La plateforme nouvelle génération de portfolios interactifs & IA.', x: 100, y: 320, width: 750, height: 60, zIndex: 10, style: { fontSize: '24px', color: '#94a3b8' } },
              { id: 's1-btn', type: 'button', content: 'Pitch Deck Confidentiel • 2026', x: 100, y: 440, width: 280, height: 48, zIndex: 10, style: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', fontSize: '15px' } },
            ]
          }
        },
        {
          id: 'slide-2',
          type: 'custom',
          content: { title: 'Slide 2 — Le Problème & La Solution' },
          style: { bgColor: '#ffffff', textColor: '#0f172a', accentColor: '#2563eb', padding: 'none', align: 'left', fontFamily: 'Plus Jakarta Sans' },
          layout: {
            type: 'freeform',
            elements: [
              { id: 's2-title', type: 'text', content: 'Le Problème vs Notre Solution', x: 80, y: 80, width: 700, height: 60, zIndex: 10, style: { fontSize: '36px', fontWeight: 'bold', color: '#0f172a' } },
              { id: 's2-card1', type: 'shape', x: 80, y: 180, width: 500, height: 400, zIndex: 5, style: { backgroundColor: '#fee2e2', borderRadius: '16px' } },
              { id: 's2-c1-t', type: 'text', content: 'Les portfolios traditionnels sont statiques, longs à concevoir et non interactifs.', x: 110, y: 240, width: 440, height: 180, zIndex: 10, style: { fontSize: '20px', color: '#991b1b', lineHeight: '1.6' } },
              { id: 's2-card2', type: 'shape', x: 640, y: 180, width: 560, height: 400, zIndex: 5, style: { backgroundColor: '#dbeafe', borderRadius: '16px' } },
              { id: 's2-c2-t', type: 'text', content: 'Import direct depuis Canva/PDF/PPTX, personnalisation temps réel et publication en 1 clic.', x: 670, y: 240, width: 500, height: 180, zIndex: 10, style: { fontSize: '20px', color: '#1e40af', lineHeight: '1.6' } },
            ]
          }
        }
      ]
    }
  }
];

// Helper to fetch all templates (Supabase + localStorage fallback)
export async function getMarketplaceTemplates(): Promise<MarketplaceTemplateItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('marketplace_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Map Supabase rows to our interface
      const supabaseTemplates: MarketplaceTemplateItem[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        author: row.author || 'Communauté',
        category: row.category || 'Tech',
        theme: row.theme || 'Minimaliste',
        description: row.description || '',
        downloads: row.downloads || 0,
        rating: row.rating || 5.0,
        previewColor: row.preview_color || '#7c3aed',
        tags: Array.isArray(row.tags) ? row.tags : [],
        isPremium: !!row.is_premium,
        isNew: !!row.is_new,
        createdAt: row.created_at,
        designData: row.design_data || {},
      }));

      // Combine with local additions
      const local = getLocalTemplates();
      const combined = [...local, ...supabaseTemplates];
      // Deduplicate by id
      const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
      return unique;
    }
  } catch (err) {
    console.warn('Supabase marketplace error or table missing, using localStorage fallback', err);
  }

  // Fallback: localStorage + default templates
  const local = getLocalTemplates();
  const all = [...local, ...DEFAULT_MARKETPLACE_TEMPLATES];
  return Array.from(new Map(all.map(item => [item.id, item])).values());
}

// Get user published templates from localStorage
function getLocalTemplates(): MarketplaceTemplateItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Publish a template to Marketplace
export async function publishToMarketplace(template: Omit<MarketplaceTemplateItem, 'id' | 'createdAt' | 'downloads' | 'rating'>): Promise<MarketplaceTemplateItem> {
  const newId = `mkt-${Date.now()}`;
  const newItem: MarketplaceTemplateItem = {
    ...template,
    id: newId,
    downloads: 1,
    rating: 5.0,
    isNew: true,
    createdAt: new Date().toISOString(),
  };

  // Try to save to Supabase if table exists
  try {
    const supabase = createClient();
    await supabase.from('marketplace_templates').insert({
      id: newItem.id,
      name: newItem.name,
      author: newItem.author,
      category: newItem.category,
      theme: newItem.theme,
      description: newItem.description,
      downloads: newItem.downloads,
      rating: newItem.rating,
      preview_thumbnail: newItem.previewThumbnail,
      preview_color: newItem.previewColor,
      tags: newItem.tags,
      is_premium: newItem.isPremium,
      is_new: newItem.isNew,
      design_data: newItem.designData,
    });
  } catch (err) {
    console.warn('Could not save to Supabase marketplace_templates, fallback to local', err);
  }

  // Always save to localStorage so the current user sees it immediately
  if (typeof window !== 'undefined') {
    const local = getLocalTemplates();
    const updated = [newItem, ...local];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }

  return newItem;
}

// Increment downloads count
export async function trackTemplateDownload(templateId: string) {
  try {
    const supabase = createClient();
    await supabase.rpc('increment_template_downloads', { tpl_id: templateId });
  } catch {
    // silently continue
  }
}
