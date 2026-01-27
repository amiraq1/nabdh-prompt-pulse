import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { usePrompts, useDeletePrompt, Prompt } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/useLanguage';
import CreatePromptForm from '@/components/admin/CreatePromptForm';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const t = translations;
  const { data, isLoading } = usePrompts();
  const prompts = data?.pages.flatMap((page) => page) ?? [];
  const deletePromptMutation = useDeletePrompt();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [deletingPrompt, setDeletingPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.ai_model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (deletingPrompt) {
      try {
        await deletePromptMutation.mutateAsync(deletingPrompt.id);
        toast({
          title: t.promptDeleted[language],
          description: t.pulseRemoved[language],
        });
      } catch (error) {
        toast({
          title: t.error[language],
          description: t.failedToDelete[language],
          variant: 'destructive',
        });
      }
      setDeletingPrompt(null);
    }
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case 'gpt-4': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'gpt-3.5': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'midjourney': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'claude': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'gemini': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      coding: { en: 'Coding', ar: 'البرمجة' },
      writing: { en: 'Writing', ar: 'الكتابة' },
      art: { en: 'Art', ar: 'الفن' },
      marketing: { en: 'Marketing', ar: 'التسويق' },
    };
    return labels[category]?.[language] || category;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coding': return 'bg-cyan-500/20 text-cyan-400';
      case 'writing': return 'bg-amber-500/20 text-amber-400';
      case 'art': return 'bg-pink-500/20 text-pink-400';
      case 'marketing': return 'bg-violet-500/20 text-violet-400';
      default: return 'bg-primary/20 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        isRTL && "sm:flex-row-reverse"
      )}>
        <div className={isRTL ? "text-right" : ""}>
          <h1 className="text-2xl font-bold text-foreground">{t.dashboard[language]}</h1>
          <p className="text-muted-foreground">{t.manageLibrary[language]}</p>
        </div>
        <Button
          onClick={() => navigate('/admin/create')}
          className={cn("bg-primary text-primary-foreground hover:bg-primary/90 glow-sm gap-2", isRTL && "flex-row-reverse")}
        >
          <Plus className="w-4 h-4" />
          {t.addNewPrompt[language]}
        </Button>
      </div>

      {/* Advanced Stats Cards */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6", isRTL && "direction-rtl")}>
        {[
          {
            title: t.totalPrompts[language],
            value: prompts.length,
            trend: "+12%",
            positive: true,
            icon: "📚",
            desc: "Active prompts"
          },
          {
            title: t.coding[language],
            value: prompts.filter(p => p.category === 'coding').length,
            trend: "+5%",
            positive: true,
            icon: "💻",
            desc: "Coding category"
          },
          {
            title: t.totalLikes[language],
            value: prompts.reduce((acc, p) => acc + p.likes, 0),
            trend: "+28%",
            positive: true,
            icon: "❤️",
            desc: "User engagement"
          },
          {
            title: "Performance Score",
            value: "98/100",
            trend: "+2",
            positive: true,
            icon: "⚡",
            desc: "System health"
          }
        ].map((stat, i) => (
          <div key={i} className="group bg-card rounded-xl border border-border/60 p-5 hover:border-primary/30 transition-[box-shadow,border-color,transform] duration-slow ease-out-smooth hover:shadow-lg hover:shadow-primary/5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.trend}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground/50">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={cn("relative max-w-md", isRTL && "me-auto")}>
        <Search className={cn(
          "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
          isRTL ? "right-3" : "left-3"
        )} />
        <Input
          placeholder={t.searchPlaceholder[language]}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "bg-secondary border-border",
            isRTL ? "pr-10 text-right" : "pl-10"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className={cn("text-muted-foreground", isRTL && "text-right")}>{t.title[language]}</TableHead>
                <TableHead className={cn("text-muted-foreground", isRTL && "text-right")}>{t.category[language]}</TableHead>
                <TableHead className={cn("text-muted-foreground", isRTL && "text-right")}>{t.aiModel[language]}</TableHead>
                <TableHead className={cn("text-muted-foreground hidden md:table-cell", isRTL && "text-right")}>{t.tags[language]}</TableHead>
                <TableHead className={cn("text-muted-foreground", isRTL ? "text-left" : "text-right")}>{t.actions[language]}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrompts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t.noPromptsFound[language]}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrompts.map((prompt) => (
                  <TableRow key={prompt.id} className="border-border hover:bg-secondary/50">
                    <TableCell className={cn("font-medium text-foreground max-w-[200px] truncate", isRTL && "text-right")}>
                      {isRTL && prompt.title_ar ? prompt.title_ar : prompt.title}
                    </TableCell>
                    <TableCell className={isRTL ? "text-right" : ""}>
                      <Badge variant="secondary" className={cn("capitalize", getCategoryColor(prompt.category))}>
                        {getCategoryLabel(prompt.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className={isRTL ? "text-right" : ""}>
                      <Badge variant="outline" className={cn("uppercase text-xs", getModelColor(prompt.ai_model))}>
                        {prompt.ai_model}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn("hidden md:table-cell", isRTL && "text-right")}>
                      <div className={cn("flex flex-wrap gap-1", isRTL && "flex-row-reverse justify-end")}>
                        {(prompt.tags ?? []).slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        {(prompt.tags ?? []).length > 2 && (
                          <span className="text-xs text-muted-foreground">+{(prompt.tags ?? []).length - 2}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={isRTL ? "text-left" : "text-right"}>
                      <div className={cn("flex items-center gap-2", isRTL ? "justify-start" : "justify-end")}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingPrompt(prompt)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingPrompt(prompt)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={cn("text-foreground", isRTL && "text-right")}>{t.editPrompt[language]}</DialogTitle>
          </DialogHeader>
          {editingPrompt && (
            <CreatePromptForm
              editPrompt={editingPrompt}
              onClose={() => setEditingPrompt(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPrompt} onOpenChange={() => setDeletingPrompt(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className={cn("text-foreground", isRTL && "text-right")}>
              {t.deletePrompt[language]}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn("text-muted-foreground", isRTL && "text-right")}>
              {t.deleteConfirmation[language]} "{deletingPrompt?.title}" {t.fromLibrary[language]}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse gap-2" : ""}>
            <AlertDialogCancel className="border-border hover:bg-secondary">{t.cancel[language]}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.delete[language]}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;

