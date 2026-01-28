import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import SEO from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLike } from "@/hooks/useLike";
import AddToCollectionDialog from "@/components/AddToCollectionDialog";
import { getCategoryImage } from "@/lib/categoryImages";
import { getOptimizedImageUrl } from "@/lib/imageOptimizer";
import {
    Copy,
    Check,
    Heart,
    ArrowLeft,
    ArrowRight,
    Calendar,
    Sparkles,
    Tag,
    Bookmark,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
    coding: { en: "Coding", ar: "البرمجة" },
    writing: { en: "Writing", ar: "الكتابة" },
    art: { en: "Art & Design", ar: "الفن والتصميم" },
    marketing: { en: "Marketing", ar: "التسويق" },
};

export default function PromptDetails() {
    const { id } = useParams<{ id: string }>();
    const { isRTL, language } = useLanguage();
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);

    const { data: prompt, isLoading, error } = useQuery({
        queryKey: ["prompt", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("prompts")
                .select("*")
                .eq("id", id!)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!id,
    });

    const { isLiked, likesCount, toggleLike } = useLike(
        prompt?.id || "",
        prompt?.likes || 0
    );

    const handleCopy = () => {
        if (!prompt) return;
        navigator.clipboard.writeText(prompt.content);
        setIsCopied(true);
        toast({
            title: isRTL ? "تم النسخ!" : "Copied!",
            description: isRTL
                ? "تم نسخ الموجه إلى الحافظة."
                : "Prompt copied to clipboard.",
        });
        setTimeout(() => setIsCopied(false), 2000);
    };

    const BackArrow = isRTL ? ArrowRight : ArrowLeft;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-8" />
                    <Skeleton className="h-64 w-full mb-8" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !prompt) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {isRTL ? "الموجه غير موجود" : "Prompt not found"}
                    </h1>
                    <Link to="/">
                        <Button variant="outline">
                            <BackArrow className="w-4 h-4 mr-2" />
                            {isRTL ? "العودة للرئيسية" : "Back to Home"}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const displayTitle =
        isRTL && prompt.title_ar ? prompt.title_ar : prompt.title;
    const categoryLabel =
        CATEGORY_LABELS[prompt.category]?.[isRTL ? "ar" : "en"] || prompt.category;
    const formattedDate = format(
        new Date(prompt.created_at),
        "dd MMMM yyyy",
        { locale: isRTL ? ar : enUS }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalImageUrl = (prompt as any).image || prompt.image_url || getCategoryImage(prompt.category, prompt.id);

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
        <div className="min-h-screen bg-background">
            <SEO title={displayTitle} description={prompt.content.slice(0, 160)} />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <BackArrow className="w-4 h-4" />
                    <span>{isRTL ? "العودة" : "Back"}</span>
                </Link>

                {/* Header */}
                <div className={cn("mb-8", isRTL && "text-right")}>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge variant="secondary" className="text-sm">
                            {categoryLabel}
                        </Badge>
                        <Badge variant="outline" className="text-sm" translate="no">
                            {modelDisplay}
                        </Badge>
                    </div>

                    <h1
                        className="text-3xl md:text-4xl font-bold mb-4 bidi-plaintext"
                        dir="auto"
                    >
                        {displayTitle}
                    </h1>

                    <div className={cn("flex items-center gap-4 text-sm text-muted-foreground", isRTL && "flex-row-reverse")}>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className={cn("w-4 h-4", isLiked && "fill-red-500 text-red-500")} />
                            {likesCount} {isRTL ? "إعجاب" : "likes"}
                        </span>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 border border-border/50 shadow-sm bg-muted group">
                    <img
                        src={getOptimizedImageUrl(finalImageUrl, 1000)}
                        alt={displayTitle}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.backgroundColor = 'hsl(var(--primary) / 0.1)';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                </div>

                {/* Prompt Content */}
                <div className="relative mb-8 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div
                        className={cn(
                            "relative bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6 md:p-8 shadow-sm",
                            isRTL && "text-right"
                        )}
                    >
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                <span className="font-semibold text-foreground">
                                    {isRTL ? "نص الموجه" : "Prompt Script"}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className={cn("hidden md:flex gap-2 h-8", isCopied && "text-green-500")}
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span className="text-xs">{isCopied ? (isRTL ? "تم النسخ" : "Copied") : (isRTL ? "نسخ" : "Copy")}</span>
                            </Button>
                        </div>

                        <p
                            className="text-foreground leading-relaxed whitespace-pre-wrap bidi-plaintext text-lg md:text-xl font-mono tracking-wide selection:bg-primary/20"
                            dir="auto"
                            style={{ fontFamily: "'Fira Code', 'Roboto Mono', monospace" }}
                        >
                            {prompt.content}
                        </p>
                    </div>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className={cn("mb-8", isRTL && "text-right")}>
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                                {isRTL ? "الوسوم" : "Tags"}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {prompt.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className={cn("flex flex-wrap gap-3", isRTL && "flex-row-reverse")}>
                    <Button
                        size="lg"
                        onClick={handleCopy}
                        className="gap-2"
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-4 h-4" />
                                {isRTL ? "تم النسخ!" : "Copied!"}
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                {isRTL ? "نسخ الموجه" : "Copy Prompt"}
                            </>
                        )}
                    </Button>

                    <Button
                        size="lg"
                        variant={isLiked ? "default" : "outline"}
                        onClick={toggleLike}
                        className={cn("gap-2", isLiked && "bg-red-500 hover:bg-red-600")}
                    >
                        <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                        {isLiked
                            ? isRTL
                                ? "أعجبني"
                                : "Liked"
                            : isRTL
                                ? "إعجاب"
                                : "Like"}
                    </Button>

                    <AddToCollectionDialog
                        promptId={prompt.id}
                        trigger={
                            <Button size="lg" variant="outline" className="gap-2">
                                <Bookmark className="w-4 h-4" />
                                {isRTL ? "حفظ في مجموعة" : "Save to Collection"}
                            </Button>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
