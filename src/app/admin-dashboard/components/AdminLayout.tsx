'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function AdminLayout({ children, pageTitle, pageSubtitle }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const { user } = useAuth();

  const adminNotifications = [
    { id: 'an-1', message: '5 nouveaux signalements en attente', time: 'il y a 5 min', read: false, icon: 'FlagIcon', color: 'text-rose-500' },
    { id: 'an-2', message: '3 credentials à vérifier', time: 'il y a 22 min', read: false, icon: 'ShieldCheckIcon', color: 'text-amber-500' },
    { id: 'an-3', message: 'Nouveau template soumis pour validation', time: 'il y a 1h', read: false, icon: 'Layers2Icon', color: 'text-blue-500' },
    { id: 'an-4', message: '12 nouveaux utilisateurs inscrits', time: 'il y a 3h', read: true, icon: 'UsersIcon', color: 'text-emerald-500' },
  ];

  const unread = adminNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Topbar */}
      <header
        className="fixed top-0 right-0 z-30 bg-card border-b border-border flex items-center justify-between px-6 content-transition"
        style={{
          left: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          height: 'var(--topbar-height)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <Icon name="ShieldIcon" size={13} className="text-rose-500" />
            <span className="text-xs font-700 text-rose-600 uppercase tracking-wide">Admin</span>
          </div>
          <div>
            <h1 className="text-lg font-700 text-foreground leading-tight">{pageTitle}</h1>
            {pageSubtitle && <p className="text-xs text-muted-foreground">{pageSubtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-border transition-all duration-150 text-sm">
            <Icon name="SearchIcon" size={14} />
            <span className="hidden md:block text-sm">Rechercher...</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
            >
              <Icon name="BellIcon" size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-modal animate-scale-in z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-600 text-sm text-foreground">Notifications Admin</span>
                  <span className="text-xs bg-rose-500/10 text-rose-600 font-700 px-2 py-0.5 rounded-full">{unread} nouvelles</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {adminNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted transition-colors flex items-start gap-3 ${!notif.read ? 'bg-secondary/30' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon name={notif.icon as any} size={13} className={notif.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                      </div>
                      {!notif.read && <span className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin avatar */}
          <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white text-sm font-700 flex-shrink-0">
            {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
        </div>
      </header>

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
