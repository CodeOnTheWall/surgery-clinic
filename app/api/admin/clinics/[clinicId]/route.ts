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
    const session = await getServerSession(authOptions);
    const roles = session?.user.roles;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!roles!.includes("SYSTEMADMIN")) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, clinicLocationTag, userId } = body;

    if (!params.clinicId) {
      return new NextResponse("Clinic ID is required", { status: 400 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: {
        id: params.clinicId,
      },
      include: {
        users: true,
      },
    });

    if (!clinic) {
      return new NextResponse("Clinic not found", { status: 404 });
    }

    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      // iterate through the clinics.users array, will return true if atleast 1
      // user has an id of the passed in userId, which would mean that this user
      // is already assigned to this clinic
      const isUserAssigned = clinic.users.some((user) => user.id === userId);

      if (isUserAssigned) {
        // User is already assigned, unassign them
        const clinicWithUnassignedUser = await prisma.clinic.update({
          where: {
            id: params.clinicId,
          },
          data: {
            users: {
              disconnect: {
                id: userId,
              },
            },
          },
        });
        return NextResponse.json(
          {
            message: `${user.firstName} Unassigned Successfully from Clinic: ${clinicWithUnassignedUser.name}`,
            clinicWithUnassignedUser,
          },
          {
            status: 200,
          }
        );
      } else {
        // User is not assigned, assign them
        const clinicWithAssignedUser = await prisma.clinic.update({
          where: {
            id: params.clinicId,
          },
          data: {
            users: {
              connect: {
                id: userId,
              },
            },
          },
        });
        return NextResponse.json(
          {
            message: `${user.firstName} Assigned Successfully to Clinic: ${clinicWithAssignedUser.name}`,
            clinicWithAssignedUser,
          },
          {
            status: 200,
          }
        );
      }
    } else {
      const updatedClinic = await prisma.clinic.update({
        where: {
          id: params.clinicId,
        },
        data: {
          name,
          clinicLocationTag,
        },
      });
      return NextResponse.json(
        {
          message: `Clinic: ${clinic.name} Updated Successfully`,
          updatedClinic,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("[ADMIN_INDIVIDUAL_CLINIC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// API FOR DELETING CLINIC - PROTECTED
// User will have to be logged in first to delete user AND be SYSTEMADMIN
export async function DELETE(
  // even though not using the req, params has to be second arg
  // so we keep the req there
  request: Request,
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

    // Delete the clinic
    const deletedClinic = await prisma.clinic.deleteMany({
      where: {
        id: params.clinicId,
      },
    });

    // Unattach users from the clinic
    await prisma.user.updateMany({
      where: {
        // For each user, if their array of clinicIDs contains the specified clinicId,
        // then update that array to be an empty array.
        clinicIDs: {
          has: params.clinicId,
        },
      },
      data: {
        clinicIDs: {
          set: [],
        },
      },
    });

    return NextResponse.json(deletedClinic);
  } catch (error) {
    console.log("[ADMIN_CLINIC_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
