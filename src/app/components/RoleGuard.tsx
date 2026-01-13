"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Role, useAuth } from "../context/AuthProvider";

type Props = {
  roleRequired: Role;
  children: React.ReactNode;
};

const ROUTES = {
  adminLogin: "/admin/login",
  superLogin: "/superadmin/login",
  adminHome: "/admin/dashboard",
  superHome: "/superadmin/dashboard",
};

const ADMIN_PUBLIC = ["/admin/login", "/admin/register", "/admin/otp", "/admin/logout"];
const SUPER_PUBLIC = ["/superadmin/login", "/superadmin/logout"];

function isPublicPage(pathname: string, roleRequired: Role) {
  const list = roleRequired === "admin" ? ADMIN_PUBLIC : SUPER_PUBLIC;
  return list.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function RoleGuard({ roleRequired, children }: Props) {
  const { loading, token, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!pathname) return;

    // ✅ allow public pages like register/otp/login
    if (isPublicPage(pathname, roleRequired)) return;

    // not logged in
    if (!token) {
      router.replace(roleRequired === "admin" ? ROUTES.adminLogin : ROUTES.superLogin);
      return;
    }

    // wrong role trying to enter
    if (role && role !== roleRequired) {
      router.replace(role === "admin" ? ROUTES.adminHome : ROUTES.superHome);
      return;
    }
  }, [loading, token, role, roleRequired, pathname, router]);

  if (loading) return null;
  return <>{children}</>;
}
