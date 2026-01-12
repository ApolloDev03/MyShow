"use client";

import { useEffect, useState } from "react";
import RoleGuard from "../components/RoleGuard";
import SuperAdminFooter from "../components/SuperAdminFooter";
import SuperAdminHeader from "../components/SuperAdminHeader";
import { usePathname } from "next/navigation";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("superadminToken");
    setHasToken(!!token);
  }, [pathname]);

  // Avoid hydration mismatch
  if (hasToken === null) return null;

  const hidelayout = pathname === "/superadmin/login" || pathname === "/superadmin/logout";

   if (hidelayout) {
    return <main>{children}</main>;
  }
  

  // If token present -> show header/footer (and keep RoleGuard)
  if (hasToken) {
    return (
      <RoleGuard roleRequired="superadmin">
        <SuperAdminHeader />
        <main>{children}</main>
        <SuperAdminFooter />
      </RoleGuard>
    );
  }

  return <main>{children}</main>;
}
