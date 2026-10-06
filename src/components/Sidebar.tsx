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

// Job seeker nav items
const jobSeekerNavItems: NavItem[] = [
  { labelKey: 'dashboard', href: '/', icon: 'LayoutDashboardIcon', groupKey: 'overview' },
  { labelKey: 'setupWizard', href: '/setup-wizard', icon: 'MapIcon', groupKey: 'overview' },
  { labelKey: 'jobs', href: '/jobs', icon: 'BriefcaseIcon', groupKey: 'overview' },
  { labelKey: 'cvtheque', href: '/c-vth-que-master', icon: 'DatabaseIcon', groupKey: 'content' },
  { labelKey: 'studio', href: '/portfolio-studio', icon: 'PaletteIcon', groupKey: 'content' },
  { labelKey: 'portfolioEditor', href: '/portfolio-editor', icon: 'LayoutTemplateIcon', groupKey: 'content' },
  { labelKey: 'templates', href: '/templates', icon: 'Layers2Icon', groupKey: 'content' },
  { labelKey: 'audit', href: '/portfolio-audit', icon: 'ShieldCheckIcon', badge: 3, groupKey: 'optimize' },
  { labelKey: 'campaigns', href: '/campaigns-tracking', icon: 'BarChart2Icon', groupKey: 'optimize' },
  { labelKey: 'analytics', href: '/analytics', icon: 'FlameIcon', groupKey: 'optimize' },
  { labelKey: 'aiAnalysis', href: '/ai-analysis', icon: 'BrainCircuitIcon', groupKey: 'ai' },
  { labelKey: 'crm', href: '/crm', icon: 'BriefcaseIcon', groupKey: 'ai' },
  { labelKey: 'coachDashboard', href: '/coach-dashboard', icon: 'UsersIcon', groupKey: 'tools' },
  { labelKey: 'exportTools', href: '/export-tools', icon: 'DownloadIcon', groupKey: 'tools' },
  { labelKey: 'integrations', href: '/integrations', icon: 'PlugIcon', groupKey: 'tools' },
  { labelKey: 'publicPortfolio', href: '/public-portfolio-view', icon: 'GlobeIcon', groupKey: 'preview' },
  { labelKey: 'landing', href: '/landing', icon: 'HomeIcon', groupKey: 'preview' },
];

// Recruiter nav items
const recruiterNavItems: NavItem[] = [
  { labelKey: 'recruiterDashboard', href: '/recruiter-dashboard', icon: 'LayoutDashboardIcon', groupKey: 'recruiter' },
  { labelKey: 'recruiterSpace', href: '/recruiter-space', icon: 'SearchIcon', groupKey: 'recruiter' },
  { labelKey: 'landing', href: '/landing', icon: 'HomeIcon', groupKey: 'preview' },
];

const jobSeekerGroupOrder = ['overview', 'content', 'optimize', 'ai', 'tools', 'preview'];
const recruiterGroupOrder = ['recruiter', 'preview'];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, getUserRole } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const role = getUserRole();
  const isRecruiter = role === 'recruiter';

  const navItems = isRecruiter ? recruiterNavItems : jobSeekerNavItems;
  const groupOrder = isRecruiter ? recruiterGroupOrder : jobSeekerGroupOrder;

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
          <span className="font-bold text-lg text-foreground tracking-tight">TalentHub</span>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1">
          {/* Current space indicator */}
          <div className={`px-3 py-2 rounded-xl flex items-center gap-2 mb-1 ${
            isRecruiter ? 'bg-purple-500/10' : 'bg-blue-500/10'
          }`}>
            <Icon
              name={isRecruiter ? 'BuildingIcon' : 'UserIcon'}
              size={14}
              className={isRecruiter ? 'text-purple-500' : 'text-blue-500'}
            />
            <span className={`text-xs font-600 ${isRecruiter ? 'text-purple-500' : 'text-blue-500'}`}>
              {isRecruiter ? 'Espace Recruteur' : 'Espace Candidat'}
            </span>
          </div>
          {/* Switch space button */}
          <Link
            href={isRecruiter ? '/' : '/recruiter-dashboard'}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-500 transition-all duration-150 border ${
              isRecruiter
                ? 'border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300' :'border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300'
            }`}
          >
            <Icon
              name={isRecruiter ? 'UserIcon' : 'BuildingIcon'}
              size={13}
              className={isRecruiter ? 'text-blue-500' : 'text-purple-500'}
            />
            <span>{isRecruiter ? 'Espace Candidat' : 'Espace Recruteur'}</span>
            <Icon name="ArrowRightIcon" size={12} className="ml-auto opacity-60" />
          </Link>
        </div>
      )}

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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-700 flex-shrink-0 ${isRecruiter ? 'bg-purple-500' : 'bg-primary'}`}>
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