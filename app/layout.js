import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/contexts/currency-context";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "FineFiance - Financial Dashboard",
  description: "A modern financial dashboard application",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CurrencyProvider>
              <Header />

              <main className="min-h-[calc(100vh-64px)]">{children}</main>
              <Toaster />

              <footer className="py-12 border-t border-border/10">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                      <Link
                        href="/"
                        className="flex items-center justify-center md:justify-start mb-4"
                      >
                        <Image
                          src="/logo.png"
                          alt="FineFinance"
                          width={32}
                          height={32}
                          className="mr-2"
                        />
                        <span className="font-medium text-lg">FineFinance</span>
                      </Link>
                      <p className="text-muted-foreground text-sm max-w-md">
                        A portfolio project by Akash showcasing modern web
                        development with Next.js and React.
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                      <div className="flex space-x-4">
                        <Link
                          href="https://github.com/akash230201"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                        </Link>
                        <Link
                          href="https://www.linkedin.com/in/akashmondal739"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect width="4" height="12" x="2" y="9"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </Link>
                        <Link
                          href="https://x.com/Techno_Define"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </Link>
                        <Link
                          href="mailto:akashmondal739@gmail.com"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <rect
                              width="20"
                              height="16"
                              x="2"
                              y="4"
                              rx="2"
                            ></rect>
                            <path d="m22 7-10 5L2 7"></path>
                          </svg>
                        </Link>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        © {new Date().getFullYear()} Made with ❤️ by Akash
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </CurrencyProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
