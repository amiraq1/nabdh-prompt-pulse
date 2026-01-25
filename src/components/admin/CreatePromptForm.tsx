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
import { Prompt, useAddPrompt, useUpdatePrompt } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CreatePromptFormProps {
  editPrompt?: Prompt;
  onClose?: () => void;
}

const categories = [
  { id: 'coding', en: 'Coding', ar: 'البرمجة' },
  { id: 'writing', en: 'Writing', ar: 'الكتابة' },
  { id: 'art', en: 'Art', ar: 'الفن' },
  { id: 'marketing', en: 'Marketing', ar: 'التسويق' },
];

const models = [
  { id: 'gpt-4', en: 'GPT-4', ar: 'GPT-4' },
  { id: 'gpt-3.5', en: 'GPT-3.5', ar: 'GPT-3.5' },
  { id: 'midjourney', en: 'Midjourney', ar: 'Midjourney' },
  { id: 'claude', en: 'Claude', ar: 'Claude' },
  { id: 'gemini', en: 'Gemini', ar: 'Gemini' },
];

const CreatePromptForm = ({ editPrompt, onClose }: CreatePromptFormProps) => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const t = translations;
  const addPrompt = useAddPrompt();
  const updatePrompt = useUpdatePrompt();
  
  const [formData, setFormData] = useState({
    title: editPrompt?.title || '',
    titleAr: editPrompt?.title_ar || '',
    content: editPrompt?.content || '',
    category: editPrompt?.category || '',
    aiModel: editPrompt?.ai_model || '',
    tags: editPrompt?.tags?.join(', ') || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category || !formData.aiModel) {
      toast({
        title: t.missingFields[language],
        description: t.fillRequired[language],
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const promptData = {
      title: formData.title,
      title_ar: formData.titleAr || null,
      content: formData.content,
      category: formData.category as Prompt['category'],
      ai_model: formData.aiModel as Prompt['ai_model'],
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editPrompt) {
        await updatePrompt.mutateAsync({ id: editPrompt.id, ...promptData });
        toast({
          title: t.promptUpdated[language],
          description: t.pulseUpdated[language],
        });
        onClose?.();
      } else {
        await addPrompt.mutateAsync(promptData);
        toast({
          title: t.promptCreated[language],
          description: t.newPulseAdded[language],
        });
        navigate('/admin');
      }
    } catch (error) {
      toast({
        title: t.error[language],
        description: t.failedToSave[language],
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
        <Label htmlFor="title" className={cn("text-foreground", isRTL && "block text-right")}>
          {t.promptTitle[language]} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t.enterTitle[language]}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={cn(
            "bg-secondary border-border focus:border-primary focus:ring-primary/20",
            isRTL && "text-right"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Arabic Title */}
      <div className="space-y-2">
        <Label htmlFor="titleAr" className={cn("text-foreground", isRTL && "block text-right")}>
          {t.arabicTitle[language]} (العنوان بالعربية)
        </Label>
        <Input
          id="titleAr"
          placeholder={t.enterArabicTitle[language]}
          value={formData.titleAr}
          onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
          className="bg-secondary border-border focus:border-primary focus:ring-primary/20 text-right"
          dir="rtl"
        />
      </div>

      {/* Prompt Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className={cn("text-foreground", isRTL && "block text-right")}>
          {t.promptContent[language]} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder={t.writePrompt[language]}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className={cn(
            "min-h-[200px] bg-secondary border-border focus:border-primary focus:ring-primary/20 resize-y",
            isRTL && "text-right"
          )}
          dir="ltr"
        />
      </div>

      {/* Category and Model Row */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", isRTL && "direction-rtl")}>
        {/* Category */}
        <div className="space-y-2">
          <Label className={cn("text-foreground", isRTL && "block text-right")}>
            {t.category[language]} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className={cn("bg-secondary border-border focus:border-primary", isRTL && "flex-row-reverse")}>
              <SelectValue placeholder={t.selectCategory[language]} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {language === 'ar' ? category.ar : category.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Model */}
        <div className="space-y-2">
          <Label className={cn("text-foreground", isRTL && "block text-right")}>
            {t.aiModel[language]} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.aiModel}
            onValueChange={(value) => setFormData({ ...formData, aiModel: value })}
          >
            <SelectTrigger className={cn("bg-secondary border-border focus:border-primary", isRTL && "flex-row-reverse")}>
              <SelectValue placeholder={t.selectAiModel[language]} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {language === 'ar' ? model.ar : model.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className={cn("text-foreground", isRTL && "block text-right")}>
          {t.tags[language]}
        </Label>
        <Input
          id="tags"
          placeholder={t.enterTags[language]}
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className={cn(
            "bg-secondary border-border focus:border-primary focus:ring-primary/20",
            isRTL && "text-right"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <p className={cn("text-xs text-muted-foreground", isRTL && "text-right")}>
          {t.separateTags[language]}
        </p>
      </div>

      {/* Actions */}
      <div className={cn("flex items-center gap-4 pt-4 border-t border-border", isRTL && "flex-row-reverse")}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn("bg-primary text-primary-foreground hover:bg-primary/90 glow-sm", isRTL && "flex-row-reverse")}
        >
          <Save className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
          {isSubmitting ? t.saving[language] : editPrompt ? t.updatePulse[language] : t.savePulse[language]}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className={cn("border-border hover:bg-secondary", isRTL && "flex-row-reverse")}
        >
          <X className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
          {t.cancel[language]}
        </Button>
      </div>
    </form>
  );
};

export default CreatePromptForm;
