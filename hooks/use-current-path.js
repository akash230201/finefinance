"use client";

import { usePathname } from "next/navigation";

export function useCurrentPath() {
  const pathname = usePathname();

  // Check if current route is dashboard (exact match or dashboard sub-routes)
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // Check if user is in main application routes (not auth or landing page)
  const isMainRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transaction") ||
    pathname.startsWith("/accounts");

  // Check if user is on landing page
  const isLandingPage = pathname === "/";

  // Check if user is on auth pages
  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.includes("auth");

  return {
    pathname,
    isDashboard,
    isMainRoute,
    isLandingPage,
    isAuthPage,
  };
}
