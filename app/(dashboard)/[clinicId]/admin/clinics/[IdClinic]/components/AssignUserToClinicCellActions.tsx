"use client";

// React
import { useState } from "react";
// Next
import { useParams, useRouter } from "next/navigation";
// 3rd Party Libraries
import { toast } from "react-hot-toast";
// Component Specific Components
import { AssignUserToClinicColumn } from "./AssignUserToClinicColumns";
// Components
import { Button } from "@/components/ui/button";
// Prisma Client
import prisma from "@/lib/prisma";

interface CellActionProps {
  data: AssignUserToClinicColumn;
}

export default function AssignUserToClinicCellActions({
  data,
}: CellActionProps) {
  // console.log(data);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useParams();

  const clinicId = params.IdClinic.toString();

  const isAssignedToClinic = data.clinicIDs.includes(clinicId);
  console.log(isAssignedToClinic);

  const onSubmit = async (formInputData: RegisterFormValuesSchema) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/admin/${params.cl}`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        // Handle successful response
        // to see the navbar reload with name
        router.refresh();
        router.push(`/${params.clinicId}/admin/users`);
        toast.success("User Registered Successfully");
      } else {
        // Handle error response
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (id: any) => {
    setIsLoading(true);
    console.log(id);
  };

  const handleUnassign = async () => {
    try {
      setIsLoading(true);

      // Add logic to unassign user from the clinic
      // ...

      toast.success("User Unassigned from Clinic");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAssignedToClinic ? (
        <Button onClick={handleUnassign} disabled={isLoading}>
          Unassign Employee
        </Button>
      ) : (
        <Button onClick={() => handleAssign(data.id)} disabled={isLoading}>
          Assign Employee
        </Button>
      )}
    </>
  );
}
