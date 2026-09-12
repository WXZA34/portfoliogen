'use client';

import React, { useState } from 'react';
import PortfolioList from './PortfolioList';
import PortfolioBuilder from './PortfolioBuilder';
import PortfolioPreview from './PortfolioPreview';

export type Portfolio = {
  id: string;
  name: string;
  persona: string;
  template: 'ClassicCream' | 'BentoMinimal';
  syncMode: 'live' | 'frozen';
  status: 'active' | 'draft';
  slug: string;
  views: number;
  lastUpdated: string;
  selectedProjects: string[];
  selectedSkills: string[];
};

const initialPortfolios: Portfolio[] = [
  { id: 'pf-001', name: 'Full-Stack Dev', persona: 'Tech Recruiter', template: 'BentoMinimal', syncMode: 'live', status: 'active', slug: 'alex-martin/fullstack-dev', views: 487, lastUpdated: 'Sep 12, 2026', selectedProjects: ['proj-001', 'proj-002', 'proj-003'], selectedSkills: ['sk-001', 'sk-002', 'sk-003'] },
  { id: 'pf-002', name: 'AI Engineer', persona: 'AI Startup', template: 'ClassicCream', syncMode: 'live', status: 'active', slug: 'alex-martin/ai-engineer', views: 312, lastUpdated: 'Sep 10, 2026', selectedProjects: ['proj-001', 'proj-004'], selectedSkills: ['sk-001', 'sk-008'] },
  { id: 'pf-003', name: 'Startup CTO', persona: 'Startup Founder', template: 'BentoMinimal', syncMode: 'frozen', status: 'active', slug: 'alex-martin/startup-cto', views: 421, lastUpdated: 'Aug 28, 2026', selectedProjects: ['proj-002', 'proj-005'], selectedSkills: ['sk-007', 'sk-011'] },
  { id: 'pf-004', name: 'Open Source', persona: 'OSS Community', template: 'ClassicCream', syncMode: 'live', status: 'active', slug: 'alex-martin/open-source', views: 276, lastUpdated: 'Sep 08, 2026', selectedProjects: ['proj-005'], selectedSkills: ['sk-001', 'sk-002'] },
  { id: 'pf-005', name: 'Freelance Dev', persona: 'Startup SME', template: 'ClassicCream', syncMode: 'live', status: 'draft', slug: 'alex-martin/freelance', views: 0, lastUpdated: 'Sep 11, 2026', selectedProjects: ['proj-003'], selectedSkills: ['sk-001', 'sk-002', 'sk-003'] },
];

export default function PortfolioStudioContent() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>(initialPortfolios[0].id);
  const [previewVisible, setPreviewVisible] = useState(true);

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId) ?? portfolios[0];

  const handleUpdate = (updated: Portfolio) => {
    setPortfolios((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-160px)]">
      {/* Left: Portfolio List */}
      <div className="lg:col-span-3">
        <PortfolioList
          portfolios={portfolios}
          selectedId={selectedPortfolioId}
          onSelect={setSelectedPortfolioId}
        />
      </div>

      {/* Center: Builder */}
      <div className={`${previewVisible ? 'lg:col-span-4' : 'lg:col-span-9'}`}>
        <PortfolioBuilder
          portfolio={selectedPortfolio}
          onUpdate={handleUpdate}
          previewVisible={previewVisible}
          onTogglePreview={() => setPreviewVisible(!previewVisible)}
        />
      </div>

      {/* Right: Preview */}
      {previewVisible && (
        <div className="lg:col-span-5">
          <PortfolioPreview portfolio={selectedPortfolio} />
        </div>
      )}
    </div>
  );
}