import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Prompt } from '@/hooks/usePrompts';
import { useLike } from '@/hooks/useLike';
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

  const { isLiked, likesCount, toggleLike, isLoading: isLiking } = useLike(
    prompt.id,
    prompt.likes || 0
  );

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
        className="group relative bg-card rounded-xl border border-border/50 pad-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in will-change-transform min-h-[300px] md:min-h-[320px] flex flex-col justify-between h-full"
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
            <div className="absolute inset-0 image-overlay pointer-events-none" />
          </div>
        )}

        {/* Tags */}
        <TagsList tags={prompt.tags} isRTL={isRTL} />

        {/* Prompt Text */}
        <div className="relative mb-3 sm:mb-4">
          <div className="bg-secondary/50 rounded-lg p-3 sm:p-4 border border-border/30 transition-colors group-hover:bg-secondary/70">
            <p className={cn(
              "text-xs sm:text-sm text-foreground/80 leading-relaxed font-mono break-words",
              isRTL && "tech-ltr"
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
        <div
          className={cn(
            "mt-4 pt-4 border-t border-border/50 flex items-center justify-between",
            isRTL && "flex-row-reverse"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              toggleLike();
            }}
            disabled={isLiking}
            className={cn(
              "group/like gap-2 hover:bg-red-500/10 transition-colors",
              isLiked ? "text-red-500" : "text-foreground/70"
            )}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <div className="relative">
              <Heart
                className={cn(
                  "w-4 h-4 transition-all duration-300",
                  isLiked ? "fill-current scale-110" : "group-hover/like:scale-110"
                )}
              />
              <AnimatePresence>
                {isLiked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-red-500 rounded-full -z-10"
                  />
                )}
              </AnimatePresence>
            </div>

            <span className="tabular-nums font-medium">{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground/70 hover:text-foreground hover:bg-background/50"
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



