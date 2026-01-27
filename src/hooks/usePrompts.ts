import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  profiles?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};
export type PromptInsert = Database['public']['Tables']['prompts']['Insert'];
export type PromptUpdate = Database['public']['Tables']['prompts']['Update'];

export const promptKeys = {
  all: ['prompts'] as const,
  infinite: (search?: string, category?: string, model?: string) =>
    ['prompts', 'infinite', search, category, model] as const,
};

const PAGE_SIZE = 12;

export const usePrompts = (search?: string, category?: string, model?: string) => {
  return useInfiniteQuery({
    queryKey: promptKeys.infinite(search, category, model),
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {

      let query = supabase
        .from('prompts')
        .select('*')
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      // تصفية الفئات (Categories)
      if (category && category !== 'all') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = query.eq('category', category as any);
      }

      // تصفية الموديلات (AI Models)
      if (model && model !== 'all') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = query.eq('ai_model', model as any);
      }

      // البحث (Search)
      if (search && search.trim()) {
        // نستخدم textSearch للبحث السريع في العمود الذي أنشأناه سابقاً
        // تأكد من أنك نفذت كود SQL الخاص بـ search_vector
        query = query.textSearch('search_vector', search.trim().split(' ').join(' & '));
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Prompt[];
    },
    getNextPageParam: (lastPage: Prompt[], allPages: Prompt[][]) => {
      // إذا كانت الصفحة الحالية أقل من الحجم الكامل، فلا يوجد المزيد
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
};

export const useAddPrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (prompt: PromptInsert) => {
      const { data, error } = await supabase.from('prompts').insert(prompt).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all });
    },
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: PromptUpdate & { id: string }) => {
      const { data, error } = await supabase.from('prompts').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all });
    },
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('prompts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all });
    },
  });
};

export const useUpdateLikes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, likes }: { id: string; likes: number }) => {
      const { data, error } = await supabase
        .from('prompts')
        .update({ likes })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all });
    },
  });
};
