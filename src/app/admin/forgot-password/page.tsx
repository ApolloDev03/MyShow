"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setemail] = useState("");
    const [sent, setSent] = useState(false);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // dummy submit (API later)
        if (!email || email.length !== 10) return;

        console.log("Forgot password request for email:", email);
        setSent(true);
    };

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

                {/* Title */}
                <div className="mt-6 text-center">
                    <h1 className="text-xl font-semibold">Forgot Password</h1>
                    <p className="mt-1 text-sm text-black/70">
                        Enter your email number to receive reset instructions.
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter Email"
                                inputMode="numeric"
                                maxLength={10}
                                value={email}
                                onChange={(e) => setemail(e.target.value.replace(/\D/g, ""))}
                                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                autoComplete="tel"
                                required
                            />
                            <p className="text-xs text-black/60">
                                We will send OTP / reset link on this email number.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={email.length !== 10}
                            className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Send Reset Link
                        </button>

                        <div className="flex items-center justify-center">
                            <Link
                                href="/admin/login"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="mt-6 space-y-4">
                        <div className="rounded-2xl border border-black/10 bg-black/2 p-4">
                            <p className="font-semibold">Request Sent ✅</p>
                            <p className="mt-1 text-sm text-black/70">
                                We sent reset instructions to{" "}
                                <span className="font-semibold text-black">{email}</span>.
                            </p>
                            <p className="mt-1 text-xs text-black/60">
                                If not received, check spam or try again.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setemail("");
                                setSent(false);
                            }}
                            className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-semibold text-black hover:bg-black/5"
                        >
                            Send Again
                        </button>

                        <Link
                            href="/admin/login"
                            className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:opacity-95"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
