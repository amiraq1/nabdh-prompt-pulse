import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useLanguage } from "@/contexts/useLanguage";
import SEO from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, LogIn, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
    { id: "coding", en: "Coding", ar: "البرمجة" },
    { id: "writing", en: "Writing", ar: "الكتابة" },
    { id: "art", en: "Art & Design", ar: "الفن والتصميم" },
    { id: "marketing", en: "Marketing", ar: "التسويق" },
];

const AI_MODELS = [
    { id: "gpt-4", label: "GPT-4" },
    { id: "gpt-3.5", label: "GPT-3.5" },
    { id: "claude", label: "Claude" },
    { id: "gemini", label: "Gemini" },
    { id: "midjourney", label: "Midjourney" },
] as const;

export default function SubmitPrompt() {
    const { user } = useAuth();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const remixId = searchParams.get("remix_id");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "coding" as const,
        ai_model: "gpt-4" as const,
        tags: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: isRTL ? "يجب تسجيل الدخول" : "Login Required",
                description: isRTL
                    ? "يرجى تسجيل الدخول لإرسال موجه جديد"
                    : "Please login to submit a new prompt",
                variant: "destructive",
            });
            navigate("/auth");
            return;
        }

        setIsSubmitting(true);

        try {
            const tagsArray = formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            const { error } = await supabase.from("prompts").insert({
                content: formData.content,
                category: formData.category as "coding" | "writing" | "art" | "marketing",
                ai_model: formData.ai_model as "gpt-4" | "gpt-3.5" | "claude" | "gemini" | "midjourney",
                tags: tagsArray,
                user_id: user.id,
                title: formData.title, // Add title to insert
                title_ar: isRTL ? formData.title : null // Optional: save Arabic title if in RTL
            } as any); // Type assertion to bypass strict checking issue if needed

            if (error) throw error;

            toast({
                title: isRTL ? "تم الإرسال بنجاح!" : "Submitted Successfully!",
                description: isRTL
                    ? "شكراً لمشاركتك. سيتم مراجعة الموجه قريباً."
                    : "Thanks for sharing! Your prompt will be reviewed soon.",
            });

            navigate("/");
        } catch (error: any) {
            console.error("Submit error:", error);
            toast({
                title: isRTL ? "حدث خطأ" : "Error",
                description: isRTL
                    ? "فشل في إرسال الموجه. حاول مرة أخرى."
                    : "Failed to submit prompt. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Guest user view - show login prompt
    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <SEO
                    title={isRTL ? "إرسال موجه" : "Submit Prompt"}
                    description={
                        isRTL
                            ? "شارك موجهات الذكاء الاصطناعي الخاصة بك"
                            : "Share your AI prompts with the community"
                    }
                />

                <div className="container mx-auto px-4 py-16">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className={cn("mb-8 gap-2", isRTL && "flex-row-reverse")}
                    >
                        {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                        {isRTL ? "رجوع" : "Back"}
                    </Button>

                    <Card className="max-w-lg mx-auto text-center">
                        <CardHeader className="space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                {isRTL ? "شارك إبداعك!" : "Share Your Creativity!"}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {isRTL
                                    ? "سجّل الدخول لمشاركة موجهات الذكاء الاصطناعي الخاصة بك مع المجتمع"
                                    : "Login to share your AI prompts with the community and help others create amazing things"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                onClick={() => navigate("/auth")}
                                className="w-full gap-2"
                                size="lg"
                            >
                                <LogIn className="h-5 w-5" />
                                {isRTL ? "تسجيل الدخول" : "Login to Continue"}
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                {isRTL
                                    ? "ليس لديك حساب؟ يمكنك إنشاء حساب مجاني!"
                                    : "Don't have an account? Create one for free!"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Logged-in user view - show submit form
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={isRTL ? "إرسال موجه" : "Submit Prompt"}
                description={
                    isRTL
                        ? "شارك موجهات الذكاء الاصطناعي الخاصة بك"
                        : "Share your AI prompts with the community"
                }
            />

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className={cn("mb-6 gap-2", isRTL && "flex-row-reverse")}
                >
                    {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                    {isRTL ? "رجوع" : "Back"}
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className={cn(isRTL && "text-right")}>
                            {remixId
                                ? isRTL
                                    ? "إنشاء نسخة معدّلة (ريمكس)"
                                    : "Create a Remix"
                                : isRTL
                                    ? "إرسال موجه جديد"
                                    : "Submit New Prompt"}
                        </CardTitle>
                        <CardDescription className={cn(isRTL && "text-right")}>
                            {isRTL
                                ? "شارك موجهك المفضل مع المجتمع"
                                : "Share your favorite prompt with the community"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className={cn(isRTL && "text-right block")}>
                                    {isRTL ? "العنوان" : "Title"}
                                </Label>
                                <Input
                                    id="title"
                                    placeholder={isRTL ? "عنوان وصفي للموجه..." : "A descriptive title..."}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    dir="auto"
                                    className="bidi-plaintext"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <Label htmlFor="content" className={cn(isRTL && "text-right block")}>
                                    {isRTL ? "محتوى الموجه" : "Prompt Content"}
                                </Label>
                                <Textarea
                                    id="content"
                                    placeholder={isRTL ? "اكتب الموجه هنا..." : "Write your prompt here..."}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={6}
                                    dir="auto"
                                    className="bidi-plaintext resize-none"
                                />
                            </div>

                            {/* Category & AI Model */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className={cn(isRTL && "text-right block")}>
                                        {isRTL ? "الفئة" : "Category"}
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {isRTL ? cat.ar : cat.en}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className={cn(isRTL && "text-right block")}>
                                        {isRTL ? "نموذج الذكاء الاصطناعي" : "AI Model"}
                                    </Label>
                                    <Select
                                        value={formData.ai_model}
                                        onValueChange={(value) => setFormData({ ...formData, ai_model: value as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AI_MODELS.map((model) => (
                                                <SelectItem key={model.id} value={model.id}>
                                                    {model.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label htmlFor="tags" className={cn(isRTL && "text-right block")}>
                                    {isRTL ? "الوسوم (مفصولة بفواصل)" : "Tags (comma-separated)"}
                                </Label>
                                <Input
                                    id="tags"
                                    placeholder={isRTL ? "python, api, automation" : "python, api, automation"}
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    dir="ltr"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting || !formData.title || !formData.content}
                                className="w-full gap-2"
                                size="lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin">&#8987;</span>
                                        {isRTL ? "جارٍ الإرسال..." : "Submitting..."}
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        {isRTL ? "إرسال الموجه" : "Submit Prompt"}
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
