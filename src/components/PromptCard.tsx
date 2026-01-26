import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Prompt, useUpdateLikes } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/useLanguage';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}
const ModelBadge = memo(({ model }: { model: string }) => {
  const getModelVariant = (model: string): BadgeProps['variant'] => {
    switch (model) {
      case 'gpt-4': return 'gpt4';
      case 'gpt-3.5': return 'gpt35';
      case 'midjourney': return 'midjourney';
      case 'claude': return 'claude';
      case 'gemini': return 'gemini';
      default: return 'default';
    }
  };

  return (
    <Badge
      variant={getModelVariant(model)}
      size="sm"
      className="shrink-0 transition-transform group-hover:scale-105"
    >
      {model.toUpperCase()}
    </Badge>
  );
});
ModelBadge.displayName = 'ModelBadge';

// Memoized tags list
const TagsList = memo(({ tags, isRTL }: { tags: string[] | null; isRTL: boolean }) => {
  const visibleTags = (tags ?? []).slice(0, 4);
  const extraCount = (tags?.length ?? 0) - 4;

  if (visibleTags.length === 0) return null;

  return (
    <div className={cn(
      "flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide -mx-1 px-1",
      isRTL && "flex-row-reverse"
    )}>
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-md bg-secondary text-muted-foreground whitespace-nowrap flex-shrink-0"
        >
          {tag}
        </span>
      ))}
      {extraCount > 0 && (
        <span className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-muted-foreground">
          +{extraCount}
        </span>
      )}
    </div>
  );
});
TagsList.displayName = 'TagsList';

const PromptCard = memo(({ prompt, index = 0 }: PromptCardProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  // Optimistic UI for likes
  const [optimisticLikes, setOptimisticLikes] = useState(prompt.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const updateLikes = useUpdateLikes();

  const handleCopy = useCallback(async () => {
    if (isCopying) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(prompt.content);
      setIsCopied(true);
      toast({
        title: t.copied[language],
        description: isRTL ? 'تم نسخ الموجه إلى الحافظة' : 'Prompt copied to clipboard',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: isRTL ? 'فشل النسخ' : 'Failed to copy',
        description: isRTL ? 'حاول مرة أخرى' : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsCopying(false);
    }
  }, [prompt.content, isCopying, language, isRTL, t]);

  const handleLike = useCallback(async () => {
    if (isLiking) return;

    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? optimisticLikes + 1 : optimisticLikes - 1;

    setIsLiked(newIsLiked);
    setOptimisticLikes(newLikes);
    setIsLiking(true);

    try {
      await updateLikes.mutateAsync({ id: prompt.id, likes: newLikes });
    } catch (error) {
      setIsLiked(!newIsLiked);
      setOptimisticLikes(optimisticLikes);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث الإعجاب' : 'Failed to update like',
        variant: 'destructive',
      });
    } finally {
      setIsLiking(false);
    }
  }, [isLiked, optimisticLikes, isLiking, prompt.id, updateLikes, isRTL]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const displayTitle = isRTL && prompt.title_ar ? prompt.title_ar : prompt.title;
  const truncatedPrompt = prompt.content.length > 120
    ? prompt.content.slice(0, 120) + '...'
    : prompt.content;

  // Stagger animation delay (capped for performance)
  const animationDelay = Math.min(index * 0.05, 0.3);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <div
        className="group relative bg-card rounded-xl border border-border/50 p-4 sm:p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in will-change-transform min-h-[280px] flex flex-col justify-between"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        {/* Glow hover effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
        {/* Header */}
        <div className={cn(
          "flex items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3",
          isRTL && "flex-row-reverse"
        )}>
          <h3 className={cn(
            "font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2",
            isRTL && "text-right"
          )}>
            {displayTitle}
          </h3>
          <ModelBadge model={prompt.ai_model} />
        </div>

        {/* Image Display */}
        {prompt.image_url && (
          <div className="mb-4 rounded-lg overflow-hidden border border-border/30 bg-secondary/50 relative aspect-video">
            <img
              src={prompt.image_url}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Tags */}
        <TagsList tags={prompt.tags} isRTL={isRTL} />

        {/* Prompt Text */}
        <div className="relative mb-3 sm:mb-4">
          <div className="bg-secondary/50 rounded-lg p-3 sm:p-4 border border-border/30 transition-colors group-hover:bg-secondary/70">
            <p className={cn(
              "text-xs sm:text-sm text-foreground/80 leading-relaxed font-mono break-words",
              isRTL && "text-right"
            )} dir="ltr">
              {isExpanded ? prompt.content : truncatedPrompt}
            </p>
          </div>

          {prompt.content.length > 120 && (
            <button
              onClick={toggleExpand}
              className={cn(
                "flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline touch-target justify-center w-full sm:w-auto sm:justify-start",
                isRTL && "flex-row-reverse"
              )}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  {t.showLess[language]}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  {t.showMore[language]}
                </>
              )}
            </button>
          )}
        </div>

        {/* Actions */}
        <div className={cn(
          "flex items-center justify-between gap-2",
          isRTL && "flex-row-reverse"
        )}>
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
              "flex items-center gap-1.5 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-3 py-2 -ml-3 touch-target",
              isLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400 active:text-red-400",
              isLiking && "opacity-70",
              isRTL && "flex-row-reverse -ml-0 -mr-3"
            )}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-transform",
              isLiked && "fill-current scale-110"
            )} />
            <span className="tabular-nums font-medium">{optimisticLikes}</span>
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/50"
            onClick={handleCopy}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
        </div>
      </div>
    </motion.div>
  );
});

PromptCard.displayName = 'PromptCard';

export default PromptCard;



