'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

type CredentialType = 'certification' | 'badge' | 'degree' | 'license' | 'award';
type VerificationStatus = 'verified' | 'pending' | 'expired' | 'unverified';

interface LinkedSource {
  type: 'linkedin' | 'github' | 'issuer' | 'credly' | 'acclaim';
  label: string;
  url: string;
}

interface Credential {
  id: string;
  credential_type: CredentialType;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  verification_status: VerificationStatus;
  credential_url: string | null;
  credential_id: string | null;
  description: string | null;
  skills: string[];
  badge_image_url: string | null;
  display_order: number;
  linked_sources?: LinkedSource[];
  social_profiles?: LinkedSource[];
}

// Static fallback data for when no Supabase data is available
const FALLBACK_CREDENTIALS: Credential[] = [
  {
    id: 'cred-001',
    credential_type: 'certification',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issue_date: '2025-03-15',
    expiry_date: '2028-03-15',
    verification_status: 'verified',
    credential_url: 'https://aws.amazon.com/verification',
    credential_id: 'AWS-SAA-C03-123456',
    description: 'Professional certification for designing distributed systems on AWS.',
    skills: ['AWS', 'Cloud Architecture', 'Infrastructure'],
    badge_image_url: null,
    display_order: 1,
    linked_sources: [
      { type: 'issuer', label: 'Amazon Web Services', url: 'https://aws.amazon.com/verification' },
      { type: 'credly', label: 'Credly Badge', url: 'https://credly.com' },
    ],
    social_profiles: [
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    ],
  },
  {
    id: 'cred-002',
    credential_type: 'certification',
    title: 'Google Professional Cloud Developer',
    issuer: 'Google Cloud',
    issue_date: '2024-11-20',
    expiry_date: '2026-11-20',
    verification_status: 'verified',
    credential_url: 'https://google.com/verify',
    credential_id: 'GCP-PCD-456789',
    description: 'Certification for building scalable applications on Google Cloud Platform.',
    skills: ['GCP', 'Kubernetes', 'Cloud Run'],
    badge_image_url: null,
    display_order: 2,
    linked_sources: [
      { type: 'issuer', label: 'Google Cloud', url: 'https://google.com/verify' },
    ],
    social_profiles: [
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
      { type: 'github', label: 'GitHub', url: 'https://github.com' },
    ],
  },
  {
    id: 'cred-003',
    credential_type: 'badge',
    title: 'Open Source Contributor',
    issuer: 'GitHub',
    issue_date: '2024-06-01',
    expiry_date: null,
    verification_status: 'verified',
    credential_url: 'https://github.com',
    credential_id: null,
    description: 'Recognized contributor with 500+ contributions and 3 featured repositories.',
    skills: ['Open Source', 'TypeScript', 'Node.js'],
    badge_image_url: null,
    display_order: 3,
    linked_sources: [
      { type: 'github', label: 'GitHub Profile', url: 'https://github.com' },
    ],
    social_profiles: [
      { type: 'github', label: 'GitHub', url: 'https://github.com' },
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    ],
  },
  {
    id: 'cred-004',
    credential_type: 'award',
    title: 'Best Developer Tool — Product Hunt',
    issuer: 'Product Hunt',
    issue_date: '2025-01-08',
    expiry_date: null,
    verification_status: 'verified',
    credential_url: 'https://producthunt.com',
    credential_id: null,
    description: '#1 Product of the Day for CLI Forge open source framework.',
    skills: ['Open Source', 'Developer Tools'],
    badge_image_url: null,
    display_order: 5,
    linked_sources: [
      { type: 'issuer', label: 'Product Hunt', url: 'https://producthunt.com' },
    ],
    social_profiles: [
      { type: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    ],
  },
  {
    id: 'cred-005',
    credential_type: 'certification',
    title: 'Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    issue_date: '2023-09-05',
    expiry_date: '2026-09-05',
    verification_status: 'pending',
    credential_url: null,
    credential_id: 'CKA-2023-345678',
    description: 'Certified Kubernetes Administrator — renewal in progress.',
    skills: ['Kubernetes', 'DevOps', 'Container Orchestration'],
    badge_image_url: null,
    display_order: 6,
    linked_sources: [],
    social_profiles: [],
  },
];

const TYPE_CONFIG: Record<CredentialType, { label: string; icon: string; color: string; bg: string }> = {
  certification: { label: 'Certification', icon: 'AwardIcon', color: 'text-amber-700', bg: 'bg-amber-100' },
  badge: { label: 'Badge', icon: 'ShieldCheckIcon', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  degree: { label: 'Diplôme', icon: 'BookOpenIcon', color: 'text-blue-700', bg: 'bg-blue-100' },
  license: { label: 'Licence', icon: 'KeyIcon', color: 'text-purple-700', bg: 'bg-purple-100' },
  award: { label: 'Récompense', icon: 'StarIcon', color: 'text-orange-700', bg: 'bg-orange-100' },
};

const STATUS_CONFIG: Record<VerificationStatus, { label: string; icon: string; color: string; bg: string; border: string }> = {
  verified: { label: 'Vérifié', icon: 'CheckCircleIcon', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  pending: { label: 'En attente', icon: 'ClockIcon', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  expired: { label: 'Expiré', icon: 'XCircleIcon', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  unverified: { label: 'Non vérifié', icon: 'AlertCircleIcon', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
};

const SOURCE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  linkedin: { icon: 'LinkedinIcon', color: 'text-blue-700', bg: 'bg-blue-50 hover:bg-blue-100', label: 'LinkedIn' },
  github: { icon: 'GithubIcon', color: 'text-slate-800', bg: 'bg-slate-100 hover:bg-slate-200', label: 'GitHub' },
  issuer: { icon: 'BuildingIcon', color: 'text-amber-700', bg: 'bg-amber-50 hover:bg-amber-100', label: 'Émetteur' },
  credly: { icon: 'AwardIcon', color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100', label: 'Credly' },
  acclaim: { icon: 'BadgeCheckIcon', color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100', label: 'Acclaim' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

/** Compute a trust strength score 0–100 based on available verification signals */
function computeTrustScore(cred: Credential, effectiveStatus: VerificationStatus): number {
  if (effectiveStatus === 'expired' || effectiveStatus === 'unverified') return 0;
  if (effectiveStatus === 'pending') {
    let base = 20;
    if (cred.credential_id) base += 10;
    if (cred.credential_url) base += 10;
    return Math.min(base, 40);
  }
  // verified
  let score = 40; // base for verified status
  if (cred.credential_id) score += 15;
  if (cred.credential_url) score += 10;
  const sources = cred.linked_sources ?? [];
  const profiles = cred.social_profiles ?? [];
  const hasLinkedIn = [...sources, ...profiles].some((s) => s.type === 'linkedin');
  const hasGitHub = [...sources, ...profiles].some((s) => s.type === 'github');
  const hasIssuer = sources.some((s) => s.type === 'issuer');
  if (hasLinkedIn) score += 10;
  if (hasGitHub) score += 10;
  if (hasIssuer) score += 10;
  if (sources.length >= 2) score += 5;
  return Math.min(score, 100);
}

function getTrustLabel(score: number): { label: string; color: string; barColor: string } {
  if (score >= 85) return { label: 'Très élevée', color: 'text-emerald-700', barColor: 'bg-emerald-500' };
  if (score >= 65) return { label: 'Élevée', color: 'text-teal-700', barColor: 'bg-teal-500' };
  if (score >= 40) return { label: 'Modérée', color: 'text-amber-600', barColor: 'bg-amber-400' };
  if (score > 0) return { label: 'Faible', color: 'text-orange-600', barColor: 'bg-orange-400' };
  return { label: 'Non vérifiée', color: 'text-slate-500', barColor: 'bg-slate-300' };
}

export default function VerifiedCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CredentialType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('credentials')
          .select('*')
          .eq('is_public', true)
          .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) {
          setCredentials(FALLBACK_CREDENTIALS);
        } else {
          setCredentials(data as Credential[]);
        }
      } catch {
        setCredentials(FALLBACK_CREDENTIALS);
      } finally {
        setLoading(false);
      }
    }
    fetchCredentials();
  }, []);

  const filtered = activeFilter === 'all'
    ? credentials
    : credentials.filter((c) => c.credential_type === activeFilter);

  const typeCounts = credentials.reduce<Record<string, number>>((acc, c) => {
    acc[c.credential_type] = (acc[c.credential_type] || 0) + 1;
    return acc;
  }, {});

  const verifiedCount = credentials.filter((c) => c.verification_status === 'verified').length;

  const filterOptions: Array<{ key: CredentialType | 'all'; label: string }> = [
    { key: 'all', label: `Tous (${credentials.length})` },
    ...Object.entries(typeCounts).map(([type, count]) => ({
      key: type as CredentialType,
      label: `${TYPE_CONFIG[type as CredentialType]?.label} (${count})`,
    })),
  ];

  if (loading) {
    return (
      <section id="credentials" className="max-w-4xl mx-auto px-6 py-12 border-t border-amber-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-amber-100 animate-pulse" />
          <div className="h-7 w-48 bg-amber-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-amber-50 rounded-2xl border border-amber-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (credentials.length === 0) return null;

  return (
    <section id="credentials" className="max-w-4xl mx-auto px-6 py-12 border-t border-amber-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-1">Badges & Certifications</h2>
          <p className="text-sm text-amber-600 flex items-center gap-1.5">
            <Icon name="ShieldCheckIcon" size={14} className="text-emerald-600" />
            <span className="text-emerald-700 font-semibold">{verifiedCount}</span>
            <span>credential{verifiedCount > 1 ? 's' : ''} vérifié{verifiedCount > 1 ? 's' : ''}</span>
            {credentials.length > verifiedCount && (
              <span className="text-amber-500">· {credentials.length - verifiedCount} en attente</span>
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      {filterOptions.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveFilter(opt.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === opt.key
                  ? 'bg-amber-900 text-amber-50' :'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Credentials grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cred) => {
          const typeConf = TYPE_CONFIG[cred.credential_type];
          const effectiveStatus = isExpired(cred.expiry_date) ? 'expired' : cred.verification_status;
          const statusConf = STATUS_CONFIG[effectiveStatus];
          const isExpanded = expandedId === cred.id;
          const trustScore = computeTrustScore(cred, effectiveStatus);
          const trustMeta = getTrustLabel(trustScore);
          const linkedSources = cred.linked_sources ?? [];
          const socialProfiles = cred.social_profiles ?? [];
          const allSources = [...linkedSources, ...socialProfiles];
          const isVerified = effectiveStatus === 'verified';

          return (
            <div
              key={cred.id}
              className={`bg-white rounded-2xl border ${statusConf.border} overflow-hidden shadow-sm hover:shadow-md transition-all`}
            >
              {/* Card header */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Type icon */}
                  <div className={`w-10 h-10 rounded-xl ${typeConf.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={typeConf.icon as any} size={18} className={typeConf.color} />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-amber-900 text-sm leading-tight">{cred.title}</h3>
                      {/* Verification badge */}
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${statusConf.bg} ${statusConf.color} border ${statusConf.border}`}
                      >
                        <Icon name={statusConf.icon as any} size={11} />
                        {statusConf.label}
                      </span>
                    </div>

                    <p className="text-xs text-amber-600 font-medium mt-0.5">{cred.issuer}</p>

                    {/* Dates */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-amber-500">
                        <Icon name="CalendarIcon" size={11} />
                        Émis {formatDate(cred.issue_date)}
                      </span>
                      {cred.expiry_date && (
                        <span className={`flex items-center gap-1 text-xs ${isExpired(cred.expiry_date) ? 'text-red-500' : 'text-amber-500'}`}>
                          <Icon name="ClockIcon" size={11} />
                          {isExpired(cred.expiry_date) ? 'Expiré' : 'Expire'} {formatDate(cred.expiry_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── TRUST INDICATOR ── */}
                {isVerified && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                    {/* Badge + score row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 rounded-full">
                          <Icon name="ShieldCheckIcon" size={10} className="text-white" />
                          <span className="text-white text-xs font-bold">Confiance</span>
                        </div>
                        <span className={`text-xs font-semibold ${trustMeta.color}`}>{trustMeta.label}</span>
                      </div>
                      <span className={`text-sm font-extrabold ${trustMeta.color}`}>{trustScore}%</span>
                    </div>

                    {/* Strength bar */}
                    <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${trustMeta.barColor}`}
                        style={{ width: `${trustScore}%` }}
                      />
                    </div>

                    {/* Verification signals */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cred.credential_id && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-emerald-200 rounded-full text-xs text-emerald-700">
                          <Icon name="HashIcon" size={9} />
                          ID vérifié
                        </span>
                      )}
                      {cred.credential_url && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-emerald-200 rounded-full text-xs text-emerald-700">
                          <Icon name="LinkIcon" size={9} />
                          Lien officiel
                        </span>
                      )}
                      {allSources.some((s) => s.type === 'linkedin') && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-blue-200 rounded-full text-xs text-blue-700">
                          <Icon name="LinkedinIcon" size={9} />
                          LinkedIn
                        </span>
                      )}
                      {allSources.some((s) => s.type === 'github') && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded-full text-xs text-slate-700">
                          <Icon name="GithubIcon" size={9} />
                          GitHub
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Credential ID */}
                {cred.credential_id && (
                  <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg">
                    <Icon name="HashIcon" size={11} className="text-amber-400" />
                    <span className="text-xs text-amber-600 font-mono">{cred.credential_id}</span>
                  </div>
                )}

                {/* Skills */}
                {cred.skills && cred.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {cred.skills.slice(0, 4).map((skill) => (
                      <span
                        key={`${cred.id}-${skill}`}
                        className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {cred.skills.length > 4 && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-500 rounded-full text-xs">
                        +{cred.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* ── LINKED SOURCES ── */}
                {linkedSources.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide mb-1.5">Sources liées</p>
                    <div className="flex flex-wrap gap-1.5">
                      {linkedSources.map((src, idx) => {
                        const conf = SOURCE_CONFIG[src.type] ?? SOURCE_CONFIG['issuer'];
                        return (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${conf.bg} ${conf.color}`}
                          >
                            <Icon name={conf.icon as any} size={11} />
                            {src.label}
                            <Icon name="ExternalLinkIcon" size={9} className="opacity-60" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── SOCIAL PROFILES ── */}
                {socialProfiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide mb-1.5">Profils sociaux</p>
                    <div className="flex flex-wrap gap-1.5">
                      {socialProfiles.map((prof, idx) => {
                        const conf = SOURCE_CONFIG[prof.type] ?? SOURCE_CONFIG['issuer'];
                        return (
                          <a
                            key={idx}
                            href={prof.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${conf.bg} ${conf.color}`}
                          >
                            <Icon name={conf.icon as any} size={11} />
                            {prof.label}
                            <Icon name="ExternalLinkIcon" size={9} className="opacity-60" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Expand / actions row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-50">
                  {cred.description ? (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : cred.id)}
                      className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-900 transition-colors font-medium"
                    >
                      <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={13} />
                      {isExpanded ? 'Moins' : 'Détails'}
                    </button>
                  ) : (
                    <span />
                  )}

                  {cred.credential_url && cred.verification_status === 'verified' && (
                    <a
                      href={cred.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
                    >
                      <Icon name="ExternalLinkIcon" size={12} />
                      Vérifier
                    </a>
                  )}
                </div>

                {/* Expanded description */}
                {isExpanded && cred.description && (
                  <p className="mt-2 text-xs text-amber-700 leading-relaxed">{cred.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary strip */}
      <div className="mt-6 flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
        <Icon name="ShieldCheckIcon" size={14} className="text-emerald-600 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Les credentials marqués <span className="font-semibold text-emerald-700">Vérifié</span> sont liés à leur source officielle et peuvent être validés directement auprès de l&apos;organisme émetteur.
        </p>
      </div>
    </section>
  );
}
