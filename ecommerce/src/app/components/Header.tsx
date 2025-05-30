import Link from "next/link";
import { useState } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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
  return json;
};

export default function Header() {
  const { isPending, isError, isSuccess, data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  console.log("query result", { isPending, isError, isSuccess, data });
  const isLoggedIn = isSuccess && data.data.user;
  console.log("isLoggedIn", isLoggedIn);

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
            <li className={"px-4 py-2"}>Logged in as {data.data.user.name}</li>
          )}
          <li className={"ml-4"}>
            {isLoggedIn ? (
              <Link href="/logout">
                <button
                  className={
                    "rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
