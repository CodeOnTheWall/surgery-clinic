// Prisma Client
import prisma from "@/lib/prisma";

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

  return <div>{clinic?.name}</div>;
}
