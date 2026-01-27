import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import Header from "@/components/Header";
import PromptGrid from "@/components/PromptGrid";
import CategoryFilter from "@/components/CategoryFilter";
import SEO from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Index() {
  const { isRTL } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setShouldFetch(true));
      return () => win.cancelIdleCallback?.(id);
    }

    const timeoutId = window.setTimeout(() => setShouldFetch(true), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts", selectedCategory, debouncedSearch],
    enabled: shouldFetch,
    queryFn: async () => {
      let query = supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(0, 11);

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (debouncedSearch) {
        query = query.or(
          `title.ilike.%${debouncedSearch}%,content.ilike.%${debouncedSearch}%,title_ar.ilike.%${debouncedSearch}%`,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background relative">
      <SEO title={isRTL ? "��������" : "Home"} />

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {isRTL ? "����� ���� ����� ������ ���������" : "Discover Top AI Prompts"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isRTL
              ? "����� ���� �������� �� ChatGPT� Midjourney� �������."
              : "A massive library to supercharge your ChatGPT, Midjourney, and more."}
          </p>

          <div className="relative max-w-lg mx-auto mt-6">
            <Search
              className={`absolute top-3.5 h-5 w-5 text-muted-foreground ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <Input
              placeholder={
                isRTL
                  ? "���� �� ���� (�����: ����ޡ ������)..."
                  : "Search prompts (e.g., Marketing, Python)..."
              }
              className={`h-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary/50 ${
                isRTL ? "pr-10" : "pl-10"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b border-border/40">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <PromptGrid prompts={prompts || []} isLoading={isLoading} />
      </main>
    </div>
  );
}
