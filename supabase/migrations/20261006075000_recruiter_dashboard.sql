-- Recruiter Dashboard Migration
-- Tables: recruiter_profiles, job_postings, job_applications, recruiter_conversations, recruiter_chat_messages, appointments

-- ============================================================
-- 1. RECRUITER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recruiter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT '',
  company_logo TEXT,
  job_title TEXT NOT NULL DEFAULT '',
  industry TEXT,
  company_size TEXT,
  website TEXT,
  bio TEXT,
  location TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_profiles' AND policyname='Recruiter manages own profile') THEN
    CREATE POLICY "Recruiter manages own profile"
      ON public.recruiter_profiles FOR ALL
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_profiles' AND policyname='Public can read recruiter profiles') THEN
    CREATE POLICY "Public can read recruiter profiles"
      ON public.recruiter_profiles FOR SELECT
      USING (true);
  END IF;
END $$;

-- ============================================================
-- 2. JOB POSTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT '',
  company_logo TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  skills_required TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT,
  remote_policy TEXT DEFAULT 'hybrid',
  contract_type TEXT DEFAULT 'cdi',
  salary_min INTEGER,
  salary_max INTEGER,
  experience_years_min INTEGER DEFAULT 0,
  experience_years_max INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  views_count INTEGER NOT NULL DEFAULT 0,
  applications_count INTEGER NOT NULL DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_postings' AND policyname='Recruiter manages own job postings') THEN
    CREATE POLICY "Recruiter manages own job postings"
      ON public.job_postings FOR ALL
      USING (auth.uid() = recruiter_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_postings' AND policyname='Public can read active job postings') THEN
    CREATE POLICY "Public can read active job postings"
      ON public.job_postings FOR SELECT
      USING (status = 'active' OR auth.uid() = recruiter_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_job_postings_recruiter_id ON public.job_postings(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);

-- ============================================================
-- 3. JOB APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_url TEXT,
  cover_note TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  recruiter_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_applications' AND policyname='Applicant manages own applications') THEN
    CREATE POLICY "Applicant manages own applications"
      ON public.job_applications FOR ALL
      USING (auth.uid() = applicant_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_applications' AND policyname='Recruiter reads own job applications') THEN
    CREATE POLICY "Recruiter reads own job applications"
      ON public.job_applications FOR ALL
      USING (auth.uid() = recruiter_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='job_applications' AND policyname='Anyone can insert application') THEN
    CREATE POLICY "Anyone can insert application"
      ON public.job_applications FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_recruiter_id ON public.job_applications(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);

-- ============================================================
-- 4. RECRUITER CONVERSATIONS (thread per recruiter-candidate pair)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recruiter_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE SET NULL,
  candidate_name TEXT NOT NULL DEFAULT '',
  candidate_title TEXT,
  candidate_avatar TEXT,
  recruiter_name TEXT NOT NULL DEFAULT '',
  recruiter_company TEXT,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  unread_recruiter INTEGER NOT NULL DEFAULT 0,
  unread_candidate INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recruiter_conversations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_conversations' AND policyname='Participants can access conversation') THEN
    CREATE POLICY "Participants can access conversation"
      ON public.recruiter_conversations FOR ALL
      USING (auth.uid() = recruiter_id OR auth.uid() = candidate_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_conversations' AND policyname='Anyone can create conversation') THEN
    CREATE POLICY "Anyone can create conversation"
      ON public.recruiter_conversations FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_conversations;

-- ============================================================
-- 5. RECRUITER CHAT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recruiter_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.recruiter_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL DEFAULT 'recruiter',
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recruiter_chat_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_chat_messages' AND policyname='Conversation participants can access messages') THEN
    CREATE POLICY "Conversation participants can access messages"
      ON public.recruiter_chat_messages FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.recruiter_conversations c
          WHERE c.id = conversation_id
          AND (c.recruiter_id = auth.uid() OR c.candidate_id = auth.uid())
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_chat_messages' AND policyname='Anyone can send message') THEN
    CREATE POLICY "Anyone can send message"
      ON public.recruiter_chat_messages FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_chat_messages;

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.recruiter_chat_messages(conversation_id);

-- ============================================================
-- 6. APPOINTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.recruiter_conversations(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Entretien',
  description TEXT,
  appointment_type TEXT NOT NULL DEFAULT 'video',
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  status TEXT NOT NULL DEFAULT 'pending',
  meeting_link TEXT,
  recruiter_name TEXT,
  candidate_name TEXT,
  recruiter_notes TEXT,
  candidate_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='appointments' AND policyname='Participants can manage appointments') THEN
    CREATE POLICY "Participants can manage appointments"
      ON public.appointments FOR ALL
      USING (auth.uid() = recruiter_id OR auth.uid() = candidate_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='appointments' AND policyname='Anyone can create appointment') THEN
    CREATE POLICY "Anyone can create appointment"
      ON public.appointments FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

CREATE INDEX IF NOT EXISTS idx_appointments_recruiter_id ON public.appointments(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_appointments_candidate_id ON public.appointments(candidate_id);
