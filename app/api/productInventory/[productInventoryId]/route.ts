// Next Auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { NextResponse } from "next/server";
// Prisma Client
import prisma from "@/lib/prisma";

// IN THIS API ROUTE - PRODUCT INVENTORY ADD/DELETE
// FOR INVENTORYPERMISSION/CLINICOWNER/SYSTEMADMIN
// PROTECTED - User will have to be logged in first to manage inventory

export async function PATCH(
  req: Request,
  { params }: { params: { clinicId: string } }
) {
  // quantity: quantity,
  //         clinicId: params.clinicId,
  //         productId: selectedProduct,
  //         addOrDelete: addOrDelete,
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (
      !roles?.includes("SYSTEMADMIN") &&
      !roles?.includes("CLINICOWNER") &&
      !roles?.includes("INVENTORYPERMISSION")
    ) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { quantity, productInventoryId, addOrDelete } = body;

    if (!quantity || !productInventoryId || !addOrDelete) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const quantityInt = parseInt(quantity, 10);

    if (addOrDelete === "ADD") {
      console.log(addOrDelete);
      const updatedProductInventoryQuantity =
        await prisma.productInventory.update({
          // find
          where: {
            id: productInventoryId,
          },
          // passing in the data
          data: {
            quantity: {
              increment: quantityInt,
            },
          },
          include: {
            product: true, // Include the related Product object
            clinic: true, // Include the related Clinic object
          },
        });

      const productName = updatedProductInventoryQuantity.product.name;
      const clinicName = updatedProductInventoryQuantity.clinic.name;

      return NextResponse.json(
        {
          message: `Added: ${quantity} ${productName} to Clinic: ${clinicName}`,
          updatedProductInventoryQuantity,
        },
        {
          status: 200,
        }
      );
    } else {
      console.log(addOrDelete);
      const updatedProductInventoryQuantity =
        await prisma.productInventory.update({
          // find
          where: {
            id: productInventoryId,
          },
          // passing in the data
          data: {
            quantity: {
              decrement: quantityInt,
            },
          },
          include: {
            product: true, // Include the related Product object
            clinic: true, // Include the related Clinic object
          },
        });

      const productName = updatedProductInventoryQuantity.product.name;
      const clinicName = updatedProductInventoryQuantity.clinic.name;

      return NextResponse.json(
        {
          message: `Deducted: ${quantity} ${productName} from Clinic: ${clinicName}`,
          updatedProductInventoryQuantity,
        },
        {
          status: 200,
        }
      );
    }

    // Prisma.update requires us to pass unique fields inside the where query
    // the only unique field for our clinic model is id, we also have clinicId and
    // userId, but but these are not unique for this model, any model can have them
    // since a userId could have many models, its not unique

    // const updatedClinic = await prisma.clinic.findFirst({
    //   // find
    //   where: {
    //     id: params.clinicId,
    //   },
    // });

    // return NextResponse.json(
    //   {
    //     message: `Clinic: ${updatedClinic?.name} Updated Successfully`,
    //     updatedClinic,
    //   },
    //   {
    //     status: 200,
    //   }
    // );
  } catch (error) {
    console.log("[CLINIC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
