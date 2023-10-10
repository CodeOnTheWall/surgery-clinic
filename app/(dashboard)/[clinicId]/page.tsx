// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Prisma Client
import prisma from "@/lib/prisma";
// Components
import Heading from "@/components/ui/Heading";
import UsersClientDataTable from "./users/components/UsersClientDataTable";

interface DashBoardPageProps {
  params: { clinicId: string };
}

// params are auto given by nextjs in the url params
export default async function DashBoardPage({ params }: DashBoardPageProps) {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findFirst({
    where: {
      id: session?.user.userId,
    },
  });

  const workingUser = {
    firstName: user?.firstName,
    lastNames: user?.lastNames,
    roles: user?.roles.map((role) => role).join(", "),
  };

  const clinic = await prisma.clinic.findFirst({
    where: {
      id: params.clinicId,
    },
  });

  const usersAssignedToClinic = await prisma.user.findMany({
    where: {
      clinicIDs: {
        has: params.clinicId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // formattedUsers is an array
  const formattedUsers = usersAssignedToClinic.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastNames: user.lastNames,
    email: user.email,
    roles: user.roles.map((role) => role).join(", "),
  }));

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`Clinic Name: ${clinic?.name}`}
          description="Navigate the different tabs to view and manage your clinic"
        />
        <div>
          <div>{`Clinic Location Tag for orders: ${clinic?.clinicLocationTag}`}</div>
          <div>{`Current Employee/User Working: ${workingUser?.firstName} ${workingUser?.lastNames} - ${workingUser?.roles}`}</div>
        </div>
        <UsersClientDataTable formattedUsers={formattedUsers} />
      </div>
    </div>
  );
}
