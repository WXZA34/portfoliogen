'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Block, PortfolioDesign } from './PortfolioEditorContent';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: { bg: string; accent: string; text: string };
  badge?: string;
  blocks: Block[];
  globalStyle: PortfolioDesign['globalStyle'];
}

const TEMPLATES: Template[] = [
  {
    id: 'dark-pro',
    name: 'Dark Pro',
    category: 'Tech',
    description: 'Sombre et percutant, idéal pour les développeurs',
    badge: 'Populaire',
    preview: { bg: '#0f0f1a', accent: '#7c3aed', text: '#ffffff' },
    globalStyle: { primaryColor: '#7c3aed', secondaryColor: '#a78bfa', bgColor: '#0f0f1a', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'md', darkMode: true },
    blocks: [
      { id: 'b1', type: 'hero', content: { name: 'Alex Martin', title: 'Développeur Full-Stack', tagline: 'Code. Scale. Ship.', cta: 'Voir mes projets' }, style: { bgColor: '#0f0f1a', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
      { id: 'b2', type: 'stats', content: { stat1: '8+', label1: 'Années', stat2: '42', label2: 'Projets', stat3: '98%', label3: 'Satisfaction', stat4: '12', label4: 'Clients' }, style: { bgColor: '#7c3aed', textColor: '#ffffff', accentColor: '#a78bfa', padding: 'md', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
      { id: 'b3', type: 'skills', content: { title: 'Stack Technique', skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'] }, style: { bgColor: '#111827', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b4', type: 'projects', content: { title: 'Projets', proj1: 'NeuralCommerce', proj1desc: 'Plateforme e-commerce IA', proj2: 'DistributedDB', proj2desc: 'Orchestrateur Kubernetes' }, style: { bgColor: '#0f0f1a', textColor: '#ffffff', accentColor: '#7c3aed', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b5', type: 'contact', content: { title: 'Contact', email: 'alex@example.com', cta: 'Me contacter' }, style: { bgColor: '#7c3aed', textColor: '#ffffff', accentColor: '#a78bfa', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
    ],
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    category: 'Design',
    description: 'Épuré et élégant, parfait pour les créatifs',
    preview: { bg: '#fafafa', accent: '#111827', text: '#111827' },
    globalStyle: { primaryColor: '#111827', secondaryColor: '#6b7280', bgColor: '#fafafa', fontHeading: 'Manrope', fontBody: 'DM Sans', borderRadius: 'sm', darkMode: false },
    blocks: [
      { id: 'b1', type: 'hero', content: { name: 'Sophie Durand', title: 'Designer UX/UI', tagline: 'Je crée des expériences mémorables.', cta: 'Découvrir mon travail' }, style: { bgColor: '#fafafa', textColor: '#111827', accentColor: '#111827', padding: 'lg', align: 'left', fontFamily: 'Manrope' } },
      { id: 'b2', type: 'about', content: { title: 'Mon approche', text: 'Je conçois des interfaces centrées sur l\'humain, alliant esthétique et fonctionnalité.' }, style: { bgColor: '#ffffff', textColor: '#374151', accentColor: '#111827', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b3', type: 'projects', content: { title: 'Sélection', proj1: 'Redesign App Mobile', proj1desc: 'Refonte UX d\'une app fintech', proj2: 'Design System', proj2desc: 'Système de design pour SaaS B2B' }, style: { bgColor: '#f9fafb', textColor: '#111827', accentColor: '#111827', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b4', type: 'contact', content: { title: 'Travaillons ensemble', email: 'sophie@example.com', cta: 'Démarrer un projet' }, style: { bgColor: '#111827', textColor: '#ffffff', accentColor: '#ffffff', padding: 'lg', align: 'center', fontFamily: 'Manrope' } },
    ],
  },
  {
    id: 'vibrant-creative',
    name: 'Vibrant Creative',
    category: 'Créatif',
    description: 'Coloré et audacieux pour se démarquer',
    badge: 'Nouveau',
    preview: { bg: '#fef3c7', accent: '#f59e0b', text: '#111827' },
    globalStyle: { primaryColor: '#f59e0b', secondaryColor: '#fbbf24', bgColor: '#fffbeb', fontHeading: 'Cabinet Grotesk', fontBody: 'Plus Jakarta Sans', borderRadius: 'lg', darkMode: false },
    blocks: [
      { id: 'b1', type: 'hero', content: { name: 'Lucas Bernard', title: 'Motion Designer & Créatif', tagline: 'Je donne vie à vos idées en mouvement.', cta: 'Voir mes créations' }, style: { bgColor: '#fef3c7', textColor: '#111827', accentColor: '#f59e0b', padding: 'lg', align: 'center', fontFamily: 'Cabinet Grotesk' } },
      { id: 'b2', type: 'stats', content: { stat1: '5+', label1: 'Années', stat2: '80+', label2: 'Vidéos', stat3: '30', label3: 'Clients', stat4: '4', label4: 'Awards' }, style: { bgColor: '#f59e0b', textColor: '#ffffff', accentColor: '#fbbf24', padding: 'md', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
      { id: 'b3', type: 'gallery', content: { title: 'Portfolio Visuel', caption1: 'Spot TV', caption2: 'Motion Branding', caption3: 'Générique Série' }, style: { bgColor: '#fffbeb', textColor: '#111827', accentColor: '#f59e0b', padding: 'lg', align: 'left', fontFamily: 'Plus Jakarta Sans' } },
      { id: 'b4', type: 'cta', content: { title: 'Votre prochain projet ?', subtitle: 'Parlons de votre vision', cta: 'Prendre contact' }, style: { bgColor: '#111827', textColor: '#ffffff', accentColor: '#f59e0b', padding: 'lg', align: 'center', fontFamily: 'Cabinet Grotesk' } },
    ],
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'Business',
    description: 'Professionnel et structuré pour les cadres',
    preview: { bg: '#eff6ff', accent: '#2563eb', text: '#1e3a5f' },
    globalStyle: { primaryColor: '#2563eb', secondaryColor: '#3b82f6', bgColor: '#f8fafc', fontHeading: 'Manrope', fontBody: 'DM Sans', borderRadius: 'sm', darkMode: false },
    blocks: [
      { id: 'b1', type: 'hero', content: { name: 'Marie Leclerc', title: 'Directrice Marketing Digital', tagline: 'Stratégie data-driven, résultats mesurables.', cta: 'Mon parcours' }, style: { bgColor: '#1e3a5f', textColor: '#ffffff', accentColor: '#2563eb', padding: 'lg', align: 'left', fontFamily: 'Manrope' } },
      { id: 'b2', type: 'experience', content: { title: 'Expérience', job1: 'CMO', company1: 'TechCorp', period1: '2022 - Présent', desc1: 'Pilotage de la stratégie marketing globale' }, style: { bgColor: '#ffffff', textColor: '#1e3a5f', accentColor: '#2563eb', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b3', type: 'skills', content: { title: 'Expertises', skills: ['SEO/SEA', 'Growth Hacking', 'Data Analytics', 'Brand Strategy', 'Content Marketing'] }, style: { bgColor: '#eff6ff', textColor: '#1e3a5f', accentColor: '#2563eb', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b4', type: 'contact', content: { title: 'Opportunités', email: 'marie@example.com', linkedin: 'linkedin.com/in/marie-leclerc', cta: 'Discutons' }, style: { bgColor: '#2563eb', textColor: '#ffffff', accentColor: '#ffffff', padding: 'lg', align: 'center', fontFamily: 'Manrope' } },
    ],
  },
  {
    id: 'gradient-modern',
    name: 'Gradient Modern',
    category: 'Tech',
    description: 'Dégradés modernes pour un look premium',
    badge: 'Premium',
    preview: { bg: '#f5f3ff', accent: '#8b5cf6', text: '#1a1a2e' },
    globalStyle: { primaryColor: '#8b5cf6', secondaryColor: '#ec4899', bgColor: '#fafafa', fontHeading: 'Plus Jakarta Sans', fontBody: 'DM Sans', borderRadius: 'lg', darkMode: false },
    blocks: [
      { id: 'b1', type: 'hero', content: { name: 'Thomas Petit', title: 'Ingénieur IA & Data Scientist', tagline: 'Transformer les données en décisions.', cta: 'Explorer mes projets' }, style: { bgColor: '#f5f3ff', textColor: '#1a1a2e', accentColor: '#8b5cf6', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
      { id: 'b2', type: 'about', content: { title: 'Ma mission', text: 'Spécialisé en ML et NLP, je construis des modèles qui créent de la valeur business concrète.' }, style: { bgColor: '#ffffff', textColor: '#374151', accentColor: '#8b5cf6', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b3', type: 'projects', content: { title: 'Recherches & Projets', proj1: 'LLM Fine-tuning', proj1desc: 'Adaptation de modèles pour le secteur légal', proj2: 'Predictive Analytics', proj2desc: 'Prévision de churn pour SaaS B2B' }, style: { bgColor: '#f5f3ff', textColor: '#1a1a2e', accentColor: '#8b5cf6', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b4', type: 'testimonials', content: { title: 'Recommandations', quote1: 'Thomas a transformé notre approche data.', author1: 'CEO DataCorp', role1: 'Directeur Général' }, style: { bgColor: '#ffffff', textColor: '#374151', accentColor: '#8b5cf6', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b5', type: 'cta', content: { title: 'Collaborons', subtitle: 'Votre prochain projet IA m\'intéresse', cta: 'Prendre contact' }, style: { bgColor: '#8b5cf6', textColor: '#ffffff', accentColor: '#ec4899', padding: 'lg', align: 'center', fontFamily: 'Plus Jakarta Sans' } },
    ],
  },
  {
    id: 'editorial-bold',
    name: 'Editorial Bold',
    category: 'Créatif',
    description: 'Typographie forte, style magazine',
    preview: { bg: '#fff7ed', accent: '#ea580c', text: '#1c1917' },
    globalStyle: { primaryColor: '#ea580c', secondaryColor: '#fb923c', bgColor: '#fff7ed', fontHeading: 'Fraunces', fontBody: 'DM Sans', borderRadius: 'none', darkMode: false },
    blocks: [
      { id: 'b1', type: 'hero', content: { name: 'Camille Rousseau', title: 'Journaliste & Rédactrice', tagline: 'Les mots qui font la différence.', cta: 'Lire mes articles' }, style: { bgColor: '#fff7ed', textColor: '#1c1917', accentColor: '#ea580c', padding: 'lg', align: 'left', fontFamily: 'Fraunces' } },
      { id: 'b2', type: 'about', content: { title: 'Plume & Engagement', text: '10 ans d\'expérience en presse écrite et digitale. Spécialisée tech, société et innovation.' }, style: { bgColor: '#ffffff', textColor: '#1c1917', accentColor: '#ea580c', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b3', type: 'projects', content: { title: 'Publications', proj1: 'Le Monde Numérique', proj1desc: 'Chronique hebdomadaire tech', proj2: 'Enquête IA & Société', proj2desc: 'Dossier spécial 40 pages' }, style: { bgColor: '#fff7ed', textColor: '#1c1917', accentColor: '#ea580c', padding: 'lg', align: 'left', fontFamily: 'DM Sans' } },
      { id: 'b4', type: 'contact', content: { title: 'Propositions', email: 'camille@example.com', cta: 'Collaborer' }, style: { bgColor: '#ea580c', textColor: '#ffffff', accentColor: '#ffffff', padding: 'lg', align: 'center', fontFamily: 'Fraunces' } },
    ],
  },
];

const CATEGORIES = ['Tous', 'Tech', 'Design', 'Créatif', 'Business'];

interface TemplateLibraryProps {
  onApply: (templateId: string, blocks: Block[], globalStyle: PortfolioDesign['globalStyle']) => void;
  currentTemplateId: string;
}

export default function TemplateLibrary({ onApply, currentTemplateId }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = activeCategory === 'Tous' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="p-3 space-y-3">
      <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider px-1">Bibliothèque de Templates</p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-full text-xs font-600 transition-all ${
              activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="space-y-2">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            onMouseEnter={() => setHoveredId(tpl.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 ${
              currentTemplateId === tpl.id ? 'border-primary' : 'border-border hover:border-primary/40'
            }`}
          >
            {/* Visual preview */}
            <div
              className="h-24 relative overflow-hidden"
              style={{ backgroundColor: tpl.preview.bg }}
            >
              {/* Simulated layout lines */}
              <div className="absolute inset-0 p-3 flex flex-col gap-1.5">
                <div className="h-3 rounded" style={{ backgroundColor: tpl.preview.text, opacity: 0.8, width: '60%' }} />
                <div className="h-2 rounded" style={{ backgroundColor: tpl.preview.text, opacity: 0.4, width: '80%' }} />
                <div className="h-2 rounded" style={{ backgroundColor: tpl.preview.text, opacity: 0.3, width: '50%' }} />
                <div className="flex gap-1 mt-1">
                  <div className="h-5 rounded-md flex-1" style={{ backgroundColor: tpl.preview.accent, opacity: 0.9 }} />
                  <div className="h-5 rounded-md flex-1" style={{ backgroundColor: tpl.preview.accent, opacity: 0.5 }} />
                  <div className="h-5 rounded-md flex-1" style={{ backgroundColor: tpl.preview.accent, opacity: 0.3 }} />
                </div>
              </div>

              {/* Badge */}
              {tpl.badge && (
                <span
                  className="absolute top-2 right-2 px-1.5 py-0.5 text-xs font-700 rounded-md text-white"
                  style={{ backgroundColor: tpl.preview.accent }}
                >
                  {tpl.badge}
                </span>
              )}

              {/* Active indicator */}
              {currentTemplateId === tpl.id && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="CheckIcon" size={11} className="text-white" />
                </div>
              )}

              {/* Hover overlay */}
              {hoveredId === tpl.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => onApply(tpl.id, tpl.blocks, tpl.globalStyle)}
                    className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-700 hover:bg-gray-100 transition-all"
                  >
                    Appliquer
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2.5 bg-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-700 text-foreground">{tpl.name}</p>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{tpl.category}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{tpl.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
