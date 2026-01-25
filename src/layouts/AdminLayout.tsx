import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

const AdminLayout = () => {
  const { language, isRTL } = useLanguage();
  const t = translations;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminNavItems = [
    { title: t.dashboard[language], path: '/admin', icon: LayoutDashboard },
    { title: t.addPrompt[language], path: '/admin/create', icon: PlusCircle },
    { title: t.settings[language], path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={cn("min-h-screen bg-background flex", isRTL && "flex-row-reverse")}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 z-50 w-64 bg-card border-border transition-transform duration-300 ease-in-out",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          sidebarOpen 
            ? "translate-x-0" 
            : isRTL 
              ? "translate-x-full lg:translate-x-0 lg:w-16"
              : "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-sm flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className={cn(
                "text-xl font-bold text-foreground glow-text transition-opacity",
                !sidebarOpen && "lg:hidden"
              )}>
                {isRTL ? 'نبض' : 'Nabdh'}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isRTL && "flex-row-reverse",
                    isActive
                      ? "bg-primary/20 text-primary glow-sm border border-primary/30"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn(
                  "font-medium transition-opacity",
                  !sidebarOpen && "lg:hidden"
                )}>
                  {item.title}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className={cn(
              "text-xs text-muted-foreground",
              !sidebarOpen && "lg:hidden"
            )}>
              {t.adminPanel[language]} v1.0
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className={cn(
          "h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-30",
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

          <LanguageToggle />
          
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">A</span>
            </div>
            <span className="text-sm text-foreground hidden sm:block">{t.admin[language]}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
