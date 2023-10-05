"use client";

// Components
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
// Component Specific Components
import { AssignUserToClinicColumn, Columns } from "./AssignUserToClinicColumns";

interface UsersClientProps {
  formattedUsers: AssignUserToClinicColumn[];
}

export default function AssignUserToClinicDataTable({
  formattedUsers,
}: UsersClientProps) {
  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title="Assign Employees to Clinic"
          description="You can unassign or reassign at anytime"
        />
      </div>
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
