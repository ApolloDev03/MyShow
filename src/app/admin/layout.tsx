"use client";

import { useEffect, useState } from "react";
import AdminFooter from "../components/AdminFooter";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [hasToken, setHasToken] = useState<boolean | null>(null);

    useEffect(() => {
        // run on client only
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            setHasToken(!!token); // true if token exists
        }
    }, []);

    // while checking token, avoid flicker
    if (hasToken === null) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500 text-sm">Loading...</p>
            </main>
        );
    }

    return (
        <>
            <AdminHeader />
            <main>{children}</main>
            <AdminFooter />
        </>
    );
}
