'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { StudioPortfolio, SectionColors, SectionTexts } from '@/lib/services/portfolioStudioService';
import type {
  ProjectItem,
  PersonalProjectItem,
  CreativeStudioItem,
  SkillItem,
  ParcoursItem,
  UserProfileInfo,
  LanguageItem,
  CertificationItem,
  MediaFileItem,
} from '@/lib/services/cvthequeService';

interface IndustrialGEIITemplatePreviewProps {
  portfolio: StudioPortfolio;
  projects: ProjectItem[];
  personalProjects?: PersonalProjectItem[];
  creativeStudio?: CreativeStudioItem[];
  skills: SkillItem[];
  parcours: ParcoursItem[];
  profile?: UserProfileInfo;
  languages?: LanguageItem[];
  certifications?: CertificationItem[];
  media?: MediaFileItem[];
}

interface DetailModalItem {
  title: string;
  category?: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  links?: { label: string; url: string; icon?: string }[];
  kpis?: { label: string; value: string }[];
  year?: string;
  role?: string;
  accentColor?: string;
}

export default function IndustrialGEIITemplatePreview({
  portfolio,
  projects,
  personalProjects = [],
  creativeStudio = [],
  skills,
  parcours,
  profile,
  languages = [],
  certifications = [],
  media = [],
}: IndustrialGEIITemplatePreviewProps) {
  const sections = portfolio.enabledSections || {
    cover: true,
    hero: true,
    about: true,
    projects: true,
    personalProjects: true,
    creativeStudio: true,
    skills: true,
    tools: true,
    parcours: true,
    languages: true,
    gallery: true,
    contact: true,
  };

  const titles = portfolio.sectionTitles || {};
  const colors: SectionColors = portfolio.themeColors || {};
  const texts: SectionTexts = portfolio.sectionTexts || {};

  // Color variables with user-configured values or fallbacks
  const pageBg = colors.backgroundColor || '#FAF8F3';
  const cardBg = colors.cardBackground || '#EFEAE1';
  const heroColor = colors.hero || '#8A7D63';
  const aboutColor = colors.about || '#8A7D63';
  const saeColor = colors.projects || '#1A1815';
  const persoColor = colors.personalProjects || '#059669';
  const creativeColor = colors.creativeStudio || '#9333EA';
  const skillsColor = colors.skills || '#D97706';
  const toolsColor = colors.tools || '#475569';
  const parcoursColor = colors.parcours || '#2563EB';
  const languagesColor = colors.languages || '#0D9488';
  const galleryColor = colors.gallery || '#E11D48';
  const contactColor = colors.contact || '#4F46E5';

  // Modal and navigation states
  const [splashEntered, setSplashEntered] = useState(!sections.cover);
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [selectedDetailItem, setSelectedDetailItem] = useState<DetailModalItem | null>(null);

  // Filter items based on portfolio selections
  const displayProjects = projects.filter((p) =>
    !portfolio.selectedProjects || portfolio.selectedProjects.length === 0 || portfolio.selectedProjects.includes(p.id)
  );

  const displayPersonalProjects = personalProjects.filter((p) =>
    !portfolio.selectedPersonalProjects || portfolio.selectedPersonalProjects.length === 0 || portfolio.selectedPersonalProjects.includes(p.id)
  );

  const displayCreativeStudio = creativeStudio.filter((c) =>
    !portfolio.selectedCreativeStudio || portfolio.selectedCreativeStudio.length === 0 || portfolio.selectedCreativeStudio.includes(c.id)
  );

  const displaySkills = skills.filter((s) =>
    !portfolio.selectedSkills || portfolio.selectedSkills.length === 0 || portfolio.selectedSkills.includes(s.id)
  );

  const displayParcours = parcours;

  const displayLanguages = languages.filter((l) =>
    !portfolio.selectedLanguages || portfolio.selectedLanguages.includes(l.id)
  );

  const displayCertifications = certifications.filter((c) =>
    !portfolio.selectedCertifications || portfolio.selectedCertifications.includes(c.id)
  );

  const displayMedia = media.slice(0, 6);

  const authorName = portfolio.authorName || profile?.fullName || 'KOKOU DUSSEY';
  const headline = texts.heroHeadline || profile?.headline || 'Étudiant en B.U.T. GEII & Automatisme';
  const institution = portfolio.institution || 'IUT SÉNART-FONTAINEBLEAU';
  const degree = texts.coverDegree || portfolio.degree || 'BACHELOR UNIVERSITAIRE DE TECHNOLOGIE';
  const subTitle = texts.coverSubtitle || portfolio.subTitle || 'Portfolio Semestre 2';
  const promotion = texts.coverPromotion || portfolio.promotion || 'PROMOTION 2025–2026';
  const customIntro = texts.heroSlogan || portfolio.customIntro || profile?.slogan || 'Concevoir la logique. Piloter le système.';
  const bio = texts.aboutBio || profile?.bio || "Actuellement en formation B.U.T. GEII à l'IUT Sénart-Fontainebleau, je développe une solide expertise en automatisme industriel, programmation et conception électronique.";
  const objective = texts.aboutObjective || profile?.objective || "Recherche d'une alternance de 2 ans dès la rentrée 2026 dans les secteurs de l'automatisme, de la robotique industrielle ou des systèmes embarqués.";
  const email = profile?.email || 'kokou.dussey@etu.u-pec.fr';
  const phone = profile?.phone || '+33 6 12 34 56 78';
  const location = profile?.location || 'Île-de-France, France';
  const linkedin = profile?.linkedin || 'https://linkedin.com';
  const github = profile?.github || 'https://github.com';

  const hardSkills = displaySkills.filter((s) => s.category === 'hard');
  const softSkills = displaySkills.filter((s) => s.category === 'soft');
  const toolsSkills = displaySkills.filter((s) => s.category === 'tools');

  // =========================================================================
  // SECTION 0: SPLASH SCREEN (Couverture d'accueil style My-Portfolify)
  // =========================================================================
  if (sections.cover && !splashEntered) {
    return (
      <div
        className="relative min-h-[580px] h-full flex flex-col justify-between items-center text-center p-6 text-[#2C2720] select-none overflow-hidden border border-[#E1D9C6]/60 rounded-xl font-sans transition-all"
        style={{ backgroundColor: pageBg }}
      >
        {/* Top department headers */}
        <div className="pt-6 w-full max-w-lg space-y-2">
          <p
            className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: heroColor }}
          >
            {texts.coverDepartment || titles.coverDepartment || 'DÉPARTEMENT GÉNIE ÉLECTRIQUE ET INFORMATIQUE INDUSTRIELLE'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1815]">
            B.U.T.
          </h2>
          <p className="text-xs sm:text-sm font-extrabold tracking-wide text-[#2C2720] uppercase">
            {degree}
          </p>
          <div className="w-12 h-0.5 mx-auto my-3 opacity-60" style={{ backgroundColor: heroColor }} />
          <p className="text-xs italic text-[#6D624C]">
            {subTitle}
          </p>
        </div>

        {/* Center author block */}
        <div
          className="my-8 w-full max-w-sm px-6 py-7 rounded-3xl border border-black/5 shadow-sm backdrop-blur-xs"
          style={{ backgroundColor: cardBg }}
        >
          <p
            className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1"
            style={{ color: heroColor }}
          >
            RÉALISÉ PAR
          </p>
          <h1 className="text-xl sm:text-2xl font-black tracking-wide text-[#1A1815] uppercase">
            {authorName}
          </h1>
          <p className="text-[11px] text-[#6D624C] mt-1 font-semibold">
            {headline}
          </p>
        </div>

        {/* Bottom footer & enter action */}
        <div className="pb-6 w-full max-w-sm space-y-4">
          <div>
            <p className="text-xs font-extrabold tracking-wider text-[#4A4234] uppercase">
              {institution}
            </p>
            <p
              className="text-[10px] font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: heroColor }}
            >
              {promotion}
            </p>
          </div>

          <button
            onClick={() => setSplashEntered(true)}
            className="w-full sm:w-auto px-7 py-3 rounded-full text-white text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto btn-press hover:opacity-90"
            style={{ backgroundColor: heroColor }}
          >
            {texts.coverButton || 'Accéder au portfolio'}
            <Icon name="ArrowRightIcon" size={14} />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN PORTFOLIO BODY
  // =========================================================================
  return (
    <div
      className="text-[#2C2720] min-h-full font-sans text-xs relative selection:bg-[#C2B59C] selection:text-white"
      style={{ backgroundColor: pageBg }}
    >
      {/* Sticky Navigation Bar */}
      <nav
        className="sticky top-0 z-20 backdrop-blur-md border-b border-[#E1D9C6]/80 px-4 sm:px-6 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: `${pageBg}F2` }}
      >
        <div className="flex items-center gap-2.5">
          {sections.cover && (
            <button
              onClick={() => setSplashEntered(false)}
              className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition-opacity"
              style={{ backgroundColor: heroColor }}
              title="Revenir à la page de couverture"
            >
              {authorName.charAt(0)}
            </button>
          )}
          <div>
            <span className="font-extrabold text-[12px] text-[#1A1815] block leading-tight">
              {authorName}
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-wider block"
              style={{ color: heroColor }}
            >
              {portfolio.name}
            </span>
          </div>
        </div>

        {/* Dynamic Anchor links */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#6D624C] flex-wrap">
          {sections.hero && (
            <button
              onClick={() => setActiveSection('accueil')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'accueil' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              Accueil
            </button>
          )}

          {sections.about && (
            <button
              onClick={() => setActiveSection('apropos')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'apropos' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              À propos
            </button>
          )}

          {sections.projects && (
            <button
              onClick={() => setActiveSection('projets')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'projets' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              SAÉ ({displayProjects.length})
            </button>
          )}

          {sections.personalProjects && (
            <button
              onClick={() => setActiveSection('projets-perso')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'projets-perso' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              Projets Perso ({displayPersonalProjects.length})
            </button>
          )}

          {sections.creativeStudio && (
            <button
              onClick={() => setActiveSection('studio-creatif')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'studio-creatif' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              Studio Créatif ({displayCreativeStudio.length})
            </button>
          )}

          {sections.skills && (
            <button
              onClick={() => setActiveSection('competences')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'competences' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              Compétences
            </button>
          )}

          {sections.parcours && (
            <button
              onClick={() => setActiveSection('parcours')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'parcours' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              Parcours
            </button>
          )}

          {sections.contact && (
            <button
              onClick={() => setActiveSection('contact')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeSection === 'contact' ? 'bg-[#E1D9C6] text-[#1A1815]' : 'hover:text-[#1A1815]'
              }`}
            >
              Contact
            </button>
          )}
        </div>

        {sections.cover && (
          <button
            onClick={() => setSplashEntered(false)}
            className="text-[10px] font-bold flex items-center gap-1 px-3 py-1 rounded-full border border-black/10 hover:bg-black/5 transition-colors"
            style={{ color: heroColor }}
          >
            <Icon name="ArrowLeftIcon" size={10} />
            Sas d&apos;accueil
          </button>
        )}
      </nav>

      {/* ===================================================================== */}
      {/* SECTION 1 : HERO SECTION */}
      {/* ===================================================================== */}
      {sections.hero && (
        <header className="px-5 py-10 border-b border-[#E1D9C6]/60">
          <div className="max-w-2xl mx-auto text-center space-y-3.5">
            <div
              className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-xl font-bold text-white shadow-sm"
              style={{ backgroundColor: heroColor }}
            >
              {authorName.charAt(0)}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1815] tracking-tight">
              {authorName}
            </h1>

            <div
              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-black/10"
              style={{ backgroundColor: cardBg, color: heroColor }}
            >
              {portfolio.persona} · {institution}
            </div>

            <p
              className="text-sm sm:text-base font-extrabold italic max-w-lg mx-auto pt-1 leading-snug"
              style={{ color: heroColor }}
            >
              « {customIntro} »
            </p>

            <p className="text-xs text-[#6D624C] leading-relaxed max-w-lg mx-auto font-normal">
              {headline}
            </p>

            {texts.heroAvailability && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {texts.heroAvailability}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <a
                href={profile?.cvPdfUrl || '#contact'}
                className="px-4 py-2 rounded-xl text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: heroColor }}
              >
                <Icon name="ArrowDownTrayIcon" size={12} />
                {texts.heroDownloadCv || 'Télécharger CV'}
              </a>
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-[#4A4234] border border-black/10 text-[11px] font-semibold transition-colors hover:bg-black/5"
                  style={{ backgroundColor: cardBg }}
                >
                  LinkedIn
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl text-[#4A4234] border border-black/10 text-[11px] font-semibold transition-colors hover:bg-black/5"
                  style={{ backgroundColor: cardBg }}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Body with Wider Container for 3-Column Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-14">
        {/* =================================================================== */}
        {/* SECTION 2 : À PROPOS & PROJET PROFESSIONNEL */}
        {/* =================================================================== */}
        {sections.about && (
          <section id="apropos" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: aboutColor }}
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.aboutTitle || titles.about || 'À propos & Projet Professionnel'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.aboutSubtitle || "Présentation, démarche d'ingénierie et recherche d'alternance"}
                </p>
              </div>
            </div>

            <div
              className="rounded-3xl border border-black/5 p-6 shadow-sm space-y-4"
              style={{ backgroundColor: cardBg }}
            >
              <div>
                <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: aboutColor }} />
                  {texts.aboutBioTitle || 'Présentation personnelle'}
                </h3>
                <p className="text-xs text-[#524838] leading-relaxed">
                  {bio}
                </p>
              </div>

              {objective && (
                <div
                  className="p-4 rounded-2xl border border-black/5"
                  style={{ backgroundColor: pageBg }}
                >
                  <p
                    className="text-[10px] font-extrabold uppercase tracking-wider mb-1"
                    style={{ color: aboutColor }}
                  >
                    {texts.aboutObjectiveTitle || 'Objectif professionnel ciblé'}
                  </p>
                  <p className="text-xs font-semibold text-[#1A1815] leading-relaxed">
                    {objective}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 3 : SITUATIONS D'APPRENTISSAGE ET D'ÉVALUATION (SAÉ) */}
        {/* =================================================================== */}
        {sections.projects && (
          <section id="projets" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: saeColor }}
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.projectsTitle || titles.projects || "Situations d'Apprentissage et d'Évaluation (SAÉ)"}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.projectsSubtitle || "Activités pratiques d'ingénierie, simulation et pilotage de systèmes automatisés"}
                </p>
              </div>
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full text-white flex-shrink-0"
                style={{ backgroundColor: saeColor }}
              >
                {displayProjects.length} SAÉ
              </span>
            </div>

            {displayProjects.length === 0 ? (
              <div
                className="p-8 rounded-3xl border border-dashed border-black/10 text-center"
                style={{ backgroundColor: cardBg }}
              >
                <Icon name="FolderIcon" size={28} className="mx-auto text-[#8A7D63] mb-2" />
                <p className="text-xs font-bold text-[#4A4234]">
                  Emplacement réservé aux SAÉ (projets académiques)
                </p>
                <p className="text-[11px] text-[#8A7D63] mt-1">
                  Cochez les SAÉ à intégrer dans l&apos;onglet <strong>Contenu</strong> du Studio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProjects.map((project) => {
                  const tags = project.techStack || [];
                  return (
                    <article
                      key={`sae-card-${project.id}`}
                      className="rounded-3xl p-5 flex flex-col justify-between h-full border border-black/5 hover:shadow-md transition-all group duration-200"
                      style={{ backgroundColor: cardBg }}
                    >
                      <div>
                        {/* Top Media Container with Centered Play Button */}
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/10 flex-shrink-0 mb-3.5">
                          {project.imageUrl ? (
                            <AppImage
                              src={project.imageUrl}
                              alt={project.imageAlt || project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#E1D9C6] text-[#7A6E55]">
                              <Icon name="PhotoIcon" size={32} />
                            </div>
                          )}

                          {/* Center Play Overlay Icon matching screenshot */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/60 border border-white/80 backdrop-blur-xs flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                              <Icon name="PlayIcon" size={18} className="translate-x-0.5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Pill Tags Row */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors"
                                style={{
                                  backgroundColor: `${saeColor}18`,
                                  color: saeColor,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Title in Section Color */}
                        <h3
                          className="text-lg font-bold tracking-tight leading-snug line-clamp-2"
                          style={{ color: saeColor }}
                        >
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#4A4234] leading-relaxed line-clamp-4 mt-2 font-normal">
                          {project.description}
                        </p>
                      </div>

                      {/* Card Footer Link */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDetailItem({
                            title: project.title,
                            category: project.category || 'SAÉ Académique',
                            description: project.description,
                            imageUrl: project.imageUrl,
                            tags: project.techStack,
                            year: project.year,
                            role: project.role,
                            kpis: project.kpis,
                            accentColor: saeColor,
                            links: [
                              ...(project.url ? [{ label: 'Démonstration', url: project.url, icon: 'GlobeAltIcon' }] : []),
                              ...(project.github ? [{ label: 'Code source', url: project.github.startsWith('http') ? project.github : `https://${project.github}`, icon: 'CodeBracketIcon' }] : []),
                            ],
                          })
                        }
                        className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#8A7D63] hover:text-[#1A1815] transition-colors group-hover:translate-x-1 duration-150 text-left"
                      >
                        <span>{texts.learnMoreText || 'En savoir plus →'}</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 3b : PROJETS PERSONNELS (SAVOIR-FAIRE) */}
        {/* =================================================================== */}
        {sections.personalProjects && (
          <section id="projets-perso" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: persoColor }}
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.personalProjectsTitle || titles.personalProjects || 'Projets Personnels (Savoir-Faire)'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.personalProjectsSubtitle || 'Développements autonomes, applications web/mobiles et intégration de technologies émergentes'}
                </p>
              </div>
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full text-white flex-shrink-0"
                style={{ backgroundColor: persoColor }}
              >
                {displayPersonalProjects.length} projets
              </span>
            </div>

            {displayPersonalProjects.length === 0 ? (
              <div
                className="p-8 rounded-3xl border border-dashed border-black/10 text-center"
                style={{ backgroundColor: cardBg }}
              >
                <Icon name="CommandLineIcon" size={28} className="mx-auto text-[#8A7D63] mb-2" />
                <p className="text-xs font-bold text-[#4A4234]">
                  Emplacement réservé à vos projets personnels (savoir-faire)
                </p>
                <p className="text-[11px] text-[#8A7D63] mt-1">
                  Sélectionnez vos projets dans l&apos;onglet <strong>Contenu</strong> du Studio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPersonalProjects.map((p) => {
                  const tags = p.techStack || [];
                  return (
                    <article
                      key={`personal-card-${p.id}`}
                      className="rounded-3xl p-5 flex flex-col justify-between h-full border border-black/5 hover:shadow-md transition-all group duration-200"
                      style={{ backgroundColor: cardBg }}
                    >
                      <div>
                        {/* Top Media Container */}
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/10 flex-shrink-0 mb-3.5">
                          {p.imageUrl ? (
                            <AppImage
                              src={p.imageUrl}
                              alt={p.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#E1D9C6] text-[#7A6E55]">
                              <Icon name="PhotoIcon" size={32} />
                            </div>
                          )}

                          {/* Center Play Overlay Icon matching screenshot */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/60 border border-white/80 backdrop-blur-xs flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                              <Icon name="PlayIcon" size={18} className="translate-x-0.5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Pill Tags Row Tinted with Section Accent */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors"
                                style={{
                                  backgroundColor: `${persoColor}18`,
                                  color: persoColor,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Title in Section Color (Emerald) */}
                        <h3
                          className="text-lg font-bold tracking-tight leading-snug line-clamp-2"
                          style={{ color: persoColor }}
                        >
                          {p.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#4A4234] leading-relaxed line-clamp-4 mt-2 font-normal">
                          {p.description}
                        </p>
                      </div>

                      {/* Card Footer Link */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDetailItem({
                            title: p.title,
                            category: p.category || 'Projet Personnel',
                            description: p.description,
                            imageUrl: p.imageUrl,
                            tags: p.techStack,
                            year: p.year,
                            accentColor: persoColor,
                            links: [
                              ...(p.url ? [{ label: 'Tester l\'application', url: p.url, icon: 'GlobeAltIcon' }] : []),
                              ...(p.github ? [{ label: 'Code source GitHub', url: p.github.startsWith('http') ? p.github : `https://${p.github}`, icon: 'CodeBracketIcon' }] : []),
                            ],
                          })
                        }
                        className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#8A7D63] hover:text-[#1A1815] transition-colors group-hover:translate-x-1 duration-150 text-left"
                      >
                        <span>{texts.learnMoreText || 'En savoir plus →'}</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 3c : STUDIO CRÉATIF (SAVOIR-ÊTRE) */}
        {/* =================================================================== */}
        {sections.creativeStudio && (
          <section id="studio-creatif" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: creativeColor }}
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.creativeStudioTitle || titles.creativeStudio || 'Studio Créatif (Savoir-Être)'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.creativeStudioSubtitle ||
                    "La technique c'est bien, savoir la communiquer en équipe c'est mieux. Voici quelques réalisations audiovisuelles produites en groupe lors de nos modules de communication."}
                </p>
              </div>
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-full text-white flex-shrink-0"
                style={{ backgroundColor: creativeColor }}
              >
                {displayCreativeStudio.length} réalisations
              </span>
            </div>

            {displayCreativeStudio.length === 0 ? (
              <div
                className="p-8 rounded-3xl border border-dashed border-black/10 text-center"
                style={{ backgroundColor: cardBg }}
              >
                <Icon name="SparklesIcon" size={28} className="mx-auto text-[#8A7D63] mb-2" />
                <p className="text-xs font-bold text-[#4A4234]">
                  Emplacement réservé au Studio Créatif (savoir-être)
                </p>
                <p className="text-[11px] text-[#8A7D63] mt-1">
                  Sélectionnez vos réalisations audiovisuelles dans l&apos;onglet <strong>Contenu</strong> du Studio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCreativeStudio.map((item) => {
                  const tags = item.softSkills || [];
                  return (
                    <article
                      key={`creative-card-${item.id}`}
                      className="rounded-3xl p-5 flex flex-col justify-between h-full border border-black/5 hover:shadow-md transition-all group duration-200"
                      style={{ backgroundColor: cardBg }}
                    >
                      <div>
                        {/* Top Media Container */}
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/10 flex-shrink-0 mb-3.5">
                          {item.thumbnailUrl ? (
                            <AppImage
                              src={item.thumbnailUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#E1D9C6] text-[#7A6E55]">
                              <Icon name="VideoCameraIcon" size={32} />
                            </div>
                          )}

                          {/* Center Play Overlay Icon matching screenshot */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/60 border border-white/80 backdrop-blur-xs flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                              <Icon name="PlayIcon" size={18} className="translate-x-0.5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Soft Skills Pill Tags Row Tinted with Purple Accent */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-colors"
                                style={{
                                  backgroundColor: `${creativeColor}18`,
                                  color: creativeColor,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Title in Section Color (Purple) */}
                        <h3
                          className="text-lg font-bold tracking-tight leading-snug line-clamp-2"
                          style={{ color: creativeColor }}
                        >
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#4A4234] leading-relaxed line-clamp-4 mt-2 font-normal">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer Link */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDetailItem({
                            title: item.title,
                            category: item.category || 'Studio Créatif',
                            description: item.description,
                            imageUrl: item.thumbnailUrl,
                            tags: item.softSkills,
                            year: item.year,
                            role: item.role,
                            accentColor: creativeColor,
                            links: [
                              ...(item.mediaUrl ? [{ label: 'Visionner le média', url: item.mediaUrl, icon: 'PlayIcon' }] : []),
                            ],
                          })
                        }
                        className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#8A7D63] hover:text-[#1A1815] transition-colors group-hover:translate-x-1 duration-150 text-left"
                      >
                        <span>{texts.learnMoreText || 'En savoir plus →'}</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 4 : COMPÉTENCES TECHNIQUES */}
        {/* =================================================================== */}
        {(sections.skills || sections.tools) && (
          <section id="competences" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: skillsColor }}
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.skillsTitle || titles.skills || 'Compétences & Outils Industriels'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.skillsSubtitle || "Groupes techniques, programmation d'automates et jauges de maîtrise"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hard Skills */}
              {sections.skills && (
                <div
                  className="rounded-3xl border border-black/5 p-6 shadow-sm space-y-3"
                  style={{ backgroundColor: cardBg }}
                >
                  <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skillsColor }} />
                    {texts.skillsHardTitle || 'Compétences Techniques'} ({hardSkills.length})
                  </h3>
                  <div className="space-y-3">
                    {hardSkills.map((s) => (
                      <div key={s.id}>
                        <div className="flex justify-between text-[11px] font-semibold mb-1">
                          <span className="text-[#1A1815]">{s.name}</span>
                          <span className="tabular-nums font-bold" style={{ color: skillsColor }}>
                            {s.level}%
                          </span>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden border border-black/5"
                          style={{ backgroundColor: pageBg }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${s.level}%`, backgroundColor: skillsColor }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools & Soft */}
              {sections.tools && (
                <div className="space-y-6">
                  {/* Tools */}
                  <div
                    className="rounded-3xl border border-black/5 p-6 shadow-sm"
                    style={{ backgroundColor: cardBg }}
                  >
                    <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: toolsColor }} />
                      {texts.toolsTitle || 'Outils & Matériel'} ({toolsSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {toolsSkills.map((t) => (
                        <span
                          key={t.id}
                          className="px-3 py-1.5 border border-black/5 text-[#4A4234] text-[11px] font-semibold rounded-xl"
                          style={{ backgroundColor: pageBg }}
                        >
                          {t.name}
                          <span className="text-[#8A7D63] font-normal ml-1">({t.years}a)</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  {softSkills.length > 0 && (
                    <div
                      className="rounded-3xl border border-black/5 p-6 shadow-sm"
                      style={{ backgroundColor: cardBg }}
                    >
                      <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5 mb-3">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: heroColor }} />
                        {texts.toolsSoftTitle || 'Savoir-Être'} ({softSkills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {softSkills.map((soft) => (
                          <span
                            key={soft.id}
                            className="px-3 py-1.5 border border-black/5 text-[#1A1815] text-[11px] font-semibold rounded-xl"
                            style={{ backgroundColor: pageBg }}
                          >
                            {soft.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 5 : PARCOURS & FORMATIONS */}
        {/* =================================================================== */}
        {sections.parcours && displayParcours.length > 0 && (
          <section id="parcours" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: parcoursColor }}
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.parcoursTitle || titles.parcours || 'Parcours & Formations'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.parcoursSubtitle || 'Timeline chronologique des diplômes, études et stages'}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E1D9C6]">
              {displayParcours.map((item) => (
                <div key={item.id} className="relative">
                  <div
                    className="absolute -left-[21px] top-2 w-3 h-3 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: parcoursColor }}
                  />
                  <div
                    className="rounded-2xl border border-black/5 p-4 shadow-sm"
                    style={{ backgroundColor: cardBg }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-[#1A1815]">{item.title}</p>
                      <span className="text-[10px] font-mono text-[#8A7D63] flex-shrink-0">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#8A7D63] mt-0.5">
                      {item.organization} {item.location && `· ${item.location}`}
                    </p>
                    <p className="text-[11px] text-[#6D624C] mt-1.5 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 6 : LANGUES & CERTIFICATIONS */}
        {/* =================================================================== */}
        {sections.languages && (displayLanguages.length > 0 || displayCertifications.length > 0) && (
          <section id="langues" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: languagesColor }}
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.languagesTitle || titles.languages || 'Langues & Certifications'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.languagesSubtitle || 'Certifications de sécurité électrique et compétences linguistiques'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Langues */}
              {displayLanguages.length > 0 && (
                <div
                  className="rounded-3xl border border-black/5 p-6 shadow-sm space-y-3"
                  style={{ backgroundColor: cardBg }}
                >
                  <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languagesColor }} />
                    {texts.languagesBlockTitle || 'Langues'}
                  </h3>
                  <div className="space-y-2">
                    {displayLanguages.map((l) => (
                      <div
                        key={l.id}
                        className="p-3 rounded-2xl border border-black/5 flex items-center justify-between"
                        style={{ backgroundColor: pageBg }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{l.flag || '🌐'}</span>
                          <div>
                            <p className="text-xs font-bold text-[#1A1815]">{l.name}</p>
                            <p className="text-[10px] text-[#8A7D63]">{l.level}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {displayCertifications.length > 0 && (
                <div
                  className="rounded-3xl border border-black/5 p-6 shadow-sm space-y-3"
                  style={{ backgroundColor: cardBg }}
                >
                  <h3 className="text-xs font-bold text-[#1A1815] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: heroColor }} />
                    {texts.certificationsBlockTitle || 'Habilitations & Certifications'}
                  </h3>
                  <div className="space-y-2">
                    {displayCertifications.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-2xl border border-black/5"
                        style={{ backgroundColor: pageBg }}
                      >
                        <p className="text-xs font-bold text-[#1A1815]">{c.title}</p>
                        <p className="text-[10px] text-[#8A7D63] mt-0.5">
                          {c.issuer} · {c.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 7 : GALERIE MÉDIAS */}
        {/* =================================================================== */}
        {sections.gallery && displayMedia.length > 0 && (
          <section id="galerie" className="scroll-mt-16">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-1.5 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: galleryColor }}
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1815] tracking-tight">
                  {texts.galleryTitle || titles.gallery || 'Galerie de Réalisations'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6D624C] leading-relaxed mt-1 font-normal">
                  {texts.gallerySubtitle || "Photographies d'ateliers, montages et bancs de test"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {displayMedia.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl overflow-hidden border border-black/5 h-36 relative group"
                  style={{ backgroundColor: cardBg }}
                >
                  <AppImage
                    src={m.fileUrl}
                    alt={m.altText || m.fileName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white font-semibold truncate">
                      {m.project || m.fileName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SECTION 8 : CONTACT & COORDONNÉES */}
        {/* =================================================================== */}
        {sections.contact && (
          <section id="contact" className="scroll-mt-16 pt-2">
            <div
              className="rounded-3xl border border-black/5 p-8 text-center space-y-4 shadow-sm"
              style={{ backgroundColor: cardBg }}
            >
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: contactColor }}
                >
                  {texts.contactTitle || titles.contact || 'COORDONNÉES PROFESSIONNELLES'}
                </p>
                <h2 className="text-lg sm:text-xl font-black text-[#1A1815]">
                  {texts.contactHeading || 'Me contacter pour un stage ou une alternance'}
                </h2>
                <p className="text-xs text-[#6D624C] mt-1 max-w-md mx-auto font-normal">
                  {texts.contactDescription || 'Disponible pour échanger sur vos projets industriels et besoins techniques.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto text-xs">
                <a
                  href={`mailto:${email}`}
                  className="p-3 rounded-2xl border border-black/5 hover:border-black/20 transition-all flex flex-col items-center gap-1.5"
                  style={{ backgroundColor: pageBg }}
                >
                  <Icon name="EnvelopeIcon" size={18} style={{ color: contactColor }} />
                  <span className="font-bold text-[#1A1815] truncate max-w-full">{email}</span>
                </a>

                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="p-3 rounded-2xl border border-black/5 hover:border-black/20 transition-all flex flex-col items-center gap-1.5"
                    style={{ backgroundColor: pageBg }}
                  >
                    <Icon name="PhoneIcon" size={18} style={{ color: contactColor }} />
                    <span className="font-bold text-[#1A1815]">{phone}</span>
                  </a>
                )}

                <div
                  className="p-3 rounded-2xl border border-black/5 flex flex-col items-center gap-1.5"
                  style={{ backgroundColor: pageBg }}
                >
                  <Icon name="MapPinIcon" size={18} style={{ color: contactColor }} />
                  <span className="font-bold text-[#1A1815] truncate max-w-full">{location}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-[#E1D9C6] text-center space-y-1">
          <p className="text-[11px] font-bold text-[#1A1815]">
            {authorName} · {institution}
          </p>
          <p className="text-[10px] text-[#8A7D63]">
            {texts.footerText || 'Portfolio ciblé généré via PortfolioGen Studio & synchronisé avec la CVthèque Master'}
          </p>
        </footer>
      </div>

      {/* =================================================================== */}
      {/* INTERACTIVE DETAIL MODAL */}
      {/* =================================================================== */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-black/10 relative"
            style={{ backgroundColor: cardBg }}
          >
            <button
              onClick={() => setSelectedDetailItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-foreground transition-colors"
              title="Fermer"
            >
              <Icon name="XMarkIcon" size={16} />
            </button>

            {selectedDetailItem.imageUrl && (
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-black/10">
                <AppImage
                  src={selectedDetailItem.imageUrl}
                  alt={selectedDetailItem.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {selectedDetailItem.category && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
                style={{
                  backgroundColor: `${selectedDetailItem.accentColor || '#1A1815'}18`,
                  color: selectedDetailItem.accentColor || '#1A1815',
                }}
              >
                {selectedDetailItem.category}
              </span>
            )}

            <h3
              className="text-xl sm:text-2xl font-black tracking-tight mb-1"
              style={{ color: selectedDetailItem.accentColor || '#1A1815' }}
            >
              {selectedDetailItem.title}
            </h3>

            {selectedDetailItem.role && (
              <p className="text-xs font-semibold text-[#8A7D63] mb-3">
                {selectedDetailItem.role} {selectedDetailItem.year && `· ${selectedDetailItem.year}`}
              </p>
            )}

            <p className="text-xs sm:text-sm text-[#4A4234] leading-relaxed mb-4 whitespace-pre-line font-normal">
              {selectedDetailItem.description}
            </p>

            {selectedDetailItem.tags && selectedDetailItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedDetailItem.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: `${selectedDetailItem.accentColor || '#1A1815'}18`,
                      color: selectedDetailItem.accentColor || '#1A1815',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {selectedDetailItem.kpis && selectedDetailItem.kpis.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selectedDetailItem.kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl text-center border border-black/5"
                    style={{ backgroundColor: pageBg }}
                  >
                    <span
                      className="text-xs font-black block"
                      style={{ color: selectedDetailItem.accentColor }}
                    >
                      {kpi.value}
                    </span>
                    <span className="text-[10px] text-[#6D624C] block truncate">
                      {kpi.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedDetailItem.links && selectedDetailItem.links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-black/10">
                {selectedDetailItem.links.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: selectedDetailItem.accentColor || '#1A1815' }}
                  >
                    <Icon name={(link.icon as any) || 'ArrowTopRightOnSquareIcon'} size={14} />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
