'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { StudioPortfolio } from '@/lib/services/portfolioStudioService';
import type { ProjectItem, SkillItem, ParcoursItem } from '@/lib/services/cvthequeService';

interface IndustrialGEIITemplatePreviewProps {
  portfolio: StudioPortfolio;
  projects: ProjectItem[];
  skills: SkillItem[];
  parcours: ParcoursItem[];
}

export default function IndustrialGEIITemplatePreview({
  portfolio,
  projects,
  skills,
  parcours,
}: IndustrialGEIITemplatePreviewProps) {
  const [splashEntered, setSplashEntered] = useState(false);
  const [activeSection, setActiveSection] = useState<'accueil' | 'projets' | 'competences' | 'parcours' | 'contact'>('accueil');

  // Filter items based on portfolio selections
  const displayProjects = projects.filter((p) =>
    portfolio.selectedProjects.includes(p.id)
  );

  const displaySkills = skills.filter((s) =>
    portfolio.selectedSkills.includes(s.id)
  );

  const displayParcours = parcours;

  const authorName = portfolio.authorName || 'KOKOU DUSSEY';
  const institution = portfolio.institution || 'IUT SÉNART-FONTAINEBLEAU';
  const degree = portfolio.degree || 'BACHELOR UNIVERSITAIRE DE TECHNOLOGIE';
  const subTitle = portfolio.subTitle || 'Portfolio Semestre 2';
  const promotion = portfolio.promotion || 'PROMOTION 2025–2026';
  const customIntro = portfolio.customIntro || 'Concevoir la logique. Piloter le système.';

  const hardSkills = displaySkills.filter((s) => s.category === 'hard');
  const softSkills = displaySkills.filter((s) => s.category === 'soft');
  const toolsSkills = displaySkills.filter((s) => s.category === 'tools');

  // SPLASH SCREEN (Couverture d'accueil style My-Portfolify)
  if (!splashEntered) {
    return (
      <div className="relative min-h-[580px] h-full flex flex-col justify-between items-center text-center p-6 bg-[#FAF8F3] text-[#2C2720] select-none overflow-hidden border border-[#E1D9C6]/60 rounded-xl font-sans transition-all">
        {/* Top department headers */}
        <div className="pt-6 w-full max-w-lg space-y-2">
          <p className="text-[11px] sm:text-xs font-700 tracking-[0.2em] text-[#8A7D63] uppercase">
            DÉPARTEMENT GÉNIE ÉLECTRIQUE ET INFORMATIQUE INDUSTRIELLE
          </p>
          <h2 className="text-3xl sm:text-4xl font-900 tracking-tight text-[#1A1815]">
            B.U.T.
          </h2>
          <p className="text-xs sm:text-sm font-800 tracking-wide text-[#2C2720] uppercase">
            {degree}
          </p>
          <div className="w-12 h-0.5 bg-[#C2B59C] mx-auto my-3 opacity-60" />
          <p className="text-xs italic text-[#6D624C]">
            {subTitle}
          </p>
        </div>

        {/* Center author block */}
        <div className="my-8 w-full max-w-sm px-6 py-7 rounded-2xl bg-[#F0EDE6]/80 border border-[#E1D9C6] shadow-sm backdrop-blur-xs">
          <p className="text-[10px] font-700 tracking-[0.2em] text-[#8A7D63] uppercase mb-1">
            RÉALISÉ PAR
          </p>
          <h1 className="text-xl sm:text-2xl font-900 tracking-wide text-[#1A1815] uppercase">
            {authorName}
          </h1>
        </div>

        {/* Bottom footer & enter action */}
        <div className="pb-6 w-full max-w-sm space-y-4">
          <div>
            <p className="text-xs font-800 tracking-wider text-[#4A4234] uppercase">
              {institution}
            </p>
            <p className="text-[10px] font-600 tracking-widest text-[#8A7D63] uppercase mt-0.5">
              {promotion}
            </p>
          </div>

          <button
            onClick={() => setSplashEntered(true)}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#A4967A] hover:bg-[#8A7D63] text-white text-xs font-700 tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto btn-press"
          >
            Accéder au portfolio
            <Icon name="ArrowRightIcon" size={14} />
          </button>
        </div>
      </div>
    );
  }

  // MAIN PORTFOLIO CONTENT (Style My-Portfolify avec données CVthèque Master)
  return (
    <div className="bg-[#FAF8F3] text-[#2C2720] min-h-full font-sans text-xs relative selection:bg-[#C2B59C] selection:text-white">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-20 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E1D9C6] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSplashEntered(false)}
            className="w-7 h-7 rounded-lg bg-[#C2B59C] text-white flex items-center justify-center font-bold text-xs hover:bg-[#A4967A] transition-colors"
            title="Revenir à la page de couverture"
          >
            {authorName.charAt(0)}
          </button>
          <div>
            <span className="font-800 text-[11px] text-[#1A1815] block leading-tight">
              {authorName}
            </span>
            <span className="text-[9px] text-[#8A7D63] font-600 uppercase tracking-wider block">
              {portfolio.name}
            </span>
          </div>
        </div>

        {/* Anchor links */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-600 text-[#6D624C]">
          <button
            onClick={() => setActiveSection('accueil')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === 'accueil' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => setActiveSection('projets')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === 'projets' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
            }`}
          >
            SAÉ & Projets ({displayProjects.length})
          </button>
          <button
            onClick={() => setActiveSection('competences')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === 'competences' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
            }`}
          >
            Compétences ({displaySkills.length})
          </button>
          <button
            onClick={() => setActiveSection('parcours')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeSection === 'parcours' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
            }`}
          >
            Parcours
          </button>
        </div>

        <button
          onClick={() => setSplashEntered(false)}
          className="text-[10px] font-700 text-[#8A7D63] hover:text-[#1A1815] flex items-center gap-1 bg-[#F0EDE6] px-2.5 py-1 rounded-full border border-[#E1D9C6]"
        >
          <Icon name="ArrowLeftIcon" size={10} />
          Sas d&apos;accueil
        </button>
      </nav>

      {/* Hero Section */}
      <header className="px-5 py-8 border-b border-[#E1D9C6]/60 bg-gradient-to-b from-[#FAF8F3] to-[#F0EDE6]/40">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#E1D9C6] border-2 border-[#C2B59C] mx-auto flex items-center justify-center text-xl font-bold text-[#4A4234] shadow-sm">
            {authorName.charAt(0)}
          </div>

          <h1 className="text-xl sm:text-2xl font-900 text-[#1A1815] tracking-tight">
            {authorName}
          </h1>

          <div className="inline-block px-3 py-1 rounded-full bg-[#E1D9C6]/80 text-[#4A4234] text-[11px] font-700 tracking-wide border border-[#C2B59C]/40">
            {portfolio.persona} · {institution}
          </div>

          <p className="text-sm sm:text-base font-800 text-[#8A7D63] italic max-w-md mx-auto pt-1 leading-snug">
            « {customIntro} »
          </p>

          <p className="text-xs text-[#6D624C] leading-relaxed max-w-md mx-auto">
            Étudiant en 1ère année de B.U.T. GEII, passionné par la conception électronique,
            les automates industriels et les architectures matérielles résilientes.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-lg bg-[#A4967A] text-white text-[11px] font-700 shadow-xs">
              Télécharger CV
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#F0EDE6] text-[#4A4234] border border-[#C2B59C] text-[11px] font-600">
              LinkedIn
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#F0EDE6] text-[#4A4234] border border-[#C2B59C] text-[11px] font-600">
              Contact
            </span>
          </div>
        </div>
      </header>

      {/* Body: Sections remplies par la CVthèque Master */}
      <div className="p-5 max-w-2xl mx-auto space-y-8">
        {/* SECTION 1 : RÉALISATIONS & SAÉ (PROJETS DE LA CVTHÈQUE) */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-[#E1D9C6] pb-2">
            <div>
              <h2 className="text-sm font-800 text-[#1A1815] uppercase tracking-wider">
                Mes Réalisations & SAÉ
              </h2>
              <p className="text-[11px] text-[#8A7D63]">
                Alimenté en temps réel par les projets de votre CVthèque Master
              </p>
            </div>
            <span className="text-[11px] font-700 px-2 py-0.5 rounded-full bg-[#E1D9C6] text-[#4A4234]">
              {displayProjects.length} sélectionné{displayProjects.length > 1 ? 's' : ''}
            </span>
          </div>

          {displayProjects.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-[#C2B59C] bg-[#F0EDE6]/50 text-center">
              <Icon name="FolderIcon" size={24} className="mx-auto text-[#8A7D63] mb-2" />
              <p className="text-xs font-700 text-[#4A4234]">
                Aucun projet sélectionné pour ce portfolio
              </p>
              <p className="text-[11px] text-[#8A7D63] mt-1">
                Allez dans l&apos;onglet <strong>Contenu</strong> du Studio Portfolio pour cocher les projets de votre CVthèque.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayProjects.map((project) => (
                <article
                  key={`studio-proj-${project.id}`}
                  className="bg-white rounded-xl border border-[#E1D9C6] p-4 shadow-sm hover:border-[#A4967A] transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Project thumbnail */}
                    {project.imageUrl && (
                      <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden bg-[#F0EDE6] border border-[#E1D9C6] flex-shrink-0 relative">
                        <AppImage
                          src={project.imageUrl}
                          alt={project.imageAlt || project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs sm:text-sm font-800 text-[#1A1815] leading-tight group-hover:text-[#8A7D63] transition-colors">
                          {project.title}
                        </h3>
                        {project.year && (
                          <span className="text-[10px] font-mono font-600 text-[#8A7D63] bg-[#FAF8F3] px-1.5 py-0.5 rounded border border-[#E1D9C6]">
                            {project.year}
                          </span>
                        )}
                      </div>

                      {project.role && (
                        <p className="text-[11px] font-600 text-[#8A7D63] mt-0.5">
                          {project.role} {project.company && `· ${project.company}`}
                        </p>
                      )}

                      <p className="text-xs text-[#6D624C] leading-relaxed mt-1.5 line-clamp-3">
                        {project.description}
                      </p>

                      {/* KPIs */}
                      {project.kpis && project.kpis.length > 0 && (
                        <div className="flex gap-2 my-2.5">
                          {project.kpis.slice(0, 3).map((kpi, kIdx) => (
                            <div
                              key={kIdx}
                              className="px-2 py-1 rounded bg-[#FAF8F3] border border-[#E1D9C6] text-center"
                            >
                              <span className="text-[10px] font-800 text-[#8A7D63] block tabular-nums">
                                {kpi.value}
                              </span>
                              <span className="text-[9px] text-[#6D624C] block leading-none">
                                {kpi.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-[#FAF8F3] border border-[#E1D9C6] rounded text-[10px] font-600 text-[#4A4234]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project links */}
                      <div className="flex items-center gap-3 pt-2.5 mt-2.5 border-t border-[#F0EDE6] text-[10px]">
                        {project.url && (
                          <span className="text-[#8A7D63] font-700 flex items-center gap-1 hover:underline">
                            <Icon name="GlobeAltIcon" size={11} />
                            Démonstration
                          </span>
                        )}
                        {project.github && (
                          <span className="text-[#6D624C] font-600 flex items-center gap-1 hover:underline">
                            <Icon name="GithubIcon" size={11} />
                            Code source
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2 : COMPÉTENCES & OUTILS (COMPÉTENCES DE LA CVTHÈQUE) */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-[#E1D9C6] pb-2">
            <div>
              <h2 className="text-sm font-800 text-[#1A1815] uppercase tracking-wider">
                Compétences & Outils Industriels
              </h2>
              <p className="text-[11px] text-[#8A7D63]">
                Sélectionnées directement depuis la Matrice de Compétences Master
              </p>
            </div>
            <span className="text-[11px] font-700 px-2 py-0.5 rounded-full bg-[#E1D9C6] text-[#4A4234]">
              {displaySkills.length} active{displaySkills.length > 1 ? 's' : ''}
            </span>
          </div>

          {displaySkills.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-[#C2B59C] bg-[#F0EDE6]/50 text-center">
              <Icon name="SparklesIcon" size={24} className="mx-auto text-[#8A7D63] mb-2" />
              <p className="text-xs font-700 text-[#4A4234]">
                Emplacement réservé à vos compétences & outils
              </p>
              <p className="text-[11px] text-[#8A7D63] mt-1">
                Cochez vos compétences techniques et outils industriels dans l&apos;onglet <strong>Contenu</strong> du Studio.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hard Skills */}
            <div className="bg-white p-4 rounded-xl border border-[#E1D9C6] space-y-3">
              <h3 className="text-xs font-800 text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A4967A]" />
                Hard Skills ({hardSkills.length})
              </h3>
              <div className="space-y-2.5">
                {hardSkills.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-[11px] font-600 mb-1">
                      <span className="text-[#1A1815]">{s.name}</span>
                      <span className="text-[#8A7D63] tabular-nums font-700">{s.level}%</span>
                    </div>
                    <div className="h-1.5 bg-[#FAF8F3] border border-[#E1D9C6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#A4967A] rounded-full"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Soft */}
            <div className="space-y-4">
              {/* Tools */}
              <div className="bg-white p-4 rounded-xl border border-[#E1D9C6]">
                <h3 className="text-xs font-800 text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#C2B59C]" />
                  Outils & Matériel ({toolsSkills.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {toolsSkills.map((t) => (
                    <span
                      key={t.id}
                      className="px-2 py-1 bg-[#FAF8F3] border border-[#E1D9C6] text-[#4A4234] text-[10px] font-600 rounded-md"
                    >
                      {t.name}
                      <span className="text-[#8A7D63] font-normal ml-1">({t.years}a)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              {softSkills.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-[#E1D9C6]">
                  <h3 className="text-xs font-800 text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8A7D63]" />
                    Savoir-Être ({softSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.map((soft) => (
                      <span
                        key={soft.id}
                        className="px-2 py-1 bg-[#F0EDE6] border border-[#C2B59C]/60 text-[#1A1815] text-[10px] font-600 rounded-md"
                      >
                        {soft.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </section>

        {/* SECTION 3 : PARCOURS & TIMELINE (CVTHÈQUE MASTER) */}
        {displayParcours.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4 border-b border-[#E1D9C6] pb-2">
              <div>
                <h2 className="text-sm font-800 text-[#1A1815] uppercase tracking-wider">
                  Parcours & Formations
                </h2>
                <p className="text-[11px] text-[#8A7D63]">
                  Timeline synchronisée avec votre CVthèque
                </p>
              </div>
            </div>

            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E1D9C6]">
              {displayParcours.slice(0, 3).map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#A4967A] border-2 border-white" />
                  <div className="bg-white p-3 rounded-xl border border-[#E1D9C6]">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-800 text-[#1A1815]">{item.title}</p>
                      <span className="text-[10px] font-mono text-[#8A7D63] flex-shrink-0">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-[11px] font-600 text-[#8A7D63] mt-0.5">
                      {item.organization} {item.location && `· ${item.location}`}
                    </p>
                    <p className="text-[11px] text-[#6D624C] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-6 border-t border-[#E1D9C6] text-center space-y-1">
          <p className="text-[11px] font-700 text-[#1A1815]">
            {authorName} · {institution}
          </p>
          <p className="text-[10px] text-[#8A7D63]">
            Portfolio ciblé généré via PortfolioGen Studio
          </p>
        </footer>
      </div>
    </div>
  );
}
