'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import type { StudioPortfolio } from '@/lib/services/portfolioStudioService';
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
import IndustrialGEIITemplatePreview from './templates/IndustrialGEIITemplatePreview';

interface PortfolioPreviewProps {
  portfolio: StudioPortfolio;
  projects?: ProjectItem[];
  personalProjects?: PersonalProjectItem[];
  creativeStudio?: CreativeStudioItem[];
  skills?: SkillItem[];
  parcours?: ParcoursItem[];
  profile?: UserProfileInfo;
  languages?: LanguageItem[];
  certifications?: CertificationItem[];
  media?: MediaFileItem[];
}

export default function PortfolioPreview({
  portfolio,
  projects = [],
  personalProjects = [],
  creativeStudio = [],
  skills = [],
  parcours = [],
  profile,
  languages = [],
  certifications = [],
  media = [],
}: PortfolioPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Filter selected items from CVthèque Master
  const selectedProjectItems = projects.filter((p) =>
    portfolio.selectedProjects.includes(p.id)
  );

  const selectedSkillItems = skills.filter((s) =>
    portfolio.selectedSkills.includes(s.id)
  );

  const renderTemplateContent = () => {
    if (portfolio.template === 'IndustrialGEII') {
      return (
        <IndustrialGEIITemplatePreview
          portfolio={portfolio}
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
      );
    }

    if (portfolio.template === 'ClassicCream') {
      return (
        <ClassicCreamPreview
          portfolio={portfolio}
          selectedProjects={selectedProjectItems}
          selectedSkills={selectedSkillItems}
        />
      );
    }

    // Default: BentoMinimal or other modern layouts
    return (
      <BentoMinimalPreview
        portfolio={portfolio}
        selectedProjects={selectedProjectItems}
        selectedSkills={selectedSkillItems}
      />
    );
  };

  const publicUrl = `/p/${portfolio.slug || portfolio.id}`;
  const fullPublicUrl = `https://portfoliogen.net/p/${portfolio.slug || portfolio.id}`;

  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-card h-full flex flex-col">
        {/* Preview Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-3 h-3 rounded-full bg-negative/60 flex-shrink-0" />
            <div className="w-3 h-3 rounded-full bg-warning/60 flex-shrink-0" />
            <div className="w-3 h-3 rounded-full bg-positive/60 flex-shrink-0" />
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs font-mono-data text-primary hover:underline truncate max-w-[200px] sm:max-w-[250px] flex items-center gap-1 font-bold"
              title="Ouvrir le lien réel dans un nouvel onglet"
            >
              <span>portfoliogen.net/p/{portfolio.slug || portfolio.id}</span>
              <Icon name="ArrowTopRightOnSquareIcon" size={12} className="flex-shrink-0 opacity-80" />
            </a>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(fullPublicUrl);
                  toast.success(`Lien public copié : ${fullPublicUrl}`);
                }
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
              title="Copier le lien public"
            >
              <Icon name="ShareIcon" size={13} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg transition-all ${
                device === 'desktop'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Vue Bureau"
            >
              <Icon name="MonitorIcon" size={14} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg transition-all ${
                device === 'mobile'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Vue Mobile"
            >
              <Icon name="SmartphoneIcon" size={14} />
            </button>
            <button
              onClick={() => setIsFullScreen(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all ml-1"
              title="Aperçu plein écran"
            >
              <Icon name="ArrowsPointingOutIcon" size={14} />
            </button>
          </div>
        </div>

        {/* Preview Viewport Frame */}
        <div className="flex-1 overflow-y-auto p-4 flex items-start justify-center bg-muted/30">
          <div
            className={`bg-white rounded-xl shadow-card-lg overflow-hidden transition-all duration-300 border border-border/80 ${
              device === 'mobile' ? 'w-80 max-w-full' : 'w-full'
            }`}
            style={{ minHeight: '520px' }}
          >
            {renderTemplateContent()}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-600 px-2 py-1 rounded-full ${
                portfolio.syncMode === 'live' ? 'sync-live' : 'sync-frozen'
              }`}
            >
              {portfolio.syncMode === 'live' ? '⚡ Live Sync CVthèque' : '❄ Figé'}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {portfolio.template === 'IndustrialGEII'
                ? 'Modèle B.U.T. GEII'
                : portfolio.template}
            </span>
          </div>

          <button
            onClick={() => setIsFullScreen(true)}
            className="flex items-center gap-1.5 text-xs text-primary font-600 hover:underline"
          >
            <Icon name="ExternalLinkIcon" size={12} />
            Ouvrir en grand
          </button>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="max-w-5xl w-full mx-auto bg-card rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden border border-border">
            <div className="px-6 py-3.5 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-3">
                <span className="font-800 text-sm text-foreground">
                  Aperçu Réel Studio : {portfolio.name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-600">
                  {portfolio.template}
                </span>
              </div>
              <button
                onClick={() => setIsFullScreen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/20">
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-card overflow-hidden">
                {renderTemplateContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ClassicCreamPreview({
  portfolio,
  selectedProjects,
  selectedSkills,
}: {
  portfolio: StudioPortfolio;
  selectedProjects: ProjectItem[];
  selectedSkills: SkillItem[];
}) {
  const author = portfolio.authorName || 'Alexandre Martin';
  return (
    <div className="portfolio-classic bg-[#FAF7F2] min-h-full p-6 text-[#2C2720]">
      <div className="border-b border-[#E3DDD1] pb-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#E5DFC9] mb-3 flex items-center justify-center text-[#5C503D] font-bold text-lg">
          {author.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-[#1E1B18]">{author}</h1>
        <p className="text-sm text-[#73634B] mt-0.5 font-600">
          {portfolio.persona}
        </p>
        <p className="text-xs text-[#524838] mt-2 leading-relaxed italic">
          « {portfolio.customIntro || 'Architecte de solutions et ingénieur système.'} »
        </p>
      </div>

      <div className="mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <h2 className="text-xs font-bold text-[#5C503D] uppercase tracking-wider">
            Projets Sélectionnés ({selectedProjects.length})
          </h2>
          <span className="text-[10px] text-[#8C7B60]">CVthèque Master</span>
        </div>

        {selectedProjects.length === 0 ? (
          <div className="p-4 rounded-lg border border-dashed border-[#CFC5B4] text-center text-xs text-[#73634B]">
            Aucun projet sélectionné. Cochez des projets dans l&apos;onglet Contenu.
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedProjects.slice(0, 3).map((proj) => (
              <div
                key={`classic-proj-${proj.id}`}
                className="bg-white/80 rounded-lg p-3 border border-[#E3DDD1] shadow-2xs"
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-[#1E1B18]">{proj.title}</p>
                  {proj.year && (
                    <span className="text-[10px] text-[#8C7B60] font-mono">{proj.year}</span>
                  )}
                </div>
                <p className="text-[11px] text-[#524838] line-clamp-2 mt-1">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#E3DDD1] text-[#5C503D] rounded text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xs font-bold text-[#5C503D] uppercase tracking-wider mb-2.5">
          Compétences ({selectedSkills.length})
        </h2>
        {selectedSkills.length === 0 ? (
          <div className="p-3 rounded-lg border border-dashed border-[#CFC5B4] text-center text-xs text-[#73634B]">
            Aucune compétence sélectionnée.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedSkills.slice(0, 8).map((skill) => (
              <span
                key={`classic-skill-${skill.id}`}
                className="px-2.5 py-1 bg-[#EAE4D5] text-[#40382B] rounded-full text-[11px] font-600"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BentoMinimalPreview({
  portfolio,
  selectedProjects,
  selectedSkills,
}: {
  portfolio: StudioPortfolio;
  selectedProjects: ProjectItem[];
  selectedSkills: SkillItem[];
}) {
  const author = portfolio.authorName || 'Alexandre Martin';
  return (
    <div className="bg-slate-50 min-h-full p-4 text-slate-800">
      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-xs">
          {author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{author}</p>
          <p className="text-xs text-slate-500">{portfolio.persona}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-700 text-slate-600 uppercase tracking-wider">
            Projets ({selectedProjects.length})
          </span>
          <span className="text-[10px] text-primary font-600">CVthèque Master</span>
        </div>

        {selectedProjects.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-white">
            Aucun projet sélectionné.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {selectedProjects.slice(0, 3).map((proj, i) => (
              <div
                key={`bento-proj-${proj.id}`}
                className={`bg-white rounded-xl p-2.5 border border-slate-200 ${
                  i === 0 ? 'col-span-2' : ''
                }`}
              >
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {proj.title}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {proj.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-3 border border-slate-200">
        <p className="text-xs font-bold text-slate-600 mb-2">
          Compétences ({selectedSkills.length})
        </p>
        {selectedSkills.length === 0 ? (
          <p className="text-xs text-slate-400">Aucune compétence sélectionnée.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedSkills.slice(0, 6).map((skill) => (
              <span
                key={`bento-skill-${skill.id}`}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-500"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}