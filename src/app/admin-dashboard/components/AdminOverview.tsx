'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PLATFORM_STATS = [
  { label: 'Utilisateurs totaux', value: '4,821', icon: 'UsersIcon', color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', delta: '+124 ce mois', trend: 'up', href: '/admin-dashboard/users' },
  { label: 'Portfolios actifs', value: '3,247', icon: 'LayoutTemplateIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', delta: '+89 cette semaine', trend: 'up', href: '/admin-dashboard/portfolios' },
  { label: 'Offres d\'emploi', value: '312', icon: 'BriefcaseIcon', color: 'text-violet-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20', delta: '+18 aujourd\'hui', trend: 'up', href: '/admin-dashboard/jobs' },
  { label: 'Signalements actifs', value: '5', icon: 'FlagIcon', color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500/20', delta: '3 urgents', trend: 'alert', href: '/admin-dashboard/reports' },
  { label: 'Recruteurs inscrits', value: '287', icon: 'BuildingIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', delta: '+12 ce mois', trend: 'up', href: '/admin-dashboard/users' },
  { label: 'Templates marketplace', value: '64', icon: 'Layers2Icon', color: 'text-sky-600', bg: 'bg-sky-500/10', border: 'border-sky-500/20', delta: '4 en attente', trend: 'pending', href: '/admin-dashboard/templates' },
];

const growthData = [
  { month: 'Avr', users: 3200, portfolios: 2100 },
  { month: 'Mai', users: 3580, portfolios: 2400 },
  { month: 'Jun', users: 3820, portfolios: 2700 },
  { month: 'Jul', users: 4050, portfolios: 2900 },
  { month: 'Aoû', users: 4310, portfolios: 3050 },
  { month: 'Sep', users: 4621, portfolios: 3180 },
  { month: 'Oct', users: 4821, portfolios: 3247 },
];

const activityData = [
  { day: 'Lun', inscriptions: 18, connexions: 142 },
  { day: 'Mar', inscriptions: 24, connexions: 198 },
  { day: 'Mer', inscriptions: 15, connexions: 167 },
  { day: 'Jeu', inscriptions: 31, connexions: 223 },
  { day: 'Ven', inscriptions: 28, connexions: 189 },
  { day: 'Sam', inscriptions: 12, connexions: 98 },
  { day: 'Dim', inscriptions: 9, connexions: 76 },
];

const userDistribution = [
  { name: 'Candidats', value: 4534, color: '#3b82f6' },
  { name: 'Recruteurs', value: 287, color: '#8b5cf6' },
];

const PENDING_ACTIONS = [
  { id: 'pa-1', label: 'Credentials à vérifier', count: 3, href: '/admin-dashboard/credentials', icon: 'ShieldCheckIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', urgency: 'medium' },
  { id: 'pa-2', label: 'Signalements en attente', count: 5, href: '/admin-dashboard/reports', icon: 'FlagIcon', color: 'text-rose-600', bg: 'bg-rose-500/10', urgency: 'high' },
  { id: 'pa-3', label: 'Templates à valider', count: 4, href: '/admin-dashboard/templates', icon: 'Layers2Icon', color: 'text-sky-600', bg: 'bg-sky-500/10', urgency: 'low' },
  { id: 'pa-4', label: 'Offres à modérer', count: 2, href: '/admin-dashboard/jobs', icon: 'BriefcaseIcon', color: 'text-violet-600', bg: 'bg-violet-500/10', urgency: 'medium' },
];

const RECENT_ACTIONS = [
  { id: 'ra-1', message: 'Nouveau recruteur inscrit : Accenture France', time: 'il y a 8 min', icon: 'BuildingIcon', color: 'text-violet-500', bg: 'bg-violet-500/10', href: '/admin-dashboard/users' },
  { id: 'ra-2', message: 'Signalement traité : portfolio #4821 supprimé', time: 'il y a 25 min', icon: 'FlagIcon', color: 'text-rose-500', bg: 'bg-rose-500/10', href: '/admin-dashboard/reports' },
  { id: 'ra-3', message: 'Template "Minimal Pro" validé et publié', time: 'il y a 1h', icon: 'Layers2Icon', color: 'text-sky-500', bg: 'bg-sky-500/10', href: '/admin-dashboard/templates' },
  { id: 'ra-4', message: 'Certification AWS vérifiée pour @thomas.m', time: 'il y a 2h', icon: 'ShieldCheckIcon', color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/admin-dashboard/credentials' },
  { id: 'ra-5', message: 'Offre d\'emploi #312 approuvée : Développeur React', time: 'il y a 3h', icon: 'BriefcaseIcon', color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/admin-dashboard/jobs' },
  { id: 'ra-6', message: '12 nouveaux candidats inscrits aujourd\'hui', time: 'il y a 4h', icon: 'UsersIcon', color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/admin-dashboard/users' },
];

const QUICK_ACTIONS = [
  { label: 'Ajouter un utilisateur', icon: 'UserPlusIcon', href: '/admin-dashboard/users', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { label: 'Voir les signalements', icon: 'FlagIcon', href: '/admin-dashboard/reports', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  { label: 'Gérer les templates', icon: 'Layers2Icon', href: '/admin-dashboard/templates', color: 'text-sky-600', bg: 'bg-sky-500/10' },
  { label: 'Analytics complets', icon: 'BarChart2Icon', href: '/admin-dashboard/analytics', color: 'text-violet-600', bg: 'bg-violet-500/10' },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-white absolute -right-16 -top-16" />
          <div className="w-40 h-40 rounded-full bg-white absolute right-12 bottom-0" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-rose-100 text-sm font-500 mb-1">Panneau d'administration</p>
            <h2 className="text-2xl font-800 mb-1">Bienvenue, Super Admin</h2>
            <p className="text-rose-100 text-sm">Vous gérez l'ensemble de la plateforme TalentHub</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-800">4,821</p>
              <p className="text-rose-100 text-xs">Utilisateurs</p>
            </div>
            <div className="w-px h-12 bg-rose-400" />
            <div className="text-center">
              <p className="text-3xl font-800">99.8%</p>
              <p className="text-rose-100 text-xs">Uptime</p>
            </div>
            <div className="w-px h-12 bg-rose-400" />
            <div className="text-center">
              <p className="text-3xl font-800">3.2k</p>
              <p className="text-rose-100 text-xs">Actifs / jour</p>
            </div>
          </div>
        </div>
        {/* Quick actions row */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-5 pt-5 border-t border-rose-400/40">
          {QUICK_ACTIONS.map((qa) => (
            <Link
              key={qa.label}
              href={qa.href}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-600 transition-all border border-white/20"
            >
              <Icon name={qa.icon as any} size={13} />
              {qa.label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Grid — clickable cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {PLATFORM_STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`bg-card border ${stat.border} rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Icon name={stat.icon as any} size={15} className={stat.color} />
              </div>
              <div className="flex items-center gap-1">
                {stat.trend === 'alert' && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                {stat.trend === 'pending' && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                {stat.trend === 'up' && <Icon name="TrendingUpIcon" size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            </div>
            <div>
              <p className="text-xl font-800 text-foreground">{stat.value}</p>
              <p className="text-xs font-600 text-foreground leading-tight">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.delta}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-rose-500 transition-colors">
              <span>Voir détails</span>
              <Icon name="ArrowRightIcon" size={10} />
            </div>
          </Link>
        ))}
      </div>

      {/* Pending actions */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="AlertCircleIcon" size={16} className="text-amber-500" />
          <h3 className="font-700 text-foreground text-sm">Actions requises</h3>
          <span className="ml-auto text-xs text-muted-foreground">Tâches en attente de traitement</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PENDING_ACTIONS.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-sm ${
                action.urgency === 'high' ?'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10'
                  : action.urgency === 'medium' ?'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10' :'border-border bg-muted/30 hover:bg-muted'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl ${action.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={action.icon as any} size={16} className={action.color} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-600 text-foreground leading-tight">{action.label}</p>
                <p className={`text-lg font-800 ${action.color}`}>{action.count}</p>
              </div>
              <Icon name="ChevronRightIcon" size={14} className="text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Growth chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-700 text-foreground text-sm">Croissance de la plateforme</h3>
              <p className="text-xs text-muted-foreground">Utilisateurs & portfolios (7 derniers mois)</p>
            </div>
            <Link href="/admin-dashboard/analytics" className="text-xs text-rose-500 hover:text-rose-600 font-600 flex items-center gap-1">
              Voir analytics <Icon name="ArrowRightIcon" size={11} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="portfoliosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="users" stroke="#e11d48" strokeWidth={2} fill="url(#usersGrad)" name="Utilisateurs" />
              <Area type="monotone" dataKey="portfolios" stroke="#3b82f6" strokeWidth={2} fill="url(#portfoliosGrad)" name="Portfolios" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-rose-500 inline-block" /><span className="text-xs text-muted-foreground">Utilisateurs</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-blue-500 inline-block" /><span className="text-xs text-muted-foreground">Portfolios</span></div>
          </div>
        </div>

        {/* User distribution pie */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-700 text-foreground text-sm">Répartition utilisateurs</h3>
              <p className="text-xs text-muted-foreground">Candidats vs Recruteurs</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {userDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-xs font-700 text-foreground">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Recent actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-700 text-foreground text-sm">Activité hebdomadaire</h3>
              <p className="text-xs text-muted-foreground">Inscriptions & connexions cette semaine</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="inscriptions" fill="#e11d48" radius={[4, 4, 0, 0]} name="Inscriptions" />
              <Bar dataKey="connexions" fill="#fda4af" radius={[4, 4, 0, 0]} name="Connexions" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500 inline-block" /><span className="text-xs text-muted-foreground">Inscriptions</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-200 inline-block" /><span className="text-xs text-muted-foreground">Connexions</span></div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-700 text-foreground text-sm">Activité récente</h3>
            <span className="text-xs text-muted-foreground">Dernières actions admin</span>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="flex items-start gap-3 py-2.5 px-2 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-border"
              >
                <div className={`w-7 h-7 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon name={action.icon as any} size={13} className={action.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{action.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{action.time}</p>
                </div>
                <Icon name="ChevronRightIcon" size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
