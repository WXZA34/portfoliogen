-- PortfolioGen — Full Schema Migration
-- Tables: user_profiles, projects, skills, parcours, media_files, portfolios,
--         campaigns, campaign_views, recruiter_messages

-- ============================================================
-- 1. TYPES (ENUMs)
-- ============================================================

DROP TYPE IF EXISTS public.portfolio_template CASCADE;
CREATE TYPE public.portfolio_template AS ENUM ('ClassicCream', 'BentoMinimal');

DROP TYPE IF EXISTS public.portfolio_status CASCADE;
CREATE TYPE public.portfolio_status AS ENUM ('active', 'draft');

DROP TYPE IF EXISTS public.sync_mode CASCADE;
CREATE TYPE public.sync_mode AS ENUM ('live', 'frozen');

DROP TYPE IF EXISTS public.campaign_status CASCADE;
CREATE TYPE public.campaign_status AS ENUM ('active', 'paused', 'ended');

DROP TYPE IF EXISTS public.media_type CASCADE;
CREATE TYPE public.media_type AS ENUM ('image', 'video', 'pdf', 'document');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- User profiles (intermediary for auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  headline TEXT,
  location TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Projects (CVthèque)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  role TEXT,
  company TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Skills (CVthèque)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  level INTEGER DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  years_experience NUMERIC(4,1),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Parcours / Timeline (CVthèque)
CREATE TABLE IF NOT EXISTS public.parcours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'experience',
  title TEXT NOT NULL,
  organization TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Media files (CVthèque — images, PDFs, videos)
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT,
  media_type public.media_type DEFAULT 'image',
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  caption TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  persona TEXT,
  template public.portfolio_template DEFAULT 'BentoMinimal',
  sync_mode public.sync_mode DEFAULT 'live',
  status public.portfolio_status DEFAULT 'draft',
  slug TEXT NOT NULL,
  selected_projects UUID[] DEFAULT ARRAY[]::UUID[],
  selected_skills UUID[] DEFAULT ARRAY[]::UUID[],
  custom_intro TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  target_company TEXT,
  target_role TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status public.campaign_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Campaign views / analytics events
CREATE TABLE IF NOT EXISTS public.campaign_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  visitor_ip TEXT,
  referrer TEXT,
  user_agent TEXT,
  duration_seconds INTEGER DEFAULT 0,
  viewed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Recruiter messages (chat)
CREATE TABLE IF NOT EXISTS public.recruiter_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  portfolio_owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_company TEXT,
  sender_email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_parcours_user_id ON public.parcours(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_user_id ON public.media_files(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_views_campaign_id ON public.campaign_views(campaign_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_messages_portfolio_id ON public.recruiter_messages(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_messages_owner_id ON public.recruiter_messages(portfolio_owner_id);

-- ============================================================
-- 4. FUNCTIONS (before RLS policies)
-- ============================================================

-- Auto-create user_profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Increment portfolio views count
CREATE OR REPLACE FUNCTION public.increment_portfolio_views(portfolio_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.portfolios
  SET views_count = views_count + 1
  WHERE id = portfolio_uuid;
END;
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- user_profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- projects
DROP POLICY IF EXISTS "users_manage_own_projects" ON public.projects;
CREATE POLICY "users_manage_own_projects"
ON public.projects FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- skills
DROP POLICY IF EXISTS "users_manage_own_skills" ON public.skills;
CREATE POLICY "users_manage_own_skills"
ON public.skills FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- parcours
DROP POLICY IF EXISTS "users_manage_own_parcours" ON public.parcours;
CREATE POLICY "users_manage_own_parcours"
ON public.parcours FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- media_files
DROP POLICY IF EXISTS "users_manage_own_media_files" ON public.media_files;
CREATE POLICY "users_manage_own_media_files"
ON public.media_files FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- portfolios: owner manages, public can read active ones
DROP POLICY IF EXISTS "users_manage_own_portfolios" ON public.portfolios;
CREATE POLICY "users_manage_own_portfolios"
ON public.portfolios FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "public_read_active_portfolios" ON public.portfolios;
CREATE POLICY "public_read_active_portfolios"
ON public.portfolios FOR SELECT TO public
USING (status = 'active');

-- campaigns
DROP POLICY IF EXISTS "users_manage_own_campaigns" ON public.campaigns;
CREATE POLICY "users_manage_own_campaigns"
ON public.campaigns FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- campaign_views: owner reads, public inserts (tracking)
DROP POLICY IF EXISTS "users_read_own_campaign_views" ON public.campaign_views;
CREATE POLICY "users_read_own_campaign_views"
ON public.campaign_views FOR SELECT TO authenticated
USING (
  campaign_id IN (
    SELECT id FROM public.campaigns WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "public_insert_campaign_views" ON public.campaign_views;
CREATE POLICY "public_insert_campaign_views"
ON public.campaign_views FOR INSERT TO public
WITH CHECK (true);

-- recruiter_messages: owner reads, public inserts (contact form)
DROP POLICY IF EXISTS "owners_read_recruiter_messages" ON public.recruiter_messages;
CREATE POLICY "owners_read_recruiter_messages"
ON public.recruiter_messages FOR SELECT TO authenticated
USING (portfolio_owner_id = auth.uid());

DROP POLICY IF EXISTS "owners_update_recruiter_messages" ON public.recruiter_messages;
CREATE POLICY "owners_update_recruiter_messages"
ON public.recruiter_messages FOR UPDATE TO authenticated
USING (portfolio_owner_id = auth.uid()) WITH CHECK (portfolio_owner_id = auth.uid());

DROP POLICY IF EXISTS "public_insert_recruiter_messages" ON public.recruiter_messages;
CREATE POLICY "public_insert_recruiter_messages"
ON public.recruiter_messages FOR INSERT TO public
WITH CHECK (true);

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER set_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER set_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 8. STORAGE BUCKETS (via SQL)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('media', 'media', true, 52428800, ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']),
  ('documents', 'documents', false, 10485760, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "public_read_media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_upload_media" ON storage.objects;
CREATE POLICY "auth_upload_media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

DROP POLICY IF EXISTS "auth_delete_media" ON storage.objects;
CREATE POLICY "auth_delete_media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

DROP POLICY IF EXISTS "auth_manage_documents" ON storage.objects;
CREATE POLICY "auth_manage_documents"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::TEXT)
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects;
CREATE POLICY "public_read_avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "auth_upload_avatars" ON storage.objects;
CREATE POLICY "auth_upload_avatars"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

-- ============================================================
-- 9. MOCK DATA
-- ============================================================

DO $$
DECLARE
  demo_uuid UUID := gen_random_uuid();
BEGIN
  -- Create demo auth user (trigger creates user_profiles automatically)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    demo_uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo@portfoliogen.io',
    crypt('demo1234', gen_salt('bf', 10)),
    now(), now(), now(),
    jsonb_build_object('full_name', 'Alexandre Martin', 'avatar_url', ''),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion skipped: %', SQLERRM;
END $$;
