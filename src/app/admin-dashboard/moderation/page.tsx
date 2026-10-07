'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminReports from '../components/AdminReports';

export default function AdminModerationPage() {
  return (
    <AdminLayout
      pageTitle="Modération du contenu"
      pageSubtitle="Portfolios, offres d'emploi, templates et signalements"
    >
      <AdminReports />
    </AdminLayout>
  );
}
