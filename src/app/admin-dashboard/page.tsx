'use client';

import React from 'react';
import AdminLayout from './components/AdminLayout';
import AdminOverview from './components/AdminOverview';

export default function AdminDashboardPage() {
  return (
    <AdminLayout
      pageTitle="Tableau de bord Admin"
      pageSubtitle="Vue globale de la plateforme TalentHub"
    >
      <AdminOverview />
    </AdminLayout>
  );
}
