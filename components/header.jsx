import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, Menu, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
import { HeaderClient } from "./header-client";
import {
  NavigationButtons,
  MobileNavigationButtons,
} from "./navigation-buttons";
import { ConditionalLogo } from "./conditional-logo";

const Header = async () => {
  await checkUser();

  return (
    <div className="fixed top-0 w-full backdrop-blur-md z-50 border-b border-border/10 bg-background/80">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        <ConditionalLogo />

        <div className="flex items-center gap-2 md:gap-3">
          <HeaderClient>
            <SignedIn>
              <NavigationButtons />
            </SignedIn>

            <SignedOut>
              <div className="hidden md:flex items-center gap-3">
                <SignInButton forceRedirectUrl="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md h-9 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton forceRedirectUrl="/dashboard">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-md h-9 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9",
                    userButtonAvatarImage: "rounded-full",
                    userButtonProfile: "hidden",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile menu content */}
            <div className="flex-1 space-y-4">
              <SignedIn>
                <MobileNavigationButtons />
              </SignedIn>

              <SignedOut>
                <div className="pt-6 space-y-3">
                  <SignInButton forceRedirectUrl="/dashboard">
                    <Button
                      variant="outline"
                      className="w-full h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton forceRedirectUrl="/dashboard">
                    <Button className="w-full h-11 shadow-sm hover:shadow-md transition-all duration-200">
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </HeaderClient>
        </div>
      </nav>
    </div>
  );
};

export default Header;
