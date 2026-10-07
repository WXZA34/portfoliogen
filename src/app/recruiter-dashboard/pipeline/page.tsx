'use client';

import RecruiterLayout from '@/components/RecruiterLayout';
import PipelineContent from './PipelineContent';

export default function PipelinePage() {
  return (
    <RecruiterLayout pageTitle="Pipeline de candidatures" pageSubtitle="Suivre et gérer toutes les candidatures en cours">
      <PipelineContent />
    </RecruiterLayout>
  );
}
