'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/lib/LanguageContext';

const projects = [
{
  id: 'proj-001',
  title: 'NeuralCommerce Platform',
  description: 'AI-powered e-commerce recommendation engine processing 2M+ daily requests with 94% accuracy.',
  tags: ['React', 'Python', 'TensorFlow', 'AWS', 'PostgreSQL'],
  status: 'published' as const,
  kpis: [{ label: 'Daily Requests', value: '2.1M' }, { label: 'Accuracy', value: '94.2%' }, { label: 'Latency', value: '18ms' }],
  github: 'github.com/alex/neuralcommerce',
  cad: null,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_19f8fe7fc-1772547120162.png",
  imageAlt: 'Abstract neural network visualization with glowing blue nodes on dark background',
  year: '2026',
  role: 'Lead Engineer',
  duration: '8 months'
},
{
  id: 'proj-002',
  title: 'DistributedDB Orchestrator',
  description: 'Kubernetes-native database orchestration layer supporting multi-region replication and zero-downtime migrations.',
  tags: ['Go', 'Kubernetes', 'gRPC', 'etcd', 'Terraform'],
  status: 'published' as const,
  kpis: [{ label: 'Uptime', value: '99.99%' }, { label: 'Nodes Managed', value: '240' }, { label: 'Migration Time', value: '0s' }],
  github: 'github.com/alex/distdb',
  cad: null,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1684f325c-1772376035798.png",
  imageAlt: 'Server rack infrastructure with blue LED lights in a data center',
  year: '2025',
  role: 'Architect',
  duration: '12 months'
},
{
  id: 'proj-003',
  title: 'RealTime Collaboration SDK',
  description: 'WebSocket-based collaboration SDK enabling Google Docs-like concurrent editing for any web application.',
  tags: ['TypeScript', 'WebSocket', 'CRDT', 'Node.js', 'Redis'],
  status: 'published' as const,
  kpis: [{ label: 'Concurrent Users', value: '10K' }, { label: 'Conflict Rate', value: '0.001%' }, { label: 'Latency', value: '12ms' }],
  github: 'github.com/alex/collab-sdk',
  cad: null,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d3ddda09-1766126692583.png",
  imageAlt: 'Team of developers collaborating around a laptop in a modern office',
  year: '2025',
  role: 'Creator & Maintainer',
  duration: '6 months'
},
{
  id: 'proj-004',
  title: 'Predictive DevOps Monitor',
  description: 'ML-based infrastructure monitoring that predicts outages 15 minutes before they occur using anomaly detection.',
  tags: ['Python', 'Prometheus', 'Grafana', 'scikit-learn', 'Kafka'],
  status: 'published' as const,
  kpis: [{ label: 'Prediction Accuracy', value: '87%' }, { label: 'False Positives', value: '3.2%' }, { label: 'MTTR Reduction', value: '-68%' }],
  github: 'github.com/alex/predictops',
  cad: null,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_19fe428b0-1766754349995.png",
  imageAlt: 'Dashboard with colorful data visualization charts and monitoring graphs',
  year: '2024',
  role: 'ML Engineer',
  duration: '5 months'
},
{
  id: 'proj-005',
  title: 'Open Source CLI Framework',
  description: 'Extensible CLI framework with plugin architecture, used by 3,400+ developers. Featured in GitHub Trending.',
  tags: ['TypeScript', 'Node.js', 'Ink', 'Commander.js'],
  status: 'published' as const,
  kpis: [{ label: 'GitHub Stars', value: '3.4K' }, { label: 'Weekly Downloads', value: '28K' }, { label: 'Contributors', value: '47' }],
  github: 'github.com/alex/cli-forge',
  cad: null,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_18e746b1b-1772511364607.png",
  imageAlt: 'Terminal window showing command line interface with green text on dark background',
  year: '2024',
  role: 'Creator',
  duration: '4 months'
},
{
  id: 'proj-006',
  title: 'FinTech Compliance Engine',
  description: 'Automated regulatory compliance checking for EU financial institutions, handling PSD2 and GDPR requirements.',
  tags: ['Java', 'Spring Boot', 'Apache Flink', 'Oracle', 'Kafka'],
  status: 'draft' as const,
  kpis: [{ label: 'Rules Checked', value: '1,240' }, { label: 'Compliance Rate', value: '99.7%' }, { label: 'Processing Speed', value: '50K/s' }],
  github: null,
  cad: null,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_10b1e45d5-1772191974417.png",
  imageAlt: 'Financial charts and graphs on a computer screen showing compliance data',
  year: '2026',
  role: 'Backend Lead',
  duration: 'Ongoing'
}];


export default function ProjectsGrid() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [filter, setFilter] = useState('all');
  const { t } = useLanguage();

  const filterLabels: Record<string, string> = {
    all: t.cvtheque.projects.all,
    published: t.cvtheque.projects.published,
    draft: t.cvtheque.projects.draft,
  };

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {['all', 'published', 'draft'].map((f) =>
          <button
            key={`filter-${f}`}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 ${
            filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`
            }>
            {filterLabels[f]}
            </button>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press">
          <Icon name="PlusIcon" size={15} />
          {t.cvtheque.projects.addProject}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filtered.map((project) =>
        <div
          key={project.id}
          className="bg-card border border-border rounded-xl overflow-hidden shadow-card card-hover cursor-pointer group"
          onClick={() => setSelectedProject(project)}>
          
            <div className="relative overflow-hidden h-36">
              <AppImage
              src={project.image}
              alt={project.imageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw" />
            
              <div className="absolute top-2 right-2">
                <StatusBadge variant={project.status} size="sm" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-700 text-foreground leading-tight">{project.title}</h4>
                <span className="text-xs font-mono-data text-muted-foreground flex-shrink-0">{project.year}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{project.description}</p>

              {/* KPIs */}
              <div className="flex gap-2 mb-3">
                {project.kpis.slice(0, 2).map((kpi) =>
              <div key={`kpi-${project.id}-${kpi.label}`} className="flex-1 bg-muted rounded-lg px-2 py-1.5 text-center">
                    <p className="text-xs font-800 text-primary tabular-nums">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground leading-tight" style={{ fontSize: '10px' }}>{kpi.label}</p>
                  </div>
              )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags.slice(0, 3).map((tag) =>
              <span key={`tag-${project.id}-${tag}`} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-500 rounded-full">
                    {tag}
                  </span>
              )}
                {project.tags.length > 3 &&
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-500 rounded-full">
                    +{project.tags.length - 3}
                  </span>
              }
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                {project.github &&
              <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="GithubIcon" size={12} />
                    {t.cvtheque.projects.github}
                  </span>
              }
                <div className="flex-1" />
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150">
                  <Icon name="PencilIcon" size={13} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-negative/10 text-muted-foreground hover:text-negative transition-all duration-150">
                  <Icon name="TrashIcon" size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject &&
      <Modal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject.title}
        subtitle={`${t.cvtheque.projects.role}: ${selectedProject.role} · ${t.cvtheque.projects.duration}: ${selectedProject.duration}`}
        size="xl">
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="rounded-xl overflow-hidden mb-4 h-48">
                <AppImage src={selectedProject.image} alt={selectedProject.imageAlt} width={600} height={220} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tags.map((tag) =>
              <span key={`modal-tag-${selectedProject.id}-${tag}`} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-600 rounded-full">
                    {tag}
                  </span>
              )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-700 text-foreground mb-3">{t.cvtheque.projects.kpis}</h4>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {selectedProject.kpis.map((kpi) =>
              <div key={`modal-kpi-${selectedProject.id}-${kpi.label}`} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <span className="text-sm text-muted-foreground">{kpi.label}</span>
                    <span className="text-lg font-800 text-primary tabular-nums">{kpi.value}</span>
                  </div>
              )}
              </div>
              {selectedProject.github &&
            <div className="flex items-center gap-2 p-3 bg-muted rounded-xl text-sm">
                  <Icon name="GithubIcon" size={16} className="text-foreground" />
                  <span className="font-mono-data text-xs text-muted-foreground">{selectedProject.github}</span>
                </div>
            }
            </div>
          </div>
        </Modal>
      }
    </div>);

}