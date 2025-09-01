"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base styling with enhanced visibility - angular and symmetrical
        "peer size-4 shrink-0 rounded-sm transition-all duration-200 outline-none",
        // Enhanced border and background for better visibility with subtle distinct borders
        "border border-black/15 bg-background/70 shadow-sm",
        // Hover states for better interaction feedback - subtle enhancement
        "hover:border-black/25 hover:shadow-md hover:bg-background/80",
        // Focus states with ring for accessibility
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
        // Checked states with primary color and subtle smooth transition
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "data-[state=checked]:shadow-md data-[state=checked]:scale-[1.02]",
        // Dark mode specific enhancements with subtle white borders
        "dark:bg-background/50 dark:border-white/20",
        "dark:hover:bg-background/60 dark:hover:border-white/30",
        "dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary",
        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm",
        // Invalid/error states
        "aria-invalid:border-destructive/60 aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current transition-all duration-200",
          // Enhanced check icon with smooth animation
          "data-[state=checked]:animate-in data-[state=checked]:zoom-in-50",
          "data-[state=unchecked]:animate-out data-[state=unchecked]:zoom-out-50"
        )}
      >
        <CheckIcon className="size-3 stroke-[2] drop-shadow-sm" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
