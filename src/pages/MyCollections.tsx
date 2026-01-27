import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import Header from "@/components/Header";
import SEO from "@/components/Seo";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Folder, Plus, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CollectionListItem {
  id: string;
  title: string;
  created_at: string;
  count: number;
}

export default function MyCollections() {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collections, isLoading } = useQuery({
    queryKey: ["my-collections-list", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*, collection_items(count)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((col: { id: string; title: string; created_at: string; collection_items: { count: number }[] }) => ({
        ...col,
        count: col.collection_items?.[0]?.count || 0,
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!newTitle.trim()) return;
      const { error } = await supabase.from("collections").insert({
        title: newTitle,
        user_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-collections-list"] });
      setNewTitle("");
      setIsDialogOpen(false);
      toast({
        title: isRTL ? "تم الإنشاء" : "Created",
        description: isRTL ? "تم إنشاء المجموعة بنجاح" : "Collection created successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-collections-list"] });
      toast({ title: isRTL ? "تم الحذف" : "Deleted", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title={isRTL ? "مجموعاتي" : "My Collections"} />
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8">
        <BackButton />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FolderOpen className="text-primary" />
              {isRTL ? "مجموعاتي" : "My Collections"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isRTL ? "نظّم موجهاتك المفضلة في مجلدات." : "Organize your favorite prompts into folders."}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? "مجموعة جديدة" : "New Collection"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent dir={isRTL ? "rtl" : "ltr"}>
              <DialogHeader>
                <DialogTitle>{isRTL ? "إنشاء مجموعة جديدة" : "Create New Collection"}</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isRTL ? "اسم المجموعة..." : "Collection name..."}
                />
                <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : isRTL ? "إضافة" : "Add"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-secondary/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : collections?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium">{isRTL ? "لا توجد مجموعات" : "No collections yet"}</h3>
            <p className="text-muted-foreground">
              {isRTL ? "أنشئ مجموعتك الأولى الآن!" : "Create your first collection now!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collections?.map((collection: CollectionListItem) => (
              <div
                key={collection.id}
                className="group relative bg-card border hover:border-primary/50 transition-all duration-300 rounded-xl p-5 hover:shadow-lg flex flex-col justify-between h-40"
              >
                <Link to={`/collections/${collection.id}`} className="absolute inset-0 z-0" />

                <div className="flex justify-between items-start z-10">
                  <Folder className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{isRTL ? "هل أنت متأكد؟" : "Are you sure?"}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {isRTL
                            ? "سيتم حذف المجموعة وجميع الروابط بداخلها. هذا الإجراء لا يمكن التراجع عنه."
                            : "This will delete the collection. This action cannot be undone."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(collection.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {isRTL ? "حذف" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="space-y-1 z-10 pointer-events-none">
                  <h3 className="font-bold text-lg truncate">{collection.title}</h3>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {collection.count} {isRTL ? "عنصر" : "items"}
                    </span>
                    <span>{format(new Date(collection.created_at), "MMM d")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
