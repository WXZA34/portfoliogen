'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuditContent from './components/AuditContent';
import { useLanguage } from '@/lib/LanguageContext';

export default function PortfolioAuditPage() {
  const { t } = useLanguage();
  return (
    <AppLayout
      pageTitle={t?.audit?.title}
      pageSubtitle={t?.audit?.subtitle}
    >
      <AuditContent />
    </AppLayout>
  );
}