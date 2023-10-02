"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/AlertModal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const clinicFormValuesSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(5, "Name must have at least 5 characters")
    .max(40, "Name must have at most 40 characters"),
});

type ClinicFormValuesSchema = z.infer<typeof clinicFormValuesSchema>;

interface ClinicsFormProps {
  clinic: {
    email: string;
    name: string;
    id: string;
  };
}

// using this form for both new and update
export default function AdminClinicsForm({ clinic }: ClinicsFormProps) {
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id - however to be more consistent across pages
  // we will use useParams

  const router = useRouter();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClinicFormValuesSchema>({
    resolver: zodResolver(clinicFormValuesSchema),

    defaultValues: {
      name: clinic.name,
      email: clinic.email,
    },
  });

  const onSubmit = async (formInputData: ClinicFormValuesSchema) => {
    try {
      setIsLoading(true);

      await fetch(`/api/admin/clinics/${params.IdClinic}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: formInputData.name,
          email: formInputData.email,
        }),
      });

      // to see the navbar reload with name
      router.refresh();
      router.push(`/${params.clinicId}/admin/clinics`);
      toast.success("User Updated");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await fetch(`/api/admin/users/${params.userId}`, {
        method: "DELETE",
      });
      router.refresh();
      router.push(`/${params.clinicId}/admin/users`);
      toast.success("User Deleted");
    } catch (error) {
      toast.error("Make sure you removed all Clinics under this User first");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        title="DELETE CLINIC"
        description="Make sure all Inventory under this Clinic are managed first"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Manage Clinic" description="Update Clinic Properties" />
        <div className=" flex justify-center items-center space-x-5">
          <Button
            disabled={isLoading}
            variant="destructive"
            size="lg"
            onClick={() => setIsOpen(true)}
          >
            <div className=" w-full">Delete Clinic</div>
            <Trash className=" ml-2 h-6 w-6" />
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-8 w-full"
        >
          <div className=" grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="WalterWhite@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Shoulder Surgery Institute"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className=" ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
}
