'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyLogoAlt: string;
  location: string;
  remote: 'remote' | 'hybrid' | 'onsite';
  contract: 'CDI' | 'CDD' | 'Freelance' | 'Stage';
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  expMin: number;
  expMax: number;
  domain: string;
  postedAt: string;
  applications: number;
  portfolioMatch: number;
  description: string;
  featured: boolean;
  new: boolean;
}

const JOBS: Job[] = [
{
  id: '1',
  title: 'Senior Full-Stack Engineer',
  company: 'Mistral AI',
  companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_1008c0941-1773169619191.png",
  companyLogoAlt: 'Mistral AI company logo, abstract neural network',
  location: 'Paris, France',
  remote: 'hybrid',
  contract: 'CDI',
  salaryMin: 75000,
  salaryMax: 95000,
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  expMin: 5,
  expMax: 10,
  domain: 'Engineering',
  postedAt: 'Il y a 2 jours',
  applications: 12,
  portfolioMatch: 94,
  description: 'Rejoignez notre équipe produit pour construire la prochaine génération de notre plateforme SaaS. Vous travaillerez sur des défis techniques passionnants avec une équipe de 8 ingénieurs.',
  featured: true,
  new: false
},
{
  id: '2',
  title: 'Lead AI/ML Engineer',
  company: 'Hugging Face',
  companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_4164a1c78-1791278113913.png",
  companyLogoAlt: 'Hugging Face company logo, AI research company',
  location: 'Remote',
  remote: 'remote',
  contract: 'CDI',
  salaryMin: 90000,
  salaryMax: 120000,
  skills: ['Python', 'PyTorch', 'LLMs', 'MLOps'],
  expMin: 6,
  expMax: 12,
  domain: 'Data & AI',
  postedAt: 'Il y a 1 jour',
  applications: 8,
  portfolioMatch: 87,
  description: 'Développez et déployez des modèles de langage avancés. Vous serez responsable de l\'architecture MLOps et du fine-tuning de LLMs pour nos clients enterprise.',
  featured: true,
  new: true
},
{
  id: '3',
  title: 'Product Designer UX',
  company: 'Figma',
  companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_4926ca8e4-1791278114068.png",
  companyLogoAlt: 'Figma company logo, design tool company',
  location: 'Lyon, France',
  remote: 'hybrid',
  contract: 'CDI',
  salaryMin: 55000,
  salaryMax: 70000,
  skills: ['Figma', 'UX Research', 'Design System', 'Prototyping'],
  expMin: 3,
  expMax: 7,
  domain: 'Design',
  postedAt: 'Il y a 3 jours',
  applications: 21,
  portfolioMatch: 78,
  description: 'Créez des expériences utilisateur exceptionnelles pour notre application mobile. Vous travaillerez en étroite collaboration avec les équipes produit et engineering.',
  featured: false,
  new: false
},
{
  id: '4',
  title: 'DevOps Engineer',
  company: 'OVHcloud',
  companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_44b1580e7-1791278114268.png",
  companyLogoAlt: 'OVHcloud company logo, cloud infrastructure provider',
  location: 'Roubaix, France',
  remote: 'hybrid',
  contract: 'CDI',
  salaryMin: 60000,
  salaryMax: 80000,
  skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
  expMin: 4,
  expMax: 8,
  domain: 'Infrastructure',
  postedAt: 'Il y a 5 jours',
  applications: 6,
  portfolioMatch: 65,
  description: 'Gérez et optimisez notre infrastructure cloud à grande échelle. Vous serez responsable de la fiabilité et de la performance de nos services pour 1M+ clients.',
  featured: false,
  new: false
},
{
  id: '5',
  title: 'Frontend Engineer',
  company: 'Doctolib',
  companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_4e84abbdb-1791278113599.png",
  companyLogoAlt: 'Doctolib company logo, healthcare platform',
  location: 'Paris, France',
  remote: 'hybrid',
  contract: 'CDI',
  salaryMin: 55000,
  salaryMax: 75000,
  skills: ['React', 'TypeScript', 'GraphQL', 'Testing'],
  expMin: 3,
  expMax: 6,
  domain: 'Engineering',
  postedAt: 'Il y a 1 semaine',
  applications: 34,
  portfolioMatch: 91,
  description: 'Construisez des interfaces performantes pour notre plateforme de santé utilisée par 60M de patients. Vous rejoindrez une équipe frontend de 15 ingénieurs.',
  featured: false,
  new: false
},
{
  id: '6',
  title: 'Data Scientist',
  company: 'BlaBlaCar',
  companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_486a0e3e7-1791278114328.png",
  companyLogoAlt: 'BlaBlaCar company logo, ride sharing platform',
  location: 'Paris, France',
  remote: 'remote',
  contract: 'CDI',
  salaryMin: 65000,
  salaryMax: 85000,
  skills: ['Python', 'SQL', 'Spark', 'Machine Learning'],
  expMin: 3,
  expMax: 7,
  domain: 'Data & AI',
  postedAt: 'Il y a 4 jours',
  applications: 15,
  portfolioMatch: 72,
  description: 'Analysez les données de 100M+ utilisateurs pour améliorer nos algorithmes de matching et de pricing. Vous travaillerez sur des problèmes de ML à grande échelle.',
  featured: false,
  new: true
}];


const DOMAINS = ['Tous', 'Engineering', 'Data & AI', 'Design', 'Infrastructure', 'Product'];
const CONTRACTS = ['Tous', 'CDI', 'CDD', 'Freelance', 'Stage'];
const REMOTE_OPTIONS = ['Tous', 'remote', 'hybrid', 'onsite'];
const REMOTE_LABELS: Record<string, string> = { remote: 'Full Remote', hybrid: 'Hybride', onsite: 'Présentiel', Tous: 'Tous' };

const MATCH_COLOR = (score: number) => {
  if (score >= 90) return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
  if (score >= 75) return 'text-violet-600 bg-violet-500/10 border-violet-500/20';
  if (score >= 60) return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
  return 'text-muted-foreground bg-muted border-border';
};

export default function JobDiscoveryContent() {
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('Tous');
  const [contract, setContract] = useState('Tous');
  const [remote, setRemote] = useState('Tous');
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'salary'>('match');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = JOBS.filter((j) => {
      const q = search.toLowerCase();
      const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.some((s) => s.toLowerCase().includes(q));
      const matchDomain = domain === 'Tous' || j.domain === domain;
      const matchContract = contract === 'Tous' || j.contract === contract;
      const matchRemote = remote === 'Tous' || j.remote === remote;
      return matchSearch && matchDomain && matchContract && matchRemote;
    });
    if (sortBy === 'match') result = [...result].sort((a, b) => b.portfolioMatch - a.portfolioMatch);
    if (sortBy === 'recent') result = [...result].sort((a, b) => a.postedAt.localeCompare(b.postedAt));
    if (sortBy === 'salary') result = [...result].sort((a, b) => b.salaryMax - a.salaryMax);
    return result;
  }, [search, domain, contract, remote, sortBy]);

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero search bar */}
      <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-800 mb-1">Trouvez votre prochain poste</h1>
          <p className="text-violet-200 text-sm mb-5">Postulez directement avec votre portfolio — pas de CV, pas de lettre de motivation générique.</p>
          <div className="relative">
            <Icon name="SearchIcon" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Titre, compétence, entreprise..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-foreground text-sm font-500 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/40 shadow-lg" />
            
          </div>
        </div>
        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/20">
          {[
          { label: 'Offres actives', value: `${JOBS.length}` },
          { label: 'Entreprises', value: '48' },
          { label: 'Candidatures via portfolio', value: '1 240' },
          { label: 'Taux de réponse', value: '73%' }].
          map((s) =>
          <div key={s.label}>
              <p className="text-xl font-800">{s.value}</p>
              <p className="text-xs text-violet-200">{s.label}</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Domain */}
        <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-1 py-1">
          {DOMAINS.map((d) =>
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${domain === d ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
            
              {d}
            </button>
          )}
        </div>

        {/* Contract */}
        <select
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-600 text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30">
          
          {CONTRACTS.map((c) => <option key={c} value={c}>{c === 'Tous' ? 'Contrat' : c}</option>)}
        </select>

        {/* Remote */}
        <select
          value={remote}
          onChange={(e) => setRemote(e.target.value)}
          className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-600 text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30">
          
          {REMOTE_OPTIONS.map((r) => <option key={r} value={r}>{REMOTE_LABELS[r]}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{filtered.length} offres</span>
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-1 py-1">
            {(['match', 'recent', 'salary'] as const).map((s) =>
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${sortBy === s ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              
                {s === 'match' ? '🎯 Match' : s === 'recent' ? '🕐 Récent' : '💰 Salaire'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Featured banner */}
      {filtered.some((j) => j.featured) &&
      <div>
          <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-3">⭐ Offres à la une</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {filtered.filter((j) => j.featured).map((job) =>
          <FeaturedJobCard key={job.id} job={job} saved={savedJobs.has(job.id)} onSave={() => toggleSave(job.id)} />
          )}
          </div>
          <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-3">Toutes les offres</p>
        </div>
      }

      {/* Job list */}
      <div className="space-y-3">
        {filtered.filter((j) => !j.featured).map((job) =>
        <JobRow key={job.id} job={job} saved={savedJobs.has(job.id)} onSave={() => toggleSave(job.id)} />
        )}
        {filtered.length === 0 &&
        <div className="text-center py-16 text-muted-foreground">
            <Icon name="SearchXIcon" size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-600">Aucune offre ne correspond à vos critères</p>
            <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
          </div>
        }
      </div>
    </div>);

}

function FeaturedJobCard({ job, saved, onSave }: {job: Job;saved: boolean;onSave: () => void;}) {
  return (
    <div className="bg-card border border-violet-500/20 rounded-2xl p-5 hover:shadow-lg hover:border-violet-500/40 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img src={job.companyLogo} alt={job.companyLogoAlt} className="w-12 h-12 rounded-xl object-cover border border-border flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-700 text-foreground text-sm">{job.title}</h3>
              {job.new && <span className="text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Nouveau</span>}
            </div>
            <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
          </div>
        </div>
        <button onClick={onSave} className={`p-2 rounded-xl transition-all ${saved ? 'text-violet-600 bg-violet-500/10' : 'text-muted-foreground hover:text-violet-600 hover:bg-violet-500/10'}`}>
          <Icon name={saved ? 'BookmarkCheckIcon' : 'BookmarkIcon'} size={16} />
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.map((s) =>
        <span key={s} className="text-[10px] font-600 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{s}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Icon name="EuroIcon" size={11} />{job.salaryMin / 1000}–{job.salaryMax / 1000}k€</span>
          <span className="flex items-center gap-1"><Icon name="WifiIcon" size={11} />{REMOTE_LABELS[job.remote]}</span>
          <span className="flex items-center gap-1"><Icon name="ClockIcon" size={11} />{job.postedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-700 px-2.5 py-1 rounded-xl border ${MATCH_COLOR(job.portfolioMatch)}`}>
            🎯 {job.portfolioMatch}% match
          </span>
          <Link
            href={`/jobs/${job.id}`}
            className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-700 hover:bg-violet-700 transition-all">
            
            Postuler
          </Link>
        </div>
      </div>
    </div>);

}

function JobRow({ job, saved, onSave }: {job: Job;saved: boolean;onSave: () => void;}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-violet-500/20 hover:shadow-md transition-all flex items-center gap-4">
      <img src={job.companyLogo} alt={job.companyLogoAlt} className="w-11 h-11 rounded-xl object-cover border border-border flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h3 className="font-700 text-foreground text-sm">{job.title}</h3>
          {job.new && <span className="text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Nouveau</span>}
          <span className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">{job.contract}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{job.company}</span>
          <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={10} />{job.location}</span>
          <span className="flex items-center gap-1"><Icon name="WifiIcon" size={10} />{REMOTE_LABELS[job.remote]}</span>
          <span className="flex items-center gap-1"><Icon name="EuroIcon" size={10} />{job.salaryMin / 1000}–{job.salaryMax / 1000}k€</span>
          <span className="flex items-center gap-1"><Icon name="ClockIcon" size={10} />{job.postedAt}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[11px] font-700 px-2.5 py-1 rounded-xl border hidden sm:inline-flex ${MATCH_COLOR(job.portfolioMatch)}`}>
          🎯 {job.portfolioMatch}%
        </span>
        <button onClick={onSave} className={`p-2 rounded-xl transition-all ${saved ? 'text-violet-600 bg-violet-500/10' : 'text-muted-foreground hover:text-violet-600 hover:bg-violet-500/10'}`}>
          <Icon name={saved ? 'BookmarkCheckIcon' : 'BookmarkIcon'} size={15} />
        </button>
        <Link
          href={`/jobs/${job.id}`}
          className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-700 hover:bg-violet-700 transition-all">
          
          Voir l'offre
        </Link>
      </div>
    </div>);

}