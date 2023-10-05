"use client";

// Components
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
// Component Specific Components
import { ClinicColumn, Columns } from "./ClinicColumns";

interface ClinicClientProps {
  formattedClinics: ClinicColumn[];
}

export default function ClinicsClientDataTable({
  formattedClinics,
}: ClinicClientProps) {
  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading title="2. Go to Clinic and Assign Employees" />
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
