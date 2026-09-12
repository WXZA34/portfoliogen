'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { Portfolio } from './PortfolioStudioContent';

interface PortfolioPreviewProps {
  portfolio: Portfolio;
}

export default function PortfolioPreview({ portfolio }: PortfolioPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="bg-card border border-border rounded-xl shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-negative/60" />
          <div className="w-3 h-3 rounded-full bg-warning/60" />
          <div className="w-3 h-3 rounded-full bg-positive/60" />
          <span className="ml-2 text-xs font-mono-data text-muted-foreground">portfoliogen.io/{portfolio.slug}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg transition-all ${device === 'desktop' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name="MonitorIcon" size={14} />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg transition-all ${device === 'mobile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name="SmartphoneIcon" size={14} />
          </button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 overflow-hidden p-4 flex items-start justify-center bg-muted/30">
        <div
          className={`bg-white rounded-xl shadow-card-lg overflow-hidden transition-all duration-300 ${
            device === 'mobile' ? 'w-64' : 'w-full'
          }`}
          style={{ minHeight: '480px' }}
        >
          {portfolio.template === 'ClassicCream' ? (
            <ClassicCreamPreview portfolio={portfolio} />
          ) : (
            <BentoMinimalPreview portfolio={portfolio} />
          )}
        </div>
      </div>

      <div className="p-3 border-t border-border flex items-center justify-between">
        <span className={`text-xs font-600 px-2 py-1 rounded-full ${portfolio.syncMode === 'live' ? 'sync-live' : 'sync-frozen'}`}>
          {portfolio.syncMode === 'live' ? '⚡ Live Sync' : '❄ Frozen'}
        </span>
        <button className="flex items-center gap-1.5 text-xs text-primary font-600 hover:underline">
          <Icon name="ExternalLinkIcon" size={12} />
          Open in new tab
        </button>
      </div>
    </div>
  );
}

function ClassicCreamPreview({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="portfolio-classic bg-amber-50 min-h-full p-6">
      <div className="border-b border-amber-200 pb-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-amber-200 mb-3 flex items-center justify-center text-amber-800 font-bold text-lg">AM</div>
        <h1 className="text-xl font-bold text-amber-900">Alexandre Martin</h1>
        <p className="text-sm text-amber-700 mt-0.5">{portfolio.persona === 'AI Startup' ? 'AI Engineer & ML Specialist' : 'Senior Full-Stack Engineer'}</p>
        <p className="text-xs text-amber-600 mt-2 leading-relaxed">Building scalable systems and developer tools that power the next generation of software.</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Selected Projects</h2>
        <div className="space-y-2">
          {portfolio.selectedProjects.slice(0, 2).map((id) => (
            <div key={`preview-proj-${id}`} className="bg-white/70 rounded-lg p-2.5 border border-amber-100">
              <p className="text-xs font-bold text-amber-900">
                {id === 'proj-001' ? 'NeuralCommerce Platform' :
                 id === 'proj-002' ? 'DistributedDB Orchestrator' :
                 id === 'proj-003' ? 'RealTime Collaboration SDK' :
                 id === 'proj-004' ? 'Predictive DevOps Monitor' :
                 id === 'proj-005' ? 'Open Source CLI Framework' : 'FinTech Compliance Engine'}
              </p>
              <div className="flex gap-1 mt-1">
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">React</span>
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">Python</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Skills</h2>
        <div className="flex flex-wrap gap-1">
          {portfolio.selectedSkills.slice(0, 4).map((id) => (
            <span key={`preview-skill-${id}`} className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs font-medium">
              {id === 'sk-001' ? 'TypeScript' : id === 'sk-002' ? 'React' : id === 'sk-003' ? 'Node.js' : id === 'sk-007' ? 'System Design' : id === 'sk-008' ? 'ML' : 'Leadership'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BentoMinimalPreview({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="bg-slate-50 min-h-full p-4">
      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm">AM</div>
        <div>
          <p className="text-sm font-bold text-slate-900">Alexandre Martin</p>
          <p className="text-xs text-slate-500">{portfolio.persona === 'AI Startup' ? 'AI Engineer' : 'Full-Stack Engineer'}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {portfolio.selectedProjects.slice(0, 2).map((id, i) => (
          <div key={`bento-proj-${id}`} className={`bg-white rounded-xl p-2.5 border border-slate-100 ${i === 0 ? 'col-span-2' : ''}`}>
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {id === 'proj-001' ? 'NeuralCommerce' :
               id === 'proj-002' ? 'DistributedDB' :
               id === 'proj-003' ? 'Collab SDK' :
               id === 'proj-005' ? 'CLI Forge' : 'DevOps Monitor'}
            </p>
            <div className="flex gap-1 mt-1">
              <span className="px-1 py-0.5 bg-primary/10 text-primary rounded text-xs">TS</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-2.5 border border-slate-100">
        <p className="text-xs font-bold text-slate-600 mb-1.5">Skills</p>
        <div className="flex flex-wrap gap-1">
          {portfolio.selectedSkills.slice(0, 3).map((id) => (
            <span key={`bento-skill-${id}`} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {id === 'sk-001' ? 'TypeScript' : id === 'sk-002' ? 'React' : id === 'sk-007' ? 'System Design' : 'Node.js'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}