'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import AIAnalysisContent from './components/AIAnalysisContent';

export default function AIAnalysisPage() {
  return (
    <AppLayout
      pageTitle="Analyse IA de Fiche de Poste"
      pageSubtitle="Score de compatibilité, rédaction contextuelle et suggestions proactives via Gemini"
    >
      <AIAnalysisContent />
    </AppLayout>
  );
}
