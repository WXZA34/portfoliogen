'use client';

import RecruiterLayout from '@/components/RecruiterLayout';
import InterviewSchedulerContent from './InterviewSchedulerContent';

export default function InterviewsPage() {
  return (
    <RecruiterLayout pageTitle="Entretiens" pageSubtitle="Planifier et gérer vos entretiens">
      <InterviewSchedulerContent />
    </RecruiterLayout>
  );
}
