"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";

export default function SuperAdminLogoutPage() {
    const [toastOpen, setToastOpen] = useState(true);

    useEffect(() => {
        // ✅ clear auth (optional)
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("superAdminToken");
            localStorage.removeItem("user");
        } catch { }

        // auto hide toast
        const t = setTimeout(() => setToastOpen(false), 2500);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="min-h-screen bg-linear-to-br from-primary to-secondary text-black flex items-center justify-center px-4 py-10 relative">

            {/* Card */}
            <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur p-6 sm:p-8 shadow-lg">
                {/* Brand */}
                <div className="w-full flex justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                            m
                        </span>
                        <span className="text-2xl font-semibold text-primary">myshow</span>
                    </Link>
                </div>

                {/* Icon */}
                <div className="mt-7 flex flex-col items-center text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FiLogOut className="text-3xl" />
                    </div>

                    <h1 className="mt-4 text-2xl font-bold">You are Logged Out</h1>
                    <p className="mt-1 text-sm text-black/60">Thanks for visiting</p>
                </div>

                {/* Actions */}
                <div className="mt-7 space-y-3">
                    <Link
                        href="/superadmin/login"
                        className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-secondary hover:opacity-95 active:opacity-90"
                    >
                        Sign In
                    </Link>
                </div>

                <p className="mt-6 text-center text-xs text-black/50">
                    * You have been securely signed out.
                </p>
            </div>
        </section>
    );
}
