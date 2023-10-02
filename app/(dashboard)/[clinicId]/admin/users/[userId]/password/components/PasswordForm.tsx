"use client";

// React
import { useState } from "react";
// Next
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const passwordFormValuesSchema = z
  .object({
    password: z
      .string()
      .min(5, "Password must have at least 10 characters")
      .max(20, "Password must have at most 20 characters"),
    confirm: z
      .string()
      .min(5, "Password must have at least 10 characters")
      .max(20, "Password must have at most 20 characters"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    // path is where the error field should be added
    path: ["confirm"],
  });
type PasswordFormValuesSchema = z.infer<typeof passwordFormValuesSchema>;

interface PasswordFormProps {
  user: {
    firstName: string;
    lastNames: string;
  };
}

// using this form for both new and update
export default function PasswordForm({ user }: PasswordFormProps) {
  const { firstName, lastNames } = user;
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id - however to be more consistent across pages
  // we will use useParams

  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormValuesSchema>({
    resolver: zodResolver(passwordFormValuesSchema),

    defaultValues: {
      ...user,
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (formInputData: PasswordFormValuesSchema) => {
    try {
      setIsLoading(true);

      await fetch(`/api/admin/users/${params.userId}/password`, {
        method: "PATCH",
        body: JSON.stringify({
          password: formInputData.password,
        }),
      });

      // to see the navbar reload with name
      router.refresh();
      router.push(`/${params.clinicId}/admin/users/${params.userId}`);
      toast.success("User Password");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Updating User Password for ${firstName} ${lastNames}`}
          description="Password must be no less than 10 characters"
        />
        <Button disabled={isLoading}>
          <Link href={`/${params.clinicId}/admin/users/${params.userId}`}>
            Back to User Overview
          </Link>
        </Button>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      placeholder="1234567899"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className=""
                      disabled={isLoading}
                      placeholder="1234567899"
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
