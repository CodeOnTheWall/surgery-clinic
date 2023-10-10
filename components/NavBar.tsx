// Next
import Link from "next/link";
import { redirect } from "next/navigation";
// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Prisma Client
import prisma from "@/lib/prisma";
// Components
import MainNav from "./MainNav";
import ClinicSwitcher from "./ClinicSwitcher";

export default async function NavBar() {
  // check if there is a session
  const session = await getServerSession(authOptions);
  const userId = session?.user.userId;

  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  const clinics = await prisma.clinic.findMany({
    where: {
      userIDs: {
        has: userId,
      },
    },
  });

  return (
    <div className=" border-b">
      {/* reminder items center is cross axis */}
      <div className="flex h-16 items-center px-4">
        <ClinicSwitcher clinics={clinics} />
        <MainNav className="mx-6" />
        {/* ml auto moves all the way to right */}
        <div className=" ml-auto flex items-center space-x-4">
          <Link href="/api/auth/signout">Sign Out</Link>
        </div>
      </div>
    </div>
  );
}
