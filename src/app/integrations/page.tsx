'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import IntegrationsContent from './components/IntegrationsContent';

export default function IntegrationsPage() {
  return (
    <AppLayout
      pageTitle="Intégrations"
      pageSubtitle="Importez depuis LinkedIn, GitHub, Notion et synchronisez vos certifications"
    >
      <IntegrationsContent />
    </AppLayout>
  );
}
