'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import TalentCard, { type Talent } from './TalentCard';
import TalentProfileModal from './TalentProfileModal';
import ContactModal from './ContactModal';

const MOCK_TALENTS: Talent[] = [
{
  id: '1',
  name: 'Alexandre Martin',
  title: 'Senior Full-Stack Engineer',
  location: 'Paris, France',
  availability: 'open',
  portfolioTemplate: 'ClassicCream',
  skills: ['React', 'TypeScript', 'Node.js', 'Go', 'AWS', 'PostgreSQL'],
  experience: 7,
  portfolioViews: 2400,
  cvDownloads: 34,
  lastActive: 'Aujourd\'hui',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a41cb16e-1763291705997.png",
  avatarAlt: 'Alexandre Martin, Senior Full-Stack Engineer, professional headshot',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f43c1ad6-1772084388388.png",
  coverAlt: 'Abstract neural network visualization representing full-stack development',
  salary: '75–90k€',
  verified: true,
  trustScore: 94,
  linkedinRecs: 8,
  credentials: 4,
  bio: 'Ingénieur full-stack avec 7 ans d\'expérience dans des startups tech et scale-ups. Spécialisé dans les architectures distribuées, les APIs haute performance et les interfaces React modernes.',
  topProject: 'Plateforme de streaming temps réel',
  topProjectDesc: 'Architecture microservices traitant 2M d\'événements/jour pour une fintech parisienne. Réduction de la latence de 60%.',
  portfolioUrl: '/public-portfolio-view'
},
{
  id: '2',
  name: 'Léa Fontaine',
  title: 'Product Designer & UX Lead',
  location: 'Lyon, France',
  availability: 'passive',
  portfolioTemplate: 'BentoMinimal',
  skills: ['Figma', 'UX Research', 'Design System', 'Prototyping', 'Framer', 'CSS'],
  experience: 5,
  portfolioViews: 1800,
  cvDownloads: 22,
  lastActive: 'Hier',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_114852fcb-1763297337909.png",
  avatarAlt: 'Léa Fontaine, Product Designer, professional photo in design studio',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_11e1e0c3a-1771908185364.png",
  coverAlt: 'Modern design workspace with colorful UI components and wireframes',
  salary: '55–70k€',
  verified: true,
  trustScore: 88,
  linkedinRecs: 6,
  credentials: 3,
  bio: 'Designer produit passionnée par la création d\'expériences utilisateur mémorables. J\'ai conçu des design systems pour des équipes de 50+ designers et des produits utilisés par des millions d\'utilisateurs.',
  topProject: 'Design System Figma Enterprise',
  topProjectDesc: 'Création d\'un design system complet pour une scale-up SaaS : 400+ composants, documentation complète, adoption par 3 équipes produit.',
  portfolioUrl: '/public-portfolio-view'
},
{
  id: '3',
  name: 'Karim Benali',
  title: 'AI/ML Engineer',
  location: 'Remote (Marseille)',
  availability: 'open',
  portfolioTemplate: 'Dark Tech',
  skills: ['Python', 'PyTorch', 'LLMs', 'MLOps', 'Kubernetes', 'FastAPI'],
  experience: 6,
  portfolioViews: 3100,
  cvDownloads: 47,
  lastActive: 'Il y a 2h',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d5a9bce8-1773173377682.png",
  avatarAlt: 'Karim Benali, AI/ML Engineer, professional photo with dark background',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1104a0f2a-1772791468229.png",
  coverAlt: 'Dark terminal interface showing AI model training metrics and neural network visualization',
  salary: '80–100k€',
  verified: true,
  trustScore: 97,
  linkedinRecs: 11,
  credentials: 5,
  bio: 'Ingénieur ML spécialisé dans le fine-tuning de LLMs et le déploiement de modèles en production. Contributeur open-source actif sur Hugging Face. Ancien chercheur à l\'INRIA.',
  topProject: 'LLM fine-tuning pipeline',
  topProjectDesc: 'Pipeline de fine-tuning de LLaMA-3 pour un cas d\'usage légal. Réduction des hallucinations de 73% par rapport au modèle de base. Déployé sur 50k utilisateurs.',
  portfolioUrl: '/public-portfolio-view'
},
{
  id: '4',
  name: 'Sophie Durand',
  title: 'DevOps & Cloud Architect',
  location: 'Bordeaux, France',
  availability: 'passive',
  portfolioTemplate: 'Éditorial Bold',
  skills: ['Terraform', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'],
  experience: 9,
  portfolioViews: 1200,
  cvDownloads: 18,
  lastActive: 'Il y a 3j',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_141e51895-1763296519617.png",
  avatarAlt: 'Sophie Durand, DevOps Cloud Architect, professional headshot',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_124c0ba2f-1764669604677.png",
  coverAlt: 'Cloud infrastructure diagram with interconnected services and deployment pipelines',
  salary: '85–105k€',
  verified: true,
  trustScore: 91,
  linkedinRecs: 9,
  credentials: 6,
  bio: 'Architecte cloud avec 9 ans d\'expérience dans la conception d\'infrastructures scalables pour des entreprises du CAC 40. Certifiée AWS Solutions Architect Professional et GCP Professional.',
  topProject: 'Migration cloud CAC 40',
  topProjectDesc: 'Migration d\'une infrastructure on-premise vers AWS pour un groupe bancaire. 200+ services migrés, 0 downtime, économies de 2M€/an.',
  portfolioUrl: '/public-portfolio-view'
},
{
  id: '5',
  name: 'Thomas Petit',
  title: 'Mobile Developer (iOS/Android)',
  location: 'Nantes, France',
  availability: 'open',
  portfolioTemplate: 'BentoMinimal',
  skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase', 'GraphQL'],
  experience: 4,
  portfolioViews: 980,
  cvDownloads: 15,
  lastActive: 'Aujourd\'hui',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f524823e-1763296866186.png",
  avatarAlt: 'Thomas Petit, Mobile Developer, professional photo',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f69208b2-1766925322115.png",
  coverAlt: 'Mobile app development workspace with iOS and Android device mockups',
  salary: '50–65k€',
  verified: false,
  trustScore: 76,
  linkedinRecs: 4,
  credentials: 2,
  bio: 'Développeur mobile passionné, spécialisé dans les apps cross-platform performantes. 12 apps publiées sur l\'App Store et Google Play, dont une avec 500k+ téléchargements.',
  topProject: 'App de fitness 500k téléchargements',
  topProjectDesc: 'Développement complet d\'une app de coaching sportif en React Native. 4.7/5 sur les stores, 500k+ téléchargements, intégration HealthKit/Google Fit.',
  portfolioUrl: '/public-portfolio-view'
},
{
  id: '6',
  name: 'Amira Khelifi',
  title: 'Data Engineer & Analytics',
  location: 'Paris, France',
  availability: 'unavailable',
  portfolioTemplate: 'Dark Tech',
  skills: ['Python', 'Spark', 'dbt', 'Snowflake', 'Airflow', 'SQL'],
  experience: 5,
  portfolioViews: 760,
  cvDownloads: 11,
  lastActive: 'Il y a 1 sem.',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15080aa54-1763299781110.png",
  avatarAlt: 'Amira Khelifi, Data Engineer, professional photo',
  coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_185c372a0-1772818988146.png",
  coverAlt: 'Data pipeline visualization with flowing data streams and analytics dashboards',
  salary: '60–75k€',
  verified: true,
  trustScore: 85,
  linkedinRecs: 5,
  credentials: 3,
  bio: 'Data engineer spécialisée dans la construction de pipelines de données robustes et scalables. Expérience en e-commerce, fintech et media. Passionnée par la data quality et l\'observabilité.',
  topProject: 'Data Platform e-commerce',
  topProjectDesc: 'Construction d\'une data platform traitant 50M d\'événements/jour pour un e-commerçant. Réduction du time-to-insight de 3 jours à 2 heures.',
  portfolioUrl: '/public-portfolio-view'
}];


const SKILL_FILTERS = ['Tous', 'React', 'Python', 'TypeScript', 'Figma', 'AWS', 'ML/AI', 'Mobile', 'DevOps', 'Data'];
const AVAILABILITY_FILTERS = [
{ value: 'all', label: 'Toutes disponibilités' },
{ value: 'open', label: 'Disponible' },
{ value: 'passive', label: 'À l\'écoute' }];

const EXPERIENCE_FILTERS = [
{ value: 'all', label: 'Toute expérience' },
{ value: '0-3', label: '0–3 ans' },
{ value: '4-7', label: '4–7 ans' },
{ value: '8+', label: '8+ ans' }];

const SORT_OPTIONS = [
{ value: 'trust', label: 'Score de confiance' },
{ value: 'views', label: 'Vues portfolio' },
{ value: 'recent', label: 'Récemment actif' }];


export default function RecruiterSpaceContent() {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('Tous');
  const [availFilter, setAvailFilter] = useState('all');
  const [expFilter, setExpFilter] = useState('all');
  const [sortBy, setSortBy] = useState('trust');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [contactTalent, setContactTalent] = useState<Talent | null>(null);

  const filtered = useMemo(() => {
    let result = [...MOCK_TALENTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q)) ||
        t.location.toLowerCase().includes(q)
      );
    }

    if (skillFilter !== 'Tous') {
      const map: Record<string, string[]> = {
        'ML/AI': ['Python', 'PyTorch', 'LLMs', 'MLOps'],
        Mobile: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
        DevOps: ['Terraform', 'Docker', 'Kubernetes', 'CI/CD'],
        Data: ['Spark', 'dbt', 'Snowflake', 'Airflow', 'SQL']
      };
      const targets = map[skillFilter] || [skillFilter];
      result = result.filter((t) => targets.some((s) => t.skills.includes(s)));
    }

    if (availFilter !== 'all') {
      result = result.filter((t) => t.availability === availFilter);
    }

    if (expFilter !== 'all') {
      if (expFilter === '0-3') result = result.filter((t) => t.experience <= 3);else
      if (expFilter === '4-7') result = result.filter((t) => t.experience >= 4 && t.experience <= 7);else
      if (expFilter === '8+') result = result.filter((t) => t.experience >= 8);
    }

    if (sortBy === 'trust') result.sort((a, b) => b.trustScore - a.trustScore);else
    if (sortBy === 'views') result.sort((a, b) => b.portfolioViews - a.portfolioViews);else
    if (sortBy === 'recent') result.sort((a, b) => a.lastActive > b.lastActive ? -1 : 1);

    return result;
  }, [search, skillFilter, availFilter, expFilter, sortBy]);

  const openCount = MOCK_TALENTS.filter((t) => t.availability === 'open').length;
  const verifiedCount = MOCK_TALENTS.filter((t) => t.verified).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon name="SearchIcon" size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-800 text-foreground">Espace Recruteurs</h1>
            <p className="text-sm text-muted-foreground">Découvrez les talents via leurs portfolios — pas des CVs classiques</p>
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
        { label: 'Talents disponibles', value: openCount, icon: 'UserCheckIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
        { label: 'Profils vérifiés', value: verifiedCount, icon: 'ShieldCheckIcon', color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Portfolios actifs', value: MOCK_TALENTS.length, icon: 'FolderOpenIcon', color: 'text-amber-600', bg: 'bg-amber-500/10' },
        { label: 'Vues ce mois', value: '12.4K', icon: 'EyeIcon', color: 'text-sky-600', bg: 'bg-sky-500/10' }].
        map((stat) =>
        <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat.icon as any} size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-800 text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        )}
      </div>

      {/* Search + filters */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Icon name="SearchIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, compétence, titre, ville..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          
          {search &&
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Icon name="XIcon" size={14} />
            </button>
          }
        </div>

        {/* Skill pills */}
        <div className="flex flex-wrap gap-2">
          {SKILL_FILTERS.map((skill) =>
          <button
            key={skill}
            onClick={() => setSkillFilter(skill)}
            className={`text-xs font-600 px-3 py-1.5 rounded-xl border transition-all ${
            skillFilter === skill ?
            'bg-primary text-primary-foreground border-primary' :
            'bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`
            }>
            
              {skill}
            </button>
          )}
        </div>

        {/* Row 2: dropdowns + sort + view toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            className="text-xs font-600 px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
            
            {AVAILABILITY_FILTERS.map((f) =>
            <option key={f.value} value={f.value}>{f.label}</option>
            )}
          </select>

          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value)}
            className="text-xs font-600 px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
            
            {EXPERIENCE_FILTERS.map((f) =>
            <option key={f.value} value={f.value}>{f.label}</option>
            )}
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-600 px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
              
              {SORT_OPTIONS.map((o) =>
              <option key={o.value} value={o.value}>{o.label}</option>
              )}
            </select>

            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                
                <Icon name="LayoutGridIcon" size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                
                <Icon name="ListIcon" size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-700 text-foreground">{filtered.length}</span> talent{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          {search && <span> pour « <span className="font-600 text-foreground">{search}</span> »</span>}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Icon name="InfoIcon" size={12} />
          Portfolios complets — CV inclus dans chaque profil
        </p>
      </div>

      {/* Talent grid / list */}
      {filtered.length === 0 ?
      <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon name="SearchXIcon" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-700 text-foreground mb-2">Aucun talent trouvé</h3>
          <p className="text-sm text-muted-foreground mb-4">Essayez d'ajuster vos filtres ou votre recherche</p>
          <button
          onClick={() => {setSearch('');setSkillFilter('Tous');setAvailFilter('all');setExpFilter('all');}}
          className="px-4 py-2 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-all">
          
            Réinitialiser les filtres
          </button>
        </div> :
      viewMode === 'grid' ?
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((talent) =>
        <TalentCard
          key={talent.id}
          talent={talent}
          onViewProfile={setSelectedTalent}
          onContact={setContactTalent} />

        )}
        </div> :

      <div className="space-y-3">
          {filtered.map((talent) =>
        <div key={talent.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/20 hover:shadow-card transition-all">
              <div className="relative flex-shrink-0">
                <img src={talent.avatar} alt={talent.avatarAlt} className="w-12 h-12 rounded-xl object-cover" />
                {talent.verified &&
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="CheckIcon" size={9} className="text-primary-foreground" />
                  </span>
            }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-700 text-sm text-foreground">{talent.name}</h3>
                  <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full ${
              talent.availability === 'open' ? 'bg-emerald-500/10 text-emerald-600' :
              talent.availability === 'passive' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-500'}`
              }>
                    {talent.availability === 'open' ? 'Disponible' : talent.availability === 'passive' ? 'À l\'écoute' : 'Non dispo'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{talent.title} · {talent.location} · {talent.experience} ans</p>
                <div className="flex flex-wrap gap-1">
                  {talent.skills.slice(0, 5).map((s) =>
              <span key={s} className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
              )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                <div className="text-center hidden md:block">
                  <p className="font-700 text-foreground">{talent.trustScore}%</p>
                  <p>confiance</p>
                </div>
                <div className="text-center hidden md:block">
                  <p className="font-700 text-foreground">{talent.credentials}</p>
                  <p>certifs</p>
                </div>
                <div className="flex gap-2">
                  <button
                onClick={() => setSelectedTalent(talent)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-600 text-foreground hover:bg-muted transition-all">
                
                    <Icon name="FolderOpenIcon" size={13} />
                    Portfolio
                  </button>
                  <button
                onClick={() => setContactTalent(talent)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-600 hover:bg-primary/90 transition-all">
                
                    <Icon name="MessageCircleIcon" size={13} />
                    Contacter
                  </button>
                </div>
              </div>
            </div>
        )}
        </div>
      }

      {/* Modals */}
      {selectedTalent &&
      <TalentProfileModal
        talent={selectedTalent}
        onClose={() => setSelectedTalent(null)}
        onContact={(t) => {setSelectedTalent(null);setContactTalent(t);}} />

      }
      {contactTalent &&
      <ContactModal
        talent={contactTalent}
        onClose={() => setContactTalent(null)} />

      }
    </div>);

}