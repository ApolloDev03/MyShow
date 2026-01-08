// "use client";

// import Link from "next/link";
// import { useState } from "react";

// export default function ForgotPasswordPage() {
//     const [email, setemail] = useState("");
//     const [sent, setSent] = useState(false);

//     const onSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         // dummy submit (API later)
//         if (!email || email.length !== 10) return;

//         console.log("Forgot password request for email:", email);
//         setSent(true);
//     };

//     return (
//         <section className="min-h-screen bg-linear-to-br from-primary to-secondary text-black flex items-center justify-center px-4 py-10">
//             <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
//                 {/* Centered Brand */}
//                 <div className="w-full flex justify-center">
//                     <Link href="/" className="flex items-center gap-2">
//                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
//                             m
//                         </span>
//                         <span className="text-2xl font-semibold text-primary">myshow</span>
//                     </Link>
//                 </div>

//                 {/* Title */}
//                 <div className="mt-6 text-center">
//                     <h1 className="text-xl font-semibold">Forgot Password</h1>
//                     <p className="mt-1 text-sm text-black/70">
//                         Enter your email number to receive reset instructions.
//                     </p>
//                 </div>

//                 {!sent ? (
//                     <form onSubmit={onSubmit} className="mt-6 space-y-4">
//                         <div className="space-y-1">
//                             <label htmlFor="email" className="text-sm font-medium">
//                                 Email
//                             </label>
//                             <input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 placeholder="Enter Email"
//                                 inputMode="numeric"
//                                 maxLength={10}
//                                 value={email}
//                                 onChange={(e) => setemail(e.target.value.replace(/\D/g, ""))}
//                                 className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                                 autoComplete="tel"
//                                 required
//                             />
//                             <p className="text-xs text-black/60">
//                                 We will send OTP / reset link on this email number.
//                             </p>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={email.length !== 10}
//                             className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             Send Reset Link
//                         </button>

//                         <div className="flex items-center justify-center">
//                             <Link
//                                 href="/admin/login"
//                                 className="text-sm font-medium text-primary hover:underline"
//                             >
//                                 Back to Login
//                             </Link>
//                         </div>
//                     </form>
//                 ) : (
//                     <div className="mt-6 space-y-4">
//                         <div className="rounded-2xl border border-black/10 bg-black/2 p-4">
//                             <p className="font-semibold">Request Sent ✅</p>
//                             <p className="mt-1 text-sm text-black/70">
//                                 We sent reset instructions to{" "}
//                                 <span className="font-semibold text-black">{email}</span>.
//                             </p>
//                             <p className="mt-1 text-xs text-black/60">
//                                 If not received, check spam or try again.
//                             </p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setemail("");
//                                 setSent(false);
//                             }}
//                             className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-semibold text-black hover:bg-black/5"
//                         >
//                             Send Again
//                         </button>

//                         <Link
//                             href="/admin/login"
//                             className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:opacity-95"
//                         >
//                             Go to Login
//                         </Link>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// }


"use client";

import Link from "next/link";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { apiUrl } from "@/config"; // adjust path if needed

type ApiResponse = {
    status?: boolean | number | string;
    success?: boolean | number | string;
    message?: string;
    msg?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
};

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

function pickMessage(data?: ApiResponse) {
    if (!data) return "";
    return (
        data.message ||
        data.msg ||
        data.error ||
        (data.errors ? Object.values(data.errors).flat().join(", ") : "") ||
        ""
    );
}

function isSuccess(data?: ApiResponse) {
    const s = data?.status ?? data?.success;
    return s === true || s === 1 || s === "1" || s === "true" || s === "success";
}

function getApiErrorMessage(err: unknown) {
    const e = err as AxiosError<ApiResponse>;
    return pickMessage(e.response?.data) || e.message || "Network error. Please try again.";
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMsg("");

        if (!email.trim()) {
            setError("Please enter email.");
            return;
        }

        setLoading(true);
        try {
            const payload = { email: email.trim() };

            const res = await api.post<ApiResponse>("/admin/forgot-password", payload, {
                validateStatus: () => true,
            });

            const data = res.data;
            const message = pickMessage(data);

            if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
                setMsg(message || "New password has been sent to your registered email");
                setSent(true);
                return;
            }

            setError(message || `Request failed (${res.status}).`);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
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
                        Enter your email to receive reset instructions.
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                autoComplete="email"
                                required
                            />
                            <p className="text-xs text-black/60">
                                We will send a new password to this registered email.
                            </p>
                        </div>

                        {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
                        {msg ? <p className="text-center text-sm text-green-600">{msg}</p> : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="flex items-center justify-center">
                            <Link href="/admin/login" className="text-sm font-medium text-primary hover:underline">
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
                            <p className="mt-1 text-xs text-black/60">If not received, check spam or try again.</p>
                        </div>

                        {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

                        <button
                            type="button"
                            onClick={() => {
                                setEmail("");
                                setSent(false);
                                setError("");
                                setMsg("");
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
