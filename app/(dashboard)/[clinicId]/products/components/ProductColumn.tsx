"use client";

import { ColumnDef } from "@tanstack/react-table";
import ProductCellActions from "./ProductCellActions";

// Data table from shadcn
// this is step 1 Column Definitions
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  upc: string;
  name: string;
  description: string;
  detail: string;
  manufacturer: string;
  vendor: string;
};

// header is what is shown
export const Columns: ColumnDef<ProductColumn>[] = [
  {
    header: "View/Edit",
    id: "actions",
    // row represents a row of data in the data table, and row.original
    // provides access to the original data object associated with
    // that row. These properties are used in the code to pass the
    // row's original data to the CellAction component for further
    // processing or rendering.
    // the original data object is the UserColumn type
    cell: ({ row }) => <ProductCellActions data={row.original} />,
  },

  {
    accessorKey: "upc",
    header: "UPC",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "detail",
    header: "Detail",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
];
