// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { NextResponse } from "next/server";
// Prisma Client
import prisma from "@/lib/prisma";

// ADMIN
// IN THIS API ROUTE - INDIVIDUAL CLINIC - UPDATE/DELETE

// API FOR UPDATING CLINIC - PROTECTED
// User will have to be logged in first to update user AND be SYSTEMADMIN
export async function PATCH(
  req: Request,
  { params }: { params: { clinicId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;

    const body = await req.json();
    const { name, clinicLocationTag } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!roles!.includes("SYSTEMADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !clinicLocationTag) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if (!params.clinicId) {
      return new NextResponse("Clinic ID is required", { status: 400 });
    }

    const clinic = await prisma.clinic.updateMany({
      // find
      where: {
        id: params.clinicId,
      },
      // passing in the data
      data: {
        name,
        clinicLocationTag,
      },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.log("[ADMIN_CLINIC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// API FOR DELETING CLINIC - PROTECTED
// User will have to be logged in first to delete user AND be SYSTEMADMIN
export async function DELETE(
  // even though not using the req, params has to be second arg
  // so we keep the req there
  req: Request,
  { params }: { params: { clinicId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!roles!.includes("SYSTEMADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.clinicId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    const clinic = await prisma.user.deleteMany({
      where: {
        id: params.clinicId,
      },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.log("[ADMIN_CLINIC_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
