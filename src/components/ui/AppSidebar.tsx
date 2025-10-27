"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { label: "Personal Information", href: "/profile/create/personal-info" },
  { label: "Academic Information", href: "/profile/create/academic-info" },
  { label: "Employment Information", href: "/profile/create/employment-info" },
  { label: "Document Upload", href: "/profile/create/docs" },
  { label: "Review", href: "/profile/create/review" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 brder-r ">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "block rounded-md px-3 py-2 text-sm font-medium",
                active
                  ? "bg-gray-100 text-gray-900"
                  : "hover:underline"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
