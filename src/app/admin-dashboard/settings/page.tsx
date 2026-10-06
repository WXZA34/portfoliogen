'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import SiteSettings from '../components/SiteSettings';

export default function AdminSettingsPage() {
  return (
    <AdminLayout
      pageTitle="Paramètres du site"
      pageSubtitle="Configuration globale de la plateforme TalentHub"
    >
      <SiteSettings />
    </AdminLayout>
  );
}
