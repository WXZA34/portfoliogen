'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ContentModeration from '../components/ContentModeration';

export default function AdminCredentialsPage() {
  return (
    <AdminLayout
      pageTitle="Vérification des credentials"
      pageSubtitle="Valider les certifications et diplômes soumis"
    >
      <ContentModeration />
    </AdminLayout>
  );
}
