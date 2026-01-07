"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserLoginPage() {
    const [mobile, setMobile] = useState("");
    const router = useRouter();

    return (
        <section className="min-h-screen bg-linear-to-br from-primary to-secondary text-black flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
                {/* Centered Brand */}
                <div className="w-full flex justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                            m
                        </span>
                        <span className="text-2xl font-semibold text-primary">myshow</span>
                    </Link>
                </div>

                <form className="mt-6 space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="login" className="text-sm font-medium">
                            Mobile Number
                        </label>
                        <input
                            id="login"
                            name="login"
                            type="tel"
                            placeholder="Enter mobile number"
                            inputMode="numeric"
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                            className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            autoComplete="tel"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <Link
                            href="/admin/forgot-password"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        onClick={() => router.push("/admin/dashboard")}
                        className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm text-black/70">
                        Don’t have an account?{" "}
                        <Link
                            href="/admin/register"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
