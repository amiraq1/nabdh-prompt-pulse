import { Search, Plus, Zap, Menu, X, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage, translations } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import LanguageToggle from "./LanguageToggle";
import SearchInput from "./SearchInput";
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
          {/* Logo */}
          <div className={cn("flex items-center gap-2 flex-shrink-0", isRTL && "flex-row-reverse")}>
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-sm">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground glow-text">
              {isRTL ? "نبض" : "Nabdh"}
            </span>
          </div>

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
            <Button
              className={cn(
                "bg-primary text-primary-foreground hover:bg-primary/90 glow-sm button-press font-medium h-10 px-4 gap-2",
                isRTL && "flex-row-reverse",
              )}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">{t.submitPrompt[language]}</span>
              <span className="lg:hidden">{t.submit[language]}</span>
            </Button>

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
                  <DropdownMenuSeparator />

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

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className={cn("sm:hidden mt-3 pt-3 border-t border-border/50 animate-fade-in", isRTL && "text-right")}>
            <Button
              className={cn(
                "w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-sm button-press font-medium h-12 gap-2",
                isRTL && "flex-row-reverse",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className="w-4 h-4" />
              {t.submitPrompt[language]}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
