'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';

const parcours = [
  {
    id: 'par-001',
    type: 'experience',
    title: 'Senior Full-Stack Engineer',
    organization: 'Mistral AI',
    location: 'Paris, France',
    period: 'Jan 2025 — Present',
    duration: '1y 9m',
    description: 'Led architecture of the developer platform serving 120K+ API users. Built the playground interface, usage analytics dashboard, and billing system. Managed a team of 4 engineers.',
    achievements: ['Reduced API latency by 40%', 'Launched playground used by 45K devs/month', 'Onboarded enterprise clients worth €2.4M ARR'],
    tech: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Stripe'],
    document: 'recommendation_mistral.pdf',
    current: true,
  },
  {
    id: 'par-002',
    type: 'experience',
    title: 'Software Engineer II',
    organization: 'Datadog',
    location: 'Paris, France (Remote)',
    period: 'Mar 2023 — Dec 2024',
    duration: '1y 10m',
    description: 'Built distributed tracing features for the APM product. Contributed to the open-source agent. Worked on ingestion pipeline handling 15TB/day.',
    achievements: ['Shipped distributed trace sampling feature used by 8K+ customers', 'Reduced pipeline costs by 22%', 'Mentored 3 junior engineers'],
    tech: ['Go', 'Python', 'Kafka', 'Cassandra', 'OpenTelemetry'],
    document: 'certificate_datadog.pdf',
    current: false,
  },
  {
    id: 'par-003',
    type: 'experience',
    title: 'Full-Stack Developer',
    organization: 'Qonto',
    location: 'Paris, France',
    period: 'Jul 2021 — Feb 2023',
    duration: '1y 8m',
    description: 'Developed core banking features for the SME finance platform. Built the international transfer flow, expense categorization engine, and accounting export module.',
    achievements: ['International transfers launched in 7 new EU markets', 'Expense engine processing €180M/month', 'Zero production incidents in 18 months'],
    tech: ['Ruby on Rails', 'React', 'Ember.js', 'PostgreSQL', 'Redis'],
    document: null,
    current: false,
  },
  {
    id: 'par-004',
    type: 'formation',
    title: 'Master 2 — Génie Logiciel & Intelligence Artificielle',
    organization: 'Université Paris-Saclay',
    location: 'Orsay, France',
    period: 'Sep 2019 — Jun 2021',
    duration: '2 years',
    description: 'Specialized in distributed systems, machine learning algorithms, and software architecture. Graduated with honors (Mention Très Bien).',
    achievements: ['Valedictorian — 18.4/20 GPA', 'Research internship at INRIA on graph neural networks', 'Published paper on distributed consensus algorithms'],
    tech: ['Python', 'Java', 'C++', 'MATLAB', 'LaTeX'],
    document: 'diplome_m2_paris_saclay.pdf',
    current: false,
  },
  {
    id: 'par-005',
    type: 'experience',
    title: 'Junior Developer (Apprenticeship)',
    organization: 'BNP Paribas',
    location: 'Paris, France',
    period: 'Sep 2019 — Jun 2021',
    duration: '2 years',
    description: 'Alternance contract alongside Master 2. Built internal tools for the risk management team, including a real-time position aggregator.',
    achievements: ['Risk aggregator used by 200+ traders', 'Reduced manual reporting by 6h/week'],
    tech: ['Java', 'Spring Boot', 'Angular', 'Oracle DB'],
    document: null,
    current: false,
  },
  {
    id: 'par-006',
    type: 'formation',
    title: 'Licence — Informatique',
    organization: 'Université Paris-Diderot (Paris VII)',
    location: 'Paris, France',
    period: 'Sep 2016 — Jun 2019',
    duration: '3 years',
    description: 'Core computer science curriculum covering algorithms, data structures, operating systems, and web development fundamentals.',
    achievements: ['Top 5% of class', 'Won hackathon "Paris Hack 2018" (1st place)'],
    tech: ['C', 'Java', 'Python', 'HTML/CSS', 'JavaScript'],
    document: 'diplome_licence_paris7.pdf',
    current: false,
  },
];

export default function ParcoursTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>('par-001');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> Experience</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent inline-block" /> Formation</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press">
          <Icon name="PlusIcon" size={15} />
          Add Entry
        </button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {parcours?.map((entry) => (
            <div key={entry?.id} className="relative pl-14">
              {/* Timeline dot */}
              <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full border-2 border-card ${entry?.type === 'experience' ? 'bg-primary' : 'bg-accent'}`} />

              <div
                className={`bg-card border rounded-xl shadow-card transition-all duration-200 ${expandedId === entry?.id ? 'border-primary/30' : 'border-border hover:border-border/80'}`}
              >
                <button
                  className="w-full flex items-start justify-between p-4 text-left"
                  onClick={() => setExpandedId(expandedId === entry?.id ? null : entry?.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${entry?.type === 'experience' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                      <Icon name={entry?.type === 'experience' ? 'BriefcaseIcon' : 'GraduationCapIcon'} size={16} className={entry?.type === 'experience' ? 'text-primary' : 'text-accent'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-700 text-foreground">{entry?.title}</p>
                        {entry?.current && <StatusBadge variant="active" label="Current" size="sm" />}
                      </div>
                      <p className="text-xs font-600 text-muted-foreground mt-0.5">{entry?.organization} · {entry?.location}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{entry?.period} · {entry?.duration}</p>
                    </div>
                  </div>
                  <Icon name={expandedId === entry?.id ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                </button>

                {expandedId === entry?.id && (
                  <div className="px-4 pb-4 border-t border-border pt-4 animate-fade-in">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{entry?.description}</p>

                    <div className="mb-4">
                      <p className="text-xs font-700 text-foreground mb-2">Key Achievements</p>
                      <ul className="space-y-1">
                        {entry?.achievements?.map((ach) => (
                          <li key={`ach-${entry?.id}-${ach?.slice(0, 20)}`} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Icon name="CheckCircleIcon" size={13} className="text-positive flex-shrink-0 mt-0.5" />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {entry?.tech?.map((t) => (
                        <span key={`tech-${entry?.id}-${t}`} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-500 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {entry?.document && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-600 hover:text-foreground transition-all">
                          <Icon name="FileTextIcon" size={12} />
                          {entry?.document}
                        </button>
                      )}
                      <div className="flex-1" />
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-600 hover:text-foreground transition-all">
                        <Icon name="PencilIcon" size={12} />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}