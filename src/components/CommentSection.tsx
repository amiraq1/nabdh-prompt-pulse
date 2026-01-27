import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/useAuth";
import { useLanguage } from "@/contexts/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface CommentSectionProps {
  promptId: string;
}

interface CommentProfile {
  username?: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
}

interface CommentWithProfile {
  id: string;
  user_id: string;
  prompt_id: string;
  content: string;
  created_at: string;
  profiles?: CommentProfile | null;
}

export default function CommentSection({ promptId }: CommentSectionProps) {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", promptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          *,
          profiles:user_id (username, avatar_url, full_name)
        `,
        )
        .eq("prompt_id", promptId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as CommentWithProfile[];
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase.from("comments").insert({
        prompt_id: promptId,
        user_id: user.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", promptId] });
      setNewComment("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  return (
    <div className="flex flex-col h-[400px]">
      <h3 className="font-semibold mb-4 px-1">
        {isRTL ? "التعليقات" : "Comments"} ({comments?.length || 0})
      </h3>

      <ScrollArea className="flex-1 pr-4 mb-4">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : comments?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            {isRTL ? "لا توجد تعليقات بعد. كن الأول!" : "No comments yet. Be the first!"}
          </p>
        ) : (
          <div className="space-y-4">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-sm">
                <Link to={`/user/${comment.user_id}`}>
                  <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={comment.profiles?.avatar_url || ""} />
                    <AvatarFallback>
                      {comment.profiles?.username?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 bg-secondary/30 p-3 rounded-lg rounded-tl-none">
                  <div className="flex justify-between items-start mb-1">
                    <Link
                      to={`/user/${comment.user_id}`}
                      className="font-semibold text-primary text-xs hover:underline"
                    >
                      {comment.profiles?.full_name ||
                        comment.profiles?.username ||
                        "Unknown"}
                    </Link>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: isRTL ? ar : enUS,
                      })}
                    </span>
                  </div>
                  <p className="text-foreground/90 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end border-t pt-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isRTL ? "اكتب تعليقك هنا..." : "Write a comment..."}
            className="min-h-[60px] resize-none"
            dir={isRTL ? "rtl" : "ltr"}
          />
          <Button
            type="submit"
            size="icon"
            disabled={addCommentMutation.isPending || !newComment.trim()}
          >
            {addCommentMutation.isPending ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center p-4 bg-secondary/20 rounded-lg text-sm">
          {isRTL ? "سجّل دخولك للمشاركة في النقاش" : "Log in to join the discussion"}
        </div>
      )}
    </div>
  );
}
