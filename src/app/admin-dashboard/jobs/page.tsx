'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ContentModeration from '../components/ContentModeration';

export default function AdminJobsPage() {
  return (
    <AdminLayout
      pageTitle="Modération des offres d'emploi"
      pageSubtitle="Examiner et modérer les offres soumises"
    >
      <ContentModeration />
    </AdminLayout>
  );
}
