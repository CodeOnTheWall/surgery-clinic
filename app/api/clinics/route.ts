// Next Auth
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

import { NextResponse } from "next/server";

import prismadb from "@/lib/prisma";

// IN THIS API ROUTE - CLINIC - POST

// API FOR CREATING CLINIC - PROTECTED
// User will have to be logged in first to create clinic
export async function POST(req: Request) {
  try {
    // check if there is a session
    const session = await getServerSession(authOptions);
    const email = session?.user.email;

    const body = await req.json();
    const { name } = body;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const clinic = await prismadb.clinic.create({
      data: {
        name,
        email: email as string,
      },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.log("[CLINICS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
