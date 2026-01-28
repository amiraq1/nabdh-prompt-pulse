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
import { ArrowLeft, ArrowRight, Send, LogIn, Sparkles, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { useAdmin } from "@/hooks/useAdmin";

type PromptCategory = Database["public"]["Enums"]["prompt_category"];
type AIModel = Database["public"]["Enums"]["ai_model"];

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
    const { isAdmin, isLoading: isAdminLoading } = useAdmin();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const remixId = searchParams.get("remix_id");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        category: PromptCategory;
        ai_model: AIModel;
        tags: string;
    }>({
        title: "",
        content: "",
        category: "coding",
        ai_model: "gpt-4",
        tags: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAdmin) return;

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
                category: formData.category,
                ai_model: formData.ai_model,
                tags: tagsArray,
                user_id: user.id,
                title: formData.title,
                title_ar: isRTL ? formData.title : null
            });

            if (error) throw error;

            toast({
                title: isRTL ? "تم الإرسال بنجاح!" : "Submitted Successfully!",
                description: isRTL
                    ? "شكراً لمشاركتك. سيتم مراجعة الموجه قريباً."
                    : "Thanks for sharing! Your prompt will be reviewed soon.",
            });

            navigate("/");
        } catch (error: unknown) {
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

    // 1. Loading state
    if (isAdminLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // 2. Not logged in OR Not Admin
    if (!isAdmin) {
        // If logged in but not admin -> Unauthorized
        if (user) {
            return (
                <div className="flex flex-col h-screen items-center justify-center p-4 text-center space-y-4">
                    <ShieldAlert className="h-16 w-16 text-destructive opacity-50" />
                    <h1 className="text-2xl font-bold">{isRTL ? "غير مصرح" : "Unauthorized Access"}</h1>
                    <p className="text-muted-foreground max-w-md">
                        {isRTL
                            ? "عذراً، إضافة الموجهات مقتصرة حالياً على المشرفين فقط."
                            : "Sorry, submitting prompts is currently restricted to admins only."
                        }
                    </p>
                    <Button onClick={() => navigate("/")} variant="outline">
                        {isRTL ? "العودة للرئيسية" : "Return Home"}
                    </Button>
                </div>
            );
        }

        // If not logged in -> Show Login Prompt (Guest View)
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
                                {isRTL ? "منطقة المشرفين" : "Admin Area"}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {isRTL
                                    ? "يرجى تسجيل الدخول بحساب مشرف لإضافة موجهات جديدة"
                                    : "Please login with an admin account to submit new prompts"}
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
                                        onValueChange={(value) => setFormData({ ...formData, category: value as PromptCategory })}
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
                                        onValueChange={(value) => setFormData({ ...formData, ai_model: value as AIModel })}
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
