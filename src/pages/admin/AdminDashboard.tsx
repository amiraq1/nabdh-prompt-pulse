import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
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
import { usePromptStore } from '@/stores/promptStore';
import { Prompt } from '@/data/prompts';
import CreatePromptForm from '@/components/admin/CreatePromptForm';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { prompts, deletePrompt } = usePromptStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [deletingPrompt, setDeletingPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deletingPrompt) {
      deletePrompt(deletingPrompt.id);
      toast({
        title: 'Prompt Deleted',
        description: 'The pulse has been removed from the library.',
      });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your prompt library</p>
        </div>
        <Button
          onClick={() => navigate('/admin/create')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Prompt
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-foreground">{prompts.length}</div>
          <div className="text-sm text-muted-foreground">Total Prompts</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-foreground">
            {prompts.filter((p) => p.category === 'coding').length}
          </div>
          <div className="text-sm text-muted-foreground">Coding</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-foreground">
            {prompts.filter((p) => p.category === 'art').length}
          </div>
          <div className="text-sm text-muted-foreground">Art</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="text-2xl font-bold text-foreground">
            {prompts.reduce((acc, p) => acc + p.likes, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Likes</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Title</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">AI Model</TableHead>
              <TableHead className="text-muted-foreground hidden md:table-cell">Tags</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No prompts found
                </TableCell>
              </TableRow>
            ) : (
              filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id} className="border-border hover:bg-secondary/50">
                  <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                    {prompt.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("capitalize", getCategoryColor(prompt.category))}>
                      {prompt.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("uppercase text-xs", getModelColor(prompt.model))}>
                      {prompt.model}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {prompt.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{prompt.tags.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
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
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Prompt</DialogTitle>
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
            <AlertDialogTitle className="text-foreground">Delete Prompt?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete "{deletingPrompt?.title}" from the library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
