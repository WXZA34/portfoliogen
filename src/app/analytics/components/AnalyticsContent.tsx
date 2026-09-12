'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Funnel } from 'recharts';

const heatmapData = [
  { section: 'En-tête / Accroche', clicks: 342, time: '1m 12s', color: 'bg-red-500' },
  { section: 'Projets phares', clicks: 289, time: '2m 45s', color: 'bg-orange-500' },
  { section: 'Compétences', clicks: 198, time: '0m 58s', color: 'bg-amber-500' },
  { section: 'Parcours', clicks: 156, time: '1m 20s', color: 'bg-yellow-500' },
  { section: 'Contact / CTA', clicks: 87, time: '0m 22s', color: 'bg-lime-500' },
  { section: 'Témoignages', clicks: 43, time: '0m 15s', color: 'bg-green-500' },
];

const abData = [
  { name: 'Version A', views: 124, responses: 18, interviews: 6 },
  { name: 'Version B', views: 118, responses: 31, interviews: 14 },
];

const funnelData = [
  { name: 'Portfolio vu', value: 847, fill: '#6366f1' },
  { name: 'Réponse reçue', value: 203, fill: '#8b5cf6' },
  { name: 'Entretien', value: 67, fill: '#a78bfa' },
  { name: 'Offre', value: 12, fill: '#c4b5fd' },
];

const conversionTimeline = [
  { month: 'Avr', vus: 120, reponses: 28, entretiens: 8, offres: 1 },
  { month: 'Mai', vus: 145, reponses: 35, entretiens: 12, offres: 2 },
  { month: 'Jun', vus: 189, reponses: 42, entretiens: 15, offres: 3 },
  { month: 'Jul', vus: 167, reponses: 38, entretiens: 11, offres: 2 },
  { month: 'Aoû', vus: 226, reponses: 60, entretiens: 21, offres: 4 },
];

export default function AnalyticsContent() {
  const [activeSection, setActiveSection] = useState<'heatmap' | 'ab' | 'funnel'>('heatmap');

  return (
    <div className="space-y-6">
      {/* Tab Nav */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: 'heatmap', label: '🔥 Carte de chaleur', icon: 'FlameIcon' },
          { key: 'ab', label: '⚡ A/B Testing', icon: 'GitCompareIcon' },
          { key: 'funnel', label: '📊 Tunnel de conversion', icon: 'TrendingUpIcon' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-600 transition-all ${
              activeSection === tab.key ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Heatmap */}
      {activeSection === 'heatmap' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-700 text-foreground">Carte de chaleur recruteur</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Où les recruteurs cliquent et combien de temps ils restent</p>
              </div>
              <select className="px-3 py-2 bg-muted border border-border rounded-xl text-xs font-600 text-foreground">
                <option>Portfolio Dev Full-Stack</option>
                <option>Portfolio Ingénieur IA</option>
              </select>
            </div>

            {/* Visual Heatmap */}
            <div className="relative bg-muted/30 rounded-xl overflow-hidden mb-6" style={{ minHeight: 320 }}>
              <div className="absolute inset-0 flex flex-col">
                {heatmapData.map((section, i) => {
                  const intensity = section.clicks / heatmapData[0].clicks;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-6 py-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                      style={{ flex: 1 }}
                    >
                      <div className="w-32 text-xs font-600 text-foreground truncate">{section.section}</div>
                      <div className="flex-1 relative h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className={`h-full rounded-lg transition-all ${section.color} opacity-80`}
                          style={{ width: `${intensity * 100}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-700 text-white drop-shadow">{section.clicks} clics</span>
                        </div>
                      </div>
                      <div className="w-16 text-right text-xs font-600 text-muted-foreground">{section.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span>Très chaud (300+ clics)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span>Chaud (100-300)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Froid (&lt;100)</span>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Durée moy. session', value: '3m 42s', icon: 'ClockIcon', trend: '+12%' },
              { label: 'Taux de rebond', value: '24%', icon: 'LogOutIcon', trend: '-5%' },
              { label: 'Section la + vue', value: 'Projets', icon: 'EyeIcon', trend: '289 clics' },
              { label: 'CTA cliqué', value: '87 fois', icon: 'MousePointerClickIcon', trend: '+18%' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={kpi.icon as any} size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="text-xl font-800 text-foreground">{kpi.value}</p>
                <p className="text-xs text-primary font-600 mt-1">{kpi.trend}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* A/B Testing */}
      {activeSection === 'ab' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-700 text-foreground">A/B Testing de portfolios</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Comparez deux versions du même portfolio sur le même recruteur cible</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-600">
                <Icon name="PlusIcon" size={14} />
                Nouveau test
              </button>
            </div>

            {/* Test Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {abData.map((version, i) => (
                <div key={i} className={`rounded-xl p-5 border-2 ${i === 1 ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-800 ${i === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {version.name.split(' ')[1]}
                      </span>
                      <span className="font-700 text-foreground">{version.name}</span>
                    </div>
                    {i === 1 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-700 rounded-lg">🏆 Gagnant</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Vues', value: version.views, max: 150 },
                      { label: 'Réponses', value: version.responses, max: 40 },
                      { label: 'Entretiens', value: version.interviews, max: 20 },
                    ].map((metric, j) => (
                      <div key={j}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="font-700 text-foreground">{metric.value}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${i === 1 ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                            style={{ width: `${(metric.value / metric.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Taux de conversion</span>
                      <span className={`font-800 ${i === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {((version.interviews / version.views) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={abData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="views" name="Vues" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="responses" name="Réponses" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" name="Entretiens" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Conversion Funnel */}
      {activeSection === 'funnel' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-700 text-foreground">Tunnel de conversion</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Portfolio vu → Réponse → Entretien → Offre</p>
              </div>
            </div>

            {/* Funnel Visual */}
            <div className="space-y-3 mb-8">
              {funnelData.map((stage, i) => {
                const pct = ((stage.value / funnelData[0].value) * 100).toFixed(1);
                const convRate = i > 0 ? ((stage.value / funnelData[i - 1].value) * 100).toFixed(1) : '100';
                return (
                  <div key={i} className="relative">
                    <div className="flex items-center gap-4 mb-1">
                      <span className="text-xs font-600 text-muted-foreground w-28">{stage.name}</span>
                      <span className="text-sm font-800 text-foreground">{stage.value.toLocaleString()}</span>
                      {i > 0 && (
                        <span className="text-xs text-muted-foreground">({convRate}% du précédent)</span>
                      )}
                    </div>
                    <div className="h-10 bg-muted rounded-xl overflow-hidden" style={{ width: '100%' }}>
                      <div
                        className="h-full rounded-xl flex items-center px-4 transition-all"
                        style={{ width: `${pct}%`, backgroundColor: stage.fill }}
                      >
                        <span className="text-white text-xs font-700">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Timeline Chart */}
            <h4 className="font-700 text-foreground text-sm mb-4">Évolution mensuelle</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={conversionTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="vus" name="Vus" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reponses" name="Réponses" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="entretiens" name="Entretiens" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offres" name="Offres" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
