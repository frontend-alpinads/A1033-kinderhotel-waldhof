import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-visible:border-ring font-body focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-none text-base leading-normal font-semibold tracking-[1%] whitespace-nowrap uppercase transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 touch-action-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        white: "bg-background text-primary hover:bg-background/90",
        destructive:
          "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
        outline:
          "border-background text-background border bg-white/5 hover:bg-white/10 hover:backdrop-blur-md",
        "outline-primary":
          "border-primary/30 bg-primary/0 hover:bg-primary/10 text-primary border",
        secondary:
          "bg-glass text-background border border-white/10 hover:border-white/40",
        ghost:
          "hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/50",
        link: "text-primary underline-offset-4 hover:underline",
        booking: "bg-booking hover:bg-booking/90 text-background",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-8 gap-1.5 rounded-none px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-none px-6 has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
