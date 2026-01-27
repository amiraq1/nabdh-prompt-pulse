import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguage";

export const useCollections = (promptId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();

  const { data: collections, isLoading } = useQuery({
    queryKey: ["my-collections", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createCollectionMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error("Login required");
      const { data, error } = await supabase
        .from("collections")
        .insert({ title, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-collections"] });
      toast({
        title: isRTL ? "تمت العملية" : "Success",
        description: isRTL ? "تم إنشاء المجموعة بنجاح" : "Collection created",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
    },
  });

  const addToCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      if (!user || !promptId) throw new Error("Invalid data");
      const { error } = await supabase
        .from("collection_items")
        .insert({ collection_id: collectionId, prompt_id: promptId });
      if (error) {
        if (error.code === "23505") {
          throw new Error(
            isRTL
              ? "الموجه موجود بالفعل في هذه المجموعة"
              : "Prompt already in collection",
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: isRTL ? "تم الحفظ" : "Saved",
        description: isRTL ? "تمت إضافة الموجه للمجموعة" : "Prompt added to collection",
      });
    },
    onError: (error: Error) => {
      toast({
        title: isRTL ? "تنبيه" : "Note",
        description: error.message,
        variant: "default",
      });
    },
  });

  return {
    collections,
    isLoading,
    createCollection: createCollectionMutation.mutate,
    isCreating: createCollectionMutation.isPending,
    addToCollection: addToCollectionMutation.mutate,
    isAdding: addToCollectionMutation.isPending,
  };
};
