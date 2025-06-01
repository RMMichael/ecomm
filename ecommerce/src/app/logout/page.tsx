"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryClient } from "@/app/components/UserContext";

const logout = async () => {
  const response = await fetch("http://localhost/api/v1/logout", {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const json = await response.json();
  if (json.status === "error") {
    throw new Error(json.message ?? `Error: ${JSON.stringify(json)}`);
  }

  return json;
};

const LogoutPage = () => {
  const { isPending, isError, isSuccess, error, data } = useQuery({
    queryKey: ["logout"],
    queryFn: logout,
  });
  console.log({ isPending, isError, isSuccess, data, error });
  const router = useRouter();
  if (isSuccess) {
    console.log("Successfully logged out");
    queryClient.invalidateQueries({ queryKey: ["user"], exact: true });
    router.push("/");
  }

  return (
    <>
      <main>
        {isPending && <h1 className="text-center">Logging out...</h1>}
        {isError && (
          <h1 className="text-center text-red-800">
            {error.message ?? "We weren't able to log you out :("}
          </h1>
        )}
      </main>
    </>
  );
};

export default LogoutPage;
