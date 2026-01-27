import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import Header from "@/components/Header";
import PromptGrid from "@/components/PromptGrid";
import SEO from "@/components/Seo";
import BackButton from "@/components/BackButton";

export default function CollectionDetails() {
  const { id } = useParams<{ id: string }>();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collection } = useQuery({
    queryKey: ["collection-meta", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        navigate("/collections");
        throw error;
      }
      return data;
    },
  });

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["collection-items", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collection_items")
        .select(
          `
          prompt_id,
          prompts:prompt_id (*)
        `,
        )
        .eq("collection_id", id)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return data.map((item: any) => item.prompts);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title={collection?.title || "Collection"} />
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold">{collection?.title}</h1>
          <p className="text-muted-foreground">
            {prompts?.length || 0} {isRTL ? "„ÊÃÂ „Õ›ÊŸ" : "saved prompts"}
          </p>
        </div>

        <PromptGrid prompts={prompts || []} isLoading={isLoading} />

        {!isLoading && prompts?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {isRTL ? "Â–Â «·„Ã„Ê⁄… ›«—€…." : "This collection is empty."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
