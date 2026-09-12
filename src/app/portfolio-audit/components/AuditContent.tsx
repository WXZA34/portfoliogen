'use client';

import React, { useState } from 'react';
import AuditScoreRing from './AuditScoreRing';
import AuditCategoryBars from './AuditCategoryBars';
import AuditIssuesList from './AuditIssuesList';
import AuditProgressTracker from './AuditProgressTracker';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/LanguageContext';

export default function AuditContent() {
  const [running, setRunning] = useState(false);
  const { t, language } = useLanguage();

  const handleRunAudit = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      toast?.success(language === 'fr' ? 'Audit terminé — 3 nouveaux problèmes détectés' : 'Audit complete — 3 new issues found');
    }, 2200);
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">{t?.audit?.lastAudit} 12 sep. 2026 à 18h00</p>
        </div>
        <button
          onClick={handleRunAudit}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 disabled:opacity-60 transition-all btn-press"
        >
          {running ? (
            <Icon name="Loader2Icon" size={15} className="animate-spin" />
          ) : (
            <Icon name="RefreshCwIcon" size={15} />
          )}
          {running ? t?.audit?.running : t?.audit?.runAudit}
        </button>
      </div>

      {/* Score + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <AuditScoreRing score={87} />
        </div>
        <div className="lg:col-span-2">
          <AuditCategoryBars />
        </div>
      </div>

      {/* Progress Tracker */}
      <AuditProgressTracker />

      {/* Issues List */}
      <div className="mt-6">
        <AuditIssuesList />
      </div>
    </div>
  );
}