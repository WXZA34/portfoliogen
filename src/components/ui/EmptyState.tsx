import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Icon name={icon as any} size={24} className="text-primary" />
      </div>
      <h3 className="text-base font-700 text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press"
        >
          <Icon name="PlusIcon" size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}