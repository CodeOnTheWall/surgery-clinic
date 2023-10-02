"use client";

// Components
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
// Component Specific Components
import { ClinicColumn, Columns } from "./ColumnsClinics";

interface ClinicClientProps {
  formattedClinics: ClinicColumn[];
}

export default function AdminClinicsClient({
  formattedClinics,
}: ClinicClientProps) {
  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading
          title={`Clinics (${formattedClinics.length})`}
          description="Manage Clinics"
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
        data={formattedClinics}
      />
      <Separator />
    </>
  );
}
