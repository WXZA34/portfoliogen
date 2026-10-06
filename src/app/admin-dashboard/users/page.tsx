'use client';

import React from 'react';
import AdminLayout from '../components/AdminLayout';
import UsersManagement from '../components/UsersManagement';

export default function AdminUsersPage() {
  return (
    <AdminLayout
      pageTitle="Gestion des utilisateurs"
      pageSubtitle="Gérer les candidats et recruteurs de la plateforme"
    >
      <UsersManagement />
    </AdminLayout>
  );
}
