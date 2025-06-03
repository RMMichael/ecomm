import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// const columns = [
//   { key: "name", label: "Name" },
//   { key: "title", label: "Title" },
//   { key: "email", label: "Email" },
//   { key: "role", label: "Role" },
// ];

const columns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "expires_at", label: "Expires At" },
];

const data = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    email: "jane.cooper@example.com",
    role: "Admin",
  },
  {
    name: "Cody Fisher",
    title: "Product Directives Officer",
    email: "cody.fisher@example.com",
    role: "Owner",
  },
  {
    name: "Esther Howard",
    title: "Forward Response Developer",
    email: "esther.howard@example.com",
    role: "Member",
  },
  {
    name: "Jenny Wilson",
    title: "Lead Implementation Liaison",
    email: "jenny.wilson@example.com",
    role: "Member",
  },
  {
    name: "Kristin Watson",
    title: "Lead Implementation Liaison",
    email: "kristin.watson@example.com",
    role: "Admin",
  },
  {
    name: "Kristin 2 Watson",
    title: "Lead Implementation Liaison",
    email: "kristin2.watson@example.com",
    role: "Admin",
  },
  {
    name: "Kristin 3 Watson",
    title: "Lead Implementation Liaison",
    email: "kristin3.watson@example.com",
    role: "Admin",
  },
  {
    name: "Kristin 4 Watson",
    title: "Lead Implementation Liaison",
    email: "kristin4.watson@example.com",
    role: "Admin",
  },
];

function sortData(rows: any, sortKey: any, direction: any) {
  if (!sortKey) return rows;
  const sorted = [...rows].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return direction === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return direction === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

function SortIcon({ direction }: any) {
  return (
    <span className="ml-1 inline-block align-middle">
      {direction === "asc" ? (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16">
          <path d="M8 4l4 6H4l4-6z" fill="currentColor" />
        </svg>
      ) : (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16">
          <path d="M8 12l-4-6h8l-4 6z" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}

const fetchData = async () => {
  const response = await fetch("http://localhost/api/v1/sessions");
  const json = await response.json();
  if (json.status === "error") {
    throw new Error(json.message);
  }
  return json.data;
};
const useData = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchData,
  });
};
const deleteData = async (idx: number) => {
  console.log("deleting data idx", idx);
  // "fetch request to delete returns response from server"
  return new Promise((resolve) => {
    data.splice(idx, 1); // server modifies the data
    const responseFromServer = {
      status: "success",
      data: {
        id: idx,
      },
    };
    resolve(responseFromServer);
  });
};
const useMutateData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteData,
    onSuccess: (responseData: any) => {
      console.log("mutation success", responseData);
      const idxToRemove = responseData.data.id;
      queryClient.setQueryData(["data"], (oldData: any[]) => {
        const newData = [
          ...oldData.slice(0, idxToRemove),
          ...oldData.slice(idxToRemove + 1),
        ];
        console.log("idx", idxToRemove, "old", [...oldData], "new", [
          ...newData,
        ]);
        return newData;
      });
    },
  });
};

type MyComponentProps = {
  name: string;
};
export default function StripedTable() {
  const { isPending, isError, data, error } = useData();
  const mutation = useMutateData();
  const [sortKey, setSortKey] = useState(null);
  const [direction, setDirection] = useState("asc");

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  function handleSort(key: any) {
    if (sortKey === key) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  }

  const sortedData = sortData(data, sortKey, direction);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base leading-6 font-semibold text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="max-h-96 overflow-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className="cursor-pointer py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 select-none sm:pl-0"
                        onClick={() => handleSort(col.key)}
                      >
                        <span className="flex items-center">
                          {col.label}
                          {sortKey === col.key && (
                            <SortIcon direction={direction} />
                          )}
                        </span>
                      </th>
                    ))}
                    <th className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedData.map((person: any, idx: any) => (
                    <tr
                      key={person.email}
                      className={idx % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-3 py-4 text-sm whitespace-nowrap ${
                            col.key === "name"
                              ? "pl-4 font-medium text-gray-900 sm:pl-0"
                              : "text-gray-500"
                          }`}
                        >
                          {person[col.key]}
                        </td>
                      ))}
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            console.log("mutate idx", idx);
                            mutation.mutate(idx);
                          }}
                        >
                          Delete<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
