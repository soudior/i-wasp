import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-body touch-manipulation active:scale-[0.97] active:transition-transform active:duration-75",
  {
    variants: {
      variant: {
        // Primary = Jaune signature i-Wasp #F5B400
        default:
          "bg-primary text-primary-foreground shadow-lg hover:brightness-105",
        destructive:
          "bg-destructive text-destructive-foreground",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-secondary",
        link: "text-foreground underline-offset-4 hover:underline",
        // Premium variants
        glass: "bg-white/90 border border-border text-foreground shadow-sm",
        chrome: "bg-primary text-primary-foreground font-semibold shadow-lg hover:brightness-105",
        hero: "bg-primary text-primary-foreground font-semibold text-base px-8 py-4 rounded-2xl shadow-lg hover:brightness-105",
        heroOutline: "border border-foreground/20 bg-transparent text-foreground font-medium text-base px-8 py-4 rounded-2xl hover:bg-secondary",
        wallet: "bg-foreground text-background flex items-center gap-3",
        minimal: "text-muted-foreground hover:text-foreground transition-colors",
        // Noir pour CTAs secondaires
        noir: "bg-foreground text-background shadow-lg hover:bg-foreground/90",
      },
      size: {
        default: "h-11 px-5 py-2.5 min-h-[48px]",
        sm: "h-9 rounded-lg px-4 text-xs min-h-[44px]",
        lg: "h-12 rounded-xl px-8 text-base min-h-[48px]",
        xl: "h-14 rounded-2xl px-10 text-lg min-h-[56px]",
        icon: "h-11 w-11 min-h-[48px] min-w-[48px]",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };