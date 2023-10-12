import { create } from "zustand";

interface useProductModal {
  isOpen: boolean;
  // void means a function that takes no arguments and doesnt return any value
  onOpen: () => void;
  onClose: () => void;
}

export const useProductModal = create<useProductModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
