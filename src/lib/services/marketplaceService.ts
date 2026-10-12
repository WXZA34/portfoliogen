import { createClient } from '@/lib/supabase/client';
import type { Block, PortfolioDesign } from '../app/portfolio-editor/components/PortfolioEditorContent';

export interface MarketplaceTemplateItem {
  id: string;
  originalTemplateId?: string; // ID of the local saved template in my_templates
  name: string;
  author: string;
  category: string;
  theme: string;
  description: string;
  downloads: number;
  likesCount?: number;
  rating: number;
  previewThumbnail?: string;
  previewSlides?: string[]; // Array of slide preview images or backgrounds that cycle on hover
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
    name: 'Meet My Team • Dark Executive',
    author: 'Adeline Fahnestock',
    category: 'Tech',
    theme: 'Dark',
    description: 'Présentation sombre et sophistiquée avec portraits en noir & blanc, présentation d\'équipe et projets d\'envergure.',
    downloads: 1850,
    rating: 4.9,
    previewThumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#18181b',
    tags: ['Team', 'Dark Mode', 'Executive', 'Tech'],
    isPremium: false,
    isNew: false,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'dark-pro',
      globalStyle: { primaryColor: '#ffffff', secondaryColor: '#a1a1aa', bgColor: '#18181b', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'md', darkMode: true, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Meet My Team', title: 'Creative Engineering Studio', tagline: 'Des talents d\'exception réunis pour concevoir des expériences numériques remarquables.', cta: 'Découvrir nos profils' }, style: { bgColor: '#18181b', textColor: '#ffffff', accentColor: '#ffffff', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
        { id: 'b2', type: 'stats', content: { stat1: '14+', label1: 'Experts', stat2: '80+', label2: 'Projets livrés', stat3: '99%', label3: 'Satisfaction', stat4: '6', label4: 'Bureaux mondiaux' }, style: { bgColor: '#27272a', textColor: '#ffffff', accentColor: '#ffffff', padding: 'md', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
        { id: 'b3', type: 'projects', content: { title: 'Réalisations récentes', proj1: 'Banking Ecosystem', proj1desc: 'Expérience financière premium', proj2: 'AI Search Engine', proj2desc: 'Moteur sémantique haute performance' }, style: { bgColor: '#18181b', textColor: '#ffffff', accentColor: '#ffffff', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      ],
    },
  },
  {
    id: 'mkt-personal-editorial',
    name: 'Personal Portfolio • Olivia Wilson',
    author: 'Olivia Wilson Studio',
    category: 'Design',
    theme: 'Minimaliste',
    description: 'Typographie serif élégante, tons crème et mise en scène éditoriale style magazine de mode et branding.',
    downloads: 2430,
    rating: 5.0,
    previewThumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#f4f1ea',
    tags: ['Serif', 'Editorial', 'Minimal', 'Branding'],
    isPremium: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'minimal-light',
      globalStyle: { primaryColor: '#1c1917', secondaryColor: '#78716c', bgColor: '#f4f1ea', fontHeading: 'Playfair Display', fontBody: 'DM Sans', borderRadius: 'sm', darkMode: false, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Olivia Wilson', title: 'Digital Marketing & Brand Strategist', tagline: 'Personal Portfolio — Strategy, Content & Creative Direction', cta: 'Explorer mes travaux' }, style: { bgColor: '#f4f1ea', textColor: '#1c1917', accentColor: '#1c1917', padding: 'lg', align: 'center', fontFamily: 'Playfair Display' } },
        { id: 'b2', type: 'about', content: { title: 'Vision', text: 'Allier subtilité esthétique et impact commercial pour propulser l\'image des marques les plus exigeantes.' }, style: { bgColor: '#ffffff', textColor: '#292524', accentColor: '#1c1917', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
        { id: 'b3', type: 'projects', content: { title: 'Collections & Campagnes', proj1: 'Vogue Haute Couture', proj1desc: 'Direction éditoriale numérique', proj2: 'Maison Éphémère', proj2desc: 'Stratégie de lancement mondial' }, style: { bgColor: '#f4f1ea', textColor: '#1c1917', accentColor: '#1c1917', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      ],
    },
  },
  {
    id: 'mkt-bold-presentation',
    name: 'Creative Presentation • Big Typography',
    author: 'Studio Schwartz',
    category: 'Créatif',
    theme: 'Bold',
    description: 'Typographie géante, contrastes bruts et composition visuelle ultra tendance pour directeurs artistiques.',
    downloads: 1670,
    rating: 4.8,
    previewThumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#e7e5e4',
    tags: ['Bold', 'Typo XL', 'Fashion', 'Art Direction'],
    isPremium: true,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'vibrant-creative',
      globalStyle: { primaryColor: '#292524', secondaryColor: '#78716c', bgColor: '#e7e5e4', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'none', darkMode: false, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'PORTFOLIO', title: 'Creative Direction & Photography', tagline: 'Presented by Brigitte Schwartz • May 2026', cta: 'Voir les séries' }, style: { bgColor: '#e7e5e4', textColor: '#292524', accentColor: '#292524', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' } },
        { id: 'b2', type: 'gallery', content: { title: 'Visual Explorations', caption1: 'Serie Paris', caption2: 'Architectural Shadows', caption3: 'Nordic Mood' }, style: { bgColor: '#ffffff', textColor: '#1c1917', accentColor: '#292524', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      ],
    },
  },
  {
    id: 'mkt-canva-polaroid-dream',
    name: 'About Me • Y2K Polaroid & Glow',
    author: 'Canva Trends',
    category: 'Créatif',
    theme: 'Coloré',
    description: 'Style rétro-chic, effets holographiques rose pastel, cadres polaroids et typographie manuscrite élégante.',
    downloads: 3120,
    rating: 4.9,
    previewThumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#f472b6',
    tags: ['Y2K', 'Polaroid', 'Aesthetic', 'Social Media'],
    isPremium: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'canva-polaroid',
      globalStyle: { primaryColor: '#db2777', secondaryColor: '#f472b6', bgColor: '#fdf2f8', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'lg', darkMode: false, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'About Me', title: 'Content Creator & Aesthetic Visuals', tagline: 'Donner vie aux idées avec passion, authenticité et fraîcheur.', cta: 'Voir mes créations' }, style: { bgColor: '#fdf2f8', textColor: '#831843', accentColor: '#db2777', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
      ],
    },
  },
  {
    id: 'mkt-visual-portfolio-split',
    name: 'Visuel Portfolio • Monochrome 2026',
    author: 'Bureau Noir',
    category: 'Design',
    theme: 'Dark',
    description: 'Ratio 16:9 cinématographique, fort contraste typographique en noir profond et mise en avant de portfolios visuels.',
    downloads: 2190,
    rating: 4.9,
    previewThumbnail: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#09090b',
    tags: ['Monochrome', 'Brutalism', '3D', 'Graphic'],
    isPremium: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'visual-dark',
      globalStyle: { primaryColor: '#ffffff', secondaryColor: '#71717a', bgColor: '#09090b', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'none', darkMode: true, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'VISUEL PORTFOLIO', title: 'Design & Direction Artistique 2024-2026', tagline: 'Architecture de l\'information, 3D et expériences interactives.', cta: 'Explorer' }, style: { bgColor: '#09090b', textColor: '#ffffff', accentColor: '#ffffff', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' } },
      ],
    },
  },
  {
    id: 'mkt-interior-design',
    name: 'Interior Design Portfolio',
    author: 'Studio M',
    category: 'Design',
    theme: 'Dark',
    description: 'Portfolio de design d\'intérieur et architecture avec photos plein écran et accents dorés élégants.',
    downloads: 1450,
    rating: 4.9,
    previewThumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#1c1917',
    tags: ['Interior', 'Architecture', 'Luxury', 'Minimal'],
    isPremium: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'interior-design',
      globalStyle: { primaryColor: '#eab308', secondaryColor: '#ca8a04', bgColor: '#18181b', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'md', darkMode: true, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Interior Design', title: 'Architecture d\'intérieur & Espaces contemporains', tagline: 'Concevoir des lieux de vie uniques où la matière rencontre la lumière.', cta: 'Voir les projets' }, style: { bgColor: '#18181b', textColor: '#ffffff', accentColor: '#eab308', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' } },
      ],
    },
  },
  {
    id: 'mkt-architect-portfolio',
    name: 'Architect Portfolio • Blueprint Sketches',
    author: 'ArchViz Studio',
    category: 'Architecture',
    theme: 'Minimaliste',
    description: 'Style plans d\'architecte, croquis techniques et typographie bold monochrome.',
    downloads: 1980,
    rating: 4.8,
    previewThumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#fafaf9',
    tags: ['Architecture', 'Blueprint', 'Cad', 'BTP'],
    isPremium: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'architect-blueprint',
      globalStyle: { primaryColor: '#0f172a', secondaryColor: '#64748b', bgColor: '#fafaf9', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'none', darkMode: false, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Architect Portfolio', title: 'Conception d\'espaces durables', tagline: 'Designing functional spaces with timeless architecture.', cta: 'Consulter le portfolio' }, style: { bgColor: '#fafaf9', textColor: '#0f172a', accentColor: '#0f172a', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' } },
      ],
    },
  },
  {
    id: 'mkt-lawyer-pro',
    name: 'Corporate Lawyer & Legal Consulting',
    author: 'Cabinet Justice & Associés',
    category: 'Business',
    theme: 'Bold',
    description: 'Prestige, rigueur et professionnalisme pour juristes, avocats et cabinets de conseil.',
    downloads: 1290,
    rating: 4.9,
    previewThumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#1e293b',
    tags: ['Lawyer', 'Droit', 'Conseil', 'Corporate'],
    isPremium: true,
    isNew: false,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'lawyer-corporate',
      globalStyle: { primaryColor: '#1e3a8a', secondaryColor: '#3b82f6', bgColor: '#f8fafc', fontHeading: 'Manrope', fontBody: 'DM Sans', borderRadius: 'sm', darkMode: false, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Corporate Lawyer', title: 'Avocate au Barreau & Conseil d\'Entreprises', tagline: 'Droit des affaires, fusions-acquisitions et protection des actifs immatériels.', cta: 'Prendre rendez-vous' }, style: { bgColor: '#f8fafc', textColor: '#0f172a', accentColor: '#1e3a8a', padding: 'lg', align: 'left', fontFamily: 'Manrope' } },
      ],
    },
  },
  {
    id: 'mkt-brainstorm-agency',
    name: 'Brainstorm Agency • Creative Doodles',
    author: 'Doodle Co.',
    category: 'Créatif',
    theme: 'Coloré',
    description: 'Style illustrations faites main, croquis d\'idées et ambiance workshop créatif.',
    downloads: 2780,
    rating: 4.9,
    previewThumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'
    ],
    previewColor: '#ffffff',
    tags: ['Brainstorm', 'Sketch', 'Workshop', 'Ideation'],
    isPremium: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'brainstorm-sketch',
      globalStyle: { primaryColor: '#e11d48', secondaryColor: '#f43f5e', bgColor: '#ffffff', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'lg', darkMode: false, presentationWidth: 1280, presentationHeight: 720 },
      blocks: [
        { id: 'b1', type: 'hero', content: { name: 'Brainstorm Ideas', title: 'Atelier de Créativité & Facilitation Graphique', tagline: 'Transformons vos intuitions en concepts innovants et percutants.', cta: 'Découvrir la méthode' }, style: { bgColor: '#ffffff', textColor: '#0f172a', accentColor: '#e11d48', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
      ],
    },
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
      original_template_id: newItem.originalTemplateId,
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

// Remove template from Marketplace (unpublish)
export async function removeFromMarketplace(templateId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('marketplace_templates').delete().or(`id.eq.${templateId},original_template_id.eq.${templateId}`);
  } catch (err) {
    console.warn('Could not delete from Supabase marketplace', err);
  }

  if (typeof window !== 'undefined') {
    const local = getLocalTemplates();
    const filtered = local.filter((t) => t.id !== templateId && t.originalTemplateId !== templateId && t.designData?.templateId !== templateId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  }
  return true;
}
