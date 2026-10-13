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

export interface StudioPortfolio {
  id: string;
  userId?: string;
  name: string;
  persona: string;
  template: StudioTemplateId;
  syncMode: 'live' | 'frozen';
  status: 'active' | 'draft';
  slug: string;
  views: number;
  lastUpdated: string;
  selectedProjects: string[];
  selectedSkills: string[];
  selectedParcours?: string[];
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
    lastUpdated: '13 oct. 2026',
    selectedProjects: ['proj-001', 'proj-002', 'proj-003'],
    selectedSkills: ['sk-001', 'sk-005', 'sk-006', 'sk-009'],
    selectedParcours: ['par-001', 'par-004'],
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
          selectedProjects: Array.isArray(row.selected_projects) ? row.selected_projects : (localMatch?.selectedProjects || []),
          selectedSkills: Array.isArray(row.selected_skills) ? row.selected_skills : (localMatch?.selectedSkills || []),
          selectedParcours: localMatch?.selectedParcours || [],
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
