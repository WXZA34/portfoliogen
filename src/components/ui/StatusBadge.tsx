import React from 'react';

type BadgeVariant = 'active' | 'draft' | 'frozen' | 'live' | 'paused' | 'archived' | 'critical' | 'warning' | 'suggestion' | 'published';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

const variantMap: Record<BadgeVariant, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  active: { bg: 'bg-positive/10', text: 'text-positive', dot: 'bg-positive', defaultLabel: 'Active' },
  published: { bg: 'bg-positive/10', text: 'text-positive', dot: 'bg-positive', defaultLabel: 'Published' },
  live: { bg: 'bg-positive/10', text: 'text-positive', dot: 'bg-positive', defaultLabel: 'Live Sync' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground', defaultLabel: 'Draft' },
  frozen: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info', defaultLabel: 'Frozen' },
  paused: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', defaultLabel: 'Paused' },
  archived: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground', defaultLabel: 'Archived' },
  critical: { bg: 'bg-negative/10', text: 'text-negative', dot: 'bg-negative', defaultLabel: 'Critical' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', defaultLabel: 'Warning' },
  suggestion: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info', defaultLabel: 'Suggestion' },
};

export default function StatusBadge({ variant, label, size = 'md' }: StatusBadgeProps) {
  const styles = variantMap[variant];
  const displayLabel = label ?? styles.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-600 rounded-full ${styles.bg} ${styles.text} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
      {displayLabel}
    </span>
  );
}