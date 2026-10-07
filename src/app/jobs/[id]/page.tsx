'use client';

import React from "react";
import AppLayout from '@/components/AppLayout';
import JobDetailContent from '../components/JobDetailContent';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <AppLayout pageTitle="Détail de l'offre" pageSubtitle="Postulez avec votre portfolio">
      <JobDetailContent jobId={id} />
    </AppLayout>
  );
}
