// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { redirect } from "next/navigation";

interface AdminDashBoardLayoutProps {
  children: React.ReactNode;
  params: { clinicId: string };
}

// params are received from the url - in this case store.id
// which was passed from root layout
export default async function AdminDashBoardLayout({
  children,
  params,
}: AdminDashBoardLayoutProps) {
  // check if there is a session
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles;

  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  if (!roles!.includes("SYSTEMADMIN")) {
    return (
      <div>
        Unauthorized - Speak to Clinic Owner or System Admin to change
        privileges.
      </div>
    );
  }

  return <>{children}</>;
}
