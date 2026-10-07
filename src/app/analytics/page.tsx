'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import AnalyticsContent from './components/AnalyticsContent';

export default function AnalyticsPage() {
  return (
    <AppLayout
      pageTitle="Analytics Recruteur"
      pageSubtitle="Carte de chaleur, A/B testing et tunnel de conversion de vos portfolios"
    >
      <AnalyticsContent />
    </AppLayout>
  );
}
