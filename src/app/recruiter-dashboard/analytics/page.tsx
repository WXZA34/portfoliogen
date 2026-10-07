'use client';

import RecruiterLayout from '@/components/RecruiterLayout';
import RecruiterAnalyticsContent from './RecruiterAnalyticsContent';

export default function RecruiterAnalyticsPage() {
  return (
    <RecruiterLayout pageTitle="Analytics Recrutement" pageSubtitle="Performances et insights de votre pipeline">
      <RecruiterAnalyticsContent />
    </RecruiterLayout>
  );
}
