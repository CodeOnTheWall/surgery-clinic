// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
// Next
import { redirect } from "next/navigation";

// add redirect if user isnt admin admin, check to see if session
// has information from credentials
export default async function AdminClinicsClientPage() {
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

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">Admin Page</div>
    </div>
  );
}
