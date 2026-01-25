import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { usePromptStore } from '@/stores/promptStore';
import { categories, models, Prompt } from '@/data/prompts';

interface CreatePromptFormProps {
  editPrompt?: Prompt;
  onClose?: () => void;
}

const CreatePromptForm = ({ editPrompt, onClose }: CreatePromptFormProps) => {
  const navigate = useNavigate();
  const { addPrompt, updatePrompt } = usePromptStore();
  
  const [formData, setFormData] = useState({
    title: editPrompt?.title || '',
    titleAr: editPrompt?.titleAr || '',
    prompt: editPrompt?.prompt || '',
    category: editPrompt?.category || '',
    model: editPrompt?.model || '',
    tags: editPrompt?.tags.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.prompt || !formData.category || !formData.model) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const promptData = {
      title: formData.title,
      titleAr: formData.titleAr,
      prompt: formData.prompt,
      category: formData.category as Prompt['category'],
      model: formData.model as Prompt['model'],
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editPrompt) {
      updatePrompt(editPrompt.id, promptData);
      toast({
        title: 'Prompt Updated',
        description: 'The pulse has been updated successfully!',
      });
      onClose?.();
    } else {
      addPrompt(promptData);
      toast({
        title: 'Prompt Created',
        description: 'New pulse added to the library!',
      });
      navigate('/admin');
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/admin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-foreground">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter prompt title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-secondary border-border focus:border-primary focus:ring-primary/20"
        />
      </div>

      {/* Arabic Title */}
      <div className="space-y-2">
        <Label htmlFor="titleAr" className="text-foreground">
          Arabic Title (العنوان بالعربية)
        </Label>
        <Input
          id="titleAr"
          placeholder="أدخل عنوان الموجه..."
          value={formData.titleAr}
          onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
          className="bg-secondary border-border focus:border-primary focus:ring-primary/20"
          dir="rtl"
        />
      </div>

      {/* Prompt Content */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-foreground">
          Prompt Content <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="prompt"
          placeholder="Write your AI prompt here..."
          value={formData.prompt}
          onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
          className="min-h-[200px] bg-secondary border-border focus:border-primary focus:ring-primary/20 resize-y"
        />
      </div>

      {/* Category and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="bg-secondary border-border focus:border-primary">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {categories.filter((c) => c.id !== 'all').map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Model */}
        <div className="space-y-2">
          <Label className="text-foreground">
            AI Model <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.model}
            onValueChange={(value) => setFormData({ ...formData, model: value })}
          >
            <SelectTrigger className="bg-secondary border-border focus:border-primary">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {models.filter((m) => m.id !== 'all').map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-foreground">
          Tags
        </Label>
        <Input
          id="tags"
          placeholder="Enter comma-separated tags (e.g., SEO, Marketing, AI)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="bg-secondary border-border focus:border-primary focus:ring-primary/20"
        />
        <p className="text-xs text-muted-foreground">Separate tags with commas</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {editPrompt ? 'Update Pulse' : 'Save Pulse'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="border-border hover:bg-secondary"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreatePromptForm;
