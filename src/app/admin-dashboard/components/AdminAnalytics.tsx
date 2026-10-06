'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Period = '7j' | '30j' | '3m' | '12m';

const GROWTH_DATA: Record<Period, { label: string; users: number; portfolios: number; jobs: number }[]> = {
  '7j': [
    { label: 'Lun', users: 4750, portfolios: 3200, jobs: 305 },
    { label: 'Mar', users: 4762, portfolios: 3210, jobs: 307 },
    { label: 'Mer', users: 4775, portfolios: 3220, jobs: 308 },
    { label: 'Jeu', users: 4790, portfolios: 3230, jobs: 310 },
    { label: 'Ven', users: 4805, portfolios: 3238, jobs: 311 },
    { label: 'Sam', users: 4812, portfolios: 3242, jobs: 311 },
    { label: 'Dim', users: 4821, portfolios: 3247, jobs: 312 },
  ],
  '30j': [
    { label: 'S1', users: 4500, portfolios: 3000, jobs: 280 },
    { label: 'S2', users: 4600, portfolios: 3080, jobs: 290 },
    { label: 'S3', users: 4700, portfolios: 3150, jobs: 300 },
    { label: 'S4', users: 4821, portfolios: 3247, jobs: 312 },
  ],
  '3m': [
    { label: 'Aoû', users: 4310, portfolios: 3050, jobs: 265 },
    { label: 'Sep', users: 4621, portfolios: 3180, jobs: 290 },
    { label: 'Oct', users: 4821, portfolios: 3247, jobs: 312 },
  ],
  '12m': [
    { label: 'Nov', users: 2800, portfolios: 1800, jobs: 180 },
    { label: 'Déc', users: 3000, portfolios: 1950, jobs: 195 },
    { label: 'Jan', users: 3200, portfolios: 2100, jobs: 210 },
    { label: 'Fév', users: 3400, portfolios: 2250, jobs: 225 },
    { label: 'Mar', users: 3600, portfolios: 2400, jobs: 240 },
    { label: 'Avr', users: 3820, portfolios: 2600, jobs: 255 },
    { label: 'Mai', users: 4050, portfolios: 2750, jobs: 268 },
    { label: 'Jun', users: 4200, portfolios: 2900, jobs: 278 },
    { label: 'Jul', users: 4310, portfolios: 3000, jobs: 285 },
    { label: 'Aoû', users: 4500, portfolios: 3100, jobs: 295 },
    { label: 'Sep', users: 4650, portfolios: 3180, jobs: 305 },
    { label: 'Oct', users: 4821, portfolios: 3247, jobs: 312 },
  ],
};

const ENGAGEMENT_DATA = [
  { day: 'Lun', sessions: 1420, pageviews: 5800, bounceRate: 32 },
  { day: 'Mar', sessions: 1980, pageviews: 7200, bounceRate: 28 },
  { day: 'Mer', sessions: 1670, pageviews: 6100, bounceRate: 35 },
  { day: 'Jeu', sessions: 2230, pageviews: 8400, bounceRate: 25 },
  { day: 'Ven', sessions: 1890, pageviews: 7100, bounceRate: 30 },
  { day: 'Sam', sessions: 980, pageviews: 3200, bounceRate: 45 },
  { day: 'Dim', sessions: 760, pageviews: 2600, bounceRate: 50 },
];

const TRAFFIC_SOURCES = [
  { name: 'Organique', value: 42, color: '#e11d48' },
  { name: 'Direct', value: 28, color: '#3b82f6' },
  { name: 'Réseaux sociaux', value: 18, color: '#8b5cf6' },
  { name: 'Référence', value: 12, color: '#f59e0b' },
];

const TOP_PAGES = [
  { page: '/portfolio-studio', views: 12400, sessions: 3200, bounce: '28%' },
  { page: '/jobs', views: 9800, sessions: 2800, bounce: '35%' },
  { page: '/templates', views: 7200, sessions: 1900, bounce: '42%' },
  { page: '/recruiter-space', views: 5600, sessions: 1400, bounce: '31%' },
  { page: '/ai-analysis', views: 4100, sessions: 980, bounce: '22%' },
];

const KPI_CARDS = [
  { label: 'Sessions totales', value: '11,030', delta: '+18%', icon: 'ActivityIcon', color: 'text-blue-600', bg: 'bg-blue-500/10', trend: 'up' },
  { label: 'Pages vues', value: '40,400', delta: '+22%', icon: 'EyeIcon', color: 'text-violet-600', bg: 'bg-violet-500/10', trend: 'up' },
  { label: 'Taux de rebond', value: '33.6%', delta: '-4%', icon: 'TrendingDownIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', trend: 'down-good' },
  { label: 'Durée moy. session', value: '4m 32s', delta: '+12s', icon: 'ClockIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', trend: 'up' },
];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<Period>('30j');

  const growthData = GROWTH_DATA[period];

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-foreground">Analytics de la plateforme</h2>
          <p className="text-sm text-muted-foreground">Métriques et statistiques globales</p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {(['7j', '30j', '3m', '12m'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${period === p ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <Icon name={kpi.icon as any} size={16} className={kpi.color} />
              </div>
              <span className={`text-xs font-700 px-2 py-0.5 rounded-lg ${
                kpi.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' :
                kpi.trend === 'down-good'? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
              }`}>
                {kpi.delta}
              </span>
            </div>
            <p className="text-2xl font-800 text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Growth chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-700 text-foreground text-sm">Croissance de la plateforme</h3>
            <p className="text-xs text-muted-foreground">Utilisateurs, portfolios et offres d'emploi</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="usersGradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="portfoliosGradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="jobsGradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
            <Area type="monotone" dataKey="users" stroke="#e11d48" strokeWidth={2} fill="url(#usersGradA)" name="Utilisateurs" />
            <Area type="monotone" dataKey="portfolios" stroke="#3b82f6" strokeWidth={2} fill="url(#portfoliosGradA)" name="Portfolios" />
            <Area type="monotone" dataKey="jobs" stroke="#8b5cf6" strokeWidth={2} fill="url(#jobsGradA)" name="Offres" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-2">
          <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-rose-500 inline-block" /><span className="text-xs text-muted-foreground">Utilisateurs</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-blue-500 inline-block" /><span className="text-xs text-muted-foreground">Portfolios</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-violet-500 inline-block" /><span className="text-xs text-muted-foreground">Offres</span></div>
        </div>
      </div>

      {/* Engagement + Traffic sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Engagement */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-700 text-foreground text-sm">Engagement hebdomadaire</h3>
            <p className="text-xs text-muted-foreground">Sessions et pages vues par jour</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ENGAGEMENT_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="sessions" fill="#e11d48" radius={[4, 4, 0, 0]} name="Sessions" />
              <Bar dataKey="pageviews" fill="#fda4af" radius={[4, 4, 0, 0]} name="Pages vues" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500 inline-block" /><span className="text-xs text-muted-foreground">Sessions</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-200 inline-block" /><span className="text-xs text-muted-foreground">Pages vues</span></div>
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-700 text-foreground text-sm">Sources de trafic</h3>
            <p className="text-xs text-muted-foreground">Origine des visiteurs</p>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                {TRAFFIC_SOURCES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} formatter={(value) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {TRAFFIC_SOURCES.map((src) => (
              <div key={src.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: src.color }} />
                  <span className="text-xs text-muted-foreground">{src.name}</span>
                </div>
                <span className="text-xs font-700 text-foreground">{src.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top pages */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-700 text-foreground text-sm">Pages les plus visitées</h3>
            <p className="text-xs text-muted-foreground">Top 5 des pages par nombre de vues</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-600 text-muted-foreground hover:text-foreground transition-all">
            <Icon name="DownloadIcon" size={12} />
            Exporter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Page</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Vues</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Sessions</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Taux rebond</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Tendance</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PAGES.map((page, i) => (
                <tr key={page.page} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-muted flex items-center justify-center text-[10px] font-700 text-muted-foreground flex-shrink-0">{i + 1}</span>
                      <span className="text-sm font-600 text-foreground font-mono">{page.page}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-sm font-700 text-foreground">{page.views.toLocaleString()}</span></td>
                  <td className="px-5 py-3.5"><span className="text-sm text-foreground">{page.sessions.toLocaleString()}</span></td>
                  <td className="px-5 py-3.5"><span className="text-sm text-foreground">{page.bounce}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Icon name="TrendingUpIcon" size={13} />
                      <span className="text-xs font-600">+{Math.floor(Math.random() * 20 + 5)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
