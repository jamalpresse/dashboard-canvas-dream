import * as React from "react"
import { cn } from "@/lib/utils"

const WidgetCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "widget-card rounded-xl p-6 backdrop-blur-sm border hover:shadow-glow transition-all duration-300",
      className
    )}
    {...props}
  />
))
WidgetCard.displayName = "WidgetCard"

const WidgetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
WidgetHeader.displayName = "WidgetHeader"

const WidgetTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight gradient-text-primary",
      className
    )}
    {...props}
  />
))
WidgetTitle.displayName = "WidgetTitle"

const WidgetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
WidgetContent.displayName = "WidgetContent"

export { WidgetCard, WidgetHeader, WidgetTitle, WidgetContent }