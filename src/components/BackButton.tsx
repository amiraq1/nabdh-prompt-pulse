import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className={cn("group gap-2 hover:bg-transparent hover:text-primary p-0 mb-4", className)}
    >
      {isRTL ? (
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      ) : (
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      )}
      <span className="text-muted-foreground group-hover:text-primary transition-colors text-base">
        {isRTL ? "رجوع" : "Back"}
      </span>
    </Button>
  );
}
