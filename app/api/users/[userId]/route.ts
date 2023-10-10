// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { NextResponse } from "next/server";
// Prisma Client
import prisma from "@/lib/prisma";

// ADMIN
// IN THIS API ROUTE - INDIVIDUAL USER - UPDATE

// API FOR UPDATING EMPLOYEE/USER - PROTECTED
// User will have to be logged in first to update user AND be SYSTEMADMIN
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
    const { firstName, lastNames, email } = body;

    if (!firstName || !lastNames || !email) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if (!params.userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    await prisma.user.updateMany({
      // find
      where: {
        id: params.userId,
      },
      // passing in the data
      data: {
        firstName,
        lastNames,
        email,
      },
    });

    // without password
    const sanitizedUser = {
      firstName: foundUser.firstName,
    };

    return NextResponse.json(
      {
        message: `Employee/User: ${sanitizedUser.firstName} Updated Successfully`,
        sanitizedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("[INDIVIDUAL_USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
