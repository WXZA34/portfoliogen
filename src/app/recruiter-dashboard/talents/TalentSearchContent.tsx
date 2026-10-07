'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface Talent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  alt: string;
  location: string;
  remote: boolean;
  experience: number;
  skills: string[];
  score: number;
  linkedinRecs: number;
  credentials: number;
  salary: string;
  availability: 'immediate' | '1month' | '3months' | 'passive';
  portfolioViews: number;
  lastActive: string;
  bio: string;
  contractTypes: string[];
}

const TALENTS: Talent[] = [
{
  id: '1',
  name: 'Karim Benali',
  title: 'Lead AI/ML Engineer',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1276650d3-1763293825965.png",
  alt: 'Karim Benali, Lead AI/ML Engineer',
  location: 'Paris, France',
  remote: true,
  experience: 6,
  skills: ['Python', 'PyTorch', 'LLMs', 'MLOps', 'Kubernetes', 'Fine-tuning'],
  score: 97,
  linkedinRecs: 11,
  credentials: 5,
  salary: '80–100k€',
  availability: 'immediate',
  portfolioViews: 312,
  lastActive: 'Aujourd\'hui',
  bio: 'Ancien chercheur INRIA, spécialisé dans le fine-tuning de LLMs pour des cas d\'usage légaux et médicaux. -73% d\'hallucinations sur LLaMA-3.',
  contractTypes: ['CDI', 'Freelance']
},
{
  id: '2',
  name: 'Alexandre Martin',
  title: 'Senior Full-Stack Engineer',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_150ac05d3-1768204091448.png",
  alt: 'Alexandre Martin, Senior Full-Stack Engineer',
  location: 'Paris, France',
  remote: true,
  experience: 7,
  skills: ['React', 'TypeScript', 'Node.js', 'Go', 'AWS', 'PostgreSQL'],
  score: 94,
  linkedinRecs: 8,
  credentials: 4,
  salary: '75–95k€',
  availability: '1month',
  portfolioViews: 248,
  lastActive: 'Hier',
  bio: 'Architecte de plateformes SaaS à fort trafic. A dirigé des équipes de 8 ingénieurs chez des scale-ups parisiennes. Passionné par les systèmes distribués.',
  contractTypes: ['CDI']
},
{
  id: '3',
  name: 'Léa Fontaine',
  title: 'Product Designer & UX Lead',
  avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png',
  alt: 'Léa Fontaine, Product Designer',
  location: 'Lyon, France',
  remote: true,
  experience: 5,
  skills: ['Figma', 'UX Research', 'Design System', 'Prototyping', 'User Testing'],
  score: 88,
  linkedinRecs: 6,
  credentials: 3,
  salary: '55–70k€',
  availability: '1month',
  portfolioViews: 189,
  lastActive: 'il y a 2j',
  bio: 'Créatrice d\'un design system de 400+ composants pour une scale-up SaaS B2B. Experte en recherche utilisateur et tests d\'usabilité.',
  contractTypes: ['CDI', 'CDD']
},
{
  id: '4',
  name: 'Thomas Petit',
  title: 'Mobile Developer (iOS/Android)',
  avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f524823e-1763296866186.png',
  alt: 'Thomas Petit, Mobile Developer',
  location: 'Bordeaux, France',
  remote: false,
  experience: 4,
  skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase'],
  score: 76,
  linkedinRecs: 4,
  credentials: 2,
  salary: '50–65k€',
  availability: '3months',
  portfolioViews: 134,
  lastActive: 'il y a 5j',
  bio: 'Développeur mobile avec une app à 500k téléchargements sur l\'App Store. Maîtrise iOS natif et cross-platform React Native.',
  contractTypes: ['CDI', 'Freelance']
},
{
  id: '5',
  name: 'Sophie Durand',
  title: 'DevOps & Cloud Engineer',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_193345bfc-1763298578243.png",
  alt: 'Sophie Durand, DevOps Engineer',
  location: 'Remote',
  remote: true,
  experience: 8,
  skills: ['Kubernetes', 'Terraform', 'AWS', 'GCP', 'CI/CD', 'Docker'],
  score: 91,
  linkedinRecs: 9,
  credentials: 6,
  salary: '70–90k€',
  availability: 'passive',
  portfolioViews: 267,
  lastActive: 'il y a 3j',
  bio: 'Architecte cloud certifiée AWS & GCP. A migré 3 infrastructures monolithiques vers des architectures microservices Kubernetes en production.',
  contractTypes: ['CDI', 'Freelance']
},
{
  id: '6',
  name: 'Marc Leblanc',
  title: 'Data Engineer & Analyst',
  avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png',
  alt: 'Marc Leblanc, Data Engineer',
  location: 'Nantes, France',
  remote: true,
  experience: 5,
  skills: ['Python', 'Spark', 'dbt', 'Snowflake', 'Airflow', 'SQL'],
  score: 83,
  linkedinRecs: 5,
  credentials: 3,
  salary: '55–75k€',
  availability: 'immediate',
  portfolioViews: 156,
  lastActive: 'Aujourd\'hui',
  bio: 'Spécialiste data pipeline et analytics. A construit une plateforme de données traitant 10M d\'événements/jour pour un e-commerce leader.',
  contractTypes: ['CDI']
}];


const AVAILABILITY_CONFIG: Record<string, {label: string;style: string;}> = {
  immediate: { label: 'Disponible immédiatement', style: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  '1month': { label: 'Disponible sous 1 mois', style: 'bg-sky-500/10 text-sky-600 border-sky-500/20' },
  '3months': { label: 'Disponible sous 3 mois', style: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  passive: { label: 'À l\'écoute', style: 'bg-muted text-muted-foreground border-border' }
};

const SKILL_FILTERS = ['Tous', 'React', 'Python', 'TypeScript', 'Figma', 'Kubernetes', 'Node.js', 'Swift', 'AWS'];

export default function TalentSearchContent() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('Tous');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = TALENTS.filter((t) => {
    const matchSearch =
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchSkill = selectedSkill === 'Tous' || t.skills.includes(selectedSkill);
    const matchAvail = availabilityFilter === 'all' || t.availability === availabilityFilter;
    const matchRemote = !remoteOnly || t.remote;
    return matchSearch && matchSkill && matchAvail && matchRemote;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-800 text-foreground">Recherche de talents</h1>
          <p className="text-sm text-muted-foreground">
            Découvrez des profils via leurs portfolios — CV, projets et recommandations inclus
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-600">{filtered.length} profils</span>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-all">
            
            <Icon name={viewMode === 'grid' ? 'ListIcon' : 'LayoutGridIcon'} size={15} />
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, titre, compétence…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all" />
            
          </div>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all">
            
            <option value="all">Toute disponibilité</option>
            <option value="immediate">Immédiatement</option>
            <option value="1month">Sous 1 mois</option>
            <option value="3months">Sous 3 mois</option>
            <option value="passive">À l'écoute</option>
          </select>
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background cursor-pointer hover:bg-muted transition-all">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-violet-600" />
            
            <span className="text-sm text-foreground font-500">Remote uniquement</span>
          </label>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2">
          {SKILL_FILTERS.map((skill) =>
          <button
            key={skill}
            onClick={() => setSelectedSkill(skill)}
            className={`text-xs font-600 px-3 py-1.5 rounded-xl border transition-all ${
            selectedSkill === skill ?
            'bg-violet-600 text-white border-violet-600' :
            'bg-background border-border text-muted-foreground hover:border-violet-500/40 hover:text-foreground'}`
            }>
            
              {skill}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
        {filtered.map((talent) =>
        <div
          key={talent.id}
          className="bg-card border border-border rounded-2xl p-5 hover:border-violet-500/30 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => setSelectedTalent(talent)}>
          
            {/* Top row */}
            <div className="flex items-start gap-3 mb-3">
              <div className="relative flex-shrink-0">
                <img src={talent.avatar} alt={talent.alt} className="w-12 h-12 rounded-xl object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-700 text-sm text-foreground truncate">{talent.name}</h3>
                  <span className="text-lg font-800 text-foreground ml-auto flex-shrink-0">{talent.score}%</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{talent.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Icon name="MapPinIcon" size={9} />{talent.location}</span>
                  {talent.remote &&
                <span className="flex items-center gap-0.5 text-emerald-600"><Icon name="WifiIcon" size={9} />Remote</span>
                }
                </div>
              </div>
            </div>

            {/* Availability */}
            <span className={`inline-flex text-[10px] font-700 px-2 py-0.5 rounded-full border mb-3 ${AVAILABILITY_CONFIG[talent.availability].style}`}>
              {AVAILABILITY_CONFIG[talent.availability].label}
            </span>

            {/* Bio */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{talent.bio}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {talent.skills.slice(0, 4).map((s) =>
            <span key={s} className="text-[10px] font-600 px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                  {s}
                </span>
            )}
              {talent.skills.length > 4 &&
            <span className="text-[10px] font-600 px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                  +{talent.skills.length - 4}
                </span>
            }
            </div>

            {/* Footer stats */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Icon name="AwardIcon" size={10} />{talent.credentials} certifs</span>
                <span className="flex items-center gap-1"><Icon name="ThumbsUpIcon" size={10} />{talent.linkedinRecs} recs</span>
                <span className="flex items-center gap-1"><Icon name="EyeIcon" size={10} />{talent.portfolioViews}</span>
              </div>
              <span className="text-[10px] font-600 text-foreground">{talent.salary}</span>
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 &&
      <div className="text-center py-16 border border-border rounded-2xl bg-card">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon name="SearchXIcon" size={24} className="text-muted-foreground" />
          </div>
          <p className="font-700 text-foreground mb-1">Aucun talent trouvé</p>
          <p className="text-sm text-muted-foreground">Modifiez vos filtres pour élargir la recherche</p>
        </div>
      }

      {/* Talent detail modal */}
      {selectedTalent &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-modal">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-700 text-foreground">Profil talent</h2>
              <button
              onClick={() => setSelectedTalent(null)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
              
                <Icon name="XIcon" size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Identity */}
              <div className="flex items-start gap-4">
                <img src={selectedTalent.avatar} alt={selectedTalent.alt} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-800 text-lg text-foreground">{selectedTalent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTalent.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={11} />{selectedTalent.location}</span>
                    <span className="flex items-center gap-1"><Icon name="BriefcaseIcon" size={11} />{selectedTalent.experience} ans d'exp.</span>
                    <span className="flex items-center gap-1"><Icon name="EuroIcon" size={11} />{selectedTalent.salary}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-800 text-foreground">{selectedTalent.score}%</p>
                  <p className="text-xs text-muted-foreground">score confiance</p>
                </div>
              </div>

              {/* Availability */}
              <span className={`inline-flex text-xs font-700 px-3 py-1 rounded-xl border ${AVAILABILITY_CONFIG[selectedTalent.availability].style}`}>
                {AVAILABILITY_CONFIG[selectedTalent.availability].label}
              </span>

              {/* Bio */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">À propos</p>
                <p className="text-sm text-foreground leading-relaxed">{selectedTalent.bio}</p>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Compétences</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTalent.skills.map((s) =>
                <span key={s} className="text-xs font-600 px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground border border-border">
                      {s}
                    </span>
                )}
                </div>
              </div>

              {/* Credentials */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-xl p-3 text-center border border-border">
                  <p className="text-xl font-800 text-foreground">{selectedTalent.credentials}</p>
                  <p className="text-xs text-muted-foreground">Certifications</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center border border-border">
                  <p className="text-xl font-800 text-foreground">{selectedTalent.linkedinRecs}</p>
                  <p className="text-xs text-muted-foreground">Recs LinkedIn</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center border border-border">
                  <p className="text-xl font-800 text-foreground">{selectedTalent.portfolioViews}</p>
                  <p className="text-xs text-muted-foreground">Vues portfolio</p>
                </div>
              </div>

              {/* Contract types */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">Types de contrat</p>
                <div className="flex gap-2">
                  {selectedTalent.contractTypes.map((ct) =>
                <span key={ct} className="text-xs font-600 px-2.5 py-1 rounded-xl bg-violet-500/10 text-violet-600 border border-violet-500/20">
                      {ct}
                    </span>
                )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Link
                href="/public-portfolio-view"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-all">
                
                  <Icon name="FolderOpenIcon" size={15} />
                  Voir le portfolio
                </Link>
                <Link
                href="/recruiter-dashboard/messages"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all">
                
                  <Icon name="MessageSquareIcon" size={15} />
                  Contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}