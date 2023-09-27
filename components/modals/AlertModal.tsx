"use client";
// React Hooks
import { useEffect, useState } from "react";
// Components
import Modal from "../ui/Modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AlertModal({
  isOpen,
  isLoading,
  title,
  description,
  onClose,
  onConfirm,
}: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  // to protect against hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className=" pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={isLoading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isLoading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}
