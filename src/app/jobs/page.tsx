'use client';

import AppLayout from '@/components/AppLayout';
import JobDiscoveryContent from './components/JobDiscoveryContent';

export default function JobsPage() {
  return (
    <AppLayout pageTitle="Offres d'emploi" pageSubtitle="Trouvez votre prochain poste via votre portfolio">
      <JobDiscoveryContent />
    </AppLayout>
  );
}
