'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import TemplatesContent from './components/TemplatesContent';

export default function TemplatesPage() {
  return (
    <AppLayout
      pageTitle="Marketplace de Templates"
      pageSubtitle="Découvrez, créez et partagez des templates par domaine et thématique"
    >
      <TemplatesContent />
    </AppLayout>
  );
}
