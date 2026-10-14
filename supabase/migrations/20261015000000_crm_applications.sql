-- Migration: CRM Candidatures (Candidate Application Tracking)
-- Table: crm_applications

CREATE TABLE IF NOT EXISTS public.crm_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'candidaté' CHECK (status IN ('candidaté', 'entretien', 'offre', 'refus', 'relance')),
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  portfolio_id TEXT,
  portfolio_name TEXT,
  portfolio_slug TEXT,
  custom_url TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  contract_type TEXT,
  salary TEXT,
  notes TEXT DEFAULT '',
  next_action TEXT,
  next_action_date DATE,
  logo TEXT DEFAULT '🏢',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crm_applications_user_id ON public.crm_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_applications_status ON public.crm_applications(status);

ALTER TABLE public.crm_applications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'crm_applications' AND policyname = 'Users can manage their own applications'
  ) THEN
    CREATE POLICY "Users can manage their own applications"
      ON public.crm_applications FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
