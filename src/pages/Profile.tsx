import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import Header from "@/components/Header";
import PromptGrid from "@/components/PromptGrid";
import SEO from "@/components/Seo";
import BackButton from "@/components/BackButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Globe, Calendar, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: userPrompts, isLoading: promptsLoading } = useQuery({
    queryKey: ["user-prompts", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("user_id", id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const isLoading = profileLoading || promptsLoading;

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        {isRTL ? " ⁄–— «·⁄ÀÊ— ⁄·Ï «·„” Œœ„" : "User not found"}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {isRTL ? "Ã«— «· Õ„Ì·..." : "Loading..."}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        {isRTL ? "«·„” Œœ„ €Ì— „ÊÃÊœ" : "User not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${profile.full_name || profile.username || "User"}`}
        description={profile.bio || `Check out ${profile.username}'s prompts.`}
        image={profile.avatar_url || undefined}
      />

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="relative mb-12 mt-8">
          <div className="absolute inset-0 -top-10 bg-gradient-to-r from-primary/20 to-purple-500/20 h-24 rounded-xl -z-10" />
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback>
                  <UserIcon className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">
                    {profile.full_name || profile.username || (isRTL ? "„” Œœ„" : "User")}
                  </h1>
                  {profile.username && (
                    <Badge variant="secondary" className="text-xs">
                      @{profile.username}
                    </Badge>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-muted-foreground mt-2">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  {profile.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isRTL ? "«‰÷„" : "Joined"} {format(new Date(profile.created_at), "MMM yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {isRTL ? "„ÊÃÂ«  «·„” Œœ„" : "User Prompts"}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? "ﬂ· «·„ÊÃÂ«  «·„⁄ „œ… «· Ì ‰‘—Â« «·„” Œœ„." : "All approved prompts published by this user."}
          </p>
        </div>

        <PromptGrid prompts={userPrompts || []} isLoading={promptsLoading} />
      </main>
    </div>
  );
}
