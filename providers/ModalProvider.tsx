"use client";

import { useEffect, useState } from "react";

import ClinicModal from "@/components/modals/ClinicModal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  // useEffect always runs after component has been loaded, hence isMounted
  // will be true after the initial render
  // this is to avoid hydration errors, between what is loaded on client and server
  // essentially dont want to setIsMounted to true until the server side
  // has completely loaded, common for dialog/modal components
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <ClinicModal /> : null;
}
