'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const KPI_CARDS = [
{
  label: 'Offres actives',
  value: '3',
  delta: '+1 cette semaine',
  deltaPositive: true,
  icon: 'BriefcaseIcon',
  color: 'text-violet-600',
  bg: 'bg-violet-500/10',
  border: 'border-violet-500/20',
  href: '/recruiter-dashboard/jobs'
},
{
  label: 'Candidatures reçues',
  value: '24',
  delta: '+6 aujourd\'hui',
  deltaPositive: true,
  icon: 'UsersIcon',
  color: 'text-emerald-600',
  bg: 'bg-emerald-500/10',
  border: 'border-emerald-500/20',
  href: '/recruiter-dashboard/pipeline'
},
{
  label: 'Entretiens planifiés',
  value: '5',
  delta: '2 cette semaine',
  deltaPositive: true,
  icon: 'CalendarCheckIcon',
  color: 'text-amber-600',
  bg: 'bg-amber-500/10',
  border: 'border-amber-500/20',
  href: '/recruiter-dashboard/interviews'
},
{
  label: 'Messages non lus',
  value: '2',
  delta: 'Répondre maintenant',
  deltaPositive: false,
  icon: 'MessageSquareIcon',
  color: 'text-sky-600',
  bg: 'bg-sky-500/10',
  border: 'border-sky-500/20',
  href: '/recruiter-dashboard/messages'
}];


const RECENT_CANDIDATES = [
{
  name: 'Karim Benali',
  title: 'AI/ML Engineer · 6 ans',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ae0f3431-1763296290027.png",
  alt: 'Karim Benali, AI/ML Engineer',
  score: 97,
  status: 'Entretien',
  statusStyle: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  skills: ['Python', 'PyTorch', 'LLMs'],
  job: 'Lead AI/ML Engineer'
},
{
  name: 'Alexandre Martin',
  title: 'Full-Stack Engineer · 7 ans',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16300f318-1763293220310.png",
  alt: 'Alexandre Martin, Senior Full-Stack Engineer',
  score: 94,
  status: 'Présélectionné',
  statusStyle: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  skills: ['React', 'TypeScript', 'Go'],
  job: 'Senior Full-Stack Engineer'
},
{
  name: 'Léa Fontaine',
  title: 'Product Designer · 5 ans',
  avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png',
  alt: 'Léa Fontaine, Product Designer',
  score: 88,
  status: 'En attente',
  statusStyle: 'bg-muted text-muted-foreground border-border',
  skills: ['Figma', 'UX Research', 'Design System'],
  job: 'Product Designer UX'
}];


const UPCOMING_INTERVIEWS = [
{
  candidate: 'Karim Benali',
  avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_13722b405-1786134143015.png',
  alt: 'Karim Benali',
  type: 'Visio',
  typeIcon: 'VideoIcon',
  date: 'Jeu 8 oct.',
  time: '14:00',
  duration: '60 min',
  status: 'Confirmé',
  statusStyle: 'bg-emerald-500/10 text-emerald-600'
},
{
  candidate: 'Alexandre Martin',
  avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png',
  alt: 'Alexandre Martin',
  type: 'Visio',
  typeIcon: 'VideoIcon',
  date: 'Ven 9 oct.',
  time: '10:30',
  duration: '45 min',
  status: 'En attente',
  statusStyle: 'bg-amber-500/10 text-amber-600'
}];


const QUICK_ACTIONS = [
{ label: 'Rechercher des talents', icon: 'SearchIcon', href: '/recruiter-dashboard/talents', color: 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 border-violet-500/20' },
{ label: 'Publier une offre', icon: 'PlusCircleIcon', href: '/recruiter-dashboard/jobs', color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20' },
{ label: 'Voir le pipeline', icon: 'KanbanSquareIcon', href: '/recruiter-dashboard/pipeline', color: 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 border-sky-500/20' },
{ label: 'Planifier un entretien', icon: 'CalendarPlusIcon', href: '/recruiter-dashboard/interviews', color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20' }];


export default function RecruiterOverview() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Recruteur';

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-800 text-foreground">Bonjour, {firstName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Voici l'état de votre recrutement — <span className="text-violet-600 font-600">3 offres actives</span>, 24 candidatures en cours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-600 px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-600 border border-violet-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Espace Recruteur
          </span>
        </div>
      </div>

      {/* KPI bento grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) =>
        <Link
          key={kpi.label}
          href={kpi.href}
          className={`bg-card border ${kpi.border} rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group`}>
          
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <Icon name={kpi.icon as any} size={18} className={kpi.color} />
              </div>
              <Icon name="ArrowUpRightIcon" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-3xl font-800 text-foreground leading-none">{kpi.value}</p>
              <p className="text-xs font-600 text-foreground mt-1">{kpi.label}</p>
              <p className={`text-[11px] mt-0.5 ${kpi.deltaPositive ? 'text-emerald-600' : 'text-amber-600'}`}>{kpi.delta}</p>
            </div>
          </Link>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) =>
        <Link
          key={action.label}
          href={action.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${action.color} transition-all font-600 text-sm`}>
          
            <Icon name={action.icon as any} size={16} />
            {action.label}
          </Link>
        )}
      </div>

      {/* Main content: candidates + interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent candidates */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="font-700 text-sm text-foreground">Candidatures récentes</h2>
              <p className="text-xs text-muted-foreground">Derniers profils reçus</p>
            </div>
            <Link
              href="/recruiter-dashboard/pipeline"
              className="text-xs font-600 text-violet-600 hover:text-violet-700 flex items-center gap-1">
              
              Voir le pipeline <Icon name="ArrowRightIcon" size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {RECENT_CANDIDATES.map((c) =>
            <div key={c.name} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                <img src={c.avatar} alt={c.alt} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-700 text-foreground">{c.name}</p>
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full border ${c.statusStyle}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5">{c.title} · {c.job}</p>
                  <div className="flex gap-1 flex-wrap">
                    {c.skills.map((s) =>
                  <span key={s} className="text-[10px] font-600 px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                        {s}
                      </span>
                  )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-800 text-foreground">{c.score}</span>
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">score</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="font-700 text-sm text-foreground">Prochains entretiens</h2>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
            </div>
            <Link
              href="/recruiter-dashboard/interviews"
              className="text-xs font-600 text-violet-600 hover:text-violet-700 flex items-center gap-1">
              
              Tout voir <Icon name="ArrowRightIcon" size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {UPCOMING_INTERVIEWS.map((interview) =>
            <div key={interview.candidate} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <img src={interview.avatar} alt={interview.alt} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-700 text-foreground truncate">{interview.candidate}</p>
                    <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-md ${interview.statusStyle}`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="CalendarIcon" size={11} />
                    {interview.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="ClockIcon" size={11} />
                    {interview.time} · {interview.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name={interview.typeIcon as any} size={11} />
                    {interview.type}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="px-5 py-4 border-t border-border">
            <Link
              href="/recruiter-dashboard/interviews"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-500/30 text-violet-600 text-xs font-600 hover:bg-violet-500/10 transition-all">
              
              <Icon name="CalendarPlusIcon" size={13} />
              Planifier un entretien
            </Link>
          </div>
        </div>
      </div>

      {/* Pipeline funnel summary */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-700 text-sm text-foreground">Funnel de recrutement</h2>
            <p className="text-xs text-muted-foreground">Vue d'ensemble de toutes les offres actives</p>
          </div>
          <Link href="/recruiter-dashboard/pipeline" className="text-xs font-600 text-violet-600 hover:text-violet-700 flex items-center gap-1">
            Gérer le pipeline <Icon name="ArrowRightIcon" size={12} />
          </Link>
        </div>
        <div className="flex items-end gap-3">
          {[
          { label: 'Reçues', count: 24, width: 'w-full', color: 'bg-muted' },
          { label: 'En cours', count: 12, width: 'w-1/2', color: 'bg-sky-500/40' },
          { label: 'Présélectionnés', count: 6, width: 'w-1/4', color: 'bg-violet-500/50' },
          { label: 'Entretiens', count: 3, width: 'w-1/8', color: 'bg-amber-500/60' },
          { label: 'Recrutés', count: 1, width: 'w-16', color: 'bg-emerald-500/70' }].
          map((stage) =>
          <div key={stage.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-sm font-800 text-foreground">{stage.count}</span>
              <div className={`w-full h-8 rounded-lg ${stage.color}`} />
              <span className="text-[10px] text-muted-foreground font-600 text-center">{stage.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>);

}