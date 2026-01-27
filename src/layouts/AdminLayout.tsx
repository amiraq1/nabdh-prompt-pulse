import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  Zap,
  Menu,
  X,
  LogOut,
  Bell
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage, translations } from '@/contexts/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/useAuth';
import { toast } from 'sonner';
import Seo from '@/components/Seo';

const AdminLayoutContent = () => {
  const { language, isRTL } = useLanguage();
  const t = translations;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <div className={cn("min-h-screen bg-background flex", isRTL && "flex-row-reverse")}>
      <Seo title={isRTL ? "لوحة التحكم" : "Admin Dashboard"} noIndex />
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* New Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 transition-[width,margin] duration-slow ease-in-out-smooth">
        {/* Top Bar */}
        <header className={cn(
          "h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-4 gap-4 sticky top-0 z-30",
          isRTL && "flex-row-reverse"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="flex-1" />

          {/* Actions */}
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <LanguageToggle />

            <Button variant="ghost" size="icon" className="text-muted-foreground relative">
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <Bell className="w-5 h-5" />
            </Button>

            <div className="h-6 w-px bg-border/50 mx-1" />

            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-xs text-muted-foreground mt-1">{isRTL ? 'ظ…ط³ط¤ظˆظ„ ط§ظ„ظ†ط¸ط§ظ…' : 'Super Admin'}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 pt-16 md:pt-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <AuthGuard requireAdmin>
      <AdminLayoutContent />
    </AuthGuard>
  );
};

export default AdminLayout;



