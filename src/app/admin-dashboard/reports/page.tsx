'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ContentModeration from '../components/ContentModeration';

export default function AdminReportsPage() {
  return (
    <AdminLayout
      pageTitle="Signalements"
      pageSubtitle="Traiter les signalements des utilisateurs"
    >
      <ContentModeration />
    </AdminLayout>
  );
}
