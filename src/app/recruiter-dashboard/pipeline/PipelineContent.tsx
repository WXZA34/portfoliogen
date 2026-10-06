'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface Candidate {
  id: string;
  name: string;
  title: string;
  avatar: string;
  alt: string;
  job: string;
  score: number;
  skills: string[];
  salary: string;
  appliedAt: string;
  linkedinRecs: number;
  credentials: number;
  coverNote: string;
}

type Stage = 'new' | 'reviewing' | 'shortlisted' | 'interview' | 'offer' | 'hired';

interface Pipeline {
  [key: string]: Candidate[];
}

const STAGES: {id: Stage;label: string;color: string;bg: string;border: string;icon: string;}[] = [
{ id: 'new', label: 'Nouvelles', color: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-border', icon: 'InboxIcon' },
{ id: 'reviewing', label: 'En cours', color: 'text-sky-600', bg: 'bg-sky-500/5', border: 'border-sky-500/20', icon: 'SearchIcon' },
{ id: 'shortlisted', label: 'Présélectionnés', color: 'text-violet-600', bg: 'bg-violet-500/5', border: 'border-violet-500/20', icon: 'StarIcon' },
{ id: 'interview', label: 'Entretiens', color: 'text-amber-600', bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: 'CalendarIcon' },
{ id: 'offer', label: 'Offre envoyée', color: 'text-emerald-600', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: 'SendIcon' },
{ id: 'hired', label: 'Recrutés', color: 'text-green-600', bg: 'bg-green-500/5', border: 'border-green-500/20', icon: 'CheckCircleIcon' }];


const INITIAL_PIPELINE: Pipeline = {
  new: [
  {
    id: 'c1',
    name: 'Thomas Petit',
    title: 'Mobile Developer',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f524823e-1763296866186.png',
    alt: 'Thomas Petit, Mobile Developer',
    job: 'Senior Full-Stack Engineer',
    score: 76,
    skills: ['Swift', 'Kotlin', 'React Native'],
    salary: '50–65k€',
    appliedAt: '2 oct.',
    linkedinRecs: 4,
    credentials: 2,
    coverNote: 'Bien que spécialisé mobile, j\'ai une solide expérience React Native.'
  },
  {
    id: 'c2',
    name: 'Marc Leblanc',
    title: 'Data Engineer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_150ac05d3-1768204091448.png",
    alt: 'Marc Leblanc, Data Engineer',
    job: 'Lead AI/ML Engineer',
    score: 83,
    skills: ['Python', 'Spark', 'dbt'],
    salary: '55–75k€',
    appliedAt: '5 oct.',
    linkedinRecs: 5,
    credentials: 3,
    coverNote: 'Spécialiste data pipeline, 10M événements/jour en production.'
  }],

  reviewing: [
  {
    id: 'c3',
    name: 'Léa Fontaine',
    title: 'Product Designer',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png',
    alt: 'Léa Fontaine, Product Designer',
    job: 'Product Designer UX',
    score: 88,
    skills: ['Figma', 'UX Research', 'Design System'],
    salary: '55–70k€',
    appliedAt: '5 oct.',
    linkedinRecs: 6,
    credentials: 3,
    coverNote: 'Design system de 400+ composants pour une scale-up SaaS.'
  }],

  shortlisted: [
  {
    id: 'c4',
    name: 'Alexandre Martin',
    title: 'Senior Full-Stack Engineer',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png',
    alt: 'Alexandre Martin, Senior Full-Stack Engineer',
    job: 'Senior Full-Stack Engineer',
    score: 94,
    skills: ['React', 'TypeScript', 'Go'],
    salary: '75–95k€',
    appliedAt: '4 oct.',
    linkedinRecs: 8,
    credentials: 4,
    coverNote: 'Architecte de plateformes SaaS à fort trafic.'
  }],

  interview: [
  {
    id: 'c5',
    name: 'Karim Benali',
    title: 'AI/ML Engineer',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_13722b405-1786134143015.png',
    alt: 'Karim Benali, AI/ML Engineer',
    job: 'Lead AI/ML Engineer',
    score: 97,
    skills: ['Python', 'PyTorch', 'LLMs'],
    salary: '80–100k€',
    appliedAt: '3 oct.',
    linkedinRecs: 11,
    credentials: 5,
    coverNote: 'Ancien chercheur INRIA, -73% d\'hallucinations sur LLaMA-3.'
  }],

  offer: [],
  hired: []
};

export default function PipelineContent() {
  const [pipeline, setPipeline] = useState<Pipeline>(INITIAL_PIPELINE);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragFromStage, setDragFromStage] = useState<Stage | null>(null);
  const [filterJob, setFilterJob] = useState('all');

  const allJobs = ['all', 'Senior Full-Stack Engineer', 'Lead AI/ML Engineer', 'Product Designer UX'];

  const getFilteredPipeline = () => {
    if (filterJob === 'all') return pipeline;
    const filtered: Pipeline = {};
    STAGES.forEach(({ id }) => {
      filtered[id] = pipeline[id].filter((c) => c.job === filterJob);
    });
    return filtered;
  };

  const filteredPipeline = getFilteredPipeline();
  const totalCandidates = Object.values(pipeline).flat().length;

  const moveCandidate = (candidateId: string, fromStage: Stage, toStage: Stage) => {
    if (fromStage === toStage) return;
    const candidate = pipeline[fromStage].find((c) => c.id === candidateId);
    if (!candidate) return;
    setPipeline((prev) => ({
      ...prev,
      [fromStage]: prev[fromStage].filter((c) => c.id !== candidateId),
      [toStage]: [...prev[toStage], candidate]
    }));
  };

  const handleDragStart = (candidateId: string, stage: Stage) => {
    setDraggedId(candidateId);
    setDragFromStage(stage);
  };

  const handleDrop = (toStage: Stage) => {
    if (draggedId && dragFromStage) {
      moveCandidate(draggedId, dragFromStage, toStage);
    }
    setDraggedId(null);
    setDragFromStage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-800 text-foreground">Pipeline de candidatures</h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-600 text-foreground">{totalCandidates}</span> candidats · Glissez-déposez pour changer le statut
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all">
            
            {allJobs.map((j) =>
            <option key={j} value={j}>{j === 'all' ? 'Toutes les offres' : j}</option>
            )}
          </select>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const candidates = filteredPipeline[stage.id] || [];
          return (
            <div
              key={stage.id}
              className={`flex-shrink-0 w-64 rounded-2xl border ${stage.border} ${stage.bg} flex flex-col`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}>
              
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Icon name={stage.icon as any} size={14} className={stage.color} />
                  <span className={`text-xs font-700 ${stage.color}`}>{stage.label}</span>
                </div>
                <span className={`text-[10px] font-800 w-5 h-5 rounded-full flex items-center justify-center ${
                candidates.length > 0 ? `${stage.bg} ${stage.color} border ${stage.border}` : 'bg-muted text-muted-foreground'}`
                }>
                  {candidates.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 min-h-32">
                {candidates.map((candidate) =>
                <div
                  key={candidate.id}
                  draggable
                  onDragStart={() => handleDragStart(candidate.id, stage.id)}
                  onClick={() => setSelectedCandidate(candidate)}
                  className="bg-card border border-border rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-violet-500/30 hover:shadow-sm transition-all group">
                  
                    <div className="flex items-center gap-2 mb-2">
                      <img src={candidate.avatar} alt={candidate.alt} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-700 text-foreground truncate">{candidate.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{candidate.title}</p>
                      </div>
                      <span className="text-xs font-800 text-foreground flex-shrink-0">{candidate.score}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2 truncate">
                      <Icon name="BriefcaseIcon" size={9} className="inline mr-0.5" />
                      {candidate.job}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {candidate.skills.slice(0, 2).map((s) =>
                    <span key={s} className="text-[9px] font-600 px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                          {s}
                        </span>
                    )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{candidate.salary}</span>
                      <span className="flex items-center gap-1">
                        <Icon name="AwardIcon" size={9} />{candidate.credentials}
                        <Icon name="ThumbsUpIcon" size={9} className="ml-1" />{candidate.linkedinRecs}
                      </span>
                    </div>

                    {/* Quick move buttons */}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {STAGES.filter((s) => s.id !== stage.id).slice(0, 2).map((targetStage) =>
                    <button
                      key={targetStage.id}
                      onClick={(e) => {e.stopPropagation();moveCandidate(candidate.id, stage.id, targetStage.id);}}
                      className={`flex-1 text-[9px] font-600 py-1 rounded-lg border ${targetStage.border} ${targetStage.color} hover:${targetStage.bg} transition-all`}>
                      
                          → {targetStage.label}
                        </button>
                    )}
                    </div>
                  </div>
                )}

                {candidates.length === 0 &&
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Icon name="InboxIcon" size={20} className="text-muted-foreground/40 mb-2" />
                    <p className="text-[10px] text-muted-foreground">Glissez un candidat ici</p>
                  </div>
                }
              </div>
            </div>);

        })}
      </div>

      {/* Candidate detail modal */}
      {selectedCandidate &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-700 text-foreground">Candidature</h2>
              <button onClick={() => setSelectedCandidate(null)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <img src={selectedCandidate.avatar} alt={selectedCandidate.alt} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-800 text-foreground">{selectedCandidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCandidate.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="font-700 text-foreground">{selectedCandidate.score}% confiance</span>
                    <span>{selectedCandidate.credentials} certifs</span>
                    <span>{selectedCandidate.linkedinRecs} recs</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-3 border border-border">
                <p className="text-xs font-600 text-muted-foreground mb-1">Message de candidature</p>
                <p className="text-sm text-foreground italic">"{selectedCandidate.coverNote}"</p>
              </div>

              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">Compétences</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((s) =>
                <span key={s} className="text-xs font-600 px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground border border-border">
                      {s}
                    </span>
                )}
                </div>
              </div>

              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">Déplacer vers</p>
                <div className="grid grid-cols-3 gap-2">
                  {STAGES.map((stage) =>
                <button
                  key={stage.id}
                  onClick={() => {
                    const currentStage = Object.entries(pipeline).find(([, candidates]) =>
                    candidates.some((c) => c.id === selectedCandidate.id)
                    )?.[0] as Stage;
                    if (currentStage) moveCandidate(selectedCandidate.id, currentStage, stage.id);
                    setSelectedCandidate(null);
                  }}
                  className={`text-xs font-600 py-2 rounded-xl border ${stage.border} ${stage.color} hover:${stage.bg} transition-all`}>
                  
                      {stage.label}
                    </button>
                )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                href="/public-portfolio-view"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-all">
                
                  <Icon name="FolderOpenIcon" size={14} />
                  Portfolio
                </Link>
                <Link
                href="/recruiter-dashboard/messages"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all">
                
                  <Icon name="MessageSquareIcon" size={14} />
                  Contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}