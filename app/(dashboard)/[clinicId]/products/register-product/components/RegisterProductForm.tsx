"use client";

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

const registerProductFormValuesSchema = z.object({
  upc: z
    .string()
    .min(5, "UPC must have at least 5 characters")
    .max(70, "UPC must have at most 70 characters"),
  name: z
    .string()
    .min(5, "Product name must have at least 5 characters")
    .max(50, "Product name must have at most 50 characters"),
  description: z
    .string()
    .min(5, "Description must have at least 5 characters")
    .max(70, "Description name must have at most 70 characters"),
  detail: z
    .string()
    .min(4, "Detail must have at least 5 characters")
    .max(70, "Detail name must have at most 70 characters")
    .optional(),
  manufacturer: z
    .string()
    .min(5, "Manufacturer must have at least 5 characters")
    .max(50, "Manufacturer name must have at most 50 characters"),
  vendor: z
    .string()
    .min(4, "Vendor must have at least 5 characters")
    .max(50, "Vendor must have at most 50 characters")
    .optional(),
});

type RegisterProductFormValuesSchema = z.infer<
  typeof registerProductFormValuesSchema
>;

export default function RegisterProductForm() {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterProductFormValuesSchema>({
    resolver: zodResolver(registerProductFormValuesSchema),
    // form will be pre populated with defaultValues
    defaultValues: {
      upc: "",
      name: "",
      description: "",
      detail: "",
      manufacturer: "",
      vendor: "",
    },
  });

  const onSubmit = async (formInputData: RegisterProductFormValuesSchema) => {
    try {
      setIsLoading(true);

      // reminder that response has status codes, but to get message
      // we must convert to json first to access that message
      const response = await fetch(`/api/products/`, {
        method: "POST",
        body: JSON.stringify({
          upc: formInputData.upc,
          name: formInputData.name,
          description: formInputData.name,
          detail: formInputData.name,
          manufacturer: formInputData.name,
          vendor: formInputData.name,
        }),
      });
      console.log(response);

      const responseData = await response.json();

      console.log(responseData);

      // Handle successful response
      // to see the navbar reload with name
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.clinicId}/products/${responseData.product.id}`);
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
          <Heading title="Register a Product" />
          <Button>
            <Link href={`/${params.clinicId}/products`}>View All Products</Link>
          </Button>
        </div>
        <p>
          After adding a product to the database, you will be redirected to its
          product page where you can modify or update its properties. A product
          only needs to be added once and can be used across multiple clinic
          inventories. Quantities will be automatically tracked in the
          clinic&apos;s inventory you&apos;re working on. To add product
          quantity to this clinic, go to Manage Inventory.
        </p>
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
              name="upc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPC</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="(01) 30382903711636"
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
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="CEPILLO EZ SCRUB"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="BD EZ SCRUB 116 3% PCMX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="BD EZ SCRUB 116 SURGICAL SCRUB BRUSH/SPONGE WITH 3% CHLOROXYLENOL, EMOLLIENTS AND NAIL CLEANER"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="BECTON, DICKINSON AND CO."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="ABC Medical Technologies"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} className=" ml-auto" type="submit">
            Register Product
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
}
