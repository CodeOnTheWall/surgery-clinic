"use client";

// Components
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
// Component Specific Components
import { UserColumn, Columns } from "./Columns";

interface UsersClientProps {
  formattedUsers: UserColumn[];
}

export default function UsersClient({ formattedUsers }: UsersClientProps) {
  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Users (${formattedUsers.length})`}
          description="Manage Users and their Clinics"
        />
      </div>
      <Separator />
      <DataTable
        searchKeyPlaceholder="search by email"
        // search by email
        searchKey="email"
        // columns from Column Definition in Columns
        columns={Columns}
        // data is data to be seen inside the Columns
        data={formattedUsers}
      />
      <Separator />
    </>
  );
}
