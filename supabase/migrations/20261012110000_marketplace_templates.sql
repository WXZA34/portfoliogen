-- Migration: Marketplace Templates Table & Policies
CREATE TABLE IF NOT EXISTS public.marketplace_templates (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  original_template_id TEXT,
  name TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Communauté',
  author_avatar TEXT,
  category TEXT NOT NULL DEFAULT 'Tech',
  theme TEXT NOT NULL DEFAULT 'Minimaliste',
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  preview_thumbnail TEXT,
  preview_slides TEXT[] DEFAULT '{}',
  preview_color TEXT DEFAULT '#7c3aed',
  design_data JSONB NOT NULL,
  downloads INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 5.0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.marketplace_templates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all templates
CREATE POLICY "Marketplace templates are viewable by everyone" 
  ON public.marketplace_templates 
  FOR SELECT 
  USING (true);

-- Allow authenticated or public insert (for testing or signed-in users)
CREATE POLICY "Anyone can publish templates to marketplace" 
  ON public.marketplace_templates 
  FOR INSERT 
  WITH CHECK (true);

-- Allow updates (e.g. increments to downloads or likes)
CREATE POLICY "Anyone can update marketplace template stats" 
  ON public.marketplace_templates 
  FOR UPDATE 
  USING (true);

-- Allow deletes (for removing templates from marketplace)
CREATE POLICY "Anyone can delete marketplace template" 
  ON public.marketplace_templates 
  FOR DELETE 
  USING (true);

-- ============================================================
-- ISOLATION MULTI-UTILISATEUR POUR `my_templates`
-- ============================================================

-- 1. Ajouter la colonne user_id si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'my_templates' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.my_templates ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Activer la sécurité Row Level Security (RLS) sur my_templates
ALTER TABLE public.my_templates ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes politiques si existantes
DROP POLICY IF EXISTS "Users can only view their own templates" ON public.my_templates;
DROP POLICY IF EXISTS "Users can only insert their own templates" ON public.my_templates;
DROP POLICY IF EXISTS "Users can only update their own templates" ON public.my_templates;
DROP POLICY IF EXISTS "Users can only delete their own templates" ON public.my_templates;

-- 4. Politiques RLS strictes : chaque utilisateur ne voit et ne modifie QUE ses propres templates
CREATE POLICY "Users can only view their own templates" 
  ON public.my_templates 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can only insert their own templates" 
  ON public.my_templates 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only update their own templates" 
  ON public.my_templates 
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only delete their own templates" 
  ON public.my_templates 
  FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());
