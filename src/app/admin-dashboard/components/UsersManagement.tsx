'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type UserType = 'all' | 'candidate' | 'recruiter';
type UserStatus = 'active' | 'suspended' | 'pending';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
  status: UserStatus;
  joinedAt: string;
  portfolios?: number;
  jobOffers?: number;
  lastActive: string;
  verified: boolean;
  location?: string;
  views?: number;
  connections?: number;
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sophie Martin', email: 'sophie.martin@email.com', role: 'candidate', status: 'active', joinedAt: '12 Jan 2026', portfolios: 3, lastActive: 'il y a 2h', verified: true, location: 'Paris, France', views: 1240, connections: 48 },
  { id: 'u2', name: 'Thomas Dubois', email: 'thomas.d@email.com', role: 'candidate', status: 'active', joinedAt: '5 Fév 2026', portfolios: 1, lastActive: 'il y a 1j', verified: true, location: 'Lyon, France', views: 320, connections: 12 },
  { id: 'u3', name: 'Accenture France', email: 'rh@accenture.fr', role: 'recruiter', status: 'active', joinedAt: '20 Mar 2026', jobOffers: 8, lastActive: 'il y a 30 min', verified: true, location: 'Paris, France', views: 5600, connections: 234 },
  { id: 'u4', name: 'Lucas Bernard', email: 'lucas.b@email.com', role: 'candidate', status: 'suspended', joinedAt: '3 Avr 2026', portfolios: 2, lastActive: 'il y a 5j', verified: false, location: 'Bordeaux, France', views: 89, connections: 5 },
  { id: 'u5', name: 'Capgemini RH', email: 'recrutement@capgemini.com', role: 'recruiter', status: 'active', joinedAt: '15 Avr 2026', jobOffers: 12, lastActive: 'il y a 4h', verified: true, location: 'Paris, France', views: 8900, connections: 412 },
  { id: 'u6', name: 'Emma Lefebvre', email: 'emma.l@email.com', role: 'candidate', status: 'pending', joinedAt: '2 Oct 2026', portfolios: 0, lastActive: 'jamais', verified: false, location: 'Marseille, France', views: 0, connections: 0 },
  { id: 'u7', name: 'BNP Paribas RH', email: 'talent@bnpparibas.com', role: 'recruiter', status: 'pending', joinedAt: '5 Oct 2026', jobOffers: 0, lastActive: 'jamais', verified: false, location: 'Paris, France', views: 0, connections: 0 },
  { id: 'u8', name: 'Antoine Moreau', email: 'antoine.m@email.com', role: 'candidate', status: 'active', joinedAt: '18 Sep 2026', portfolios: 4, lastActive: 'il y a 1h', verified: true, location: 'Nantes, France', views: 2100, connections: 67 },
];

const STATUS_CONFIG: Record<UserStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Actif', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  suspended: { label: 'Suspendu', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-500/10' },
};

const USER_ACTIVITY = [
  { action: 'Connexion', time: 'il y a 2h', icon: 'LogInIcon' },
  { action: 'Portfolio mis à jour', time: 'il y a 1j', icon: 'EditIcon' },
  { action: 'Nouveau credential ajouté', time: 'il y a 3j', icon: 'ShieldCheckIcon' },
  { action: 'Profil complété à 95%', time: 'il y a 1 sem', icon: 'UserCheckIcon' },
  { action: 'Inscription', time: '12 Jan 2026', icon: 'UserPlusIcon' },
];

export default function UsersManagement() {
  const [filter, setFilter] = useState<UserType>('all');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'activity' | 'content'>('info');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = MOCK_USERS.filter((u) => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = {
    all: MOCK_USERS.length,
    candidate: MOCK_USERS.filter((u) => u.role === 'candidate').length,
    recruiter: MOCK_USERS.filter((u) => u.role === 'recruiter').length,
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((u) => u.id));
  };

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total utilisateurs', value: MOCK_USERS.length, icon: 'UsersIcon', color: 'text-blue-600', bg: 'bg-blue-500/10', sub: 'Tous rôles confondus' },
          { label: 'Candidats', value: counts.candidate, icon: 'UserIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', sub: `${MOCK_USERS.filter(u => u.role === 'candidate' && u.status === 'active').length} actifs` },
          { label: 'Recruteurs', value: counts.recruiter, icon: 'BuildingIcon', color: 'text-violet-600', bg: 'bg-violet-500/10', sub: `${MOCK_USERS.filter(u => u.role === 'recruiter' && u.status === 'active').length} actifs` },
          { label: 'En attente', value: MOCK_USERS.filter(u => u.status === 'pending').length, icon: 'ClockIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', sub: 'Validation requise' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={s.icon as any} size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-800 text-foreground">{s.value}</p>
              <p className="text-xs font-600 text-foreground">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search + Bulk actions */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {(['all', 'candidate', 'recruiter'] as UserType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                  filter === type ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type === 'all' ? `Tous (${counts.all})` : type === 'candidate' ? `Candidats (${counts.candidate})` : `Recruteurs (${counts.recruiter})`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <span className="text-xs font-600 text-rose-600">{selectedIds.length} sélectionné(s)</span>
                <button className="text-xs text-rose-600 hover:text-rose-700 font-600 flex items-center gap-1">
                  <Icon name="PauseCircleIcon" size={12} /> Suspendre
                </button>
                <button className="text-xs text-rose-600 hover:text-rose-700 font-600 flex items-center gap-1">
                  <Icon name="Trash2Icon" size={12} /> Supprimer
                </button>
              </div>
            )}
            <div className="relative">
              <Icon name="SearchIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 w-56"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-xs font-600 text-muted-foreground hover:text-foreground transition-all border border-border">
              <Icon name="DownloadIcon" size={13} />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Utilisateur</th>
                <th className="text-left px-4 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Rôle</th>
                <th className="text-left px-4 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Contenu</th>
                <th className="text-left px-4 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Localisation</th>
                <th className="text-left px-4 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Dernière activité</th>
                <th className="text-left px-4 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const statusCfg = STATUS_CONFIG[user.status];
                const isSelected = selectedIds.includes(user.id);
                return (
                  <tr key={user.id} className={`border-b border-border last:border-0 transition-colors ${isSelected ? 'bg-rose-500/5' : 'hover:bg-muted/30'}`}>
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(user.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-700 flex-shrink-0 ${user.role === 'recruiter' ? 'bg-violet-600' : 'bg-blue-600'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-600 text-foreground">{user.name}</p>
                            {user.verified && <Icon name="BadgeCheckIcon" size={13} className="text-blue-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${user.role === 'recruiter' ? 'bg-violet-500/10 text-violet-600' : 'bg-blue-500/10 text-blue-600'}`}>
                        <Icon name={user.role === 'recruiter' ? 'BuildingIcon' : 'UserIcon'} size={11} />
                        {user.role === 'recruiter' ? 'Recruteur' : 'Candidat'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'suspended' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-foreground font-600">
                        {user.role === 'candidate' ? `${user.portfolios} portfolio${(user.portfolios ?? 0) > 1 ? 's' : ''}` : `${user.jobOffers} offre${(user.jobOffers ?? 0) > 1 ? 's' : ''}`}
                      </p>
                      {(user.views ?? 0) > 0 && <p className="text-[10px] text-muted-foreground">{user.views?.toLocaleString()} vues</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-muted-foreground">{user.location}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                      <p className="text-[10px] text-muted-foreground/60">Inscrit le {user.joinedAt}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedUser(user); setActiveDetailTab('info'); }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-all"
                          title="Voir le profil"
                        >
                          <Icon name="EyeIcon" size={14} />
                        </button>
                        {user.status === 'active' ? (
                          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-all" title="Suspendre">
                            <Icon name="PauseCircleIcon" size={14} />
                          </button>
                        ) : (
                          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 transition-all" title="Réactiver">
                            <Icon name="PlayCircleIcon" size={14} />
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all" title="Supprimer">
                          <Icon name="Trash2Icon" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Icon name="UsersIcon" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucun utilisateur trouvé</p>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{filtered.length} utilisateur(s) affiché(s)</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-all border border-border">Précédent</button>
            <button className="px-3 py-1.5 rounded-lg text-xs bg-rose-600 text-white font-600">1</button>
            <button className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-all border border-border">Suivant</button>
          </div>
        </div>
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-700 text-foreground">Profil utilisateur</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* User identity */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-800 flex-shrink-0 ${selectedUser.role === 'recruiter' ? 'bg-violet-600' : 'bg-blue-600'}`}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-700 text-foreground text-lg">{selectedUser.name}</p>
                    {selectedUser.verified && <Icon name="BadgeCheckIcon" size={16} className="text-blue-500" />}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-600 ${STATUS_CONFIG[selectedUser.status].bg} ${STATUS_CONFIG[selectedUser.status].color}`}>
                      {STATUS_CONFIG[selectedUser.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  {selectedUser.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Icon name="MapPinIcon" size={11} /> {selectedUser.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: selectedUser.role === 'candidate' ? 'Portfolios' : 'Offres', value: selectedUser.role === 'candidate' ? selectedUser.portfolios : selectedUser.jobOffers, icon: selectedUser.role === 'candidate' ? 'LayoutTemplateIcon' : 'BriefcaseIcon' },
                  { label: 'Vues profil', value: selectedUser.views?.toLocaleString() ?? '0', icon: 'EyeIcon' },
                  { label: 'Connexions', value: selectedUser.connections ?? 0, icon: 'UsersIcon' },
                ].map((s) => (
                  <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
                    <Icon name={s.icon as any} size={14} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-lg font-800 text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {(['info', 'activity', 'content'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`flex-1 py-3 text-xs font-600 transition-all border-b-2 ${activeDetailTab === tab ? 'border-rose-500 text-rose-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  {tab === 'info' ? 'Informations' : tab === 'activity' ? 'Activité' : 'Contenu'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-6 py-4 max-h-56 overflow-y-auto">
              {activeDetailTab === 'info' && (
                <div className="space-y-2">
                  {[
                    { label: 'Rôle', value: selectedUser.role === 'recruiter' ? 'Recruteur' : 'Candidat' },
                    { label: 'Inscrit le', value: selectedUser.joinedAt },
                    { label: 'Dernière activité', value: selectedUser.lastActive },
                    { label: 'Email vérifié', value: selectedUser.verified ? 'Oui ✓' : 'Non ✗' },
                    { label: 'Localisation', value: selectedUser.location ?? '—' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className="text-xs font-600 text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeDetailTab === 'activity' && (
                <div className="space-y-3">
                  {USER_ACTIVITY.map((act, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon name={act.icon as any} size={13} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-600 text-foreground">{act.action}</p>
                        <p className="text-[10px] text-muted-foreground">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeDetailTab === 'content' && (
                <div className="space-y-2">
                  {selectedUser.role === 'candidate' ? (
                    Array.from({ length: selectedUser.portfolios ?? 0 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border">
                        <Icon name="LayoutTemplateIcon" size={14} className="text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs font-600 text-foreground">Portfolio #{i + 1}</p>
                          <p className="text-[10px] text-muted-foreground">Publié · {Math.floor(Math.random() * 500 + 50)} vues</p>
                        </div>
                        <button className="text-xs text-rose-500 hover:text-rose-600 font-600">Voir</button>
                      </div>
                    ))
                  ) : (
                    Array.from({ length: selectedUser.jobOffers ?? 0 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border">
                        <Icon name="BriefcaseIcon" size={14} className="text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-xs font-600 text-foreground">Offre d'emploi #{i + 1}</p>
                          <p className="text-[10px] text-muted-foreground">Active · {Math.floor(Math.random() * 30 + 5)} candidatures</p>
                        </div>
                        <button className="text-xs text-rose-500 hover:text-rose-600 font-600">Voir</button>
                      </div>
                    ))
                  )}
                  {((selectedUser.role === 'candidate' ? selectedUser.portfolios : selectedUser.jobOffers) ?? 0) === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Aucun contenu publié</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-border flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-muted text-sm font-600 text-foreground hover:bg-border transition-all flex items-center justify-center gap-2">
                <Icon name="MessageSquareIcon" size={14} />
                Envoyer un message
              </button>
              {selectedUser.status === 'active' ? (
                <button className="flex-1 py-2 rounded-xl bg-amber-500/10 text-sm font-600 text-amber-600 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2">
                  <Icon name="PauseCircleIcon" size={14} />
                  Suspendre
                </button>
              ) : (
                <button className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                  <Icon name="PlayCircleIcon" size={14} />
                  Réactiver
                </button>
              )}
              <button className="py-2 px-3 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-all">
                <Icon name="Trash2Icon" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
