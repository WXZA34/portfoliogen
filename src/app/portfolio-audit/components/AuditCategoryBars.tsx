'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

function getBarColor(score: number) {
  if (score >= 90) return 'bg-positive';
  if (score >= 70) return 'bg-primary';
  if (score >= 50) return 'bg-warning';
  return 'bg-negative';
}

export default function AuditCategoryBars() {
  const { t } = useLanguage();

  const categories = [
    { id: 'cat-projects', labelKey: 'completeness', score: 82, issues: 3 },
    { id: 'cat-skills', labelKey: 'skillCoverage', score: 91, issues: 1 },
    { id: 'cat-experience', labelKey: 'consistency', score: 95, issues: 0 },
    { id: 'cat-media', labelKey: 'mediaQuality', score: 68, issues: 5 },
    { id: 'cat-kpis', labelKey: 'kpiStrength', score: 74, issues: 3 },
    { id: 'cat-seo', labelKey: 'seoReadiness', score: 88, issues: 1 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card h-full">
      <h3 className="text-sm font-700 text-foreground mb-5">{t.audit.score}</h3>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-600 text-foreground">
                {t.audit.categories[cat.labelKey as keyof typeof t.audit.categories]}
              </span>
              <div className="flex items-center gap-2">
                {cat.issues > 0 && (
                  <span className="text-xs font-600 text-negative bg-negative/10 px-2 py-0.5 rounded-full">
                    {cat.issues}
                  </span>
                )}
                <span className="text-sm font-800 text-foreground tabular-nums w-8 text-right">{cat.score}</span>
              </div>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColor(cat.score)} transition-all duration-700`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}