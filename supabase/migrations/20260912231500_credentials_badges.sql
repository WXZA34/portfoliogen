-- Migration: credentials_badges
-- Adds verified badges, certifications, and linked credentials for public portfolio display

-- 1. Enum types
DROP TYPE IF EXISTS public.credential_type CASCADE;
CREATE TYPE public.credential_type AS ENUM ('certification', 'badge', 'degree', 'license', 'award');

DROP TYPE IF EXISTS public.verification_status CASCADE;
CREATE TYPE public.verification_status AS ENUM ('verified', 'pending', 'expired', 'unverified');

-- 2. Credentials table
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    credential_type public.credential_type NOT NULL DEFAULT 'certification'::public.credential_type,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    verification_status public.verification_status NOT NULL DEFAULT 'unverified'::public.verification_status,
    credential_url TEXT,
    credential_id TEXT,
    description TEXT,
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    badge_image_url TEXT,
    is_public BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON public.credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_type ON public.credentials(credential_type);
CREATE INDEX IF NOT EXISTS idx_credentials_status ON public.credentials(verification_status);
CREATE INDEX IF NOT EXISTS idx_credentials_public ON public.credentials(is_public) WHERE is_public = true;

-- 4. Enable RLS
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Public can read public credentials (for portfolio display)
DROP POLICY IF EXISTS "public_can_read_credentials" ON public.credentials;
CREATE POLICY "public_can_read_credentials"
ON public.credentials
FOR SELECT
TO public
USING (is_public = true);

-- Authenticated users manage their own credentials
DROP POLICY IF EXISTS "users_manage_own_credentials" ON public.credentials;
CREATE POLICY "users_manage_own_credentials"
ON public.credentials
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_credentials_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credentials_updated_at ON public.credentials;
CREATE TRIGGER credentials_updated_at
    BEFORE UPDATE ON public.credentials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_credentials_updated_at();

-- 7. Mock data
DO $$
DECLARE
    existing_user_id UUID;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'user_profiles'
    ) THEN
        SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;

        IF existing_user_id IS NOT NULL THEN
            INSERT INTO public.credentials (
                id, user_id, credential_type, title, issuer, issue_date, expiry_date,
                verification_status, credential_url, credential_id, description, skills,
                badge_image_url, is_public, display_order
            ) VALUES
            (
                gen_random_uuid(), existing_user_id, 'certification'::public.credential_type,
                'AWS Certified Solutions Architect', 'Amazon Web Services',
                '2025-03-15', '2028-03-15',
                'verified'::public.verification_status,
                'https://aws.amazon.com/verification/cert-123',
                'AWS-SAA-C03-123456',
                'Professional certification for designing distributed systems on AWS.',
                ARRAY['AWS', 'Cloud Architecture', 'Infrastructure'],
                NULL, true, 1
            ),
            (
                gen_random_uuid(), existing_user_id, 'certification'::public.credential_type,
                'Google Professional Cloud Developer', 'Google Cloud',
                '2024-11-20', '2026-11-20',
                'verified'::public.verification_status,
                'https://google.com/verify/gcp-dev-456',
                'GCP-PCD-456789',
                'Certification for building scalable applications on Google Cloud Platform.',
                ARRAY['GCP', 'Kubernetes', 'Cloud Run', 'BigQuery'],
                NULL, true, 2
            ),
            (
                gen_random_uuid(), existing_user_id, 'badge'::public.credential_type,
                'Open Source Contributor', 'GitHub',
                '2024-06-01', NULL,
                'verified'::public.verification_status,
                'https://github.com/alexmartin',
                NULL,
                'Recognized contributor with 500+ contributions and 3 featured repositories.',
                ARRAY['Open Source', 'TypeScript', 'Node.js'],
                NULL, true, 3
            ),
            (
                gen_random_uuid(), existing_user_id, 'certification'::public.credential_type,
                'Meta React Developer Certificate', 'Coursera / Meta',
                '2024-02-10', NULL,
                'verified'::public.verification_status,
                'https://coursera.org/verify/meta-react-789',
                'COURSERA-META-789012',
                'Advanced React development including hooks, performance optimization, and testing.',
                ARRAY['React', 'JavaScript', 'Testing', 'Performance'],
                NULL, true, 4
            ),
            (
                gen_random_uuid(), existing_user_id, 'award'::public.credential_type,
                'Best Developer Tool — Product Hunt', 'Product Hunt',
                '2025-01-08', NULL,
                'verified'::public.verification_status,
                'https://producthunt.com/posts/cli-forge',
                NULL,
                '#1 Product of the Day for CLI Forge open source framework.',
                ARRAY['Open Source', 'Developer Tools'],
                NULL, true, 5
            ),
            (
                gen_random_uuid(), existing_user_id, 'certification'::public.credential_type,
                'Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation',
                '2023-09-05', '2026-09-05',
                'pending'::public.verification_status,
                NULL,
                'CKA-2023-345678',
                'Certified Kubernetes Administrator — renewal in progress.',
                ARRAY['Kubernetes', 'DevOps', 'Container Orchestration'],
                NULL, true, 6
            )
            ON CONFLICT (id) DO NOTHING;
        ELSE
            RAISE NOTICE 'No existing users found. Skipping mock credentials.';
        END IF;
    ELSE
        RAISE NOTICE 'Table user_profiles does not exist. Skipping mock credentials.';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock credentials insertion failed: %', SQLERRM;
END $$;
