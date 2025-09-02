"use client";

import { useNavigation } from "@/hooks/use-navigation";
import { Loader2 } from "lucide-react";

export function GlobalLoadingIndicator() {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <>
      {/* Top loading bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent">
        <div className="h-full bg-primary animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* Loading indicator badge */}
      <div className="fixed top-4 right-4 z-[60] flex items-center gap-2 text-xs text-muted-foreground bg-background/95 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50 shadow-lg animate-in slide-in-from-right-2 duration-300">
        <Loader2 size={12} className="animate-spin text-primary" />
        <span className="font-medium">Loading...</span>
      </div>
    </>
  );
}
