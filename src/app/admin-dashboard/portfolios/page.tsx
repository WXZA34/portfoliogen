'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ContentModeration from '../components/ContentModeration';

export default function AdminPortfoliosPage() {
  return (
    <AdminLayout
      pageTitle="Modération des portfolios"
      pageSubtitle="Examiner et modérer les portfolios soumis"
    >
      <ContentModeration />
    </AdminLayout>
  );
}
