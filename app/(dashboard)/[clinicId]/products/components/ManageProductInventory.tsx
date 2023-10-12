"use client";

// Next
import { useParams } from "next/navigation";
// Components
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

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

  const [isLoading, setIsLoading] = useState(false);

  // State for the selected product and the quantity to add or delete
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [boxQuantity, setBoxQuantity] = useState(0);
  const [quantityInsideBox, setQuantityInsideBox] = useState(0);

  // Function to handle the change of the selected product
  const handleProductChange = (e: any) => {
    setSelectedProduct(e.target.value);
  };

  // Function to handle the change of the quantity
  const handleQuantityChange = (e: any) => {
    setQuantity(e.target.value);
  };
  const handleBoxQuantityChange = (e: any) => {
    setBoxQuantity(e.target.value);
  };
  const handleQuantityInsideBoxChange = (e: any) => {
    setQuantityInsideBox(e.target.value);
  };

  // Function to handle the addition of product quantity
  const handleAddQuantity = async () => {
    // Add your logic here to add the quantity to the selected product
  };

  // Function to handle the deletion of product quantity
  const handleDeleteQuantity = async () => {
    // Add your logic here to delete the quantity from the selected product
  };

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
        <Button disabled={isLoading} onClick={handleAddQuantity}>
          Add Quantity
        </Button>
        <Button disabled={isLoading} onClick={handleDeleteQuantity}>
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
            <Button disabled={isLoading} onClick={handleAddQuantity}>
              Add Box Quantity
            </Button>
            {/* might not need this as logic will delete from box first */}
            <Button disabled={isLoading} onClick={handleDeleteQuantity}>
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
            <Button disabled={isLoading} onClick={handleAddQuantity}>
              Add Quantity Inside Box
            </Button>
            {/* might not need this as logic will delete from box first */}
            <Button disabled={isLoading} onClick={handleDeleteQuantity}>
              Delete Quantity Inside Box
            </Button>
          </div>
        </div>
      </div>

      <Separator />
    </>
  );
}
