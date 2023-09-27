// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";

import { redirect } from "next/navigation";

import NavBar from "@/components/NavBar";

interface DashBoardLayoutProps {
  children: React.ReactNode;
  params: { clinicId: string };
}

// params are received from the url - in this case store.id
// which was passed from root layout
export default async function DashBoardLayout({
  children,
  params,
}: DashBoardLayoutProps) {
  // check if there is a session
  const session = await getServerSession(authOptions);
  const email = session?.user.email;

  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  // loading first store with the given id
  const clinic = await prisma.clinic.findFirst({
    where: {
      email,
    },
  });

  // check if clinic exists, in the event that user types random number
  if (!clinic) {
    redirect("/");
  }

  return (
    <>
      {/* NavBar will have access to params since its child of layout,
      which is the /clinicId */}
      <NavBar />
      {children}
    </>
  );
}
