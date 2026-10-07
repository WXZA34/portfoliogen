'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ContentModeration from '../components/ContentModeration';

export default function AdminTemplatesPage() {
  return (
    <AdminLayout
      pageTitle="Marketplace Templates"
      pageSubtitle="Valider et gérer les templates soumis"
    >
      <ContentModeration />
    </AdminLayout>
  );
}
