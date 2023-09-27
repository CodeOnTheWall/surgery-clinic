// Prisma Client
import prisma from "@/lib/prisma";
// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// package to format dates
import { format } from "date-fns";
// Next
import { redirect } from "next/navigation";

import UsersClient from "./components/UsersClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/users");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // formattedUsers is an array
  const formattedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastNames: user.lastNames,
    email: user.email,
    roles: user.roles.map((role) => role).join(", "),
    // formating to string
    createdAt: format(user.createdAt, "MMMM do, yyyy"),
    updatedAt: format(user.updatedAt, "MMMM do, yyyy"),
  }));
  console.log(formattedUsers);

  return (
    <div className="flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <UsersClient formattedUsers={formattedUsers} />
      </div>
    </div>
  );
}
