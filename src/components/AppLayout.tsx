'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function AppLayout({ children, pageTitle = 'PortfolioGen', pageSubtitle }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Responsive Sidebar (docked on desktop, slide-out drawer on mobile) */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Responsive Topbar (full width on mobile, offset on desktop) */}
      <Topbar
        sidebarCollapsed={collapsed}
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        onOpenMobileSidebar={() => setMobileOpen(true)}
      />

      {/* Main Content Area */}
      <main
        className={`content-transition min-h-screen w-full transition-all duration-200 ml-0 ${
          collapsed ? 'lg:ml-[var(--sidebar-collapsed)]' : 'lg:ml-[var(--sidebar-width)]'
        }`}
        style={{
          paddingTop: 'var(--topbar-height)',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}