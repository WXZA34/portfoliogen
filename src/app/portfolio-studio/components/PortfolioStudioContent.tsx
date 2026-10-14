'use client';

import React, { useState, useEffect } from 'react';
import PortfolioList from './PortfolioList';
import PortfolioBuilder from './PortfolioBuilder';
import PortfolioPreview from './PortfolioPreview';
import {
  type StudioPortfolio,
  fetchStudioPortfolios,
  fetchPublicStudioPortfolio,
  saveStudioPortfolio,
  deleteStudioPortfolio,
  DEFAULT_STARTER_PORTFOLIOS,
  DEFAULT_STUDIO_SECTIONS,
} from '@/lib/services/portfolioStudioService';
import {
  type ProjectItem,
  type PersonalProjectItem,
  type CreativeStudioItem,
  type SkillItem,
  type ParcoursItem,
  type PersonaItem,
  type LanguageItem,
  type CertificationItem,
  type MediaFileItem,
  type UserProfileInfo,
  fetchUserProjects,
  fetchUserPersonalProjects,
  fetchUserCreativeStudioItems,
  fetchUserSkills,
  fetchUserParcours,
  fetchUserPersonas,
  fetchUserProfileInfo,
  fetchUserLanguages,
  fetchUserCertifications,
  fetchUserMediaFiles,
} from '@/lib/services/cvthequeService';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

export default function PortfolioStudioContent() {
  const [portfolios, setPortfolios] = useState<StudioPortfolio[]>(DEFAULT_STARTER_PORTFOLIOS);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>(DEFAULT_STARTER_PORTFOLIOS[0].id);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  // CVthèque Master data
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [personalProjects, setPersonalProjects] = useState<PersonalProjectItem[]>([]);
  const [creativeStudio, setCreativeStudio] = useState<CreativeStudioItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [parcours, setParcours] = useState<ParcoursItem[]>([]);
  const [personas, setPersonas] = useState<PersonaItem[]>([]);
  const [profile, setProfile] = useState<UserProfileInfo | undefined>(undefined);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [media, setMedia] = useState<MediaFileItem[]>([]);

  // Load portfolios and all CVthèque Master rubriques on mount
  useEffect(() => {
    let mounted = true;
    async function loadAllData() {
      try {
        const [
          pList,
          projList,
          persoList,
          creaList,
          skList,
          parcList,
          perList,
          profData,
          langList,
          certList,
          mediaList,
        ] = await Promise.all([
          fetchStudioPortfolios(),
          fetchUserProjects(),
          fetchUserPersonalProjects(),
          fetchUserCreativeStudioItems(),
          fetchUserSkills(),
          fetchUserParcours(),
          fetchUserPersonas(),
          fetchUserProfileInfo(),
          fetchUserLanguages(),
          fetchUserCertifications(),
          fetchUserMediaFiles(),
        ]);

        if (!mounted) return;

        let finalPortfolios: StudioPortfolio[] = pList && pList.length > 0 ? [...pList] : [...DEFAULT_STARTER_PORTFOLIOS];

        // 1. Check URL parameters for ?templateId=, ?portfolioId=, ?id=, ?slug=, ?loadTemplate=
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const requestedId =
          urlParams?.get('templateId') ||
          urlParams?.get('portfolioId') ||
          urlParams?.get('id') ||
          urlParams?.get('slug') ||
          urlParams?.get('loadTemplate');

        let selectedItem: StudioPortfolio | null = null;

        if (requestedId) {
          const reqLower = decodeURIComponent(requestedId).trim().toLowerCase();
          const cleanReq = reqLower.replace(/^studio_slug_/, '').replace(/^studio_pf_/, '');

          // Check if already in current list
          selectedItem =
            finalPortfolios.find(
              (p) =>
                p.id.toLowerCase() === reqLower ||
                p.id.toLowerCase() === cleanReq ||
                p.slug.toLowerCase() === reqLower ||
                p.slug.toLowerCase() === cleanReq ||
                p.template.toLowerCase() === reqLower ||
                p.template.toLowerCase() === cleanReq ||
                `studio_slug_${p.slug.toLowerCase()}` === reqLower
            ) || null;

          // If not in current list, try fetching from Supabase / public studio storage
          if (!selectedItem) {
            try {
              const fetched = await fetchPublicStudioPortfolio(requestedId);
              if (fetched) {
                selectedItem = fetched;
                if (!finalPortfolios.some((p) => p.id === fetched.id || p.slug === fetched.slug)) {
                  finalPortfolios = [fetched, ...finalPortfolios];
                }
              }
            } catch (err) {
              console.warn('Error fetching requested studio portfolio:', err);
            }
          }

          // If still not found, check default starter portfolios
          if (!selectedItem) {
            const starterMatch = DEFAULT_STARTER_PORTFOLIOS.find(
              (s) =>
                s.id.toLowerCase() === reqLower ||
                s.template.toLowerCase() === reqLower ||
                s.name.toLowerCase().includes(reqLower) ||
                s.slug.toLowerCase().includes(reqLower)
            );
            if (starterMatch) {
              selectedItem = {
                ...starterMatch,
                id: `pf-${Date.now()}`,
                name: `${starterMatch.name} (Modèle)`,
                slug: `portfolio-${Date.now().toString().slice(-6)}`,
              };
              finalPortfolios = [selectedItem, ...finalPortfolios];
            }
          }

          if (selectedItem) {
            toast.success(`Portfolio "${selectedItem.name}" ouvert dans le Studio`);
          }
        }

        // 2. If no requested template from URL, fall back to saved active portfolio
        if (!selectedItem) {
          const savedActiveId =
            typeof window !== 'undefined'
              ? localStorage.getItem('portfoliogen_current_active_portfolio_id')
              : null;
          const matched = finalPortfolios.find((p) => p.id === savedActiveId);
          selectedItem = matched || finalPortfolios[0];
        }

        setPortfolios(finalPortfolios);
        if (selectedItem) {
          setSelectedPortfolioId(selectedItem.id);
          if (typeof window !== 'undefined') {
            localStorage.setItem('portfoliogen_current_active_portfolio_id', selectedItem.id);
            localStorage.setItem('portfoliogen_current_active_portfolio', JSON.stringify(selectedItem));
          }
        }
        setProjects(projList || []);
        setPersonalProjects(persoList || []);
        setCreativeStudio(creaList || []);
        setSkills(skList || []);
        setParcours(parcList || []);
        setPersonas(perList || []);
        setProfile(profData);
        setLanguages(langList || []);
        setCertifications(certList || []);
        setMedia(mediaList || []);
      } catch (err) {
        console.warn('Error loading studio data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAllData();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedPortfolio =
    portfolios.find((p) => p.id === selectedPortfolioId) || portfolios[0];

  const handleSelectPortfolio = (id: string) => {
    setSelectedPortfolioId(id);
    const chosen = portfolios.find((p) => p.id === id);
    if (chosen && typeof window !== 'undefined') {
      localStorage.setItem('portfoliogen_current_active_portfolio_id', id);
      localStorage.setItem('portfoliogen_current_active_portfolio', JSON.stringify(chosen));
      localStorage.setItem(`portfoliogen_portfolio_${chosen.slug.toLowerCase()}`, JSON.stringify(chosen));
      localStorage.setItem(`portfoliogen_portfolio_${chosen.id.toLowerCase()}`, JSON.stringify(chosen));
    }
  };

  const handleUpdate = async (updated: StudioPortfolio) => {
    // 1. Optimistic state update
    setPortfolios((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfoliogen_current_active_portfolio_id', updated.id);
      localStorage.setItem('portfoliogen_current_active_portfolio', JSON.stringify(updated));
      localStorage.setItem(`portfoliogen_portfolio_${updated.slug.toLowerCase().trim()}`, JSON.stringify(updated));
      localStorage.setItem(`portfoliogen_portfolio_${updated.id.toLowerCase().trim()}`, JSON.stringify(updated));
    }
    // 2. Persist to database
    try {
      const saved = await saveStudioPortfolio(updated);
      if (saved && saved.id !== updated.id) {
        setPortfolios((prev) => prev.map((p) => (p.id === updated.id ? saved : p)));
        setSelectedPortfolioId(saved.id);
      }
    } catch (err) {
      console.warn('Auto-save error:', err);
    }
  };

  const handleCreateNew = async () => {
    const timestamp = Date.now().toString().slice(-4);
    const newId = `pf-${Date.now()}`;
    const newSlug = `portfolio-${Date.now().toString().slice(-6)}`;
    const newPortfolio: StudioPortfolio = {
      id: newId,
      name: `Nouveau Portfolio (${timestamp})`,
      persona: 'Recruteur Industriel & AII',
      template: 'IndustrialGEII',
      syncMode: 'live',
      status: 'active',
      slug: newSlug,
      views: 0,
      lastUpdated: 'À l\'instant',
      enabledSections: { ...DEFAULT_STUDIO_SECTIONS },
      selectedProjects: projects.slice(0, 4).map((p) => p.id),
      selectedPersonalProjects: personalProjects.slice(0, 3).map((p) => p.id),
      selectedCreativeStudio: creativeStudio.slice(0, 3).map((c) => c.id),
      selectedSkills: skills.slice(0, 8).map((s) => s.id),
      selectedParcours: parcours.slice(0, 3).map((p) => p.id),
      selectedLanguages: languages.slice(0, 3).map((l) => l.id),
      selectedCertifications: certifications.slice(0, 3).map((c) => c.id),
      customIntro: profile?.slogan || 'Concevoir la logique. Piloter le système.',
      institution: 'IUT SÉNART-FONTAINEBLEAU',
      degree: 'BACHELOR UNIVERSITAIRE DE TECHNOLOGIE',
      subTitle: 'Portfolio Semestre 2',
      promotion: 'PROMOTION 2025–2026',
      authorName: profile?.fullName || 'KOKOU DUSSEY',
      themeColors: { ...DEFAULT_STARTER_PORTFOLIOS[0].themeColors },
      sectionTexts: { ...DEFAULT_STARTER_PORTFOLIOS[0].sectionTexts },
      recipientCompany: '',
      recipientName: '',
      customShareUrl: '',
    };

    const saved = await saveStudioPortfolio(newPortfolio);
    const finalItem = saved || newPortfolio;
    setPortfolios((prev) => [finalItem, ...prev.filter((p) => p.id !== finalItem.id)]);
    handleSelectPortfolio(finalItem.id);
    toast.success(`Nouveau portfolio "${finalItem.name}" créé avec son lien unique : /p/${finalItem.slug}`);
  };

  const handleDelete = async (id: string) => {
    await deleteStudioPortfolio(id);
    const remaining = portfolios.filter((p) => p.id !== id);
    setPortfolios(remaining);
    if (selectedPortfolioId === id && remaining.length > 0) {
      handleSelectPortfolio(remaining[0].id);
    }
    toast.success('Portfolio supprimé.');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Icon name="Loader2Icon" size={28} className="animate-spin text-primary" />
        <p className="text-xs font-600">Chargement du Studio Portfolio & de la CVthèque Master...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-160px)]">
      {/* Left: Portfolio List */}
      <div className="lg:col-span-3">
        <PortfolioList
          portfolios={portfolios}
          selectedId={selectedPortfolioId}
          onSelect={handleSelectPortfolio}
          onCreateNew={handleCreateNew}
          onDelete={handleDelete}
        />
      </div>

      {/* Center: Builder */}
      <div className={`${previewVisible ? 'lg:col-span-4' : 'lg:col-span-9'}`}>
        <PortfolioBuilder
          portfolio={selectedPortfolio}
          onUpdate={handleUpdate}
          projects={projects}
          personalProjects={personalProjects}
          creativeStudio={creativeStudio}
          skills={skills}
          parcours={parcours}
          personas={personas}
          languages={languages}
          certifications={certifications}
          media={media}
          profile={profile}
          previewVisible={previewVisible}
          onTogglePreview={() => setPreviewVisible(!previewVisible)}
        />
      </div>

      {/* Right: Live Preview */}
      {previewVisible && (
        <div className="lg:col-span-5">
          <PortfolioPreview
            portfolio={selectedPortfolio}
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
      )}
    </div>
  );
}