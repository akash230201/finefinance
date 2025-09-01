"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export function ConditionalLogo() {
  const { isSignedIn } = useUser();

  // Determine the destination based on authentication status
  const href = isSignedIn ? "/dashboard" : "/";

  return (
    <Link
      href={href}
      className="flex items-center transition-transform duration-200 hover:scale-105"
    >
      <Image
        src="/logo.png"
        alt="FineFinance"
        width={120}
        height={40}
        priority
        className="transition-opacity duration-200 hover:opacity-90"
      />
    </Link>
  );
}
