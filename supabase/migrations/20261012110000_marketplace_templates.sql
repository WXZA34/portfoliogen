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
