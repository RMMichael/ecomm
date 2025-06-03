"use client";
import React, { useState } from "react";
import { queryClient } from "@/app/components/UserContext";
import Link from "next/link";
import StripedTable from "@/app/components/StripedTable";

// Sessions
// Users
//
const SessionPage = () => {
  return (
    <div>
      <StripedTable></StripedTable>
    </div>
  );
};

export default SessionPage;
