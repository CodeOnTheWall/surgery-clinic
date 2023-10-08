// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// package for hashing passwords
import bcrypt from "bcrypt";
// prisma client
import prisma from "@/lib/prisma";
// Next Response type
import { NextResponse } from "next/server";

// IN THIS API ROUTE - ADMIN/REGISTER CLINIC USER/EMPPLOYEE - POST

// API FOR REGISTERING USER - PROTECTED
// Only Role of SYSTEMADMIN or CLINICOWNER will be able to access this route and register
// a new user.
export async function POST(request: Request) {
  try {
    // check if there is a session, and extract the roles
    const session = await getServerSession(authOptions);
    const rolez = session?.user.roles;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!rolez!.includes("SYSTEMADMIN")) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await request.json();
    const { email, firstName, lastNames, password, roles } = body;

    if (!email || !firstName || !lastNames || !password || !roles) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const uniqueUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (uniqueUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    // 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastNames,
        hashedPassword,
        roles,
      },
    });

    // without password
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastNames: user.lastNames,
      roles: user.roles,
    };

    return NextResponse.json(
      {
        message: `User: ${sanitizedUser.firstName} Registered Successfully`,
        sanitizedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("[ADMIN_USER_POST]", error);
  }
}
