'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ExportToolsContent from './components/ExportToolsContent';

export default function ExportToolsPage() {
  return (
    <AppLayout
      pageTitle="Outils d'Export"
      pageSubtitle="PDF premium, CV ATS-compatible, QR Code et mini-site sous-domaine"
    >
      <ExportToolsContent />
    </AppLayout>
  );
}
