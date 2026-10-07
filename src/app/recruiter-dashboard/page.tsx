'use client';

import RecruiterLayout from '@/components/RecruiterLayout';
import RecruiterOverview from './components/RecruiterOverview';

export default function RecruiterDashboardPage() {
  return (
    <RecruiterLayout pageTitle="Vue d'ensemble" pageSubtitle="Tableau de bord recruteur">
      <RecruiterOverview />
    </RecruiterLayout>
  );
}
