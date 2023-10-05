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
import RegisterForm from "./components/RegisterUser";
import AdminUsersClient from "./components/AdminUsersClient";

// add redirect if user isnt admin admin, check to see if session
// has information from credentials
export default async function AdminUsersClientPage() {
  const session = getServerSession(authOptions);
  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

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

  const clinics = await prisma.clinic.findMany({});
  console.log(clinics);

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <RegisterForm />
        <AdminUsersClient formattedUsers={formattedUsers} />
      </div>
    </div>
  );
}
