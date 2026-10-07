'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import PortfolioStudioContent from './components/PortfolioStudioContent';
import { useLanguage } from '@/lib/LanguageContext';

export default function PortfolioStudioPage() {
  const { t } = useLanguage();
  return (
    <AppLayout
      pageTitle={t?.studio?.title}
      pageSubtitle={t?.studio?.subtitle}
    >
      <PortfolioStudioContent />
    </AppLayout>
  );
}