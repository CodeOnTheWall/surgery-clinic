"use client";

// Next
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
// Next Auth
import { useSession } from "next-auth/react";
// Components
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { data: session } = useSession();

  const isSystemAdmin = session?.user.roles.includes("SYSTEMADMIN");

  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.clinicId}`,
      label: "Dashboard",
      active: pathname === `/${params.clinicId}`,
    },
    {
      // this navbar is used inside the layout of [clinicId], and although its in
      // components folder, it still gets the params from that layout
      // when we click, we will only see the settings for that specific store
      href: `/${params.clinicId}/settings`,
      label: "Clinic Settings",
      active: pathname === `/${params.clinicId}/settings`,
    },
  ];

  return (
    <nav className={`flex items-center space-x-4 lg:space-x-6 ${className}`}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`
        text-sm font-medium transition-colors hover:text-primary
        ${route.active ? "text-black dark:text-white" : "text-muted-foreground"}
      `}
        >
          {route.label}
        </Link>
      ))}
      <HoverCard>
        <HoverCardTrigger>Inventory</HoverCardTrigger>
        <HoverCardContent className=" flex flex-col space-y-3 w-auto">
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href={`/${params.clinicId}/inventory/`}
          >
            Inventory Overview
          </Link>
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href={`/${params.clinicId}/inventory/manage-inventory`}
          >
            Manage Inventory
          </Link>
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href={`/${params.clinicId}/products/register-product`}
          >
            Register Product
          </Link>
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            href={`/${params.clinicId}/products/`}
          >
            Manage Products
          </Link>
        </HoverCardContent>
      </HoverCard>
      {isSystemAdmin && (
        <HoverCard>
          <HoverCardTrigger>Admin</HoverCardTrigger>
          <HoverCardContent className=" flex flex-col space-y-3 w-auto">
            <Link
              className="text-sm font-medium transition-colors hover:text-primary"
              href={`/${params.clinicId}/admin/register-employee`}
            >
              Register Employee
            </Link>
            <Link
              className="text-sm font-medium transition-colors hover:text-primary"
              href={`/${params.clinicId}/admin/users`}
            >
              View and Manage Employees
            </Link>
            <Link
              className="text-sm font-medium transition-colors hover:text-primary"
              href={`/${params.clinicId}/admin/register-clinic`}
            >
              Register Clinic
            </Link>
            <Link
              className="text-sm font-medium transition-colors hover:text-primary"
              href={`/${params.clinicId}/admin/clinics`}
            >
              View and Manage Clinics
            </Link>
          </HoverCardContent>
        </HoverCard>
      )}
    </nav>
  );
}
