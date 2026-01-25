import { Search, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-sm">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="text-xl font-bold text-foreground glow-text">
              Nabdh
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-secondary border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 glow-sm font-medium">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Submit Prompt</span>
            <span className="sm:hidden">Submit</span>
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary border-border/50 focus:border-primary/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
