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
// IN THIS API ROUTE - INDIVIDUAL USER - UPDATE/DELETE

// API FOR UPDATING USER - PROTECTED
// User will have to be logged in first to update user AND be SYSTEMADMIN
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const email = session?.user.email;

    const body = await req.json();
    const { firstName, lastNames, password, roles } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!firstName || !lastNames || !roles) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if (!params.userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    // 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.updateMany({
      // find
      where: {
        id: params.userId,
        email,
      },
      // passing in the data
      data: {
        firstName,
        lastNames,
        roles,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// API FOR DELETING USER - PROTECTED
// User will have to be logged in first to delete user AND be SYSTEMADMIN
export async function DELETE(
  // even though not using the req, params has to be second arg
  // so we keep the req there
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const email = session?.user.email;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    const user = await prisma.user.deleteMany({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
