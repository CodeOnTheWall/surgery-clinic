"use client";

// We (as the system admin) register a clinic, then we can assign employees to that
// clinic, or the clinic owners can assign employees to that clinic

// React
import { useState } from "react";
// Next
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// 3rd Party Libraries
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
// Components
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

const registerFormValuesSchema = z.object({
  name: z
    .string()
    .min(5, "Name must have at least 5 characters")
    .max(50, "Name must have at most 50 characters"),
  clinicLocationTag: z
    .string()
    .min(4, "Clinic Location Tag must have at least 4 characters")
    .max(50, "Clinic Location Tag must have at most 50 characters"),
});

type RegisterFormValuesSchema = z.infer<typeof registerFormValuesSchema>;

export default function RegisterClinicForm() {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValuesSchema>({
    resolver: zodResolver(registerFormValuesSchema),
    // form will be pre populated with defaultValues
    defaultValues: {
      name: "",
      clinicLocationTag: "",
    },
  });

  const onSubmit = async (formInputData: RegisterFormValuesSchema) => {
    try {
      setIsLoading(true);

      // reminder that response has status codes, but to get message
      // we must convert to json first to access that message
      const response = await fetch(`/api/admin/clinics`, {
        method: "POST",
        body: JSON.stringify({
          name: formInputData.name,
          clinicLocationTag: formInputData.clinicLocationTag,
        }),
      });

      const responseData = await response.json();
      // because my response on backend looks like this, i cant access the id
      // from just responseData.id, i have to do responseData.clinic.id
      // since my responseData has message and clinic
      // return NextResponse.json(
      //   {
      //     message: `Clinic: ${clinic.name} Registered Successfully`,
      //     clinic,
      //   },
      //   {
      //     status: 200,
      //   }
      // );

      // Handle successful response
      // to see the navbar reload with name
      if (response.status === 200) {
        router.refresh();
        router.push(
          `/${params.clinicId}/admin/clinics/${responseData.clinic.id}`
        );
        toast.success(`${responseData.message}`, {
          duration: 4000,
        });
      } else {
        // Handle error response
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
      <div className="flex flex-col items-start gap-y-5">
        <div className=" flex items-center justify-between w-full">
          <Heading title="Register a Clinic and Assign Its Employees" />
          <Button>
            <Link href={`/${params.clinicId}/admin/clinics`}>
              View all Clinics
            </Link>
          </Button>
        </div>
        <p>
          For an employee to work at your clinic, you need to assign them to the
          clinic. This enables them to log in and access the clinic&apos;s data.
          Employees can be assigned or unassigned as needed, either shared among
          clinics or restricted to a specific clinic. Please register a clinic
          first; afterward, you will be directed to the clinic page to assign
          its employees.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col items-start gap-y-5">
        <Heading title="1. Register Clinic" />
        <p>
          After registering a clinic, you will be directed to the clinic page to
          assign employees.
        </p>
      </div>
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
                      placeholder="Instituto Sterling Bunnell Mexico"
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
                    <Input disabled={isLoading} placeholder="ISBM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} className=" ml-auto" type="submit">
            Register Clinic
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
}
