'use client';

import React, { useState, useEffect } from 'react';
import PortfolioList from './PortfolioList';
import PortfolioBuilder from './PortfolioBuilder';
import PortfolioPreview from './PortfolioPreview';
import {
  type StudioPortfolio,
  fetchStudioPortfolios,
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

        if (pList && pList.length > 0) {
          setPortfolios(pList);
          setSelectedPortfolioId(pList[0].id);
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

  const handleUpdate = async (updated: StudioPortfolio) => {
    setPortfolios((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    try {
      await saveStudioPortfolio(updated);
    } catch (err) {
      console.warn('Auto-save error:', err);
    }
  };

  const handleCreateNew = async () => {
    const newId = `pf-${Date.now()}`;
    const newPortfolio: StudioPortfolio = {
      id: newId,
      name: 'Nouveau Portfolio B.U.T. GEII',
      persona: 'Recruteur Industriel & AII',
      template: 'IndustrialGEII',
      syncMode: 'live',
      status: 'active',
      slug: `portfolio-${Date.now().toString().slice(-5)}`,
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
    };

    setPortfolios((prev) => [newPortfolio, ...prev]);
    setSelectedPortfolioId(newId);
    await saveStudioPortfolio(newPortfolio);
    toast.success('Nouveau portfolio créé !');
  };

  const handleDelete = async (id: string) => {
    await deleteStudioPortfolio(id);
    const remaining = portfolios.filter((p) => p.id !== id);
    setPortfolios(remaining);
    if (selectedPortfolioId === id && remaining.length > 0) {
      setSelectedPortfolioId(remaining[0].id);
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
          onSelect={setSelectedPortfolioId}
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