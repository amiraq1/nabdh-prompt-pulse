import { Search, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage, translations } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const { language, isRTL } = useLanguage();
  const t = translations;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className={cn("flex items-center justify-between gap-4", isRTL && "flex-row-reverse")}>
          {/* Logo */}
          <div className={cn("flex items-center gap-2 flex-shrink-0", isRTL && "flex-row-reverse")}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-sm">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="text-xl font-bold text-foreground glow-text">
              {isRTL ? 'نبض' : 'Nabdh'}
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                type="text"
                placeholder={t.searchPlaceholder[language]}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  "bg-secondary border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all",
                  isRTL ? "pr-10 text-right" : "pl-10"
                )}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={cn("flex items-center gap-2 flex-shrink-0", isRTL && "flex-row-reverse")}>
            <LanguageToggle />
            <Button className={cn(
              "bg-primary text-primary-foreground hover:bg-primary/90 glow-sm font-medium",
              isRTL && "flex-row-reverse"
            )}>
              <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
              <span className="hidden sm:inline">{t.submitPrompt[language]}</span>
              <span className="sm:hidden">{t.submit[language]}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              type="text"
              placeholder={t.searchPlaceholder[language]}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                "bg-secondary border-border/50 focus:border-primary/50",
                isRTL ? "pr-10 text-right" : "pl-10"
              )}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
