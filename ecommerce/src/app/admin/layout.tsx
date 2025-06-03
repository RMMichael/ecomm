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
    <div className="mx-auto flex w-full max-w-5xl grow rounded border shadow">
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
      <div>
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

  const navigation = [
    { name: "Dashboard", href: "#", current: true },
    { name: "Team", href: "#", current: false },
    { name: "Projects", href: "#", current: false },
    { name: "Calendar", href: "#", current: false },
  ];

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

      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium",
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            {/*<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">*/}
            {/*  <button*/}
            {/*    type="button"*/}
            {/*    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"*/}
            {/*  >*/}
            {/*    <span className="absolute -inset-1.5" />*/}
            {/*    <span className="sr-only">View notifications</span>*/}
            {/*    /!*<BellIcon aria-hidden="true" className="size-6" />*!/*/}
            {/*    <span className="inline-block size-6">🔔</span>*/}
            {/*  </button>*/}
            {/*</div>*/}
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminLayout;
