// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { NextResponse } from "next/server";
// Prisma Client
import prisma from "@/lib/prisma";

// ADMIN
// IN THIS API ROUTE - INDIVIDUAL USER - UPDATE/DELETE

// API FOR GETTING USER - PROTECTED
// User will have to be logged in first to update user AND be SYSTEMADMIN
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!roles!.includes("SYSTEMADMIN")) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      // find
      where: {
        id: params.userId,
      },
    });
    // console.log("get user", user);

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_INDIVIDUAL_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// API FOR UPDATING USER - PROTECTED
// User will have to be logged in first to update user AND be SYSTEMADMIN
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const { firstName, lastNames, roles, email, clinics } = body;
    console.log(clinics);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!firstName || !lastNames || !roles || !email) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if (!params.userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    const user = await prisma.user.updateMany({
      // find
      where: {
        id: params.userId,
      },
      // passing in the data
      data: {
        firstName,
        lastNames,
        roles,
        email,
      },
    });
    console.log("updated user", user);

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_INDIVIDUAL_USER_PATCH]", error);
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
    console.log("[ADMIN_INDIVIDUAL_USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
