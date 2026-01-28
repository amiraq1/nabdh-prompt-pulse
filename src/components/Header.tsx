import { Zap, Menu, X, Settings, User, LogOut, Bookmark, FolderOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage, translations } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import LanguageToggle from "./LanguageToggle";
import SearchInput from "./SearchInput";
import NotificationsMenu from "./NotificationsMenu";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions?: string[];
}

const Header = ({ searchQuery, onSearchChange, suggestions = [] }: HeaderProps) => {
  const { language, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const t = translations;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 safe-top">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div
          className={cn(
            "flex items-center justify-between gap-2 sm:gap-4",
            isRTL && "flex-row-reverse",
          )}
        >
          {/* Logo - Interactive Button */}
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2.5 flex-shrink-0 group cursor-pointer",
              "transition-all duration-300 ease-out",
              "hover:scale-105 active:scale-95",
              isRTL && "flex-row-reverse"
            )}
          >
            <div className="relative">
              {/* Animated glow ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-500 animate-pulse" />

              {/* Main logo container */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-cyan-500/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-all duration-300 overflow-hidden logo-glow animate-nabdh-pulse">
                {/* Background pulse effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Animated Zap icon */}
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-cyan-300 transition-colors duration-300" />
              </div>
            </div>

            {/* Text with gradient */}
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-foreground via-primary to-cyan-400 bg-clip-text text-transparent group-hover:from-primary group-hover:via-cyan-300 group-hover:to-foreground transition-all duration-500 drop-shadow-[0_0_12px_hsl(var(--primary)/0.4)]">
              {isRTL ? "نبض" : "Nabdh"}
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              suggestions={suggestions}
              placeholder={t.searchPlaceholder[language]}
            />
          </div>

          {/* Desktop Actions */}
          <div
            className={cn(
              "hidden sm:flex items-center gap-2 flex-shrink-0",
              isRTL && "flex-row-reverse",
            )}
          >
            <LanguageToggle />
            <NotificationsMenu />

            {user ? (
              <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email?.split('@')[0]}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <Link to="/bookmarks">
                    <DropdownMenuItem className={cn("cursor-pointer gap-2", isRTL && "flex-row-reverse")}>
                      <Bookmark className="h-4 w-4" />
                      <span>{isRTL ? "مفضلتي" : "Bookmarks"}</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link to="/collections">
                    <DropdownMenuItem className={cn("cursor-pointer gap-2", isRTL && "flex-row-reverse")}>
                      <FolderOpen className="h-4 w-4" />
                      <span>{isRTL ? "مجموعاتي" : "My Collections"}</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link to="/settings">
                    <DropdownMenuItem className={cn("cursor-pointer gap-2", isRTL && "flex-row-reverse")}>
                      <Settings className="h-4 w-4" />
                      <span>{isRTL ? "الإعدادات" : "Settings"}</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className={cn("text-destructive cursor-pointer focus:text-destructive gap-2", isRTL && "flex-row-reverse")}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{isRTL ? "تسجيل الخروج" : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>{isRTL ? "دخول" : "Login"}</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className={cn("flex sm:hidden items-center gap-1", isRTL && "flex-row-reverse")}>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Always visible */}
        <div className="mt-3 md:hidden">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            suggestions={suggestions}
            placeholder={t.searchPlaceholder[language]}
          />
        </div>


      </div>
    </header>
  );
};

export default Header;
