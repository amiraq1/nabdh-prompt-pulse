import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-base ease-out-smooth",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/15 text-primary hover:bg-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/20",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20",
        warning:
          "border-transparent bg-amber-500/15 text-amber-400 hover:bg-amber-500/20",
        outline:
          "border-border/60 text-foreground bg-transparent hover:bg-secondary/50",
        // Model-specific badges (for prompt cards)
        gpt4:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
        gpt35:
          "border-green-500/30 bg-green-500/15 text-green-400",
        midjourney:
          "border-purple-500/30 bg-purple-500/15 text-purple-400",
        claude:
          "border-orange-500/30 bg-orange-500/15 text-orange-400",
        gemini:
          "border-blue-500/30 bg-blue-500/15 text-blue-400",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "success" | "warning" | "outline" | "gpt4" | "gpt35" | "midjourney" | "claude" | "gemini" | null | undefined;
  size?: "default" | "sm" | "lg" | null | undefined;
  children?: React.ReactNode;
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
