'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface TopbarProps {
  sidebarCollapsed: boolean;
  pageTitle: string;
  pageSubtitle?: string;
  onOpenMobileSidebar?: () => void;
}

export default function Topbar({
  sidebarCollapsed,
  pageTitle,
  pageSubtitle,
  onOpenMobileSidebar,
}: TopbarProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const notifications = [
    { id: 'notif-001', type: 'view', message: t.topbar.notif_view, time: language === 'fr' ? 'il y a 2 min' : '2m ago', read: false },
    { id: 'notif-002', type: 'message', message: t.topbar.notif_message, time: language === 'fr' ? 'il y a 18 min' : '18m ago', read: false },
    { id: 'notif-003', type: 'audit', message: t.topbar.notif_audit, time: language === 'fr' ? 'il y a 1h' : '1h ago', read: false },
    { id: 'notif-004', type: 'view', message: t.topbar.notif_duration, time: language === 'fr' ? 'il y a 3h' : '3h ago', read: true },
    { id: 'notif-005', type: 'download', message: t.topbar.notif_download, time: language === 'fr' ? 'il y a 5h' : '5h ago', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`fixed top-0 right-0 z-30 bg-card border-b border-border flex items-center justify-between px-3 sm:px-6 content-transition left-0 ${
        sidebarCollapsed ? 'lg:left-[var(--sidebar-collapsed)]' : 'lg:left-[var(--sidebar-width)]'
      }`}
      style={{
        height: 'var(--topbar-height)',
      }}
    >
      {/* Left: Mobile hamburger & Titles */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer flex-shrink-0"
          aria-label="Ouvrir le menu de navigation"
        >
          <Icon name="Bars3Icon" size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-foreground leading-tight truncate">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate hidden xs:block sm:block">
              {pageSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Quick Create Link */}
        <Link
          href="/portfolio-studio"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-all btn-press shadow-xs"
        >
          <Icon name="PlusIcon" size={14} />
          <span className="hidden sm:inline">{t.topbar.newPortfolio}</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Icon name="BellIcon" size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-negative rounded-full animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-modal z-50 overflow-hidden">
              <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/30">
                <p className="text-xs font-bold text-foreground">{t.topbar.notifications}</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {unreadCount} {language === 'fr' ? 'nouveaux' : 'new'}
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs flex items-start gap-2.5 transition-colors hover:bg-muted/40 ${
                      !n.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium leading-snug">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}