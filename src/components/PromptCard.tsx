import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Heart, MessageCircle, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/useLanguage';
import { Prompt } from '@/hooks/usePrompts';
import { cn } from '@/lib/utils';
import { useLike } from '@/hooks/useLike';
import AddToCollectionDialog from "@/components/AddToCollectionDialog";
import { getOptimizedImageUrl } from "@/lib/imageOptimizer";
import { useNavigate } from "react-router-dom";
import { getCategoryImage } from '@/lib/categoryImages';

const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  all: { en: "All", ar: "الكل" },
  coding: { en: "Coding", ar: "البرمجة" },
  writing: { en: "Writing", ar: "الكتابة" },
  art: { en: "Art & Design", ar: "الفن والتصميم" },
  marketing: { en: "Marketing", ar: "التسويق" },
};

const hasBadEncoding = (value?: string | null) => {
  if (!value) return false;
  return value.includes("") || value.includes("") || value.includes("ï¿½");
};

const PromptCard = ({ prompt, prioritizeImage = false }: { prompt: Prompt; prioritizeImage?: boolean }) => {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);
  const { isLiked, likesCount, toggleLike } = useLike(prompt.id, prompt.likes || 0);
  const navigate = useNavigate();

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    setIsCopied(true);
    toast({
      title: isRTL ? "تم النسخ!" : "Copied!",
      description: isRTL ? "تم نسخ النص إلى الحافظة." : "Prompt copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Fallback to stock category image if user didn't provide one
  const finalImageUrl = (prompt as { image?: string | null }).image || prompt.image_url || getCategoryImage(prompt.category, prompt.id);

  const handleRemix = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/submit?remix_id=${prompt.id}`);
  };

  const displayTitle =
    isRTL && prompt.title_ar && !hasBadEncoding(prompt.title_ar)
      ? prompt.title_ar
      : prompt.title;

  const categoryLabel = CATEGORY_LABELS[prompt.category]?.[isRTL ? "ar" : "en"] || prompt.category;

  // AI Model Display names
  const MODEL_LABELS: Record<string, string> = {
    "gpt-4": "GPT-4",
    "gpt-3.5": "GPT-3.5",
    "midjourney": "Midjourney",
    "dalle": "DALL·E",
    "stable-diffusion": "Stable Diff.",
    "claude": "Claude",
    "gemini": "Gemini",
  };

  const modelDisplay = MODEL_LABELS[prompt.ai_model] || prompt.ai_model?.toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full cursor-pointer"
      onClick={() => navigate(`/prompts/${prompt.id}`)}
    >
      <div className="group relative h-full bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={getOptimizedImageUrl(finalImageUrl, 400)}
            srcSet={`
                ${getOptimizedImageUrl(finalImageUrl, 300)} 300w,
                ${getOptimizedImageUrl(finalImageUrl, 600)} 600w
              `}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
            alt={prompt.title}
            loading={prioritizeImage ? "eager" : "lazy"}
            fetchPriority={prioritizeImage ? "high" : "auto"}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.parentElement!.style.backgroundColor = 'hsl(var(--primary) / 0.1)';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="backdrop-blur-md bg-background/30 text-xs font-normal border-white/10 text-white">
              {categoryLabel}
            </Badge>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3
              className={cn("font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors bidi-plaintext", isRTL && "text-right")}
              dir="auto"
            >
              {displayTitle}
            </h3>
            <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md" translate="no">
              {modelDisplay}
            </span>
          </div>

          <p
            className={cn("text-sm text-muted-foreground line-clamp-2 mb-3 flex-1 break-words whitespace-pre-wrap bidi-plaintext", isRTL && "text-right")}
            dir="auto"
          >
            {prompt.content}
          </p>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(event) => { event.stopPropagation(); toggleLike(); }}
                className={cn("gap-1.5 px-2 h-8", isLiked ? "text-red-500" : "text-muted-foreground")}
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                <span className="text-xs">{likesCount}</span>
              </Button>

              <Button variant="ghost" size="sm" className="gap-1.5 px-2 h-8 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">0</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemix}
                className="h-8 w-8 text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10 transition-colors"
                title={isRTL ? "عمل ريمكس (نسخة معدلة)" : "Remix this prompt"}
              >
                <GitFork className="w-4 h-4" />
              </Button>
              <AddToCollectionDialog
                promptId={prompt.id}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <BookmarkIcon />
                  </Button>
                }
              />

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

export default PromptCard;
