// // "use client";

// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import { useState } from "react";

// // export default function UserLoginPage() {
// //     const [mobile, setMobile] = useState("");
// //     const router = useRouter();

// //     return (
// //         <section className="min-h-screen bg-linear-to-br from-primary to-secondary text-black flex items-center justify-center px-4 py-10">
// //             <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
// //                 {/* Centered Brand */}
// //                 <div className="w-full flex justify-center">
// //                     <Link href="/" className="flex items-center gap-2">
// //                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
// //                             m
// //                         </span>
// //                         <span className="text-2xl font-semibold text-primary">myshow</span>
// //                     </Link>
// //                 </div>

// //                 <form className="mt-6 space-y-4">
// //                     <div className="space-y-1">
// //                         <label htmlFor="login" className="text-sm font-medium">
// //                             Mobile Number
// //                         </label>
// //                         <input
// //                             id="login"
// //                             name="login"
// //                             type="tel"
// //                             placeholder="Enter mobile number"
// //                             inputMode="numeric"
// //                             maxLength={10}
// //                             value={mobile}
// //                             onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
// //                             className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
// //                             autoComplete="tel"
// //                             required
// //                         />
// //                     </div>

// //                     <div className="space-y-1">
// //                         <label htmlFor="password" className="text-sm font-medium">
// //                             Password
// //                         </label>
// //                         <input
// //                             id="password"
// //                             name="password"
// //                             type="password"
// //                             placeholder="Enter password"
// //                             className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
// //                             autoComplete="current-password"
// //                             required
// //                         />
// //                     </div>

// //                     <div className="flex items-center justify-end">
// //                         <Link
// //                             href="/admin/forgot-password"
// //                             className="text-sm font-medium text-primary hover:underline"
// //                         >
// //                             Forgot password?
// //                         </Link>
// //                     </div>

// //                     <button
// //                         type="submit"
// //                         onClick={() => router.push("/admin/dashboard")}
// //                         className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90"
// //                     >
// //                         Login
// //                     </button>

// //                     <p className="text-center text-sm text-black/70">
// //                         Don’t have an account?{" "}
// //                         <Link
// //                             href="/admin/register"
// //                             className="font-semibold text-primary hover:underline"
// //                         >
// //                             Sign up
// //                         </Link>
// //                     </p>
// //                 </form>
// //             </div>
// //         </section>
// //     );
// // }


// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// type LoginApiResponse = {
//     status?: boolean;
//     message?: string;
//     data?: {
//         group_id: number;
//         group_name: string;
//         leader_name: string;
//         email: string;
//         mobile: string;
//         token: string;
//     };
//     errors?: Record<string, string[] | string>;
// };

// export default function UserLoginPage() {
//     const [mobile, setMobile] = useState("");
//     const [password, setPassword] = useState("");

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string>("");

//     const router = useRouter();

//     async function safeJson(res: Response) {
//         try {
//             return await res.json();
//         } catch {
//             return null;
//         }
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");

//         if (mobile.trim().length < 8) return setError("Please enter valid mobile number.");
//         if (!password.trim()) return setError("Please enter password.");

//         setLoading(true);
//         try {
//             const res = await fetch("https://getdemo.in/My_show/api/admin/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Accept: "application/json",
//                 },
//                 body: JSON.stringify({
//                     username: mobile.trim(),
//                     password: password,
//                 }),
//             });

//             const data = (await safeJson(res)) as LoginApiResponse | null;

//             if (!res.ok) {
//                 const apiMsg =
//                     data?.message ||
//                     (data?.errors
//                         ? Object.values(data.errors)
//                             .flat()
//                             .join(", ")
//                         : null) ||
//                     `Login failed (${res.status})`;
//                 setError(apiMsg);
//                 setLoading(false);
//                 return;
//             }

//             if (!data?.status || !data?.data?.token) {
//                 setError(data?.message || "Login failed. Please try again.");
//                 setLoading(false);
//                 return;
//             }

//             // ✅ Store token + user in localStorage
//             try {
//                 localStorage.setItem("adminToken", data.data.token);
//                 localStorage.setItem("role", "admin"); // helpful for AuthProvider/guard
//                 localStorage.setItem(
//                     "adminUser",
//                     JSON.stringify({
//                         ...data.data,
//                         role: "admin",
//                     })
//                 );
//             } catch { }

//             router.push("/admin/dashboard");
//         } catch (err: any) {
//             setError(err?.message || "Network error. Please try again.");
//         } finally {
//             setLoading(false);
//         }
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

//                 <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
//                     <div className="space-y-1">
//                         <label htmlFor="login" className="text-sm font-medium">
//                             Mobile Number
//                         </label>
//                         <input
//                             id="login"
//                             name="login"
//                             type="tel"
//                             placeholder="Enter mobile number"
//                             inputMode="numeric"
//                             maxLength={10}
//                             value={mobile}
//                             onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
//                             className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                             autoComplete="tel"
//                             required
//                         />
//                     </div>

//                     <div className="space-y-1">
//                         <label htmlFor="password" className="text-sm font-medium">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             name="password"
//                             type="password"
//                             placeholder="Enter password"
//                             className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                             autoComplete="current-password"
//                             required
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>

//                     <div className="flex items-center justify-end">
//                         <Link
//                             href="/admin/forgot-password"
//                             className="text-sm font-medium text-primary hover:underline"
//                         >
//                             Forgot password?
//                         </Link>
//                     </div>

//                     {error ? (
//                         <p className="text-center text-sm text-red-600">{error}</p>
//                     ) : null}

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//                     >
//                         {loading ? "Logging in..." : "Login"}
//                     </button>

//                     <p className="text-center text-sm text-black/70">
//                         Don’t have an account?{" "}
//                         <Link href="/admin/register" className="font-semibold text-primary hover:underline">
//                             Sign up
//                         </Link>
//                     </p>
//                 </form>
//             </div>
//         </section>
//     );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { apiUrl } from "@/config";
import { useAuth } from "@/app/context/AuthProvider";

type LoginApiResponse = {
    status?: boolean | number | string;
    success?: boolean | number | string;
    message?: string;
    msg?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
    data?: {
        group_id: number;
        group_name: string;
        leader_name: string;
        email: string;
        mobile: string;
        token: string;
    };
};

// axios instance
const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

function pickMessage(data?: LoginApiResponse) {
    if (!data) return "";
    return (
        data.message ||
        data.msg ||
        data.error ||
        (data.errors ? Object.values(data.errors).flat().join(", ") : "") ||
        ""
    );
}

function isSuccess(data?: LoginApiResponse) {
    const s = data?.status ?? data?.success;
    return s === true || s === 1 || s === "1" || s === "true" || s === "success";
}

function getApiErrorMessage(err: unknown) {
    const e = err as AxiosError<LoginApiResponse>;
    return pickMessage(e.response?.data) || e.message || "Network error. Please try again.";
}

export default function UserLoginPage() {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const router = useRouter();
    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (mobile.trim().length < 8) return setError("Please enter valid mobile number.");
        if (!password.trim()) return setError("Please enter password.");

        setLoading(true);
        try {
            const payload = {
                username: mobile.trim(),
                password,
            };

            // ✅ correct axios.post(url, payload, config)
            const res = await api.post<LoginApiResponse>("/admin/login", payload, {
                validateStatus: () => true,
            });

            const data = res.data;
            const message = pickMessage(data);

            if (res.status >= 200 && res.status < 300 && isSuccess(data) && data?.data?.token) {
                // ✅ THIS will set localStorage adminToken/role/user (via AuthProvider)
                auth.login({
                    role: "admin",
                    token: data.data.token,
                    user: {
                        id: String(data.data.group_id),
                        name: data.data.leader_name,
                        ...data.data, // keep full backend fields
                    },
                });

                router.push("/admin/dashboard");
                return;
            }

            setError(message || `Login failed (${res.status}).`);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-linear-to-br from-primary to-secondary text-black flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
                <div className="w-full flex justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                            m
                        </span>
                        <span className="text-2xl font-semibold text-primary">myshow</span>
                    </Link>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <Link href="/admin/forgot-password" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-sm text-black/70">
                        Don’t have an account?{" "}
                        <Link href="/admin/register" className="font-semibold text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
