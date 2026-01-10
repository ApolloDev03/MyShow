"use client";

import { useEffect, useState } from "react";
import AdminFooter from "../components/AdminFooter";
import AdminHeader from "../components/AdminHeader";
import RoleGuard from "../components/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [hasToken, setHasToken] = useState<boolean | null>(null);

    useEffect(() => {
        // run on client only
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            setHasToken(!!token); // true if token exists
        }
    }, []);



    return (
        <>
            <RoleGuard roleRequired="admin">
                {hasToken && <AdminHeader />}
                <main>{children}</main>
                {hasToken && <AdminFooter />}
            </RoleGuard>
        </>
    );
}
