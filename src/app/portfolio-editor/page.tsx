'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import PortfolioEditorContent from './components/PortfolioEditorContent';

export default function PortfolioEditorPage() {
  return (
    <AppLayout pageTitle="Éditeur de Portfolio" pageSubtitle="Créez votre portfolio comme sur Canva">
      <PortfolioEditorContent />
    </AppLayout>
  );
}
