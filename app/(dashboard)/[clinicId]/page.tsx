// Prisma Client
import prisma from "@/lib/prisma";
// Components
import Heading from "@/components/ui/Heading";

interface DashBoardPageProps {
  params: { clinicId: string };
}

// params are auto given by nextjs in the url params
export default async function DashBoardPage({ params }: DashBoardPageProps) {
  const clinic = await prisma.clinic.findFirst({
    where: {
      id: params.clinicId,
    },
  });

  return (
    <div className="flex flex-col gap-y-10 mt-5">
      <Heading
        title={`Clinic Name: ${clinic?.name}`}
        description="Navigate the different tabs to view and manage your clinics, users, and inventory"
      />
      <div>{`Clinic Location Tag for orders: ${clinic?.clinicLocationTag}`}</div>
    </div>
  );
}
