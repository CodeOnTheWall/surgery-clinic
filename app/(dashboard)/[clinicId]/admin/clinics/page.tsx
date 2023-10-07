// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
// package to format dates
import { format } from "date-fns";
// Prisma Client
import prisma from "@/lib/prisma";
// Next
import { redirect } from "next/navigation";
// Page Specific Components
import ClinicsClientDataTable from "./components/ClinicsClientDataTable";

// add redirect if user isnt admin admin, check to see if session
// has information from credentials
export default async function AdminClinicsClientPage() {
  const session = getServerSession(authOptions);
  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  const clinics = await prisma.clinic.findMany({
    select: {
      id: true,
      name: true,
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
  console.log(formattedClinics);

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <ClinicsClientDataTable formattedClinics={formattedClinics} />
      </div>
    </div>
  );
}
