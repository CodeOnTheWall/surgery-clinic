// Next
import { redirect } from "next/navigation";
// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import SettingsForm from "./components/SettingsForm";
import Heading from "@/components/ui/Heading";

interface SettingsPageProps {
  params: {
    clinicId: string;
  };
}

export default async function Settings({ params }: SettingsPageProps) {
  // check if there is a session
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles;

  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  const clinic = await prisma.clinic.findFirst({
    where: {
      id: params.clinicId,
    },
  });

  if (!clinic) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {!roles?.includes("SYSTEMADMIN") && !roles?.includes("CLINICOWNER") ? (
          <Heading
            title={`Clinic Name: ${clinic.name}`}
            description="To alter clinic settings, please log in as Clinic Owner or System Admin"
          />
        ) : (
          <SettingsForm clinic={clinic} />
        )}
      </div>
    </div>
  );
}
