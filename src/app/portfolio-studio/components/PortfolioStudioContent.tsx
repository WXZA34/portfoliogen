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
} from '@/lib/services/portfolioStudioService';
import {
  type ProjectItem,
  type SkillItem,
  type ParcoursItem,
  type PersonaItem,
  fetchUserProjects,
  fetchUserSkills,
  fetchUserParcours,
  fetchUserPersonas,
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
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [parcours, setParcours] = useState<ParcoursItem[]>([]);
  const [personas, setPersonas] = useState<PersonaItem[]>([]);

  // Load portfolios and CVthèque Master data on mount
  useEffect(() => {
    let mounted = true;
    async function loadAllData() {
      try {
        const [pList, projList, skList, parcList, perList] = await Promise.all([
          fetchStudioPortfolios(),
          fetchUserProjects(),
          fetchUserSkills(),
          fetchUserParcours(),
          fetchUserPersonas(),
        ]);

        if (!mounted) return;

        if (pList && pList.length > 0) {
          setPortfolios(pList);
          setSelectedPortfolioId(pList[0].id);
        }
        setProjects(projList || []);
        setSkills(skList || []);
        setParcours(parcList || []);
        setPersonas(perList || []);
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
      selectedProjects: projects.slice(0, 3).map((p) => p.id),
      selectedSkills: skills.slice(0, 6).map((s) => s.id),
      selectedParcours: parcours.slice(0, 2).map((p) => p.id),
      customIntro: 'Concevoir la logique. Piloter le système.',
      institution: 'IUT SÉNART-FONTAINEBLEAU',
      degree: 'BACHELOR UNIVERSITAIRE DE TECHNOLOGIE',
      subTitle: 'Portfolio Semestre 2',
      promotion: 'PROMOTION 2025–2026',
      authorName: 'KOKOU DUSSEY',
    };

    setPortfolios((prev) => [newPortfolio, ...prev]);
    setSelectedPortfolioId(newId);
    await saveStudioPortfolio(newPortfolio);
    toast.success('Nouveau portfolio créé avec le template B.U.T. GEII !');
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
          skills={skills}
          parcours={parcours}
          personas={personas}
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
            skills={skills}
            parcours={parcours}
          />
        </div>
      )}
    </div>
  );
}