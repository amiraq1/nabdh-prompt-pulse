import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguage";

export const useBookmark = (promptId: string) => {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkStatus = async () => {
      const { data } = await supabase
        .from("prompt_bookmarks")
        .select("prompt_id")
        .eq("prompt_id", promptId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setIsBookmarked(true);
    };

    checkStatus();
  }, [user, promptId]);

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: isRTL ? "تسجيل الدخول مطلوب" : "Login Required",
        description: isRTL ? "يجب تسجيل الدخول لحفظ الموجهات." : "Please login to bookmark prompts.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setIsLoading(true);

    try {
      if (previousState) {
        const { error } = await supabase
          .from("prompt_bookmarks")
          .delete()
          .eq("prompt_id", promptId)
          .eq("user_id", user.id);
        if (error) throw error;
        toast({
          title: isRTL ? "تمت الإزالة" : "Removed",
          description: isRTL ? "تمت إزالة الموجه من المفضلة." : "Removed from bookmarks.",
        });
      } else {
        const { error } = await supabase
          .from("prompt_bookmarks")
          .insert({ prompt_id: promptId, user_id: user.id });
        if (error) throw error;
        toast({
          title: isRTL ? "تم الحفظ" : "Saved",
          description: isRTL ? "تم حفظ الموجه في المفضلة." : "Saved to bookmarks.",
        });
      }
    } catch (error) {
      setIsBookmarked(previousState);
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return { isBookmarked, toggleBookmark, isLoading };
};
