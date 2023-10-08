"use client";

// Next
import Link from "next/link";
import { useParams } from "next/navigation";
// Components
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
// Component Specific Components
import { ClinicColumn, Columns } from "./ClinicColumns";
import { Button } from "@/components/ui/button";

interface ClinicClientProps {
  formattedClinics: ClinicColumn[];
}

export default function ClinicsClientDataTable({
  formattedClinics,
}: ClinicClientProps) {
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title="2. Go to Clinic and Manage Employees"
          description="View a clinic to assign/unassign employees or manage the inventory for that clinic."
        />
        <Button>
          <Link href={`/${params.clinicId}/admin/register-clinic`}>
            Register a Clinic
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKeyPlaceholder="search by name"
        // search by email
        searchKey="name"
        // columns from Column Definition in Columns
        columns={Columns}
        // data is data to be seen inside the Columns
        data={formattedClinics}
      />
      <Separator />
    </>
  );
}
