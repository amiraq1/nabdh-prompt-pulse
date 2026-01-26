
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type PromptCategory = Database['public']['Enums']['prompt_category'];
type AIModel = Database['public']['Enums']['ai_model'];

export interface SearchOptions {
    query: string;
    category?: string;
    model?: string;
    limit?: number;
}

export const searchPrompts = async ({ query, category, model, limit = 20 }: SearchOptions) => {
    let queryBuilder = supabase
        .from('prompts')
        .select('*');

    // Server-side Text Search (Requires 'fts' vector column setup in DB)
    if (query.trim()) {
        // Fallback to ilike if FTS is not set up, but FTS is recommended:
        // .textSearch('fts', query, { type: 'websearch', config: 'english' })
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`);
    }

    if (category && category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category as PromptCategory);
    }

    if (model && model !== 'all') {
        queryBuilder = queryBuilder.eq('ai_model', model as AIModel);
    }

    const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
};

// Client-side Browse Function (Calls the Edge Function)
export const browseUrl = async (url: string) => {
    const { data, error } = await supabase.functions.invoke('browse', {
        body: { url },
    });

    if (error) throw error;
    return data;
};
