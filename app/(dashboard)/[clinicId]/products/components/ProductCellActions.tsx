"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import AlertModal from "@/components/modals/AlertModal";
import { ProductColumn } from "./ProductColumn";

interface CellActionProps {
  data: ProductColumn;
}

export default function ProductCellActions({ data }: CellActionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("User Id copied to the clipboard");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/clinics/${data.id}`, {
        method: "DELETE",
      });
      // router.refresh();
      // router.push(`/${params.clinicId}/admin/clinics`);
      // below method that has less bugs since it causes a full page reload
      // with method below, the modal goes away
      window.location.assign(`/${params.clinicId}/admin/clinics/`);

      toast.success("Clinic Deleted");
    } catch (error) {
      toast.error(
        "Make sure you have managed all inventory under this Clinic first"
      );
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="DELETE CLINIC"
        description="Make sure you have managed all inventory under this Clinic first"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className=" h-8 w-8 p-0">
            {/* sr for screen readers, accessibility feature */}
            <span className=" sr-only">Open Menu</span>
            <MoreHorizontal className=" h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className=" mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            // we have the id since the passed in data gets the id automatically
            // from the row
            onClick={() =>
              router.push(`/${params.clinicId}/admin/clinics/${data.id}`)
            }
          >
            <Edit className=" mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className=" mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
