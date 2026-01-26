import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';
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
import { supabase } from "@/integrations/supabase/client";

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

interface FieldError {
  field: string;
  message: string;
}

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(editPrompt?.image_url || null);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'title':
        if (!value.trim()) return isRTL ? 'العنوان مطلوب' : 'Title is required';
        if (value.length < 3) return isRTL ? 'العنوان قصير جداً' : 'Title is too short';
        if (value.length > 100) return isRTL ? 'العنوان طويل جداً' : 'Title is too long';
        return null;
      case 'content':
        if (!value.trim()) return isRTL ? 'محتوى الموجه مطلوب' : 'Prompt content is required';
        if (value.length < 10) return isRTL ? 'المحتوى قصير جداً' : 'Content is too short';
        return null;
      case 'category':
        if (!value) return isRTL ? 'اختر الفئة' : 'Select a category';
        return null;
      case 'aiModel':
        if (!value) return isRTL ? 'اختر نموذج الذكاء' : 'Select an AI model';
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FieldError[] = [];

    const titleError = validateField('title', formData.title);
    if (titleError) newErrors.push({ field: 'title', message: titleError });

    const contentError = validateField('content', formData.content);
    if (contentError) newErrors.push({ field: 'content', message: contentError });

    const categoryError = validateField('category', formData.category);
    if (categoryError) newErrors.push({ field: 'category', message: categoryError });

    const modelError = validateField('aiModel', formData.aiModel);
    if (modelError) newErrors.push({ field: 'aiModel', message: modelError });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const value = formData[field as keyof typeof formData];
    const error = validateField(field, value);

    if (error) {
      setErrors(prev => [...prev.filter(e => e.field !== field), { field, message: error }]);
    } else {
      setErrors(prev => prev.filter(e => e.field !== field));
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return touched[field] ? errors.find(e => e.field === field)?.message : undefined;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('prompt-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: isRTL ? 'خطأ في الرفع' : 'Upload Error',
        description: isRTL ? 'فشل رفع الصورة' : 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setImageFile(file);
    // Create a local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ title: true, content: true, category: true, aiModel: true });

    if (!validateForm()) {
      toast({
        title: t.missingFields[language],
        description: t.fillRequired[language],
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = editPrompt?.image_url || null;

      // Logic to handle image:
      // 1. If previewUrl is null, it means user removed the image.
      if (!previewUrl) {
        imageUrl = null;
      }
      // 2. If there is a new imageFile, upload it.
      else if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      // 3. Otherwise (previewUrl exists, no new imageFile), keep existing imageUrl (already set).

      const promptData = {
        title: formData.title.trim(),
        title_ar: formData.titleAr.trim() || null,
        content: formData.content.trim(),
        category: formData.category as Prompt['category'],
        ai_model: formData.aiModel as Prompt['ai_model'],
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        image_url: imageUrl,
      };

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
      console.error(error);
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

  const hasErrors = errors.length > 0;

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
          onBlur={() => handleBlur('title')}
          className={cn(
            "bg-secondary border-border focus:border-primary focus:ring-primary/20 transition-all",
            isRTL && "text-right",
            getFieldError('title') && "border-destructive focus:border-destructive animate-shake"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-invalid={!!getFieldError('title')}
          aria-describedby={getFieldError('title') ? 'title-error' : undefined}
        />
        {getFieldError('title') && (
          <p id="title-error" className={cn("text-sm text-destructive flex items-center gap-1", isRTL && "flex-row-reverse")}>
            <AlertCircle className="w-3 h-3" />
            {getFieldError('title')}
          </p>
        )}
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
          onBlur={() => handleBlur('content')}
          className={cn(
            "min-h-[200px] bg-secondary border-border focus:border-primary focus:ring-primary/20 resize-y transition-all",
            isRTL && "text-right",
            getFieldError('content') && "border-destructive focus:border-destructive animate-shake"
          )}
          dir="ltr"
          aria-invalid={!!getFieldError('content')}
        />
        {getFieldError('content') && (
          <p className={cn("text-sm text-destructive flex items-center gap-1", isRTL && "flex-row-reverse")}>
            <AlertCircle className="w-3 h-3" />
            {getFieldError('content')}
          </p>
        )}
        <p className={cn("text-xs text-muted-foreground", isRTL && "text-right")}>
          {formData.content.length} {isRTL ? 'حرف' : 'characters'}
        </p>
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
            onValueChange={(value) => {
              setFormData({ ...formData, category: value });
              setTouched({ ...touched, category: true });
              setErrors(prev => prev.filter(e => e.field !== 'category'));
            }}
          >
            <SelectTrigger className={cn(
              "bg-secondary border-border focus:border-primary transition-all",
              isRTL && "flex-row-reverse",
              getFieldError('category') && "border-destructive"
            )}>
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
          {getFieldError('category') && (
            <p className={cn("text-sm text-destructive flex items-center gap-1", isRTL && "flex-row-reverse")}>
              <AlertCircle className="w-3 h-3" />
              {getFieldError('category')}
            </p>
          )}
        </div>

        {/* AI Model */}
        <div className="space-y-2">
          <Label className={cn("text-foreground", isRTL && "block text-right")}>
            {t.aiModel[language]} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.aiModel}
            onValueChange={(value) => {
              setFormData({ ...formData, aiModel: value });
              setTouched({ ...touched, aiModel: true });
              setErrors(prev => prev.filter(e => e.field !== 'aiModel'));
            }}
          >
            <SelectTrigger className={cn(
              "bg-secondary border-border focus:border-primary transition-all",
              isRTL && "flex-row-reverse",
              getFieldError('aiModel') && "border-destructive"
            )}>
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
          {getFieldError('aiModel') && (
            <p className={cn("text-sm text-destructive flex items-center gap-1", isRTL && "flex-row-reverse")}>
              <AlertCircle className="w-3 h-3" />
              {getFieldError('aiModel')}
            </p>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className={cn("text-foreground", isRTL && "block text-right")}>
          {isRTL ? 'صورة الموجه' : 'Prompt Image'}
        </Label>
        <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
          {previewUrl && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
              <img src={previewUrl} alt="Prompt" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setImageFile(null);
                }}
                className="absolute top-0 right-0 p-1 bg-destructive text-white rounded-bl-lg hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex-1">
            <label
              htmlFor="image-upload"
              className={cn(
                "flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors",
                isUploading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                {isUploading ? (
                  <span className="text-xs animate-pulse">{isRTL ? 'جاري الرفع...' : 'Uploading...'}</span>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-xs">{isRTL ? 'اضغط لرفع صورة' : 'Click to upload'}</span>
                  </>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
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
          disabled={isSubmitting || hasErrors || isUploading}
          isLoading={isSubmitting}
          loadingText={t.saving[language]}
          variant="glow"
          className={cn(isRTL && "flex-row-reverse")}
        >
          <Save className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
          {editPrompt ? t.updatePulse[language] : t.savePulse[language]}
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
