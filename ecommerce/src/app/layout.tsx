"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  CurrentUserContextProvider,
  queryClient,
} from "./components/UserContext";
import { User } from "../../schemas/DataObjects";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <CurrentUserContextProvider>
            <Header />
            <main className="flex grow flex-col px-4">{children}</main>
          </CurrentUserContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
