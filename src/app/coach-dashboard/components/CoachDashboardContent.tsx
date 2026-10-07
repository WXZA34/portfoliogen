'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import RecruiterInbox from './RecruiterInbox';

// ─── Types ───────────────────────────────────────────────────────────────────

type AnnotationType = 'comment' | 'suggestion' | 'approval' | 'flag';
type SectionType = 'cvtheque' | 'portfolio';
type ReviewStatus = 'pending' | 'in_review' | 'approved' | 'needs_work';

interface Reviewer {
  id: string;
  name: string;
  role: 'mentor' | 'peer';
  avatar: string;
  color: string;
}

interface Annotation {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'mentor' | 'peer';
  sectionId: string;
  type: AnnotationType;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  reviewerId: string;
  reviewerName: string;
  content: string;
  timestamp: string;
}

interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  icon: string;
  status: ReviewStatus;
  annotationCount: number;
  lastUpdated: string;
}

// ─── Static section definitions (UI structure) ───────────────────────────────

const DEFAULT_SECTIONS: Omit<CVSection, 'id' | 'status' | 'annotationCount' | 'lastUpdated'>[] = [
  { type: 'cvtheque', title: 'Projets phares', subtitle: '12 projets · 4 publiés', icon: 'FolderIcon' },
  { type: 'cvtheque', title: 'Matrice de compétences', subtitle: '34 compétences', icon: 'BrainIcon' },
  { type: 'cvtheque', title: 'Parcours & Formations', subtitle: '8 entrées', icon: 'GraduationCapIcon' },
  { type: 'portfolio', title: 'Portfolio Dev Full-Stack', subtitle: 'Accroche · Projets · Contact', icon: 'PaletteIcon' },
  { type: 'portfolio', title: 'Portfolio Ingénieur IA', subtitle: 'Accroche · Compétences · Médias', icon: 'BrainCircuitIcon' },
  { type: 'cvtheque', title: 'Galerie médias', subtitle: '47 fichiers', icon: 'ImageIcon' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusConfig: Record<ReviewStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'En attente', color: 'text-muted-foreground', bg: 'bg-muted', dot: 'bg-muted-foreground' },
  in_review: { label: 'En révision', color: 'text-amber-600', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  approved: { label: 'Approuvé', color: 'text-emerald-600', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  needs_work: { label: 'À améliorer', color: 'text-red-600', bg: 'bg-red-500/10', dot: 'bg-red-500' },
};

const annotationTypeConfig: Record<AnnotationType, { icon: string; color: string; bg: string; label: string }> = {
  comment: { icon: 'MessageCircleIcon', color: 'text-sky-600', bg: 'bg-sky-500/10', label: 'Commentaire' },
  suggestion: { icon: 'LightbulbIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', label: 'Suggestion' },
  approval: { icon: 'ThumbsUpIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', label: 'Approbation' },
  flag: { icon: 'FlagIcon', color: 'text-red-600', bg: 'bg-red-500/10', label: 'Signalement' },
};

const REVIEWER_COLORS = [
  'bg-violet-500', 'bg-sky-500', 'bg-rose-500', 'bg-amber-500',
  'bg-emerald-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
];

function getReviewerColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return REVIEWER_COLORS[Math.abs(hash) % REVIEWER_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'à l\'instant';
  if (diffMins < 60) return `il y a ${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'hier';
  return `il y a ${diffDays}j`;
}

function ReviewerAvatar({ name, id, size = 'sm' }: { name: string; id: string; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={`${sz} rounded-full ${getReviewerColor(id)} flex items-center justify-center text-white font-700 flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

// ─── Real-time indicator ──────────────────────────────────────────────────────

function RealtimeDot({ connected }: { connected: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
      {connected ? 'Temps réel actif' : 'Connexion...'}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CoachDashboardContent() {
  const { user } = useAuth();
  const supabase = createClient();

  // ── State ──
  const [sections, setSections] = useState<CVSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<CVSection | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeFilter, setActiveFilter] = useState<AnnotationType | 'all'>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newCommentType, setNewCommentType] = useState<AnnotationType>('comment');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'annotations' | 'overview'>('annotations');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState('');
  const [activeReviewers, setActiveReviewers] = useState<Reviewer[]>([]);

  const sessionIdRef = useRef<string | null>(null);

  // ── Helpers ──
  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/coach-dashboard?token=${shareToken}`;

  // ── Load or create session + sections ──
  const initSession = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Find existing session for this user
      let { data: session, error: sessionErr } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (sessionErr && sessionErr.code !== 'PGRST116') {
        console.log('Session fetch error:', sessionErr.message);
      }

      // Create session if none exists
      if (!session) {
        const { data: newSession, error: createErr } = await supabase
          .from('coach_sessions')
          .insert({ owner_id: user.id, title: 'Dashboard Coach' })
          .select()
          .single();
        if (createErr) {
          console.log('Session create error:', createErr.message);
          setLoading(false);
          return;
        }
        session = newSession;
      }

      setSessionId(session.id);
      sessionIdRef.current = session.id;
      setShareToken(session.share_token || '');

      // Load sections
      const { data: dbSections, error: sectionsErr } = await supabase
        .from('coach_sections')
        .select('*')
        .eq('session_id', session.id)
        .order('sort_order');

      if (sectionsErr) console.log('Sections fetch error:', sectionsErr.message);

      let resolvedSections: CVSection[] = [];

      if (!dbSections || dbSections.length === 0) {
        // Seed default sections
        const toInsert = DEFAULT_SECTIONS.map((s, i) => ({
          session_id: session!.id,
          section_key: `section_${i}`,
          title: s.title,
          subtitle: s.subtitle,
          icon: s.icon,
          section_type: s.type,
          review_status: 'pending' as ReviewStatus,
          sort_order: i,
        }));
        const { data: inserted, error: insertErr } = await supabase
          .from('coach_sections')
          .insert(toInsert)
          .select();
        if (insertErr) console.log('Sections insert error:', insertErr.message);
        resolvedSections = (inserted || []).map((s: any) => ({
          id: s.id,
          type: s.section_type as SectionType,
          title: s.title,
          subtitle: s.subtitle || '',
          icon: s.icon || 'FolderIcon',
          status: s.review_status as ReviewStatus,
          annotationCount: 0,
          lastUpdated: formatTimestamp(s.updated_at),
        }));
      } else {
        resolvedSections = dbSections.map((s: any) => ({
          id: s.id,
          type: s.section_type as SectionType,
          title: s.title,
          subtitle: s.subtitle || '',
          icon: s.icon || 'FolderIcon',
          status: s.review_status as ReviewStatus,
          annotationCount: 0,
          lastUpdated: formatTimestamp(s.updated_at),
        }));
      }

      setSections(resolvedSections);
      if (resolvedSections.length > 0) setSelectedSection(resolvedSections[0]);

      // Load annotations
      await loadAnnotations(session.id, resolvedSections);
    } catch (err: any) {
      console.log('Init error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadAnnotations = async (sid: string, secs: CVSection[]) => {
    const { data: anns, error: annsErr } = await supabase
      .from('coach_annotations')
      .select('*, coach_replies(*)')
      .eq('session_id', sid)
      .order('created_at', { ascending: false });

    if (annsErr) { console.log('Annotations fetch error:', annsErr.message); return; }

    const mapped: Annotation[] = (anns || []).map((a: any) => ({
      id: a.id,
      reviewerId: a.reviewer_id,
      reviewerName: a.reviewer_name,
      reviewerRole: a.reviewer_role as 'mentor' | 'peer',
      sectionId: a.section_id,
      type: a.annotation_type as AnnotationType,
      content: a.content,
      timestamp: formatTimestamp(a.created_at),
      resolved: a.resolved,
      replies: (a.coach_replies || []).map((r: any) => ({
        id: r.id,
        reviewerId: r.reviewer_id,
        reviewerName: r.reviewer_name,
        content: r.content,
        timestamp: formatTimestamp(r.created_at),
      })),
    }));

    setAnnotations(mapped);

    // Update annotation counts on sections
    setSections((prev) => prev.map((s) => ({
      ...s,
      annotationCount: mapped.filter((a) => a.sectionId === s.id && !a.resolved).length,
    })));

    // Build active reviewers list from annotations
    const reviewerMap = new Map<string, Reviewer>();
    mapped.forEach((a) => {
      if (!reviewerMap.has(a.reviewerId)) {
        reviewerMap.set(a.reviewerId, {
          id: a.reviewerId,
          name: a.reviewerName,
          role: a.reviewerRole,
          avatar: getInitials(a.reviewerName),
          color: getReviewerColor(a.reviewerId),
        });
      }
    });
    setActiveReviewers(Array.from(reviewerMap.values()));
  };

  // ── Real-time subscriptions ──
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`coach_dashboard_${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'coach_annotations', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const a = payload.new as any;
          const newAnnotation: Annotation = {
            id: a.id,
            reviewerId: a.reviewer_id,
            reviewerName: a.reviewer_name,
            reviewerRole: a.reviewer_role,
            sectionId: a.section_id,
            type: a.annotation_type,
            content: a.content,
            timestamp: formatTimestamp(a.created_at),
            resolved: a.resolved,
            replies: [],
          };
          setAnnotations((prev) => {
            if (prev.find((x) => x.id === newAnnotation.id)) return prev;
            return [newAnnotation, ...prev];
          });
          setSections((prev) => prev.map((s) =>
            s.id === a.section_id ? { ...s, annotationCount: s.annotationCount + 1 } : s
          ));
          // Add reviewer if new
          setActiveReviewers((prev) => {
            if (prev.find((r) => r.id === a.reviewer_id)) return prev;
            return [...prev, {
              id: a.reviewer_id,
              name: a.reviewer_name,
              role: a.reviewer_role,
              avatar: getInitials(a.reviewer_name),
              color: getReviewerColor(a.reviewer_id),
            }];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'coach_annotations', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const a = payload.new as any;
          setAnnotations((prev) => prev.map((ann) =>
            ann.id === a.id
              ? { ...ann, resolved: a.resolved, content: a.content, timestamp: formatTimestamp(a.updated_at) }
              : ann
          ));
          // Update annotation counts
          setSections((prev) => prev.map((s) => {
            if (s.id !== a.section_id) return s;
            return {
              ...s,
              annotationCount: prev.filter((ann) => ann.sectionId === s.id && !ann.resolved).length,
            };
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'coach_annotations' },
        (payload) => {
          const old = payload.old as any;
          setAnnotations((prev) => prev.filter((a) => a.id !== old.id));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'coach_replies' },
        (payload) => {
          const r = payload.new as any;
          const newReply: Reply = {
            id: r.id,
            reviewerId: r.reviewer_id,
            reviewerName: r.reviewer_name,
            content: r.content,
            timestamp: formatTimestamp(r.created_at),
          };
          setAnnotations((prev) => prev.map((ann) =>
            ann.id === r.annotation_id
              ? { ...ann, replies: ann.replies.find((x) => x.id === r.id) ? ann.replies : [...ann.replies, newReply] }
              : ann
          ));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'coach_sections', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const s = payload.new as any;
          setSections((prev) => prev.map((sec) =>
            sec.id === s.id ? { ...sec, status: s.review_status, lastUpdated: formatTimestamp(s.updated_at) } : sec
          ));
          setSelectedSection((prev) =>
            prev?.id === s.id ? { ...prev, status: s.review_status } : prev
          );
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // ── Derived state ──
  const sectionAnnotations = annotations.filter(
    (a) => a.sectionId === selectedSection?.id &&
      (activeFilter === 'all' || a.type === activeFilter) &&
      (showResolved || !a.resolved)
  );

  const totalOpen = annotations.filter((a) => !a.resolved).length;
  const totalApproved = sections.filter((s) => s.status === 'approved').length;
  const totalNeedsWork = sections.filter((s) => s.status === 'needs_work').length;

  // ── Actions ──
  const handleAddAnnotation = async () => {
    if (!newComment.trim() || !selectedSection || !sessionId || !user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('coach_annotations').insert({
        session_id: sessionId,
        section_id: selectedSection.id,
        reviewer_id: user.id,
        reviewer_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Moi',
        reviewer_role: 'peer',
        annotation_type: newCommentType,
        content: newComment.trim(),
        resolved: false,
      });
      if (error) console.log('Add annotation error:', error.message);
      else setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    const ann = annotations.find((a) => a.id === id);
    if (!ann) return;
    const { error } = await supabase
      .from('coach_annotations')
      .update({ resolved: !ann.resolved })
      .eq('id', id);
    if (error) console.log('Resolve error:', error.message);
  };

  const handleReply = async (annotationId: string) => {
    if (!replyText.trim() || !user) return;
    const { error } = await supabase.from('coach_replies').insert({
      annotation_id: annotationId,
      reviewer_id: user.id,
      reviewer_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Moi',
      content: replyText.trim(),
    });
    if (error) console.log('Reply error:', error.message);
    else {
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleStatusChange = async (sectionId: string, newStatus: ReviewStatus) => {
    const { error } = await supabase
      .from('coach_sections')
      .update({ review_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', sectionId);
    if (error) console.log('Status update error:', error.message);
    else {
      setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, status: newStatus } : s));
      setSelectedSection((prev) => prev?.id === sectionId ? { ...prev, status: newStatus } : prev);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Chargement du dashboard coach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-700 text-foreground">Dashboard Coach</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Annotations collaboratives · Feedback mentors & pairs · Optimisation avant soumission
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RealtimeDot connected={realtimeConnected} />
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all btn-press shadow-sm"
          >
            <Icon name="Share2Icon" size={16} />
            Partager le dashboard
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Annotations ouvertes', value: totalOpen, icon: 'MessageSquareIcon', color: 'text-amber-600', bg: 'bg-amber-500/10' },
          { label: 'Sections approuvées', value: totalApproved, icon: 'CheckCircleIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'À améliorer', value: totalNeedsWork, icon: 'AlertCircleIcon', color: 'text-red-600', bg: 'bg-red-500/10' },
          { label: 'Reviewers actifs', value: activeReviewers.length, icon: 'UsersIcon', color: 'text-violet-600', bg: 'bg-violet-500/10' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={kpi.icon as any} size={18} className={kpi.color} />
            </div>
            <div>
              <p className="text-2xl font-700 text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reviewers Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-600 text-foreground">Reviewers :</span>
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {activeReviewers.length === 0 ? (
            <span className="text-sm text-muted-foreground">Aucun reviewer actif — partagez le lien pour inviter des mentors ou pairs</span>
          ) : (
            activeReviewers.map((r) => (
              <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                <ReviewerAvatar name={r.name} id={r.id} size="sm" />
                <span className="text-sm font-500 text-foreground">{r.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-600 ${r.role === 'mentor' ? 'bg-violet-500/10 text-violet-600' : 'bg-sky-500/10 text-sky-600'}`}>
                  {r.role === 'mentor' ? 'Mentor' : 'Pair'}
                </span>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setShareModalOpen(true)}
          className="flex items-center gap-1.5 text-sm text-primary font-600 hover:opacity-80 transition-opacity"
        >
          <Icon name="UserPlusIcon" size={15} />
          Inviter
        </button>
      </div>

      {/* Main Layout: Sections List + Annotations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">

        {/* Left: Sections List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-700 text-foreground">Sections à réviser</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{sections.length} sections · {totalOpen} annotations ouvertes</p>
          </div>
          <div className="divide-y divide-border">
            {sections.map((section) => {
              const st = statusConfig[section.status];
              const isSelected = selectedSection?.id === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  className={`w-full text-left p-4 transition-all hover:bg-muted/50 ${isSelected ? 'bg-secondary' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon name={section.icon as any} size={15} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-600 text-foreground truncate">{section.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-600 flex-shrink-0 ${section.type === 'portfolio' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {section.type === 'portfolio' ? 'Portfolio' : 'CVthèque'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-600 px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                        {section.annotationCount > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="MessageSquareIcon" size={11} />
                            {section.annotationCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Annotations Panel */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          {selectedSection ? (
            <>
              {/* Section Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon name={selectedSection.icon as any} size={18} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-700 text-foreground">{selectedSection.title}</h2>
                      <p className="text-xs text-muted-foreground">{selectedSection.subtitle} · Mis à jour {selectedSection.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedSection.status}
                      onChange={(e) => handleStatusChange(selectedSection.id, e.target.value as ReviewStatus)}
                      className="text-xs font-600 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground cursor-pointer"
                    >
                      {Object.entries(statusConfig).map(([key, cfg]) => (
                        <option key={key} value={key}>{cfg.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-3">
                  {([
                    { key: 'annotations', label: 'Annotations', icon: 'MessageSquareIcon' },
                    { key: 'overview', label: 'Vue d\'ensemble', icon: 'LayoutIcon' },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                        activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon as any} size={13} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'annotations' && (
                <>
                  {/* Filters */}
                  <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-wrap">
                    <div className="flex gap-1 flex-wrap flex-1">
                      {(['all', 'comment', 'suggestion', 'approval', 'flag'] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-600 transition-all ${
                            activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {f === 'all' ? 'Tous' : annotationTypeConfig[f].label}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showResolved}
                        onChange={(e) => setShowResolved(e.target.checked)}
                        className="rounded"
                      />
                      Résolus
                    </label>
                  </div>

                  {/* Annotations List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '420px' }}>
                    {sectionAnnotations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                          <Icon name="MessageSquareIcon" size={22} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm font-600 text-foreground">Aucune annotation</p>
                        <p className="text-xs text-muted-foreground mt-1">Soyez le premier à commenter cette section</p>
                      </div>
                    ) : (
                      sectionAnnotations.map((annotation) => {
                        const typeConfig = annotationTypeConfig[annotation.type];
                        return (
                          <div
                            key={annotation.id}
                            className={`rounded-xl border p-4 transition-all ${annotation.resolved ? 'opacity-50 border-border bg-muted/30' : 'border-border bg-card'}`}
                          >
                            {/* Annotation Header */}
                            <div className="flex items-start gap-3">
                              <ReviewerAvatar name={annotation.reviewerName} id={annotation.reviewerId} size="md" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-700 text-foreground">{annotation.reviewerName}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-600 ${annotation.reviewerRole === 'mentor' ? 'bg-violet-500/10 text-violet-600' : 'bg-sky-500/10 text-sky-600'}`}>
                                    {annotation.reviewerRole === 'mentor' ? 'Mentor' : 'Pair'}
                                  </span>
                                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-600 ${typeConfig.bg} ${typeConfig.color}`}>
                                    <Icon name={typeConfig.icon as any} size={11} />
                                    {typeConfig.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-auto">{annotation.timestamp}</span>
                                </div>
                                <p className="text-sm text-foreground mt-2 leading-relaxed">{annotation.content}</p>
                              </div>
                            </div>

                            {/* Replies */}
                            {annotation.replies.length > 0 && (
                              <div className="mt-3 ml-12 space-y-2 border-l-2 border-border pl-3">
                                {annotation.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start gap-2">
                                    <ReviewerAvatar name={reply.reviewerName} id={reply.reviewerId} size="sm" />
                                    <div className="flex-1 bg-muted rounded-lg px-3 py-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-700 text-foreground">{reply.reviewerName}</span>
                                        <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                      </div>
                                      <p className="text-xs text-foreground">{reply.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3 ml-12">
                              <button
                                onClick={() => setReplyingTo(replyingTo === annotation.id ? null : annotation.id)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-500"
                              >
                                <Icon name="CornerDownRightIcon" size={12} />
                                Répondre
                              </button>
                              <button
                                onClick={() => handleResolve(annotation.id)}
                                className={`flex items-center gap-1 text-xs font-500 transition-colors ${annotation.resolved ? 'text-muted-foreground hover:text-foreground' : 'text-emerald-600 hover:text-emerald-700'}`}
                              >
                                <Icon name={annotation.resolved ? 'RotateCcwIcon' : 'CheckIcon'} size={12} />
                                {annotation.resolved ? 'Rouvrir' : 'Résoudre'}
                              </button>
                            </div>

                            {/* Reply Input */}
                            {replyingTo === annotation.id && (
                              <div className="mt-3 ml-12 flex gap-2">
                                <input
                                  type="text"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleReply(annotation.id)}
                                  placeholder="Votre réponse..."
                                  className="flex-1 text-xs px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button
                                  onClick={() => handleReply(annotation.id)}
                                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-600 hover:opacity-90 transition-opacity"
                                >
                                  <Icon name="SendIcon" size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Annotation */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {(['comment', 'suggestion', 'approval', 'flag'] as const).map((type) => {
                        const cfg = annotationTypeConfig[type];
                        return (
                          <button
                            key={type}
                            onClick={() => setNewCommentType(type)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-600 transition-all border ${
                              newCommentType === type ? `${cfg.bg} ${cfg.color} border-transparent` : 'border-border text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Icon name={cfg.icon as any} size={12} />
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      {user && <ReviewerAvatar name={user.user_metadata?.full_name || user.email || 'Moi'} id={user.id} size="sm" />}
                      <div className="flex-1 flex gap-2">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddAnnotation();
                          }}
                          placeholder="Ajouter une annotation... (Ctrl+Entrée pour envoyer)"
                          rows={2}
                          className="flex-1 text-sm px-3 py-2 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                        <button
                          onClick={handleAddAnnotation}
                          disabled={!newComment.trim() || submitting}
                          className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-opacity disabled:opacity-40 self-end"
                        >
                          {submitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Icon name="SendIcon" size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'overview' && (
                <div className="p-4 space-y-4">
                  {/* Progress Overview */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h3 className="text-sm font-700 text-foreground mb-3">Progression de la révision</h3>
                    <div className="space-y-2">
                      {sections.map((section) => {
                        const st = statusConfig[section.status];
                        const sectionAnns = annotations.filter((a) => a.sectionId === section.id);
                        const resolved = sectionAnns.filter((a) => a.resolved).length;
                        const total = sectionAnns.length;
                        const pct = total > 0 ? Math.round((resolved / total) * 100) : section.status === 'approved' ? 100 : 0;
                        return (
                          <div key={section.id} className="flex items-center gap-3">
                            <button
                              onClick={() => { setSelectedSection(section); setActiveTab('annotations'); }}
                              className="text-xs font-500 text-foreground hover:text-primary transition-colors w-40 text-left truncate"
                            >
                              {section.title}
                            </button>
                            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${section.status === 'approved' ? 'bg-emerald-500' : section.status === 'needs_work' ? 'bg-red-500' : 'bg-amber-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${st.bg} ${st.color} w-24 text-center`}>{st.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviewer Activity */}
                  <div>
                    <h3 className="text-sm font-700 text-foreground mb-3">Activité des reviewers</h3>
                    {activeReviewers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun reviewer actif pour l'instant.</p>
                    ) : (
                      <div className="space-y-2">
                        {activeReviewers.map((reviewer) => {
                          const count = annotations.filter((a) => a.reviewerId === reviewer.id).length;
                          return (
                            <div key={reviewer.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                              <ReviewerAvatar name={reviewer.name} id={reviewer.id} size="md" />
                              <div className="flex-1">
                                <p className="text-sm font-600 text-foreground">{reviewer.name}</p>
                                <p className="text-xs text-muted-foreground">{count} annotation{count > 1 ? 's' : ''}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-600 ${reviewer.role === 'mentor' ? 'bg-violet-500/10 text-violet-600' : 'bg-sky-500/10 text-sky-600'}`}>
                                {reviewer.role === 'mentor' ? 'Mentor' : 'Pair'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-center">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="MousePointerClickIcon" size={24} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-600 text-foreground">Sélectionnez une section</p>
                <p className="text-xs text-muted-foreground mt-1">Cliquez sur une section pour voir ses annotations</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-modal w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-700 text-foreground">Partager le dashboard coach</h2>
              <button onClick={() => setShareModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Icon name="XIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Partagez ce lien avec vos mentors ou pairs pour qu'ils puissent annoter vos sections et laisser des commentaires en temps réel.
            </p>

            {/* Link Copy */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 text-xs px-3 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-600 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
              >
                <Icon name={copied ? 'CheckIcon' : 'CopyIcon'} size={13} />
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>

            {/* Real-time indicator in modal */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Icon name="ZapIcon" size={14} className="text-emerald-600" />
              <p className="text-xs text-emerald-700 font-600">Temps réel activé — les annotations apparaissent instantanément pour tous les reviewers</p>
            </div>

            {/* Invite by Role */}
            <div className="space-y-2 mb-4">
              <p className="text-xs font-600 text-foreground">Inviter par rôle :</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="GraduationCapIcon" size={14} className="text-violet-600" />
                    <span className="text-xs font-700 text-violet-600">Mentor</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Accès complet — annotations, suggestions, approbations</p>
                </div>
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="UsersIcon" size={14} className="text-sky-600" />
                    <span className="text-xs font-700 text-sky-600">Pair</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Commentaires et suggestions uniquement</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShareModalOpen(false)}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-opacity"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Recruiter Inbox */}
      <RecruiterInbox />
    </div>
  );
}
