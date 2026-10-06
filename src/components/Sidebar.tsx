'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/lib/LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  labelKey: string;
  href: string;
  icon: string;
  badge?: number;
  groupKey: string;
}

const navItems: NavItem[] = [
  { labelKey: 'dashboard', href: '/', icon: 'LayoutDashboardIcon', groupKey: 'overview' },
  { labelKey: 'cvtheque', href: '/c-vth-que-master', icon: 'DatabaseIcon', groupKey: 'content' },
  { labelKey: 'studio', href: '/portfolio-studio', icon: 'PaletteIcon', groupKey: 'content' },
  { labelKey: 'templates', href: '/templates', icon: 'LayoutTemplateIcon', groupKey: 'content' },
  { labelKey: 'audit', href: '/portfolio-audit', icon: 'ShieldCheckIcon', badge: 3, groupKey: 'optimize' },
  { labelKey: 'campaigns', href: '/campaigns-tracking', icon: 'BarChart2Icon', groupKey: 'optimize' },
  { labelKey: 'analytics', href: '/analytics', icon: 'FlameIcon', groupKey: 'optimize' },
  { labelKey: 'aiAnalysis', href: '/ai-analysis', icon: 'BrainCircuitIcon', groupKey: 'ai' },
  { labelKey: 'crm', href: '/crm', icon: 'BriefcaseIcon', groupKey: 'ai' },
  { labelKey: 'setupWizard', href: '/setup-wizard', icon: 'MapIcon', groupKey: 'overview' },
  { labelKey: 'coachDashboard', href: '/coach-dashboard', icon: 'UsersIcon', groupKey: 'tools' },
  { labelKey: 'exportTools', href: '/export-tools', icon: 'DownloadIcon', groupKey: 'tools' },
  { labelKey: 'integrations', href: '/integrations', icon: 'PlugIcon', groupKey: 'tools' },
  { labelKey: 'publicPortfolio', href: '/public-portfolio-view', icon: 'GlobeIcon', groupKey: 'preview' },
  { labelKey: 'landing', href: '/landing', icon: 'HomeIcon', groupKey: 'preview' },
  { labelKey: 'recruiterSpace', href: '/recruiter-space', icon: 'SearchIcon', groupKey: 'preview' },
  { labelKey: 'recruiterDashboard', href: '/recruiter-dashboard', icon: 'BuildingIcon', groupKey: 'recruiter' },
];

const groupOrder = ['overview', 'content', 'optimize', 'ai', 'tools', 'preview', 'recruiter'];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const grouped = groupOrder.map((groupKey) => ({
    groupKey,
    label: t.nav[groupKey as keyof typeof t.nav] as string,
    items: navItems.filter((item) => item.groupKey === groupKey),
  }));

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 bg-card border-r border-border flex flex-col sidebar-transition ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-border ${collapsed ? 'justify-center px-0 py-4' : 'px-4 py-4 gap-3'}`} style={{ minHeight: 'var(--topbar-height)' }}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight">PortfolioGen</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {grouped.map(({ groupKey, label, items }) => (
          <div key={`group-${groupKey}`} className="mb-4">
            {!collapsed && (
              <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground px-2 mb-1">
                {label}
              </p>
            )}
            {items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const itemLabel = t.nav[item.labelKey as keyof typeof t.nav] as string;
              return (
                <Link
                  key={`nav-${item.href}`}
                  href={item.href}
                  title={collapsed ? itemLabel : undefined}
                  className={`flex items-center gap-3 px-2 py-2.5 rounded-lg mb-0.5 transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-secondary text-primary font-600' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon
                    name={item.icon as any}
                    size={18}
                    className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                  />
                  {!collapsed && (
                    <span className="text-sm font-500 flex-1">{itemLabel}</span>
                  )}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <span className="bg-negative text-white text-xs font-700 rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && item.badge > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-negative rounded-full" />
                  )}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {itemLabel}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Language Switcher + User + Collapse */}
      <div className="border-t border-border p-3">
        {/* Language Switcher */}
        <div className="relative mb-2">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? (language === 'fr' ? 'Langue' : 'Language') : undefined}
          >
            <span className="text-base leading-none">{currentLang?.flag}</span>
            {!collapsed && (
              <>
                <span className="text-xs font-600 flex-1 text-left">{currentLang?.label}</span>
                <Icon name="ChevronUpIcon" size={12} className={`transition-transform ${showLangMenu ? '' : 'rotate-180'}`} />
              </>
            )}
          </button>
          {showLangMenu && (
            <div className={`absolute bottom-full mb-1 bg-card border border-border rounded-xl shadow-modal z-50 overflow-hidden ${collapsed ? 'left-full ml-2 w-36' : 'left-0 right-0'}`}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-muted ${language === lang.code ? 'text-primary font-600 bg-secondary/50' : 'text-foreground'}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {language === lang.code && <Icon name="CheckIcon" size={12} className="ml-auto text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted cursor-pointer mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-700 flex-shrink-0">
              {user?.user_metadata?.full_name
                ? user.user_metadata.full_name.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-foreground truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={() => signOut()}
              title="Se déconnecter"
              className="p-1 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative/10 transition-all"
            >
              <Icon name="LogOutIcon" size={14} />
            </button>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 btn-press"
        >
          <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={16} />
          {!collapsed && <span className="text-xs font-500">{t.nav.collapse}</span>}
        </button>
      </div>
    </aside>
  );
}