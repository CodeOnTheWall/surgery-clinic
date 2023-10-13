// package to format dates
import { format } from "date-fns";
// Prisma Client
import prisma from "@/lib/prisma";
// Page Specific Components
import ProductsClientDataTable from "./components/ProductsClientDataTable";
import ManageProductInventory from "./components/ManageProductInventory";

interface ProductsClientPageProps {
  params: {
    clinicId: string;
  };
}

// add redirect if user isnt admin admin, check to see if session
// has information from credentials
export default async function ProductsClientPage({
  params,
}: ProductsClientPageProps) {
  const products = await prisma.product.findMany({});

  const formattedProducts = products.map((product) => ({
    id: product.id!,
    upc: product.upc!,
    name: product.name!,
    description: product.description!,
    detail: product.detail!,
    manufacturer: product.manufacturer!,
    vendor: product.vendor!,

    // formating to string
    // createdAt: format(product.createdAt!, "MMMM do, yyyy"),
    // updatedAt: format(product.updatedAt!, "MMMM do, yyyy"),
  }));

  const productInventory = await prisma.productInventory.findMany({
    where: { clinicId: params.clinicId },
    include: {
      boxItems: true,
      product: true,
    },
  });

  const formattedInventory = productInventory.map((productInventory) => ({
    id: productInventory.id!,
    clinicId: productInventory.clinicId!,
    productId: productInventory.productId!,
    name: productInventory.product.name!,
  }));

  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <ManageProductInventory formattedInventory={formattedInventory} />
        <ProductsClientDataTable formattedProducts={formattedProducts} />
      </div>
    </div>
  );
}
