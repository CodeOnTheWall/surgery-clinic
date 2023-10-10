"use client";
// Next
import { useParams } from "next/navigation";
import Link from "next/link";
// Next Auth
import { useSession } from "next-auth/react";
// Components
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
import { UserColumn, Columns } from "./Columns";

interface UsersClientProps {
  formattedUsers: UserColumn[];
}

export default function UsersClientDataTable({
  formattedUsers,
}: UsersClientProps) {
  const params = useParams();

  const { data: session } = useSession();
  const userId = session?.user.userId;

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Employees/Users Assigned to this Clinic (${formattedUsers.length})`}
        />
        <Button>
          <Link href={`/${params.clinicId}/users/${userId}/my-settings`}>
            View My Profile Settings
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
