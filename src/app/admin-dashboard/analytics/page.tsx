'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminOverview from '../components/AdminOverview';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout
      pageTitle="Analytics globaux"
      pageSubtitle="Statistiques et métriques de la plateforme"
    >
      <AdminOverview />
    </AdminLayout>
  );
}
