'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import ProfileContactPanel from './ProfileContactPanel';
import ProjectsGrid from './ProjectsGrid';
import SkillsMatrix from './SkillsMatrix';
import ParcoursTimeline from './ParcoursTimeline';
import LanguagesCertifPanel from './LanguagesCertifPanel';
import MediaGallery from './MediaGallery';
import PersonasPanel from './PersonasPanel';
import { useLanguage } from '@/lib/LanguageContext';

export default function CVthequeContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tab-profile');
  const [projectsCount, setProjectsCount] = useState<number>(6);
  const [skillsCount, setSkillsCount] = useState<number>(24);
  const [parcoursCount, setParcoursCount] = useState<number>(6);
  const [languagesCount, setLanguagesCount] = useState<number>(6);
  const [mediaCount, setMediaCount] = useState<number>(8);
  const [personasCount, setPersonasCount] = useState<number>(5);

  const tabs = [
    { id: 'tab-profile', labelKey: 'profile', icon: 'UserIcon', count: 1 },
    { id: 'tab-projects', labelKey: 'projects', icon: 'FolderIcon', count: projectsCount },
    { id: 'tab-skills', labelKey: 'skills', icon: 'BrainIcon', count: skillsCount },
    { id: 'tab-parcours', labelKey: 'parcours', icon: 'GraduationCapIcon', count: parcoursCount },
    { id: 'tab-languages', labelKey: 'languages', icon: 'GlobeAltIcon', count: languagesCount },
    { id: 'tab-media', labelKey: 'media', icon: 'ImageIcon', count: mediaCount },
    { id: 'tab-personas', labelKey: 'personas', icon: 'UsersIcon', count: personasCount },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-xl mb-6 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-600 transition-all duration-150 btn-press ${
              activeTab === tab.id
                ? 'bg-card text-primary shadow-card'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon as any} size={15} />
            {t.cvtheque.tabs[tab.labelKey as keyof typeof t.cvtheque.tabs]}
            <span
              className={`text-xs font-700 px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'bg-border text-muted-foreground'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'tab-profile' && <ProfileContactPanel />}
        {activeTab === 'tab-projects' && <ProjectsGrid onCountChange={setProjectsCount} />}
        {activeTab === 'tab-skills' && <SkillsMatrix onCountChange={setSkillsCount} />}
        {activeTab === 'tab-parcours' && <ParcoursTimeline onCountChange={setParcoursCount} />}
        {activeTab === 'tab-languages' && <LanguagesCertifPanel onCountChange={setLanguagesCount} />}
        {activeTab === 'tab-media' && <MediaGallery onCountChange={setMediaCount} />}
        {activeTab === 'tab-personas' && <PersonasPanel onCountChange={setPersonasCount} />}
      </div>
    </div>
  );
}