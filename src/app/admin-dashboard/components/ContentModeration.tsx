'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ModerationTab = 'portfolios' | 'jobs' | 'templates' | 'credentials';

interface ContentItem {
  id: string;
  title: string;
  author: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  type: string;
  reason?: string;
  preview?: string;
  views?: number;
  category?: string;
  // Portfolio specific
  skills?: string[];
  projects?: { name: string; description: string; tech: string[] }[];
  experience?: string;
  education?: string;
  location?: string;
  email?: string;
  // Job specific
  company?: string;
  salary?: string;
  contractType?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  remote?: boolean;
  // Template specific
  price?: number;
  rating?: number;
  downloads?: number;
  tags?: string[];
  sections?: string[];
  colors?: string[];
  previewUrl?: string;
}

const PORTFOLIOS: ContentItem[] = [
  {
    id: 'p1', title: 'Portfolio UX/UI - Marie Dupont', author: 'Marie Dupont', submittedAt: 'il y a 2h',
    status: 'pending', type: 'portfolio', category: 'Design', views: 0,
    email: 'marie.dupont@email.com', location: 'Paris, France',
    experience: '5 ans d\'expérience en design UX/UI',
    education: 'Master Design Numérique - ENSAD Paris (2019)',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design System'],
    projects: [
      { name: 'Refonte App Mobile BNP', description: 'Redesign complet de l\'application mobile avec amélioration du taux de conversion de 34%', tech: ['Figma', 'Principle'] },
      { name: 'Design System Startup FinTech', description: 'Création d\'un design system complet avec 200+ composants', tech: ['Figma', 'Storybook'] },
      { name: 'E-commerce Fashion Brand', description: 'UX research et wireframing pour une boutique mode premium', tech: ['Adobe XD', 'Maze'] },
    ],
  },
  {
    id: 'p2', title: 'Dev Full-Stack - Karim Benali', author: 'Karim Benali', submittedAt: 'il y a 5h',
    status: 'flagged', type: 'portfolio', reason: 'Contenu inapproprié signalé', category: 'Développement', views: 124,
    email: 'k.benali@email.com', location: 'Lyon, France',
    experience: '3 ans développeur full-stack',
    education: 'Licence Informatique - Université Lyon 1 (2021)',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
    projects: [
      { name: 'Plateforme SaaS RH', description: 'Application de gestion RH avec 500+ utilisateurs actifs', tech: ['React', 'Node.js', 'PostgreSQL'] },
      { name: 'API REST Microservices', description: 'Architecture microservices pour e-commerce haute disponibilité', tech: ['Node.js', 'Docker', 'Redis'] },
    ],
  },
  {
    id: 'p3', title: 'Data Science - Léa Rousseau', author: 'Léa Rousseau', submittedAt: 'il y a 1j',
    status: 'approved', type: 'portfolio', category: 'Data', views: 892,
    email: 'lea.rousseau@email.com', location: 'Bordeaux, France',
    experience: '4 ans Data Scientist',
    education: 'Master Data Science - Université Paris-Saclay (2020)',
    skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Tableau', 'Machine Learning'],
    projects: [
      { name: 'Modèle prédictif churn', description: 'Réduction du churn de 22% grâce à un modèle ML prédictif', tech: ['Python', 'Scikit-learn'] },
    ],
  },
  {
    id: 'p4', title: 'Marketing Digital - Paul Girard', author: 'Paul Girard', submittedAt: 'il y a 2j',
    status: 'approved', type: 'portfolio', category: 'Marketing', views: 456,
    email: 'paul.girard@email.com', location: 'Nantes, France',
    experience: '6 ans Marketing Digital',
    education: 'Master Marketing - ESCP Business School (2018)',
    skills: ['SEO', 'Google Ads', 'Meta Ads', 'Analytics', 'CRM', 'Content Marketing'],
    projects: [
      { name: 'Campagne acquisition B2B', description: 'ROI x3.5 sur campagne LinkedIn Ads pour SaaS B2B', tech: ['LinkedIn Ads', 'HubSpot'] },
    ],
  },
];

const JOB_OFFERS: ContentItem[] = [
  {
    id: 'j1', title: 'Développeur React Senior - TechCorp', author: 'TechCorp', submittedAt: 'il y a 1h',
    status: 'pending', type: 'job', category: 'CDI', views: 0,
    company: 'TechCorp SAS', location: 'Paris 8e (Hybride)', salary: '65 000 – 80 000 € / an',
    contractType: 'CDI', remote: true,
    description: 'Nous recherchons un développeur React Senior pour rejoindre notre équipe produit en pleine croissance. Vous travaillerez sur notre plateforme SaaS utilisée par 50 000+ entreprises en Europe.',
    requirements: ['5+ ans d\'expérience React', 'Maîtrise TypeScript', 'Expérience avec Next.js', 'Connaissance des tests unitaires (Jest, RTL)', 'Bonne communication en anglais'],
    benefits: ['Télétravail 3j/semaine', 'Mutuelle premium', 'RTT', 'Budget formation 2000€/an', 'Stock options'],
  },
  {
    id: 'j2', title: 'Chef de Projet Digital - Agence XYZ', author: 'Agence XYZ', submittedAt: 'il y a 3h',
    status: 'pending', type: 'job', category: 'CDI', views: 0,
    company: 'Agence XYZ', location: 'Lyon (Présentiel)', salary: '45 000 – 55 000 € / an',
    contractType: 'CDI', remote: false,
    description: 'L\'Agence XYZ, spécialisée en transformation digitale, recrute un Chef de Projet Digital pour piloter des projets web et mobile pour nos clients grands comptes.',
    requirements: ['3+ ans gestion de projet digital', 'Méthodes Agile/Scrum', 'Maîtrise des outils de gestion (Jira, Notion)', 'Sens du client et communication'],
    benefits: ['Tickets restaurant', 'Mutuelle', 'Environnement startup'],
  },
  {
    id: 'j3', title: 'Data Analyst - BNP Paribas', author: 'BNP Paribas', submittedAt: 'il y a 6h',
    status: 'approved', type: 'job', category: 'CDI', views: 234,
    company: 'BNP Paribas', location: 'Paris La Défense (Hybride)', salary: '50 000 – 60 000 € / an',
    contractType: 'CDI', remote: true,
    description: 'BNP Paribas recrute un Data Analyst pour rejoindre la direction Data & Analytics. Vous analyserez les données clients pour améliorer nos produits financiers.',
    requirements: ['SQL avancé', 'Python ou R', 'Tableau ou Power BI', 'Expérience secteur financier appréciée'],
    benefits: ['Intéressement', 'Plan épargne entreprise', 'Télétravail 2j/semaine', 'CE avantageux'],
  },
  {
    id: 'j4', title: 'Offre suspecte - Inconnu', author: 'Inconnu', submittedAt: 'il y a 8h',
    status: 'flagged', type: 'job', reason: 'Offre potentiellement frauduleuse', category: 'Inconnu', views: 45,
    company: 'Société Inconnue', location: 'Non précisé', salary: '10 000 € / mois garanti',
    contractType: 'Inconnu', remote: true,
    description: 'Gagnez 10 000€ par mois depuis chez vous ! Aucune expérience requise. Travaillez seulement 2h par jour. Rejoignez notre réseau de distribution internationale.',
    requirements: ['Aucune expérience requise', 'Avoir un compte bancaire', 'Être disponible immédiatement'],
    benefits: ['Revenus illimités', 'Liberté totale'],
  },
];

const TEMPLATES: ContentItem[] = [
  {
    id: 't1', title: 'Minimal Pro v2', author: 'DesignStudio', submittedAt: 'il y a 4h',
    status: 'pending', type: 'template', category: 'Minimaliste',
    price: 29, rating: 0, downloads: 0,
    tags: ['Minimaliste', 'Professionnel', 'Clean', 'Responsive'],
    sections: ['Hero', 'À propos', 'Compétences', 'Projets', 'Expérience', 'Contact'],
    colors: ['#FFFFFF', '#1A1A1A', '#6366F1', '#F8F8F8'],
    description: 'Template minimaliste et élégant pour professionnels créatifs. Design épuré avec une typographie soignée et une mise en page aérée.',
  },
  {
    id: 't2', title: 'Creative Bold', author: 'CreativeAgency', submittedAt: 'il y a 1j',
    status: 'pending', type: 'template', category: 'Créatif',
    price: 49, rating: 0, downloads: 0,
    tags: ['Créatif', 'Coloré', 'Animé', 'Portfolio'],
    sections: ['Splash Screen', 'About', 'Work', 'Skills', 'Blog', 'Contact'],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766'],
    description: 'Template audacieux avec animations CSS avancées et palette de couleurs vibrantes. Idéal pour les créatifs qui veulent se démarquer.',
  },
  {
    id: 't3', title: 'Corporate Clean', author: 'ProDesigns', submittedAt: 'il y a 2j',
    status: 'approved', type: 'template', category: 'Corporate',
    price: 39, rating: 4.8, downloads: 1240,
    tags: ['Corporate', 'Professionnel', 'B2B', 'Sérieux'],
    sections: ['Header', 'Summary', 'Experience', 'Education', 'Skills', 'References'],
    colors: ['#003366', '#FFFFFF', '#0066CC', '#F5F5F5'],
    description: 'Template corporate sobre et professionnel. Parfait pour les cadres et professionnels du monde de l\'entreprise.',
  },
  {
    id: 't4', title: 'Dark Portfolio', author: 'DarkThemes', submittedAt: 'il y a 3j',
    status: 'rejected', type: 'template', reason: 'Qualité insuffisante', category: 'Dark',
    price: 19, rating: 2.1, downloads: 45,
    tags: ['Dark', 'Développeur', 'Tech'],
    sections: ['Hero', 'Projects', 'Skills'],
    colors: ['#0D0D0D', '#1A1A1A', '#00FF88'],
    description: 'Template sombre pour développeurs. Sections limitées et qualité de code insuffisante selon nos standards.',
  },
];

const CREDENTIALS: ContentItem[] = [
  { id: 'c1', title: 'AWS Solutions Architect - Thomas M.', author: 'Thomas Moreau', submittedAt: 'il y a 1h', status: 'pending', type: 'credential', category: 'Cloud' },
  { id: 'c2', title: 'Google Analytics Certified - Sophie L.', author: 'Sophie Laurent', submittedAt: 'il y a 3h', status: 'pending', type: 'credential', category: 'Marketing' },
  { id: 'c3', title: 'PMP Certification - Antoine B.', author: 'Antoine Bernard', submittedAt: 'il y a 5h', status: 'pending', type: 'credential', category: 'Management' },
  { id: 'c4', title: 'Scrum Master - Léa R.', author: 'Léa Rousseau', submittedAt: 'il y a 1j', status: 'approved', type: 'credential', category: 'Agile' },
];

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-500/10', icon: 'ClockIcon' },
  approved: { label: 'Approuvé', color: 'text-emerald-600', bg: 'bg-emerald-500/10', icon: 'CheckCircleIcon' },
  rejected: { label: 'Rejeté', color: 'text-rose-600', bg: 'bg-rose-500/10', icon: 'XCircleIcon' },
  flagged: { label: 'Signalé', color: 'text-orange-600', bg: 'bg-orange-500/10', icon: 'AlertTriangleIcon' },
};

const TABS: { id: ModerationTab; label: string; icon: string; data: ContentItem[] }[] = [
  { id: 'portfolios', label: 'Portfolios', icon: 'LayoutTemplateIcon', data: PORTFOLIOS },
  { id: 'jobs', label: 'Offres d\'emploi', icon: 'BriefcaseIcon', data: JOB_OFFERS },
  { id: 'templates', label: 'Templates', icon: 'Layers2Icon', data: TEMPLATES },
  { id: 'credentials', label: 'Credentials', icon: 'ShieldCheckIcon', data: CREDENTIALS },
];

// ─── Portfolio Detail Modal ───────────────────────────────────────────────────
function PortfolioDetailModal({ item, onClose, onApprove, onReject }: { item: ContentItem; onClose: () => void; onApprove: () => void; onReject: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'review'>('overview');
  const statusCfg = STATUS_CONFIG[item.status];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Icon name="LayoutTemplateIcon" size={16} className="text-rose-500" />
            </div>
            <div>
              <h3 className="font-700 text-foreground text-sm">Détail du portfolio</h3>
              <p className="text-xs text-muted-foreground">Vérification de conformité</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
              <Icon name={statusCfg.icon as any} size={11} />
              {statusCfg.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-all">
              <Icon name="XIcon" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Author info */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-700 text-lg">
              {item.author.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-700 text-foreground">{item.author}</p>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                {item.email && <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="MailIcon" size={11} />{item.email}</span>}
                {item.location && <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="MapPinIcon" size={11} />{item.location}</span>}
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="ClockIcon" size={11} />Soumis {item.submittedAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.category && <span className="text-xs font-600 px-2.5 py-1 rounded-lg bg-card border border-border text-foreground">{item.category}</span>}
              {item.views !== undefined && item.views > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="EyeIcon" size={11} />{item.views} vues</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-border flex-shrink-0">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: 'UserIcon' },
            { id: 'projects', label: 'Projets', icon: 'FolderIcon' },
            { id: 'review', label: 'Vérification', icon: 'ShieldCheckIcon' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-600 rounded-t-lg border-b-2 transition-all -mb-px ${
                activeTab === tab.id ? 'border-rose-500 text-rose-600' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon as any} size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {activeTab === 'overview' && (
            <>
              {item.experience && (
                <div className="bg-muted/40 rounded-xl p-4">
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-1.5">Expérience</p>
                  <p className="text-sm text-foreground">{item.experience}</p>
                </div>
              )}
              {item.education && (
                <div className="bg-muted/40 rounded-xl p-4">
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-1.5">Formation</p>
                  <p className="text-sm text-foreground">{item.education}</p>
                </div>
              )}
              {item.skills && item.skills.length > 0 && (
                <div>
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Compétences</p>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-600">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.reason && (
                <div className="px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <p className="text-xs font-700 text-orange-700 flex items-start gap-1.5">
                    <Icon name="AlertTriangleIcon" size={13} className="flex-shrink-0 mt-0.5" />
                    Signalement : {item.reason}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-3">
              {item.projects && item.projects.length > 0 ? item.projects.map((project, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-700 text-foreground">{project.name}</p>
                    <Icon name="ExternalLinkIcon" size={13} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-muted text-xs font-600 text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Icon name="FolderIcon" size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Aucun projet renseigné</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-3">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide">Checklist de conformité</p>
              {[
                { label: 'Informations personnelles complètes', ok: !!(item.email && item.location) },
                { label: 'Expérience professionnelle renseignée', ok: !!item.experience },
                { label: 'Formation académique renseignée', ok: !!item.education },
                { label: 'Compétences listées', ok: !!(item.skills && item.skills.length > 0) },
                { label: 'Au moins un projet présenté', ok: !!(item.projects && item.projects.length > 0) },
                { label: 'Aucun signalement actif', ok: !item.reason },
              ].map((check, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${check.ok ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${check.ok ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                    <Icon name={check.ok ? 'CheckIcon' : 'XIcon'} size={12} className={check.ok ? 'text-emerald-600' : 'text-rose-600'} />
                  </div>
                  <p className={`text-xs font-600 ${check.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{check.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {(item.status === 'pending' || item.status === 'flagged') && (
          <div className="px-6 py-4 border-t border-border flex gap-2 flex-shrink-0">
            <button onClick={onApprove} className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
              <Icon name="CheckIcon" size={14} />
              Approuver le portfolio
            </button>
            <button onClick={onReject} className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-sm font-600 text-rose-600 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
              <Icon name="XIcon" size={14} />
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Job Detail Modal ─────────────────────────────────────────────────────────
function JobDetailModal({ item, onClose, onApprove, onReject }: { item: ContentItem; onClose: () => void; onApprove: () => void; onReject: () => void }) {
  const [activeTab, setActiveTab] = useState<'details' | 'requirements' | 'review'>('details');
  const statusCfg = STATUS_CONFIG[item.status];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Icon name="BriefcaseIcon" size={16} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-700 text-foreground text-sm">Détail de l'offre d'emploi</h3>
              <p className="text-xs text-muted-foreground">Vérification de conformité</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
              <Icon name={statusCfg.icon as any} size={11} />
              {statusCfg.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-all">
              <Icon name="XIcon" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Company info */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border flex-shrink-0">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-700 text-lg flex-shrink-0">
              {(item.company || item.author).charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-700 text-foreground">{item.title}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="BuildingIcon" size={11} />{item.company || item.author}</span>
                {item.location && <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="MapPinIcon" size={11} />{item.location}</span>}
                {item.salary && <span className="text-xs font-600 text-emerald-600 flex items-center gap-1"><Icon name="BanknoteIcon" size={11} />{item.salary}</span>}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {item.contractType && <span className="text-[10px] font-600 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600">{item.contractType}</span>}
                {item.remote && <span className="text-[10px] font-600 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600">Télétravail</span>}
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="ClockIcon" size={11} />Soumis {item.submittedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-border flex-shrink-0">
          {[
            { id: 'details', label: 'Description', icon: 'FileTextIcon' },
            { id: 'requirements', label: 'Prérequis & Avantages', icon: 'ListChecksIcon' },
            { id: 'review', label: 'Vérification', icon: 'ShieldCheckIcon' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-600 rounded-t-lg border-b-2 transition-all -mb-px ${
                activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon as any} size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {activeTab === 'details' && (
            <>
              {item.description && (
                <div>
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Description du poste</p>
                  <div className="bg-muted/40 rounded-xl p-4">
                    <p className="text-sm text-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )}
              {item.reason && (
                <div className="px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <p className="text-xs font-700 text-orange-700 flex items-start gap-1.5">
                    <Icon name="AlertTriangleIcon" size={13} className="flex-shrink-0 mt-0.5" />
                    Signalement : {item.reason}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-4">
              {item.requirements && item.requirements.length > 0 && (
                <div>
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Prérequis</p>
                  <div className="space-y-2">
                    {item.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-muted/40 rounded-xl">
                        <Icon name="CheckCircleIcon" size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {item.benefits && item.benefits.length > 0 && (
                <div>
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Avantages</p>
                  <div className="space-y-2">
                    {item.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <Icon name="StarIcon" size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-3">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide">Checklist de conformité</p>
              {[
                { label: 'Entreprise identifiée', ok: !!(item.company && item.company !== 'Société Inconnue') },
                { label: 'Localisation précisée', ok: !!(item.location && item.location !== 'Non précisé') },
                { label: 'Salaire raisonnable (< 8 000€/mois)', ok: !item.salary?.includes('10 000') },
                { label: 'Description du poste complète', ok: !!(item.description && item.description.length > 100) },
                { label: 'Prérequis listés', ok: !!(item.requirements && item.requirements.length > 0) },
                { label: 'Aucun signalement de fraude', ok: !item.reason },
              ].map((check, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${check.ok ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${check.ok ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                    <Icon name={check.ok ? 'CheckIcon' : 'XIcon'} size={12} className={check.ok ? 'text-emerald-600' : 'text-rose-600'} />
                  </div>
                  <p className={`text-xs font-600 ${check.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{check.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {(item.status === 'pending' || item.status === 'flagged') && (
          <div className="px-6 py-4 border-t border-border flex gap-2 flex-shrink-0">
            <button onClick={onApprove} className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
              <Icon name="CheckIcon" size={14} />
              Approuver l'offre
            </button>
            <button onClick={onReject} className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-sm font-600 text-rose-600 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
              <Icon name="XIcon" size={14} />
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Template Detail Modal ────────────────────────────────────────────────────
function TemplateDetailModal({ item, onClose, onApprove, onReject }: { item: ContentItem; onClose: () => void; onApprove: () => void; onReject: () => void }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'review'>('preview');
  const statusCfg = STATUS_CONFIG[item.status];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Icon name="Layers2Icon" size={16} className="text-purple-500" />
            </div>
            <div>
              <h3 className="font-700 text-foreground text-sm">Détail du template</h3>
              <p className="text-xs text-muted-foreground">Marketplace — Vérification qualité</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
              <Icon name={statusCfg.icon as any} size={11} />
              {statusCfg.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-all">
              <Icon name="XIcon" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Template info bar */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-700 text-foreground">{item.title}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="UserIcon" size={11} />Par {item.author}</span>
                {item.category && <span className="text-xs font-600 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600">{item.category}</span>}
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="ClockIcon" size={11} />Soumis {item.submittedAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.price !== undefined && (
                <div className="text-center">
                  <p className="text-lg font-800 text-foreground">{item.price}€</p>
                  <p className="text-[10px] text-muted-foreground">Prix</p>
                </div>
              )}
              {item.downloads !== undefined && item.downloads > 0 && (
                <div className="text-center">
                  <p className="text-lg font-800 text-foreground">{item.downloads}</p>
                  <p className="text-[10px] text-muted-foreground">Téléchargements</p>
                </div>
              )}
              {item.rating !== undefined && item.rating > 0 && (
                <div className="text-center">
                  <p className="text-lg font-800 text-foreground flex items-center gap-1"><Icon name="StarIcon" size={14} className="text-amber-500" />{item.rating}</p>
                  <p className="text-[10px] text-muted-foreground">Note</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-border flex-shrink-0">
          {[
            { id: 'preview', label: 'Aperçu', icon: 'EyeIcon' },
            { id: 'details', label: 'Détails', icon: 'InfoIcon' },
            { id: 'review', label: 'Vérification', icon: 'ShieldCheckIcon' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-600 rounded-t-lg border-b-2 transition-all -mb-px ${
                activeTab === tab.id ? 'border-purple-500 text-purple-600' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon as any} size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {activeTab === 'preview' && (
            <>
              {/* Mock template preview */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="h-8 flex items-center gap-1.5 px-3 bg-muted border-b border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-muted-foreground ml-2">Aperçu — {item.title}</span>
                </div>
                <div className="p-6" style={{ background: item.colors?.[0] || '#fff', minHeight: '200px' }}>
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-800" style={{ background: item.colors?.[2] || '#6366F1', color: '#fff' }}>
                      {item.author.charAt(0)}
                    </div>
                    <div className="text-center">
                      <div className="h-4 rounded-full mx-auto mb-2 w-32" style={{ background: item.colors?.[1] || '#1A1A1A', opacity: 0.8 }} />
                      <div className="h-2.5 rounded-full mx-auto w-48" style={{ background: item.colors?.[1] || '#1A1A1A', opacity: 0.3 }} />
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {(item.skills || ['Skill 1', 'Skill 2', 'Skill 3']).slice(0, 4).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-600" style={{ background: item.colors?.[2] || '#6366F1', color: '#fff', opacity: 0.9 }}>{s}</span>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      {[80, 60, 90].map((w, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-1.5 rounded-full flex-1 bg-black/10">
                            <div className="h-full rounded-full" style={{ width: `${w}%`, background: item.colors?.[2] || '#6366F1' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Color palette */}
              {item.colors && (
                <div>
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Palette de couleurs</p>
                  <div className="flex gap-2">
                    {item.colors.map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-xl border border-border shadow-sm" style={{ background: color }} />
                        <span className="text-[9px] text-muted-foreground font-600">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'details' && (
            <>
              {item.description && (
                <div className="bg-muted/40 rounded-xl p-4">
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-1.5">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{item.description}</p>
                </div>
              )}
              {item.sections && item.sections.length > 0 && (
                <div>
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Sections incluses ({item.sections.length})</p>
                  <div className="grid grid-cols-2 gap-2">
                    {item.sections.map((section, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-lg">
                        <Icon name="LayoutIcon" size={12} className="text-purple-500" />
                        <span className="text-xs font-600 text-foreground">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 text-xs font-600">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {item.reason && (
                <div className="px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <p className="text-xs font-700 text-orange-700 flex items-start gap-1.5">
                    <Icon name="AlertTriangleIcon" size={13} className="flex-shrink-0 mt-0.5" />
                    Motif de rejet : {item.reason}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'review' && (
            <div className="space-y-3">
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wide">Checklist qualité marketplace</p>
              {[
                { label: 'Description complète fournie', ok: !!(item.description && item.description.length > 50) },
                { label: 'Au moins 4 sections incluses', ok: !!(item.sections && item.sections.length >= 4) },
                { label: 'Palette de couleurs définie', ok: !!(item.colors && item.colors.length > 0) },
                { label: 'Tags de catégorie renseignés', ok: !!(item.tags && item.tags.length > 0) },
                { label: 'Prix raisonnable (< 100€)', ok: item.price !== undefined && item.price < 100 },
                { label: 'Aucun motif de rejet signalé', ok: !item.reason },
              ].map((check, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${check.ok ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${check.ok ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                    <Icon name={check.ok ? 'CheckIcon' : 'XIcon'} size={12} className={check.ok ? 'text-emerald-600' : 'text-rose-600'} />
                  </div>
                  <p className={`text-xs font-600 ${check.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{check.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {(item.status === 'pending' || item.status === 'flagged') && (
          <div className="px-6 py-4 border-t border-border flex gap-2 flex-shrink-0">
            <button onClick={onApprove} className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
              <Icon name="CheckIcon" size={14} />
              Publier sur la marketplace
            </button>
            <button onClick={onReject} className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-sm font-600 text-rose-600 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
              <Icon name="XIcon" size={14} />
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState<ModerationTab>('portfolios');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [items, setItems] = useState({
    portfolios: PORTFOLIOS,
    jobs: JOB_OFFERS,
    templates: TEMPLATES,
    credentials: CREDENTIALS,
  });

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const currentItems = items[activeTab];
  const filteredItems = currentItems.filter((i) => statusFilter === 'all' || i.status === statusFilter);

  const handleApprove = (id: string) => {
    setItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((i) => i.id === id ? { ...i, status: 'approved' as const } : i),
    }));
    setSelectedItem(null);
  };

  const handleReject = (id: string) => {
    setItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((i) => i.id === id ? { ...i, status: 'rejected' as const } : i),
    }));
    setSelectedItem(null);
  };

  const renderDetailModal = () => {
    if (!selectedItem) return null;
    const props = {
      item: selectedItem,
      onClose: () => setSelectedItem(null),
      onApprove: () => handleApprove(selectedItem.id),
      onReject: () => handleReject(selectedItem.id),
    };
    if (selectedItem.type === 'portfolio') return <PortfolioDetailModal {...props} />;
    if (selectedItem.type === 'job') return <JobDetailModal {...props} />;
    if (selectedItem.type === 'template') return <TemplateDetailModal {...props} />;
    // Credentials fallback
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
        <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-700 text-foreground">Détail du credential</h3>
            <button onClick={() => setSelectedItem(null)} className="p-1.5 rounded-lg hover:bg-muted transition-all">
              <Icon name="XIcon" size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <p className="font-700 text-foreground">{selectedItem.title}</p>
            <p className="text-sm text-muted-foreground">Par {selectedItem.author}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Catégorie', value: selectedItem.category ?? '—' },
                { label: 'Soumis', value: selectedItem.submittedAt },
                { label: 'Statut', value: STATUS_CONFIG[selectedItem.status].label },
              ].map((row) => (
                <div key={row.label} className="bg-muted rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{row.label}</p>
                  <p className="text-xs font-600 text-foreground">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
          {(selectedItem.status === 'pending' || selectedItem.status === 'flagged') && (
            <div className="px-6 py-4 border-t border-border flex gap-2">
              <button onClick={() => handleApprove(selectedItem.id)} className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                <Icon name="CheckIcon" size={14} />Approuver
              </button>
              <button onClick={() => handleReject(selectedItem.id)} className="flex-1 py-2 rounded-xl bg-rose-500/10 text-sm font-600 text-rose-600 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
                <Icon name="XIcon" size={14} />Rejeter
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TABS.map((tab) => {
          const tabItems = items[tab.id];
          const pending = tabItems.filter((i) => i.status === 'pending' || i.status === 'flagged').length;
          const approved = tabItems.filter((i) => i.status === 'approved').length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all hover:shadow-sm ${
                activeTab === tab.id ? 'border-rose-500/30 bg-rose-500/5' : 'border-border bg-card hover:border-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-rose-500/10' : 'bg-muted'}`}>
                  <Icon name={tab.icon as any} size={15} className={activeTab === tab.id ? 'text-rose-500' : 'text-muted-foreground'} />
                </div>
                {pending > 0 && (
                  <span className="text-[10px] font-700 bg-rose-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                    {pending}
                  </span>
                )}
              </div>
              <p className={`text-sm font-700 ${activeTab === tab.id ? 'text-rose-600' : 'text-foreground'}`}>{tab.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-amber-600 font-600">{pending} en attente</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-emerald-600 font-600">{approved} approuvés</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content list */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Icon name={currentTab.icon as any} size={16} className="text-muted-foreground" />
            <h3 className="font-700 text-foreground text-sm">{currentTab.label}</h3>
            <span className="text-xs text-muted-foreground">({currentItems.length} total)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              {['all', 'pending', 'flagged', 'approved', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-600 transition-all ${statusFilter === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {s === 'all' ? 'Tous' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label ?? s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredItems.map((item) => {
            const statusCfg = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.id}
                className="px-5 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors cursor-pointer group"
                onClick={() => setSelectedItem(item)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusCfg.bg}`}>
                  <Icon name={currentTab.icon as any} size={16} className={statusCfg.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-700 text-foreground">{item.title}</p>
                        {item.category && (
                          <span className="text-[10px] font-600 px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">{item.category}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Par {item.author} · {item.submittedAt}</p>
                      {item.reason && (
                        <p className="text-xs text-orange-600 mt-1.5 flex items-center gap-1">
                          <Icon name="AlertTriangleIcon" size={11} />
                          {item.reason}
                        </p>
                      )}
                      {item.views !== undefined && item.views > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Icon name="EyeIcon" size={11} />
                          {item.views} vues
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
                        <Icon name={statusCfg.icon as any} size={11} />
                        {statusCfg.label}
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                        <Icon name="EyeIcon" size={11} />
                        Voir détail
                      </span>
                    </div>
                  </div>
                </div>

                {(item.status === 'pending' || item.status === 'flagged') && (
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-600 hover:bg-emerald-500/20 transition-all"
                    >
                      <Icon name="CheckIcon" size={12} />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-600 hover:bg-rose-500/20 transition-all"
                    >
                      <Icon name="XIcon" size={12} />
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <Icon name={currentTab.icon as any} size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucun élément dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Detail modals */}
      {renderDetailModal()}
    </div>
  );
}
