import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, User, BookMarked, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";
import { useLanguage } from "@/contexts/useLanguage";

export default function MobileNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { isRTL } = useLanguage();

  // Navigation items for logged-in users
  const authNavItems = [
    { icon: Home, label: isRTL ? "الرئيسية" : "Home", path: "/" },
    { icon: PlusSquare, label: isRTL ? "إضافة" : "Add", path: "/submit" },
    { icon: BookMarked, label: isRTL ? "المحفوظة" : "Saved", path: "/bookmarks" },
    { icon: User, label: isRTL ? "الملف" : "Profile", path: `/user/${user?.id}` },
  ];

  // Navigation items for guest users
  const guestNavItems = [
    { icon: Home, label: isRTL ? "الرئيسية" : "Home", path: "/" },
    { icon: PlusSquare, label: isRTL ? "إضافة" : "Add", path: "/submit" },
    { icon: LogIn, label: isRTL ? "دخول" : "Login", path: "/auth" },
  ];

  const navItems = user ? authNavItems : guestNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70",
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

