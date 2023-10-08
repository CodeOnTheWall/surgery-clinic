import RegisterClinicForm from "./components/RegisterClinicForm";

export default async function AdminRegisterClinicPage() {
  return (
    <div className=" flex-col">
      <div className=" flex-1 space-y-4 p-8 pt-6">
        <RegisterClinicForm />
      </div>
    </div>
  );
}
