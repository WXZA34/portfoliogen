'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminAnalytics from '../components/AdminAnalytics';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout
      pageTitle="Analytics globaux"
      pageSubtitle="Statistiques et métriques de la plateforme"
    >
      <AdminAnalytics />
    </AdminLayout>
  );
}
