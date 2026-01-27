import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus, Plus, Loader2, Check } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useLanguage } from "@/contexts/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddToCollectionDialogProps {
  promptId: string;
  trigger?: React.ReactNode;
}

interface CollectionSummary {
  id: string;
  title: string;
}

export default function AddToCollectionDialog({
  promptId,
  trigger,
}: AddToCollectionDialogProps) {
  const { isRTL } = useLanguage();
  const { collections, createCollection, isCreating, addToCollection } = useCollections(promptId);
  const [newTitle, setNewTitle] = useState("");
  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createCollection(newTitle, {
      onSuccess: () => {
        setNewTitle("");
        setIsCreatingMode(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger || (
          <Button variant="ghost" size="icon">
            <FolderPlus className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>{isRTL ? "حفظ في مجموعة" : "Save to Collection"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isCreatingMode ? (
            <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={isRTL ? "اسم المجموعة..." : "Collection name..."}
                autoFocus
              />
              <Button size="icon" onClick={handleCreate} disabled={isCreating}>
                {isCreating ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsCreatingMode(false)}>
                <span className="text-xl">×</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-dashed"
              onClick={() => setIsCreatingMode(true)}
            >
              <Plus className="w-4 h-4" />
              {isRTL ? "إنشاء مجموعة جديدة" : "Create New Collection"}
            </Button>
          )}

          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-1">
              {collections?.length === 0 && !isCreatingMode && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  {isRTL ? "ليس لديك مجموعات بعد." : "No collections yet."}
                </p>
              )}

              {collections?.map((collection: CollectionSummary) => (
                <Button
                  key={collection.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => {
                    addToCollection(collection.id);
                    setOpen(false);
                  }}
                >
                  <div className="bg-primary/10 p-2 rounded-md">
                    <FolderPlus className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{collection.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? "مجموعة خاصة" : "Private collection"}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
