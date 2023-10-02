// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { NextResponse } from "next/server";
// package for hashing passwords
import bcrypt from "bcrypt";
// Prisma Client
import prisma from "@/lib/prisma";

// ADMIN
// IN THIS API ROUTE - INDIVIDUAL USER PASSWORD CHANGE - UPDATE

// API FOR UPDATING USER PASSWORD- PROTECTED
// User will have to be logged in first to update user password AND be SYSTEMADMIN
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const { password } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!password) {
      return new NextResponse("Missing Password field", { status: 400 });
    }

    if (!params.userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    const userHasClinic = await prisma.user.findFirst({
      where: {
        id: params.userId,
      },
      include: { clinics: true },
    });

    let hashedPassword;
    if (password) {
      // 12 salt rounds
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.updateMany({
      // find
      where: {
        id: params.userId,
      },
      // passing in the data
      data: {
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_USER_PASSWORD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
