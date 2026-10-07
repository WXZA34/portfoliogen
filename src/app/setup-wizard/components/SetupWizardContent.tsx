'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/lib/LanguageContext';

interface Step {
  id: number;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  icon: string;
  color: string;
  tasks: Task[];
}

interface Task {
  id: string;
  labelFr: string;
  labelEn: string;
  hintFr: string;
  hintEn: string;
  href?: string;
  hrefLabelFr?: string;
  hrefLabelEn?: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    titleFr: 'Créer votre portfolio',
    titleEn: 'Create your portfolio',
    descFr: 'Configurez votre premier portfolio ciblé en choisissant un template et en définissant votre persona.',
    descEn: 'Set up your first targeted portfolio by choosing a template and defining your persona.',
    icon: 'PaletteIcon',
    color: 'from-violet-500 to-purple-600',
    tasks: [
      {
        id: 'choose-template',
        labelFr: 'Choisir un template',
        labelEn: 'Choose a template',
        hintFr: 'Sélectionnez parmi Classic Cream, Bento Minimal, Dark Tech ou Éditorial Bold',
        hintEn: 'Pick from Classic Cream, Bento Minimal, Dark Tech or Editorial Bold',
        href: '/portfolio-studio',
        hrefLabelFr: 'Ouvrir le Studio',
        hrefLabelEn: 'Open Studio',
      },
      {
        id: 'define-persona',
        labelFr: 'Définir un persona cible',
        labelEn: 'Define a target persona',
        hintFr: 'Précisez le poste, le secteur et les attentes du recruteur visé',
        hintEn: 'Specify the role, industry and expectations of your target recruiter',
        href: '/c-vth-que-master',
        hrefLabelFr: 'Gérer les personas',
        hrefLabelEn: 'Manage personas',
      },
      {
        id: 'name-portfolio',
        labelFr: 'Nommer et configurer le portfolio',
        labelEn: 'Name and configure the portfolio',
        hintFr: 'Donnez un nom clair et choisissez le mode de synchronisation (Live ou Figé)',
        hintEn: 'Give a clear name and choose sync mode (Live or Frozen)',
        href: '/portfolio-studio',
        hrefLabelFr: 'Configurer',
        hrefLabelEn: 'Configure',
      },
    ],
  },
  {
    id: 2,
    titleFr: 'Compléter la CVthèque',
    titleEn: 'Complete your CV Library',
    descFr: 'Enrichissez votre base de données personnelle avec vos projets, compétences, parcours et médias.',
    descEn: 'Enrich your personal database with your projects, skills, career path and media.',
    icon: 'DatabaseIcon',
    color: 'from-sky-500 to-blue-600',
    tasks: [
      {
        id: 'add-projects',
        labelFr: 'Ajouter au moins 3 projets',
        labelEn: 'Add at least 3 projects',
        hintFr: 'Incluez rôle, durée, KPIs et lien GitHub pour chaque projet',
        hintEn: 'Include role, duration, KPIs and GitHub link for each project',
        href: '/c-vth-que-master',
        hrefLabelFr: 'Ajouter des projets',
        hrefLabelEn: 'Add projects',
      },
      {
        id: 'fill-skills',
        labelFr: 'Renseigner la matrice de compétences',
        labelEn: 'Fill in the skills matrix',
        hintFr: 'Ajoutez compétences techniques, humaines et outils avec leur niveau',
        hintEn: 'Add technical, soft skills and tools with their proficiency level',
        href: '/c-vth-que-master',
        hrefLabelFr: 'Gérer les compétences',
        hrefLabelEn: 'Manage skills',
      },
      {
        id: 'add-experience',
        labelFr: 'Compléter le parcours professionnel',
        labelEn: 'Complete professional background',
        hintFr: 'Renseignez vos expériences et formations avec responsabilités et réalisations',
        hintEn: 'Fill in your experiences and education with responsibilities and achievements',
        href: '/c-vth-que-master',
        hrefLabelFr: 'Voir le parcours',
        hrefLabelEn: 'View background',
      },
      {
        id: 'upload-media',
        labelFr: 'Importer des médias (optionnel)',
        labelEn: 'Upload media (optional)',
        hintFr: 'Ajoutez images, documents ou vidéos pour enrichir vos projets',
        hintEn: 'Add images, documents or videos to enrich your projects',
        href: '/c-vth-que-master',
        hrefLabelFr: 'Galerie médias',
        hrefLabelEn: 'Media gallery',
      },
    ],
  },
  {
    id: 3,
    titleFr: 'Inviter des coaches',
    titleEn: 'Invite coaches',
    descFr: 'Partagez votre portfolio avec des mentors ou pairs pour obtenir des annotations et retours avant soumission.',
    descEn: 'Share your portfolio with mentors or peers to get annotations and feedback before submission.',
    icon: 'UsersIcon',
    color: 'from-emerald-500 to-teal-600',
    tasks: [
      {
        id: 'open-coach-dashboard',
        labelFr: 'Ouvrir le Dashboard Coach',
        labelEn: 'Open the Coach Dashboard',
        hintFr: 'Accédez à l\'espace collaboratif de révision de votre portfolio',
        hintEn: 'Access the collaborative review space for your portfolio',
        href: '/coach-dashboard',
        hrefLabelFr: 'Dashboard Coach',
        hrefLabelEn: 'Coach Dashboard',
      },
      {
        id: 'share-link',
        labelFr: 'Générer et partager le lien d\'accès',
        labelEn: 'Generate and share the access link',
        hintFr: 'Copiez le lien de partage et envoyez-le à vos mentors ou pairs',
        hintEn: 'Copy the share link and send it to your mentors or peers',
        href: '/coach-dashboard',
        hrefLabelFr: 'Partager',
        hrefLabelEn: 'Share',
      },
      {
        id: 'review-annotations',
        labelFr: 'Consulter et répondre aux annotations',
        labelEn: 'Review and reply to annotations',
        hintFr: 'Lisez les commentaires, suggestions et approbations de vos coaches',
        hintEn: 'Read comments, suggestions and approvals from your coaches',
        href: '/coach-dashboard',
        hrefLabelFr: 'Voir les annotations',
        hrefLabelEn: 'View annotations',
      },
    ],
  },
  {
    id: 4,
    titleFr: 'Publier votre premier portfolio',
    titleEn: 'Publish your first portfolio',
    descFr: 'Lancez votre audit, corrigez les problèmes détectés et publiez votre portfolio pour les recruteurs.',
    descEn: 'Run your audit, fix detected issues and publish your portfolio for recruiters.',
    icon: 'RocketIcon',
    color: 'from-orange-500 to-rose-500',
    tasks: [
      {
        id: 'run-audit',
        labelFr: 'Lancer un audit de portfolio',
        labelEn: 'Run a portfolio audit',
        hintFr: 'Analysez les lacunes et obtenez un score global avec recommandations',
        hintEn: 'Analyze gaps and get an overall score with recommendations',
        href: '/portfolio-audit',
        hrefLabelFr: 'Lancer l\'audit',
        hrefLabelEn: 'Run audit',
      },
      {
        id: 'fix-issues',
        labelFr: 'Corriger les problèmes critiques',
        labelEn: 'Fix critical issues',
        hintFr: 'Résolvez au moins les problèmes critiques avant publication',
        hintEn: 'Resolve at least the critical issues before publishing',
        href: '/portfolio-audit',
        hrefLabelFr: 'Voir les problèmes',
        hrefLabelEn: 'View issues',
      },
      {
        id: 'publish',
        labelFr: 'Publier et copier le lien public',
        labelEn: 'Publish and copy the public link',
        hintFr: 'Activez la publication et partagez votre URL personnalisée avec les recruteurs',
        hintEn: 'Activate publishing and share your custom URL with recruiters',
        href: '/portfolio-studio',
        hrefLabelFr: 'Publier',
        hrefLabelEn: 'Publish',
      },
    ],
  },
];

export default function SetupWizardContent() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [activeStep, setActiveStep] = useState(1);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const totalTasks = STEPS.reduce((acc, s) => acc + s.tasks.length, 0);
  const completedCount = completedTasks.size;
  const progressPct = Math.round((completedCount / totalTasks) * 100);

  const getStepProgress = (step: Step) => {
    const done = step.tasks.filter((t) => completedTasks.has(t.id)).length;
    return { done, total: step.tasks.length };
  };

  const isStepComplete = (step: Step) => {
    return step.tasks.every((t) => completedTasks.has(t.id));
  };

  const currentStep = STEPS.find((s) => s.id === activeStep) ?? STEPS[0];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Icon name="MapIcon" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-700 text-foreground">
              {isFr ? 'Assistant de configuration' : 'Setup Wizard'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isFr
                ? 'Suivez ces étapes pour lancer votre premier portfolio professionnel' :'Follow these steps to launch your first professional portfolio'}
            </p>
          </div>
        </div>
      </div>

      {/* Global Progress Bar */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-600 text-foreground">
              {isFr ? 'Progression globale' : 'Overall progress'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount}/{totalTasks} {isFr ? 'tâches complétées' : 'tasks completed'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-3xl font-800 tabular-nums ${
                progressPct === 100 ? 'text-positive' : 'text-primary'
              }`}
            >
              {progressPct}%
            </span>
            {progressPct === 100 && (
              <div className="w-8 h-8 rounded-full bg-positive/10 flex items-center justify-center">
                <Icon name="CheckCircleIcon" size={18} className="text-positive" />
              </div>
            )}
          </div>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              background:
                progressPct === 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
            }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mt-4">
          {STEPS.map((step, idx) => {
            const { done, total } = getStepProgress(step);
            const complete = isStepComplete(step);
            const isActive = step.id === activeStep;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-600 transition-all duration-200 ${
                    complete
                      ? 'bg-positive/10 text-positive border border-positive/20'
                      : isActive
                      ? 'bg-primary/10 text-primary border border-primary/20' :'bg-muted text-muted-foreground border border-transparent hover:border-border'
                  }`}
                >
                  {complete ? (
                    <Icon name="CheckIcon" size={12} />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-700">
                      {step.id}
                    </span>
                  )}
                  <span className="hidden sm:inline">
                    {isFr ? step.titleFr : step.titleEn}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {done}/{total}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-border hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main layout: step list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Step cards */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {STEPS.map((step) => {
            const { done, total } = getStepProgress(step);
            const complete = isStepComplete(step);
            const isActive = step.id === activeStep;
            const pct = Math.round((done / total) * 100);
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left bg-card border rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md ${
                  isActive
                    ? 'border-primary/40 ring-2 ring-primary/10'
                    : complete
                    ? 'border-positive/30' :'border-border hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <Icon name={step.icon as any} size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-600 text-foreground truncate">
                        {isFr ? step.titleFr : step.titleEn}
                      </p>
                      {complete && (
                        <Icon name="CheckCircleIcon" size={16} className="text-positive flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${step.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-500 flex-shrink-0">
                        {done}/{total}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Completion card */}
          {progressPct === 100 && (
            <div className="bg-gradient-to-br from-positive/10 to-emerald-500/5 border border-positive/20 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-positive/15 flex items-center justify-center mx-auto mb-3">
                <Icon name="PartyPopperIcon" size={22} className="text-positive" />
              </div>
              <p className="text-sm font-700 text-positive mb-1">
                {isFr ? 'Configuration terminée !' : 'Setup complete!'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isFr
                  ? 'Votre portfolio est prêt à conquérir les recruteurs.' :'Your portfolio is ready to impress recruiters.'}
              </p>
            </div>
          )}
        </div>

        {/* Right: Active step detail */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Step header */}
            <div className={`bg-gradient-to-r ${currentStep.color} p-6`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon name={currentStep.icon as any} size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-600 text-white/70 uppercase tracking-wider">
                    {isFr ? `Étape ${currentStep.id} sur ${STEPS.length}` : `Step ${currentStep.id} of ${STEPS.length}`}
                  </p>
                  <h2 className="text-xl font-700 text-white">
                    {isFr ? currentStep.titleFr : currentStep.titleEn}
                  </h2>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {isFr ? currentStep.descFr : currentStep.descEn}
              </p>
            </div>

            {/* Tasks */}
            <div className="p-6">
              <div className="space-y-3">
                {currentStep.tasks.map((task, idx) => {
                  const done = completedTasks.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                        done
                          ? 'bg-positive/5 border-positive/20' :'bg-muted/30 border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                          done
                            ? 'bg-positive border-positive' :'border-muted-foreground/40 hover:border-primary'
                        }`}
                      >
                        {done && <Icon name="CheckIcon" size={12} className="text-white" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p
                              className={`text-sm font-600 transition-all ${
                                done ? 'line-through text-muted-foreground' : 'text-foreground'
                              }`}
                            >
                              <span className="text-muted-foreground mr-2 font-500 text-xs">
                                {idx + 1}.
                              </span>
                              {isFr ? task.labelFr : task.labelEn}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {isFr ? task.hintFr : task.hintEn}
                            </p>
                          </div>
                          {task.href && (
                            <Link
                              href={task.href}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all flex-shrink-0 ${
                                done
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                              }`}
                            >
                              <span>{isFr ? task.hrefLabelFr : task.hrefLabelEn}</span>
                              <Icon name="ArrowRightIcon" size={11} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step navigation */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
                <button
                  onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
                  disabled={activeStep === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-600 text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Icon name="ChevronLeftIcon" size={16} />
                  {isFr ? 'Précédent' : 'Previous'}
                </button>

                <div className="flex items-center gap-1.5">
                  {STEPS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveStep(s.id)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        s.id === activeStep
                          ? 'w-6 bg-primary'
                          : isStepComplete(s)
                          ? 'bg-positive' :'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                {activeStep < STEPS.length ? (
                  <button
                    onClick={() => setActiveStep((p) => Math.min(STEPS.length, p + 1))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-600 bg-primary text-primary-foreground hover:opacity-90 transition-all"
                  >
                    {isFr ? 'Suivant' : 'Next'}
                    <Icon name="ChevronRightIcon" size={16} />
                  </button>
                ) : (
                  <Link
                    href="/portfolio-studio"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-600 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:opacity-90 transition-all shadow-sm"
                  >
                    <Icon name="RocketIcon" size={15} />
                    {isFr ? 'Publier maintenant' : 'Publish now'}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Tips card */}
          <div className="mt-4 bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Icon name="LightbulbIcon" size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-600 text-foreground mb-1">
                  {isFr ? 'Conseil' : 'Tip'}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeStep === 1 &&
                    (isFr
                      ? 'Commencez par le template "Bento Minimal" si vous êtes dans la tech — il met en valeur les projets et compétences de façon moderne.' :'Start with the "Bento Minimal" template if you\'re in tech — it showcases projects and skills in a modern way.')}
                  {activeStep === 2 &&
                    (isFr
                      ? 'Un portfolio avec 5+ projets et une matrice de compétences complète obtient en moyenne 3× plus de vues de recruteurs.' :'A portfolio with 5+ projects and a complete skills matrix gets on average 3× more recruiter views.')}
                  {activeStep === 3 &&
                    (isFr
                      ? 'Les coaches peuvent laisser des annotations en temps réel. Invitez au moins 2 personnes pour des retours diversifiés.'
                      : 'Coaches can leave real-time annotations. Invite at least 2 people for diverse feedback.')}
                  {activeStep === 4 &&
                    (isFr
                      ? 'Un score d\'audit supérieur à 80 augmente significativement vos chances d\'être contacté par un recruteur.'
                      : 'An audit score above 80 significantly increases your chances of being contacted by a recruiter.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
