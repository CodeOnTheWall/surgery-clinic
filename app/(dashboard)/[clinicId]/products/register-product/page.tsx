import RegisterProductForm from "./components/RegisterProductForm";

export default async function RegisterProductPage() {
  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <RegisterProductForm />
      </div>
    </div>
  );
}
