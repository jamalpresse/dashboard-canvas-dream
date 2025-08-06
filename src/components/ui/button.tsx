
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 btn-glow",
        secondary: "gradient-secondary text-secondary-foreground hover:shadow-glow hover:scale-105 btn-glow",
        accent: "gradient-accent text-accent-foreground hover:shadow-glow hover:scale-105 btn-glow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-elegant",
        outline: "border-2 border-primary/30 bg-card/50 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary backdrop-blur-sm",
        ghost: "text-foreground hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        glass: "glass-effect text-foreground hover:bg-card/80 border-glow",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-elegant",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-elegant"
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm rounded-lg",
        lg: "h-14 px-8 py-4 text-lg rounded-2xl",
        xl: "h-16 px-10 py-5 text-xl rounded-2xl",
        icon: "h-12 w-12 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-14 w-14 rounded-2xl"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
