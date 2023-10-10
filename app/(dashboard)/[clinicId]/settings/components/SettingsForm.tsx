"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Clinic } from "@prisma/client";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AlertModal from "@/components/modals/AlertModal";

const settingFormValuesSchema = z.object({
  name: z
    .string()
    .min(5, "Name must have at least 5 characters")
    .max(40, "Name must have at most 40 characters"),
  clinicLocationTag: z
    .string()
    .min(1, "Clinic Location Tag must have at least 1 character")
    .max(40, "Clinic Location Tag must have at most 40 characters"),
});
type SettingsFormValuesSchema = z.infer<typeof settingFormValuesSchema>;

interface SettingsFormProps {
  clinic: Clinic;
}

export default function SettingsForm({ clinic }: SettingsFormProps) {
  // could use useParams to get from url, or get the id from clinic.id
  // but to stay consistent we will use useParams

  const router = useRouter();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValuesSchema>({
    resolver: zodResolver(settingFormValuesSchema),
    // form will be pre populated with defaultValues
    defaultValues: clinic,
  });

  const onSubmit = async (formInputData: SettingsFormValuesSchema) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/clinics/${params.clinicId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: formInputData.name,
          clinicLocationTag: formInputData.clinicLocationTag,
        }),
      });

      const responseData = await response.json();

      // to see the navbar reload with name
      router.refresh();
      router.push(`/${params.clinicId}`);
      toast.success(`${responseData.message}`);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Clinic Settings" description="Manage Clinic Settings" />
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Instituto Juan Carlos Mexico"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicLocationTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic Location Tag</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="IIBW" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className=" ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
}
