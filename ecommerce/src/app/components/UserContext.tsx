import { User } from "../../../schemas/DataObjects";
import React, { useMemo } from "react";
import { QueryClient, useQuery, UseQueryResult } from "@tanstack/react-query";

export const queryClient = new QueryClient();

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

const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
};

const CurrentUserContext = React.createContext<UseQueryResult<User> | null>(
  null,
);

export const useCurrentUserContext = () => {
  const currentUser = React.useContext(CurrentUserContext);
  if (!currentUser) {
    throw new Error("CurrentUserContext: No value provided");
  }

  return currentUser;
};

type props = {
  children?: React.ReactNode;
};
export const CurrentUserContextProvider = ({ children }: props) => {
  const queryResult = useCurrentUserQuery();
  const { isPending, isError, isSuccess, data, error } = queryResult;
  console.log("currentUserQuery", {
    isPending,
    isError,
    isSuccess,
    data,
    error,
  });

  return (
    <CurrentUserContext.Provider value={queryResult}>
      {children}
    </CurrentUserContext.Provider>
  );
};
