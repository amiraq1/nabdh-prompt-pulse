import { Search, Plus, Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import SearchInput from './SearchInput';
import { cn } from '@/lib/utils';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions?: string[];
}

const Header = ({ searchQuery, onSearchChange, suggestions = [] }: HeaderProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 safe-top">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className={cn(
          "flex items-center justify-between gap-2 sm:gap-4",
          isRTL && "flex-row-reverse"
        )}>
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-2 flex-shrink-0",
            isRTL && "flex-row-reverse"
          )}>
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-sm">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground glow-text">
              {isRTL ? 'نبض' : 'Nabdh'}
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
          <div className={cn(
            "hidden sm:flex items-center gap-2 flex-shrink-0",
            isRTL && "flex-row-reverse"
          )}>
            <LanguageToggle />
            <Button className={cn(
              "bg-primary text-primary-foreground hover:bg-primary/90 glow-sm font-medium h-10 px-4",
              isRTL && "flex-row-reverse"
            )}>
              <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
              <span className="hidden lg:inline">{t.submitPrompt[language]}</span>
              <span className="lg:hidden">{t.submit[language]}</span>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className={cn(
            "flex sm:hidden items-center gap-1",
            isRTL && "flex-row-reverse"
          )}>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
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
          <div className={cn(
            "sm:hidden mt-3 pt-3 border-t border-border/50 animate-fade-in",
            isRTL && "text-right"
          )}>
            <Button 
              className={cn(
                "w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-sm font-medium h-12",
                isRTL && "flex-row-reverse"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
              {t.submitPrompt[language]}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;