'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useRouter } from 'next/navigation';

import RecruiterChatbox from './RecruiterChatbox';


import { ClassicCreamTemplate, BentoMinimalTemplate, DarkTechTemplate, EditorialBoldTemplate } from './PortfolioTemplates';

type TemplateId = 'classic' | 'bento' | 'dark' | 'editorial';

const TEMPLATES: { id: TemplateId; name: string; desc: string; color: string; textColor: string }[] = [
  { id: 'classic', name: 'ClassicCream', desc: 'Élégant & chaleureux', color: 'bg-amber-100 border-amber-300', textColor: 'text-amber-800' },
  { id: 'bento', name: 'BentoMinimal', desc: 'Moderne & épuré', color: 'bg-slate-100 border-slate-300', textColor: 'text-slate-700' },
  { id: 'dark', name: 'Dark Tech', desc: 'Sombre & impactant', color: 'bg-slate-900 border-slate-600', textColor: 'text-emerald-400' },
  { id: 'editorial', name: 'Éditorial Bold', desc: 'Audacieux & typographique', color: 'bg-white border-slate-900', textColor: 'text-rose-600' },
];

export default function PublicPortfolioView() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('classic');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Template Switcher Bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => router.back()}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Retour"
          >
            <Icon name="ArrowLeftIcon" size={18} />
          </button>
          <span className="text-xs font-700 text-muted-foreground uppercase tracking-wide flex-shrink-0 flex items-center gap-1.5">
            <Icon name="LayoutTemplateIcon" size={13} />
            Template :
          </span>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setActiveTemplate(tpl.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-xs font-700 transition-all flex-shrink-0 ${tpl.color} ${tpl.textColor} ${
                activeTemplate === tpl.id ? 'ring-2 ring-primary ring-offset-1 scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {tpl.name}
              {activeTemplate === tpl.id && <Icon name="CheckIcon" size={11} />}
            </button>
          ))}
        </div>
      </div>

      {/* Template Render */}
      {activeTemplate === 'classic' && <ClassicCreamTemplate />}
      {activeTemplate === 'bento' && <BentoMinimalTemplate />}
      {activeTemplate === 'dark' && <DarkTechTemplate />}
      {activeTemplate === 'editorial' && <EditorialBoldTemplate />}

      {/* Recruiter Chatbox — always visible */}
      <RecruiterChatbox open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
}