'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  remotePolicy: 'remote' | 'hybrid' | 'onsite';
  contractType: 'cdi' | 'cdd' | 'freelance' | 'stage';
  salaryMin: number;
  salaryMax: number;
  skillsRequired: string[];
  experienceMin: number;
  experienceMax: number;
  status: 'active' | 'draft' | 'closed';
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  deadline: string;
  description: string;
}

const MOCK_JOBS: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Engineer',
    company: 'TechCorp Paris',
    location: 'Paris, France',
    remotePolicy: 'hybrid',
    contractType: 'cdi',
    salaryMin: 75000,
    salaryMax: 95000,
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    experienceMin: 5,
    experienceMax: 10,
    status: 'active',
    applicationsCount: 12,
    viewsCount: 148,
    createdAt: '2026-09-28',
    deadline: '2026-10-30',
    description: 'Nous recherchons un ingénieur full-stack senior pour rejoindre notre équipe produit. Vous travaillerez sur notre plateforme SaaS utilisée par 50 000 entreprises en Europe.',
  },
  {
    id: '2',
    title: 'Lead AI/ML Engineer',
    company: 'DataVision',
    location: 'Remote',
    remotePolicy: 'remote',
    contractType: 'cdi',
    salaryMin: 90000,
    salaryMax: 120000,
    skillsRequired: ['Python', 'PyTorch', 'LLMs', 'MLOps', 'Kubernetes'],
    experienceMin: 6,
    experienceMax: 12,
    status: 'active',
    applicationsCount: 8,
    viewsCount: 203,
    createdAt: '2026-10-01',
    deadline: '2026-11-01',
    description: 'Rejoignez notre équipe IA pour développer et déployer des modèles de language avancés. Vous serez responsable de l\'architecture MLOps et du fine-tuning de LLMs.',
  },
  {
    id: '3',
    title: 'Product Designer UX',
    company: 'StartupLab',
    location: 'Lyon, France',
    remotePolicy: 'hybrid',
    contractType: 'cdi',
    salaryMin: 55000,
    salaryMax: 70000,
    skillsRequired: ['Figma', 'UX Research', 'Design System', 'Prototyping'],
    experienceMin: 3,
    experienceMax: 7,
    status: 'draft',
    applicationsCount: 0,
    viewsCount: 0,
    createdAt: '2026-10-05',
    deadline: '2026-11-15',
    description: 'Nous cherchons un designer produit passionné pour créer des expériences utilisateur exceptionnelles sur notre application mobile.',
  },
];

const CONTRACT_LABELS: Record<string, string> = {
  cdi: 'CDI',
  cdd: 'CDD',
  freelance: 'Freelance',
  stage: 'Stage',
};

const REMOTE_LABELS: Record<string, string> = {
  remote: 'Full Remote',
  hybrid: 'Hybride',
  onsite: 'Présentiel',
};

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  draft: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  closed: 'bg-muted text-muted-foreground border-border',
};

interface JobFormData {
  title: string;
  location: string;
  remotePolicy: string;
  contractType: string;
  salaryMin: string;
  salaryMax: string;
  experienceMin: string;
  experienceMax: string;
  skillsRequired: string;
  description: string;
  deadline: string;
}

const EMPTY_FORM: JobFormData = {
  title: '',
  location: '',
  remotePolicy: 'hybrid',
  contractType: 'cdi',
  salaryMin: '',
  salaryMax: '',
  experienceMin: '',
  experienceMax: '',
  skillsRequired: '',
  description: '',
  deadline: '',
};

export default function JobBoardTab() {
  const [jobs, setJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [form, setForm] = useState<JobFormData>(EMPTY_FORM);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const openCreate = () => {
    setEditingJob(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (job: JobPosting) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      location: job.location,
      remotePolicy: job.remotePolicy,
      contractType: job.contractType,
      salaryMin: String(job.salaryMin),
      salaryMax: String(job.salaryMax),
      experienceMin: String(job.experienceMin),
      experienceMax: String(job.experienceMax),
      skillsRequired: job.skillsRequired.join(', '),
      description: job.description,
      deadline: job.deadline,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const skills = form.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    if (editingJob) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                title: form.title,
                location: form.location,
                remotePolicy: form.remotePolicy as any,
                contractType: form.contractType as any,
                salaryMin: Number(form.salaryMin),
                salaryMax: Number(form.salaryMax),
                experienceMin: Number(form.experienceMin),
                experienceMax: Number(form.experienceMax),
                skillsRequired: skills,
                description: form.description,
                deadline: form.deadline,
              }
            : j
        )
      );
    } else {
      const newJob: JobPosting = {
        id: String(Date.now()),
        title: form.title,
        company: 'Mon Entreprise',
        location: form.location,
        remotePolicy: form.remotePolicy as any,
        contractType: form.contractType as any,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        skillsRequired: skills,
        experienceMin: Number(form.experienceMin),
        experienceMax: Number(form.experienceMax),
        status: 'draft',
        applicationsCount: 0,
        viewsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        deadline: form.deadline,
        description: form.description,
      };
      setJobs((prev) => [newJob, ...prev]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: j.status === 'active' ? 'draft' : 'active' }
          : j
      )
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-600 text-foreground">{jobs.length} offre{jobs.length !== 1 ? 's' : ''}</p>
          <p className="text-xs text-muted-foreground">{jobs.filter((j) => j.status === 'active').length} active{jobs.filter((j) => j.status === 'active').length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 transition-all"
        >
          <Icon name="PlusIcon" size={15} />
          Publier une offre
        </button>
      </div>

      {/* Job list */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-700 text-foreground text-sm">{job.title}</h3>
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full border ${STATUS_STYLES[job.status]}`}>
                      {job.status === 'active' ? 'Active' : job.status === 'draft' ? 'Brouillon' : 'Fermée'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={11} />{job.location}</span>
                    <span className="flex items-center gap-1"><Icon name="WifiIcon" size={11} />{REMOTE_LABELS[job.remotePolicy]}</span>
                    <span className="flex items-center gap-1"><Icon name="FileTextIcon" size={11} />{CONTRACT_LABELS[job.contractType]}</span>
                    <span className="flex items-center gap-1"><Icon name="EuroIcon" size={11} />{(job.salaryMin / 1000).toFixed(0)}–{(job.salaryMax / 1000).toFixed(0)}k€</span>
                    <span className="flex items-center gap-1"><Icon name="ClockIcon" size={11} />{job.experienceMin}–{job.experienceMax} ans</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.skillsRequired.slice(0, 5).map((s) => (
                      <span key={s} className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                    ))}
                    {job.skillsRequired.length > 5 && (
                      <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{job.skillsRequired.length - 5}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(job)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                      title="Modifier"
                    >
                      <Icon name="PencilIcon" size={13} />
                    </button>
                    <button
                      onClick={() => toggleStatus(job.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                      title={job.status === 'active' ? 'Mettre en brouillon' : 'Activer'}
                    >
                      <Icon name={job.status === 'active' ? 'PauseIcon' : 'PlayIcon'} size={13} />
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-negative/10 hover:text-negative transition-all"
                      title="Supprimer"
                    >
                      <Icon name="Trash2Icon" size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="UsersIcon" size={11} />{job.applicationsCount} candidats</span>
                    <span className="flex items-center gap-1"><Icon name="EyeIcon" size={11} />{job.viewsCount} vues</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                <Icon name={expandedJob === job.id ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={12} />
                {expandedJob === job.id ? 'Masquer' : 'Voir la description'}
              </button>
            </div>

            {expandedJob === job.id && (
              <div className="px-4 pb-4 border-t border-border/50 pt-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Icon name="CalendarIcon" size={11} />
                  Date limite : {job.deadline}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-modal">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-700 text-foreground">{editingJob ? 'Modifier l\'offre' : 'Publier une offre d\'emploi'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Titre du poste *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="ex: Senior Full-Stack Engineer"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Localisation</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Paris, France"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Télétravail</label>
                  <select
                    value={form.remotePolicy}
                    onChange={(e) => setForm({ ...form, remotePolicy: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="remote">Full Remote</option>
                    <option value="hybrid">Hybride</option>
                    <option value="onsite">Présentiel</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Type de contrat</label>
                  <select
                    value={form.contractType}
                    onChange={(e) => setForm({ ...form, contractType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="freelance">Freelance</option>
                    <option value="stage">Stage</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Date limite</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Salaire min (€/an)</label>
                  <input
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                    placeholder="55000"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Salaire max (€/an)</label>
                  <input
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                    placeholder="75000"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Expérience min (ans)</label>
                  <input
                    type="number"
                    value={form.experienceMin}
                    onChange={(e) => setForm({ ...form, experienceMin: e.target.value })}
                    placeholder="3"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Expérience max (ans)</label>
                  <input
                    type="number"
                    value={form.experienceMax}
                    onChange={(e) => setForm({ ...form, experienceMax: e.target.value })}
                    placeholder="8"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Compétences requises (séparées par des virgules)</label>
                <input
                  value={form.skillsRequired}
                  onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Description du poste *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title || !form.description}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingJob ? 'Enregistrer' : 'Publier l\'offre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
