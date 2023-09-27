// Next Auth
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Prisma Client
import prisma from "@/lib/prisma";
// Next
import { redirect } from "next/navigation";

interface SetupLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: SetupLayoutProps) {
  // check if there is a session
  const session = await getServerSession(authOptions);
  const email = session?.user.email;

  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  // if session
  // loading first clinic available with logged in user
  const clinic = await prisma.clinic.findFirst({
    where: {
      email: email,
    },
  });

  // if that store exists, redirect to that store
  if (clinic) {
    redirect(`/${clinic.id}`);
  }

  // Modal will open since children of this is the page.tsx, which makes the modal open
  // but if theres a clinic, we go to that clinics id, and no model is opened
  return <>{children}</>;
}
