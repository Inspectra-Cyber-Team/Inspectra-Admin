"use client";
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import "@/app/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { UserNav } from "@/components/navbar";
import StoreProvider from "@/app/StoreProvider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mounted, setMounted] = useState(false);

  // This effect ensures the component renders after it's mounted in the client-side
  useEffect(() => {
    setMounted(true);
  }, []); // Empty dependency ensures this only runs after the initial mount

  // If not mounted, we return only the loading spinner, which ensures no hydration issues
  if (!mounted) {
    return (
      <div>
        {/* Show the loader only on the client */}
        <div className="loader-container">
          <div className="loader" role="status">
          </div>
        </div>
      </div>
    );
  }

  // Once mounted, return the full layout, including ThemeProvider
  return (
    <div className={`${geistSans.variable} antialiased`}>
      <StoreProvider>
        {/* ThemeProvider is always present to avoid hydration issues */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <SidebarTrigger />
              <UserNav />
              <Toaster />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </StoreProvider>
    </div>
  );
}
