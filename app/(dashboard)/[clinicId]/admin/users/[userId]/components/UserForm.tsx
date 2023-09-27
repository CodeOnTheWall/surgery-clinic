"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const userFormValuesSchema = z
  .object({
    email: z.string().email(),
    firstName: z
      .string()
      .min(5, "Name must have at least 5 characters")
      .max(30, "Name must have at most 30 characters"),
    lastNames: z
      .string()
      .min(5, "Last name(s) must have at least 5 characters")
      .max(40, "Last name(s) must have at most 40 characters"),
    password: z
      .string()
      .min(5, "Password must have at least 10 characters")
      .max(20, "Password must have at most 20 characters"),
    confirm: z
      .string()
      .min(5, "Password must have at least 10 characters")
      .max(20, "Password must have at most 20 characters"),
    roles: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "Please mark a role",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    // path is where the error field should be added
    path: ["confirm"],
  });
type UserFormValuesSchema = z.infer<typeof userFormValuesSchema>;

interface UserFormProps {
  user: User;
}

// using this form for both new and update
export default function UserForm({ user }: UserFormProps) {
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id - however to be more consistent across pages
  // we will use useParams

  const router = useRouter();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormValuesSchema>({
    resolver: zodResolver(userFormValuesSchema),
    // form will be pre populated with defaultValues
    // initial data will be billboard passed in, or empty strings
    // if no billboard
    defaultValues: user,
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
          password: formInputData.password,
          roles: formInputData.roles,
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
        description="Make sure all Clinics under this User are removed first"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Delete User" description="Delete User" />
        {user && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setIsOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
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
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
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
