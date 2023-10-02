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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const roles = [
  {
    id: "SYSTEMADMIN",
    label: "SYSTEMADMIN",
  },
  {
    id: "CLINICOWNER",
    label: "CLINICOWNER",
  },
  {
    id: "CLINICEMPLOYEE",
    label: "CLINICEMPLOYEE",
  },
];

const userFormValuesSchema = z.object({
  email: z.string().email(),
  firstName: z
    .string()
    .min(5, "Name must have at least 5 characters")
    .max(30, "Name must have at most 30 characters"),
  lastNames: z
    .string()
    .min(5, "Last name(s) must have at least 5 characters")
    .max(40, "Last name(s) must have at most 40 characters"),
  roles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Please mark a role",
  }),
  clinics: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Please mark a role",
  }),
});

type UserFormValuesSchema = z.infer<typeof userFormValuesSchema>;

interface UserFormProps {
  user: {
    email: string;
    firstName: string;
    lastNames: string;
    roles: string[];
  };
  clinics: {
    email: string;
    name: string;
    id: string;
  }[];
}

// using this form for both new and update
export default function AdminUserForm({ user, clinics }: UserFormProps) {
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id - however to be more consistent across pages
  // we will use useParams

  const router = useRouter();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedClinics, setCheckedClinics] = useState(
    clinics.filter((clinic) => clinic.email === user.email)
  );
  console.log(checkedClinics);
  const checkedClinicz = checkedClinics.map((clinic) => clinic.id);
  console.log(checkedClinicz, "zzz");

  const form = useForm<UserFormValuesSchema>({
    resolver: zodResolver(userFormValuesSchema),

    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastNames: user.lastNames,
      roles: user.roles,
      clinics: checkedClinics.map((clinic) => clinic.id), // Use the clinic IDs
    },
  });

  const onSubmit = async (formInputData: UserFormValuesSchema) => {
    try {
      setIsLoading(true);

      await fetch(`/api/admin/users/${params.userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          email: formInputData.email,
          firstName: formInputData.firstName,
          lastNames: formInputData.lastNames,
          roles: formInputData.roles,
          clinics: formInputData.clinics,
        }),
      });

      // to see the navbar reload with name
      router.refresh();
      router.push(`/${params.clinicId}/admin/users`);
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
        title="DELETE USER"
        description="Make sure all Clinics under this User are managed first"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Manage User" description="Update User Properties" />
        <div className=" flex justify-center items-center space-x-5">
          <Button disabled={isLoading}>
            <Link
              href={`/${params.clinicId}/admin/users/${params.userId}/password`}
            >
              Change User Password
            </Link>
          </Button>

          <Button
            disabled={isLoading}
            variant="destructive"
            size="lg"
            onClick={() => setIsOpen(true)}
          >
            <div className=" w-full"> Delete User</div>
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Carlos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name(s)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Juan Gabriel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      User&apos;s Roles
                    </FormLabel>
                    <FormDescription>
                      Select the applicable roles
                    </FormDescription>
                  </div>
                  {roles.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinics"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Clinics</FormLabel>
                    <FormDescription>
                      Assign or Unassign a Clinic to a User
                    </FormDescription>
                  </div>
                  {clinics.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="clinics"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
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
