import RegisterUserForm from "./components/RegisterUserForm";

export default async function AdminRegisterUserPage() {
  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <RegisterUserForm />
      </div>
    </div>
  );
}
