'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import CampaignsContent from './components/CampaignsContent';
import { useLanguage } from '@/lib/LanguageContext';

export default function CampaignsTrackingPage() {
  const { t } = useLanguage();
  return (
    <AppLayout
      pageTitle={t?.campaigns?.title}
      pageSubtitle={t?.campaigns?.subtitle}
    >
      <CampaignsContent />
    </AppLayout>
  );
}