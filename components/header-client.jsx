"use client";

import { ThemeToggle } from "./theme-toggle";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function HeaderClient({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Ensure component is mounted on client before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when pathname changes (navigation occurs)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!mounted) {
    // Return simplified version for SSR to prevent hydration mismatch
    return (
      <>
        <div className="h-9 w-9"></div>
        <div className="h-9 w-9"></div>
      </>
    );
  }

  // Extract mobile menu content from children
  const mobileMenuContent = children.find((child) =>
    child.props?.className?.includes("flex-1 space-y-4")
  );

  // Filter out mobile menu content from regular children
  const regularChildren = children.filter(
    (child) => !child.props?.className?.includes("flex-1 space-y-4")
  );

  return (
    <>
      <ThemeToggle />

      {regularChildren}

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[320px] sm:w-[400px] p-0 bg-background/95 backdrop-blur-xl border-l border-border/50"
          >
            <div className="flex flex-col h-full">
              <div className="px-6 py-6 border-b border-border/20 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">
                      Navigation
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Quick access to your financial tools
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 px-6 py-6 overflow-y-auto">
                {mobileMenuContent}
              </div>
              <div className="px-6 py-4 border-t border-border/20 bg-muted/20">
                <p className="text-xs text-muted-foreground text-center">
                  Swipe right or tap outside to close
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
