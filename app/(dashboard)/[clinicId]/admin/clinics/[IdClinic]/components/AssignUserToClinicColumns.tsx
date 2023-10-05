"use client";

import { ColumnDef } from "@tanstack/react-table";
import AssignUserToClinicCellActions from "./AssignUserToClinicCellActions";

// Data table from shadcn
// this is step 1 Column Definitions
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AssignUserToClinicColumn = {
  id: string;
  firstName: string;
  lastNames: string;
  email: string;
  roles: string[]; // Assuming roles is an array of strings
  clinicIDs: string[]; // Assuming clinicIDs is an array of strings
  clinics: any[]; // You can replace 'any' with the actual type for clinics
};

// header is what is shown
export const Columns: ColumnDef<AssignUserToClinicColumn>[] = [
  {
    header: "Assign/Unassign Employee",
    id: "actions",
    // row represents a row of data in the data table, and row.original
    // provides access to the original data object associated with
    // that row. These properties are used in the code to pass the
    // row's original data to the CellAction component for further
    // processing or rendering.
    // the original data object is the UserColumn type
    cell: ({ row }) => <AssignUserToClinicCellActions data={row.original} />,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastNames",
    header: "Last Name(s)",
  },
  {
    accessorKey: "assignedClinics",
    header: "Assigned Clinics",
  },
  {
    accessorKey: "roles",
    header: "Roles",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
