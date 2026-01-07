"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from "react-icons/fi";

export default function SuperAdminForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        // dummy submit
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);

            // TODO: Call API here
            // await fetch("/api/superadmin/forgot-password", { method: "POST", body: JSON.stringify({ email }) })
        }, 800);
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



                {!submitted ? (
                    <>
                        <div className="mt-4 text-center">
                            <h1 className="text-xl font-bold">Forgot Password</h1>
                        </div>

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </label>

                                <div className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
                                    <FiMail className="text-black/50" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent outline-none"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <FiSend />
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>


                        </form>
                    </>
                ) : (
                    <>
                        <div className="mt-6 flex flex-col items-center text-center">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <FiCheckCircle className="text-2xl" />
                            </div>

                            <h2 className="mt-4 text-xl font-bold">Check your email</h2>
                            <p className="mt-1 text-sm text-black/60">
                                We sent a password reset link to:
                            </p>

                            <p className="mt-2 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-2 text-sm font-semibold">
                                {email}
                            </p>

                            <button
                                type="button"
                                onClick={() => router.push("/superadmin/login")}
                                className="mt-6 w-full rounded-xl bg-primary hover:bg-secondary px-4 py-3 font-semibold text-white hover:opacity-95"
                            >
                                Back to Login
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitted(false);
                                    setEmail("");
                                    setError("");
                                }}
                                className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-semibold hover:bg-black/5"
                            >
                                Send Again
                            </button>
                        </div>
                    </>
                )}
                {/* Back to login */}
                <div className="mt-4 text-center">
                    <Link
                        href="/superadmin/login"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </section>
    );
}
