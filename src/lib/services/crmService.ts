'use client';

import { createClient } from '@/lib/supabase/client';
import { StudioPortfolio } from './portfolioStudioService';

export type AppStatus = 'candidaté' | 'entretien' | 'offre' | 'refus' | 'relance';

export interface CRMApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: AppStatus;
  date: string; // YYYY-MM-DD
  portfolioId?: string;
  portfolioName?: string;
  portfolioSlug?: string;
  customUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  contractType?: string;
  salary?: string;
  notes: string;
  nextAction?: string;
  nextActionDate?: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRMApplicationInput {
  id?: string;
  company: string;
  role: string;
  status?: AppStatus;
  date?: string;
  portfolioId?: string;
  portfolioName?: string;
  portfolioSlug?: string;
  customUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  contractType?: string;
  salary?: string;
  notes?: string;
  nextAction?: string;
  nextActionDate?: string;
  logo?: string;
}

const LOCAL_STORAGE_KEY_PREFIX = 'portfoliogen_crm_apps_';

export function getCompanyEmoji(name: string): string {
  const n = (name || '').toLowerCase();
  if (n.includes('schneider') || n.includes('electric') || n.includes('edf') || n.includes('engie')) return '⚡';
  if (n.includes('alstom') || n.includes('sncf') || n.includes('train')) return '🚆';
  if (n.includes('airbus') || n.includes('safran') || n.includes('dassault') || n.includes('aero')) return '✈️';
  if (n.includes('thales') || n.includes('defense') || n.includes('radar')) return '📡';
  if (n.includes('total') || n.includes('petrol') || n.includes('energie')) return '⛽';
  if (n.includes('google') || n.includes('meta') || n.includes('apple') || n.includes('microsoft')) return '🌐';
  if (n.includes('renault') || n.includes('stellantis') || n.includes('auto')) return '🚗';
  if (n.includes('capgemini') || n.includes('sopra') || n.includes('atos') || n.includes('accenture')) return '💻';
  if (n.includes('startup') || n.includes('ia') || n.includes('tech')) return '🚀';
  if (n.includes('hopital') || n.includes('sante') || n.includes('sanofi')) return '🏥';
  if (n.includes('banque') || n.includes('bnp') || n.includes('societe')) return '🏦';
  return '🏢';
}

const INITIAL_DEFAULT_APPLICATIONS: CRMApplication[] = [
  {
    id: 'demo-1',
    userId: 'demo',
    company: 'Schneider Electric',
    role: 'Alternance Ingénieur GEII / Automatisme',
    status: 'entretien',
    date: '2026-10-10',
    portfolioId: 'geii-master',
    portfolioName: 'Portfolio Industriel & Électronique',
    portfolioSlug: 'portfoliolarry',
    customUrl: 'https://portfoliogen.net/p/portfoliolarry?for=SchneiderElectric',
    contactName: 'Marc Vasseur (Responsable Automatismes)',
    contactEmail: 'm.vasseur@se.com',
    contactPhone: '+33 1 41 29 85 00',
    location: 'Rueil-Malmaison (92)',
    contractType: 'Alternance (2 ans)',
    salary: '1 650 € / mois',
    notes: 'Dossier transmis avec le portfolio personnalisé. Premier échange téléphonique très positif. Démo prévue sur le projet Banc de Test.',
    nextAction: 'Entretien technique & visite d\'usine',
    nextActionDate: '2026-10-18',
    logo: '⚡',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    userId: 'demo',
    company: 'Alstom Transport',
    role: 'Apprenti Systèmes Embarqués & Signalisation',
    status: 'candidaté',
    date: '2026-10-12',
    portfolioId: 'geii-master',
    portfolioName: 'Portfolio Industriel & Électronique',
    portfolioSlug: 'portfoliolarry',
    customUrl: 'https://portfoliogen.net/p/portfoliolarry?for=Alstom',
    contactName: 'Émilie Mercier (Talent Acquisition)',
    contactEmail: 'recrutement-cadres@alstomgroup.com',
    contactPhone: '+33 1 57 06 90 00',
    location: 'Saint-Ouen (93)',
    contractType: 'Alternance',
    salary: '1 550 € / mois',
    notes: 'Lien direct envoyé via LinkedIn avec mot personnalisé. En attente de revue par le tuteur.',
    nextAction: 'Relance par message LinkedIn',
    nextActionDate: '2026-10-19',
    logo: '🚆',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    userId: 'demo',
    company: 'Thales Defence & Security',
    role: 'Développeur Firmware & Bus CAN',
    status: 'relance',
    date: '2026-09-28',
    portfolioId: 'geii-master',
    portfolioName: 'Portfolio Industriel & Électronique',
    portfolioSlug: 'portfoliolarry',
    customUrl: 'https://portfoliogen.net/p/portfoliolarry?for=Thales',
    contactName: 'Laurent Fabre',
    contactEmail: 'laurent.fabre@thalesgroup.com',
    location: 'Vélizy-Villacoublay (78)',
    contractType: 'Stage de fin d\'études',
    notes: 'Candidature spontanée avec projet Banc de Test et STM32.',
    nextAction: 'Appel RH de suivi',
    nextActionDate: '2026-10-16',
    logo: '📡',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getStorageKey(userId?: string): string {
  return `${LOCAL_STORAGE_KEY_PREFIX}${userId || 'local_user'}`;
}

export const crmService = {
  /**
   * Fetch all CRM applications for user
   */
  async getApplications(userId?: string): Promise<CRMApplication[]> {
    const supabase = createClient();
    let remoteApps: CRMApplication[] = [];
    let hasRemote = false;

    if (userId) {
      try {
        const { data, error } = await supabase
          .from('crm_applications')
          .select('*')
          .eq('user_id', userId)
          .order('applied_date', { ascending: false });

        if (!error && data && data.length > 0) {
          hasRemote = true;
          remoteApps = data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            company: d.company,
            role: d.role || '',
            status: d.status || 'candidaté',
            date: d.applied_date ? String(d.applied_date).split('T')[0] : new Date().toISOString().split('T')[0],
            portfolioId: d.portfolio_id || undefined,
            portfolioName: d.portfolio_name || undefined,
            portfolioSlug: d.portfolio_slug || undefined,
            customUrl: d.custom_url || undefined,
            contactName: d.contact_name || undefined,
            contactEmail: d.contact_email || undefined,
            contactPhone: d.contact_phone || undefined,
            location: d.location || undefined,
            contractType: d.contract_type || undefined,
            salary: d.salary || undefined,
            notes: d.notes || '',
            nextAction: d.next_action || undefined,
            nextActionDate: d.next_action_date ? String(d.next_action_date).split('T')[0] : undefined,
            logo: d.logo || getCompanyEmoji(d.company),
            createdAt: d.created_at || new Date().toISOString(),
            updatedAt: d.updated_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Supabase crm_applications query skipped/fallback:', err);
      }
    }

    if (hasRemote && remoteApps.length > 0) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(getStorageKey(userId), JSON.stringify(remoteApps));
        } catch (_) {}
      }
      return remoteApps;
    }

    // LocalStorage fallback
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem(getStorageKey(userId)) || localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}local_user`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse local CRM applications:', e);
      }

      // Seed initial default apps so the candidate sees an organized workflow immediately
      try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(INITIAL_DEFAULT_APPLICATIONS));
      } catch (_) {}
    }

    return INITIAL_DEFAULT_APPLICATIONS;
  },

  /**
   * Save (create or update) application
   */
  async saveApplication(userId: string | undefined, input: CRMApplicationInput): Promise<CRMApplication> {
    const supabase = createClient();
    const effectiveUserId = userId || 'local_user';
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const currentApps = await this.getApplications(userId);
    const existingIndex = input.id ? currentApps.findIndex(a => a.id === input.id) : -1;

    const record: CRMApplication = {
      id: input.id || `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: effectiveUserId,
      company: input.company.trim(),
      role: input.role?.trim() || 'Candidat',
      status: input.status || 'candidaté',
      date: input.date || today,
      portfolioId: input.portfolioId,
      portfolioName: input.portfolioName,
      portfolioSlug: input.portfolioSlug,
      customUrl: input.customUrl,
      contactName: input.contactName?.trim(),
      contactEmail: input.contactEmail?.trim(),
      contactPhone: input.contactPhone?.trim(),
      location: input.location?.trim(),
      contractType: input.contractType?.trim(),
      salary: input.salary?.trim(),
      notes: input.notes?.trim() || '',
      nextAction: input.nextAction?.trim(),
      nextActionDate: input.nextActionDate,
      logo: input.logo || getCompanyEmoji(input.company),
      createdAt: existingIndex >= 0 ? currentApps[existingIndex].createdAt : now,
      updatedAt: now,
    };

    // 1. Try Supabase
    if (userId) {
      try {
        const dbPayload: any = {
          user_id: userId,
          company: record.company,
          role: record.role,
          status: record.status,
          applied_date: record.date,
          portfolio_id: record.portfolioId || null,
          portfolio_name: record.portfolioName || null,
          portfolio_slug: record.portfolioSlug || null,
          custom_url: record.customUrl || null,
          contact_name: record.contactName || null,
          contact_email: record.contactEmail || null,
          contact_phone: record.contactPhone || null,
          location: record.location || null,
          contract_type: record.contractType || null,
          salary: record.salary || null,
          notes: record.notes,
          next_action: record.nextAction || null,
          next_action_date: record.nextActionDate || null,
          logo: record.logo,
          updated_at: now,
        };

        if (input.id && !input.id.startsWith('app_') && !input.id.startsWith('demo-')) {
          await supabase.from('crm_applications').update(dbPayload).eq('id', input.id);
        } else {
          const { data, error } = await supabase.from('crm_applications').insert({
            ...dbPayload,
            created_at: now,
          }).select().single();
          if (!error && data?.id) {
            record.id = data.id;
          }
        }
      } catch (err) {
        console.warn('Supabase saveApplication error (fallback local):', err);
      }
    }

    // 2. Update local storage
    let updatedList: CRMApplication[];
    if (existingIndex >= 0) {
      updatedList = [...currentApps];
      updatedList[existingIndex] = record;
    } else {
      updatedList = [record, ...currentApps];
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(updatedList));
      } catch (_) {}
    }

    return record;
  },

  /**
   * Delete application
   */
  async deleteApplication(userId: string | undefined, id: string): Promise<boolean> {
    const supabase = createClient();
    if (userId && !id.startsWith('app_') && !id.startsWith('demo-')) {
      try {
        await supabase.from('crm_applications').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase deleteApplication error:', err);
      }
    }

    const currentApps = await this.getApplications(userId);
    const filtered = currentApps.filter(a => a.id !== id);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(filtered));
      } catch (_) {}
    }
    return true;
  },

  /**
   * Sync directly from Studio when a recipient company is specified
   */
  async syncFromStudio(
    userId: string | undefined,
    portfolio: StudioPortfolio,
    company: string,
    role?: string,
    contactName?: string
  ): Promise<CRMApplication> {
    const cleanCompany = (company || '').trim();
    if (!cleanCompany) {
      throw new Error('Nom d\'entreprise requis pour l\'enregistrement dans le CRM');
    }

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://portfoliogen.net';
    const slug = (portfolio.slug || 'portfolio').trim();
    const queryComp = encodeURIComponent(cleanCompany.replace(/\s+/g, ''));
    const customUrl = `${siteUrl}/p/${slug}?for=${queryComp}`;

    const apps = await this.getApplications(userId);
    const existing = apps.find(a => a.company.toLowerCase() === cleanCompany.toLowerCase());

    const input: CRMApplicationInput = {
      id: existing?.id,
      company: cleanCompany,
      role: role || portfolio.persona || portfolio.name || 'Candidature Alternance / Emploi',
      status: existing?.status || 'candidaté',
      date: existing?.date || new Date().toISOString().split('T')[0],
      portfolioId: portfolio.id,
      portfolioName: portfolio.name,
      portfolioSlug: slug,
      customUrl: customUrl,
      contactName: contactName || portfolio.recipientName || existing?.contactName,
      logo: getCompanyEmoji(cleanCompany),
      notes: existing?.notes || `Lien personnalisé généré depuis le Studio pour ${cleanCompany}.`,
      nextAction: existing?.nextAction || 'Relance email / téléphone',
      nextActionDate: existing?.nextActionDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    };

    return await this.saveApplication(userId, input);
  },

  /**
   * Get real studio portfolios available for linking
   */
  async getAvailablePortfolios(userId?: string): Promise<Array<{ id: string; name: string; slug: string }>> {
    const result: Array<{ id: string; name: string; slug: string }> = [];
    const seen = new Set<string>();

    // 1. From localStorage Studio
    if (typeof window !== 'undefined') {
      try {
        const activeRaw = localStorage.getItem('portfoliogen_current_active_portfolio');
        if (activeRaw) {
          const active = JSON.parse(activeRaw);
          if (active && active.slug && !seen.has(active.slug)) {
            seen.add(active.slug);
            result.push({
              id: active.id || 'active',
              name: active.name || 'Portfolio Actif',
              slug: active.slug,
            });
          }
        }

        const studioKey = `portfoliogen_studio_portfolios_${userId || 'guest'}`;
        const rawList = localStorage.getItem(studioKey);
        if (rawList) {
          const list = JSON.parse(rawList);
          if (Array.isArray(list)) {
            for (const item of list) {
              if (item.slug && !seen.has(item.slug)) {
                seen.add(item.slug);
                result.push({
                  id: item.id || item.slug,
                  name: item.name || item.slug,
                  slug: item.slug,
                });
              }
            }
          }
        }
      } catch (_) {}
    }

    // 2. Default if none found
    if (result.length === 0) {
      result.push({
        id: 'portfoliolarry',
        name: 'Portfolio Larry Goma (GEII)',
        slug: 'portfoliolarry',
      });
    }

    return result;
  },
};
