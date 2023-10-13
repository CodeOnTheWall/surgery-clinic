"use client";

// React
import { useState } from "react";
// Next
import { useParams, useRouter } from "next/navigation";
// Components
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// 3rd Party Libraries
import { toast } from "react-hot-toast";

interface ManageProductInventoryProps {
  formattedInventory: {
    id: string;
    clinicId: string;
    productId: string;
    name: string;
  }[];
}

export default function ManageProductInventory({
  formattedInventory,
}: ManageProductInventoryProps) {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // State for the selected product and the quantity to add or delete
  const [selectedProduct, setSelectedProduct] = useState(
    formattedInventory[0].id
  );
  const [quantity, setQuantity] = useState(0);
  const [boxQuantity, setBoxQuantity] = useState(0);
  const [quantityInsideBox, setQuantityInsideBox] = useState(0);

  console.log(
    "quantity",
    quantity,
    "clinicId",
    params.clinicId,
    "selectedProduct",
    selectedProduct
  );

  // option select
  const handleProductChange = (e: any) => {
    setSelectedProduct(e.target.value);
  };

  const handleQuantityChange = (e: any) => {
    setQuantity(e.target.value);
  };

  const handleAddQuantity = async (addOrDelete: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/productInventory/${selectedProduct}`, {
        method: "PATCH",
        body: JSON.stringify({
          quantity: quantity,
          productInventoryId: selectedProduct,
          addOrDelete: addOrDelete,
        }),
      });
      const responseData = await response.json();

      router.refresh();
      router.push(`/${params.clinicId}/products`);
      toast.success(`${responseData.message}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoxQuantityChange = (e: any) => {
    setBoxQuantity(e.target.value);
  };

  const handleQuantityInsideBoxChange = (e: any) => {
    setQuantityInsideBox(e.target.value);
  };

  const handleAddBoxQuantity = async () => {};

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Manage Product Inventory" />
      </div>
      <Separator />

      <h1>For Individual Pieces</h1>
      <div className=" flex gap-x-4 ">
        <select value={selectedProduct} onChange={handleProductChange}>
          {formattedInventory.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          max="500"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <Button disabled={isLoading} onClick={() => handleAddQuantity("ADD")}>
          Add Quantity
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => handleAddQuantity("DELETE")}
        >
          Delete Quantity
        </Button>
      </div>
      <h1>For Boxes</h1>
      <div className=" flex gap-x-4">
        <select value={selectedProduct} onChange={handleProductChange}>
          {formattedInventory.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <div className=" flex flex-col gap-y-4">
          <div className=" flex gap-x-4">
            <input
              type="number"
              min="0"
              max="500"
              value={boxQuantity}
              onChange={handleBoxQuantityChange}
            />
            <Button disabled={isLoading} onClick={handleBoxQuantityChange}>
              Add Box Quantity
            </Button>
            {/* might not need this as logic will delete from box first */}
            <Button disabled={isLoading} onClick={handleBoxQuantityChange}>
              Delete Box Quantity
            </Button>
          </div>
          <div className=" flex  gap-x-4">
            <input
              type="number"
              min="0"
              max="500"
              value={quantityInsideBox}
              onChange={handleQuantityInsideBoxChange}
            />
            <Button disabled={isLoading} onClick={handleAddBoxQuantity}>
              Add Quantity Inside Box
            </Button>
            {/* might not need this as logic will delete from box first */}
            <Button disabled={isLoading} onClick={handleAddBoxQuantity}>
              Delete Quantity Inside Box
            </Button>
          </div>
        </div>
      </div>

      <Separator />
    </>
  );
}
