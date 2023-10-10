// prisma client
import prisma from "@/lib/prisma";
// Next Auth
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next Response type
import { NextResponse } from "next/server";

// IN THIS API ROUTE - REGISTER PRODUCT - POST - PROTECTED
// Roles of CLINICOWNER or SYSTEMADMIN will be able to access this
// api route and register a new product
export async function POST(
  request: Request,
  { params }: { params: { clinicId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!roles!.includes("SYSTEMADMIN") && !roles!.includes("CLINICOWNER")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { upc, name, description, detail, manufacturer, vendor } = body;

    if (!upc || !name || !description || !manufacturer) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        upc,
        name,
        description,
        detail,
        manufacturer,
        vendor,
      },
    });
    console.log("created product", product);

    return NextResponse.json(
      {
        message: `Product: ${product.name} Successfully Registered`,
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("[PRODUCT_POST]", error);
  }
}
