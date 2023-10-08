// package to format dates
import { format } from "date-fns";
// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import UsersClientDataTable from "./components/UsersClientDataTable";

export default async function AdminUsersClientPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      clinics: true,
    },
  });

  // formattedUsers is an array
  const formattedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastNames: user.lastNames,
    email: user.email,
    roles: user.roles.map((role) => role).join(", "),
    clinics: user.clinics.map((clinic) => clinic.name).join(", "),
    // formating to string
    createdAt: format(user.createdAt, "MMMM do, yyyy"),
    updatedAt: format(user.updatedAt, "MMMM do, yyyy"),
  }));

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <UsersClientDataTable formattedUsers={formattedUsers} />
      </div>
    </div>
  );
}
