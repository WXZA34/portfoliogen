import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function AuditProgressTracker() {
  const resolved = 5;
  const total = 17;
  const pct = Math.round((resolved / total) * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="TrendingUpIcon" size={16} className="text-positive" />
          <h3 className="text-sm font-700 text-foreground">This Week's Progress</h3>
        </div>
        <span className="text-xs font-700 text-positive">{resolved}/{total} issues resolved</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-positive rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{pct}% of this audit cycle complete — {total - resolved} issues remaining</p>
    </div>
  );
}