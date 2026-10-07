'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import ProjectsGrid from './ProjectsGrid';
import SkillsMatrix from './SkillsMatrix';
import ParcoursTimeline from './ParcoursTimeline';
import MediaGallery from './MediaGallery';
import PersonasPanel from './PersonasPanel';
import { useLanguage } from '@/lib/LanguageContext';

export default function CVthequeContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tab-projects');

  const tabs = [
    { id: 'tab-projects', labelKey: 'projects', icon: 'FolderIcon', count: 12 },
    { id: 'tab-skills', labelKey: 'skills', icon: 'BrainIcon', count: 34 },
    { id: 'tab-parcours', labelKey: 'parcours', icon: 'GraduationCapIcon', count: 8 },
    { id: 'tab-media', labelKey: 'media', icon: 'ImageIcon', count: 47 },
    { id: 'tab-personas', labelKey: 'personas', icon: 'UsersIcon', count: 5 },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-xl mb-6 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-600 transition-all duration-150 btn-press ${
              activeTab === tab.id
                ? 'bg-card text-primary shadow-card'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon as any} size={15} />
            {t.cvtheque.tabs[tab.labelKey as keyof typeof t.cvtheque.tabs]}
            <span className={`text-xs font-700 px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-border text-muted-foreground'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'tab-projects' && <ProjectsGrid />}
        {activeTab === 'tab-skills' && <SkillsMatrix />}
        {activeTab === 'tab-parcours' && <ParcoursTimeline />}
        {activeTab === 'tab-media' && <MediaGallery />}
        {activeTab === 'tab-personas' && <PersonasPanel />}
      </div>
    </div>
  );
}