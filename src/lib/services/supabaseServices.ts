'use client';

import { createClient } from '@/lib/supabase/client';

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const errorClass = error.code.substring(0, 2);
    if (errorClass === '42') return true;
    if (errorClass === '23') return false;
    if (errorClass === '08') return true;
  }
  if (error.message) {
    const schemaErrorPatterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
      /type.*does not exist/i,
    ];
    return schemaErrorPatterns.some((p) => p.test(error.message));
  }
  return false;
}

// ─── User Profile ────────────────────────────────────────────

export const profileService = {
  async get(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return data;
  },

  async update(userId: string, updates: Partial<{ full_name: string; headline: string; location: string; website: string; avatar_url: string }>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ─── Projects ────────────────────────────────────────────────

export const projectService = {
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },

  async create(userId: string, project: Partial<{ title: string; description: string; tech_stack: string[]; role: string; company: string; url: string; image_url: string; is_featured: boolean }>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...project, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Record<string, any>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Skills ──────────────────────────────────────────────────

export const skillService = {
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },

  async create(userId: string, skill: Partial<{ name: string; category: string; level: number; years_experience: number; is_featured: boolean }>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('skills')
      .insert({ ...skill, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Record<string, any>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Parcours ────────────────────────────────────────────────

export const parcoursService = {
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('parcours')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },

  async create(userId: string, entry: Partial<{ type: string; title: string; organization: string; location: string; start_date: string; end_date: string; is_current: boolean; description: string }>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('parcours')
      .insert({ ...entry, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('parcours').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Media Files ─────────────────────────────────────────────

export const mediaService = {
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },

  async upload(userId: string, file: File, bucket: 'media' | 'documents' | 'avatars' = 'media') {
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false });
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

    const { data, error } = await supabase
      .from('media_files')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_url: publicUrl,
        storage_path: path,
        media_type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type === 'application/pdf' ? 'pdf' : 'document',
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string, storagePath?: string) {
    const supabase = createClient();
    if (storagePath) {
      await supabase.storage.from('media').remove([storagePath]);
    }
    const { error } = await supabase.from('media_files').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Portfolios ──────────────────────────────────────────────

export const portfolioService = {
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },

  async getBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return data;
  },

  async create(userId: string, portfolio: Partial<{ name: string; persona: string; template: string; sync_mode: string; status: string; slug: string; selected_projects: string[]; selected_skills: string[]; custom_intro: string }>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('portfolios')
      .insert({ ...portfolio, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Record<string, any>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('portfolios').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Campaigns ───────────────────────────────────────────────

export const campaignService = {
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, portfolios(name, slug)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },

  async create(userId: string, campaign: Partial<{ name: string; target_company: string; target_role: string; portfolio_id: string; utm_source: string; utm_medium: string; utm_campaign: string; status: string }>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .insert({ ...campaign, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Record<string, any>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async trackView(campaignId: string, portfolioId: string, meta?: { referrer?: string; userAgent?: string }) {
    const supabase = createClient();
    const { error } = await supabase.from('campaign_views').insert({
      campaign_id: campaignId,
      portfolio_id: portfolioId,
      referrer: meta?.referrer || '',
      user_agent: meta?.userAgent || '',
    });
    if (error) console.log('Track view error:', error.message);
  },

  async getViews(campaignId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('campaign_views')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('viewed_at', { ascending: false });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },
};

// ─── Recruiter Messages ──────────────────────────────────────

export const messageService = {
  async getAll(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('recruiter_messages')
      .select('*, portfolios(name, slug)')
      .eq('portfolio_owner_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return data || [];
  },

  async send(portfolioId: string, portfolioOwnerId: string, message: { sender_name: string; sender_company?: string; sender_email?: string; message: string }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('recruiter_messages')
      .insert({
        portfolio_id: portfolioId,
        portfolio_owner_id: portfolioOwnerId,
        ...message,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markRead(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('recruiter_messages')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw error;
  },

  subscribeToMessages(portfolioOwnerId: string, onMessage: (msg: any) => void) {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages_${portfolioOwnerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recruiter_messages',
          filter: `portfolio_owner_id=eq.${portfolioOwnerId}`,
        },
        (payload) => onMessage(payload.new)
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  },
};
