// Next
import { redirect } from "next/navigation";
// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import SettingsForm from "./components/SettingsForm";

interface SettingsPageProps {
  params: {
    clinicId: string;
  };
}

export default async function Settings({ params }: SettingsPageProps) {
  // check if there is a session
  const session = await getServerSession(authOptions);
  const email = session?.user.email;

  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  const clinic = await prisma.clinic.findFirst({
    where: {
      id: params.clinicId,
      email,
    },
  });

  if (!clinic) {
    redirect("/");
  }

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <SettingsForm clinic={clinic} />
      </div>
    </div>
  );
}
