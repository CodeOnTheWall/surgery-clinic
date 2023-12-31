"use client";

// We (as the system admin) register a user, then the user can log in with the
// information and create their own clinic

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

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
  {
    id: "INVENTORYPERMISSION",
    label: "INVENTORYPERMISSION",
  },
  {
    id: "SOFTWAREARCHITECT",
    label: "SOFTWAREARCHITECT",
  },
  {
    id: "SURGEON",
    label: "SURGEON",
  },
];

const registerFormValuesSchema = z
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
type RegisterFormValuesSchema = z.infer<typeof registerFormValuesSchema>;

export default function RegisterUserForm() {
  // could use useParams to get from url, but already passing in the store
  // so can just do store.id
  // const params = useParams();

  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValuesSchema>({
    resolver: zodResolver(registerFormValuesSchema),
    // form will be pre populated with defaultValues
    defaultValues: {
      email: "",
      firstName: "",
      lastNames: "",
      password: "",
      confirm: "",
      roles: [],
    },
  });

  const onSubmit = async (formInputData: RegisterFormValuesSchema) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/admin/users`, {
        method: "POST",
        body: JSON.stringify({
          email: formInputData.email,
          firstName: formInputData.firstName,
          lastNames: formInputData.lastNames,
          password: formInputData.password,
          roles: formInputData.roles,
        }),
      });
      const responseData = await response.json();

      if (response.status === 200) {
        // Handle successful response
        // to see the navbar reload with name
        router.refresh();
        router.push(
          `/${params.clinicId}/admin/users/${responseData.sanitizedUser.id}`
        );
        toast.success(`${responseData.message}`, {
          duration: 4000,
        });
      } else {
        // Handle error response
        console.log(responseData);
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
      <div className="flex items-center justify-between">
        <div className=" flex items-center justify-between w-full">
          <Heading title="Register a User/Employee" />
          <Button>
            <Link href={`/${params.clinicId}/admin/users`}>
              View all Users/Employees
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
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Daniel.JuanCarlos@gmail.com"
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
                      placeholder="Daniel"
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
                      placeholder="Juan Carlos"
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
                    <FormLabel className="text-base">User Role</FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isLoading}
                      placeholder="owqd382jq0"
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
                      placeholder="owqd382jq0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className=" ml-auto" type="submit">
            Register User
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
}
