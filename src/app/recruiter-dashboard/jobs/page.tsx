'use client';

import RecruiterLayout from '@/components/RecruiterLayout';
import JobOffersContent from './JobOffersContent';

export default function JobOffersPage() {
  return (
    <RecruiterLayout pageTitle="Offres d'emploi" pageSubtitle="Gérer et publier vos offres de recrutement">
      <JobOffersContent />
    </RecruiterLayout>
  );
}
