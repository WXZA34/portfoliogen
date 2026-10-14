'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import {
  StudioPortfolio,
  fetchPublicStudioPortfolio,
  DEFAULT_STARTER_PORTFOLIOS,
} from '@/lib/services/portfolioStudioService';
import {
  ProjectItem,
  PersonalProjectItem,
  CreativeStudioItem,
  SkillItem,
  ParcoursItem,
  UserProfileInfo,
  LanguageItem,
  CertificationItem,
  MediaFileItem,
  fetchUserProjects,
  fetchUserPersonalProjects,
  fetchUserCreativeStudioItems,
  fetchUserSkills,
  fetchUserParcours,
  fetchUserProfileInfo,
  fetchUserLanguages,
  fetchUserCertifications,
  fetchUserMediaFiles,
  DEFAULT_STARTER_PROJECTS,
  DEFAULT_STARTER_PERSONAL_PROJECTS,
  DEFAULT_STARTER_CREATIVE_STUDIO,
  DEFAULT_STARTER_SKILLS,
  DEFAULT_STARTER_PARCOURS,
  DEFAULT_USER_PROFILE,
  DEFAULT_STARTER_LANGUAGES,
  DEFAULT_STARTER_CERTIFICATIONS,
  DEFAULT_STARTER_MEDIA,
} from '@/lib/services/cvthequeService';
import IndustrialGEIITemplatePreview from '@/app/portfolio-studio/components/templates/IndustrialGEIITemplatePreview';
import { downloadDocumentSafe } from '@/lib/utils/mediaUploadHelper';
import CanvasEditor from '@/app/portfolio-editor/components/CanvasEditor';
import { PortfolioDesign } from '@/app/portfolio-editor/components/PortfolioEditorContent';
import { createClient } from '@/lib/supabase/client';

interface PublicPortfolioViewerProps {
  slug: string;
  recipientCompany?: string;
}

export default function PublicPortfolioViewer({
  slug,
  recipientCompany: initialRecipientCompany,
}: PublicPortfolioViewerProps) {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<StudioPortfolio | null>(null);
  const [canvasDesign, setCanvasDesign] = useState<PortfolioDesign | null>(null);

  // CVthèque data
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_STARTER_PROJECTS);
  const [personalProjects, setPersonalProjects] = useState<PersonalProjectItem[]>(
    DEFAULT_STARTER_PERSONAL_PROJECTS
  );
  const [creativeStudio, setCreativeStudio] = useState<CreativeStudioItem[]>(
    DEFAULT_STARTER_CREATIVE_STUDIO
  );
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_STARTER_SKILLS);
  const [parcours, setParcours] = useState<ParcoursItem[]>(DEFAULT_STARTER_PARCOURS);
  const [profile, setProfile] = useState<UserProfileInfo>(DEFAULT_USER_PROFILE);
  const [languages, setLanguages] = useState<LanguageItem[]>(DEFAULT_STARTER_LANGUAGES);
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    DEFAULT_STARTER_CERTIFICATIONS
  );
  const [media, setMedia] = useState<MediaFileItem[]>(DEFAULT_STARTER_MEDIA);

  const [company, setCompany] = useState<string | undefined>(initialRecipientCompany);

  useEffect(() => {
    // Read ?for= from window.location if not passed via props
    if (typeof window !== 'undefined' && !company) {
      const params = new URLSearchParams(window.location.search);
      const forParam = params.get('for');
      if (forParam) {
        setCompany(forParam);
      }
    }

    async function loadData() {
      setLoading(true);
      try {
        // 1. Try checking if it's a Canvas Editor template from my_templates (only if slug is a valid UUID)
        const isUuid =
          Boolean(slug) &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            slug.trim()
          );

        if (isUuid) {
          try {
            const supabase = createClient();
            const { data: templateRow } = await supabase
              .from('my_templates')
              .select('modified_design')
              .eq('id', slug)
              .maybeSingle();

            if (templateRow?.modified_design) {
              setCanvasDesign(templateRow.modified_design as PortfolioDesign);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Ignore non-critical template lookup error
          }
        }

        // 2. Fetch studio portfolio
        const pf = await fetchPublicStudioPortfolio(slug);
        const resolvedPortfolio = pf || DEFAULT_STARTER_PORTFOLIOS[0];

        // Apply recipient company if specified
        if (company) {
          resolvedPortfolio.recipientCompany = company;
        }

        setPortfolio(resolvedPortfolio);

        // 3. Load CVthèque data
        const [
          userProjects,
          userPerso,
          userCreative,
          userSkills,
          userParcours,
          userProfile,
          userLanguages,
          userCerts,
          userMedia,
        ] = await Promise.all([
          fetchUserProjects().catch(() => DEFAULT_STARTER_PROJECTS),
          fetchUserPersonalProjects().catch(() => DEFAULT_STARTER_PERSONAL_PROJECTS),
          fetchUserCreativeStudioItems().catch(() => DEFAULT_STARTER_CREATIVE_STUDIO),
          fetchUserSkills().catch(() => DEFAULT_STARTER_SKILLS),
          fetchUserParcours().catch(() => DEFAULT_STARTER_PARCOURS),
          fetchUserProfileInfo().catch(() => DEFAULT_USER_PROFILE),
          fetchUserLanguages().catch(() => DEFAULT_STARTER_LANGUAGES),
          fetchUserCertifications().catch(() => DEFAULT_STARTER_CERTIFICATIONS),
          fetchUserMediaFiles().catch(() => DEFAULT_STARTER_MEDIA),
        ]);

        if (userProjects && userProjects.length > 0) setProjects(userProjects);
        if (userPerso && userPerso.length > 0) setPersonalProjects(userPerso);
        if (userCreative && userCreative.length > 0) setCreativeStudio(userCreative);
        if (userSkills && userSkills.length > 0) setSkills(userSkills);
        if (userParcours && userParcours.length > 0) setParcours(userParcours);
        if (userProfile) setProfile(userProfile);
        if (userLanguages && userLanguages.length > 0) setLanguages(userLanguages);
        if (userCerts && userCerts.length > 0) setCertifications(userCerts);
        if (userMedia && userMedia.length > 0) setMedia(userMedia);

        // 4. Prioritize embedded snapshot data from the author's saved portfolio
        if (resolvedPortfolio.profileInfo) {
          setProfile(resolvedPortfolio.profileInfo);
        } else {
          setProfile((prev) => ({
            ...prev,
            avatarUrl: resolvedPortfolio.authorAvatar || prev.avatarUrl,
            cvPdfUrl: resolvedPortfolio.cvPdfUrl || prev.cvPdfUrl,
            cvFileName: resolvedPortfolio.cvFileName || prev.cvFileName,
            fullName: resolvedPortfolio.authorName || prev.fullName,
          }));
        }

        if (resolvedPortfolio.cvthequeData) {
          const cd = resolvedPortfolio.cvthequeData;
          if (cd.projects && cd.projects.length > 0) setProjects(cd.projects);
          if (cd.personalProjects && cd.personalProjects.length > 0) setPersonalProjects(cd.personalProjects);
          if (cd.creativeStudio && cd.creativeStudio.length > 0) setCreativeStudio(cd.creativeStudio);
          if (cd.skills && cd.skills.length > 0) setSkills(cd.skills);
          if (cd.parcours && cd.parcours.length > 0) setParcours(cd.parcours);
          if (cd.languages && cd.languages.length > 0) setLanguages(cd.languages);
          if (cd.certifications && cd.certifications.length > 0) setCertifications(cd.certifications);
          if (cd.media && cd.media.length > 0) setMedia(cd.media);
        }
      } catch (err) {
        console.error('Error loading public portfolio:', err);
        setPortfolio(DEFAULT_STARTER_PORTFOLIOS[0]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, company]);

  const activePortfolio = portfolio || DEFAULT_STARTER_PORTFOLIOS[0];

  // ALWAYS call all hooks unconditionally before ANY early returns (Rule of Hooks / React Error #310)
  const selectedProjects = useMemo(() => {
    const list = activePortfolio.selectedProjects || [];
    if (list.length === 0) {
      return projects.slice(0, 3);
    }
    const filtered = projects.filter((p) => list.includes(p.id));
    return filtered.length > 0 ? filtered : projects.slice(0, 3);
  }, [activePortfolio.selectedProjects, projects]);

  const selectedSkills = useMemo(() => {
    const list = activePortfolio.selectedSkills || [];
    if (list.length === 0) {
      return skills.slice(0, 8);
    }
    const filtered = skills.filter((s) => list.includes(s.id));
    return filtered.length > 0 ? filtered : skills.slice(0, 8);
  }, [activePortfolio.selectedSkills, skills]);

  const candidateName =
    activePortfolio?.sectionTexts?.coverAuthorName ||
    activePortfolio?.authorName ||
    profile?.fullName ||
    'KOKOU DUSSEY';

  const candidateEmail = profile?.email || 'kokou.dussey@etu.u-pec.fr';

  const publicUrl = `https://portfoliogen.net/p/${activePortfolio?.slug || slug}${
    company ? `?for=${encodeURIComponent(company)}` : ''
  }`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
    }
    toast.success('Lien public copié dans le presse-papier !');
  };

  const handleDownloadCV = () => {
    if (profile?.cvPdfUrl) {
      downloadDocumentSafe(profile.cvPdfUrl, `CV_${(profile.fullName || 'Candidat').replace(/\s+/g, '_')}.pdf`);
    } else {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F3] text-[#2C2720] p-6">
        <div className="w-12 h-12 rounded-full border-3 border-[#8A7D63]/30 border-t-[#8A7D63] animate-spin mb-4" />
        <p className="text-sm font-bold text-[#1A1815] tracking-wide">
          Chargement du portfolio...
        </p>
        <p className="text-xs text-[#6D624C] mt-1 font-mono">
          portfoliogen.net/p/{slug}
        </p>
      </div>
    );
  }

  // If this was a canvas editor design
  if (canvasDesign) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        {/* Recruiter Action Bar */}
        <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border px-4 py-2 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              Portfolio Public
            </span>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
          >
            <Icon name="LinkIcon" size={13} />
            Partager
          </button>
        </header>

        <div className="flex-1 flex justify-center w-full">
          <CanvasEditor
            design={canvasDesign}
            selectedBlockId={null}
            previewMode="desktop"
            showPreview={true}
            dragOverIndex={null}
            onSelectBlock={() => {}}
            onUpdateBlock={() => {}}
            onDeleteBlock={() => {}}
            onMoveBlock={() => {}}
            onDragStart={() => {}}
            onDrop={() => {}}
            onDragOver={() => {}}
            onOpenCustomize={() => {}}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#2C2720]">
      {/* =================================================================== */}
      {/* RECRUITER TOP FLOATING BAR (NON-INTRUSIVE & 100% PUBLIC) */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-50 bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#E1D9C6] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#8A7D63] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
            {candidateName.charAt(0)}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#1A1815] truncate">
                {candidateName}
              </span>
              <span className="text-xs font-semibold text-[#8A7D63] hidden md:inline truncate">
                • {activePortfolio.name}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Portfolio Public
              </span>
            </div>
            {company && (
              <p className="text-[10px] text-[#8A7D63] font-bold flex items-center gap-1 truncate">
                <Icon name="BuildingOffice2Icon" size={11} />
                Préparé spécialement pour {company}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadCV}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E1D9C6] text-[#2C2720] hover:bg-[#EFEAE1] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Télécharger le Curriculum Vitae"
          >
            <Icon name="ArrowDownTrayIcon" size={13} className="text-[#8A7D63]" />
            <span className="hidden md:inline">Télécharger CV</span>
          </button>

          <a
            href={`mailto:${candidateEmail}?subject=${encodeURIComponent(
              `Contact via PortfolioGen - Opportunité ${company || ''}`
            )}`}
            className="px-3 py-1.5 rounded-lg bg-[#8A7D63] hover:bg-[#73664F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Icon name="EnvelopeIcon" size={13} />
            <span>Contacter</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-white border border-[#E1D9C6] text-[#6D624C] hover:text-[#1A1815] hover:bg-[#EFEAE1] transition-colors shadow-2xs"
            title="Copier le lien public"
          >
            <Icon name="ShareIcon" size={14} />
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* TARGETED RECRUITER WELCOME BANNER (IF ?for=Company IS GIVEN) */}
      {/* =================================================================== */}
      {company && (
        <div className="bg-gradient-to-r from-[#8A7D63]/15 via-[#8A7D63]/10 to-transparent border-b border-[#E1D9C6] px-4 py-2 text-center text-xs text-[#4A4234] font-medium flex items-center justify-center gap-2">
          <Icon name="SparklesIcon" size={14} className="text-[#8A7D63] animate-pulse flex-shrink-0" />
          <span>
            Bienvenue aux recruteurs et équipes de <strong>{company}</strong>. Ce dossier a été personnalisé pour vos opportunités.
          </span>
        </div>
      )}

      {/* =================================================================== */}
      {/* PORTFOLIO CONTENT (FULL STANDALONE VIEW) */}
      {/* =================================================================== */}
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <IndustrialGEIITemplatePreview
          portfolio={activePortfolio}
          projects={projects}
          personalProjects={personalProjects}
          creativeStudio={creativeStudio}
          skills={skills}
          parcours={parcours}
          profile={profile}
          languages={languages}
          certifications={certifications}
          media={media}
        />
      </div>

      {/* =================================================================== */}
      {/* PUBLIC FOOTER */}
      {/* =================================================================== */}
      <footer className="mt-auto border-t border-[#E1D9C6] bg-[#EFEAE1]/60 py-6 px-4 text-center text-xs text-[#6D624C]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            © {new Date().getFullYear()} {candidateName} • Tous droits réservés
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8A7D63]">
            <span>Hébergé sur</span>
            <a
              href="https://portfoliogen.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-[#1A1815] transition-colors"
            >
              PortfolioGen.net
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
