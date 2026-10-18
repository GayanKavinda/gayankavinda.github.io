import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-sm font-sans font-medium tracking-[0.01em] ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_28px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-amber-500/30 bg-card/80 text-foreground hover:bg-amber-500/10 hover:border-amber-500/60 hover:text-amber-500 dark:hover:text-amber-400 transition-all shadow-sm hover:-translate-y-0.5",
        secondary: "border border-border bg-card/60 backdrop-blur-md text-foreground hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all hover:-translate-y-0.5",
        ghost: "hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400 text-foreground transition-colors",
        link: "text-foreground hover:text-emerald-500 underline-offset-4 hover:underline p-0 h-auto",
        gold: "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold hover:from-amber-400 hover:to-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-12 px-7 text-sm",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-9 text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };



