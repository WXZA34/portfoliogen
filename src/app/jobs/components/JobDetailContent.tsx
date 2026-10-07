'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const JOB_DATA: Record<string, {
  id: string;title: string;company: string;companyLogo: string;companyLogoAlt: string;
  location: string;remote: string;contract: string;salaryMin: number;salaryMax: number;
  skills: string[];expMin: number;expMax: number;domain: string;postedAt: string;
  applications: number;portfolioMatch: number;description: string;responsibilities: string[];
  requirements: string[];benefits: string[];teamSize: string;stack: string[];
}> = {
  '1': {
    id: '1', title: 'Senior Full-Stack Engineer', company: 'Mistral AI',
    companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_1008c0941-1773169619191.png",
    companyLogoAlt: 'Mistral AI company logo, abstract neural network visualization',
    location: 'Paris, France', remote: 'Hybride', contract: 'CDI',
    salaryMin: 75000, salaryMax: 95000,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    expMin: 5, expMax: 10, domain: 'Engineering', postedAt: 'Il y a 2 jours',
    applications: 12, portfolioMatch: 94,
    description: 'Rejoignez notre équipe produit pour construire la prochaine génération de notre plateforme SaaS. Vous travaillerez sur des défis techniques passionnants avec une équipe de 8 ingénieurs seniors dans un environnement agile et bienveillant.',
    responsibilities: [
    'Concevoir et développer des fonctionnalités full-stack de bout en bout',
    'Participer aux revues de code et améliorer la qualité du codebase',
    'Collaborer avec les équipes produit et design pour définir les specs',
    'Optimiser les performances et la scalabilité de la plateforme',
    'Mentorer les développeurs juniors de l\'équipe'],

    requirements: [
    '5+ ans d\'expérience en développement full-stack',
    'Maîtrise de React, TypeScript et Node.js',
    'Expérience avec PostgreSQL et les bases de données relationnelles',
    'Connaissance des pratiques CI/CD et DevOps',
    'Portfolio démontrant des projets concrets et de la qualité de code'],

    benefits: [
    'Salaire compétitif 75–95k€ + equity',
    'Remote 3j/semaine',
    'Budget formation 3 000€/an',
    'Mutuelle Alan premium',
    'MacBook Pro M3 fourni'],

    teamSize: '8 ingénieurs', stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS']
  },
  '2': {
    id: '2', title: 'Lead AI/ML Engineer', company: 'Hugging Face',
    companyLogo: "https://img.rocket.new/generatedImages/rocket_gen_img_4164a1c78-1791278113913.png",
    companyLogoAlt: 'Hugging Face company logo, AI research company',
    location: 'Remote', remote: 'Full Remote', contract: 'CDI',
    salaryMin: 90000, salaryMax: 120000,
    skills: ['Python', 'PyTorch', 'LLMs', 'MLOps'],
    expMin: 6, expMax: 12, domain: 'Data & AI', postedAt: 'Il y a 1 jour',
    applications: 8, portfolioMatch: 87,
    description: 'Développez et déployez des modèles de langage avancés pour nos clients enterprise. Vous serez responsable de l\'architecture MLOps et du fine-tuning de LLMs à grande échelle.',
    responsibilities: [
    'Concevoir l\'architecture MLOps de bout en bout',
    'Fine-tuner et évaluer des LLMs pour des cas d\'usage spécifiques',
    'Déployer des modèles en production avec monitoring',
    'Collaborer avec les équipes de recherche',
    'Définir les bonnes pratiques ML de l\'équipe'],

    requirements: [
    '6+ ans d\'expérience en ML/AI',
    'Maîtrise de Python, PyTorch et les frameworks LLM',
    'Expérience en MLOps (Kubernetes, MLflow, etc.)',
    'Publications ou projets open-source appréciés',
    'Portfolio avec des projets ML concrets'],

    benefits: [
    'Salaire 90–120k€ + equity',
    'Full remote mondial',
    'Budget conférences illimité',
    'Accès GPU cluster',
    'Semaine de recherche libre par trimestre'],

    teamSize: '12 chercheurs & ingénieurs', stack: ['Python', 'PyTorch', 'Kubernetes', 'MLflow', 'Transformers', 'CUDA']
  }
};

const FALLBACK_JOB = JOB_DATA['1'];

interface ApplicationStep {
  id: number;
  label: string;
  done: boolean;
}

export default function JobDetailContent({ jobId }: {jobId: string;}) {
  const job = JOB_DATA[jobId] || FALLBACK_JOB;
  const [applying, setApplying] = useState(false);
  const [step, setStep] = useState(1);
  const [coverNote, setCoverNote] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState('portfolio-1');
  const [submitted, setSubmitted] = useState(false);

  const STEPS: ApplicationStep[] = [
  { id: 1, label: 'Choisir votre portfolio', done: step > 1 },
  { id: 2, label: 'Note personnalisée', done: step > 2 },
  { id: 3, label: 'Confirmer', done: submitted }];


  const handleSubmit = () => {
    setSubmitted(true);
    setApplying(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircleIcon" size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-800 text-foreground mb-2">Candidature envoyée ! 🎉</h2>
        <p className="text-muted-foreground mb-2">Votre portfolio a été transmis à <span className="font-700 text-foreground">{job.company}</span></p>
        <p className="text-sm text-muted-foreground mb-8">Le recruteur peut maintenant explorer votre portfolio complet et vous contacter directement.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/jobs" className="px-5 py-2.5 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-all">
            Voir d'autres offres
          </Link>
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all">
            Mon dashboard
          </Link>
        </div>
      </div>);

  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/jobs" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Icon name="ArrowLeftIcon" size={13} />
          Offres d'emploi
        </Link>
        <Icon name="ChevronRightIcon" size={12} />
        <span className="text-foreground font-600">{job.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Job header */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <img src={job.companyLogo} alt={job.companyLogoAlt} className="w-16 h-16 rounded-2xl object-cover border border-border flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-800 text-foreground mb-1">{job.title}</h1>
                <p className="text-sm text-muted-foreground mb-3">{job.company} · {job.location}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-xs font-600 px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground border border-border">
                    <Icon name="WifiIcon" size={11} />{job.remote}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-600 px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground border border-border">
                    <Icon name="BriefcaseIcon" size={11} />{job.contract}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-600 px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground border border-border">
                    <Icon name="EuroIcon" size={11} />{job.salaryMin / 1000}–{job.salaryMax / 1000}k€
                  </span>
                  <span className="flex items-center gap-1 text-xs font-600 px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground border border-border">
                    <Icon name="ClockIcon" size={11} />{job.postedAt}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-sm font-800 px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-600 border border-violet-500/20">
                  🎯 {job.portfolioMatch}% match
                </span>
                <span className="text-xs text-muted-foreground">{job.applications} candidatures</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-700 text-foreground mb-4 flex items-center gap-2">
              <Icon name="ListChecksIcon" size={16} className="text-violet-600" />
              Missions
            </h2>
            <ul className="space-y-2.5">
              {job.responsibilities.map((r, i) =>
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-lg bg-violet-500/10 text-violet-600 text-[10px] font-800 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {r}
                </li>
              )}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-700 text-foreground mb-4 flex items-center gap-2">
              <Icon name="ShieldCheckIcon" size={16} className="text-emerald-600" />
              Profil recherché
            </h2>
            <ul className="space-y-2.5">
              {job.requirements.map((r, i) =>
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Icon name="CheckIcon" size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  {r}
                </li>
              )}
            </ul>
          </div>

          {/* Stack */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-700 text-foreground mb-4 flex items-center gap-2">
              <Icon name="CodeIcon" size={16} className="text-sky-600" />
              Stack technique
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.stack.map((s) =>
              <span key={s} className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/20 text-xs font-700">{s}</span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: apply + benefits */}
        <div className="space-y-4">
          {/* Apply CTA */}
          <div className="bg-card border border-violet-500/20 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Icon name="SendIcon" size={15} className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-700 text-foreground">Postuler via portfolio</p>
                <p className="text-[11px] text-muted-foreground">Pas de CV requis</p>
              </div>
            </div>

            {!applying ?
            <button
              onClick={() => setApplying(true)}
              className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-700 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
              
                <Icon name="RocketIcon" size={15} />
                Postuler maintenant
              </button> :

            <div className="space-y-4">
                {/* Steps indicator */}
                <div className="flex items-center gap-1 mb-4">
                  {STEPS.map((s, i) =>
                <React.Fragment key={s.id}>
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-800 flex-shrink-0 transition-all ${step === s.id ? 'bg-violet-600 text-white' : s.done ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                        {s.done ? <Icon name="CheckIcon" size={10} /> : s.id}
                      </div>
                      {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${s.done ? 'bg-emerald-500' : 'bg-border'}`} />}
                    </React.Fragment>
                )}
                </div>

                {step === 1 &&
              <div className="space-y-3">
                    <p className="text-xs font-700 text-foreground">Choisissez votre portfolio</p>
                    {[
                { id: 'portfolio-1', name: 'Portfolio Principal', template: 'Dark Tech', views: '3.1K' },
                { id: 'portfolio-2', name: 'Portfolio Minimaliste', template: 'BentoMinimal', views: '1.2K' }].
                map((p) =>
                <button
                  key={p.id}
                  onClick={() => setSelectedPortfolio(p.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedPortfolio === p.id ? 'border-violet-500/40 bg-violet-500/5' : 'border-border hover:border-violet-500/20'}`}>
                  
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="LayoutTemplateIcon" size={14} className="text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-700 text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.template} · {p.views} vues</p>
                        </div>
                        {selectedPortfolio === p.id && <Icon name="CheckCircleIcon" size={14} className="text-violet-600 flex-shrink-0" />}
                      </button>
                )}
                    <button onClick={() => setStep(2)} className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-xs font-700 hover:bg-violet-700 transition-all">
                      Continuer →
                    </button>
                  </div>
              }

                {step === 2 &&
              <div className="space-y-3">
                    <p className="text-xs font-700 text-foreground">Note personnalisée (optionnel)</p>
                    <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Expliquez en 2-3 phrases pourquoi ce poste vous intéresse..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none" />
                
                    <div className="flex gap-2">
                      <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-border text-xs font-600 text-muted-foreground hover:bg-muted transition-all">
                        ← Retour
                      </button>
                      <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-700 hover:bg-violet-700 transition-all">
                        Continuer →
                      </button>
                    </div>
                  </div>
              }

                {step === 3 &&
              <div className="space-y-3">
                    <p className="text-xs font-700 text-foreground">Récapitulatif</p>
                    <div className="bg-muted/50 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Poste</span>
                        <span className="font-600 text-foreground text-right max-w-[60%]">{job.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entreprise</span>
                        <span className="font-600 text-foreground">{job.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Portfolio</span>
                        <span className="font-600 text-violet-600">Portfolio Principal</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-xl border border-border text-xs font-600 text-muted-foreground hover:bg-muted transition-all">
                        ← Retour
                      </button>
                      <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-700 hover:bg-emerald-700 transition-all flex items-center justify-center gap-1">
                        <Icon name="SendIcon" size={12} />
                        Envoyer
                      </button>
                    </div>
                  </div>
              }

                <button onClick={() => {setApplying(false);setStep(1);}} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Annuler
                </button>
              </div>
            }

            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="ShieldCheckIcon" size={13} className="text-emerald-600" />
              Votre portfolio est partagé de façon sécurisée
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-700 text-foreground mb-3 text-sm flex items-center gap-2">
              <Icon name="GiftIcon" size={15} className="text-amber-600" />
              Avantages
            </h2>
            <ul className="space-y-2">
              {job.benefits.map((b, i) =>
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Icon name="StarIcon" size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              )}
            </ul>
          </div>

          {/* Team info */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-700 text-foreground mb-3 text-sm flex items-center gap-2">
              <Icon name="UsersIcon" size={15} className="text-sky-600" />
              L'équipe
            </h2>
            <p className="text-xs text-muted-foreground">{job.teamSize}</p>
            <p className="text-xs text-muted-foreground mt-1">{job.expMin}–{job.expMax} ans d'expérience requis</p>
          </div>
        </div>
      </div>
    </div>);

}