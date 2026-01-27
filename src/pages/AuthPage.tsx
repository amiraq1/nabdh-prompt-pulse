import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pageTitle = isRTL ? "تسجيل الدخول" : "Sign in";
  const pageDescription = isRTL
    ? "سجّل الدخول للوصول إلى موجهاتك المفضلة وإدارة حسابك في نبض."
    : "Sign in to access your saved prompts and manage your Nabdh account.";

  // دالة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: isRTL ? "خطأ" : "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isRTL ? "أهلاً بك!" : "Welcome back!" });
      navigate("/"); // توجيه للرئيسية
    }
    setLoading(false);
  };

  // دالة إنشاء حساب جديد
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast({ title: isRTL ? "خطأ" : "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: isRTL ? "تم التسجيل!" : "Success!",
        description: isRTL ? "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب." : "Please check your email to verify your account."
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo title={pageTitle} description={pageDescription} noIndex />
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Nabdh</CardTitle>
            <CardDescription>{isRTL ? "بوابتك لعالم الذكاء الاصطناعي" : "Your gateway to AI prompts"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full" dir={isRTL ? "rtl" : "ltr"}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">{isRTL ? "دخول" : "Login"}</TabsTrigger>
                <TabsTrigger value="register">{isRTL ? "حساب جديد" : "Sign Up"}</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={isRTL ? "البريد الإلكتروني" : "Email"}
                        className="pl-10 text-left" // Email always LTR
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder={isRTL ? "كلمة المرور" : "Password"}
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : (isRTL ? "تسجيل الدخول" : "Login")}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={isRTL ? "البريد الإلكتروني" : "Email"}
                        className="pl-10 text-left"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder={isRTL ? "كلمة المرور" : "Password"}
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : (isRTL ? "إنشاء حساب" : "Create Account")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
