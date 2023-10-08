// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import AdminClinicForm from "./components/AdminClinicForm";
import AssignUserToClinicDataTable from "./components/AssignUserToClinicDataTable";

interface AdminClinicPageProps {
  params: {
    IdClinic: string;
  };
}

// params always available on server side, and we have userId since
// we are inside [userId]

export default async function AdminClinicPage({
  params,
}: AdminClinicPageProps) {
  const clinic = await prisma.clinic.findUnique({
    where: {
      id: params.IdClinic,
    },
    include: {
      users: true,
    },
  });

  const formattedClinic = {
    id: clinic!.id,
    name: clinic!.name!,
    clinicLocationTag: clinic!.clinicLocationTag,
    users: clinic!.users.map((user) => ({
      name: user!.name!,
      roles: user!.roles!, // Assuming roles is an array
      email: user!.email!,
    })),
  };

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastNames: true,
      roles: true,
      email: true,
      clinicIDs: true,
      clinics: {
        select: {
          name: true,
        },
      },
    },
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName!,
    lastNames: user.lastNames!,
    roles: user.roles!,
    email: user.email!,
    clinicIDs: user.clinicIDs,
    clinics: user.clinics.map((clinic) => clinic.name).join(", "),
  }));

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <AdminClinicForm clinic={formattedClinic} />
        <AssignUserToClinicDataTable formattedUsers={formattedUsers} />
      </div>
    </div>
  );
}
