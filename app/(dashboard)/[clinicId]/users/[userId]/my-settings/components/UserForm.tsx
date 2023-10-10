"use client";

import { useState } from "react";
import Link from "next/link";
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
});

type UserFormValuesSchema = z.infer<typeof userFormValuesSchema>;

interface UserFormProps {
  user: {
    email: string;
    firstName: string;
    lastNames: string;
  };
}

// using this form for both new and update
export default function UserForm({ user }: UserFormProps) {
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id - however to be more consistent across pages
  // we will use useParams

  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormValuesSchema>({
    resolver: zodResolver(userFormValuesSchema),

    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastNames: user.lastNames,
    },
  });

  const onSubmit = async (formInputData: UserFormValuesSchema) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/users/${params.userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          email: formInputData.email,
          firstName: formInputData.firstName,
          lastNames: formInputData.lastNames,
        }),
      });

      const responseData = await response.json();

      // to see the navbar reload with name
      router.refresh();
      router.push(`/${params.clinicId}`);
      toast.success(`${responseData.message}`, { duration: 4000 });
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Manage My Profile" description="Update My Properties" />
        <div className=" flex justify-center items-center space-x-5">
          <Button disabled={isLoading}>
            <Link href={`/${params.clinicId}`}>Back to Clinic Dashboard</Link>
          </Button>
          <Button disabled={isLoading}>
            <Link
              href={`/${params.clinicId}/users/${params.userId}/my-settings/password`}
            >
              Change My Password
            </Link>
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
