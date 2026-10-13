import { createClient } from '@/lib/supabase/client';

export interface ProjectKPI {
  label: string;
  value: string;
}

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
  status: 'published' | 'draft';
  kpis?: ProjectKPI[];
  isFeatured?: boolean;
  createdAt?: string;
}

const LOCAL_STORAGE_KEY_PREFIX = 'portfoliogen_cvtheque_projects_';

export const DEFAULT_STARTER_PROJECTS: ProjectItem[] = [
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
