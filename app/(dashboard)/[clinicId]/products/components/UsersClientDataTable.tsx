"use client";

// Next
import { useParams } from "next/navigation";
import Link from "next/link";
// Components
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
// Component Specific Components
import { UserColumn, Columns } from "./UserColumns";

interface UsersClientProps {
  formattedUsers: UserColumn[];
}

export default function UsersClientDataTable({
  formattedUsers,
}: UsersClientProps) {
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Employees/Users (${formattedUsers.length})`}
          description="Manage Users and their settings"
        />
        <Button>
          <Link href={`/${params.clinicId}/admin/register-employee`}>
            Register a User/Employee
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKeyPlaceholder="search by first name"
        // search by email
        searchKey="firstName"
        // columns from Column Definition in Columns
        columns={Columns}
        // data is data to be seen inside the Columns
        data={formattedUsers}
      />
      <Separator />
    </>
  );
}
