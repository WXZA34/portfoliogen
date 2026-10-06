'use client';

import React, { useState } from 'react';
import RecruiterSidebar from './RecruiterSidebar';
import RecruiterTopbar from './RecruiterTopbar';

interface RecruiterLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function RecruiterLayout({ children, pageTitle, pageSubtitle }: RecruiterLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <RecruiterSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <RecruiterTopbar sidebarCollapsed={collapsed} pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
      <main
        className="content-transition min-h-screen"
        style={{
          marginLeft: collapsed ? 'var(--sidebar-collapsed)' : '16rem',
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
