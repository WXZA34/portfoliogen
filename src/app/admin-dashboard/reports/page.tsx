'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminReports from '../components/AdminReports';

export default function AdminReportsPage() {
  return (
    <AdminLayout
      pageTitle="Signalements"
      pageSubtitle="Traiter et gérer les signalements des utilisateurs"
    >
      <AdminReports />
    </AdminLayout>
  );
}
