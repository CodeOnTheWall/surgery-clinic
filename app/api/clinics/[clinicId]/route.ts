// Next Auth
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { NextResponse } from "next/server";
// Prisma Client
import prisma from "@/lib/prisma";

// IN THIS API ROUTE - INDIVIDUAL CLINIC - UPDATE/DELETE
// FOR CLINIC OWNER

// API FOR UPDATING CLINIC - PROTECTED
// User will have to be logged in first to update clinic
// and we check if it is the users clinic to update, otherwise someone else
// is trying to update a clinic they dont own/manage
export async function PATCH(
  req: Request,
  { params }: { params: { clinicId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;
    console.log(roles);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!roles?.includes("SYSTEMADMIN") && !roles?.includes("CLINICOWNER")) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, clinicLocationTag } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.clinicId) {
      return new NextResponse("Clinic id is required", { status: 400 });
    }

    // confirming that this clinicId exists for this userId
    // trying to find the clinic that is passed in via [clinicId]
    // with the userId, ensuring that that clinic is assigned to that user
    const clinicHasOwner = await prisma.clinic.findFirst({
      where: {
        // id of clinic
        id: params.clinicId,
        userIDs: {
          has: session.user.userId,
        },
      },
    });

    // if the clinicId the user is req in combination with their userId
    // is not available, they are trying to update someone elses Clinic
    if (!clinicHasOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Prisma.update requires us to pass unique fields inside the where query
    // the only unique field for our clinic model is id, we also have clinicId and
    // userId, but but these are not unique for this model, any model can have them
    // since a userId could have many models, its not unique
    await prisma.clinic.updateMany({
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

    const updatedClinic = await prisma.clinic.findFirst({
      // find
      where: {
        id: params.clinicId,
      },
    });

    return NextResponse.json(
      {
        message: `Clinic: ${updatedClinic?.name} Updated Successfully`,
        updatedClinic,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("[CLINIC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
