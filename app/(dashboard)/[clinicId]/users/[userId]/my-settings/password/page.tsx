// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import PasswordForm from "./components/PasswordForm";

interface PasswordPageProps {
  params: {
    userId: string;
  };
}

// params always available on server side, and we have userId since
// we are inside [userId]

export default async function PasswordPage({ params }: PasswordPageProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  // Since User model has some values that are String? since we may use both credentials
  // and google provider, we are telling ts here that in this case, the below,
  // are not going to be null
  const formattedUser = {
    firstName: user!.firstName!,
    lastNames: user!.lastNames!,
  };

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <PasswordForm user={formattedUser} />
      </div>
    </div>
  );
}
