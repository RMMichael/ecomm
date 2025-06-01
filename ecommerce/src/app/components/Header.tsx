import Link from "next/link";
import { useState } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useContext } from "react";
import { CurrentUserContext } from "@/app/components/UserContext";

export default function Header() {
  const result = useContext(CurrentUserContext);
  const { isSuccess, data: user } = result ?? {};

  const isLoggedIn = isSuccess && user?.name;

  return (
    <header className={"flex p-4"}>
      <Link href="/" className="mr-auto px-4 py-2">
        Ecomm
      </Link>
      <nav>
        <ul className={"list-style-none flex"}>
          <li className={"px-4 py-2"}>
            <Link href="/">Home</Link>
          </li>
          <li className={"px-4 py-2"}>
            <Link href="/">About</Link>
          </li>
          {isLoggedIn && (
            <li className={"px-4 py-2"}>Logged in as {user.name}</li>
          )}
          <li className={"ml-4"}>
            {isLoggedIn ? (
              <Link href="/logout">
                <button
                  className={
                    "cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  }
                >
                  Sign Out
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button
                  className={
                    "rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  }
                >
                  Sign In
                </button>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
