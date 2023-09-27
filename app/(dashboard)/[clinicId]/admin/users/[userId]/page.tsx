// Prisma Client
import prisma from "@/lib/prisma";
import UserForm from "./components/UserForm";

interface UserPageProps {
  params: {
    userId: string;
  };
}

// params always available on server side, and we have billboardId since
// we are inside [billboardId]

export default async function UserPage({ params }: UserPageProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <UserForm user={user} />
      </div>
    </div>
  );
}
