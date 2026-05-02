import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        premium: "relative border-none bg-glass-bg/10 backdrop-blur-md overflow-hidden group/badge",
      },
      color: {
        default: "",
        crimson: "text-crimson",
        emerald: "text-emerald",
        indigo: "text-indigo",
        amber: "text-amber",
        rose: "text-rose",
        slate: "text-slate",
        ocean: "text-ocean",
      }
    },
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, color, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, color }), className)} {...props}>
      {variant === 'premium' && (
        <>
          {/* Animated gradient border simulation */}
          <div className="absolute inset-0 p-[1px] rounded-full bg-gradient-to-r from-transparent via-current/20 to-transparent opacity-40" />
          <div className="absolute inset-0 rounded-full bg-current/5 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
        </>
      )}
      <span className="relative z-10">{props.children}</span>
    </div>
  );
}

export { Badge, badgeVariants };



