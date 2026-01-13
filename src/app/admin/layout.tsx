"use client";

import { useEffect, useState } from "react";
import AdminFooter from "../components/AdminFooter";
import AdminHeader from "../components/AdminHeader";
import RoleGuard from "../components/RoleGuard";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // run on client only
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            setHasToken(!!token); // true if token exists
        }
    }, [pathname]);

    const hidelayout = pathname === "/admin/login" || pathname === "/admin/logout";



    return (
        <>
            <RoleGuard roleRequired="admin">
                {!hidelayout && hasToken && <AdminHeader />}
                <main>{children}</main>
                {!hidelayout && hasToken && <AdminFooter />}
            </RoleGuard>
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
            />
        </>
    );
}
