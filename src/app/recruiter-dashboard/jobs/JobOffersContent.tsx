'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  remote: 'remote' | 'hybrid' | 'onsite';
  contract: 'CDI' | 'CDD' | 'Freelance' | 'Stage';
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  expMin: number;
  expMax: number;
  status: 'active' | 'draft' | 'closed';
  applications: number;
  views: number;
  createdAt: string;
  deadline: string;
  description: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Paris, France',
    remote: 'hybrid',
    contract: 'CDI',
    salaryMin: 75000,
    salaryMax: 95000,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    expMin: 5,
    expMax: 10,
    status: 'active',
    applications: 12,
    views: 148,
    createdAt: '28 sept. 2026',
    deadline: '30 oct. 2026',
    description: 'Nous recherchons un ingénieur full-stack senior pour rejoindre notre équipe produit. Vous travaillerez sur notre plateforme SaaS utilisée par 50 000 entreprises en Europe.',
  },
  {
    id: '2',
    title: 'Lead AI/ML Engineer',
    department: 'Data & AI',
    location: 'Remote',
    remote: 'remote',
    contract: 'CDI',
    salaryMin: 90000,
    salaryMax: 120000,
    skills: ['Python', 'PyTorch', 'LLMs', 'MLOps', 'Kubernetes'],
    expMin: 6,
    expMax: 12,
    status: 'active',
    applications: 8,
    views: 203,
    createdAt: '1 oct. 2026',
    deadline: '1 nov. 2026',
    description: 'Rejoignez notre équipe IA pour développer et déployer des modèles de language avancés. Vous serez responsable de l\'architecture MLOps et du fine-tuning de LLMs.',
  },
  {
    id: '3',
    title: 'Product Designer UX',
    department: 'Design',
    location: 'Lyon, France',
    remote: 'hybrid',
    contract: 'CDI',
    salaryMin: 55000,
    salaryMax: 70000,
    skills: ['Figma', 'UX Research', 'Design System', 'Prototyping'],
    expMin: 3,
    expMax: 7,
    status: 'draft',
    applications: 0,
    views: 0,
    createdAt: '5 oct. 2026',
    deadline: '15 nov. 2026',
    description: 'Nous cherchons un designer produit passionné pour créer des expériences utilisateur exceptionnelles sur notre application mobile.',
  },
];

const REMOTE_LABELS = { remote: 'Full Remote', hybrid: 'Hybride', onsite: 'Présentiel' };
const STATUS_CONFIG = {
  active: { label: 'Active', style: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  draft: { label: 'Brouillon', style: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  closed: { label: 'Fermée', style: 'bg-muted text-muted-foreground border-border' },
};

interface JobForm {
  title: string;
  department: string;
  location: string;
  remote: string;
  contract: string;
  salaryMin: string;
  salaryMax: string;
  expMin: string;
  expMax: string;
  skills: string;
  description: string;
  deadline: string;
}

const EMPTY_FORM: JobForm = {
  title: '', department: '', location: '', remote: 'hybrid', contract: 'CDI',
  salaryMin: '', salaryMax: '', expMin: '', expMax: '', skills: '', description: '', deadline: '',
};

export default function JobOffersContent() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openCreate = () => { setEditingJob(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (job: Job) => {
    setEditingJob(job);
    setForm({
      title: job.title, department: job.department, location: job.location,
      remote: job.remote, contract: job.contract,
      salaryMin: String(job.salaryMin), salaryMax: String(job.salaryMax),
      expMin: String(job.expMin), expMax: String(job.expMax),
      skills: job.skills.join(', '), description: job.description, deadline: job.deadline,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (editingJob) {
      setJobs((prev) => prev.map((j) => j.id === editingJob.id ? {
        ...j, title: form.title, department: form.department, location: form.location,
        remote: form.remote as any, contract: form.contract as any,
        salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax),
        expMin: Number(form.expMin), expMax: Number(form.expMax),
        skills, description: form.description, deadline: form.deadline,
      } : j));
    } else {
      setJobs((prev) => [{
        id: String(Date.now()), title: form.title, department: form.department,
        location: form.location, remote: form.remote as any, contract: form.contract as any,
        salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax),
        skills, expMin: Number(form.expMin), expMax: Number(form.expMax),
        status: 'draft', applications: 0, views: 0,
        createdAt: 'Aujourd\'hui', deadline: form.deadline, description: form.description,
      }, ...prev]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setJobs((prev) => prev.map((j) => j.id === id ? {
      ...j, status: j.status === 'active' ? 'draft' : 'active',
    } : j));
  };

  const deleteJob = (id: string) => setJobs((prev) => prev.filter((j) => j.id !== id));

  const activeCount = jobs.filter((j) => j.status === 'active').length;
  const totalApps = jobs.reduce((sum, j) => sum + j.applications, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-800 text-foreground">Offres d'emploi</h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-600 text-foreground">{activeCount}</span> offres actives ·{' '}
            <span className="font-600 text-foreground">{totalApps}</span> candidatures reçues
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all"
        >
          <Icon name="PlusIcon" size={15} />
          Publier une offre
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Offres actives', value: activeCount, icon: 'BriefcaseIcon', color: 'text-violet-600', bg: 'bg-violet-500/10' },
          { label: 'Total candidatures', value: totalApps, icon: 'UsersIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Vues totales', value: jobs.reduce((s, j) => s + j.views, 0), icon: 'EyeIcon', color: 'text-sky-600', bg: 'bg-sky-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat.icon as any} size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-800 text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-violet-500/20 transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-700 text-foreground">{job.title}</h3>
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full border ${STATUS_CONFIG[job.status].style}`}>
                      {STATUS_CONFIG[job.status].label}
                    </span>
                    <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                      {job.contract}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Icon name="BuildingIcon" size={11} />{job.department}</span>
                    <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={11} />{job.location}</span>
                    <span className="flex items-center gap-1"><Icon name="WifiIcon" size={11} />{REMOTE_LABELS[job.remote]}</span>
                    <span className="flex items-center gap-1"><Icon name="EuroIcon" size={11} />{job.salaryMin / 1000}–{job.salaryMax / 1000}k€</span>
                    <span className="flex items-center gap-1"><Icon name="BriefcaseIcon" size={11} />{job.expMin}–{job.expMax} ans</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s) => (
                      <span key={s} className="text-[10px] font-600 px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="UsersIcon" size={12} />
                      <span className="font-700 text-foreground">{job.applications}</span> candidatures
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="EyeIcon" size={12} />
                      <span className="font-700 text-foreground">{job.views}</span> vues
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Expire le {job.deadline}</p>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={expandedId === job.id ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={13} />
                  {expandedId === job.id ? 'Masquer' : 'Voir la description'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(job.id)}
                    className={`text-xs font-600 px-3 py-1.5 rounded-lg border transition-all ${
                      job.status === 'active' ?'border-amber-500/30 text-amber-600 hover:bg-amber-500/10' :'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                    }`}
                  >
                    {job.status === 'active' ? 'Mettre en pause' : 'Activer'}
                  </button>
                  <button
                    onClick={() => openEdit(job)}
                    className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-all"
                  >
                    <Icon name="PencilIcon" size={12} />
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                  >
                    <Icon name="TrashIcon" size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded description */}
            {expandedId === job.id && (
              <div className="px-5 pb-5 border-t border-border bg-muted/20">
                <p className="text-sm text-foreground leading-relaxed pt-4">{job.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-modal">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-700 text-foreground">{editingJob ? 'Modifier l\'offre' : 'Publier une nouvelle offre'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Titre du poste *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="ex: Senior Full-Stack Engineer"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Département</label>
                  <input
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="ex: Engineering"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Localisation</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="ex: Paris, France"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Télétravail</label>
                  <select
                    value={form.remote}
                    onChange={(e) => setForm({ ...form, remote: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  >
                    <option value="hybrid">Hybride</option>
                    <option value="remote">Full Remote</option>
                    <option value="onsite">Présentiel</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Type de contrat</label>
                  <select
                    value={form.contract}
                    onChange={(e) => setForm({ ...form, contract: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Stage">Stage</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Salaire min (€/an)</label>
                  <input
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                    placeholder="55000"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Salaire max (€/an)</label>
                  <input
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                    placeholder="75000"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Expérience min (ans)</label>
                  <input
                    type="number"
                    value={form.expMin}
                    onChange={(e) => setForm({ ...form, expMin: e.target.value })}
                    placeholder="3"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Expérience max (ans)</label>
                  <input
                    type="number"
                    value={form.expMax}
                    onChange={(e) => setForm({ ...form, expMax: e.target.value })}
                    placeholder="8"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Compétences requises (séparées par des virgules)</label>
                  <input
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    placeholder="React, TypeScript, Node.js"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Date limite</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Description du poste</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Décrivez le poste, les missions, l'environnement de travail…"
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-600 text-muted-foreground hover:bg-muted transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.title}
                  className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all disabled:opacity-50"
                >
                  {editingJob ? 'Enregistrer' : 'Publier l\'offre'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
