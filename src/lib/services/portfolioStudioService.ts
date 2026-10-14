import { createClient } from '@/lib/supabase/client';
import {
  ProjectItem,
  SkillItem,
  ParcoursItem,
  fetchUserProjects,
  fetchUserSkills,
  fetchUserParcours,
} from './cvthequeService';

export type StudioTemplateId =
  | 'IndustrialGEII'
  | 'ClassicCream'
  | 'BentoMinimal'
  | 'DarkTech'
  | 'EditorialBold';

export interface StudioPortfolioSections {
  cover: boolean;       // 0. Page de garde (Sas d'accueil)
  hero: boolean;        // 1. Section Accueil (Hero & Slogan)
  about: boolean;       // 2. Profil & Objectifs (À propos)
  projects: boolean;    // 3. Mes Réalisations & SAÉ (IUT / Académiques)
  personalProjects: boolean; // 3b. Projets Personnels (Savoir-Faire)
  creativeStudio: boolean;   // 3c. Studio Créatif (Savoir-Être)
  skills: boolean;      // 4. Compétences Techniques (Jauges %)
  tools: boolean;       // 5. Outils & Matériel Industriel
  parcours: boolean;    // 6. Parcours & Formations (Timeline)
  languages: boolean;   // 7. Langues & Certifications
  gallery: boolean;     // 8. Galerie Médias
  contact: boolean;     // 9. Coordonnées & Contact
}

export const DEFAULT_STUDIO_SECTIONS: StudioPortfolioSections = {
  cover: true,
  hero: true,
  about: true,
  projects: true,
  personalProjects: true,
  creativeStudio: true,
  skills: true,
  tools: true,
  parcours: true,
  languages: true,
  gallery: true,
  contact: true,
};

export interface SectionColors {
  backgroundColor?: string;       // Page background (default: #FAF8F3)
  cardBackground?: string;        // Card surface background (default: #EFEAE1)
  hero?: string;                  // Accent color for hero & splash (default: #8A7D63)
  about?: string;                 // Accent color for about (default: #8A7D63)
  projects?: string;              // Accent color for SAÉ (default: #1A1815)
  personalProjects?: string;      // Accent color for Projets Perso (default: #059669 - emerald)
  creativeStudio?: string;        // Accent color for Studio Créatif (default: #9333EA - purple)
  skills?: string;                // Accent color for Compétences (default: #D97706 - amber)
  tools?: string;                 // Accent color for Outils (default: #475569 - slate)
  parcours?: string;              // Accent color for Parcours (default: #2563EB - blue)
  languages?: string;             // Accent color for Langues (default: #A4967A)
  gallery?: string;               // Accent color for Galerie (default: #8A7D63)
  contact?: string;               // Accent color for Contact (default: #8A7D63)
}

export interface SectionTexts {
  // Page de Garde / Sas d'Accueil
  coverDepartment?: string;
  coverMainTitle?: string;
  coverDegree?: string;
  coverSubtitle?: string;
  coverRealiseParLabel?: string;
  coverAuthorName?: string;
  coverHeadline?: string;
  coverInstitution?: string;
  coverPromotion?: string;
  coverSpeciality?: string;
  coverButton?: string;

  // Hero & Accueil
  heroGreeting?: string;
  heroHeadline?: string;
  heroSlogan?: string;
  heroAvailability?: string;
  heroDownloadCv?: string;

  // À propos & Profil
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutBioTitle?: string;
  aboutBio?: string;
  aboutObjectiveTitle?: string;
  aboutObjective?: string;

  // SAÉ (Réalisations académiques)
  projectsTitle?: string;
  projectsSubtitle?: string;

  // Projets Personnels (Savoir-Faire)
  personalProjectsTitle?: string;
  personalProjectsSubtitle?: string;

  // Studio Créatif (Savoir-Être)
  creativeStudioTitle?: string;
  creativeStudioSubtitle?: string;
  creativeStudioQuote?: string;

  // Compétences & Outils
  skillsTitle?: string;
  skillsSubtitle?: string;
  skillsHardTitle?: string;
  toolsTitle?: string;
  toolsSubtitle?: string;
  toolsSoftTitle?: string;

  // Parcours & Formations
  parcoursTitle?: string;
  parcoursSubtitle?: string;

  // Langues & Certifications
  languagesTitle?: string;
  languagesSubtitle?: string;
  languagesBlockTitle?: string;
  certificationsBlockTitle?: string;

  // Galerie Médias
  galleryTitle?: string;
  gallerySubtitle?: string;

  // Contact & Coordonnées
  contactTitle?: string;
  contactSubtitle?: string;
  contactHeading?: string;
  contactDescription?: string;

  // Cartes & Footer
  learnMoreText?: string;
  footerText?: string;

  [key: string]: string | undefined;
}

export interface StudioPortfolio {
  id: string;
  userId?: string;
  name: string;
  persona: string;
  template: StudioTemplateId;
  syncMode: 'live' | 'frozen';
  status: 'active' | 'draft';
  slug: string;
  customDomain?: string;
  customShareUrl?: string;
  recipientName?: string;
  recipientCompany?: string;
  views: number;
  lastUpdated: string;
  enabledSections?: StudioPortfolioSections;
  sectionTitles?: Record<string, string>;
  themeColors?: SectionColors;
  sectionTexts?: SectionTexts;
  selectedProjects: string[];
  selectedPersonalProjects?: string[];
  selectedCreativeStudio?: string[];
  selectedSkills: string[];
  selectedParcours?: string[];
  selectedLanguages?: string[];
  selectedCertifications?: string[];
  selectedMedia?: string[];
  customIntro?: string;
  // Metadata for Splash Screen (especially for IndustrialGEII template)
  institution?: string;
  degree?: string;
  subTitle?: string;
  promotion?: string;
  authorName?: string;
  createdAt?: string;
}

const LOCAL_STORAGE_STUDIO_PREFIX = 'portfoliogen_studio_portfolios_';

export const DEFAULT_STARTER_PORTFOLIOS: StudioPortfolio[] = [
  {
    id: 'pf-001',
    name: 'B.U.T. GEII & Automatisme',
    persona: 'Recruteur Industriel & AII',
    template: 'IndustrialGEII',
    syncMode: 'live',
    status: 'active',
    slug: 'dussey-larry/geii-automatisme',
    views: 487,
    lastUpdated: '14 oct. 2026',
    enabledSections: { ...DEFAULT_STUDIO_SECTIONS },
    themeColors: {
      backgroundColor: '#FAF8F3',
      cardBackground: '#EFEAE1',
      hero: '#8A7D63',
      about: '#8A7D63',
      projects: '#1A1815',
      personalProjects: '#059669',
      creativeStudio: '#9333EA',
      skills: '#D97706',
      tools: '#475569',
      parcours: '#2563EB',
      languages: '#A4967A',
      gallery: '#8A7D63',
      contact: '#8A7D63',
    },
    sectionTexts: {
      coverDepartment: "DÉPARTEMENT GÉNIE ÉLECTRIQUE ET INFORMATIQUE INDUSTRIELLE",
      coverMainTitle: "B.U.T.",
      coverDegree: "BACHELOR UNIVERSITAIRE DE TECHNOLOGIE",
      coverSubtitle: "Portfolio Semestre 2",
      coverRealiseParLabel: "RÉALISÉ PAR",
      coverAuthorName: "KOKOU DUSSEY",
      coverHeadline: "Étudiant en B.U.T. GEII & Automatisme",
      coverInstitution: "IUT SÉNART-FONTAINEBLEAU",
      coverPromotion: "PROMOTION 2025–2026",
      coverSpeciality: "Spécialité Automatisme et Informatique Industrielle (AII)",
      coverButton: "Accéder au portfolio",
      heroHeadline: "Étudiant en B.U.T. GEII & Automatisme",
      heroSlogan: "Concevoir la logique. Piloter le système.",
      heroAvailability: "Recherche alternance 2026-2028",
      heroDownloadCv: "Télécharger CV",
      aboutTitle: "À propos & Projet Professionnel",
      aboutSubtitle: "Présentation, démarche d'ingénierie et recherche d'alternance",
      aboutBioTitle: "Présentation personnelle",
      aboutBio: "Actuellement en formation B.U.T. GEII à l'IUT Sénart-Fontainebleau, je développe une solide expertise en automatisme industriel, programmation et conception électronique.",
      aboutObjectiveTitle: "Objectif professionnel ciblé",
      aboutObjective: "Recherche d'une alternance de 2 ans dès la rentrée 2026 dans les secteurs de l'automatisme, de la robotique industrielle ou des systèmes embarqués.",
      projectsTitle: "Situations d'Apprentissage et d'Évaluation (SAÉ)",
      projectsSubtitle: "Activités pratiques d'ingénierie, simulation et pilotage de systèmes automatisés",
      personalProjectsTitle: "Projets Personnels (Savoir-Faire)",
      personalProjectsSubtitle: "Développements autonomes, applications web/mobiles et intégration de technologies émergentes",
      creativeStudioTitle: "Studio Créatif (Savoir-Être)",
      creativeStudioSubtitle: "La technique c'est bien, savoir la communiquer en équipe c'est mieux. Voici quelques réalisations audiovisuelles produites en groupe lors de nos modules de communication.",
      creativeStudioQuote: "« La technique c'est bien, savoir la communiquer en équipe c'est mieux. Voici quelques réalisations audiovisuelles produites en groupe lors de nos modules de communication. »",
      skillsTitle: "Compétences Techniques",
      skillsSubtitle: "Groupes d'expertise, programmation d'automates et jauges de maîtrise",
      skillsHardTitle: "Compétences Techniques",
      toolsTitle: "Outils & Matériel Industriel",
      toolsSubtitle: "Logiciels CAO, automates programmables et bancs d'essais",
      toolsSoftTitle: "Savoir-Être",
      parcoursTitle: "Parcours & Formations",
      parcoursSubtitle: "Timeline chronologique des diplômes, études et stages",
      languagesTitle: "Langues & Habilitations",
      languagesSubtitle: "Certifications de sécurité électrique et compétences linguistiques",
      languagesBlockTitle: "Langues",
      certificationsBlockTitle: "Habilitations & Certifications",
      galleryTitle: "Galerie de Réalisations",
      gallerySubtitle: "Photographies d'ateliers, montages et bancs de test",
      contactTitle: "Coordonnées Professionnelles",
      contactSubtitle: "Me contacter pour un stage ou une alternance",
      contactHeading: "Me contacter pour un stage ou une alternance",
      contactDescription: "Disponible pour échanger sur vos projets industriels et besoins techniques.",
      learnMoreText: "En savoir plus →",
      footerText: "Portfolio ciblé généré via PortfolioGen Studio & synchronisé avec la CVthèque Master",
    },
    selectedProjects: ['proj-sae-001', 'proj-sae-002', 'proj-001'],
    selectedPersonalProjects: ['perso-001', 'perso-002', 'perso-003'],
    selectedCreativeStudio: ['creat-001', 'creat-002', 'creat-003'],
    selectedSkills: ['sk-001', 'sk-005', 'sk-006', 'sk-009'],
    selectedParcours: ['par-001', 'par-004'],
    selectedLanguages: ['lang-001', 'lang-002'],
    selectedCertifications: ['cert-001', 'cert-002'],
    customIntro: 'Concevoir la logique. Piloter le système.',
    institution: 'IUT SÉNART-FONTAINEBLEAU',
    degree: 'BACHELOR UNIVERSITAIRE DE TECHNOLOGIE',
    subTitle: 'Portfolio Semestre 2',
    promotion: 'PROMOTION 2025–2026',
    authorName: 'KOKOU DUSSEY',
  },
  {
    id: 'pf-002',
    name: 'Full-Stack Dev & Cloud',
    persona: 'Tech Recruiter Senior',
    template: 'BentoMinimal',
    syncMode: 'live',
    status: 'active',
    slug: 'alex-martin/fullstack-dev',
    views: 312,
    lastUpdated: '12 oct. 2026',
    selectedProjects: ['proj-001', 'proj-003', 'proj-005'],
    selectedSkills: ['sk-001', 'sk-002', 'sk-003', 'sk-006'],
    customIntro: 'Architecte d\'applications web résilientes et modernes.',
    authorName: 'Alexandre Martin',
  },
  {
    id: 'pf-003',
    name: 'Ingénieur IA & Systèmes',
    persona: 'Fondateur Startup IA',
    template: 'ClassicCream',
    syncMode: 'live',
    status: 'active',
    slug: 'alex-martin/ai-engineer',
    views: 245,
    lastUpdated: '09 oct. 2026',
    selectedProjects: ['proj-001', 'proj-004'],
    selectedSkills: ['sk-004', 'sk-008', 'sk-007'],
    customIntro: 'Modélisation, pipeline de données et agents intelligents.',
    authorName: 'Alexandre Martin',
  },
];

function getLocalStudioPortfolios(userId: string = 'guest'): StudioPortfolio[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_STUDIO_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalStudioPortfolios(items: StudioPortfolio[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_STUDIO_PREFIX}${userId}`, JSON.stringify(items));
  } catch {}
}

export async function fetchStudioPortfolios(): Promise<StudioPortfolio[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';
    const local = getLocalStudioPortfolios(userId);

    if (!user) {
      return local.length > 0 ? local : DEFAULT_STARTER_PORTFOLIOS;
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase studio portfolios query error:', error);
      return local.length > 0 ? local : DEFAULT_STARTER_PORTFOLIOS;
    }

    if (Array.isArray(data) && data.length > 0) {
      const mapped: StudioPortfolio[] = data.map((row: any) => {
        const localMatch = local.find((p) => p.id === row.id);
        return {
          id: row.id,
          userId: row.user_id,
          name: row.name,
          persona: row.persona || 'Recruteur Tech',
          template: (localMatch?.template || (row.template as any) || 'IndustrialGEII') as StudioTemplateId,
          syncMode: row.sync_mode || 'live',
          status: row.status || 'active',
          slug: row.slug || `portfolio-${row.id.slice(0, 6)}`,
          views: row.views_count ?? 0,
          lastUpdated: row.updated_at ? new Date(row.updated_at).toLocaleDateString('fr-FR') : 'Récemment',
          selectedProjects: Array.isArray(row.selected_projects) ? row.selected_projects : (localMatch?.selectedProjects || ['proj-sae-001', 'proj-sae-002', 'proj-001']),
          selectedPersonalProjects: localMatch?.selectedPersonalProjects || ['perso-001', 'perso-002', 'perso-003'],
          selectedCreativeStudio: localMatch?.selectedCreativeStudio || ['creat-001', 'creat-002', 'creat-003'],
          selectedSkills: Array.isArray(row.selected_skills) ? row.selected_skills : (localMatch?.selectedSkills || []),
          selectedParcours: localMatch?.selectedParcours || [],
          selectedLanguages: localMatch?.selectedLanguages || ['lang-001', 'lang-002'],
          selectedCertifications: localMatch?.selectedCertifications || ['cert-001', 'cert-002'],
          selectedMedia: localMatch?.selectedMedia || [],
          enabledSections: { ...DEFAULT_STUDIO_SECTIONS, ...(localMatch?.enabledSections || {}) },
          sectionTitles: localMatch?.sectionTitles || {},
          themeColors: localMatch?.themeColors || { ...DEFAULT_STARTER_PORTFOLIOS[0].themeColors },
          sectionTexts: localMatch?.sectionTexts || { ...DEFAULT_STARTER_PORTFOLIOS[0].sectionTexts },
          customIntro: row.custom_intro || localMatch?.customIntro || 'Concevoir la logique. Piloter le système.',
          institution: localMatch?.institution || 'IUT SÉNART-FONTAINEBLEAU',
          degree: localMatch?.degree || 'BACHELOR UNIVERSITAIRE DE TECHNOLOGIE',
          subTitle: localMatch?.subTitle || 'Portfolio Semestre 2',
          promotion: localMatch?.promotion || 'PROMOTION 2025–2026',
          authorName: localMatch?.authorName || user.user_metadata?.full_name || 'KOKOU DUSSEY',
          createdAt: row.created_at,
        };
      });

      setLocalStudioPortfolios(mapped, user.id);
      return mapped;
    }

    if (local.length > 0) {
      return local;
    }

    return DEFAULT_STARTER_PORTFOLIOS;
  } catch (err) {
    console.warn('Error fetching studio portfolios:', err);
    return DEFAULT_STARTER_PORTFOLIOS;
  }
}

export async function saveStudioPortfolio(
  portfolio: StudioPortfolio
): Promise<StudioPortfolio> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const item: StudioPortfolio = {
    ...portfolio,
    userId: user?.id,
    lastUpdated: 'À l\'instant',
  };

  if (user?.id) {
    try {
      const isUUID = !!item.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);

      // In Supabase portfolios table, template enum supports 'ClassicCream' | 'BentoMinimal'.
      // If IndustrialGEII or other, map to ClassicCream for DB column constraint, while saving full template in local/metadata
      const dbTemplate = item.template === 'BentoMinimal' ? 'BentoMinimal' : 'ClassicCream';

      const dbPayload = {
        ...(isUUID ? { id: item.id } : {}),
        user_id: user.id,
        name: item.name.trim(),
        persona: item.persona,
        template: dbTemplate,
        sync_mode: item.syncMode,
        status: item.status,
        slug: item.slug.trim(),
        custom_intro: item.customIntro || '',
        updated_at: new Date().toISOString(),
      };

      if (isUUID) {
        await supabase.from('portfolios').update(dbPayload).eq('id', item.id);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('portfolios')
          .insert(dbPayload)
          .select()
          .single();

        if (!insertErr && inserted) {
          item.id = inserted.id;
        }
      }
    } catch (err) {
      console.warn('Supabase portfolio save error, stored in local cache', err);
    }
  }

  const local = getLocalStudioPortfolios(userId);
  const filtered = local.filter((p) => p.id !== item.id && p.id !== portfolio.id);
  const updated = [item, ...filtered];
  setLocalStudioPortfolios(updated, userId);

  if (typeof window !== 'undefined') {
    localStorage.setItem('portfoliogen_current_active_portfolio', JSON.stringify(item));
    localStorage.setItem('portfoliogen_current_active_portfolio_id', item.id);
    if (item.slug) {
      localStorage.setItem(`portfoliogen_portfolio_${item.slug.toLowerCase().trim()}`, JSON.stringify(item));
    }
    localStorage.setItem(`portfoliogen_portfolio_${item.id.toLowerCase().trim()}`, JSON.stringify(item));
  }

  return item;
}

export async function deleteStudioPortfolio(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const isUUID = !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (user?.id && isUUID) {
    try {
      await supabase.from('portfolios').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase studio portfolio delete error', err);
    }
  }

  const local = getLocalStudioPortfolios(userId);
  const filtered = local.filter((p) => p.id !== id);
  setLocalStudioPortfolios(filtered, userId);

  return true;
}

export async function fetchPublicStudioPortfolio(
  slugOrId: string
): Promise<StudioPortfolio | null> {
  const raw = slugOrId ? decodeURIComponent(slugOrId).trim() : '';
  const normalized = raw.replace(/^\/+|\/+$/g, '').toLowerCase();

  // 1. Try to search in localStorage first (if same browser or user session)
  if (typeof window !== 'undefined') {
    try {
      // If no slug provided or asking for active, return the currently active portfolio
      if (!normalized || normalized === 'active' || normalized === 'current') {
        const activeRaw = localStorage.getItem('portfoliogen_current_active_portfolio');
        if (activeRaw) {
          const parsed = JSON.parse(activeRaw);
          if (parsed) return parsed;
        }
      }

      // Check direct exact lookup keys in localStorage
      if (normalized) {
        const directSlug = localStorage.getItem(`portfoliogen_portfolio_${normalized}`);
        if (directSlug) {
          const parsed: StudioPortfolio = JSON.parse(directSlug);
          if (parsed) return parsed;
        }
      }

      // Search all studio portfolio lists in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_STORAGE_STUDIO_PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            const list: StudioPortfolio[] = JSON.parse(item);
            const found = list.find(
              (p) =>
                p.id.toLowerCase() === normalized ||
                p.slug.toLowerCase() === normalized ||
                p.slug.toLowerCase().replace(/^\/+|\/+$/g, '') === normalized ||
                normalized.endsWith(p.slug.toLowerCase()) ||
                p.slug.toLowerCase().endsWith(normalized)
            );
            if (found) return found;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage studio portfolio lookup error:', e);
    }
  }

  // 2. Try fetching from Supabase with anon key (public access)
  try {
    const supabase = createClient();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalized);

    let query = supabase.from('portfolios').select('*');
    if (isUUID) {
      query = query.eq('id', normalized);
    } else {
      query = query.or(`slug.eq.${normalized},slug.ilike.%${normalized}%,name.ilike.%${normalized}%`);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        persona: data.persona || 'Recruteur Industriel & AII',
        template: (data.template as any) || 'IndustrialGEII',
        syncMode: data.sync_mode || 'live',
        status: data.status || 'active',
        slug: data.slug || normalized,
        views: (data.views_count ?? 0) + 1,
        lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString('fr-FR') : 'Récemment',
        selectedProjects: Array.isArray(data.selected_projects) ? data.selected_projects : ['proj-sae-001', 'proj-sae-002', 'proj-001'],
        selectedPersonalProjects: ['perso-001', 'perso-002', 'perso-003'],
        selectedCreativeStudio: ['creat-001', 'creat-002', 'creat-003'],
        selectedSkills: Array.isArray(data.selected_skills) ? data.selected_skills : ['sk-001', 'sk-005', 'sk-006', 'sk-009'],
        enabledSections: { ...DEFAULT_STUDIO_SECTIONS },
        themeColors: { ...DEFAULT_STARTER_PORTFOLIOS[0].themeColors },
        sectionTexts: { ...DEFAULT_STARTER_PORTFOLIOS[0].sectionTexts },
        customIntro: data.custom_intro || 'Concevoir la logique. Piloter le système.',
        createdAt: data.created_at,
      };
    }
  } catch (err) {
    console.warn('Supabase public portfolio lookup error:', err);
  }

  // 3. Exact match against DEFAULT_STARTER_PORTFOLIOS
  const starter = DEFAULT_STARTER_PORTFOLIOS.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.slug.toLowerCase() === normalized ||
      p.slug.toLowerCase().replace(/^\/+|\/+$/g, '') === normalized
  );

  if (starter) {
    return starter;
  }

  // 4. If current active portfolio is in localStorage, use it!
  if (typeof window !== 'undefined') {
    try {
      const activeRaw = localStorage.getItem('portfoliogen_current_active_portfolio');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (parsed) return parsed;
      }
    } catch {}
  }

  // 5. Default: return the full IndustrialGEII starter portfolio
  return DEFAULT_STARTER_PORTFOLIOS[0];
}
