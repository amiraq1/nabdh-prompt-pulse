import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, X, AlertCircle, ImagePlus, Sparkles } from 'lucide-react';
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
import { useLanguage, translations } from '@/contexts/useLanguage';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface CreatePromptFormProps {
  editPrompt?: Prompt;
  onClose?: () => void;
}

const categories = [
  { id: 'coding', en: 'Coding', ar: 'برمجة' },
  { id: 'writing', en: 'Writing', ar: 'كتابة' },
  { id: 'art', en: 'Art', ar: 'فن' },
  { id: 'marketing', en: 'Marketing', ar: 'تسويق' },
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
  const [searchParams] = useSearchParams();
  const remixId = searchParams.get('remix_id');

  const [formData, setFormData] = useState({
    title: editPrompt?.title || '',
    titleAr: editPrompt?.title_ar || '',
    content: editPrompt?.content || '',
    category: editPrompt?.category || '',
    aiModel: editPrompt?.ai_model || '',
    tags: editPrompt?.tags?.join(', ') || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(editPrompt?.image_url || null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    if (!remixId) return;
    const fetchOriginalPrompt = async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', remixId)
        .single();

      if (data && !error) {
        setFormData({
          title: `${data.title} (Remix)`,
          titleAr: data.title_ar || '',
          content: data.content,
          category: data.category,
          aiModel: data.ai_model,
          tags: data.tags?.join(', ') || '',
        });
        setPreviewUrl(data.image_url || null);
        setParentId(data.id);
        toast({
          title: isRTL ? 'جاهز للتعديل!' : 'Ready to remix!',
          description: isRTL ? 'تم نسخ بيانات الموجه الأصلي.' : 'Loaded original prompt data.',
        });
      }
    };

    fetchOriginalPrompt();
  }, [remixId, isRTL]);

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'title':
        if (!value.trim()) return isRTL ? 'ط§ظ„ط¹ظ†ظˆط§ظ† ظ…ط·ظ„ظˆط¨' : 'Title is required';
        if (value.length < 3) return isRTL ? 'ط§ظ„ط¹ظ†ظˆط§ظ† ظ‚طµظٹط± ط¬ط¯ط§ظ‹' : 'Title is too short';
        if (value.length > 100) return isRTL ? 'ط§ظ„ط¹ظ†ظˆط§ظ† ط·ظˆظٹظ„ ط¬ط¯ط§ظ‹' : 'Title is too long';
        return null;
      case 'content':
        if (!value.trim()) return isRTL ? 'ظ…ط­طھظˆظ‰ ط§ظ„ظ…ظˆط¬ظ‡ ظ…ط·ظ„ظˆط¨' : 'Prompt content is required';
        if (value.length < 10) return isRTL ? 'ط§ظ„ظ…ط­طھظˆظ‰ ظ‚طµظٹط± ط¬ط¯ط§ظ‹' : 'Content is too short';
        return null;
      case 'category':
        if (!value) return isRTL ? 'ط§ط®طھط± ط§ظ„ظپط¦ط©' : 'Select a category';
        return null;
      case 'aiModel':
        if (!value) return isRTL ? 'ط§ط®طھط± ظ†ظ…ظˆط°ط¬ ط§ظ„ط°ظƒط§ط،' : 'Select an AI model';
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
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`; // اسم فريد للملف
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // الحصول على الرابط العلني للصورة
      const { data } = supabase.storage
        .from('prompt-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: isRTL ? 'خطأ في الرفع' : 'Upload Error',
        description: isRTL ? 'فشل رفع الصورة' : 'Failed to upload image.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleGenerateImage = async () => {
    const prompt = imagePrompt.trim();
    if (!prompt) return;

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt-image', {
        body: { prompt },
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.image_url;
      if (!imageUrl) {
        throw new Error('No image URL returned');
      }

      setGeneratedImageUrl(imageUrl);
      setPreviewUrl(imageUrl);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: t.error[language],
        description: isRTL ? 'فشل توليد الصورة. حاول مرة أخرى.' : 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
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
      let imageUrlToSave = editPrompt?.image_url || null; // الافتراضي: الصورة القديمة أو لا شيء

      if (generatedImageUrl) {
        imageUrlToSave = generatedImageUrl;
      }

      // إذا تم اختيار ملف جديد، قم برفعه
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrlToSave = uploadedUrl;
        } else {
          // إذا فشل الرفع، توقف
          setIsSubmitting(false);
          return;
        }
      }

      const promptData = {
        title: formData.title.trim(),
        title_ar: formData.titleAr.trim() || null,
        content: formData.content.trim(),
        category: formData.category as Prompt['category'],
        ai_model: formData.aiModel as Prompt['ai_model'],
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        image_url: imageUrlToSave, // <-- إضافة الرابط هنا
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
            "bg-secondary border-border focus:border-primary focus:ring-primary/20 transition-colors duration-base ease-out-smooth",
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
          {t.arabicTitle[language]} (ط§ظ„ط¹ظ†ظˆط§ظ† ط¨ط§ظ„ط¹ط±ط¨ظٹط©)
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
            "min-h-[200px] bg-secondary border-border focus:border-primary focus:ring-primary/20 resize-y transition-colors duration-base ease-out-smooth",
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
          {formData.content.length} {isRTL ? 'ط­ط±ظپ' : 'characters'}
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
              "bg-secondary border-border focus:border-primary transition-colors duration-base ease-out-smooth",
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
              "bg-secondary border-border focus:border-primary transition-colors duration-base ease-out-smooth",
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
      {/* Image Generator */}
      <div className="space-y-2">
        <Label htmlFor="imagePrompt" className={cn("text-foreground", isRTL && "block text-right")}>
          {t.imageGenerator[language]}
        </Label>
        <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
          <Textarea
            id="imagePrompt"
            placeholder={t.imagePromptPlaceholder[language]}
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            className={cn(
              "min-h-[120px] bg-background/60 border-border focus:border-primary focus:ring-primary/20 resize-y bidi-plaintext",
              isRTL && "text-right"
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <div className={cn("flex flex-col sm:flex-row sm:items-center gap-2", isRTL && "sm:flex-row-reverse")}>
            <Button
              type="button"
              variant="soft"
              isLoading={isGenerating}
              loadingText={t.generating[language]}
              onClick={handleGenerateImage}
              disabled={isGenerating || !imagePrompt.trim()}
              className={cn("gap-2", isRTL && "flex-row-reverse")}
            >
              <Sparkles className="w-4 h-4" />
              {t.generateImage[language]}
            </Button>
            <p className={cn("text-xs text-muted-foreground", isRTL && "text-right")}>
              {isRTL ? "سيتم استخدام الصورة الناتجة كصورة للموجه." : "Generated image will be used as the prompt image."}
            </p>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label className={cn("text-foreground", isRTL && "block text-right")}>
          {isRTL ? 'صورة توضيحية (اختياري)' : 'Example Image (Optional)'}
        </Label>

        <div className="flex items-start gap-4">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) { // التحقق من الحجم (مثلاً 5MB)
                  toast({ title: 'File too large', description: 'Max 5MB', variant: 'destructive' });
                  return;
                }
                setImageFile(file);
                setGeneratedImageUrl(null);
                setPreviewUrl(URL.createObjectURL(file)); // إنشاء رابط معاينة محلي
              }
            }}
          />

          {/* Upload Button or Preview */}
          {!previewUrl ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-32 w-full border-dashed flex flex-col gap-2 text-muted-foreground hover:text-foreground"
            >
              <ImagePlus className="w-8 h-8" />
              <span>{isRTL ? 'اضغط لرفع صورة' : 'Click to upload image'}</span>
            </Button>
          ) : (
            <div className="relative w-full h-64 rounded-md overflow-hidden border border-border group">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              {/* زر حذف الصورة */}
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setGeneratedImageUrl(null);
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
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
          disabled={isSubmitting || hasErrors}
          isLoading={isSubmitting}
          loadingText={t.saving[language]}
          variant="glow"
          className={cn("gap-2", isRTL && "flex-row-reverse")}
        >
          <Save className="w-4 h-4" />
          {editPrompt ? t.updatePulse[language] : t.savePulse[language]}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className={cn("border-border hover:bg-secondary gap-2", isRTL && "flex-row-reverse")}
        >
          <X className="w-4 h-4" />
          {t.cancel[language]}
        </Button>
      </div>
    </form>
  );
};

export default CreatePromptForm;



