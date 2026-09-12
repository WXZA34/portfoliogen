'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function AppLayout({ children, pageTitle, pageSubtitle }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Topbar sidebarCollapsed={collapsed} pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
      <main
        className="content-transition min-h-screen"
        style={{
          marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          paddingTop: 'var(--topbar-height)',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}