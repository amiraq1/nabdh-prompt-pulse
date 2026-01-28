import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Prompt } from './usePrompts';

export const useFeaturedPrompts = (limit: number = 6) => {
    return useQuery({
        queryKey: ['prompts', 'featured', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('prompts')
                .select('*')
                .order('likes', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data as Prompt[];
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
