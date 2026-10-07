'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from
'recharts';

const APPLICATIONS_OVER_TIME = [
{ week: 'S1 sept', applications: 4, interviews: 1, hired: 0 },
{ week: 'S2 sept', applications: 7, interviews: 2, hired: 0 },
{ week: 'S3 sept', applications: 11, interviews: 3, hired: 1 },
{ week: 'S4 sept', applications: 9, interviews: 2, hired: 0 },
{ week: 'S1 oct', applications: 14, interviews: 4, hired: 1 },
{ week: 'S2 oct', applications: 18, interviews: 5, hired: 2 }];


const FUNNEL_DATA = [
{ stage: 'Vues offres', count: 1240, pct: 100, color: '#8b5cf6' },
{ stage: 'Candidatures', count: 64, pct: 5.2, color: '#6366f1' },
{ stage: 'En cours', count: 28, pct: 43.8, color: '#3b82f6' },
{ stage: 'Présélectionnés', count: 12, pct: 42.9, color: '#0ea5e9' },
{ stage: 'Entretiens', count: 7, pct: 58.3, color: '#10b981' },
{ stage: 'Offres', count: 3, pct: 42.9, color: '#22c55e' },
{ stage: 'Recrutés', count: 2, pct: 66.7, color: '#84cc16' }];


const SKILLS_DEMAND = [
{ skill: 'React', count: 18 },
{ skill: 'TypeScript', count: 15 },
{ skill: 'Python', count: 12 },
{ skill: 'Node.js', count: 10 },
{ skill: 'Figma', count: 8 },
{ skill: 'AWS', count: 7 },
{ skill: 'PyTorch', count: 6 },
{ skill: 'Kubernetes', count: 5 }];


const SOURCE_DATA = [
{ name: 'Portfolio direct', value: 42, color: '#8b5cf6' },
{ name: 'Recherche TalentHub', value: 31, color: '#6366f1' },
{ name: 'Recommandation IA', value: 18, color: '#3b82f6' },
{ name: 'Partage réseau', value: 9, color: '#0ea5e9' }];


const RESPONSE_TIME = [
{ day: 'Lun', hours: 4 },
{ day: 'Mar', hours: 2 },
{ day: 'Mer', hours: 6 },
{ day: 'Jeu', hours: 3 },
{ day: 'Ven', hours: 5 },
{ day: 'Sam', hours: 8 },
{ day: 'Dim', hours: 12 }];


const KPI_CARDS = [
{ label: 'Taux de conversion', value: '3.1%', delta: '+0.8%', positive: true, icon: 'TrendingUpIcon', color: 'text-violet-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20', sub: 'Candidatures → Recrutés' },
{ label: 'Temps moyen de recrutement', value: '18j', delta: '-3j', positive: true, icon: 'ClockIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', sub: 'Depuis la publication' },
{ label: 'Score moyen portfolios', value: '82%', delta: '+4%', positive: true, icon: 'StarIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', sub: 'Match IA moyen' },
{ label: 'Taux de réponse candidats', value: '73%', delta: '+12%', positive: true, icon: 'MessageSquareIcon', color: 'text-sky-600', bg: 'bg-sky-500/10', border: 'border-sky-500/20', sub: 'Répondent à vos messages' }];


const TOP_CANDIDATES = [
{ name: 'Karim Benali', title: 'AI/ML Engineer', score: 97, status: 'Entretien', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_195a56a22-1763296537088.png", alt: 'Karim Benali profile photo' },
{ name: 'Alexandre Martin', title: 'Full-Stack Engineer', score: 94, status: 'Présélectionné', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d90a96ad-1763299909299.png", alt: 'Alexandre Martin profile photo' },
{ name: 'Léa Fontaine', title: 'Product Designer', score: 88, status: 'En cours', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_103b528db-1763293982935.png", alt: 'Léa Fontaine profile photo' }];


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="font-700 text-foreground mb-1">{label}</p>
        {payload.map((p: any) =>
        <p key={p.name} style={{ color: p.color }} className="font-600">{p.name}: {p.value}</p>
        )}
      </div>);

  }
  return null;
};

export default function RecruiterAnalyticsContent() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-800 text-foreground">Analytics Recrutement</h1>
          <p className="text-sm text-muted-foreground">Performances de votre pipeline sur les 30 derniers jours</p>
        </div>
        <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-1 py-1">
          {(['7d', '30d', '90d'] as const).map((p) =>
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${period === p ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
            
              {p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : '90 jours'}
            </button>
          )}
        </div>
      </div>

      {/* KPI bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) =>
        <div key={kpi.label} className={`bg-card border ${kpi.border} rounded-2xl p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <Icon name={kpi.icon as any} size={18} className={kpi.color} />
              </div>
              <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${kpi.positive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                {kpi.delta}
              </span>
            </div>
            <div>
              <p className="text-3xl font-800 text-foreground leading-none">{kpi.value}</p>
              <p className="text-xs font-600 text-foreground mt-1">{kpi.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Applications over time */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-700 text-sm text-foreground">Activité du pipeline</h2>
              <p className="text-xs text-muted-foreground">Candidatures, entretiens et recrutements</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={APPLICATIONS_OVER_TIME} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradInt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="applications" name="Candidatures" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradApps)" />
              <Area type="monotone" dataKey="interviews" name="Entretiens" stroke="#10b981" strokeWidth={2} fill="url(#gradInt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Source breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="mb-5">
            <h2 className="font-700 text-sm text-foreground">Sources des candidatures</h2>
            <p className="text-xs text-muted-foreground">D'où viennent vos candidats</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {SOURCE_DATA.map((entry, index) =>
                <Cell key={index} fill={entry.color} />
                )}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {SOURCE_DATA.map((s) =>
            <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="font-700 text-foreground">{s.value}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Conversion funnel */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="mb-5">
            <h2 className="font-700 text-sm text-foreground">Entonnoir de conversion</h2>
            <p className="text-xs text-muted-foreground">De la vue à l'embauche</p>
          </div>
          <div className="space-y-2">
            {FUNNEL_DATA.map((f, i) =>
            <div key={f.stage}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{f.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-700 text-foreground">{f.count}</span>
                    {i > 0 && <span className="text-[10px] text-muted-foreground">({f.pct}%)</span>}
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${f.count / FUNNEL_DATA[0].count * 100}%`, background: f.color }} />
                
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills demand */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="mb-5">
            <h2 className="font-700 text-sm text-foreground">Compétences les plus demandées</h2>
            <p className="text-xs text-muted-foreground">Dans vos offres actives</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SKILLS_DEMAND} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Candidats" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top candidates + response time */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-700 text-sm text-foreground mb-4">Top candidats</h2>
            <div className="space-y-3">
              {TOP_CANDIDATES.map((c, i) =>
              <div key={c.name} className="flex items-center gap-3">
                  <span className="text-xs font-800 text-muted-foreground w-4">{i + 1}</span>
                  <img src={c.avatar} alt={c.alt} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-700 text-foreground truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{c.title}</p>
                  </div>
                  <span className="text-xs font-800 text-violet-600">{c.score}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-700 text-sm text-foreground mb-1">Temps de réponse moyen</h2>
            <p className="text-xs text-muted-foreground mb-3">En heures, par jour</p>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={RESPONSE_TIME} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="hours" name="Heures" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>);

}