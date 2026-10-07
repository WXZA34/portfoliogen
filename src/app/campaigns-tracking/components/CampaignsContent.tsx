'use client';

import React, { useState } from 'react';
import CampaignKPIs from './CampaignKPIs';
import CampaignTable from './CampaignTable';
import EngagementTimelineChart from './EngagementTimelineChart';
import RefSourceChart from './RefSourceChart';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/lib/LanguageContext';

export default function CampaignsContent() {
  const [dateRange, setDateRange] = useState('30d');
  const { t } = useLanguage();

  const ranges = ['7d', '30d', '90d', 'all'] as const;

  return (
    <div>
      {/* Date Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {ranges.map((range) => (
            <button
              key={`range-${range}`}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 ${
                dateRange === range ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.campaigns.dateRanges[range]}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-xl text-xs font-600 text-muted-foreground hover:text-foreground transition-all">
          <Icon name="LinkIcon" size={13} />
          <span className="font-mono-data">+?ref=</span>
          {t.campaigns.createLink}
        </button>
      </div>

      <CampaignKPIs />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EngagementTimelineChart />
        </div>
        <div className="lg:col-span-1">
          <RefSourceChart />
        </div>
      </div>

      <div className="mt-6">
        <CampaignTable />
      </div>
    </div>
  );
}