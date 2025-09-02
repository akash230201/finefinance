"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [loadingPath, setLoadingPath] = useState(null);

  // Clear loading state when navigation completes
  useEffect(() => {
    if (!isPending && loadingPath) {
      const timer = setTimeout(() => {
        setLoadingPath(null);
      }, 100); // Small delay to prevent flicker
      return () => clearTimeout(timer);
    }
  }, [isPending, loadingPath, pathname]);

  const navigate = (path) => {
    setLoadingPath(path);
    startTransition(() => {
      router.push(path);
    });
  };

  const isNavigating = isPending;
  const isLoadingPath = (path) => loadingPath === path && isPending;

  return {
    navigate,
    isNavigating,
    isLoadingPath,
    router,
  };
}
