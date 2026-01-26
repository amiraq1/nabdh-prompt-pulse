import { useCallback, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { AuthContext } from "./authContext";

const OWNER_EMAILS = new Set(["amaralmdarking27@gmail.com"]);
const isOwnerEmail = (email?: string | null) => !!email && OWNER_EMAILS.has(email.toLowerCase());

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error("Error in checkAdminRole:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    // 1. جلب الجلسة الحالية عند بدء التطبيق
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        if (isOwnerEmail(session.user.email)) {
          setIsAdmin(true);
        } else {
          const admin = await checkAdminRole(session.user.id);
          setIsAdmin(admin);
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    getSession();

    // 2. الاستماع لأي تغييرات (تسجيل دخول، خروج، انتهاء الجلسة)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        if (isOwnerEmail(session.user.email)) {
          setIsAdmin(true);
          setIsLoading(false);
        } else {
          setTimeout(() => {
            checkAdminRole(session.user.id).then((admin) => {
              setIsAdmin(admin);
              setIsLoading(false);
            });
          }, 0);
        }
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  // شاشة تحميل أثناء التأكد من هوية المستخدم
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
