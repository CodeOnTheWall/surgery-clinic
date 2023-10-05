// Next Auth
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
// Next
import { NextResponse } from "next/server";
// Prisma Client
import prisma from "@/lib/prisma";

// IN THIS API ROUTE - INDIVIDUAL CLINIC - UPDATE/DELETE

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
    const email = session?.user.email;

    const body = await req.json();
    const { name, clinicLocationTag } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.clinicId) {
      return new NextResponse("Clinic id is required", { status: 400 });
    }

    // confirming that this clinicId exists for this email
    // trying to find the clinic that is passed in via [clinicId]
    // with the email, ensuring that that clinic belongs to that user/email
    const clinicByEmail = await prisma.clinic.findFirst({
      where: {
        // id of clinic
        id: params.clinicId,
        // current user/email
        email,
      },
    });

    // if the clinicId the user is req in combination with their email
    // is not available, they are trying to update someone elses Clinic
    if (!clinicByEmail) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Prisma.update requires us to pass unique fields inside the where query
    // the only unique field for our clinic model is id, we also have clinicId and
    // userId, but but these are not unique for this model, any model can have them
    // since a userId could have many models, its not unique
    const clinic = await prisma.clinic.updateMany({
      // find
      where: {
        id: params.clinicId,
        email,
      },
      // passing in the data
      data: {
        name,
        clinicLocationTag,
      },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.log("[CLINIC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// API FOR DELETING CLINIC - PROTECTED
// User will have to be logged in first to delete clinic
// and we check if it is the users clinic to delete, otherwise someone else
// is trying to delete a clinic they dont own/manage
export async function DELETE(
  // even though not using the req, params has to be second arg
  // so we keep the req there
  req: Request,
  { params }: { params: { clinicId: string } }
) {
  try {
    // check if there is a session, and extract the email
    const session = await getServerSession(authOptions);
    const email = session?.user.email;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.clinicId) {
      return new NextResponse("Clinic id is required", { status: 400 });
    }

    // confirming that this clinicId exists for this email
    // trying to find the clinic that is passed in via [clinicId]
    // with the email, ensuring that that clinic belongs to that user/email
    const clinicByEmail = await prisma.clinic.findFirst({
      where: {
        // id of clinic
        id: params.clinicId,
        // current user/email
        email,
      },
    });

    // if the clinicId the user is req in combination with their email
    // is not available, they are trying to update someone elses Clinic
    if (!clinicByEmail) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // deleteMany because userId isnt unique
    const clinic = await prisma.clinic.deleteMany({
      where: {
        id: params.clinicId,
        email,
      },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.log("[CLINIC_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
