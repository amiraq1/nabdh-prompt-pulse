import { useState } from 'react';
import { Copy, Check, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Prompt, useUpdateLikes } from '@/hooks/usePrompts';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard = ({ prompt }: PromptCardProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const updateLikes = useUpdateLikes();

  const handleCopy = async () => {
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
    }
  };

  const handleLike = () => {
    const newLikes = isLiked ? prompt.likes - 1 : prompt.likes + 1;
    setIsLiked(!isLiked);
    updateLikes.mutate({ id: prompt.id, likes: newLikes });
  };

  const displayTitle = isRTL && prompt.title_ar ? prompt.title_ar : prompt.title;
  const truncatedPrompt = prompt.content.length > 150 
    ? prompt.content.slice(0, 150) + '...' 
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
    <div className="group relative bg-card rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in">
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className={cn(
          "flex items-start justify-between gap-4 mb-3",
          isRTL && "flex-row-reverse"
        )}>
          <h3 className={cn(
            "font-semibold text-foreground group-hover:text-primary transition-colors",
            isRTL && "text-right"
          )}>
            {displayTitle}
          </h3>
          <Badge variant="outline" className={cn("text-xs font-medium shrink-0", getModelColor(prompt.ai_model))}>
            {prompt.ai_model.toUpperCase()}
          </Badge>
        </div>

        {/* Tags */}
        <div className={cn("flex flex-wrap gap-2 mb-4", isRTL && "flex-row-reverse")}>
          {(prompt.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Prompt Text */}
        <div className="relative mb-4">
          <div className="bg-secondary/50 rounded-lg p-4 border border-border/30">
            <p className={cn(
              "text-sm text-foreground/80 leading-relaxed font-mono",
              isRTL && "text-right"
            )} dir="ltr">
              {isExpanded ? prompt.content : truncatedPrompt}
            </p>
          </div>
          
          {prompt.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 transition-colors",
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
          "flex items-center justify-between",
          isRTL && "flex-row-reverse"
        )}>
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              isLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400",
              isRTL && "flex-row-reverse"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            <span>{prompt.likes}</span>
          </button>

          <Button
            onClick={handleCopy}
            size="sm"
            className={cn(
              "font-medium transition-all",
              isCopied 
                ? "bg-emerald-500 hover:bg-emerald-500 text-white" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground glow-sm",
              isRTL && "flex-row-reverse"
            )}
          >
            {isCopied ? (
              <>
                <Check className={cn("w-4 h-4", isRTL ? "ml-1.5" : "mr-1.5")} />
                {t.copied[language]}
              </>
            ) : (
              <>
                <Copy className={cn("w-4 h-4", isRTL ? "ml-1.5" : "mr-1.5")} />
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
