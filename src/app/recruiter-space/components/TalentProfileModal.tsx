'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { Talent } from './TalentCard';

interface TalentProfileModalProps {
  talent: Talent | null;
  onClose: () => void;
  onContact: (talent: Talent) => void;
}

const TABS = [
  { id: 'portfolio', label: 'Portfolio', icon: 'FolderOpenIcon' },
  { id: 'cv', label: 'CV intégré', icon: 'FileTextIcon' },
  { id: 'credentials', label: 'Credentials', icon: 'AwardIcon' },
  { id: 'recs', label: 'Recommandations', icon: 'LinkedinIcon' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function TalentProfileModal({ talent, onClose, onContact }: TalentProfileModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('portfolio');

  if (!talent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-modal w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative h-32 flex-shrink-0">
          <AppImage
            src={talent.coverImage}
            alt={talent.coverAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <Icon name="XIcon" size={16} />
          </button>
          {/* Template badge */}
          <span className="absolute top-3 left-3 text-[10px] font-700 px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
            {talent.portfolioTemplate}
          </span>
        </div>

        {/* Profile info */}
        <div className="px-6 pt-0 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-end gap-4 -mt-8 mb-3">
            <div className="relative flex-shrink-0">
              <AppImage
                src={talent.avatar}
                alt={talent.avatarAlt}
                className="w-16 h-16 rounded-2xl border-2 border-card object-cover shadow-card-md"
              />
              {talent.verified && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="CheckIcon" size={11} className="text-primary-foreground" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-800 text-lg text-foreground">{talent.name}</h2>
                {talent.verified && (
                  <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-primary/10 text-primary">Profil vérifié</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{talent.title}</p>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={() => onContact(talent)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 transition-all"
              >
                <Icon name="MessageCircleIcon" size={15} />
                Contacter
              </button>
              <a
                href={talent.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-all"
              >
                <Icon name="ExternalLinkIcon" size={15} />
                Portfolio live
              </a>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={12} />{talent.location}</span>
            <span className="flex items-center gap-1"><Icon name="BriefcaseIcon" size={12} />{talent.experience} ans d'expérience</span>
            {talent.salary && <span className="flex items-center gap-1"><Icon name="EuroIcon" size={12} />{talent.salary}</span>}
            <span className="flex items-center gap-1"><Icon name="EyeIcon" size={12} />{talent.portfolioViews.toLocaleString()} vues portfolio</span>
            <span className="flex items-center gap-1"><Icon name="DownloadIcon" size={12} />{talent.cvDownloads} téléchargements CV</span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${talent.availability === 'open' ? 'bg-emerald-500' : talent.availability === 'passive' ? 'bg-amber-500' : 'bg-red-500'}`} />
              {talent.availability === 'open' ? 'Disponible' : talent.availability === 'passive' ? 'À l\'écoute' : 'Non disponible'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border flex-shrink-0 px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-600 border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon as any} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-700 text-sm text-foreground mb-2">À propos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{talent.bio}</p>
              </div>

              {/* Top project */}
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="StarIcon" size={14} className="text-amber-500" />
                  <h3 className="font-700 text-sm text-foreground">Projet phare</h3>
                </div>
                <p className="font-600 text-sm text-foreground mb-1">{talent.topProject}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{talent.topProjectDesc}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-700 text-sm text-foreground mb-3">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill) => (
                    <span key={skill} className="text-xs font-600 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground border border-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust indicators */}
              <div>
                <h3 className="font-700 text-sm text-foreground mb-3">Indicateurs de confiance</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <p className="text-2xl font-800 text-primary">{talent.trustScore}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Score confiance</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                    <p className="text-2xl font-800 text-amber-600">{talent.credentials}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Certifications</p>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 text-center">
                    <p className="text-2xl font-800 text-sky-600">{talent.linkedinRecs}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Recs LinkedIn</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cv' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-700 text-foreground">CV intégré au portfolio</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-600 hover:bg-primary/90 transition-all">
                  <Icon name="DownloadIcon" size={13} />
                  Télécharger le CV
                </button>
              </div>

              {/* CV Preview mock */}
              <div className="border border-border rounded-2xl overflow-hidden bg-white">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <AppImage src={talent.avatar} alt={talent.avatarAlt} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h2 className="text-xl font-800 text-gray-900">{talent.name}</h2>
                      <p className="text-gray-600 font-500">{talent.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{talent.location}</span>
                        <span>•</span>
                        <span>{talent.experience} ans d'expérience</span>
                        {talent.salary && <><span>•</span><span>{talent.salary}</span></>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="text-xs font-800 uppercase tracking-widest text-gray-400 mb-2">Résumé</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{talent.bio}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-800 uppercase tracking-widest text-gray-400 mb-2">Compétences clés</h3>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((s) => (
                        <span key={s} className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 font-500">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-800 uppercase tracking-widest text-gray-400 mb-3">Projet phare</h3>
                    <div className="pl-3 border-l-2 border-gray-200">
                      <p className="font-700 text-sm text-gray-800">{talent.topProject}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{talent.topProjectDesc}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
                    <Icon name="ShieldCheckIcon" size={12} className="text-emerald-500" />
                    CV vérifié et synchronisé avec le portfolio — Score de confiance : {talent.trustScore}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Certifications et badges vérifiés de {talent.name}</p>
              {Array.from({ length: talent.credentials }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="AwardIcon" size={20} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-sm text-foreground">
                      {['AWS Solutions Architect', 'Google Cloud Professional', 'Meta React Developer', 'MongoDB Associate', 'Kubernetes Administrator'][i % 5]}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {['Amazon Web Services', 'Google', 'Meta', 'MongoDB Inc.', 'CNCF'][i % 5]} · Délivré en {2024 - i}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-700 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      <Icon name="CheckCircleIcon" size={10} />
                      Vérifié
                    </span>
                    <span className="text-xs font-700 text-primary">{85 + i * 3}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recs' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{talent.linkedinRecs} recommandations LinkedIn vérifiées</p>
              {Array.from({ length: Math.min(talent.linkedinRecs, 4) }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center flex-shrink-0 text-sm font-700 text-sky-600">
                      {['SC', 'MW', 'PS', 'TB'][i]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-700 text-sm text-foreground">
                          {['Sarah Chen', 'Marcus Webb', 'Priya Sharma', 'Tom Benali'][i]}
                        </p>
                        <span className="flex items-center gap-1 text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600">
                          <Icon name="LinkedinIcon" size={9} />
                          Vérifié
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {['CTO chez TechCorp', 'Head of Engineering chez Google', 'VP Product chez Figma', 'Lead Dev chez Stripe'][i]}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{2024 - i}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{['Un talent exceptionnel avec une capacité rare à transformer des problèmes complexes en solutions élégantes. Son travail sur notre infrastructure a réduit les coûts de 40%.', 'Collaborateur brillant, toujours force de proposition. Sa maîtrise technique est impressionnante et sa communication avec les équipes non-techniques est exemplaire.', 'L\'un des meilleurs profils que j\'ai eu la chance de manager. Autonome, rigoureux, et avec une vraie vision produit en plus des compétences techniques.', 'Développeur senior de haut niveau, capable de prendre en main des projets critiques de bout en bout. Je le recommande sans hésitation.'][i]}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
