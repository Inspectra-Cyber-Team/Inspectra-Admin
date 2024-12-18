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
  // Handle client-side mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false);

  // Set mounted to true when the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // If mounted is false, render a loading state (optional), otherwise render the layout
  if (!mounted) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} antialiased`}>
          {/* Optionally, show a loading spinner or nothing until mounted */}
          <p>Loading...</p>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <StoreProvider>
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
      </body>
    </html>
  );
}
