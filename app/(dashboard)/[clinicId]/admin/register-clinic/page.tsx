// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
// Next
import { redirect } from "next/navigation";
// Page Specific Components
import RegisterClinicForm from "./components/RegisterClinicForm";

export default async function AdminClinicsClientPage() {
  const session = getServerSession(authOptions);
  // callbackUrl will be the url that is loaded after signin
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <RegisterClinicForm />
      </div>
    </div>
  );
}
