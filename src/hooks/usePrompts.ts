import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Prompt = Database['public']['Tables']['prompts']['Row'];
export type PromptInsert = Database['public']['Tables']['prompts']['Insert'];
export type PromptUpdate = Database['public']['Tables']['prompts']['Update'];

// Query keys for cache management
export const promptKeys = {
  all: ['prompts'] as const,
  detail: (id: string) => ['prompts', id] as const,
};

// Fetch all prompts with optimized caching
export const usePrompts = () => {
  return useQuery({
    queryKey: promptKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Add a new prompt with optimistic update
export const useAddPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt: PromptInsert) => {
      const { data, error } = await supabase
        .from('prompts')
        .insert(prompt)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newPrompt) => {
      // Optimistically add to cache
      queryClient.setQueryData(promptKeys.all, (old: Prompt[] | undefined) => {
        if (!old) return [newPrompt];
        return [newPrompt, ...old];
      });
    },
  });
};

// Update a prompt with optimistic update
export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PromptUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updatedPrompt) => {
      await queryClient.cancelQueries({ queryKey: promptKeys.all });
      const previousPrompts = queryClient.getQueryData(promptKeys.all);
      
      queryClient.setQueryData(promptKeys.all, (old: Prompt[] | undefined) => {
        if (!old) return old;
        return old.map(p => 
          p.id === updatedPrompt.id ? { ...p, ...updatedPrompt } : p
        );
      });
      
      return { previousPrompts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPrompts) {
        queryClient.setQueryData(promptKeys.all, context.previousPrompts);
      }
    },
  });
};

// Delete a prompt with optimistic update
export const useDeletePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: promptKeys.all });
      const previousPrompts = queryClient.getQueryData(promptKeys.all);
      
      queryClient.setQueryData(promptKeys.all, (old: Prompt[] | undefined) => {
        if (!old) return old;
        return old.filter(p => p.id !== deletedId);
      });
      
      return { previousPrompts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPrompts) {
        queryClient.setQueryData(promptKeys.all, context.previousPrompts);
      }
    },
  });
};

// Debounced like update to reduce API calls
let likeDebounceTimer: ReturnType<typeof setTimeout> | null = null;

export const useUpdateLikes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, likes }: { id: string; likes: number }) => {
      // Clear existing timer
      if (likeDebounceTimer) {
        clearTimeout(likeDebounceTimer);
      }

      // Debounce the API call
      return new Promise<Prompt>((resolve, reject) => {
        likeDebounceTimer = setTimeout(async () => {
          try {
            const { data, error } = await supabase
              .from('prompts')
              .update({ likes })
              .eq('id', id)
              .select()
              .single();

            if (error) reject(error);
            else resolve(data);
          } catch (err) {
            reject(err);
          }
        }, 300); // 300ms debounce
      });
    },
    onMutate: async ({ id, likes }) => {
      // Optimistic update immediately
      await queryClient.cancelQueries({ queryKey: promptKeys.all });
      const previousPrompts = queryClient.getQueryData(promptKeys.all);
      
      queryClient.setQueryData(promptKeys.all, (old: Prompt[] | undefined) => {
        if (!old) return old;
        return old.map(p => p.id === id ? { ...p, likes } : p);
      });
      
      return { previousPrompts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPrompts) {
        queryClient.setQueryData(promptKeys.all, context.previousPrompts);
      }
    },
  });
};
