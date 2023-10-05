// package for hashing passwords
import bcrypt from "bcrypt";
// prisma client
import prisma from "@/lib/prisma";
// Next Response type
import { NextResponse } from "next/server";

// IN THIS API ROUTE - ADMIN/REGISTER CLINIC USER - POST

// API FOR REGISTERING USER - PROTECTED
// Only Role of SYSTEMADMIN or CLINICOWNER will be able to access this route and register
// a new user.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastNames, password, roles } = body;
    console.log(roles);

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

    return NextResponse.json(user);
  } catch (error: any) {
    console.log("[REGISTER_POST]", error);
  }
}
