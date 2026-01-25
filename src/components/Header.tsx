import { Search, Plus, Zap } from 'lucide-react';
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
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              suggestions={suggestions}
              placeholder={t.searchPlaceholder[language]}
            />
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
