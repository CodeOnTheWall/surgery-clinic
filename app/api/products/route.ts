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

    const productExists = await prisma.product.findUnique({
      where: {
        name: name,
      },
    });

    if (productExists) {
      return NextResponse.json(
        { message: "Product name already exists" },
        { status: 409 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        upc,
        name,
        description,
        detail,
        manufacturer,
        vendor,
      },
    });

    // Fetch all clinicIDs
    const clinics = await prisma.clinic.findMany({
      select: {
        id: true,
      },
    });

    // before i can make updates to productInventory, it has to be made first, so for a
    // better user xp, instead of telling them they have to register the product
    // to the clinic first, then add inventory, we will register the product to the
    // clinic now, so that on the front end, we are just adding/deleting inventory
    // Create an array of create operations for each clinic
    const createOperations = clinics.map((clinic) =>
      prisma.productInventory.create({
        data: {
          clinicId: clinic.id,
          productId: newProduct.id,
          quantity: 0, // The initial quantity for each clinic
        },
      })
    );

    // Execute the create operations in a single transaction
    await prisma.$transaction(createOperations);

    return NextResponse.json(
      {
        message: `Product: ${newProduct.name} Successfully Registered`,
        newProduct,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("[PRODUCT_POST]", error);
  }
}
