'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppLogo from '@/components/ui/AppLogo';
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
  { labelKey: 'dashboard', href: '/', icon: 'Squares2X2Icon', groupKey: 'overview' },
  { labelKey: 'setupWizard', href: '/setup-wizard', icon: 'MapIcon', groupKey: 'overview' },
  { labelKey: 'jobs', href: '/jobs', icon: 'BriefcaseIcon', groupKey: 'overview' },
  { labelKey: 'cvtheque', href: '/c-vth-que-master', icon: 'CircleStackIcon', groupKey: 'content' },
  { labelKey: 'studio', href: '/portfolio-studio', icon: 'SwatchIcon', groupKey: 'content' },
  { labelKey: 'portfolioEditor', href: '/portfolio-editor', icon: 'RectangleGroupIcon', groupKey: 'content' },
  { labelKey: 'templates', href: '/templates', icon: 'Square3Stack3DIcon', groupKey: 'content' },
  { labelKey: 'audit', href: '/portfolio-audit', icon: 'ShieldCheckIcon', badge: 3, groupKey: 'optimize' },
  { labelKey: 'campaigns', href: '/campaigns-tracking', icon: 'ChartBarIcon', groupKey: 'optimize' },
  { labelKey: 'analytics', href: '/analytics', icon: 'FireIcon', groupKey: 'optimize' },
  { labelKey: 'aiAnalysis', href: '/ai-analysis', icon: 'SparklesIcon', groupKey: 'ai' },
  { labelKey: 'crm', href: '/crm', icon: 'BriefcaseIcon', groupKey: 'ai' },
  { labelKey: 'coachDashboard', href: '/coach-dashboard', icon: 'UsersIcon', groupKey: 'tools' },
  { labelKey: 'exportTools', href: '/export-tools', icon: 'ArrowDownTrayIcon', groupKey: 'tools' },
  { labelKey: 'integrations', href: '/integrations', icon: 'LinkIcon', groupKey: 'tools' },
  { labelKey: 'publicPortfolio', href: '/public-portfolio-view', icon: 'GlobeAltIcon', groupKey: 'preview' },
  { labelKey: 'landing', href: '/landing', icon: 'HomeIcon', groupKey: 'preview' },
];

// Recruiter nav items
const recruiterNavItems: NavItem[] = [
  { labelKey: 'recruiterDashboard', href: '/recruiter-dashboard', icon: 'Squares2X2Icon', groupKey: 'recruiter' },
  { labelKey: 'recruiterSpace', href: '/recruiter-space', icon: 'MagnifyingGlassIcon', groupKey: 'recruiter' },
  { labelKey: 'landing', href: '/landing', icon: 'HomeIcon', groupKey: 'preview' },
];

const adminNavItem: NavItem = { labelKey: 'adminDashboard', href: '/admin-dashboard', icon: 'ShieldExclamationIcon', groupKey: 'admin' };

const jobSeekerGroupOrder = ['overview', 'content', 'optimize', 'ai', 'tools', 'preview', 'admin'];
const recruiterGroupOrder = ['recruiter', 'preview', 'admin'];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, getUserRole } = useAuth();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const role = getUserRole();
  const isRecruiter = role === 'recruiter';

  const navItems = isRecruiter ? recruiterNavItems : jobSeekerNavItems;
  const groupOrder = isRecruiter ? recruiterGroupOrder : jobSeekerGroupOrder;

  const allNavItems = [...navItems, adminNavItem];

  const grouped = groupOrder.map((groupKey) => ({
    groupKey,
    label: groupKey === 'admin' ? 'Administration' : (t.nav[groupKey as keyof typeof t.nav] as string),
    items: allNavItems.filter((item) => item.groupKey === groupKey),
  }));

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          // Mobile state
          mobileOpen
            ? 'translate-x-0 z-50 w-72 max-w-[85vw] shadow-2xl'
            : '-translate-x-full lg:translate-x-0 z-40'
        } ${
          // Desktop state
          collapsed ? 'lg:w-16' : 'lg:w-60'
        }`}
      >
        {/* Logo & Mobile Close Button */}
        <div
          className={`flex items-center border-b border-border justify-between px-4 py-4 ${
            collapsed ? 'lg:justify-center lg:px-0' : 'gap-3'
          }`}
          style={{ minHeight: 'var(--topbar-height)' }}
        >
          <div className="flex items-center gap-3">
            <AppLogo size={32} />
            {(!collapsed || mobileOpen) && (
              <span className="font-bold text-lg text-foreground tracking-tight">TalentHub</span>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Fermer le menu"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Role badge */}
        {(!collapsed || mobileOpen) && (
          <div className="mx-3 mt-3 mb-1">
            {/* Current space indicator */}
            <div
              className={`px-3 py-2 rounded-xl flex items-center gap-2 mb-1 ${
                isRecruiter ? 'bg-purple-500/10' : 'bg-blue-500/10'
              }`}
            >
              <Icon
                name={isRecruiter ? 'BuildingOfficeIcon' : 'UserIcon'}
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
              onClick={onCloseMobile}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-500 transition-all duration-150 border ${
                isRecruiter
                  ? 'border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300'
                  : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              <Icon
                name={isRecruiter ? 'UserIcon' : 'BuildingOfficeIcon'}
                size={13}
                className={isRecruiter ? 'text-blue-500' : 'text-purple-500'}
              />
              <span>{isRecruiter ? 'Espace Candidat' : 'Espace Recruteur'}</span>
              <Icon name="ArrowRightIcon" size={12} className="ml-auto opacity-60" />
            </Link>
          </div>
        )}

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
          {grouped.map(({ groupKey, label, items }) => (
            <div key={`group-${groupKey}`} className="mb-2">
              {(!collapsed || mobileOpen) && (
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1">
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
                    onClick={onCloseMobile}
                    title={collapsed && !mobileOpen ? itemLabel : undefined}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-lg mb-0.5 transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-secondary text-primary font-600'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${collapsed && !mobileOpen ? 'lg:justify-center' : ''}`}
                  >
                    <Icon
                      name={item.icon as any}
                      size={18}
                      className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="text-xs font-semibold flex-1 truncate">{itemLabel}</span>
                    )}
                    {(!collapsed || mobileOpen) && item.badge && item.badge > 0 && (
                      <span className="bg-negative text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && !mobileOpen && item.badge && item.badge > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-negative rounded-full" />
                    )}
                    {collapsed && !mobileOpen && (
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

        {/* Bottom Actions: Language Switcher + User Profile + Collapse */}
        <div className="border-t border-border p-3 space-y-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 ${
                collapsed && !mobileOpen ? 'lg:justify-center' : ''
              }`}
              title={collapsed && !mobileOpen ? (language === 'fr' ? 'Langue' : 'Language') : undefined}
            >
              <span className="text-base leading-none">{currentLang?.flag}</span>
              {(!collapsed || mobileOpen) && (
                <>
                  <span className="text-xs font-600 flex-1 text-left">{currentLang?.label}</span>
                  <Icon
                    name="ChevronUpIcon"
                    size={12}
                    className={`transition-transform ${showLangMenu ? '' : 'rotate-180'}`}
                  />
                </>
              )}
            </button>
            {showLangMenu && (
              <div
                className={`absolute bottom-full mb-1 bg-card border border-border rounded-xl shadow-modal z-50 overflow-hidden ${
                  collapsed && !mobileOpen ? 'left-full ml-2 w-36' : 'left-0 right-0'
                }`}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-muted ${
                      language === lang.code ? 'text-primary font-bold bg-secondary/50' : 'text-foreground'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {language === lang.code && <Icon name="CheckIcon" size={12} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User profile */}
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                  isRecruiter ? 'bg-purple-500' : 'bg-primary'
                }`}
              >
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email || ''}</p>
              </div>
              <button
                onClick={() => signOut()}
                title="Se déconnecter"
                className="p-1 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative/10 transition-all cursor-pointer"
              >
                <Icon name="ArrowRightOnRectangleIcon" size={14} />
              </button>
            </div>
          )}

          {/* Desktop Collapse Toggle (hidden on mobile) */}
          <button
            onClick={onToggle}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-2 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 btn-press cursor-pointer"
          >
            <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={16} />
            {!collapsed && <span className="text-xs font-semibold">{t.nav.collapse}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}