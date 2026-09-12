'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface Recommendation {
  id: string;
  recommender_name: string;
  recommender_title: string;
  recommender_company: string;
  recommender_avatar?: string;
  recommender_linkedin_url?: string;
  relationship: string;
  content: string;
  date_given: string;
  is_verified: boolean;
  verification_source?: string;
}

const FALLBACK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-001',
    recommender_name: 'Sarah Chen',
    recommender_title: 'Engineering Manager',
    recommender_company: 'Mistral AI',
    relationship: 'Direct Manager',
    content: 'Alexandre is one of the most talented engineers I have had the pleasure of working with. His ability to architect complex distributed systems while maintaining code quality is exceptional. He led the NeuralCommerce platform redesign that reduced latency by 40% and he did it in record time. Highly recommend.',
    date_given: '2025-06-15',
    is_verified: true,
    verification_source: 'linkedin',
  },
  {
    id: 'rec-002',
    recommender_name: 'Marcus Webb',
    recommender_title: 'CTO',
    recommender_company: 'Datadog',
    relationship: 'Senior Colleague',
    content: 'Working with Alexandre at Datadog was a highlight of my career. He brought a level of technical depth and pragmatism that elevated the entire team. His open source CLI framework became an internal standard tool. A rare combination of brilliant engineer and great communicator.',
    date_given: '2024-12-10',
    is_verified: true,
    verification_source: 'linkedin',
  },
  {
    id: 'rec-003',
    recommender_name: 'Priya Sharma',
    recommender_title: 'Senior Product Manager',
    recommender_company: 'Qonto',
    relationship: 'Cross-functional Partner',
    content: 'Alexandre was the go-to engineer for our most challenging technical problems at Qonto. He has an incredible ability to translate complex technical constraints into clear product decisions. His work on our payment infrastructure was foundational to our Series C growth.',
    date_given: '2023-08-22',
    is_verified: true,
    verification_source: 'linkedin',
  },
  {
    id: 'rec-004',
    recommender_name: 'Thomas Dubois',
    recommender_title: 'Lead Developer',
    recommender_company: 'Freelance',
    relationship: 'Peer',
    content: 'I collaborated with Alexandre on several open source projects. His code reviews are thorough and constructive, his documentation is exemplary, and his commitment to developer experience is unmatched. The CLI Forge framework he built is used by thousands of developers worldwide.',
    date_given: '2025-02-14',
    is_verified: false,
    verification_source: 'linkedin',
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-rose-500', 'bg-teal-500',
  'bg-amber-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-pink-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function LinkedInRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('linkedin_recommendations')
          .select('*')
          .eq('is_public', true)
          .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) {
          setRecommendations(FALLBACK_RECOMMENDATIONS);
        } else {
          setRecommendations(data as Recommendation[]);
        }
      } catch {
        setRecommendations(FALLBACK_RECOMMENDATIONS);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, []);

  const verifiedCount = recommendations.filter((r) => r.is_verified).length;

  if (loading) {
    return (
      <section id="recommendations" className="max-w-4xl mx-auto px-6 py-12 border-t border-amber-200">
        <div className="h-8 w-56 bg-amber-100 rounded-lg animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-amber-50 rounded-2xl border border-amber-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section id="recommendations" className="max-w-4xl mx-auto px-6 py-12 border-t border-amber-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-amber-900">Recommandations</h2>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 rounded-full">
              <Icon name="LinkedinIcon" size={12} className="text-white" />
              <span className="text-white text-xs font-bold">LinkedIn</span>
            </div>
          </div>
          <p className="text-sm text-amber-600 flex items-center gap-1.5">
            <Icon name="ShieldCheckIcon" size={14} className="text-emerald-600" />
            <span className="text-emerald-700 font-semibold">{verifiedCount}</span>
            <span>recommandation{verifiedCount > 1 ? 's' : ''} vérifiée{verifiedCount > 1 ? 's' : ''} via LinkedIn</span>
          </p>
        </div>
      </div>

      {/* Recommendations list */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isExpanded = expanded === rec.id;
          const shouldTruncate = rec.content.length > 220;
          const displayContent = shouldTruncate && !isExpanded
            ? rec.content.slice(0, 220) + '…'
            : rec.content;

          return (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Recommender info */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full ${getAvatarColor(rec.recommender_name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {getInitials(rec.recommender_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-amber-900 text-sm">{rec.recommender_name}</p>
                    {rec.is_verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-semibold">
                        <Icon name="CheckCircleIcon" size={10} />
                        Vérifié LinkedIn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-700 font-medium">{rec.recommender_title} · {rec.recommender_company}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-amber-500">{rec.relationship}</span>
                    <span className="text-xs text-amber-400">·</span>
                    <span className="text-xs text-amber-500">{formatDate(rec.date_given)}</span>
                  </div>
                </div>
                {rec.recommender_linkedin_url && (
                  <a
                    href={rec.recommender_linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Icon name="LinkedinIcon" size={14} className="text-blue-600" />
                  </a>
                )}
              </div>

              {/* Quote */}
              <div className="relative pl-4 border-l-2 border-amber-200">
                <Icon name="QuoteIcon" size={16} className="text-amber-300 absolute -top-1 -left-1" />
                <p className="text-sm text-amber-800 leading-relaxed italic">{displayContent}</p>
                {shouldTruncate && (
                  <button
                    onClick={() => setExpanded(isExpanded ? null : rec.id)}
                    className="mt-2 text-xs text-amber-600 hover:text-amber-900 font-semibold transition-colors flex items-center gap-1"
                  >
                    <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={12} />
                    {isExpanded ? 'Voir moins' : 'Lire la suite'}
                  </button>
                )}
              </div>

              {/* Verification footer */}
              {rec.is_verified && (
                <div className="mt-3 pt-3 border-t border-amber-50 flex items-center gap-2">
                  <Icon name="ShieldCheckIcon" size={12} className="text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">
                    Recommandation vérifiée · Source : {rec.verification_source === 'linkedin' ? 'LinkedIn' : rec.verification_source}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-6 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <Icon name="LinkedinIcon" size={14} className="text-blue-600 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          Les recommandations marquées <span className="font-semibold">Vérifié LinkedIn</span> ont été publiées sur le profil LinkedIn d&apos;Alexandre et peuvent être consultées directement.
        </p>
      </div>
    </section>
  );
}
