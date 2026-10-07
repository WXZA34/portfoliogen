'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface RecruiterTopbarProps {
  sidebarCollapsed: boolean;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function RecruiterTopbar({ sidebarCollapsed, pageTitle, pageSubtitle }: RecruiterTopbarProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const { user } = useAuth();

  const notifications = [
    { id: 'n1', icon: 'UserCheckIcon', color: 'text-violet-600', bg: 'bg-violet-500/10', message: 'Karim Benali a accepté votre invitation à un entretien', time: 'il y a 5 min', read: false },
    { id: 'n2', icon: 'FileTextIcon', color: 'text-sky-600', bg: 'bg-sky-500/10', message: '3 nouvelles candidatures pour "Lead AI/ML Engineer"', time: 'il y a 22 min', read: false },
    { id: 'n3', icon: 'MessageSquareIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', message: 'Nouveau message de Alexandre Martin', time: 'il y a 1h', read: false },
    { id: 'n4', icon: 'CalendarIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', message: 'Rappel : entretien avec Léa Fontaine demain 15h', time: 'il y a 2h', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="fixed top-0 right-0 z-30 bg-card border-b border-border flex items-center justify-between px-6 content-transition"
      style={{
        left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : '16rem',
        height: 'var(--topbar-height)',
      }}
    >
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base font-700 text-foreground leading-tight">{pageTitle}</h1>
          {pageSubtitle && <p className="text-xs text-muted-foreground">{pageSubtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-xl text-muted-foreground text-sm border border-border hover:border-violet-500/30 transition-all cursor-pointer">
          <Icon name="SearchIcon" size={14} />
          <span className="text-xs">Rechercher un talent, une offre…</span>
          <span className="ml-2 px-1.5 py-0.5 bg-card border border-border rounded text-[10px] font-mono">⌘K</span>
        </div>

        {/* Publish job CTA */}
        <a
          href="/recruiter-dashboard/jobs"
          className="hidden md:flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-xl text-xs font-600 hover:bg-violet-700 transition-all"
        >
          <Icon name="PlusIcon" size={13} />
          Publier une offre
        </a>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Icon name="BellIcon" size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-modal animate-scale-in z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-700 text-sm text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20">
                    {unreadCount} nouvelles
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors ${!notif.read ? 'bg-violet-500/5' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${notif.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon name={notif.icon as any} size={13} className={notif.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white text-sm font-700 cursor-pointer hover:bg-violet-700 transition-all">
          {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'R'}
        </div>
      </div>
    </header>
  );
}
