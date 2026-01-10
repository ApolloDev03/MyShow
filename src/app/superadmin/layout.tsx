"use client";

import { useEffect, useState } from "react";
import RoleGuard from "../components/RoleGuard";
import SuperAdminFooter from "../components/SuperAdminFooter";
import SuperAdminHeader from "../components/SuperAdminHeader";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("superadminToken");
    setHasToken(!!token);
  }, []);

  // Avoid hydration mismatch
  if (hasToken === null) return null;

  // If token not present -> NO header/footer
  if (!hasToken) {
    return <main>{children}</main>;
  }

  // If token present -> show header/footer (and keep RoleGuard)
  return (
    <RoleGuard roleRequired="superadmin">
      <SuperAdminHeader />
      <main>{children}</main>
      <SuperAdminFooter />
    </RoleGuard>
  );
}
