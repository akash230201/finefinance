"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox, Globe } from "lucide-react";
import { useCurrentPath } from "@/hooks/use-current-path";

export function NavigationButtons() {
  const { isDashboard } = useCurrentPath();

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Only show Dashboard button if NOT on dashboard page */}
      {!isDashboard && (
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="rounded-md h-9 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
          >
            <LayoutDashboard size={16} className="mr-2" />
            <span>Dashboard</span>
          </Button>
        </Link>
      )}

      <Link href="/currency">
        <Button
          variant="outline"
          size="sm"
          className="rounded-md h-9 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
        >
          <Globe size={16} className="mr-2" />
          <span>Currency</span>
        </Button>
      </Link>

      <Link href="/transaction/create">
        <Button
          size="sm"
          className="rounded-md h-9 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <PenBox size={16} className="mr-2" />
          <span>New Transaction</span>
        </Button>
      </Link>
    </div>
  );
}

export function MobileNavigationButtons() {
  const { isDashboard } = useCurrentPath();

  return (
    <>
      {/* Only show Dashboard button if NOT on dashboard page */}
      {!isDashboard && (
        <Link
          href="/dashboard"
          className="flex items-center px-2 py-3 text-base font-medium hover:bg-muted rounded-md transition-colors duration-200"
        >
          <LayoutDashboard size={18} className="mr-3" />
          Dashboard
        </Link>
      )}

      <Link
        href="/currency"
        className="flex items-center px-2 py-3 text-base font-medium hover:bg-muted rounded-md transition-colors duration-200"
      >
        <Globe size={18} className="mr-3" />
        Currency Center
      </Link>

      <Link
        href="/transaction/create"
        className="flex items-center px-2 py-3 text-base font-medium hover:bg-muted rounded-md transition-colors duration-200"
      >
        <PenBox size={18} className="mr-3" />
        New Transaction
      </Link>
    </>
  );
}
