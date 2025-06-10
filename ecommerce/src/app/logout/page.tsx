"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { queryClient } from "@/app/components/UserContext";
import { useEffect } from "react";

// 1. logout request
// 2. 205 response, session cookie is cleared, but no json
// 3. ERROR: error parsing empty json, so retry logout
// 4. ERROR: 200 response with {status: "error", message: "user not found"} because session was cleared in 2.
// 5. final result: no success,
// FIX: step 2 returns proper json, so no error ever.

// TODO: stop query from retrying and show the first error right away
//

const logoutRequest = async () => {
  console.log("performing logout fetch request...");
  try {
    const response = await fetch("http://localhost/api/v1/logout", {
      credentials: "include",
      method: "POST",
    });
    console.log("logout fetch response:", response);

    const json = await response.json();
    if (json.status === "error") {
      console.error("logout fetch response app error:", json);
      throw new Error(json.message ?? `Error: ${JSON.stringify(json)}`);
    }

    console.log("logout fetch response json:", json);

    return json;
  } catch (e) {
    console.error("caught error:", e);
    throw e;
  }
};

const LogoutPage = () => {
  const {
    isPending,
    isError,
    isSuccess,
    error,
    mutate: logout,
  } = useMutation({
    mutationFn: logoutRequest,
    onSuccess: (data, variables, context) => {
      console.log("Successfully logged out");
      queryClient.invalidateQueries({ queryKey: ["user"], exact: true });
    },
  });

  // log out automatically when page is rendered
  console.log("logout component render", { isSuccess, isPending, isError });
  useEffect(() => {
    console.log("useEffect logout", logout);
    logout();
  }, [logout]);

  return (
    <>
      {isSuccess && <h1 className="text-center text-green-300">Logged out!</h1>}
      {isPending && <h1 className="text-center">Logging out...</h1>}
      {isError && (
        <h1 className="text-center text-red-800">
          {error.message ?? "We weren't able to log you out :("}
        </h1>
      )}
    </>
  );
};

export default LogoutPage;
