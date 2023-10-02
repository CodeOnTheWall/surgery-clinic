// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import AdminClinicsForm from "./components/AdminClinicsForm";

interface AdminClinicsPageProps {
  params: {
    IdClinic: string;
  };
}

// params always available on server side, and we have userId since
// we are inside [userId]

export default async function AdminClinicsPage({
  params,
}: AdminClinicsPageProps) {
  const clinics = await prisma.clinic.findMany({});
  console.log("all clinics", clinics);

  const clinic = await prisma.clinic.findUnique({
    where: {
      id: params.IdClinic,
    },
  });
  console.log(params);

  interface formattedClinic {
    email: string;
    name: string;
    id: string;
  }

  const formattedClinic: formattedClinic = {
    id: clinic!.id,
    name: clinic!.name!,
    email: clinic!.email,
  };
  // console.log("formattedClinics", formattedClinics);

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <AdminClinicsForm clinic={formattedClinic} />
      </div>
    </div>
  );
}
