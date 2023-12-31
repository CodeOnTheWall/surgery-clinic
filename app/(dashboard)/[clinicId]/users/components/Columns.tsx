"use client";

import { ColumnDef } from "@tanstack/react-table";

// Data table from shadcn
// this is step 1 Column Definitions
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserColumn = {
  firstName: string | null;
  lastNames: string | null;
  email: string | null;
  roles: string;
  // id of the individual User
  id: string;
};

// header is what is shown
export const Columns: ColumnDef<UserColumn>[] = [
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
    accessorKey: "roles",
    header: "Roles",
  },
];
