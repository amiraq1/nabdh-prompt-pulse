import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguage";

export const useLike = (promptId: string, initialCount: number) => {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkLikeStatus = async () => {
      const { data } = await supabase
        .from("prompt_likes")
        .select("prompt_id")
        .eq("prompt_id", promptId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setIsLiked(true);
    };

    void checkLikeStatus();
  }, [user, promptId]);

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: isRTL ? "سجّل دخولك أولاً" : "Login Required",
        description: isRTL
          ? "يجب عليك تسجيل الدخول للإعجاب بالموجهات."
          : "You must be logged in to like prompts.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      const { error } = await supabase.rpc("toggle_like", { p_id: promptId });
      if (error) throw error;
    } catch {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLiked, likesCount, toggleLike, isLoading };
};
