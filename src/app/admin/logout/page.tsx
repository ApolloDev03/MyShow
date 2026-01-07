// app/admin/logout/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiLogOut, FiX } from "react-icons/fi";

export default function AdminLogoutPage() {
    const [toastOpen, setToastOpen] = useState(true);

    useEffect(() => {
        // ✅ logout logic (edit keys as per your app)
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("user");
        } catch { }

        // auto hide toast
        const t = setTimeout(() => setToastOpen(false), 3500);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative min-h-screen bg-linear-to-br from-primary to-secondary text-black">

            {/* Center Card */}
            <div className="flex min-h-screen items-center justify-center px-4 py-10">
                <div className="w-full max-w-md  border border-white/30 bg-white/85 p-6 shadow-xl backdrop-blur-xl sm:p-10">
                    {/* Icon */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FiLogOut className="text-3xl" />
                    </div>

                    <h1 className="mt-5 text-center text-2xl font-bold text-black">
                        You are Logged Out
                    </h1>
                    <p className="mt-1 text-center text-sm text-black/60">
                        Thanks for visiting
                    </p>
                    {/* Actions */}
                    <div className="mt-6 grid gap-3">
                        <Link
                            href="/admin/login"
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary active:opacity-90"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
