"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActionClinic from "./CellActionClinics";

// Data table from shadcn
// this is step 1 Column Definitions
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClinicColumn = {
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  id: string;
};

// header is what is shown
export const Columns: ColumnDef<ClinicColumn>[] = [
  {
    header: "View/Edit",
    id: "actions",
    // row represents a row of data in the data table, and row.original
    // provides access to the original data object associated with
    // that row. These properties are used in the code to pass the
    // row's original data to the CellAction component for further
    // processing or rendering.
    // the original data object is the UserColumn type
    cell: ({ row }) => <CellActionClinic data={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
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
