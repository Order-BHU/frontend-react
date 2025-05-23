import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-offset-white transition-all transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(23,95%,52%)] font-bold text-stone-50 hover:bg-[hsl(24,88%,50%)]",
        destructive: "bg-red-500 text-stone-50 hover:bg-red-500/90",
        outline:
          "border border-stone-200 bg-white hover:bg-stone-100 hover:text-stone-900",
        secondary: "bg-[hsl(16,87%,62%)] text-white hover:bg-[hsl(23,95%,52%)]",
        ghost: "hover:bg-[hsl(16,65%,62%)] hover:text-stone-900",
        link: "text-stone-900 underline-offset-4 hover:underline",
        orange: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
        green: "bg-green-500 text-white hover:bg-green-600 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
