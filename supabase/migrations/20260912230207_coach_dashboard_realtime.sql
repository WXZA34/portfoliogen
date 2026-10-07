-- ─── Coach Dashboard: Annotations & Replies ──────────────────────────────────

-- 1. Types
DROP TYPE IF EXISTS public.annotation_type CASCADE;
CREATE TYPE public.annotation_type AS ENUM ('comment', 'suggestion', 'approval', 'flag');

DROP TYPE IF EXISTS public.review_status CASCADE;
CREATE TYPE public.review_status AS ENUM ('pending', 'in_review', 'approved', 'needs_work');

DROP TYPE IF EXISTS public.reviewer_role CASCADE;
CREATE TYPE public.reviewer_role AS ENUM ('mentor', 'peer');

-- 2. Tables

CREATE TABLE IF NOT EXISTS public.coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Dashboard Coach',
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.coach_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.coach_sessions(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  icon TEXT,
  section_type TEXT NOT NULL DEFAULT 'cvtheque',
  review_status public.review_status NOT NULL DEFAULT 'pending',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.coach_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.coach_sessions(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.coach_sections(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_role public.reviewer_role NOT NULL DEFAULT 'peer',
  annotation_type public.annotation_type NOT NULL DEFAULT 'comment',
  content TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.coach_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annotation_id UUID NOT NULL REFERENCES public.coach_annotations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_coach_sessions_owner_id ON public.coach_sessions(owner_id);
CREATE INDEX IF NOT EXISTS idx_coach_sessions_share_token ON public.coach_sessions(share_token);
CREATE INDEX IF NOT EXISTS idx_coach_sections_session_id ON public.coach_sections(session_id);
CREATE INDEX IF NOT EXISTS idx_coach_annotations_session_id ON public.coach_annotations(session_id);
CREATE INDEX IF NOT EXISTS idx_coach_annotations_section_id ON public.coach_annotations(section_id);
CREATE INDEX IF NOT EXISTS idx_coach_annotations_reviewer_id ON public.coach_annotations(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_coach_replies_annotation_id ON public.coach_replies(annotation_id);

-- 4. Enable RLS
ALTER TABLE public.coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_replies ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- coach_sessions: owner manages, authenticated users can read (for shared dashboards)
DROP POLICY IF EXISTS "coach_sessions_owner_all" ON public.coach_sessions;
CREATE POLICY "coach_sessions_owner_all"
ON public.coach_sessions FOR ALL TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "coach_sessions_authenticated_read" ON public.coach_sessions;
CREATE POLICY "coach_sessions_authenticated_read"
ON public.coach_sessions FOR SELECT TO authenticated
USING (true);

-- coach_sections: authenticated users can read and update status
DROP POLICY IF EXISTS "coach_sections_authenticated_read" ON public.coach_sections;
CREATE POLICY "coach_sections_authenticated_read"
ON public.coach_sections FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "coach_sections_owner_manage" ON public.coach_sections;
CREATE POLICY "coach_sections_owner_manage"
ON public.coach_sections FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.coach_sessions cs
    WHERE cs.id = session_id AND cs.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.coach_sessions cs
    WHERE cs.id = session_id AND cs.owner_id = auth.uid()
  )
);

-- coach_annotations: authenticated users can read all, insert their own, update/delete their own
DROP POLICY IF EXISTS "coach_annotations_read" ON public.coach_annotations;
CREATE POLICY "coach_annotations_read"
ON public.coach_annotations FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "coach_annotations_insert" ON public.coach_annotations;
CREATE POLICY "coach_annotations_insert"
ON public.coach_annotations FOR INSERT TO authenticated
WITH CHECK (reviewer_id = auth.uid());

DROP POLICY IF EXISTS "coach_annotations_update" ON public.coach_annotations;
CREATE POLICY "coach_annotations_update"
ON public.coach_annotations FOR UPDATE TO authenticated
USING (reviewer_id = auth.uid())
WITH CHECK (reviewer_id = auth.uid());

DROP POLICY IF EXISTS "coach_annotations_delete" ON public.coach_annotations;
CREATE POLICY "coach_annotations_delete"
ON public.coach_annotations FOR DELETE TO authenticated
USING (reviewer_id = auth.uid());

-- Allow session owner to resolve/unresolve any annotation
DROP POLICY IF EXISTS "coach_annotations_owner_update" ON public.coach_annotations;
CREATE POLICY "coach_annotations_owner_update"
ON public.coach_annotations FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.coach_sessions cs
    WHERE cs.id = session_id AND cs.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.coach_sessions cs
    WHERE cs.id = session_id AND cs.owner_id = auth.uid()
  )
);

-- coach_replies: authenticated users can read all, insert their own, delete their own
DROP POLICY IF EXISTS "coach_replies_read" ON public.coach_replies;
CREATE POLICY "coach_replies_read"
ON public.coach_replies FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "coach_replies_insert" ON public.coach_replies;
CREATE POLICY "coach_replies_insert"
ON public.coach_replies FOR INSERT TO authenticated
WITH CHECK (reviewer_id = auth.uid());

DROP POLICY IF EXISTS "coach_replies_delete" ON public.coach_replies;
CREATE POLICY "coach_replies_delete"
ON public.coach_replies FOR DELETE TO authenticated
USING (reviewer_id = auth.uid());

-- 6. Enable real-time for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.coach_annotations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coach_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coach_sections;
