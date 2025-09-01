import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Base styling with enhanced modern appearance
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 transition-all duration-200",
        // Enhanced border and shadow for better visual hierarchy
        "border border-border/50 shadow-sm hover:shadow-md",
        // Subtle background enhancement for depth
        "backdrop-blur-sm bg-background/95",
        // Hover effects for better interactivity
        "hover:border-border/70 hover:bg-background/98",
        // Focus states for accessibility
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // Base grid layout preserved for functionality
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
        // Enhanced styling for better visual hierarchy
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        // Conditional border styling with better visual separation
        "[.border-b]:pb-6 [.border-b]:border-border/30",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        // Enhanced typography with better contrast
        "leading-none font-semibold text-foreground/90",
        // Subtle text enhancement for better readability
        "tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // Enhanced padding and spacing
        "px-6",
        // Better text contrast for content
        "text-foreground/85",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // Base layout preserved
        "flex items-center px-6",
        // Enhanced border styling for better visual separation
        "[.border-t]:pt-6 [.border-t]:border-border/30",
        // Better text contrast for footer content
        "text-muted-foreground/80",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
