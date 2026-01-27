import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, User, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/useAuth";

export default function MobileNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: PlusSquare, label: "Add", path: "/submit" },
    { icon: BookMarked, label: "Saved", path: "/bookmarks" },
    { icon: User, label: "Profile", path: `/user/${user.id}` },
  ];

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
