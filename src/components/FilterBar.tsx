import { categories, models } from '@/data/prompts';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  selectedCategory: string;
  selectedModel: string;
  onCategoryChange: (category: string) => void;
  onModelChange: (model: string) => void;
}

const FilterBar = ({
  selectedCategory,
  selectedModel,
  onCategoryChange,
  onModelChange,
}: FilterBarProps) => {
  return (
    <div className="py-6 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground glow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Model Selector */}
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border/50">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
