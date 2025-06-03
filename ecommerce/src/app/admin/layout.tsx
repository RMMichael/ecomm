"use client";
import React, { useState } from "react";
import { useCurrentUserContext } from "@/app/components/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Sessions
// Users
//
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type VerticalTabsProps = {
  children?: React.ReactNode;
};
function VerticalTabs({ children }: VerticalTabsProps) {
  const pathname = usePathname();
  const tabs = [
    {
      label: "Home",
      href: "/admin",
    },
    {
      label: "Profile",
      href: "#",
    },
    {
      label: "Sessions",
      href: "/admin/sessions",
    },
    {
      label: "Users",
      href: "#",
    },
  ];
  return (
    <div className="mx-auto flex w-full max-w-7xl grow rounded border shadow">
      {/* Tabs */}
      <div className="flex w-40 flex-col border-r bg-gray-800">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            className={`px-4 py-3 text-left transition-colors ${
              tab.href === pathname
                ? "bg-gray-900 font-semibold text-white"
                : "cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            href={tab.href}
          >
            {tab.label}
          </Link>
        ))}
        {tabs.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={classNames(
              pathname === item.href
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white",
              "rounded-md px-3 py-2 text-sm font-medium",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="grow">
        <h1 className="text-xl">{pathname}</h1>
        {children}
      </div>
    </div>
  );
}

type AdminLayoutProps = {
  children?: React.ReactNode;
};
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const userContext = useCurrentUserContext();

  if (userContext.isPending) {
    // loading spinner
    return <h1 className="text-4xl text-yellow-200">Loading...</h1>;
  }
  if (userContext.isError) {
    return (
      <h1 className="text-4xl text-red-400">
        You must be logged in to view this page.
      </h1>
    );
  }

  return (
    <>
      <VerticalTabs>{children}</VerticalTabs>
    </>
  );
};

export default AdminLayout;
