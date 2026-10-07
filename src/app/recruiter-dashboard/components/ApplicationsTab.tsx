'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Application {
  id: string;
  candidateName: string;
  candidateTitle: string;
  candidateAvatar: string;
  candidateAvatarAlt: string;
  jobTitle: string;
  appliedAt: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  trustScore: number;
  skills: string[];
  experience: number;
  coverNote: string;
  portfolioUrl: string;
  linkedinRecs: number;
  credentials: number;
  salary: string;
}

const MOCK_APPLICATIONS: Application[] = [
{
  id: '1',
  candidateName: 'Alexandre Martin',
  candidateTitle: 'Senior Full-Stack Engineer',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png",
  candidateAvatarAlt: 'Alexandre Martin, Senior Full-Stack Engineer',
  jobTitle: 'Senior Full-Stack Engineer',
  appliedAt: '2026-10-04',
  status: 'shortlisted',
  trustScore: 94,
  skills: ['React', 'TypeScript', 'Node.js', 'Go', 'AWS'],
  experience: 7,
  coverNote: 'Passionné par les architectures distribuées, j\'ai dirigé plusieurs projets critiques chez des scale-ups parisiennes. Votre mission m\'intéresse particulièrement pour l\'aspect microservices.',
  portfolioUrl: '/public-portfolio-view',
  linkedinRecs: 8,
  credentials: 4,
  salary: '75–90k€'
},
{
  id: '2',
  candidateName: 'Karim Benali',
  candidateTitle: 'AI/ML Engineer',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13722b405-1786134143015.png",
  candidateAvatarAlt: 'Karim Benali, AI/ML Engineer',
  jobTitle: 'Lead AI/ML Engineer',
  appliedAt: '2026-10-03',
  status: 'interview',
  trustScore: 97,
  skills: ['Python', 'PyTorch', 'LLMs', 'MLOps', 'Kubernetes'],
  experience: 6,
  coverNote: 'Ancien chercheur INRIA, j\'ai fine-tuné LLaMA-3 pour un cas légal avec -73% d\'hallucinations. Je suis convaincu que mon profil correspond exactement à vos besoins.',
  portfolioUrl: '/public-portfolio-view',
  linkedinRecs: 11,
  credentials: 5,
  salary: '80–100k€'
},
{
  id: '3',
  candidateName: 'Léa Fontaine',
  candidateTitle: 'Product Designer & UX Lead',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png",
  candidateAvatarAlt: 'Léa Fontaine, Product Designer',
  jobTitle: 'Product Designer UX',
  appliedAt: '2026-10-05',
  status: 'pending',
  trustScore: 88,
  skills: ['Figma', 'UX Research', 'Design System', 'Prototyping'],
  experience: 5,
  coverNote: 'J\'ai créé un design system de 400+ composants pour une scale-up SaaS. La création d\'expériences utilisateur mémorables est ma passion depuis 5 ans.',
  portfolioUrl: '/public-portfolio-view',
  linkedinRecs: 6,
  credentials: 3,
  salary: '55–70k€'
},
{
  id: '4',
  candidateName: 'Thomas Petit',
  candidateTitle: 'Mobile Developer (iOS/Android)',
  candidateAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f524823e-1763296866186.png',
  candidateAvatarAlt: 'Thomas Petit, Mobile Developer',
  jobTitle: 'Senior Full-Stack Engineer',
  appliedAt: '2026-10-02',
  status: 'reviewing',
  trustScore: 76,
  skills: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
  experience: 4,
  coverNote: 'Bien que spécialisé mobile, j\'ai une solide expérience React Native et je souhaite élargir vers le full-stack. Mon app à 500k téléchargements démontre ma capacité à livrer.',
  portfolioUrl: '/public-portfolio-view',
  linkedinRecs: 4,
  credentials: 2,
  salary: '50–65k€'
}];


const STATUS_CONFIG: Record<string, {label: string;style: string;icon: string;}> = {
  pending: { label: 'En attente', style: 'bg-muted text-muted-foreground border-border', icon: 'ClockIcon' },
  reviewing: { label: 'En cours', style: 'bg-sky-500/10 text-sky-600 border-sky-500/20', icon: 'SearchIcon' },
  shortlisted: { label: 'Présélectionné', style: 'bg-primary/10 text-primary border-primary/20', icon: 'StarIcon' },
  interview: { label: 'Entretien', style: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: 'CalendarIcon' },
  rejected: { label: 'Refusé', style: 'bg-negative/10 text-negative border-negative/20', icon: 'XCircleIcon' },
  hired: { label: 'Recruté', style: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: 'CheckCircleIcon' }
};

const STATUS_OPTIONS = ['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'];

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filtered = filterStatus === 'all' ? applications : applications.filter((a) => a.status === filterStatus);

  const updateStatus = (id: string, status: Application['status']) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    if (selectedApp?.id === id) setSelectedApp((prev) => prev ? { ...prev, status } : null);
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`text-xs font-600 px-3 py-1.5 rounded-xl border transition-all ${filterStatus === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/40'}`}>
          
          Toutes ({applications.length})
        </button>
        {STATUS_OPTIONS.map((s) => {
          const count = applications.filter((a) => a.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-600 px-3 py-1.5 rounded-xl border transition-all ${filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/40'}`}>
              
              {STATUS_CONFIG[s].label} ({count})
            </button>);

        })}
      </div>

      {/* Applications list */}
      <div className="space-y-3">
        {filtered.map((app) =>
        <div
          key={app.id}
          className="border border-border rounded-2xl p-4 hover:border-primary/20 transition-all cursor-pointer"
          onClick={() => setSelectedApp(app)}>
          
            <div className="flex items-start gap-3">
              <img
              src={app.candidateAvatar}
              alt={app.candidateAvatarAlt}
              className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
            
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-700 text-sm text-foreground">{app.candidateName}</h3>
                  <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full border ${STATUS_CONFIG[app.status].style}`}>
                    {STATUS_CONFIG[app.status].label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{app.candidateTitle} · {app.experience} ans · {app.salary}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2 italic">"{app.coverNote}"</p>
                <div className="flex flex-wrap gap-1">
                  {app.skills.slice(0, 4).map((s) =>
                <span key={s} className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-700 text-foreground">{app.trustScore}%</span>
                  <span>confiance</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Icon name="AwardIcon" size={10} />{app.credentials}</span>
                  <span className="flex items-center gap-0.5"><Icon name="ThumbsUpIcon" size={10} />{app.linkedinRecs}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{app.appliedAt}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application detail modal */}
      {selectedApp &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-modal">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-700 text-foreground">Candidature — {selectedApp.candidateName}</h2>
              <button onClick={() => setSelectedApp(null)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Candidate header */}
              <div className="flex items-center gap-4">
                <img src={selectedApp.candidateAvatar} alt={selectedApp.candidateAvatarAlt} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-700 text-foreground">{selectedApp.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApp.candidateTitle}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="font-600 text-foreground">{selectedApp.trustScore}% confiance</span>
                    <span>{selectedApp.credentials} certifs</span>
                    <span>{selectedApp.linkedinRecs} recs LinkedIn</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">Compétences</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.skills.map((s) =>
                <span key={s} className="text-xs font-600 px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground">{s}</span>
                )}
                </div>
              </div>

              {/* Cover note */}
              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">Message de candidature</p>
                <div className="bg-muted/50 rounded-xl p-3 border border-border">
                  <p className="text-sm text-foreground leading-relaxed italic">"{selectedApp.coverNote}"</p>
                </div>
              </div>

              {/* Portfolio link */}
              <a
              href={selectedApp.portfolioUrl}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-600 hover:bg-primary/10 transition-all">
              
                <Icon name="FolderOpenIcon" size={15} />
                Voir le portfolio complet (avec CV intégré)
                <Icon name="ArrowRightIcon" size={13} className="ml-auto" />
              </a>

              {/* Status update */}
              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) =>
                <button
                  key={s}
                  onClick={() => updateStatus(selectedApp.id, s as Application['status'])}
                  className={`text-xs font-600 px-3 py-1.5 rounded-xl border transition-all ${
                  selectedApp.status === s ?
                  STATUS_CONFIG[s].style :
                  'bg-background border-border text-muted-foreground hover:border-primary/40'}`
                  }>
                  
                      {STATUS_CONFIG[s].label}
                    </button>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}