'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Modal from '@/components/ui/Modal';
import { useLanguage } from '@/lib/LanguageContext';

interface Persona {
  id: string;
  name: string;
  targetRole: string;
  industry: string;
  toneOfVoice: string;
  expectations: string[];
  portfoliosLinked: number;
  color: string;
  emoji: string;
}

const personasData: Persona[] = [
  {
    id: 'persona-001',
    name: 'Recruteur Tech Senior',
    targetRole: 'Lead Developer / Architecte',
    industry: 'Tech & SaaS',
    toneOfVoice: 'Précis, technique, orienté résultats',
    expectations: ['Stack technique détaillée', 'KPIs mesurables', 'Liens GitHub actifs', 'Architecture des projets', 'Contributions open source'],
    portfoliosLinked: 2,
    color: 'bg-primary/10 border-primary/20',
    emoji: '💻',
  },
  {
    id: 'persona-002',
    name: 'Fondateur Startup IA',
    targetRole: 'CTO / ML Engineer',
    industry: 'Intelligence Artificielle',
    toneOfVoice: 'Visionnaire, pragmatique, orienté impact',
    expectations: ['Expérience ML/LLM', 'Capacité à scaler', 'Mindset produit', 'Vitesse d\'exécution', 'Gestion de l\'incertitude'],
    portfoliosLinked: 1,
    color: 'bg-accent/10 border-accent/20',
    emoji: '🚀',
  },
  {
    id: 'persona-003',
    name: 'DRH Grand Groupe',
    targetRole: 'Ingénieur Senior / Manager',
    industry: 'Industrie & Aéronautique',
    toneOfVoice: 'Formel, structuré, axé compétences certifiées',
    expectations: ['Diplômes et certifications', 'Stabilité du parcours', 'Soft skills démontrés', 'Références vérifiables', 'Conformité aux normes'],
    portfoliosLinked: 1,
    color: 'bg-info/10 border-info/20',
    emoji: '🏢',
  },
  {
    id: 'persona-004',
    name: 'Directeur Artistique',
    targetRole: 'Designer / Créatif Senior',
    industry: 'Mode & Design',
    toneOfVoice: 'Esthétique, narratif, émotionnel',
    expectations: ['Portfolio visuel fort', 'Cohérence de l\'identité', 'Processus créatif visible', 'Collaborations notables', 'Sens du détail'],
    portfoliosLinked: 1,
    color: 'bg-warning/10 border-warning/20',
    emoji: '🎨',
  },
  {
    id: 'persona-005',
    name: 'Rédacteur en Chef',
    targetRole: 'Journaliste / Rédacteur',
    industry: 'Médias & Presse',
    toneOfVoice: 'Clair, percutant, factuel',
    expectations: ['Sujets traités et publications', 'Ligne éditoriale', 'Capacité d\'investigation', 'Adaptabilité des formats', 'Réseau de sources'],
    portfoliosLinked: 0,
    color: 'bg-negative/10 border-negative/20',
    emoji: '📰',
  },
];

export default function PersonasPanel() {
  const { t } = useLanguage();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-700 text-foreground">{t.cvtheque.personas.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.cvtheque.personas.subtitle}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press"
        >
          <Icon name="PlusIcon" size={15} />
          {t.cvtheque.personas.addPersona}
        </button>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {personasData.map((persona) => (
          <div
            key={persona.id}
            onClick={() => setSelectedPersona(persona)}
            className={`bg-card border rounded-xl p-5 shadow-card card-hover cursor-pointer group ${persona.color}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-xl shadow-sm">
                  {persona.emoji}
                </div>
                <div>
                  <h4 className="text-sm font-700 text-foreground leading-tight">{persona.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{persona.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                  <Icon name="PencilIcon" size={13} />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1">{t.cvtheque.personas.targetRole}</p>
              <p className="text-sm font-600 text-foreground">{persona.targetRole}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-2">{t.cvtheque.personas.keyExpectations}</p>
              <div className="flex flex-wrap gap-1.5">
                {persona.expectations.slice(0, 3).map((exp, i) => (
                  <span key={i} className="px-2 py-0.5 bg-card text-foreground text-xs font-500 rounded-full border border-border">
                    {exp}
                  </span>
                ))}
                {persona.expectations.length > 3 && (
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-500 rounded-full">
                    +{persona.expectations.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="LayoutTemplateIcon" size={12} />
                <span>{persona.portfoliosLinked} {t.cvtheque.personas.portfoliosLinked}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="MessageSquareIcon" size={12} />
                <span className="italic truncate max-w-[120px]">{persona.toneOfVoice.split(',')[0]}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add Persona Card */}
        <div
          onClick={() => setShowAddModal(true)}
          className="bg-card border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-secondary/30 transition-all duration-200 min-h-[200px]"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Icon name="PlusIcon" size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-600 text-muted-foreground">{t.cvtheque.personas.addPersona}</p>
        </div>
      </div>

      {/* Persona Detail Modal */}
      {selectedPersona && (
        <Modal
          open={!!selectedPersona}
          onClose={() => setSelectedPersona(null)}
          title={selectedPersona.name}
          subtitle={`${selectedPersona.targetRole} · ${selectedPersona.industry}`}
          size="lg"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1">{t.cvtheque.personas.targetRole}</p>
                <p className="text-sm font-700 text-foreground">{selectedPersona.targetRole}</p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1">{t.cvtheque.personas.industry}</p>
                <p className="text-sm font-700 text-foreground">{selectedPersona.industry}</p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-xl">
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-2">{t.cvtheque.personas.toneOfVoice}</p>
              <p className="text-sm text-foreground italic">{selectedPersona.toneOfVoice}</p>
            </div>

            <div>
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-3">{t.cvtheque.personas.keyExpectations}</p>
              <div className="space-y-2">
                {selectedPersona.expectations.map((exp, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="CheckIcon" size={11} className="text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Icon name="LayoutTemplateIcon" size={16} className="text-primary" />
                <span className="text-sm font-600 text-foreground">{selectedPersona.portfoliosLinked} {t.cvtheque.personas.portfoliosLinked}</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 transition-all">
                <Icon name="PlusIcon" size={12} />
                {t.studio.newPortfolio}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
