import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/useAuth";

export function useAdmin() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!user) {
            setIsAdmin(false);
            setIsLoading(false);
            return;
        }

        const checkAdmin = async () => {
            try {
                const { data, error } = await supabase.rpc('has_role', {
                    _role: 'admin',
                    _user_id: user.id
                });

                if (error || !data) {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error("Failed to check admin status:", err);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, [user, isAuthLoading]);

    return { isAdmin, isLoading };
}
