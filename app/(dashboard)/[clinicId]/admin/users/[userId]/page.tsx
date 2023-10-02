// Prisma Client
import prisma from "@/lib/prisma";
import { Clinic } from "@prisma/client";
// Page Specific Components
import UserForm from "./components/UserForm";

interface UserPageProps {
  params: {
    userId: string;
  };
}

// params always available on server side, and we have userId since
// we are inside [userId]

export default async function AdminUserPage({ params }: UserPageProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    // populating clinic relation
    include: {
      clinics: true,
    },
  });
  // console.log("user", user);

  const clinics = await prisma.clinic.findMany({});
  // console.log("all clinics", clinics);

  interface formattedClinics {
    email: string;
    name: string;
    id: string;
  }

  const formattedClinics: formattedClinics[] = clinics.map((clinic) => ({
    name: clinic.name,
    email: clinic.email,
    id: clinic.id,
  }));
  // console.log("formattedClinics", formattedClinics);

  interface formattedUsers {
    firstName: string;
    lastNames: string;
    email: string;
    roles: string[];
    clinics: Clinic[];
  }

  // Since User model has some values that are String? since we may use both credentials
  // and google provider, we are telling ts here that in this case, the below,
  // are not going to be null
  const formattedUser: formattedUsers = {
    firstName: user!.firstName!,
    lastNames: user!.lastNames!,
    email: user!.email!,
    roles: user!.roles,
    // Map clinics to an array of strings
    clinics: user!.clinics,
  };
  // console.log("formattedUser", formattedUser);

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <UserForm user={formattedUser} clinics={formattedClinics} />
      </div>
    </div>
  );
}
