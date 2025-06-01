import { User } from "../../../schemas/DataObjects";
import React from "react";
import { QueryClient, UseQueryResult } from "@tanstack/react-query";

export const CurrentUserContext =
  React.createContext<UseQueryResult<User | null> | null>(null);

export const queryClient = new QueryClient();
