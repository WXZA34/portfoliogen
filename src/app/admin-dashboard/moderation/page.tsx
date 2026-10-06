'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ContentModeration from '../components/ContentModeration';

export default function AdminModerationPage() {
  return (
    <AdminLayout
      pageTitle="Modération du contenu"
      pageSubtitle="Portfolios, offres d'emploi, templates et signalements"
    >
      <ContentModeration />
    </AdminLayout>
  );
}
