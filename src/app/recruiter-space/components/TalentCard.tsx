'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export interface Talent {
  id: string;
  name: string;
  title: string;
  location: string;
  availability: 'open' | 'passive' | 'unavailable';
  portfolioTemplate: string;
  skills: string[];
  experience: number;
  portfolioViews: number;
  cvDownloads: number;
  lastActive: string;
  avatar: string;
  avatarAlt: string;
  coverImage: string;
  coverAlt: string;
  salary?: string;
  verified: boolean;
  trustScore: number;
  linkedinRecs: number;
  credentials: number;
  bio: string;
  topProject: string;
  topProjectDesc: string;
  portfolioUrl: string;
}

const availabilityConfig = {
  open: { label: 'Disponible', color: 'text-emerald-600', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  passive: { label: 'À l\'écoute', color: 'text-amber-600', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  unavailable: { label: 'Non disponible', color: 'text-red-500', bg: 'bg-red-500/10', dot: 'bg-red-500' },
};

interface TalentCardProps {
  talent: Talent;
  onViewProfile: (talent: Talent) => void;
  onContact: (talent: Talent) => void;
}

export default function TalentCard({ talent, onViewProfile, onContact }: TalentCardProps) {
  const avail = availabilityConfig[talent.availability];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-md hover:border-primary/20 transition-all duration-200 group flex flex-col">
      {/* Cover strip */}
      <div className="relative h-24 overflow-hidden">
        <AppImage
          src={talent.coverImage}
          alt={talent.coverAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        {/* Template badge */}
        <span className="absolute top-2 right-2 text-[10px] font-700 px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
          {talent.portfolioTemplate}
        </span>
        {/* Availability */}
        <span className={`absolute top-2 left-2 flex items-center gap-1 text-[10px] font-700 px-2 py-0.5 rounded-full ${avail.bg} ${avail.color} backdrop-blur-sm`}>
          <span className={`w-1.5 h-1.5 rounded-full ${avail.dot} animate-pulse`} />
          {avail.label}
        </span>
      </div>

      {/* Avatar + name */}
      <div className="px-4 pt-0 pb-3 flex-1 flex flex-col">
        <div className="flex items-end gap-3 -mt-6 mb-3">
          <div className="relative flex-shrink-0">
            <AppImage
              src={talent.avatar}
              alt={talent.avatarAlt}
              className="w-12 h-12 rounded-xl border-2 border-card object-cover shadow-card"
            />
            {talent.verified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Icon name="CheckIcon" size={9} className="text-primary-foreground" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <h3 className="font-700 text-sm text-foreground truncate">{talent.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{talent.title}</p>
          </div>
        </div>

        {/* Location + exp */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="MapPinIcon" size={11} />
            {talent.location}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="BriefcaseIcon" size={11} />
            {talent.experience} ans
          </span>
          {talent.salary && (
            <span className="flex items-center gap-1">
              <Icon name="EuroIcon" size={11} />
              {talent.salary}
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{talent.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {talent.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {skill}
            </span>
          ))}
          {talent.skills.length > 4 && (
            <span className="text-[10px] font-600 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              +{talent.skills.length - 4}
            </span>
          )}
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-muted/50">
          <div className="flex items-center gap-1 text-xs">
            <Icon name="ShieldCheckIcon" size={12} className="text-primary" />
            <span className="font-700 text-foreground">{talent.trustScore}%</span>
            <span className="text-muted-foreground">confiance</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1 text-xs">
            <Icon name="AwardIcon" size={12} className="text-amber-500" />
            <span className="font-700 text-foreground">{talent.credentials}</span>
            <span className="text-muted-foreground">certifs</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1 text-xs">
            <Icon name="LinkedinIcon" size={12} className="text-sky-500" />
            <span className="font-700 text-foreground">{talent.linkedinRecs}</span>
            <span className="text-muted-foreground">recs</span>
          </div>
        </div>

        {/* Portfolio stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Icon name="EyeIcon" size={11} />
            {talent.portfolioViews.toLocaleString()} vues
          </span>
          <span className="flex items-center gap-1">
            <Icon name="DownloadIcon" size={11} />
            {talent.cvDownloads} CV
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Icon name="ClockIcon" size={11} />
            {talent.lastActive}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onViewProfile(talent)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-600 text-foreground hover:bg-muted hover:border-primary/30 transition-all"
          >
            <Icon name="FolderOpenIcon" size={13} />
            Voir portfolio
          </button>
          <button
            onClick={() => onContact(talent)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-600 hover:bg-primary/90 transition-all"
          >
            <Icon name="MessageCircleIcon" size={13} />
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
}
