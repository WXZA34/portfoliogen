'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  description: string;
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Vue Globale',
    items: [
      { label: 'Tableau de bord', href: '/admin-dashboard', icon: 'LayoutDashboardIcon', description: 'KPIs & métriques plateforme' },
      { label: 'Analytics', href: '/admin-dashboard/analytics', icon: 'BarChart2Icon', description: 'Statistiques globales' },
    ],
  },
  {
    title: 'Utilisateurs',
    items: [
      { label: 'Gestion utilisateurs', href: '/admin-dashboard/users', icon: 'UsersIcon', description: 'Candidats & recruteurs' },
      { label: 'Vérification credentials', href: '/admin-dashboard/credentials', icon: 'ShieldCheckIcon', description: 'Valider les certifications', badge: 3 },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { label: 'Portfolios', href: '/admin-dashboard/portfolios', icon: 'LayoutTemplateIcon', description: 'Modération des portfolios', badge: 2 },
      { label: 'Offres d\'emploi', href: '/admin-dashboard/jobs', icon: 'BriefcaseIcon', description: 'Modération des offres', badge: 2 },
      { label: 'Marketplace templates', href: '/admin-dashboard/templates', icon: 'Layers2Icon', description: 'Valider les templates', badge: 4 },
    ],
  },
  {
    title: 'Modération',
    items: [
      { label: 'Signalements', href: '/admin-dashboard/reports', icon: 'FlagIcon', badge: 5, description: 'Traiter les signalements' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'Paramètres du site', href: '/admin-dashboard/settings', icon: 'SettingsIcon', description: 'Configuration globale' },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin-dashboard') return pathname === '/admin-dashboard';
    return pathname.startsWith(href);
  };

  const totalBadges = NAV_SECTIONS.flatMap((s) => s.items).reduce((acc, item) => acc + (item.badge ?? 0), 0);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col sidebar-transition ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ background: 'hsl(var(--card))', borderRight: '1px solid hsl(var(--border))' }}
    >
      {/* Logo + Brand */}
      <div
        className={`flex items-center border-b border-border ${
          collapsed ? 'justify-center px-0 py-4' : 'px-5 py-4 gap-3'
        }`}
        style={{ minHeight: 'var(--topbar-height)' }}
      >
        <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center flex-shrink-0 relative">
          <Icon name="ShieldIcon" size={16} className="text-white" />
          {collapsed && totalBadges > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-800 text-white flex items-center justify-center">
              {totalBadges > 9 ? '9+' : totalBadges}
            </span>
          )}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-800 text-sm text-foreground leading-none">TalentHub</p>
            <p className="text-[10px] text-rose-500 font-600 mt-0.5 uppercase tracking-widest">Admin</p>
          </div>
        )}
      </div>

      {/* Admin identity badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 space-y-1">
          <div className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-800">
                {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-700 text-foreground truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-[10px] text-rose-500 font-600">Super Administrateur</p>
            </div>
          </div>
          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-500 transition-all duration-150 border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
          >
            <Icon name="UserIcon" size={13} className="text-blue-500" />
            <span>Espace Candidat</span>
            <Icon name="ArrowRightIcon" size={12} className="ml-auto opacity-60" />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] font-700 uppercase tracking-widest text-muted-foreground px-2 mb-1.5">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-150 group relative ${
                      active
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon
                      name={item.icon as any}
                      size={17}
                      className={active ? 'text-rose-600' : 'text-muted-foreground group-hover:text-foreground'}
                    />
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-none mb-0.5 ${active ? 'font-700' : 'font-500'}`}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-none truncate">{item.description}</p>
                      </div>
                    )}
                    {!collapsed && item.badge && item.badge > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-700 rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && item.badge > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full" />
                    )}
                    {collapsed && (
                      <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                        {item.badge ? ` (${item.badge})` : ''}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-muted cursor-pointer group">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white text-sm font-700 flex-shrink-0">
              {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-foreground truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={() => signOut()}
              title="Se déconnecter"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Icon name="LogOutIcon" size={14} />
            </button>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
        >
          <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={15} />
          {!collapsed && <span className="text-xs font-500">Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
