"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideBar from "@/components/SideBar/SideBar";
import { Box } from "@mui/material";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <SideBar />                

            {children}
          </Box>
        </QueryClientProvider>
      </body>
    </html>
  );
}
