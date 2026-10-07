'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import CVthequeContent from './components/CVthequeContent';
import { useLanguage } from '@/lib/LanguageContext';

export default function CVthequeMasterPage() {
  const { t } = useLanguage();
  return (
    <AppLayout
      pageTitle={t?.cvtheque?.title}
      pageSubtitle={t?.cvtheque?.subtitle}
    >
      <CVthequeContent />
    </AppLayout>
  );
}