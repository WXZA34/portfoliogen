'use client';

import RecruiterLayout from '@/components/RecruiterLayout';
import TalentSearchContent from './TalentSearchContent';

export default function TalentSearchPage() {
  return (
    <RecruiterLayout pageTitle="Recherche de talents" pageSubtitle="Explorer les portfolios et découvrir des profils">
      <TalentSearchContent />
    </RecruiterLayout>
  );
}
