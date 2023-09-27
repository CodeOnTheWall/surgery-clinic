// Next Auth provider
import AuthProvider from "@/providers/NextAuthProvider";
import ToasterProvider from "@/providers/ToastProvider";
import ModalProvider from "@/providers/ModalProvider";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cirujano Clinic Admin Dashboard",
  description: "Log in or register to create an account for your clinic",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <ToasterProvider />
          {/* the root page is whats causing the ModalProvider to render,
          but also since we put it here as a provider, any time the onOpen
          is called, the Modal will pop up. ModalProvider calls ClinicModal, 
          which calls Modal, but only if isOpen is true, hence if not true, we load first clinic */}
          <ModalProvider />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
