import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-transform duration-150 ease-out hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_1px_2px_0_rgba(0,0,0,0.1)] hover:bg-primary/95 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_2px_4px_0_rgba(0,0,0,0.15)] active:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline:
          "border border-border/40 bg-transparent hover:bg-secondary/50 hover:border-border/60 hover:text-foreground shadow-sm backdrop-blur-sm",
        secondary:
          "bg-secondary/80 text-secondary-foreground shadow-sm hover:bg-secondary border border-border/30",
        ghost:
          "hover:bg-secondary/50 hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        // Modern variants
        glow:
          "bg-primary text-primary-foreground shadow-[0_0_10px_-3px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.6)] glow-sm hover:glow border border-primary/20",
        success:
          "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/20",
        soft:
          "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
        glass:
          "glass border border-border/40 text-foreground hover:bg-card/80 hover:border-border/60",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        xl: "h-12 rounded-xl px-8 text-base font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
