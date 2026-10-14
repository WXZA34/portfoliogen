import { createClient } from '@/lib/supabase/client';

export interface ProjectKPI {
  label: string;
  value: string;
}

export interface VideoMediaItem {
  id?: string;
  url: string;              // YouTube, Vimeo, MP4, Loom
  title?: string;
  durationSeconds?: number; // <= 120 (max 2 minutes)
}

export const MAX_PROJECT_IMAGES = 6;
export const MAX_PROJECT_VIDEOS = 2;
export const MAX_VIDEO_DURATION_SECONDS = 120; // 2 minutes max

export type ProjectCategory = 'academic' | 'mini' | 'personal' | 'soft' | 'other';

export interface ProjectItem {
  id: string;
  userId?: string;
  title: string;
  description: string;
  techStack: string[];
  role?: string;
  company?: string;
  year?: string;
  duration?: string;
  url?: string;
  github?: string;
  imageUrl?: string;
  imageAlt?: string;
  images?: string[];          // Up to 6 images
  videos?: VideoMediaItem[];  // Up to 2 videos (max 2 min each)
  status: 'published' | 'draft';
  category?: ProjectCategory;
  kpis?: ProjectKPI[];
  isFeatured?: boolean;
  createdAt?: string;
}

const LOCAL_STORAGE_KEY_PREFIX = 'portfoliogen_cvtheque_projects_';

export const DEFAULT_STARTER_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-sae-001',
    title: 'Système de Commande de Chauffage sous CodeSys',
    description: "L'objectif de cette activité pratique est d'automatiser et de simuler le contrôle d'un système de chauffage électrique. Le système s'appuie sur un automate programmable industriel (API) simulé via le logiciel CodeSys V2.3.",
    techStack: ['codesys', 'IHM', 'WAGO', 'Câblage'],
    status: 'published',
    category: 'academic',
    kpis: [{ label: 'Automate', value: 'WAGO 750' }, { label: 'Simulation', value: 'CodeSys V2.3' }, { label: 'Précision', value: '±0.5°C' }],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Banc de câblage et automate industriel WAGO',
    year: '2025',
    role: 'Étudiant B.U.T. GEII',
    duration: 'Semestre 2',
  },
  {
    id: 'proj-sae-002',
    title: "Automatisation d'une base logistique",
    description: "Le Projet Base Logistique est un projet interne passionnant qui nous a plongés dans le monde de la robotique et de l'automatisme.",
    techStack: ['Automatisme', 'WAGO', 'Supervision', 'codesys', 'ESP32'],
    status: 'published',
    category: 'academic',
    kpis: [{ label: 'AGV Robot', value: 'Guidage optique' }, { label: 'Supervision', value: 'IHM Web' }, { label: 'Temps cycle', value: '45s' }],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Plateforme de robotique mobile et logistique',
    year: '2025',
    role: 'Étudiant B.U.T. GEII',
    duration: 'Semestre 2',
  },
  {
    id: 'proj-001',
    title: 'NeuralCommerce Platform',
    description: 'Moteur de recommandation e-commerce alimenté par l\'IA, traitant plus de 2M de requêtes quotidiennes avec 94% de précision.',
    techStack: ['React', 'Python', 'TensorFlow', 'AWS', 'PostgreSQL'],
    status: 'published',
    kpis: [{ label: 'Requêtes/Jour', value: '2.1M' }, { label: 'Précision', value: '94.2%' }, { label: 'Latence', value: '18ms' }],
    github: 'github.com/alex/neuralcommerce',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Visualisation de réseau neuronal et de données analytiques',
    year: '2026',
    role: 'Lead Engineer',
    duration: '8 mois',
  },
  {
    id: 'proj-002',
    title: 'DistributedDB Orchestrator',
    description: 'Couche d\'orchestration de base de données native Kubernetes prenant en charge la réplication multi-régions et les migrations sans interruption.',
    techStack: ['Go', 'Kubernetes', 'gRPC', 'etcd', 'Terraform'],
    status: 'published',
    kpis: [{ label: 'Disponibilité', value: '99.99%' }, { label: 'Nœuds gérés', value: '240' }, { label: 'Temps migration', value: '0s' }],
    github: 'github.com/alex/distdb',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Serveurs et architecture réseau haute disponibilité',
    year: '2025',
    role: 'Architecte Cloud',
    duration: '12 mois',
  },
  {
    id: 'proj-003',
    title: 'RealTime Collaboration SDK',
    description: 'SDK de collaboration basé sur WebSocket permettant l\'édition simultanée concurrente style Google Docs pour applications web.',
    techStack: ['TypeScript', 'WebSocket', 'CRDT', 'Node.js', 'Redis'],
    status: 'published',
    kpis: [{ label: 'Utilisateurs simultanés', value: '10K' }, { label: 'Taux de conflit', value: '0.001%' }, { label: 'Latence', value: '12ms' }],
    github: 'github.com/alex/collab-sdk',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Équipe de développeurs collaborant sur un projet en temps réel',
    year: '2025',
    role: 'Créateur & Mainteneur',
    duration: '6 mois',
  },
  {
    id: 'proj-004',
    title: 'Predictive DevOps Monitor',
    description: 'Surveillance d\'infrastructure basée sur le Machine Learning qui anticipe les pannes 15 minutes à l\'avance via détection d\'anomalies.',
    techStack: ['Python', 'Prometheus', 'Grafana', 'scikit-learn', 'Kafka'],
    status: 'published',
    kpis: [{ label: 'Précision prédiction', value: '87%' }, { label: 'Faux positifs', value: '3.2%' }, { label: 'Réduction MTTR', value: '-68%' }],
    github: 'github.com/alex/predictops',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Graphiques de surveillance DevOps et alertes prédictives',
    year: '2024',
    role: 'Ingénieur ML',
    duration: '5 mois',
  },
  {
    id: 'proj-005',
    title: 'Open Source CLI Framework',
    description: 'Framework CLI extensible avec architecture de plugins, adopté par plus de 3 400 développeurs. Mis en avant sur GitHub Trending.',
    techStack: ['TypeScript', 'Node.js', 'Ink', 'Commander.js'],
    status: 'published',
    kpis: [{ label: 'GitHub Stars', value: '3.4K' }, { label: 'Téléchargements/semaine', value: '28K' }, { label: 'Contributeurs', value: '47' }],
    github: 'github.com/alex/cli-forge',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Interface de terminal en ligne de commande pour développeurs',
    year: '2024',
    role: 'Créateur',
    duration: '4 mois',
  },
  {
    id: 'proj-006',
    title: 'FinTech Compliance Engine',
    description: 'Automatisation des vérifications réglementaires pour institutions financières européennes, couvrant les normes DSP2 et RGPD.',
    techStack: ['Java', 'Spring Boot', 'Apache Flink', 'Oracle', 'Kafka'],
    status: 'draft',
    kpis: [{ label: 'Règles vérifiées', value: '1,240' }, { label: 'Conformité', value: '99.7%' }, { label: 'Vitesse de flux', value: '50K/s' }],
    github: undefined,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Tableau de bord financier et de conformité réglementaire',
    year: '2026',
    role: 'Lead Backend',
    duration: 'En cours',
  },
];

// Helper to ensure user_profiles row exists for foreign key constraint
async function ensureUserProfileExists(supabase: any, user: any) {
  if (!user?.id) return;
  try {
    await supabase.from('user_profiles').upsert(
      {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur',
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('Could not upsert user_profile', err);
  }
}

function getLocalProjects(userId: string = 'guest'): ProjectItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalProjects(projects: ProjectItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(projects));
  } catch {}
}

export async function fetchUserProjects(): Promise<ProjectItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || 'guest';
    const local = getLocalProjects(userId);

    if (!user) {
      // Unauthenticated visitor: use local storage or default starter projects
      return local.length > 0 ? local : DEFAULT_STARTER_PROJECTS;
    }

    // Try fetching from Supabase
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase projects query error:', error);
      return local.length > 0 ? local : DEFAULT_STARTER_PROJECTS;
    }

    if (Array.isArray(data) && data.length > 0) {
      const mapped: ProjectItem[] = data.map((row: any) => {
        const localMatch = local.find((p) => p.id === row.id);
        return {
          id: row.id,
          userId: row.user_id,
          title: row.title,
          description: row.description || '',
          techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
          role: row.role || '',
          company: row.company || '',
          year: row.start_date ? new Date(row.start_date).getFullYear().toString() : localMatch?.year,
          duration: localMatch?.duration || (row.end_date ? undefined : 'En cours'),
          url: row.url || undefined,
          github: localMatch?.github || (row.url?.includes('github.com') ? row.url : undefined),
          imageUrl: row.image_url || localMatch?.imageUrl || undefined,
          imageAlt: row.title,
          status: row.is_featured ? 'published' : ((row.status as any) || 'published'),
          kpis: localMatch?.kpis || [],
          isFeatured: !!row.is_featured,
          createdAt: row.created_at,
        };
      });

      // Cache locally
      setLocalProjects(mapped, user.id);
      return mapped;
    }

    // If user has no projects yet in database, check local cache or starter
    if (local.length > 0) {
      return local;
    }

    return DEFAULT_STARTER_PROJECTS;
  } catch (err) {
    console.warn('Error fetching projects:', err);
    return DEFAULT_STARTER_PROJECTS;
  }
}

export async function saveProject(project: Omit<ProjectItem, 'id' | 'createdAt'>, existingId?: string): Promise<ProjectItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `proj-${Date.now()}`;
  const item: ProjectItem = {
    ...project,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  if (user?.id) {
    try {
      await ensureUserProfileExists(supabase, user);

      const isUUID = !!existingId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existingId);
      const dbPayload = {
        ...(isUUID ? { id: existingId } : {}),
        user_id: user.id,
        title: item.title.trim(),
        description: item.description.trim(),
        tech_stack: item.techStack,
        role: item.role || '',
        company: item.company || '',
        url: item.url || item.github || '',
        image_url: item.imageUrl || '',
        is_featured: item.status === 'published',
        updated_at: new Date().toISOString(),
      };

      if (isUUID) {
        await supabase.from('projects').update(dbPayload).eq('id', existingId);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('projects')
          .insert(dbPayload)
          .select()
          .single();

        if (!insertErr && inserted) {
          item.id = inserted.id;
        }
      }
    } catch (err) {
      console.warn('Supabase project save error, saved locally', err);
    }
  }

  // Save to local cache
  const local = getLocalProjects(userId);
  // Remove either the old existingId (e.g. 'proj-001') or item.id
  const filtered = local.filter((p) => p.id !== item.id && p.id !== existingId);
  const updated = [item, ...filtered];
  setLocalProjects(updated, userId);

  return item;
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const isUUID = !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (user?.id && isUUID) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase project delete error', err);
    }
  }

  const local = getLocalProjects(userId);
  const filtered = local.filter((p) => p.id !== id);
  setLocalProjects(filtered, userId);

  return true;
}

// ============================================================================
// SKILLS / COMPÉTENCES SERVICE
// ============================================================================

export interface SkillItem {
  id: string;
  userId?: string;
  name: string;
  category: 'hard' | 'soft' | 'tools';
  level: number; // 0 - 100
  years: number;
  isFeatured?: boolean;
  createdAt?: string;
}

const LOCAL_STORAGE_SKILLS_PREFIX = 'portfoliogen_cvtheque_skills_';

export const DEFAULT_STARTER_SKILLS: SkillItem[] = [
  // Hard skills
  { id: 'sk-001', name: 'TypeScript / JavaScript', category: 'hard', level: 95, years: 7, isFeatured: true },
  { id: 'sk-002', name: 'React / Next.js', category: 'hard', level: 93, years: 6, isFeatured: true },
  { id: 'sk-003', name: 'Node.js / Express', category: 'hard', level: 88, years: 6 },
  { id: 'sk-004', name: 'Python', category: 'hard', level: 82, years: 5 },
  { id: 'sk-005', name: 'Go (Golang)', category: 'hard', level: 74, years: 3 },
  { id: 'sk-006', name: 'PostgreSQL / Supabase', category: 'hard', level: 85, years: 6, isFeatured: true },
  { id: 'sk-007', name: 'System Design & Architecture', category: 'hard', level: 90, years: 5 },
  { id: 'sk-008', name: 'Machine Learning (Appliqué)', category: 'hard', level: 68, years: 3 },
  { id: 'sk-009', name: 'Docker / Kubernetes', category: 'hard', level: 80, years: 4 },
  { id: 'sk-010', name: 'GraphQL / REST API Design', category: 'hard', level: 91, years: 5 },

  // Soft skills
  { id: 'sk-011', name: 'Leadership Technique', category: 'soft', level: 88, years: 4, isFeatured: true },
  { id: 'sk-012', name: 'Communication Transverse', category: 'soft', level: 85, years: 6 },
  { id: 'sk-013', name: 'Mentoring & Code Review', category: 'soft', level: 90, years: 5, isFeatured: true },
  { id: 'sk-014', name: 'Agilité / Scrum Facilitation', category: 'soft', level: 82, years: 5 },
  { id: 'sk-015', name: 'Sens Produit (Product Thinking)', category: 'soft', level: 78, years: 4 },
  { id: 'sk-016', name: 'Collaboration Distribuée (Remote)', category: 'soft', level: 92, years: 5 },

  // Tools & Platforms
  { id: 'sk-017', name: 'VS Code / JetBrains IDEs', category: 'tools', level: 95, years: 7 },
  { id: 'sk-018', name: 'GitHub / GitLab CI/CD', category: 'tools', level: 93, years: 7, isFeatured: true },
  { id: 'sk-019', name: 'AWS (EC2, S3, Lambda, RDS)', category: 'tools', level: 84, years: 4 },
  { id: 'sk-020', name: 'Terraform / Pulumi', category: 'tools', level: 75, years: 3 },
  { id: 'sk-021', name: 'Figma (Design Handoff)', category: 'tools', level: 65, years: 3 },
  { id: 'sk-022', name: 'Datadog / Grafana', category: 'tools', level: 80, years: 4 },
  { id: 'sk-023', name: 'Linear / Jira', category: 'tools', level: 88, years: 5 },
  { id: 'sk-024', name: 'Notion / Confluence', category: 'tools', level: 86, years: 5 },
];

function getLocalSkills(userId: string = 'guest'): SkillItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_SKILLS_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalSkills(skills: SkillItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_SKILLS_PREFIX}${userId}`, JSON.stringify(skills));
  } catch {}
}

export async function fetchUserSkills(): Promise<SkillItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || 'guest';
    const local = getLocalSkills(userId);

    if (!user) {
      return local.length > 0 ? local : DEFAULT_STARTER_SKILLS;
    }

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('level', { ascending: false });

    if (error) {
      console.warn('Supabase skills query error:', error);
      return local.length > 0 ? local : DEFAULT_STARTER_SKILLS;
    }

    if (Array.isArray(data) && data.length > 0) {
      const mapped: SkillItem[] = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        category: (row.category as any) || 'hard',
        level: Number(row.level) || 50,
        years: Number(row.years_experience) || 1,
        isFeatured: !!row.is_featured,
        createdAt: row.created_at,
      }));

      setLocalSkills(mapped, user.id);
      return mapped;
    }

    if (local.length > 0) {
      return local;
    }

    return DEFAULT_STARTER_SKILLS;
  } catch (err) {
    console.warn('Error fetching skills:', err);
    return DEFAULT_STARTER_SKILLS;
  }
}

export async function saveSkill(
  skill: Omit<SkillItem, 'id' | 'createdAt'>,
  existingId?: string
): Promise<SkillItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `sk-${Date.now()}`;
  const item: SkillItem = {
    ...skill,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  if (user?.id) {
    try {
      await ensureUserProfileExists(supabase, user);

      const isUUID = !!existingId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existingId);
      const dbPayload = {
        ...(isUUID ? { id: existingId } : {}),
        user_id: user.id,
        name: item.name.trim(),
        category: item.category,
        level: Math.min(100, Math.max(0, Math.round(item.level))),
        years_experience: Math.max(0, item.years),
        is_featured: !!item.isFeatured,
      };

      if (isUUID) {
        await supabase.from('skills').update(dbPayload).eq('id', existingId);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('skills')
          .insert(dbPayload)
          .select()
          .single();

        if (!insertErr && inserted) {
          item.id = inserted.id;
        }
      }
    } catch (err) {
      console.warn('Supabase skill save error, saved locally', err);
    }
  }

  const local = getLocalSkills(userId);
  const filtered = local.filter((s) => s.id !== item.id && s.id !== existingId);
  const updated = [item, ...filtered];
  setLocalSkills(updated, userId);

  return item;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const isUUID = !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (user?.id && isUUID) {
    try {
      await supabase.from('skills').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase skill delete error', err);
    }
  }

  const local = getLocalSkills(userId);
  const filtered = local.filter((s) => s.id !== id);
  setLocalSkills(filtered, userId);

  return true;
}

// ============================================================================
// PARCOURS & FORMATIONS SERVICE
// ============================================================================

export interface ParcoursItem {
  id: string;
  userId?: string;
  type: 'experience' | 'formation';
  title: string;
  organization: string;
  location?: string;
  period: string;
  duration?: string;
  description: string;
  achievements?: string[];
  tech?: string[];
  document?: string | null;
  current?: boolean;
  createdAt?: string;
}

const LOCAL_STORAGE_PARCOURS_PREFIX = 'portfoliogen_cvtheque_parcours_';

export const DEFAULT_STARTER_PARCOURS: ParcoursItem[] = [
  {
    id: 'par-001',
    type: 'experience',
    title: 'Senior Full-Stack Engineer & Lead Tech',
    organization: 'Mistral AI',
    location: 'Paris, France',
    period: 'Jan 2025 — Présent',
    duration: '1 an 9 mois',
    description: 'Pilotage de l\'architecture de la plateforme développeur servant plus de 120 000 utilisateurs API. Conception de l\'interface playground, du tableau de bord de consommation et du système de facturation Stripe. Encadrement d\'une équipe de 4 ingénieurs.',
    achievements: [
      'Réduction de la latence API de 40% via optimisation des flux streaming',
      'Lancement du playground interactif utilisé par 45 000 développeurs/mois',
      'Intégration et onboarding de clients grands comptes représentant 2,4M€ d\'ARR',
    ],
    tech: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Stripe', 'Docker'],
    document: 'recommandation_mistral.pdf',
    current: true,
  },
  {
    id: 'par-002',
    type: 'experience',
    title: 'Software Engineer II (APM & Distributed Tracing)',
    organization: 'Datadog',
    location: 'Paris, France (Remote)',
    period: 'Mar 2023 — Déc 2024',
    duration: '1 an 10 mois',
    description: 'Développement des fonctionnalités de traçage distribué pour le produit APM. Contribution majeure à l\'agent open-source et optimisation du pipeline d\'ingestion traitant plus de 15 To de données par jour.',
    achievements: [
      'Déploiement du sampling distribué adopté par plus de 8 000 clients enterprise',
      'Réduction des coûts d\'infrastructure du pipeline de 22%',
      'Mentorat technique de 3 développeurs juniors',
    ],
    tech: ['Go', 'Python', 'Kafka', 'Cassandra', 'OpenTelemetry'],
    document: 'attestation_datadog.pdf',
    current: false,
  },
  {
    id: 'par-003',
    type: 'experience',
    title: 'Développeur Full-Stack Web & FinTech',
    organization: 'Qonto',
    location: 'Paris, France',
    period: 'Juil 2021 — Fév 2023',
    duration: '1 an 8 mois',
    description: 'Développement des fonctionnalités bancaires centrales pour les PME. Conception du flux de virements internationaux, du moteur de catégorisation automatique des dépenses et des exports comptables.',
    achievements: [
      'Lancement des virements internationaux dans 7 nouveaux marchés européens',
      'Moteur de dépenses traitant plus de 180M€ de transactions mensuelles',
      'Zéro incident de production critique sur une période de 18 mois',
    ],
    tech: ['Ruby on Rails', 'React', 'TypeScript', 'PostgreSQL', 'Redis'],
    document: null,
    current: false,
  },
  {
    id: 'par-004',
    type: 'formation',
    title: 'Master 2 — Génie Logiciel & Intelligence Artificielle',
    organization: 'Université Paris-Saclay',
    location: 'Orsay, France',
    period: 'Sep 2019 — Juin 2021',
    duration: '2 ans',
    description: 'Spécialisation en systèmes distribués, algorithmes de Machine Learning et architecture logicielle moderne. Diplômé Major de promotion avec Mention Très Bien.',
    achievements: [
      'Major de promotion — 18.4/20 de moyenne générale',
      'Stage de recherche à l\'INRIA sur les réseaux de neurones sur graphes',
      'Publication scientifique sur les algorithmes de consensus distribués',
    ],
    tech: ['Python', 'Java', 'C++', 'PyTorch', 'LaTeX'],
    document: 'diplome_master_paris_saclay.pdf',
    current: false,
  },
  {
    id: 'par-005',
    type: 'experience',
    title: 'Développeur Junior (Alternance)',
    organization: 'BNP Paribas',
    location: 'Paris, France',
    period: 'Sep 2019 — Juin 2021',
    duration: '2 ans',
    description: 'Contrat d\'alternance en parallèle du Master. Développement d\'outils internes pour l\'équipe gestion des risques, notamment un agrégateur temps réel de positions de trading.',
    achievements: [
      'Agrégateur de positions déployé auprès de plus de 200 traders',
      'Automatisation du reporting manuel économisant 6h de travail hebdomadaire',
    ],
    tech: ['Java', 'Spring Boot', 'Angular', 'Oracle DB'],
    document: null,
    current: false,
  },
  {
    id: 'par-006',
    type: 'formation',
    title: 'Licence — Informatique Générale',
    organization: 'Université Paris-Diderot (Paris VII)',
    location: 'Paris, France',
    period: 'Sep 2016 — Juin 2019',
    duration: '3 ans',
    description: 'Fondamentaux de l\'informatique : algorithmique, structures de données, systèmes d\'exploitation, réseaux et programmation web.',
    achievements: [
      'Classé dans le Top 5% de la promotion',
      'Vainqueur du hackathon inter-universitaire "Paris Hack 2018" (1ère place)',
    ],
    tech: ['C', 'Java', 'Python', 'HTML/CSS', 'JavaScript', 'SQL'],
    document: 'diplome_licence_paris7.pdf',
    current: false,
  },
];

function getLocalParcours(userId: string = 'guest'): ParcoursItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PARCOURS_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalParcours(parcours: ParcoursItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PARCOURS_PREFIX}${userId}`, JSON.stringify(parcours));
  } catch {}
}

export async function fetchUserParcours(): Promise<ParcoursItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || 'guest';
    const local = getLocalParcours(userId);

    if (!user) {
      return local.length > 0 ? local : DEFAULT_STARTER_PARCOURS;
    }

    const { data, error } = await supabase
      .from('parcours')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase parcours query error:', error);
      return local.length > 0 ? local : DEFAULT_STARTER_PARCOURS;
    }

    if (Array.isArray(data) && data.length > 0) {
      const mapped: ParcoursItem[] = data.map((row: any) => {
        const localMatch = local.find((p) => p.id === row.id);
        return {
          id: row.id,
          userId: row.user_id,
          type: (row.type as any) || 'experience',
          title: row.title,
          organization: row.organization || '',
          location: row.location || localMatch?.location || '',
          period: localMatch?.period || (row.start_date ? `${new Date(row.start_date).getFullYear()}` : 'En cours'),
          duration: localMatch?.duration || (row.is_current ? 'En cours' : undefined),
          description: row.description || '',
          achievements: localMatch?.achievements || [],
          tech: localMatch?.tech || [],
          document: localMatch?.document || null,
          current: !!row.is_current,
          createdAt: row.created_at,
        };
      });

      setLocalParcours(mapped, user.id);
      return mapped;
    }

    if (local.length > 0) {
      return local;
    }

    return DEFAULT_STARTER_PARCOURS;
  } catch (err) {
    console.warn('Error fetching parcours:', err);
    return DEFAULT_STARTER_PARCOURS;
  }
}

export async function saveParcours(
  item: Omit<ParcoursItem, 'id' | 'createdAt'>,
  existingId?: string
): Promise<ParcoursItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `par-${Date.now()}`;
  const parcoursItem: ParcoursItem = {
    ...item,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  if (user?.id) {
    try {
      await ensureUserProfileExists(supabase, user);

      const isUUID = !!existingId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existingId);
      const dbPayload = {
        ...(isUUID ? { id: existingId } : {}),
        user_id: user.id,
        type: parcoursItem.type,
        title: parcoursItem.title.trim(),
        organization: parcoursItem.organization.trim(),
        location: parcoursItem.location || '',
        description: parcoursItem.description.trim(),
        is_current: !!parcoursItem.current,
      };

      if (isUUID) {
        await supabase.from('parcours').update(dbPayload).eq('id', existingId);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('parcours')
          .insert(dbPayload)
          .select()
          .single();

        if (!insertErr && inserted) {
          parcoursItem.id = inserted.id;
        }
      }
    } catch (err) {
      console.warn('Supabase parcours save error, saved locally', err);
    }
  }

  const local = getLocalParcours(userId);
  const filtered = local.filter((p) => p.id !== parcoursItem.id && p.id !== existingId);
  const updated = [parcoursItem, ...filtered];
  setLocalParcours(updated, userId);

  return parcoursItem;
}

export async function deleteParcours(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const isUUID = !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (user?.id && isUUID) {
    try {
      await supabase.from('parcours').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase parcours delete error', err);
    }
  }

  const local = getLocalParcours(userId);
  const filtered = local.filter((p) => p.id !== id);
  setLocalParcours(filtered, userId);

  return true;
}

// ============================================================================
// MÉDIAS (MEDIA GALLERY) SERVICE
// ============================================================================

export interface MediaFileItem {
  id: string;
  userId?: string;
  fileName: string;
  fileUrl: string;
  mediaType: 'image' | 'document' | 'video';
  fileSize?: string;
  altText?: string;
  project?: string;
  createdAt?: string;
}

const LOCAL_STORAGE_MEDIA_PREFIX = 'portfoliogen_cvtheque_media_';

export const DEFAULT_STARTER_MEDIA: MediaFileItem[] = [
  {
    id: 'media-001',
    fileName: 'Capture Dashboard NeuralCommerce',
    fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    mediaType: 'image',
    fileSize: '1.2 Mo',
    altText: 'Tableau de bord analytics IA et prévisions',
    project: 'NeuralCommerce',
  },
  {
    id: 'media-002',
    fileName: 'Schéma Architecture API Distribuée',
    fileUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    mediaType: 'image',
    fileSize: '0.8 Mo',
    altText: 'Architecture réseau et serveurs haute disponibilité',
    project: 'DistributedDB',
  },
  {
    id: 'media-003',
    fileName: 'Collaboration Équipe & Workshops',
    fileUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    mediaType: 'image',
    fileSize: '2.4 Mo',
    altText: 'Équipe de développeurs en session de conception collaborative',
    project: 'Général',
  },
  {
    id: 'media-004',
    fileName: 'Démo CLI Framework Terminal',
    fileUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1200&auto=format&fit=crop',
    mediaType: 'image',
    fileSize: '3.1 Mo',
    altText: 'Interface terminal interactif CLI Forge',
    project: 'CLI Forge',
  },
  {
    id: 'media-005',
    fileName: 'Conférence Paris Tech Talk',
    fileUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    mediaType: 'image',
    fileSize: '1.8 Mo',
    altText: 'Présentation sur scène lors de Paris.js',
    project: 'Général',
  },
  {
    id: 'media-006',
    fileName: 'Tableau de Bord Supervision Métriques',
    fileUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
    mediaType: 'image',
    fileSize: '0.9 Mo',
    altText: 'Métriques APM et alertes en direct',
    project: 'Datadog',
  },
  {
    id: 'media-007',
    fileName: 'Livre Blanc — Architecture Distribuée',
    fileUrl: '#',
    mediaType: 'document',
    fileSize: '0.4 Mo',
    altText: 'Livre blanc PDF',
    project: 'NeuralCommerce',
  },
  {
    id: 'media-008',
    fileName: 'Publication Recherche Graph Neural Networks',
    fileUrl: '#',
    mediaType: 'document',
    fileSize: '1.1 Mo',
    altText: 'Document PDF recherche',
    project: 'INRIA',
  },
];

function getLocalMedia(userId: string = 'guest'): MediaFileItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_MEDIA_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalMedia(items: MediaFileItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_MEDIA_PREFIX}${userId}`, JSON.stringify(items));
  } catch {}
}

export async function fetchUserMediaFiles(): Promise<MediaFileItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';
    const local = getLocalMedia(userId);

    if (!user) {
      return local.length > 0 ? local : DEFAULT_STARTER_MEDIA;
    }

    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase media query error:', error);
      return local.length > 0 ? local : DEFAULT_STARTER_MEDIA;
    }

    if (Array.isArray(data) && data.length > 0) {
      const mapped: MediaFileItem[] = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        fileName: row.file_name,
        fileUrl: row.file_url,
        mediaType: (row.media_type as any) || 'image',
        fileSize: row.file_size ? `${(row.file_size / 1024 / 1024).toFixed(1)} Mo` : '1.0 Mo',
        altText: row.alt_text || row.file_name,
        project: row.caption || 'Général',
        createdAt: row.created_at,
      }));

      setLocalMedia(mapped, user.id);
      return mapped;
    }

    if (local.length > 0) {
      return local;
    }

    return DEFAULT_STARTER_MEDIA;
  } catch (err) {
    console.warn('Error fetching media:', err);
    return DEFAULT_STARTER_MEDIA;
  }
}

export async function saveMediaFile(
  item: Omit<MediaFileItem, 'id' | 'createdAt'>,
  existingId?: string
): Promise<MediaFileItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `media-${Date.now()}`;
  const mediaItem: MediaFileItem = {
    ...item,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  if (user?.id) {
    try {
      await ensureUserProfileExists(supabase, user);

      const isUUID = !!existingId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existingId);
      const dbPayload = {
        ...(isUUID ? { id: existingId } : {}),
        user_id: user.id,
        file_name: mediaItem.fileName.trim(),
        file_url: mediaItem.fileUrl.trim(),
        media_type: mediaItem.mediaType,
        alt_text: mediaItem.altText || mediaItem.fileName,
        caption: mediaItem.project || 'Général',
      };

      if (isUUID) {
        await supabase.from('media_files').update(dbPayload).eq('id', existingId);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('media_files')
          .insert(dbPayload)
          .select()
          .single();

        if (!insertErr && inserted) {
          mediaItem.id = inserted.id;
        }
      }
    } catch (err) {
      console.warn('Supabase media save error, saved locally', err);
    }
  }

  const local = getLocalMedia(userId);
  const filtered = local.filter((m) => m.id !== mediaItem.id && m.id !== existingId);
  const updated = [mediaItem, ...filtered];
  setLocalMedia(updated, userId);

  return mediaItem;
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const isUUID = !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (user?.id && isUUID) {
    try {
      await supabase.from('media_files').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase media delete error', err);
    }
  }

  const local = getLocalMedia(userId);
  const filtered = local.filter((m) => m.id !== id);
  setLocalMedia(filtered, userId);

  return true;
}

// ============================================================================
// PERSONAS (TARGET PERSONAS) SERVICE
// ============================================================================

export interface PersonaItem {
  id: string;
  userId?: string;
  name: string;
  targetRole: string;
  industry: string;
  toneOfVoice: string;
  expectations: string[];
  portfoliosLinked?: number;
  color?: string;
  emoji?: string;
  createdAt?: string;
}

const LOCAL_STORAGE_PERSONAS_PREFIX = 'portfoliogen_cvtheque_personas_';

export const DEFAULT_STARTER_PERSONAS: PersonaItem[] = [
  {
    id: 'persona-001',
    name: 'Recruteur Tech Senior',
    targetRole: 'Lead Developer / Architecte',
    industry: 'Tech & SaaS',
    toneOfVoice: 'Précis, technique, orienté résultats',
    expectations: ['Stack technique détaillée', 'KPIs mesurables', 'Liens GitHub actifs', 'Architecture des projets', 'Contributions open source'],
    portfoliosLinked: 2,
    color: 'bg-primary/10 border-primary/20',
    emoji: '💻',
  },
  {
    id: 'persona-002',
    name: 'Fondateur Startup IA',
    targetRole: 'CTO / ML Engineer',
    industry: 'Intelligence Artificielle',
    toneOfVoice: 'Visionnaire, pragmatique, orienté impact',
    expectations: ['Expérience ML/LLM', 'Capacité à scaler', 'Mindset produit', 'Vitesse d\'exécution', 'Gestion de l\'incertitude'],
    portfoliosLinked: 1,
    color: 'bg-accent/10 border-accent/20',
    emoji: '🚀',
  },
  {
    id: 'persona-003',
    name: 'DRH Grand Groupe',
    targetRole: 'Ingénieur Senior / Manager',
    industry: 'Industrie & Aéronautique',
    toneOfVoice: 'Formel, structuré, axé compétences certifiées',
    expectations: ['Diplômes et certifications', 'Stabilité du parcours', 'Soft skills démontrés', 'Références vérifiables', 'Conformité aux normes'],
    portfoliosLinked: 1,
    color: 'bg-info/10 border-info/20',
    emoji: '🏢',
  },
  {
    id: 'persona-004',
    name: 'Directeur Artistique',
    targetRole: 'Designer / Créatif Senior',
    industry: 'Mode & Design',
    toneOfVoice: 'Esthétique, narratif, émotionnel',
    expectations: ['Portfolio visuel fort', 'Cohérence de l\'identité', 'Processus créatif visible', 'Collaborations notables', 'Sens du détail'],
    portfoliosLinked: 1,
    color: 'bg-warning/10 border-warning/20',
    emoji: '🎨',
  },
  {
    id: 'persona-005',
    name: 'Rédacteur en Chef',
    targetRole: 'Journaliste / Rédacteur',
    industry: 'Médias & Presse',
    toneOfVoice: 'Clair, percutant, factuel',
    expectations: ['Sujets traités et publications', 'Ligne éditoriale', 'Capacité d\'investigation', 'Adaptabilité des formats', 'Réseau de sources'],
    portfoliosLinked: 0,
    color: 'bg-negative/10 border-negative/20',
    emoji: '📰',
  },
];

function getLocalPersonas(userId: string = 'guest'): PersonaItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PERSONAS_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalPersonas(items: PersonaItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PERSONAS_PREFIX}${userId}`, JSON.stringify(items));
  } catch {}
}

export async function fetchUserPersonas(): Promise<PersonaItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';
    const local = getLocalPersonas(userId);

    return local.length > 0 ? local : DEFAULT_STARTER_PERSONAS;
  } catch (err) {
    console.warn('Error fetching personas:', err);
    return DEFAULT_STARTER_PERSONAS;
  }
}

export async function savePersona(
  item: Omit<PersonaItem, 'id' | 'createdAt'>,
  existingId?: string
): Promise<PersonaItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `persona-${Date.now()}`;
  const personaItem: PersonaItem = {
    ...item,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  const local = getLocalPersonas(userId);
  const filtered = local.filter((p) => p.id !== personaItem.id && p.id !== existingId);
  const updated = [personaItem, ...filtered];
  setLocalPersonas(updated, userId);

  return personaItem;
}

export async function deletePersona(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const local = getLocalPersonas(userId);
  const filtered = local.filter((p) => p.id !== id);
  setLocalPersonas(filtered, userId);

  return true;
}

// ============================================================================
// USER PROFILE & CONTACT INFO SERVICE (RUBRIQUE PROFIL & OBJECTIFS)
// ============================================================================

export interface UserProfileInfo {
  id?: string;
  userId?: string;
  avatarUrl?: string; // Profile photo URL
  fullName: string;
  headline: string;
  slogan: string;
  bio: string;
  objective: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  cvPdfUrl?: string;
  cvFileName?: string;
  cvFileSize?: string;
  hobbies: string[];
  methodologies: string[];
  availability: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_PROFILE_PREFIX = 'portfoliogen_cvtheque_profile_';

export const DEFAULT_USER_PROFILE: UserProfileInfo = {
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  fullName: 'KOKOU DUSSEY',
  headline: 'Étudiant B.U.T. Génie Électrique & Informatique Industrielle (GEII)',
  slogan: 'Concevoir la logique. Piloter le système.',
  bio: "Actuellement en formation B.U.T. GEII à l'IUT Sénart-Fontainebleau, je développe une solide expertise en automatisme industriel, programmation de microcontrôleurs et conception de cartes électroniques. Mon objectif est d'allier rigueur méthodologique et créativité technique pour bâtir des systèmes fiables et performants.",
  objective: "Recherche d'une alternance de 2 ans dès la rentrée 2026 dans les secteurs de l'automatisme, de la robotique industrielle ou des systèmes embarqués.",
  email: 'kokou.dussey@etu.u-pec.fr',
  phone: '+33 6 12 34 56 78',
  location: 'Île-de-France, France',
  linkedin: 'https://linkedin.com/in/kokou-dussey',
  github: 'https://github.com/kokou-dussey',
  website: 'https://my-portfolify.vercel.app/#/dussey%20larry',
  cvPdfUrl: '',
  cvFileName: '',
  cvFileSize: '',
  availability: 'Disponible pour alternance 2026–2028',
  hobbies: ['Robotique autonome', 'Impression 3D', 'Aéromodélisme', 'Course à pied'],
  methodologies: [
    'Cycle en V & Validation fonctionnelle',
    'Normes NF C 15-100 & Sécurité électrique',
    'Automates Programmables Industriels (API)',
    'Gestion de version Git & Documentation technique',
    'Travail en équipe & Gestion de projet SAÉ',
  ],
};

export async function fetchUserProfileInfo(): Promise<UserProfileInfo> {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';

    const raw = localStorage.getItem(`${LOCAL_STORAGE_PROFILE_PREFIX}${userId}`);
    if (raw) {
      return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
    }
    return DEFAULT_USER_PROFILE;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export async function saveUserProfileInfo(info: UserProfileInfo): Promise<UserProfileInfo> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const updated: UserProfileInfo = {
    ...info,
    userId: user?.id,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${LOCAL_STORAGE_PROFILE_PREFIX}${userId}`, JSON.stringify(updated));
    localStorage.setItem('portfoliogen_cvtheque_profile_latest', JSON.stringify(updated));
  }

  if (user?.id) {
    try {
      await supabase.from('user_profiles').upsert(
        {
          id: user.id,
          email: info.email || user.email || '',
          full_name: info.fullName || '',
          avatar_url: info.avatarUrl || '',
          headline: info.headline || '',
          location: info.location || '',
          website: info.website || '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('Could not upsert user_profiles:', e);
    }
  }

  return updated;
}

// ============================================================================
// LANGUAGES SERVICE (RUBRIQUE LANGUES)
// ============================================================================

export interface LanguageItem {
  id: string;
  userId?: string;
  name: string;
  level: string;
  flag?: string;
  detail?: string;
  createdAt?: string;
}

const LOCAL_STORAGE_LANGUAGES_PREFIX = 'portfoliogen_cvtheque_languages_';

export const DEFAULT_STARTER_LANGUAGES: LanguageItem[] = [
  { id: 'lang-001', name: 'Français', level: 'Langue maternelle', flag: '🇫🇷', detail: 'Expression écrite et orale soignée' },
  { id: 'lang-002', name: 'Anglais', level: 'Niveau B2 (Technique)', flag: '🇬🇧', detail: 'Lecture de documentations techniques et datasheets' },
  { id: 'lang-003', name: 'Espagnol', level: 'Niveau A2 (Notions)', flag: '🇪🇸', detail: 'Communication basique' },
];

function getLocalLanguages(userId: string = 'guest'): LanguageItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_LANGUAGES_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalLanguages(items: LanguageItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_LANGUAGES_PREFIX}${userId}`, JSON.stringify(items));
  } catch {}
}

export async function fetchUserLanguages(): Promise<LanguageItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';
    const local = getLocalLanguages(userId);
    return local.length > 0 ? local : DEFAULT_STARTER_LANGUAGES;
  } catch {
    return DEFAULT_STARTER_LANGUAGES;
  }
}

export async function saveUserLanguage(item: Omit<LanguageItem, 'id' | 'createdAt'>, existingId?: string): Promise<LanguageItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `lang-${Date.now()}`;
  const langItem: LanguageItem = {
    ...item,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  const local = getLocalLanguages(userId);
  const filtered = local.filter((l) => l.id !== langItem.id && l.id !== existingId);
  const updated = [langItem, ...filtered];
  setLocalLanguages(updated, userId);
  return langItem;
}

export async function deleteUserLanguage(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const local = getLocalLanguages(userId);
  const filtered = local.filter((l) => l.id !== id);
  setLocalLanguages(filtered, userId);
  return true;
}

// ============================================================================
// CERTIFICATIONS SERVICE (RUBRIQUE CERTIFICATIONS & HABILITATIONS)
// ============================================================================

export interface CertificationItem {
  id: string;
  userId?: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  badge?: string;
  createdAt?: string;
}

const LOCAL_STORAGE_CERTIF_PREFIX = 'portfoliogen_cvtheque_certifications_';

export const DEFAULT_STARTER_CERTIFICATIONS: CertificationItem[] = [
  { id: 'cert-001', title: 'Habilitation Électrique B1V / BR', issuer: 'IUT Sénart-Fontainebleau', year: '2025', badge: '⚡ Norme NF C 18-510' },
  { id: 'cert-002', title: 'Certification TIA Portal Automates S7', issuer: 'Siemens Industrial Academy', year: '2025', badge: '🤖 Automatisme' },
  { id: 'cert-003', title: 'TOEIC Listening & Reading (Score: 840)', issuer: 'ETS Global', year: '2024', badge: '🇬🇧 B2 Avancé' },
];

function getLocalCertifications(userId: string = 'guest'): CertificationItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_CERTIF_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalCertifications(items: CertificationItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_CERTIF_PREFIX}${userId}`, JSON.stringify(items));
  } catch {}
}

export async function fetchUserCertifications(): Promise<CertificationItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';
    const local = getLocalCertifications(userId);
    return local.length > 0 ? local : DEFAULT_STARTER_CERTIFICATIONS;
  } catch {
    return DEFAULT_STARTER_CERTIFICATIONS;
  }
}

export async function saveUserCertification(item: Omit<CertificationItem, 'id' | 'createdAt'>, existingId?: string): Promise<CertificationItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `cert-${Date.now()}`;
  const certItem: CertificationItem = {
    ...item,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  const local = getLocalCertifications(userId);
  const filtered = local.filter((c) => c.id !== certItem.id && c.id !== existingId);
  const updated = [certItem, ...filtered];
  setLocalCertifications(updated, userId);
  return certItem;
}

export async function deleteUserCertification(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const local = getLocalCertifications(userId);
  const filtered = local.filter((c) => c.id !== id);
  setLocalCertifications(filtered, userId);
  return true;
}

// ============================================================================
// PROJETS PERSONNELS (SAVOIR-FAIRE) SERVICE
// ============================================================================

export interface PersonalProjectItem {
  id: string;
  userId?: string;
  title: string;
  category?: string;
  description: string;
  savoirFaire: string[];
  techStack: string[];
  github?: string;
  url?: string;
  imageUrl?: string;
  images?: string[];          // Up to 6 images
  videos?: VideoMediaItem[];  // Up to 2 videos (max 2 min each)
  year?: string;
  status: 'published' | 'draft';
  createdAt?: string;
}

const LOCAL_STORAGE_PERSONAL_PROJ_PREFIX = 'portfoliogen_cvtheque_personal_proj_';

export const DEFAULT_STARTER_PERSONAL_PROJECTS: PersonalProjectItem[] = [
  {
    id: 'perso-001',
    title: 'Edugen',
    category: 'Application Web & IA',
    description: "EduGEN est une application web éducative dynamique qui utilise l'Intelligence Artificielle pour générer des exercices de grammaire anglaise sur mesure. liens : https://edugen-iut.netlify.app/ version hiver: https://iut-edu.netlify.app/",
    savoirFaire: ['Architecture Full-Stack', 'Intégration LLM', 'UI/UX Réactive'],
    techStack: ['React.js', 'Node.js / API LLM', 'Tailwind CSS'],
    github: 'https://github.com/kokou-dussey/edugen-app',
    url: 'https://edugen-iut.netlify.app/',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    year: '2025',
    status: 'published',
  },
  {
    id: 'perso-002',
    title: 'AR Tetris',
    category: 'Réalité Augmentée & Vision',
    description: "AR Tetris est une réinvention moderne du célèbre jeu de puzzle. Superposé au flux vidéo de votre webcam grâce à la réalité augmentée, le jeu se contrôle entièrement à la main via l'intelligence artificielle (MediaPipe).",
    savoirFaire: ['Vision par ordinateur', 'Contrôle gestuel', 'Développement interactif'],
    techStack: ['média pipe', 'html', 'css3'],
    github: 'https://github.com/kokou-dussey/ar-tetris',
    url: 'https://github.com/kokou-dussey/ar-tetris',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    year: '2025',
    status: 'published',
  },
  {
    id: 'perso-003',
    title: 'Station Météo Connectée & Télémétrie ESP32',
    category: 'IoT & Embarqué',
    description: "Conception et programmation d'un module domotique sur microcontrôleur ESP32 relevant température, humidité et pression avec transmission MQTT et affichage OLED.",
    savoirFaire: ['Systèmes embarqués', 'Protocoles IoT', 'Conception électronique'],
    techStack: ['C++', 'ESP32', 'MQTT', 'Node-RED', 'FreeRTOS'],
    github: 'https://github.com/kokou-dussey/esp32-weather-station',
    url: '',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    year: '2024',
    status: 'published',
  },
];

function getLocalPersonalProjects(userId: string = 'guest'): PersonalProjectItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PERSONAL_PROJ_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalPersonalProjects(items: PersonalProjectItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PERSONAL_PROJ_PREFIX}${userId}`, JSON.stringify(items));
  } catch {}
}

export async function fetchUserPersonalProjects(): Promise<PersonalProjectItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';
    const local = getLocalPersonalProjects(userId);
    return local.length > 0 ? local : DEFAULT_STARTER_PERSONAL_PROJECTS;
  } catch {
    return DEFAULT_STARTER_PERSONAL_PROJECTS;
  }
}

export async function saveUserPersonalProject(
  item: Omit<PersonalProjectItem, 'id' | 'createdAt'>,
  existingId?: string
): Promise<PersonalProjectItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `perso-${Date.now()}`;
  const projItem: PersonalProjectItem = {
    ...item,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  const local = getLocalPersonalProjects(userId);
  const filtered = local.filter((p) => p.id !== projItem.id && p.id !== existingId);
  const updated = [projItem, ...filtered];
  setLocalPersonalProjects(updated, userId);
  return projItem;
}

export async function deleteUserPersonalProject(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const local = getLocalPersonalProjects(userId);
  const filtered = local.filter((p) => p.id !== id);
  setLocalPersonalProjects(filtered, userId);
  return true;
}

// ============================================================================
// STUDIO CRÉATIF (SAVOIR-ÊTRE) SERVICE
// ============================================================================

export interface CreativeStudioItem {
  id: string;
  userId?: string;
  title: string;
  category?: string;
  description: string;
  softSkills: string[];
  mediaType: 'video' | 'image' | 'audio' | 'article';
  mediaUrl?: string;
  thumbnailUrl?: string;
  images?: string[];          // Up to 6 images
  videos?: VideoMediaItem[];  // Up to 2 videos (max 2 min each)
  role?: string;
  year?: string;
  status: 'published' | 'draft';
  createdAt?: string;
}

const LOCAL_STORAGE_CREATIVE_PREFIX = 'portfoliogen_cvtheque_creative_';

export const DEFAULT_STARTER_CREATIVE_STUDIO: CreativeStudioItem[] = [
  {
    id: 'creat-001',
    title: 'Hedy Lamarr',
    category: 'Culture Scientifique & Vidéo',
    description: 'durant un cours de culture et communication, on a eu à faire une vidéo sur une figure qui a révolutionné la science.',
    softSkills: ['science', 'Hedy Lamarr', 'recherche'],
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    mediaUrl: 'https://youtube.com',
    role: 'Coordinateur & Monteur',
    year: '2025',
    status: 'published',
  },
  {
    id: 'creat-002',
    title: 'GYM ADS',
    category: 'Communication en Anglais',
    description: "Il s'agit d'une vidéo réalisée en cours d'anglais.",
    softSkills: ['fitness', 'sport', 'anglais'],
    mediaType: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
    mediaUrl: 'https://youtube.com',
    role: 'Concepteur & Acteur',
    year: '2025',
    status: 'published',
  },
  {
    id: 'creat-003',
    title: 'Guide Visuel & Infographie de Prévention des Risques Électriques',
    category: 'Infographie & Pédagogie',
    description: "Conception graphique d'une série de fiches pédagogiques claires et illustrées destinées aux étudiants découvrant les bancs d'essai haute tension en atelier de génie électrique.",
    softSkills: ['Sens de la pédagogie', 'Communication visuelle', 'Rigueur normative', 'Empathie utilisateur'],
    mediaType: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80',
    mediaUrl: '',
    role: 'Concepteur visuel & Rédacteur',
    year: '2024',
    status: 'published',
  },
];

function getLocalCreativeStudio(userId: string = 'guest'): CreativeStudioItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_CREATIVE_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setLocalCreativeStudio(items: CreativeStudioItem[], userId: string = 'guest') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_CREATIVE_PREFIX}${userId}`, JSON.stringify(items));
  } catch {}
}

export async function fetchUserCreativeStudioItems(): Promise<CreativeStudioItem[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';
    const local = getLocalCreativeStudio(userId);
    return local.length > 0 ? local : DEFAULT_STARTER_CREATIVE_STUDIO;
  } catch {
    return DEFAULT_STARTER_CREATIVE_STUDIO;
  }
}

export async function saveUserCreativeStudioItem(
  item: Omit<CreativeStudioItem, 'id' | 'createdAt'>,
  existingId?: string
): Promise<CreativeStudioItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const newId = existingId || `creat-${Date.now()}`;
  const creatItem: CreativeStudioItem = {
    ...item,
    id: newId,
    userId: user?.id,
    createdAt: new Date().toISOString(),
  };

  const local = getLocalCreativeStudio(userId);
  const filtered = local.filter((c) => c.id !== creatItem.id && c.id !== existingId);
  const updated = [creatItem, ...filtered];
  setLocalCreativeStudio(updated, userId);
  return creatItem;
}

export async function deleteUserCreativeStudioItem(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';

  const local = getLocalCreativeStudio(userId);
  const filtered = local.filter((c) => c.id !== id);
  setLocalCreativeStudio(filtered, userId);
  return true;
}



