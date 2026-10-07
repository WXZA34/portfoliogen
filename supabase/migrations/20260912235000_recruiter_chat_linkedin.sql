-- Enable realtime for recruiter_messages (table already exists)
ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_messages;

-- Add missing columns to recruiter_messages if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='portfolio_owner_id') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN portfolio_owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='sender_name') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN sender_name text NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='sender_company') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN sender_company text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='content') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN content text NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='is_read') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN is_read boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='reply_content') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN reply_content text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='replied_at') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN replied_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recruiter_messages' AND column_name='created_at') THEN
    ALTER TABLE public.recruiter_messages ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- RLS for recruiter_messages
ALTER TABLE public.recruiter_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_messages' AND policyname='Anyone can insert recruiter message') THEN
    CREATE POLICY "Anyone can insert recruiter message"
      ON public.recruiter_messages FOR INSERT
      WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_messages' AND policyname='Owner can read own messages') THEN
    CREATE POLICY "Owner can read own messages"
      ON public.recruiter_messages FOR SELECT
      USING (auth.uid() = portfolio_owner_id OR portfolio_owner_id IS NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='recruiter_messages' AND policyname='Owner can update own messages') THEN
    CREATE POLICY "Owner can update own messages"
      ON public.recruiter_messages FOR UPDATE
      USING (auth.uid() = portfolio_owner_id);
  END IF;
END $$;

-- LinkedIn recommendations table
CREATE TABLE IF NOT EXISTS public.linkedin_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recommender_name text NOT NULL,
  recommender_title text NOT NULL,
  recommender_company text NOT NULL,
  recommender_avatar text,
  recommender_linkedin_url text,
  relationship text NOT NULL,
  content text NOT NULL,
  date_given date NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  verification_source text DEFAULT 'linkedin',
  is_public boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.linkedin_recommendations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='linkedin_recommendations' AND policyname='Public can read recommendations') THEN
    CREATE POLICY "Public can read recommendations"
      ON public.linkedin_recommendations FOR SELECT
      USING (is_public = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='linkedin_recommendations' AND policyname='Owner can manage recommendations') THEN
    CREATE POLICY "Owner can manage recommendations"
      ON public.linkedin_recommendations FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Seed mock LinkedIn recommendations
INSERT INTO public.linkedin_recommendations (recommender_name, recommender_title, recommender_company, relationship, content, date_given, is_verified, display_order)
VALUES
  ('Sarah Chen', 'Engineering Manager', 'Mistral AI', 'Direct Manager', 'Alexandre is one of the most talented engineers I have had the pleasure of working with. His ability to architect complex distributed systems while maintaining code quality is exceptional. He led the NeuralCommerce platform redesign that reduced latency by 40% and he did it in record time. Highly recommend.', '2025-06-15', true, 1),
  ('Marcus Webb', 'CTO', 'Datadog', 'Senior Colleague', 'Working with Alexandre at Datadog was a highlight of my career. He brought a level of technical depth and pragmatism that elevated the entire team. His open source CLI framework became an internal standard tool. A rare combination of brilliant engineer and great communicator.', '2024-12-10', true, 2),
  ('Priya Sharma', 'Senior Product Manager', 'Qonto', 'Cross-functional Partner', 'Alexandre was the go-to engineer for our most challenging technical problems at Qonto. He has an incredible ability to translate complex technical constraints into clear product decisions. His work on our payment infrastructure was foundational to our Series C growth.', '2023-08-22', true, 3),
  ('Thomas Dubois', 'Lead Developer', 'Freelance', 'Peer', 'I collaborated with Alexandre on several open source projects. His code reviews are thorough and constructive, his documentation is exemplary, and his commitment to developer experience is unmatched. The CLI Forge framework he built is used by thousands of developers worldwide.', '2025-02-14', false, 4)
ON CONFLICT DO NOTHING;
