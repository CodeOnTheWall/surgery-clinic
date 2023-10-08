// package to format dates
import { format } from "date-fns";
// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import ClinicsClientDataTable from "./components/ClinicsClientDataTable";

// add redirect if user isnt admin admin, check to see if session
// has information from credentials
export default async function AdminClinicsClientPage() {
  const clinics = await prisma.clinic.findMany({
    select: {
      id: true,
      name: true,
      clinicLocationTag: true,
      createdAt: true,
      updatedAt: true,
      userIDs: true,
      users: {
        select: {
          firstName: true,
          lastNames: true,
          roles: true,
        },
      },
    },
  });

  const formattedClinics = clinics.map((clinic) => ({
    id: clinic.id!,
    name: clinic.name!,
    clinicLocationTag: clinic.clinicLocationTag,
    // formating to string
    createdAt: format(clinic.createdAt!, "MMMM do, yyyy"),
    updatedAt: format(clinic.updatedAt!, "MMMM do, yyyy"),
    userIDs: clinic.userIDs!,
    users: clinic
      .users!.map(
        (user) =>
          `${user.firstName} ${user.lastNames} - ${user.roles.join(", ")}.`
      )
      .join(" "),
  }));

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <ClinicsClientDataTable formattedClinics={formattedClinics} />
      </div>
    </div>
  );
}
