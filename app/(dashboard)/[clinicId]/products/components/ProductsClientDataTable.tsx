"use client";

// Next
import Link from "next/link";
import { useParams } from "next/navigation";
// Components
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
// Component Specific Components
import { ProductColumn, Columns } from "./ProductColumn";
import { Button } from "@/components/ui/button";

interface ProductClientProps {
  formattedProducts: ProductColumn[];
}

export default function ProductsClientDataTable({
  formattedProducts,
}: ProductClientProps) {
  const params = useParams();

  return (
    <>
      <div className=" flex items-center justify-between">
        <Heading title="View Product Inventory for this Clinic" />
        <Button>
          <Link href={`/${params.clinicId}/products/register-product`}>
            Register a Product
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKeyPlaceholder="search by name"
        // search by email
        searchKey="name"
        // columns from Column Definition in Columns
        columns={Columns}
        // data is data to be seen inside the Columns
        data={formattedProducts}
      />
      <Separator />
    </>
  );
}
