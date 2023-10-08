"use client";

import { ColumnDef } from "@tanstack/react-table";
import UserCellActions from "./UserCellActions";

// Data table from shadcn
// this is step 1 Column Definitions
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserColumn = {
  firstName: string | null;
  lastNames: string | null;
  email: string | null;
  clinics: string;
  roles: string;
  createdAt: string;
  updatedAt: string;
  // id of the individual User
  id: string;
};

// header is what is shown
export const Columns: ColumnDef<UserColumn>[] = [
  {
    header: "View/Edit",
    id: "actions",
    // row represents a row of data in the data table, and row.original
    // provides access to the original data object associated with
    // that row. These properties are used in the code to pass the
    // row's original data to the CellAction component for further
    // processing or rendering.
    // the original data object is the UserColumn type
    cell: ({ row }) => <UserCellActions data={row.original} />,
  },
  {
    // accessorKeys correspond to the key in the data object (formattedUsers)
    // that contains the value for that column
    // hence firstName and createdAt are types of the formattedUsers
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastNames",
    header: "Last Name(s)",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "clinics",
    header: "Assigned Clinics",
  },
  {
    accessorKey: "roles",
    header: "Roles",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    accessorKey: "updatedAt",
    header: "Date Updated",
  },
];
