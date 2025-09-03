"use client";

import { Button } from "./ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useFloatingButtons } from "@/contexts/floating-buttons-context";

export function FloatingTransactionButton() {
  const { isSignedIn } = useAuth();
  const { navigate, isLoadingPath } = useNavigation();
  const { isChatbotVisible } = useFloatingButtons();

  const handleClick = () => {
    navigate("/transaction/create");
  };

  // Only show for signed-in users
  if (!isSignedIn) return null;

  return (
    <Button
      onClick={handleClick}
      disabled={isLoadingPath("/transaction/create")}
      className={cn(
        // Dynamic positioning based on chatbot visibility
        "fixed right-6 h-12 w-12 rounded-full shadow-lg transition-all duration-300 z-40",
        // When chatbot is visible: above it (bottom-20)
        // When chatbot is hidden: move down to chatbot's position (bottom-6)
        isChatbotVisible ? "bottom-20" : "bottom-6",
        // Important: Use different color to signify importance - orange/amber gradient
        "bg-gradient-to-br from-orange-500 to-amber-500",
        "hover:from-orange-600 hover:to-amber-600",
        "hover:shadow-xl hover:scale-105",
        "border border-orange-300",
        // Show only on mobile (hidden on md and up)
        "md:hidden",
        // Always visible - no scroll-based hiding for transaction button
        "opacity-100 translate-y-0"
      )}
      size="icon"
    >
      {isLoadingPath("/transaction/create") ? (
        <Loader2 className="h-5 w-5 text-white animate-spin" />
      ) : (
        <Plus className="h-5 w-5 text-white" />
      )}
    </Button>
  );
}
