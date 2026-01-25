import { useState, useCallback } from 'react';
import { Copy, Check, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Prompt, useUpdateLikes } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

const PromptCard = ({ prompt, index = 0 }: PromptCardProps) => {
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
    
    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? optimisticLikes + 1 : optimisticLikes - 1;
    
    setIsLiked(newIsLiked);
    setOptimisticLikes(newLikes);
    setIsLiking(true);
    
    try {
      await updateLikes.mutateAsync({ id: prompt.id, likes: newLikes });
    } catch (error) {
      // Rollback on error
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

  const displayTitle = isRTL && prompt.title_ar ? prompt.title_ar : prompt.title;
  // Shorter truncation on mobile
  const truncatedPrompt = prompt.content.length > 120 
    ? prompt.content.slice(0, 120) + '...' 
    : prompt.content;

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

  return (
    <div 
      className="group relative bg-card rounded-xl border border-border/50 p-4 sm:p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in active:scale-[0.99] sm:hover:-translate-y-1"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
    >
      {/* Gradient border on hover - hidden on mobile for performance */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block" />
      
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
          <Badge 
            variant="outline" 
            className={cn(
              "text-[10px] sm:text-xs font-medium shrink-0 transition-transform group-hover:scale-105 px-1.5 sm:px-2",
              getModelColor(prompt.ai_model)
            )}
          >
            {prompt.ai_model.toUpperCase()}
          </Badge>
        </div>

        {/* Tags - Horizontal scroll on mobile */}
        <div className={cn(
          "flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide -mx-1 px-1",
          isRTL && "flex-row-reverse"
        )}>
          {(prompt.tags ?? []).slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-md bg-secondary text-muted-foreground whitespace-nowrap flex-shrink-0"
            >
              {tag}
            </span>
          ))}
          {(prompt.tags?.length ?? 0) > 4 && (
            <span className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-muted-foreground">
              +{(prompt.tags?.length ?? 0) - 4}
            </span>
          )}
        </div>

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
              onClick={() => setIsExpanded(!isExpanded)}
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
            onClick={handleCopy}
            size="sm"
            isLoading={isCopying}
            variant={isCopied ? "success" : "glow"}
            className={cn(
              "h-10 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm",
              isRTL && "flex-row-reverse"
            )}
          >
            {isCopied ? (
              <>
                <Check className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isRTL ? "ml-1.5" : "mr-1.5")} />
                <span className="hidden xs:inline">{t.copied[language]}</span>
                <span className="xs:hidden">✓</span>
              </>
            ) : (
              <>
                <Copy className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isRTL ? "ml-1.5" : "mr-1.5")} />
                {t.copy[language]}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;