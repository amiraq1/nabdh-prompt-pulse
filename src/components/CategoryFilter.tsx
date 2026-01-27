import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const CATEGORIES = [
    { id: "all", en: "All", ar: "الكل" },
    { id: "coding", en: "Coding", ar: "البرمجة" },
    { id: "writing", en: "Writing", ar: "الكتابة" },
    { id: "art", en: "Art & Design", ar: "الفن والتصميم" },
    { id: "marketing", en: "Marketing", ar: "التسويق" },
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
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar mask-gradient">
            {CATEGORIES.map((cat) => (
                <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectCategory(cat.id)}
                    className={cn(
                        "rounded-full whitespace-nowrap transition-all",
                        selectedCategory === cat.id ? "shadow-md scale-105" : "hover:bg-secondary"
                    )}
                >
                    {isRTL ? cat.ar : cat.en}
                </Button>
            ))}
        </div>
    );
}
