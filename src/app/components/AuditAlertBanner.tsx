'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/lib/LanguageContext';

export default function AuditAlertBanner() {
  const { t, language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-negative/10 border border-negative/20 rounded-xl mb-6 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-negative/15 flex items-center justify-center">
        <Icon name="AlertTriangleIcon" size={16} className="text-negative" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-600 text-negative">{t?.dashboard?.auditBanner?.title}</p>
        <p className="text-xs text-negative/70 mt-0.5">{t?.dashboard?.auditBanner?.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/portfolio-audit"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-negative text-white rounded-lg text-xs font-600 hover:opacity-90 transition-all duration-150 btn-press"
        >
          <Icon name="ArrowRightIcon" size={12} />
          {t?.dashboard?.auditBanner?.cta}
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg text-negative/60 hover:text-negative hover:bg-negative/10 transition-all"
          title={t?.dashboard?.auditBanner?.dismiss}
        >
          <Icon name="XIcon" size={14} />
        </button>
      </div>
    </div>
  );
}