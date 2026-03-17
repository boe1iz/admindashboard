"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { ClientBottomNav } from "@/components/ClientBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isClient, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isAuthorized = user && (isAdmin || isClient);
      if (!isAuthorized && pathname !== "/login") {
        router.replace("/login");
      } else if (isAuthorized && pathname === "/login") {
        router.replace("/");
      }
    }
  }, [user, isAdmin, isClient, loading, pathname, router]);

  // For protected pages, show a loading spinner while auth resolves.
  // For the login page, keep it rendered so its own effect can detect
  // auth completion and trigger navigation — do NOT unmount it.
  if (loading && pathname !== "/login") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  // Hide protected UI if on login page
  const isLoginPage = pathname === "/login";

  if (!user && !isLoginPage) return null;

  return (
    <div className="flex h-screen overflow-hidden flex-col lg:flex-row">
      {!isLoginPage && isAdmin && <MobileNav />}
      {!isLoginPage && isAdmin && <Sidebar />}
      <main className={cn(
        "flex-1 overflow-hidden relative",
        !isLoginPage && isClient && "pb-20 lg:pb-0"
      )}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={
              isLoginPage ? "" : "absolute inset-0 overflow-y-auto p-container"
            }
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isLoginPage && isClient && <ClientBottomNav />}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
