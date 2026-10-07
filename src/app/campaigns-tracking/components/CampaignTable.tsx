'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

type SortKey = 'name' | 'views' | 'uniqueVisitors' | 'avgDuration' | 'cvClicks' | 'lastActivity';
type SortDir = 'asc' | 'desc';

const campaigns = [
  { id: 'camp-001', portfolioName: 'Full-Stack Dev', persona: 'Tech Recruiter', refSlug: '?ref=linkedin', views: 487, uniqueVisitors: 312, avgDuration: '4m 12s', cvClicks: 89, lastActivity: 'Sep 12, 21:34', syncMode: 'live' as const, status: 'active' as const },
  { id: 'camp-002', portfolioName: 'AI Engineer', persona: 'AI Startup', refSlug: '?ref=email', views: 312, uniqueVisitors: 198, avgDuration: '3m 47s', cvClicks: 67, lastActivity: 'Sep 12, 19:21', syncMode: 'live' as const, status: 'active' as const },
  { id: 'camp-003', portfolioName: 'Startup CTO', persona: 'Startup Founder', refSlug: '?ref=direct', views: 421, uniqueVisitors: 276, avgDuration: '2m 58s', cvClicks: 74, lastActivity: 'Sep 11, 14:08', syncMode: 'frozen' as const, status: 'active' as const },
  { id: 'camp-004', portfolioName: 'Open Source', persona: 'OSS Community', refSlug: '?ref=github', views: 276, uniqueVisitors: 189, avgDuration: '5m 01s', cvClicks: 41, lastActivity: 'Sep 12, 16:44', syncMode: 'live' as const, status: 'active' as const },
  { id: 'camp-005', portfolioName: 'Freelance Dev', persona: 'Startup SME', refSlug: '?ref=twitter', views: 94, uniqueVisitors: 71, avgDuration: '1m 22s', cvClicks: 12, lastActivity: 'Sep 10, 09:15', syncMode: 'live' as const, status: 'draft' as const },
  { id: 'camp-006', portfolioName: 'Creative Dev', persona: 'Creative Agency', refSlug: '?ref=portfolio', views: 153, uniqueVisitors: 112, avgDuration: '3m 14s', cvClicks: 19, lastActivity: 'Sep 09, 11:30', syncMode: 'frozen' as const, status: 'paused' as const },
  { id: 'camp-007', portfolioName: 'Backend Arch', persona: 'Enterprise HR', refSlug: '?ref=direct', views: 67, uniqueVisitors: 54, avgDuration: '2m 05s', cvClicks: 9, lastActivity: 'Sep 07, 15:22', syncMode: 'live' as const, status: 'active' as const },
  { id: 'camp-008', portfolioName: 'DevOps Lead', persona: 'Tech Recruiter', refSlug: '?ref=linkedin', views: 37, uniqueVisitors: 29, avgDuration: '0m 48s', cvClicks: 3, lastActivity: 'Sep 05, 08:11', syncMode: 'frozen' as const, status: 'archived' as const },
];

export default function CampaignTable() {
  const [sortKey, setSortKey] = useState<SortKey>('views');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filtered = campaigns
    .filter((c) =>
      c.portfolioName.toLowerCase().includes(search.toLowerCase()) ||
      c.persona.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.replace(/[^0-9]/g, '');
        bVal = bVal.replace(/[^0-9]/g, '');
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedRows(selectedRows.length === filtered.length ? [] : filtered.map((c) => c.id));
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <Icon name="ChevronsUpDownIcon" size={12} className="text-muted-foreground/40" />;
    return <Icon name={sortDir === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={12} className="text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-700 text-foreground">All Campaigns</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon name="SearchIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 bg-muted border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-48"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-600 hover:text-foreground transition-all">
            <Icon name="DownloadIcon" size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border-b border-primary/20 animate-fade-in">
          <span className="text-xs font-700 text-primary">{selectedRows.length} selected</span>
          <button
            onClick={() => { toast.success(`${selectedRows.length} campaigns paused`); setSelectedRows([]); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-warning/10 text-warning rounded-lg text-xs font-600 hover:opacity-80 transition-all"
          >
            <Icon name="PauseIcon" size={11} />
            Pause
          </button>
          <button
            onClick={() => { toast.success(`${selectedRows.length} campaigns archived`); setSelectedRows([]); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-negative/10 text-negative rounded-lg text-xs font-600 hover:opacity-80 transition-all"
          >
            <Icon name="ArchiveIcon" size={11} />
            Archive
          </button>
          <button onClick={() => setSelectedRows([])} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-primary"
                />
              </th>
              {[
                { key: 'name' as SortKey, label: 'Portfolio' },
                { key: null, label: 'Persona' },
                { key: null, label: 'Ref Link' },
                { key: 'views' as SortKey, label: 'Views' },
                { key: 'uniqueVisitors' as SortKey, label: 'Unique' },
                { key: 'avgDuration' as SortKey, label: 'Avg Duration' },
                { key: 'cvClicks' as SortKey, label: 'CV Clicks' },
                { key: 'lastActivity' as SortKey, label: 'Last Seen' },
                { key: null, label: 'Sync' },
                { key: null, label: 'Status' },
              ].map((col) => (
                <th
                  key={`th-${col.label}`}
                  className={`px-3 py-3 text-left text-xs font-700 text-muted-foreground uppercase tracking-wider ${col.key ? 'cursor-pointer hover:text-foreground' : ''}`}
                  onClick={() => col.key && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && <SortIcon col={col.key} />}
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-right text-xs font-700 text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((campaign) => (
              <tr
                key={campaign.id}
                className={`border-b border-border last:border-0 row-hover transition-colors ${selectedRows.includes(campaign.id) ? 'bg-primary/5' : ''}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(campaign.id)}
                    onChange={() => toggleRow(campaign.id)}
                    className="accent-primary"
                  />
                </td>
                <td className="px-3 py-3">
                  <p className="text-sm font-700 text-foreground">{campaign.portfolioName}</p>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-muted-foreground">{campaign.persona}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono-data text-primary bg-primary/10 px-2 py-0.5 rounded-md">{campaign.refSlug}</span>
                    <button
                      onClick={() => toast.success('Ref link copied')}
                      className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Icon name="CopyIcon" size={10} />
                    </button>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-800 text-foreground tabular-nums">{campaign.views.toLocaleString()}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-700 text-foreground tabular-nums">{campaign.uniqueVisitors}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm text-foreground tabular-nums">{campaign.avgDuration}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-700 text-foreground tabular-nums">{campaign.cvClicks}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((campaign.cvClicks / campaign.views) * 100)}%)
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-muted-foreground">{campaign.lastActivity}</span>
                </td>
                <td className="px-3 py-3">
                  <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${campaign.syncMode === 'live' ? 'sync-live' : 'sync-frozen'}`}>
                    {campaign.syncMode === 'live' ? '⚡ Live' : '❄ Frozen'}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge variant={campaign.status} size="sm" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all" title="View analytics">
                      <Icon name="BarChart2Icon" size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all" title="Copy share link">
                      <Icon name="ShareIcon" size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-negative/10 text-muted-foreground hover:text-negative transition-all" title="Archive campaign">
                      <Icon name="ArchiveIcon" size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {campaigns.length} campaigns
        </p>
        <div className="flex items-center gap-1">
          <button className="px-2.5 py-1.5 rounded-lg text-xs font-600 text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-40" disabled>
            Previous
          </button>
          <button className="px-2.5 py-1.5 rounded-lg text-xs font-700 bg-primary text-primary-foreground">1</button>
          <button className="px-2.5 py-1.5 rounded-lg text-xs font-600 text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}