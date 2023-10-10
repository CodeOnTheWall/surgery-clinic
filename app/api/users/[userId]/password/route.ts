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
// User will have to be logged in first to update user password
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const foundUser = await prisma.user.findUnique({
      // find
      where: {
        id: params.userId,
      },
    });

    if (!foundUser) {
      return new NextResponse("No User Found", { status: 404 });
    }

    const body = await req.json();
    const { password } = body;

    if (!password) {
      return new NextResponse("Missing Password field", { status: 400 });
    }

    if (!params.userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    let hashedPassword;
    if (password) {
      // 12 salt rounds
      hashedPassword = await bcrypt.hash(password, 12);
    }

    await prisma.user.updateMany({
      // find
      where: {
        id: params.userId,
      },
      // passing in the data
      data: {
        hashedPassword,
      },
    });

    // without password
    const sanitizedUser = {
      firstName: foundUser.firstName,
    };

    return NextResponse.json(
      {
        message: `Password of Employee/User: ${sanitizedUser.firstName} Updated Successfully`,
        sanitizedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("[USER_PASSWORD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
