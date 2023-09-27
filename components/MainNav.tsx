// "use client";

// import Link from "next/link";
// import { useParams, usePathname } from "next/navigation";

// export default function MainNav({
//   className,
// }: React.HTMLAttributes<HTMLElement>) {
//   const pathname = usePathname();
//   const params = useParams();

//   interface routeHelperProps {
//     label: string;
//   }
//   const routeHelper = ({ label }: routeHelperProps) => ({
//     href: `/${params.storeId}/${label.toLowerCase()}`,
//     label: label,
//     active: pathname === `/${params.storeId}/${label.toLowerCase()}`,
//   });
//   const labels = [
//     "Dashboard",
//     "Billboards",
//     "Categories",
//     "Sizes",
//     "Colors",
//     "Products",
//     "Orders",
//     "Settings",
//   ];
//   // array of objects
//   const routes = labels.map((label) => routeHelper({ label }));

//   return (
//     <nav className={`flex items-center space-x-4 lg:space-x-6 ${className}`}>
//       {routes.map((route) => (
//         <Link
//           key={route.href}
//           href={route.href}
//           className={`
//         text-sm font-medium transition-colors hover:text-primary
//         ${route.active ? "text-black dark:text-white" : "text-muted-foreground"}
//       `}
//         >
//           {route.label}
//         </Link>
//       ))}
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.clinicId}`,
      label: "Dashboard",
      active: pathname === `/${params.clinicId}`,
    },
    {
      href: `/${params.clinicId}/users`,
      label: "View Clinic Users",
      active: pathname === `/${params.clinicId}/users`,
    },
    {
      // this navbar is used inside the layout of [clinicId], and although its in
      // components folder, it still gets the params from that layout
      // when we click, we will only see the settings for that specific store
      href: `/${params.clinicId}/settings`,
      label: "Clinic Settings",
      active: pathname === `/${params.clinicId}/settings`,
    },
    {
      href: `/${params.clinicId}/admin/users`,
      label: "Manage Users and Clinics",
      active: pathname === `/${params.clinicId}/admin/users`,
    },
    // {
    //   href: `/${params.storeId}/billboards`,
    //   label: "Billboards",
    //   active: pathname === `/${params.storeId}/billboards`,
    // },
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
    </nav>
  );
}
