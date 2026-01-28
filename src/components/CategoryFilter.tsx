import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/useLanguage";
import { Code, PenTool, Palette, Megaphone, Sparkles, LayoutGrid } from "lucide-react";

const CATEGORIES = [
    { id: "all", en: "All", ar: "الكل", icon: LayoutGrid },
    { id: "coding", en: "Coding", ar: "البرمجة", icon: Code },
    { id: "writing", en: "Writing", ar: "الكتابة", icon: PenTool },
    { id: "art", en: "Art & Design", ar: "الفن والتصميم", icon: Palette },
    { id: "marketing", en: "Marketing", ar: "التسويق", icon: Megaphone },
];

interface CategoryFilterProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    const { isRTL } = useLanguage();

    return (
        <div className="flex gap-3 overflow-x-auto pb-6 pt-2 no-scrollbar mask-gradient px-1">
            {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                    <Button
                        key={cat.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectCategory(cat.id)}
                        className={cn(
                            "rounded-full whitespace-nowrap transition-all duration-300 border",
                            isSelected
                                ? "shadow-md scale-105 ring-2 ring-primary/20 border-primary"
                                : "hover:bg-secondary/80 hover:border-primary/30 border-dashed border-border",
                            "flex items-center gap-2 px-4 h-9"
                        )}
                    >
                        <Icon className={cn("w-4 h-4", isSelected ? "animate-pulse" : "opacity-70")} />
                        <span>{isRTL ? cat.ar : cat.en}</span>
                    </Button>
                );
            })}
        </div>
    );
}
