import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function NotificationsMenu() {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    refetchInterval: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          *,
          actor:actor_id (full_name, avatar_url),
          prompt:resource_id (title, title_ar)
        `,
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      markAsReadMutation.mutate();
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} dir={isRTL ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          {isRTL ? "الإشعارات" : "Notifications"}
          {unreadCount > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {unreadCount} {isRTL ? "جديد" : "new"}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[300px]">
          {notifications?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {isRTL ? "لا توجد إشعارات بعد 😴" : "No notifications yet 😴"}
            </div>
          ) : (
            notifications?.map((notif: any) => (
              <Link key={notif.id} to={`/user/${user.id}`} onClick={() => setIsOpen(false)}>
                <DropdownMenuItem className="cursor-pointer p-3 focus:bg-secondary/50">
                  <div className="flex gap-3 items-start">
                    <div
                      className={`mt-1 p-1.5 rounded-full ${
                        notif.type === "like"
                          ? "bg-red-100 text-red-500"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {notif.type === "like" ? (
                        <Heart className="w-3 h-3 fill-current" />
                      ) : (
                        <MessageCircle className="w-3 h-3" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none">
                        <span className="font-semibold">
                          {notif.actor?.full_name || "Someone"}
                        </span>{" "}
                        {notif.type === "like"
                          ? isRTL
                            ? "أعجب بموجهك"
                            : "liked your prompt"
                          : isRTL
                          ? "علّق على موجهك"
                          : "commented on your prompt"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        &quot;{isRTL ? notif.prompt?.title_ar || notif.prompt?.title : notif.prompt?.title}&quot;
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(notif.created_at), {
                          addSuffix: true,
                          locale: isRTL ? ar : enUS,
                        })}
                      </p>
                    </div>

                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </Link>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
