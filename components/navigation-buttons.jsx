"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox, Globe, Loader2 } from "lucide-react";
import { useCurrentPath } from "@/hooks/use-current-path";
import { useNavigation } from "@/hooks/use-navigation";

export function NavigationButtons() {
  const { isDashboard } = useCurrentPath();
  const { navigate, isLoadingPath } = useNavigation();

  const handleNavigation = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Only show Dashboard button if NOT on dashboard page */}
      {!isDashboard && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-md h-9 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
          onClick={handleNavigation("/dashboard")}
          disabled={isLoadingPath("/dashboard")}
        >
          {isLoadingPath("/dashboard") ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <LayoutDashboard size={16} className="mr-2" />
          )}
          <span>Dashboard</span>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="rounded-md h-9 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
        onClick={handleNavigation("/currency")}
        disabled={isLoadingPath("/currency")}
      >
        {isLoadingPath("/currency") ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Globe size={16} className="mr-2" />
        )}
        <span>Currency</span>
      </Button>

      <Button
        size="sm"
        className="rounded-md h-9 shadow-sm hover:shadow-md transition-all duration-200"
        onClick={handleNavigation("/transaction/create")}
        disabled={isLoadingPath("/transaction/create")}
      >
        {isLoadingPath("/transaction/create") ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <PenBox size={16} className="mr-2" />
        )}
        <span>New Transaction</span>
      </Button>
    </div>
  );
}

export function MobileNavigationButtons() {
  const { isDashboard } = useCurrentPath();
  const { navigate, isLoadingPath } = useNavigation();

  const handleNavigation = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  const buttonBaseClass =
    "relative flex items-center px-5 py-4 text-base font-medium bg-card/50 hover:bg-card/80 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full text-left group border border-border/40 hover:border-border/60 shadow-sm hover:shadow-md backdrop-blur-sm";

  const primaryButtonClass =
    "relative flex items-center px-5 py-4 text-base font-medium bg-primary/5 hover:bg-primary/10 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full text-left group border border-primary/20 hover:border-primary/30 shadow-sm hover:shadow-md backdrop-blur-sm";

  return (
    <div className="space-y-3">
      {/* Only show Dashboard button if NOT on dashboard page */}
      {!isDashboard && (
        <button
          onClick={handleNavigation("/dashboard")}
          disabled={isLoadingPath("/dashboard")}
          className={buttonBaseClass}
        >
          <div className="flex items-center w-full">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 group-hover:bg-muted/70 transition-colors mr-4">
              {isLoadingPath("/dashboard") ? (
                <Loader2 size={18} className="animate-spin text-primary" />
              ) : (
                <LayoutDashboard
                  size={18}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
              )}
            </div>
            <div className="flex-1">
              <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 block">
                Dashboard
              </span>
              <span className="text-xs text-muted-foreground">
                Overview & analytics
              </span>
            </div>
          </div>
        </button>
      )}

      <button
        onClick={handleNavigation("/currency")}
        disabled={isLoadingPath("/currency")}
        className={buttonBaseClass}
      >
        <div className="flex items-center w-full">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 group-hover:bg-muted/70 transition-colors mr-4">
            {isLoadingPath("/currency") ? (
              <Loader2 size={18} className="animate-spin text-primary" />
            ) : (
              <Globe
                size={18}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
            )}
          </div>
          <div className="flex-1">
            <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 block">
              Currency Center
            </span>
            <span className="text-xs text-muted-foreground">
              Exchange rates & conversion
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={handleNavigation("/transaction/create")}
        disabled={isLoadingPath("/transaction/create")}
        className={primaryButtonClass}
      >
        <div className="flex items-center w-full">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mr-4">
            {isLoadingPath("/transaction/create") ? (
              <Loader2 size={18} className="animate-spin text-primary" />
            ) : (
              <PenBox
                size={18}
                className="text-primary group-hover:scale-110 transition-transform"
              />
            )}
          </div>
          <div className="flex-1">
            <span className="font-semibold text-primary group-hover:translate-x-1 transition-transform duration-200 block">
              New Transaction
            </span>
            <span className="text-xs text-primary/70">
              Add income or expense
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
