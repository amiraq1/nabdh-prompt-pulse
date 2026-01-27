import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import Header from "@/components/Header";
import PromptGrid from "@/components/PromptGrid";
import SEO from "@/components/Seo";
import { Bookmark } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function Bookmarks() {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["bookmarked-prompts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompt_bookmarks")
        .select(
          `
          prompt_id,
          prompts:prompt_id (*)
        `,
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map((item: { prompts: unknown }) => item.prompts);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title={isRTL ? "مفضلتي" : "My Bookmarks"} />
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-yellow-500/10 rounded-full">
            <Bookmark className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{isRTL ? "مفضلتي" : "My Bookmarks"}</h1>
            <p className="text-muted-foreground">
              {isRTL ? "الموجهات التي قمت بحفظها للعودة إليها." : "Prompts you saved for later."}
            </p>
          </div>
        </div>

        <PromptGrid prompts={prompts || []} isLoading={isLoading} />

        {!isLoading && prompts?.length === 0 && (
          <div className="text-center py-20 border border-dashed rounded-xl">
            <p className="text-muted-foreground text-lg">
              {isRTL ? "لم تحفظ أي شيء بعد 📂" : "No bookmarks yet 📂"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
