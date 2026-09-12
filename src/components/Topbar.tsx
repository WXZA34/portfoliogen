'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface TopbarProps {
  sidebarCollapsed: boolean;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function Topbar({ sidebarCollapsed, pageTitle, pageSubtitle }: TopbarProps) {
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
      className="fixed top-0 right-0 z-30 bg-card border-b border-border flex items-center justify-between px-6 content-transition"
      style={{
        left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        height: 'var(--topbar-height)',
      }}
    >
      <div>
        <h1 className="text-lg font-700 text-foreground leading-tight">{pageTitle}</h1>
        {pageSubtitle && <p className="text-xs text-muted-foreground">{pageSubtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-border transition-all duration-150 text-sm">
          <Icon name="SearchIcon" size={14} />
          <span className="hidden md:block">{t.topbar.search}</span>
          <span className="hidden md:flex items-center gap-1 ml-2 px-1.5 py-0.5 bg-card border border-border rounded text-xs font-mono-data">
            ⌘K
          </span>
        </button>

        {/* Quick Create */}
        <Link
          href="/portfolio-studio"
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press"
        >
          <Icon name="PlusIcon" size={14} />
          <span className="hidden md:block">{t.topbar.newPortfolio}</span>
        </Link>

        {/* Language Quick Toggle */}
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted rounded-lg text-xs font-700 text-muted-foreground hover:bg-border hover:text-foreground transition-all duration-150"
          title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
        >
          <span>{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
          <span className="uppercase tracking-wide">{language}</span>
          <Icon name="ArrowLeftRightIcon" size={11} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
          >
            <Icon name="BellIcon" size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-negative rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-modal animate-scale-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-600 text-sm text-foreground">{t.topbar.notifications}</span>
                <span className="text-xs text-primary font-600 cursor-pointer hover:underline">{t.topbar.markAllRead}</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted transition-colors ${!notif.read ? 'bg-secondary/30' : ''}`}
                  >
                    <p className="text-sm text-foreground leading-snug">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
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