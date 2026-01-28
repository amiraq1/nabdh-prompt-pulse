import { motion } from 'framer-motion';
import { Star, TrendingUp, Flame, Crown, Copy, Check, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeaturedPrompts } from '@/hooks/useFeaturedPrompts';
import { useLanguage } from '@/contexts/useLanguage';
import { useLike } from '@/hooks/useLike';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/imageOptimizer';
import { getCategoryImage } from '@/lib/categoryImages';

const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
    coding: { en: "Coding", ar: "البرمجة" },
    writing: { en: "Writing", ar: "الكتابة" },
    art: { en: "Art & Design", ar: "الفن والتصميم" },
    marketing: { en: "Marketing", ar: "التسويق" },
};

const FeaturedCard = ({ prompt, index }: { prompt: any; index: number }) => {
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);
    const { isLiked, likesCount, toggleLike } = useLike(prompt.id, prompt.likes || 0);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(prompt.content);
        setIsCopied(true);
        toast({
            title: isRTL ? "تم النسخ!" : "Copied!",
            description: isRTL ? "تم نسخ النص إلى الحافظة." : "Prompt copied to clipboard.",
        });
        setTimeout(() => setIsCopied(false), 2000);
    };

    const displayTitle = isRTL && prompt.title_ar ? prompt.title_ar : prompt.title;
    const categoryLabel = CATEGORY_LABELS[prompt.category]?.[isRTL ? "ar" : "en"] || prompt.category;
    const finalImageUrl = prompt.image || prompt.image_url || getCategoryImage(prompt.category, prompt.id);

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

    // Rank badge icons
    const RankIcon = index === 0 ? Crown : index === 1 ? Flame : index === 2 ? Star : TrendingUp;
    const rankColors = [
        "from-yellow-500 to-amber-600", // Gold
        "from-orange-500 to-red-500",   // Fire
        "from-blue-500 to-purple-500",  // Star
        "from-emerald-500 to-teal-500", // Trending
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => navigate(`/prompts/${prompt.id}`)}
        >
            <div className="group relative h-full bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                {/* Rank Badge */}
                <div className={cn(
                    "absolute top-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-lg",
                    `bg-gradient-to-r ${rankColors[Math.min(index, 3)]}`,
                    isRTL ? "right-3" : "left-3"
                )} translate="no">
                    <RankIcon className="w-4 h-4" />
                    <span>#{index + 1}</span>
                </div>

                {/* Image Section */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <img
                        src={getOptimizedImageUrl(finalImageUrl, 640)}
                        alt={prompt.title}
                        loading="lazy"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            // If fallback image also fails, show a solid color
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.backgroundColor = 'hsl(var(--primary) / 0.1)';
                        }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />

                    {/* Category badge */}
                    <div className={cn("absolute bottom-3", isRTL ? "right-3" : "left-3")}>
                        <Badge className="backdrop-blur-md bg-primary/80 text-primary-foreground border-0 shadow-lg">
                            {categoryLabel}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-3">
                    <h3
                        className={cn(
                            "font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors bidi-plaintext",
                            isRTL && "text-right"
                        )}
                        dir="auto"
                    >
                        {displayTitle}
                    </h3>

                    <p
                        className={cn(
                            "text-sm text-muted-foreground line-clamp-2 bidi-plaintext",
                            isRTL && "text-right"
                        )}
                        dir="auto"
                    >
                        {prompt.content}
                    </p>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); toggleLike(); }}
                                className={cn("gap-1.5 px-2 h-8", isLiked ? "text-red-500" : "text-muted-foreground")}
                            >
                                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                                <span className="text-xs font-semibold">{likesCount}</span>
                            </Button>

                            <Badge variant="outline" className="text-xs" translate="no">
                                {modelDisplay}
                            </Badge>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="h-8 w-8 hover:bg-primary/10"
                        >
                            {isCopied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none" />
            </div>
        </motion.div>
    );
};

const FeaturedSkeleton = () => (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <Skeleton className="aspect-[16/10] w-full" />
        <div className="p-5 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-3">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-8 w-8" />
            </div>
        </div>
    </div>
);

export default function FeaturedPrompts() {
    const { isRTL } = useLanguage();
    const { data: featuredPrompts, isLoading, error } = useFeaturedPrompts(6);

    useEffect(() => {
        // Debugging handled in parent if needed
    }, [featuredPrompts, isLoading, error]);

    if (error) {
        return <div className="text-red-500 hidden">Error</div>;
    }

    if (!isLoading && (!featuredPrompts || featuredPrompts.length === 0)) {
        return null;
    }

    return (
        <section className="py-8 animate-fade-in">
            {/* Section Header */}
            <div className={cn("flex items-center gap-3 mb-6", isRTL && "flex-row-reverse")}>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
                    <Crown className="w-5 h-5 text-yellow-500" />
                </div>
                <div className={cn(isRTL && "text-right")}>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                        {isRTL ? "أفضل البرومبتات" : "Featured Prompts"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {isRTL ? "الأكثر إعجاباً من المجتمع" : "Most loved by the community"}
                    </p>
                </div>
            </div>

            {/* Featured Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <FeaturedSkeleton key={i} />)
                ) : (
                    featuredPrompts?.map((prompt, index) => (
                        <FeaturedCard key={prompt.id} prompt={prompt} index={index} />
                    ))
                )}
            </div>
        </section>
    );
}
