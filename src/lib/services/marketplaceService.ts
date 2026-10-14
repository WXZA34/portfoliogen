import { createClient } from '@/lib/supabase/client';
import type { Block, PortfolioDesign } from '../../app/portfolio-editor/components/PortfolioEditorContent';

export interface MarketplaceTemplateItem {
  id: string;
  userId?: string;
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

// Helper to identify if a template is a Studio Portfolio (B.U.T. GEII, Bento, Classic, etc.)
export function isStudioPortfolioTemplate(template: {
  id?: string;
  category?: string;
  theme?: string;
  designData?: any;
} | null | undefined): boolean {
  if (!template) return false;
  if (template.category === 'StudioPortfolio') return true;
  if (template.id?.startsWith('studio_')) return true;
  if (['IndustrialGEII', 'BentoMinimal', 'ClassicCream', 'DarkTech', 'EditorialBold'].includes(template.theme || '')) return true;
  if (template.designData?.template && ['IndustrialGEII', 'BentoMinimal', 'ClassicCream', 'DarkTech', 'EditorialBold'].includes(template.designData.template)) return true;
  if (template.designData && !Array.isArray(template.designData.blocks) && (template.designData.themeColors || template.designData.sectionTexts || template.designData.authorName || template.designData.slug)) return true;
  return false;
}

// Default starter templates in Marketplace
export const DEFAULT_MARKETPLACE_TEMPLATES: MarketplaceTemplateItem[] = [
  {
    id: 'studio_pf_geii_starter',
    name: 'B.U.T. GEII & Automatisme (Portfolify)',
    author: 'Kokou Dussey',
    category: 'Tech',
    theme: 'IndustrialGEII',
    description: 'Portfolio académique et industriel pour étudiants en Génie Électrique & Informatique Industrielle (SAÉ, compétences, sas d\'accueil).',
    downloads: 3840,
    rating: 5.0,
    previewThumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    previewSlides: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    ],
    previewColor: '#FAF8F3',
    tags: ['B.U.T.', 'GEII', 'Automatisme', 'IUT', 'Portfolify'],
    isPremium: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    designData: {
      templateId: 'IndustrialGEII',
      blocks: [],
      globalStyle: {
        primaryColor: '#8A7D63',
        secondaryColor: '#C2B59C',
        bgColor: '#FAF8F3',
        fontHeading: 'Plus Jakarta Sans',
        fontBody: 'DM Sans',
        borderRadius: 'md',
        darkMode: false,
      },
      ...({
        id: 'pf-001',
        template: 'IndustrialGEII',
        slug: 'dussey-larry/geii-automatisme',
      } as any),
    },
  },
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

// Extract all high-fidelity slide preview images from a template
export function extractTemplateSlides(template: Partial<MarketplaceTemplateItem>): string[] {
  // If template already has a multi-slide list, use it
  if (template.previewSlides && template.previewSlides.length > 1) {
    return template.previewSlides;
  }

  const extracted: string[] = [];
  const blocks = template.designData?.blocks;
  const globalBg = template.designData?.globalStyle?.bgColor || template.previewColor || '#0f172a';
  const globalAccent = template.previewColor || '#7c3aed';

  if (Array.isArray(blocks) && blocks.length > 0) {
    blocks.forEach((block: any, idx: number) => {
      let slideImg: string | null = null;

      // 1. Full-bleed page background image (pure PDF page export where element is full width)
      if (block.layout?.elements && Array.isArray(block.layout.elements)) {
        const fullBgImg = block.layout.elements.find(
          (e: any) => e.type === 'image' && e.url && e.id?.toString().startsWith('bg-') && Number(e.width) >= 700
        );
        if (fullBgImg?.url && block.layout.elements.length === 1) {
          slideImg = fullBgImg.url;
        } else {
          // It is a composite slide with layout elements (text, photos, shapes, backgrounds)
          const textEl = block.layout.elements.find((e: any) => e.type === 'text' && e.content);
          const imgEl = block.layout.elements.find((e: any) => e.type === 'image' && e.url);
          const title = (textEl?.content || block.content?.title || block.content?.name || `Diapositive ${idx + 1}`) as string;
          const subtitle = (block.content?.tagline || block.content?.subtitle || `Section ${block.type || idx + 1}`) as string;
          const blockBg = block.style?.bgColor || globalBg;
          const blockAccent = block.style?.accentColor || globalAccent;
          slideImg = createSlideSvg(title, subtitle, blockBg, blockAccent, idx + 1);
        }
      }

      // 2. Block style background image
      if (!slideImg && block.style?.backgroundImage) {
        const bgMatch = block.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        const url = bgMatch ? bgMatch[1] : block.style.backgroundImage;
        if (url && (url.startsWith('http') || url.startsWith('data:'))) {
          slideImg = url;
        }
      }

      // 3. Procedural Canva-style SVG slide if no image exists for this block
      if (!slideImg) {
        const title = (block.content?.title || block.content?.name || `Diapositive ${idx + 1}`) as string;
        const subtitle = (block.content?.tagline || block.content?.subtitle || block.content?.description || `Section ${block.type}`) as string;
        const blockBg = block.style?.bgColor || globalBg;
        const blockAccent = block.style?.accentColor || globalAccent;
        slideImg = createSlideSvg(title, subtitle, blockBg, blockAccent, idx + 1);
      }

      if (slideImg) {
        extracted.push(slideImg);
      }
    });
  }

  if (extracted.length > 0) {
    return extracted;
  }

  if (template.previewSlides && template.previewSlides.length > 0) {
    return template.previewSlides;
  }

  if (template.previewThumbnail) {
    return [template.previewThumbnail];
  }

  // Fallback for studio or custom templates: generate a clean procedural slide
  const title = template.name || 'Portfolio';
  const subtitle = template.description || 'Portfolio Professionnel • PortfolioGen';
  return [createSlideSvg(title, subtitle, globalBg, globalAccent, 1)];
}

function createSlideSvg(title: string, subtitle: string, bgColor: string, accentColor: string, slideNum: number): string {
  const safeTitle = (title || `Slide ${slideNum}`).replace(/[<>&"]/g, '').slice(0, 45);
  const safeSub = (subtitle || '').replace(/[<>&"]/g, '').slice(0, 60);
  const bg = bgColor && bgColor !== 'transparent' ? bgColor : '#0f172a';
  const accent = accentColor || '#7c3aed';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="grad-${slideNum}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="${bg}"/>
    <circle cx="1040" cy="240" r="320" fill="url(#grad-${slideNum})"/>
    <rect x="780" y="140" width="420" height="440" rx="24" fill="${accent}" fill-opacity="0.08" stroke="${accent}" stroke-opacity="0.2" stroke-width="2"/>
    <rect x="50" y="50" width="1180" height="620" rx="20" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
    <rect x="80" y="80" width="110" height="34" rx="17" fill="${accent}" fill-opacity="0.3"/>
    <text x="135" y="102" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">SLIDE ${slideNum}</text>
    <text x="80" y="320" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="800" fill="#ffffff" letter-spacing="-0.02em">${safeTitle}</text>
    <text x="80" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="rgba(255,255,255,0.7)">${safeSub}</text>
    <line x1="80" y1="430" x2="260" y2="430" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Fetch templates combining Supabase + localStorage + Defaults
export async function getMarketplaceTemplates(): Promise<MarketplaceTemplateItem[]> {
  let supabaseTemplates: MarketplaceTemplateItem[] = [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('marketplace_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase marketplace error:', error);
    } else if (Array.isArray(data)) {
      // Map Supabase rows to our interface
      supabaseTemplates = data.map((row: any) => {
        const item: MarketplaceTemplateItem = {
          id: row.id,
          userId: row.user_id,
          originalTemplateId: row.original_template_id,
          name: row.name,
          author: row.author || 'Communauté',
          category: row.category || 'Tech',
          theme: row.theme || 'Minimaliste',
          description: row.description || '',
          downloads: row.downloads || 0,
          rating: row.rating || 5.0,
          previewThumbnail: row.preview_thumbnail,
          previewSlides: Array.isArray(row.preview_slides) && row.preview_slides.length > 0 ? row.preview_slides : undefined,
          previewColor: row.preview_color || '#7c3aed',
          tags: Array.isArray(row.tags) ? row.tags : [],
          isPremium: !!row.is_premium,
          isNew: !!row.is_new,
          createdAt: row.created_at,
          designData: row.design_data || {},
        };

        // Ensure rich multi-slides
        if (!item.previewSlides || item.previewSlides.length <= 1) {
          const slides = extractTemplateSlides(item);
          if (slides.length > 0) {
            item.previewSlides = slides;
            item.previewThumbnail = slides[0];
          }
        }
        return item;
      });
    }
  } catch (err) {
    console.warn('Supabase marketplace error or table missing, using localStorage fallback', err);
  }

  // Also include localStorage templates so local changes are never lost on refresh
  const local = getLocalTemplates();

  // Combine: Supabase user templates first (highest priority), then local templates, then default starter catalog
  const combined = [...supabaseTemplates, ...local, ...DEFAULT_MARKETPLACE_TEMPLATES];

  // Strictly deduplicate by normalized name AND ID so no two cards have the same name:
  // If multiple items share the exact same name, the first one encountered (Supabase > local > default) wins.
  const seenNames = new Set<string>();
  const seenIds = new Set<string>();
  const unique: MarketplaceTemplateItem[] = [];

  for (const item of combined) {
    const normName = (item.name || '').trim().toLowerCase();
    if (!seenIds.has(item.id) && !seenNames.has(normName)) {
      seenIds.add(item.id);
      if (normName) seenNames.add(normName);
      unique.push(item);
    }
  }

  return unique;
}

// Get user published templates from localStorage
function getLocalTemplates(): MarketplaceTemplateItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed: MarketplaceTemplateItem[] = saved ? JSON.parse(saved) : [];
    // Enrich local templates with extracted slides if needed
    return parsed.map((tpl) => {
      if (!tpl.previewSlides || tpl.previewSlides.length <= 1) {
        const slides = extractTemplateSlides(tpl);
        if (slides.length > 0) {
          tpl.previewSlides = slides;
          tpl.previewThumbnail = slides[0];
        }
      }
      return tpl;
    });
  } catch {
    return [];
  }
}

// Publish a template to Marketplace
export async function publishToMarketplace(template: Omit<MarketplaceTemplateItem, 'id' | 'createdAt' | 'downloads' | 'rating'>): Promise<MarketplaceTemplateItem> {
  const newId = `mkt-${Date.now()}`;
  const trimmedName = (template.name || 'Mon Modèle').trim();
  
  // Extract all slides if not explicitly passed
  const slides = (template.previewSlides && template.previewSlides.length > 0)
    ? template.previewSlides
    : extractTemplateSlides({ ...template, name: trimmedName, id: newId, downloads: 1, rating: 5.0, createdAt: '' });

  const thumbnail = template.previewThumbnail || (slides.length > 0 ? slides[0] : undefined);

  const newItem: MarketplaceTemplateItem = {
    ...template,
    name: trimmedName,
    id: newId,
    previewThumbnail: thumbnail,
    previewSlides: slides,
    downloads: 1,
    rating: 5.0,
    isNew: true,
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Check if a template with this name OR this originalTemplateId already exists
    let existingMatch: any = null;

    // Check by originalTemplateId first if present
    if (newItem.originalTemplateId) {
      const { data: byOrig } = await supabase
        .from('marketplace_templates')
        .select('*')
        .eq('original_template_id', newItem.originalTemplateId)
        .limit(1);
      if (byOrig && byOrig.length > 0) {
        existingMatch = byOrig[0];
      }
    }

    // If not found by originalTemplateId, check by exact name (case-insensitive)
    if (!existingMatch && trimmedName) {
      const { data: byName } = await supabase
        .from('marketplace_templates')
        .select('*')
        .ilike('name', trimmedName)
        .limit(1);
      if (byName && byName.length > 0) {
        existingMatch = byName[0];
      }
    }

    if (existingMatch) {
      // UPDATE THE EXISTING MARKETPLACE TEMPLATE (No duplicate created!)
      const existingId = existingMatch.id;
      const { error: updateError } = await supabase
        .from('marketplace_templates')
        .update({
          name: trimmedName,
          author: newItem.author,
          category: newItem.category,
          theme: newItem.theme,
          description: newItem.description,
          preview_thumbnail: newItem.previewThumbnail,
          preview_slides: newItem.previewSlides,
          preview_color: newItem.previewColor,
          tags: newItem.tags,
          is_premium: newItem.isPremium,
          design_data: newItem.designData,
          original_template_id: newItem.originalTemplateId || existingMatch.original_template_id,
          user_id: user?.id || existingMatch.user_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingId);

      if (updateError) {
        console.error('Update error in marketplace_templates:', updateError);
        throw new Error("Erreur de mise à jour sur la Marketplace : " + updateError.message);
      }

      newItem.id = existingId;
    } else {
      // 2. Otherwise insert a brand new template entry
      const { error: insertError } = await supabase.from('marketplace_templates').insert({
        id: newItem.id,
        name: trimmedName,
        author: newItem.author,
        category: newItem.category,
        theme: newItem.theme,
        description: newItem.description,
        downloads: newItem.downloads,
        rating: newItem.rating,
        original_template_id: newItem.originalTemplateId,
        preview_thumbnail: newItem.previewThumbnail,
        preview_slides: newItem.previewSlides,
        preview_color: newItem.previewColor,
        tags: newItem.tags,
        is_premium: newItem.isPremium,
        is_new: newItem.isNew,
        design_data: newItem.designData,
        ...(user?.id ? { user_id: user.id } : {}),
      });

      if (insertError) {
        console.error('Insert error in marketplace_templates:', insertError);
        throw new Error("Erreur de publication sur la Marketplace : " + insertError.message);
      }
    }
  } catch (err: any) {
    console.error('Could not save to Supabase marketplace_templates', err);
    throw err;
  }

  // Backup to localStorage
  if (typeof window !== 'undefined') {
    const local = getLocalTemplates();
    const updated = [newItem, ...local.filter(t => t.id !== newItem.id && t.name.toLowerCase().trim() !== trimmedName.toLowerCase() && t.originalTemplateId !== newItem.originalTemplateId)];
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
export async function removeFromMarketplace(templateIdOrOriginalId: string): Promise<boolean> {
  if (!templateIdOrOriginalId) return false;
  try {
    const supabase = createClient();
    // Only delete by exact ID or exact original_template_id — NEVER BY NAME!
    await supabase
      .from('marketplace_templates')
      .delete()
      .or(`id.eq.${templateIdOrOriginalId},original_template_id.eq.${templateIdOrOriginalId}`);
  } catch (err) {
    console.warn('Could not delete from Supabase marketplace', err);
  }

  if (typeof window !== 'undefined') {
    const local = getLocalTemplates();
    const filtered = local.filter((t) => 
      t.id !== templateIdOrOriginalId && 
      t.originalTemplateId !== templateIdOrOriginalId &&
      t.designData?.templateId !== templateIdOrOriginalId
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  }
  return true;
}
