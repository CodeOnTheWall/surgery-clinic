// "use client";
// React Hooks
import { useEffect } from "react";
// Zustand State Hook
import { useClinicModal } from "@/hooks/UseClinicModal";
import NavBar from "@/components/NavBar";

export default function SetupPage() {
  // const onOpen = useClinicModal((state) => state.onOpen);
  // const isOpen = useClinicModal((state) => state.isOpen);

  return (
    <div>
      <NavBar />
    </div>
  );

  // useEffect(() => {
  //   // isOpen is false by default at beginning
  //   // !false = true and !true = false
  //   if (!isOpen) {
  //     onOpen();
  //     // console.log("here");
  //     // console.log("isOpen is", isOpen);
  //   }
  // }, [isOpen, onOpen]);
  // // reminder that the useEffect will run after the component completely renders
  // // console.log("isOpen is", isOpen);
  // // dont need to return anything as only using this page to
  // // trigger the modal
  // return null;
}
