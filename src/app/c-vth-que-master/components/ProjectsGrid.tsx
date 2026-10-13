'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/lib/LanguageContext';
import {
  ProjectItem,
  fetchUserProjects,
  deleteProject,
} from '@/lib/services/cvthequeService';
import ProjectEditModal from './ProjectEditModal';
import { toast } from 'sonner';

interface ProjectsGridProps {
  onCountChange?: (count: number) => void;
}

export default function ProjectsGrid({ onCountChange }: ProjectsGridProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  // Load projects from Supabase / cache
  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProjects();
      setProjects(data);
      if (onCountChange) {
        onCountChange(data.length);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
      toast.error('Impossible de charger vos projets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenCreate = () => {
    setProjectToEdit(null);
    setEditModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProjectToEdit(project);
    setEditModalOpen(true);
  };

  const handleDelete = async (project: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer le projet "${project.title}" de votre CVthèque Master ?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(project.id);
      await deleteProject(project.id);
      const updated = projects.filter((p) => p.id !== project.id);
      setProjects(updated);
      if (onCountChange) {
        onCountChange(updated.length);
      }
      if (selectedProject?.id === project.id) {
        setSelectedProject(null);
      }
      toast.success(`Le projet "${project.title}" a été supprimé.`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleProjectSaved = (saved: ProjectItem) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const nextList = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
      if (onCountChange) onCountChange(nextList.length);
      return nextList;
    });

    if (selectedProject?.id === saved.id) {
      setSelectedProject(saved);
    }
  };

  // Filter & Search
  const filtered = projects.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.role && p.role.toLowerCase().includes(q)) ||
      (p.company && p.company.toLowerCase().includes(q)) ||
      (p.techStack && p.techStack.some((tag) => tag.toLowerCase().includes(q)))
    );
  });

  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tous ({projects.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                filter === 'published'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Publiés ({publishedCount})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                filter === 'draft'
                  ? 'bg-card text-foreground font-700 shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Brouillons ({draftCount})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par stack, nom..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div className="absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none">
              <Icon name="MagnifyingGlassIcon" size={13} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Add Project Button */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press shadow-sm"
        >
          <Icon name="PlusIcon" size={16} />
          {t.cvtheque.projects.addProject}
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={`skel-${i}`}
              className="bg-card border border-border rounded-xl overflow-hidden h-72 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="h-32 bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-full mb-3" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed border-border rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Icon name="FolderIcon" size={28} />
          </div>
          <h3 className="text-base font-700 text-foreground mb-1">
            {searchQuery
              ? 'Aucun projet ne correspond à votre recherche'
              : 'Aucun projet dans cette catégorie'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
            {searchQuery
              ? `Aucun résultat pour "${searchQuery}". Essayez un autre mot-clé ou réinitialisez le filtre.`
              : 'Ajoutez les projets majeurs de votre carrière pour alimenter vos portfolios thématiques sur-mesure.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-600 rounded-xl hover:bg-secondary/80"
            >
              Effacer la recherche
            </button>
          ) : (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-600 hover:opacity-90"
            >
              <Icon name="PlusIcon" size={14} />
              Créer mon premier projet
            </button>
          )}
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-card card-hover cursor-pointer group flex flex-col justify-between"
              onClick={() => setSelectedProject(project)}
            >
              {/* Image banner */}
              <div>
                <div className="relative overflow-hidden h-36 bg-muted">
                  {project.imageUrl ? (
                    <AppImage
                      src={project.imageUrl}
                      alt={project.imageAlt || project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-secondary/30">
                      <Icon name="PhotoIcon" size={32} />
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <StatusBadge variant={project.status} size="sm" />
                  </div>

                  {project.role && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-600 text-white">
                      {project.role}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-700 text-foreground leading-tight group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    {project.year && (
                      <span className="text-[11px] font-mono-data text-muted-foreground flex-shrink-0 bg-muted px-1.5 py-0.5 rounded">
                        {project.year}
                      </span>
                    )}
                  </div>

                  {project.company && (
                    <p className="text-[11px] font-600 text-primary/90 mb-2">
                      {project.company}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {project.description || 'Aucune description fournie.'}
                  </p>

                  {/* KPIs */}
                  {project.kpis && project.kpis.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {project.kpis.slice(0, 2).map((kpi, kIdx) => (
                        <div
                          key={`kpi-${project.id}-${kIdx}`}
                          className="flex-1 bg-muted/70 border border-border/50 rounded-lg px-2 py-1.5 text-center"
                        >
                          <p className="text-xs font-800 text-primary tabular-nums">
                            {kpi.value}
                          </p>
                          <p
                            className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5"
                          >
                            {kpi.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.techStack?.slice(0, 3).map((tag) => (
                      <span
                        key={`tag-${project.id}-${tag}`}
                        className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[11px] font-500 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.techStack && project.techStack.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-600 rounded-md">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-4 pb-3 pt-2 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {project.url && (
                    <a
                      href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
                      title="Visiter le site"
                    >
                      <Icon name="GlobeAltIcon" size={13} />
                      Démo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-[11px]"
                      title="Voir sur GitHub"
                    >
                      <Icon name="GithubIcon" size={12} />
                      Code
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEdit(project, e)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
                    title="Modifier ce projet"
                  >
                    <Icon name="PencilIcon" size={13} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(project, e)}
                    disabled={deletingId === project.id}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all duration-150"
                    title="Supprimer ce projet"
                  >
                    {deletingId === project.id ? (
                      <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon name="TrashIcon" size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          subtitle={`${selectedProject.role ? `Rôle : ${selectedProject.role}` : ''}${
            selectedProject.company ? ` · ${selectedProject.company}` : ''
          }${selectedProject.duration ? ` · ${selectedProject.duration}` : ''}`}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="rounded-xl overflow-hidden mb-4 h-52 relative border border-border bg-muted">
                  {selectedProject.imageUrl ? (
                    <AppImage
                      src={selectedProject.imageUrl}
                      alt={selectedProject.imageAlt || selectedProject.title}
                      width={600}
                      height={240}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                      <Icon name="PhotoIcon" size={40} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge variant={selectedProject.status} />
                  </div>
                </div>

                <h4 className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-2">
                  Stack technique & outils
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techStack?.map((tag) => (
                    <span
                      key={`modal-tag-${selectedProject.id}-${tag}`}
                      className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-600 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-2">
                    Description du projet
                  </h4>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line bg-muted/30 p-3.5 rounded-xl border border-border">
                    {selectedProject.description || 'Aucune description disponible.'}
                  </p>
                </div>

                {selectedProject.kpis && selectedProject.kpis.length > 0 && (
                  <div>
                    <h4 className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-2">
                      Indicateurs clés de performance (KPIs)
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {selectedProject.kpis.map((kpi, idx) => (
                        <div
                          key={`modal-kpi-${selectedProject.id}-${idx}`}
                          className="p-3 bg-muted/60 border border-border rounded-xl text-center"
                        >
                          <span className="text-base font-800 text-primary tabular-nums block">
                            {kpi.value}
                          </span>
                          <span className="text-xs text-muted-foreground block mt-0.5">
                            {kpi.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* External links */}
                <div className="space-y-2 pt-2">
                  {selectedProject.url && (
                    <a
                      href={
                        selectedProject.url.startsWith('http')
                          ? selectedProject.url
                          : `https://${selectedProject.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-xl text-xs font-600 text-foreground transition-colors border border-border"
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="GlobeAltIcon" size={16} className="text-primary" />
                        Accéder au projet en direct
                      </span>
                      <Icon name="ArrowTopRightOnSquareIcon" size={14} className="text-muted-foreground" />
                    </a>
                  )}

                  {selectedProject.github && (
                    <a
                      href={
                        selectedProject.github.startsWith('http')
                          ? selectedProject.github
                          : `https://${selectedProject.github}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-xl text-xs font-600 text-foreground transition-colors border border-border"
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="GithubIcon" size={16} className="text-foreground" />
                        Consulter le code source (GitHub)
                      </span>
                      <span className="font-mono-data text-[11px] text-muted-foreground">
                        {selectedProject.github}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Créé le {selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString('fr-FR') : 'Date non définie'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-600 hover:bg-muted"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = selectedProject;
                    setSelectedProject(null);
                    handleOpenEdit(toEdit);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-600 hover:opacity-90"
                >
                  <Icon name="PencilIcon" size={14} />
                  Modifier ce projet
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Project Edit / Create Modal */}
      <ProjectEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialProject={projectToEdit}
        onSaved={handleProjectSaved}
      />
    </div>
  );
}