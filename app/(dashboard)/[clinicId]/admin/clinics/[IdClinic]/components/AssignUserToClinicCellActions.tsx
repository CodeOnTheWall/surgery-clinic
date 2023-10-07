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

interface CellActionProps {
  data: AssignUserToClinicColumn;
}

export default function AssignUserToClinicCellActions({
  data,
}: CellActionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useParams();

  const clinicId = params.IdClinic.toString();

  const isAssignedToClinic = data.clinicIDs.includes(clinicId);

  // id - from data.id has the id of that column
  const handleAssign = async (id: string) => {
    try {
      setIsLoading(true);

      // status will be on response, but message will be on response.json()
      const response = await fetch(`/api/admin/clinics/${params.IdClinic}`, {
        method: "PATCH",
        body: JSON.stringify({ userId: id }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        // Handle successful response
        // to see the navbar reload with name
        router.refresh();
        // router.push(`/${params.clinicId}/admin/clinics/${params.IdClinic}`);

        // response message set on backend depending on assigning or unassigned
        // employee
        toast.success(`${responseData.message}`, {
          duration: 3000,
        });
      } else {
        // Handle error response
        console.log(responseData.message);
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAssignedToClinic ? (
        <Button onClick={() => handleAssign(data.id)} disabled={isLoading}>
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
