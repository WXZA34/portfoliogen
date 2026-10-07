'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type SkillCategory = 'hard' | 'soft' | 'tools';

const skills = {
  hard: [
    { id: 'sk-001', name: 'TypeScript / JavaScript', level: 95, years: 7 },
    { id: 'sk-002', name: 'React / Next.js', level: 93, years: 6 },
    { id: 'sk-003', name: 'Node.js / Express', level: 88, years: 6 },
    { id: 'sk-004', name: 'Python', level: 82, years: 5 },
    { id: 'sk-005', name: 'Go (Golang)', level: 74, years: 3 },
    { id: 'sk-006', name: 'PostgreSQL / MySQL', level: 85, years: 6 },
    { id: 'sk-007', name: 'System Design', level: 90, years: 5 },
    { id: 'sk-008', name: 'Machine Learning (Applied)', level: 68, years: 3 },
    { id: 'sk-009', name: 'Docker / Kubernetes', level: 80, years: 4 },
    { id: 'sk-010', name: 'GraphQL / REST API Design', level: 91, years: 5 },
  ],
  soft: [
    { id: 'sk-011', name: 'Technical Leadership', level: 88, years: 4 },
    { id: 'sk-012', name: 'Cross-functional Communication', level: 85, years: 6 },
    { id: 'sk-013', name: 'Mentoring & Code Review', level: 90, years: 5 },
    { id: 'sk-014', name: 'Agile / Scrum Facilitation', level: 82, years: 5 },
    { id: 'sk-015', name: 'Product Thinking', level: 78, years: 4 },
    { id: 'sk-016', name: 'Remote Team Collaboration', level: 92, years: 5 },
  ],
  tools: [
    { id: 'sk-017', name: 'VS Code / JetBrains IDEs', level: 95, years: 7 },
    { id: 'sk-018', name: 'GitHub / GitLab', level: 93, years: 7 },
    { id: 'sk-019', name: 'AWS (EC2, S3, Lambda, RDS)', level: 84, years: 4 },
    { id: 'sk-020', name: 'Terraform / Pulumi', level: 75, years: 3 },
    { id: 'sk-021', name: 'Figma (Design Handoff)', level: 65, years: 3 },
    { id: 'sk-022', name: 'Datadog / Grafana', level: 80, years: 4 },
    { id: 'sk-023', name: 'Linear / Jira', level: 88, years: 5 },
    { id: 'sk-024', name: 'Notion / Confluence', level: 86, years: 5 },
  ],
};

const categoryLabels: Record<SkillCategory, { label: string; color: string; bg: string }> = {
  hard: { label: 'Hard Skills', color: 'text-primary', bg: 'bg-primary' },
  soft: { label: 'Soft Skills', color: 'text-accent', bg: 'bg-accent' },
  tools: { label: 'Tools & Platforms', color: 'text-info', bg: 'bg-info' },
};

function getLevelLabel(level: number) {
  if (level >= 90) return 'Expert';
  if (level >= 75) return 'Advanced';
  if (level >= 60) return 'Intermediate';
  return 'Beginner';
}

export default function SkillsMatrix() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('hard');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const currentSkills = skills[activeCategory];
  const config = categoryLabels[activeCategory];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {(Object.keys(categoryLabels) as SkillCategory[]).map((cat) => (
            <button
              key={`cat-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-600 transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-card'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {categoryLabels[cat].label}
              <span className="ml-2 text-xs opacity-70">{skills[cat].length}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press"
        >
          <Icon name="PlusIcon" size={15} />
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {currentSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-card border border-border rounded-xl p-4 shadow-card group hover:border-primary/30 transition-all duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-700 text-foreground">{skill.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{skill.years} years · {getLevelLabel(skill.level)}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                  <Icon name="PencilIcon" size={13} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-negative/10 text-muted-foreground hover:text-negative transition-all">
                  <Icon name="TrashIcon" size={13} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${config.bg} transition-all duration-500`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <span className="text-xs font-800 text-foreground tabular-nums w-8 text-right">{skill.level}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}