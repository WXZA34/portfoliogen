'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/LanguageContext';

type Severity = 'critical' | 'warning' | 'suggestion';

interface AuditIssue {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  description: string;
  impact: string;
  deepLink: string;
  deepLinkLabel: string;
  resolved: boolean;
}

const issues: AuditIssue[] = [
  {
    id: 'issue-001',
    severity: 'critical',
    category: 'Projects',
    title: 'NeuralCommerce is missing quantified KPIs',
    description: 'Your most-viewed project has no performance metrics. Recruiters need numbers to assess impact — "built a platform" is 60% less compelling than "platform handling 2M requests/day".',
    impact: 'Reduces project credibility by ~40% with technical recruiters',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Add KPIs to NeuralCommerce',
    resolved: false,
  },
  {
    id: 'issue-002',
    severity: 'critical',
    category: 'Skills',
    title: '4 skills have no proficiency level set',
    description: 'Kubernetes, Terraform, Figma, and MATLAB are listed without experience levels. Recruiters using skill filters will skip profiles with unlabeled skills.',
    impact: 'May be filtered out of 30% of automated screening tools',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Set proficiency levels',
    resolved: false,
  },
  {
    id: 'issue-003',
    severity: 'critical',
    category: 'Media',
    title: 'No project screenshots or demo videos',
    description: 'The Media Gallery has no visual assets linked to your top 3 projects. Portfolios with project screenshots see 2.3x higher session duration.',
    impact: 'Estimated -28% on avg session duration',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Upload project media',
    resolved: false,
  },
  {
    id: 'issue-004',
    severity: 'warning',
    category: 'Projects',
    title: 'FinTech Compliance Engine has no GitHub link',
    description: 'This project lacks a code repository link. Even for proprietary work, a tech summary or architecture diagram is expected.',
    impact: 'Reduces technical credibility for engineering roles',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Add repository or architecture doc',
    resolved: false,
  },
  {
    id: 'issue-005',
    severity: 'warning',
    category: 'Projects',
    title: 'Open Source CLI Framework description is too short',
    description: 'Current description is 42 words. Recommended minimum is 80 words for featured projects. Add context about the problem it solves and why you built it.',
    impact: 'Shorter descriptions correlate with 15% lower project click-through',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Expand project description',
    resolved: false,
  },
  {
    id: 'issue-006',
    severity: 'warning',
    category: 'Profile',
    title: 'No professional headshot or avatar image',
    description: 'Portfolios with a real photo see 34% higher recruiter message rates. Your current avatar is initials-only.',
    impact: 'Lower personal connection with hiring managers',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Upload profile photo',
    resolved: false,
  },
  {
    id: 'issue-007',
    severity: 'warning',
    category: 'Experience',
    title: 'BNP Paribas experience has no recommendation document',
    description: 'All other experiences have attached recommendation letters or certificates. The BNP Paribas apprenticeship entry is missing supporting documentation.',
    impact: 'Incomplete profile reduces trust signals for enterprise recruiters',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Attach recommendation letter',
    resolved: true,
  },
  {
    id: 'issue-008',
    severity: 'suggestion',
    category: 'Projects',
    title: 'Add a "What I Learned" section to each project',
    description: 'Top-performing portfolios on PortfolioGen include a brief reflection on challenges and lessons learned. This differentiates you from candidates who only list accomplishments.',
    impact: 'Increases recruiter session time by avg 45s',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Add learning reflections',
    resolved: false,
  },
  {
    id: 'issue-009',
    severity: 'suggestion',
    category: 'Skills',
    title: 'Group skills by domain relevance for each persona',
    description: 'Your "Startup CTO" portfolio shows the same skills as your "AI Engineer" portfolio. Skill selection should be persona-specific.',
    impact: 'Persona-matched skills increase relevance score by ~18%',
    deepLink: '/portfolio-studio',
    deepLinkLabel: 'Customize skills per portfolio',
    resolved: false,
  },
  {
    id: 'issue-010',
    severity: 'suggestion',
    category: 'Campaigns',
    title: 'No UTM tracking on LinkedIn shared links',
    description: 'Your LinkedIn posts share the portfolio URL without a ?ref= parameter. You have no way to know if LinkedIn traffic is converting.',
    impact: 'Missing attribution for potentially your highest-traffic channel',
    deepLink: '/campaigns-tracking',
    deepLinkLabel: 'Create tracked LinkedIn link',
    resolved: false,
  },
  {
    id: 'issue-011',
    severity: 'suggestion',
    category: 'Media',
    title: 'Add a 60-second video introduction',
    description: 'Video introductions in portfolios increase recruiter contact rate by 41% according to PortfolioGen benchmark data. Even a Loom recording works well.',
    impact: 'Significant uplift in direct recruiter outreach',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Upload intro video',
    resolved: false,
  },
  {
    id: 'issue-012',
    severity: 'suggestion',
    category: 'Projects',
    title: 'Predictive DevOps Monitor is missing a live demo link',
    description: 'If the project is deployed, link to a live demo or Loom walkthrough. Recruiter click-through on projects with demos is 2.1x higher.',
    impact: 'Missed opportunity to demonstrate working software',
    deepLink: '/c-vth-que-master',
    deepLinkLabel: 'Add demo link',
    resolved: false,
  },
];

export default function AuditIssuesList() {
  const [filter, setFilter] = useState<'all' | Severity>('all');
  const [expandedId, setExpandedId] = useState<string | null>('issue-001');
  const [resolved, setResolved] = useState<string[]>(['issue-007']);
  const { t, language } = useLanguage();

  const severityConfig: Record<Severity, { label: string; icon: string; rowClass: string; badgeClass: string }> = {
    critical: { label: t.audit.issues.critical, icon: 'AlertCircleIcon', rowClass: 'audit-critical', badgeClass: 'bg-negative/10 text-negative' },
    warning: { label: t.audit.issues.warning, icon: 'AlertTriangleIcon', rowClass: 'audit-warning', badgeClass: 'bg-warning/10 text-warning' },
    suggestion: { label: t.audit.issues.suggestion, icon: 'LightbulbIcon', rowClass: 'audit-suggestion', badgeClass: 'bg-info/10 text-info' },
  };

  const filteredIssues = issues.filter((issue) => {
    if (filter !== 'all' && issue.severity !== filter) return false;
    return true;
  });

  const counts = {
    all: issues.length,
    critical: issues.filter((i) => i.severity === 'critical').length,
    warning: issues.filter((i) => i.severity === 'warning').length,
    suggestion: issues.filter((i) => i.severity === 'suggestion').length,
  };

  const handleMarkResolved = (id: string) => {
    setResolved((prev) => [...prev, id]);
    toast.success(language === 'fr' ? 'Problème marqué comme résolu — le score sera mis à jour au prochain audit' : 'Issue marked as resolved — audit score will update on next run');
  };

  const filterLabels: Record<string, string> = {
    all: t.audit.issues.allIssues,
    critical: t.audit.issues.critical,
    warning: t.audit.issues.warning,
    suggestion: t.audit.issues.suggestion,
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h3 className="text-sm font-700 text-foreground">{t.audit.issues.allIssues}</h3>
        <div className="flex items-center gap-2">
          {(['all', 'critical', 'warning', 'suggestion'] as const).map((f) => (
            <button
              key={`audit-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {filterLabels[f]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-border'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Issues */}
      <div className="divide-y divide-border">
        {filteredIssues.map((issue) => {
          const config = severityConfig[issue.severity];
          const isResolved = resolved.includes(issue.id);
          const isExpanded = expandedId === issue.id;

          return (
            <div
              key={issue.id}
              className={`${isResolved ? 'opacity-50' : ''} ${!isResolved ? config.rowClass : ''} transition-all`}
            >
              <button
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-black/5 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : issue.id)}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.badgeClass}`}>
                  <Icon name={config.icon as any} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{issue.category}</span>
                    {isResolved && (
                      <span className="text-xs font-600 text-positive bg-positive/10 px-2 py-0.5 rounded-full">
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-700 ${isResolved ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {issue.title}
                  </p>
                </div>
                <Icon
                  name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                  size={16}
                  className="text-muted-foreground flex-shrink-0 mt-1"
                />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pl-17 animate-fade-in" style={{ paddingLeft: '72px' }}>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{issue.description}</p>

                  <div className="flex items-center gap-2 mb-4 p-3 bg-card/70 rounded-xl border border-border">
                    <Icon name="ZapIcon" size={13} className="text-warning flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-700 text-foreground">Impact: </span>
                      {issue.impact}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={issue.deepLink}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-700 hover:opacity-90 transition-all btn-press deep-link-btn"
                    >
                      <Icon name="ArrowRightIcon" size={12} />
                      {issue.deepLinkLabel}
                    </Link>

                    {!isResolved && (
                      <button
                        onClick={() => handleMarkResolved(issue.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-positive/10 text-positive rounded-xl text-xs font-600 hover:opacity-80 transition-all"
                      >
                        <Icon name="CheckIcon" size={12} />
                        Mark Resolved
                      </button>
                    )}

                    <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-600 hover:text-foreground transition-all">
                      <Icon name="EyeOffIcon" size={12} />
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}