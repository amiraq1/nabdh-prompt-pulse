import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import {
    Users,
    FileText,
    Heart,
    ShieldAlert,
    Activity,
    Search,
    CheckCircle,
    XCircle,
    Trash2,
    Edit,
    Shield,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SEO from "@/components/Seo";

export default function AdminDashboard() {
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    // Check if user is admin
    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/auth");
                return;
            }

            // Check role
            const { data, error } = await supabase.rpc('has_role', {
                _role: 'admin',
                _user_id: session.user.id
            });

            if (error || !data) {
                setIsAdmin(false);
                toast({
                    variant: "destructive",
                    title: isRTL ? "غير مصرح" : "Unauthorized",
                    description: isRTL ? "ليس لديك صلاحية الوصول لهذه الصفحة" : "You don't have permission to access this page"
                });
                navigate("/");
            } else {
                setIsAdmin(true);
            }
        };

        checkAdmin();
    }, [navigate]);

    // Statistics Query
    const { data: stats } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const [prompts, roles, likes] = await Promise.all([
                supabase.from("prompts").select("*", { count: "exact", head: true }),
                supabase.from("user_roles").select("*", { count: "exact", head: true }),
                supabase.from("prompt_likes").select("*", { count: "exact", head: true })
            ]);

            return {
                promptsCount: prompts.count || 0,
                usersCount: roles.count || 0, // Approximate users based on roles table
                likesCount: likes.count || 0
            };
        },
        enabled: isAdmin === true
    });

    // Recent Prompts Query
    const { data: recentPrompts, refetch: refetchPrompts } = useQuery({
        queryKey: ["admin-recent-prompts"],
        queryFn: async () => {
            const { data } = await supabase
                .from("prompts")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);
            return data || [];
        },
        enabled: isAdmin === true
    });

    const handleDeletePrompt = async (id: string) => {
        if (!confirm(isRTL ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) return;

        const { error } = await supabase.from("prompts").delete().eq("id", id);
        if (error) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } else {
            toast({ title: "Success", description: isRTL ? "تم الحذف بنجاح" : "Deleted successfully" });
            refetchPrompts();
        }
    };

    if (isAdmin === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isAdmin === false) return null;

    return (
        <div className="min-h-screen bg-background">
            <SEO title={isRTL ? "لوحة التحكم" : "Admin Dashboard"} />
            <Header searchQuery="" onSearchChange={() => { }} />

            <main className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        {isRTL ? "لوحة تحكم المشرف" : "Admin Dashboard"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isRTL ? "إدارة المحتوى والمستخدمين والإحصائيات" : "Manage content, users, and statistics"}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{isRTL ? "إجمالي البرومبتات" : "Total Prompts"}</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.promptsCount || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{isRTL ? "المستخدمين النشطين" : "Active Roles"}</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.usersCount || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{isRTL ? "إجمالي الإعجابات" : "Total Likes"}</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.likesCount || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Management */}
                <Tabs defaultValue="prompts" className="w-full">
                    <TabsList>
                        <TabsTrigger value="prompts">{isRTL ? "البرومبتات" : "Prompts"}</TabsTrigger>
                        <TabsTrigger value="users">{isRTL ? "المستخدمين" : "Users"}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="prompts" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{isRTL ? "أحدث المنشورات" : "Recent Posts"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <div className="relative w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm text-left rtl:text-right">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">{isRTL ? "العنوان" : "Title"}</th>
                                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">{isRTL ? "الموديل" : "Model"}</th>
                                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">{isRTL ? "الحالة" : "Status"}</th>
                                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">{isRTL ? "إجراءات" : "Actions"}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                {recentPrompts?.map((prompt) => (
                                                    <tr key={prompt.id} className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle font-medium">{prompt.title}</td>
                                                        <td className="p-4 align-middle">
                                                            <Badge variant="outline">{prompt.ai_model}</Badge>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <Badge variant="secondary" className="bg-green-500/10 text-green-500">Active</Badge>
                                                        </td>
                                                        <td className="p-4 align-middle text-right flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/prompts/${prompt.id}`)}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="destructive" size="icon" onClick={() => handleDeletePrompt(prompt.id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>{isRTL ? "إدارة المستخدمين" : "User Management"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {isRTL ? "قريباً - إدارة الصلاحيات والحظر" : "Coming Soon - Role management and bans"}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
