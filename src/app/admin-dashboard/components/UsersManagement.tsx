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
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sophie Martin', email: 'sophie.martin@email.com', role: 'candidate', status: 'active', joinedAt: '12 Jan 2026', portfolios: 3, lastActive: 'il y a 2h', verified: true },
  { id: 'u2', name: 'Thomas Dubois', email: 'thomas.d@email.com', role: 'candidate', status: 'active', joinedAt: '5 Fév 2026', portfolios: 1, lastActive: 'il y a 1j', verified: true },
  { id: 'u3', name: 'Accenture France', email: 'rh@accenture.fr', role: 'recruiter', status: 'active', joinedAt: '20 Mar 2026', jobOffers: 8, lastActive: 'il y a 30 min', verified: true },
  { id: 'u4', name: 'Lucas Bernard', email: 'lucas.b@email.com', role: 'candidate', status: 'suspended', joinedAt: '3 Avr 2026', portfolios: 2, lastActive: 'il y a 5j', verified: false },
  { id: 'u5', name: 'Capgemini RH', email: 'recrutement@capgemini.com', role: 'recruiter', status: 'active', joinedAt: '15 Avr 2026', jobOffers: 12, lastActive: 'il y a 4h', verified: true },
  { id: 'u6', name: 'Emma Lefebvre', email: 'emma.l@email.com', role: 'candidate', status: 'pending', joinedAt: '2 Oct 2026', portfolios: 0, lastActive: 'jamais', verified: false },
  { id: 'u7', name: 'BNP Paribas RH', email: 'talent@bnpparibas.com', role: 'recruiter', status: 'pending', joinedAt: '5 Oct 2026', jobOffers: 0, lastActive: 'jamais', verified: false },
  { id: 'u8', name: 'Antoine Moreau', email: 'antoine.m@email.com', role: 'candidate', status: 'active', joinedAt: '18 Sep 2026', portfolios: 4, lastActive: 'il y a 1h', verified: true },
];

const STATUS_CONFIG: Record<UserStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Actif', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  suspended: { label: 'Suspendu', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-500/10' },
};

export default function UsersManagement() {
  const [filter, setFilter] = useState<UserType>('all');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total utilisateurs', value: MOCK_USERS.length, icon: 'UsersIcon', color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { label: 'Candidats', value: counts.candidate, icon: 'UserIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Recruteurs', value: counts.recruiter, icon: 'BuildingIcon', color: 'text-violet-600', bg: 'bg-violet-500/10' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <Icon name={s.icon as any} size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-800 text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
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
          <div className="relative">
            <Icon name="SearchIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 w-64"
            />
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Utilisateur</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Rôle</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Statut</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Contenu</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Dernière activité</th>
                <th className="text-left px-5 py-3 text-xs font-700 text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const statusCfg = STATUS_CONFIG[user.status];
                return (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-700 flex-shrink-0 ${user.role === 'recruiter' ? 'bg-violet-600' : 'bg-blue-600'}`}>
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
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${user.role === 'recruiter' ? 'bg-violet-500/10 text-violet-600' : 'bg-blue-500/10 text-blue-600'}`}>
                        <Icon name={user.role === 'recruiter' ? 'BuildingIcon' : 'UserIcon'} size={11} />
                        {user.role === 'recruiter' ? 'Recruteur' : 'Candidat'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${statusCfg.bg} ${statusCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'suspended' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-foreground">
                        {user.role === 'candidate' ? `${user.portfolios} portfolio${(user.portfolios ?? 0) > 1 ? 's' : ''}` : `${user.jobOffers} offre${(user.jobOffers ?? 0) > 1 ? 's' : ''}`}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                      <p className="text-[10px] text-muted-foreground/60">Inscrit le {user.joinedAt}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedUser(user)}
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
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-700 text-foreground">Profil utilisateur</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-800 ${selectedUser.role === 'recruiter' ? 'bg-violet-600' : 'bg-blue-600'}`}>
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-700 text-foreground text-lg">{selectedUser.name}</p>
                  {selectedUser.verified && <Icon name="BadgeCheckIcon" size={16} className="text-blue-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-600 mt-1 ${STATUS_CONFIG[selectedUser.status].bg} ${STATUS_CONFIG[selectedUser.status].color}`}>
                  {STATUS_CONFIG[selectedUser.status].label}
                </span>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">Rôle</span>
                <span className="text-xs font-600 text-foreground">{selectedUser.role === 'recruiter' ? 'Recruteur' : 'Candidat'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">Inscrit le</span>
                <span className="text-xs font-600 text-foreground">{selectedUser.joinedAt}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">Dernière activité</span>
                <span className="text-xs font-600 text-foreground">{selectedUser.lastActive}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-xs text-muted-foreground">{selectedUser.role === 'candidate' ? 'Portfolios' : 'Offres d\'emploi'}</span>
                <span className="text-xs font-600 text-foreground">{selectedUser.role === 'candidate' ? selectedUser.portfolios : selectedUser.jobOffers}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-muted text-sm font-600 text-foreground hover:bg-border transition-all">
                Envoyer un message
              </button>
              {selectedUser.status === 'active' ? (
                <button className="flex-1 py-2 rounded-xl bg-amber-500/10 text-sm font-600 text-amber-600 hover:bg-amber-500/20 transition-all">
                  Suspendre
                </button>
              ) : (
                <button className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-sm font-600 text-emerald-600 hover:bg-emerald-500/20 transition-all">
                  Réactiver
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
