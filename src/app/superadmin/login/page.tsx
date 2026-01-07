// app/(auth)/user/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

export default function SuperAdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) return setError("Please enter email.");
        if (!password.trim()) return setError("Please enter password.");

        // TODO: call API here
        // dummy success
        router.push("/admin/dashboard");
    };

    return (
        <section className="min-h-screen bg-linear-to-br from-primary to-secondary text-black flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-2xl bg-white/90 backdrop-blur p-6 shadow-lg border border-white/30">
                {/* Brand */}
                <div className="w-full flex justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                            m
                        </span>
                        <span className="text-2xl font-semibold text-primary">myshow</span>
                    </Link>
                </div>

                {/* Title */}
                <div className="mt-5 text-center">
                    <h1 className="text-xl font-bold text-black">Super Admin Login</h1>
                    <p className="mt-1 text-sm text-black/60">Sign in with your email & password.</p>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    {/* Email */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/50">
                                <FiMail />
                            </span>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-black/15 bg-white px-11 py-3 outline-none focus:ring-2 focus:ring-primary"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/50">
                                <FiLock />
                            </span>

                            <input
                                id="password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-black/15 bg-white px-11 py-3 outline-none focus:ring-2 focus:ring-primary"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPass((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-black/60 hover:bg-black/5"
                                aria-label={showPass ? "Hide password" : "Show password"}
                                title={showPass ? "Hide password" : "Show password"}
                            >
                                {showPass ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot */}
                    <div className="flex items-center justify-end">
                        <Link
                            href="/superadmin/forgot-password"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Error */}
                    {error ? (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </p>
                    ) : null}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-secondary hover:opacity-95 active:opacity-90"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <Link href="/" className="text-sm font-semibold text-white/95 hover:underline">
                            Back to website
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
