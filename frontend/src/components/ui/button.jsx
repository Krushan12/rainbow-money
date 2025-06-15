import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skin-primary/20 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-skin-primary text-white hover:bg-skin-primary/90": variant === "default",
          "bg-skin-destructive text-white hover:bg-skin-destructive/90": variant === "destructive",
          "border border-skin-base hover:bg-skin-accent hover:text-skin-accent": variant === "outline",
          "hover:bg-skin-accent hover:text-skin-accent": variant === "ghost",
          "bg-skin-secondary text-skin-secondary hover:bg-skin-secondary/80": variant === "secondary",
          "underline-offset-4 hover:underline text-skin-primary": variant === "link",
          "h-10 py-2 px-4": size === "default",
          "h-9 px-3": size === "sm",
          "h-11 px-8": size === "lg",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
