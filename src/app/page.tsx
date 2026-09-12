'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import ViewsAreaChart from './components/ViewsAreaChart';
import EngagementBarChart from './components/EngagementBarChart';
import ActivityFeed from './components/ActivityFeed';
import AuditAlertBanner from './components/AuditAlertBanner';
import QuickActions from './components/QuickActions';
import ActivePortfoliosPanel from './components/ActivePortfoliosPanel';
import { useLanguage } from '@/lib/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <AppLayout
      pageTitle={t?.dashboard?.title}
      pageSubtitle={t?.dashboard?.subtitle}
    >
      <AuditAlertBanner />
      <QuickActions />
      <MetricsBentoGrid />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ViewsAreaChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EngagementBarChart />
        </div>
        <div className="lg:col-span-1">
          <ActivePortfoliosPanel />
        </div>
      </div>
    </AppLayout>
  );
}