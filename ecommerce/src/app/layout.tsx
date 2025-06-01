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
import { CurrentUserContext, queryClient } from "./components/UserContext";
import { User } from "../../schemas/DataObjects";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fetchUser = async () => {
  console.log("fetching user");
  const response = await fetch("http://localhost/api/v1/users/me", {
    credentials: "include",
  });
  console.log("response.ok:", response.ok);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  // TODO: validate data
  const json = await response.json();
  console.log("got user data", json);
  if (json.status === "error") {
    throw new Error(json.message ?? `Error: ${JSON.stringify(json)}`);
  }

  return (json.data.user as User) ?? null;
};

const UserContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const useQueryResult = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const { isPending, isError, isSuccess, isFetching, data, error } =
    useQueryResult;

  console.log("query result", { isPending, isError, data, error });

  return (
    <CurrentUserContext.Provider value={useQueryResult}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <Header />
            <main>{children}</main>
          </UserContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
