// prisma client
import prisma from "@/lib/prisma";
// Next Auth
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next Response type
import { NextResponse } from "next/server";

// IN THIS API ROUTE - ADMIN - REGISTER CLINIC - POST - PROTECTED

// API FOR REGISTERING CLINIC - PROTECTED
// Only Role of SYSTEMADMIN will be able to access this route and register
// a new Clinic.
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!roles!.includes("SYSTEMADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, clinicLocationTag } = body;

    if (!name || !clinicLocationTag) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        clinicLocationTag,
      },
    });

    return NextResponse.json(
      {
        message: `Clinic: ${clinic.name} Registered Successfully`,
        clinic,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("[ADMIN_CLINIC_POST]", error);
  }
}
