'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import CRMContent from './components/CRMContent';

export default function CRMPage() {
  return (
    <AppLayout
      pageTitle="CRM Candidatures"
      pageSubtitle="Gérez vos candidatures, entreprises et relances depuis un seul endroit"
    >
      <CRMContent />
    </AppLayout>
  );
}
