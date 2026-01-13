// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import axios, { AxiosError } from "axios";
// import { apiUrl } from "@/config";

// type ApiResponse = {
//     status?: boolean | number | string;
//     success?: boolean | number | string;
//     message?: string;
//     msg?: string;
//     error?: string;
//     errors?: Record<string, string[] | string>;
// };

// function pickMessage(data?: ApiResponse) {
//     if (!data) return "";
//     return (
//         data.message ||
//         data.msg ||
//         data.error ||
//         (data.errors ? Object.values(data.errors).flat().join(", ") : "") ||
//         ""
//     );
// }

// function isSuccess(data?: ApiResponse) {
//     const s = data?.status ?? data?.success;
//     return s === true || s === 1 || s === "1" || s === "true" || s === "success";
// }

// function getApiErrorMessage(err: unknown) {
//     const e = err as AxiosError<ApiResponse>;
//     const msg = pickMessage(e.response?.data);
//     return msg || e.message || "Network error. Please try again.";
// }

// export default function AdminRegisterPage() {
//     const router = useRouter();

//     const [groupName, setGroupName] = useState("");
//     const [leaderName, setLeaderName] = useState("");
//     const [mobileNumber, setMobileNumber] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [passwordConfirmation, setPasswordConfirmation] = useState("");

//     const [loading, setLoading] = useState(false);
//     const [msg, setMsg] = useState("");
//     const [err, setErr] = useState("");

//     const onSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setMsg("");
//         setErr("");

//         if (groupName.trim().length < 2) return setErr("Please enter group name.");
//         if (leaderName.trim().length < 2) return setErr("Please enter name.");
//         if (mobileNumber.trim().length < 8) return setErr("Please enter valid contact number.");
//         if (!email.trim()) return setErr("Please enter email.");
//         if (password.length < 6) return setErr("Password must be at least 6 characters.");
//         if (password !== passwordConfirmation) return setErr("Password & Confirm Password must match.");

//         setLoading(true);

//         try {
//             const payload = {
//                 group_name: groupName.trim(),
//                 leader_name: leaderName.trim(),
//                 mobile_number: mobileNumber.trim(),
//                 email: email.trim(),
//                 password,
//                 password_confirmation: passwordConfirmation,
//             };

//             // ✅ CORRECT axios.post: (url, payload, config)
//             const res = await axios.post<ApiResponse>(
//                 `${apiUrl}/admin/register`,
//                 payload,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Accept: "application/json",
//                     },
//                     validateStatus: () => true, // read backend message even for 4xx/5xx
//                 }
//             );

//             const data = res.data;
//             const message = pickMessage(data);

//             if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
//                 setMsg(message || "OTP sent. Please verify.");

//                 try {
//                     localStorage.setItem(
//                         "pending_admin_register",
//                         JSON.stringify({
//                             group_name: groupName.trim(),
//                             leader_name: leaderName.trim(),
//                             mobile_number: mobileNumber.trim(),
//                             email: email.trim(),
//                         })
//                     );
//                 } catch { }

//                 router.push("/admin/otp");
//                 return;
//             }

//             setErr(message || `Registration failed (${res.status}).`);
//         } catch (error) {
//             setErr(getApiErrorMessage(error));
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen lg:h-screen lg:overflow-hidden">
//             <div className="lg:flex lg:h-screen">
//                 {/* LEFT */}
//                 <aside className="relative bg-linear-to-br from-primary to-secondary text-white lg:w-1/2 lg:h-screen lg:sticky lg:top-0">
//                     <div className="flex h-full items-center justify-center px-8 py-14">
//                         <div className="max-w-md">
//                             <Link href="/" className="inline-flex items-center gap-2">
//                                 <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xl">
//                                     m
//                                 </span>
//                                 <span className="text-3xl font-bold">myshow</span>
//                             </Link>

//                             <h2 className="mt-8 text-4xl font-semibold leading-tight">Create your account</h2>
//                             <p className="mt-3 text-white/80">
//                                 Register to start using myshow. Fill in your details on the right.
//                             </p>
//                         </div>
//                     </div>
//                 </aside>

//                 {/* RIGHT (no scroll on lg) */}
//                 <main className="lg:w-1/2 lg:h-screen bg-white px-4 py-6 overflow-y-auto lg:overflow-hidden">
//                     <div className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg border border-black/10 lg:mt-10">
//                         <h1 className="text-2xl font-semibold text-center">Register</h1>
//                         <p className="text-center text-sm mt-1 text-black/70">Create your account to continue</p>

//                         <form className="mt-6" onSubmit={onSubmit}>
//                             {/* ✅ 2-by-2 layout on md+ */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Group Name */}
//                                 <div className="space-y-1">
//                                     <label htmlFor="groupname" className="text-sm font-medium">
//                                         Group Name
//                                     </label>
//                                     <input
//                                         id="groupname"
//                                         name="groupname"
//                                         type="text"
//                                         placeholder="Enter group name"
//                                         className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                                         required
//                                         value={groupName}
//                                         onChange={(e) => setGroupName(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Name */}
//                                 <div className="space-y-1">
//                                     <label htmlFor="name" className="text-sm font-medium">
//                                         Name
//                                     </label>
//                                     <input
//                                         id="name"
//                                         name="name"
//                                         type="text"
//                                         placeholder="Enter your name"
//                                         className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                                         required
//                                         value={leaderName}
//                                         onChange={(e) => setLeaderName(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Contact */}
//                                 <div className="space-y-1">
//                                     <label htmlFor="contact" className="text-sm font-medium">
//                                         Contact
//                                     </label>
//                                     <input
//                                         id="contact"
//                                         name="contact"
//                                         type="tel"
//                                         placeholder="Enter contact number"
//                                         className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                                         autoComplete="tel"
//                                         required
//                                         value={mobileNumber}
//                                         inputMode="numeric"
//                                         maxLength={10}
//                                         onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
//                                     />
//                                 </div>

//                                 {/* Email */}
//                                 <div className="space-y-1">
//                                     <label htmlFor="email" className="text-sm font-medium">
//                                         Email
//                                     </label>
//                                     <input
//                                         id="email"
//                                         name="email"
//                                         type="email"
//                                         placeholder="Enter email"
//                                         className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                                         autoComplete="email"
//                                         required
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Password */}
//                                 <div className="space-y-1">
//                                     <label htmlFor="password" className="text-sm font-medium">
//                                         Password
//                                     </label>
//                                     <input
//                                         id="password"
//                                         name="password"
//                                         type="password"
//                                         placeholder="Enter password"
//                                         className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                                         autoComplete="new-password"
//                                         required
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* Confirm Password */}
//                                 <div className="space-y-1">
//                                     <label htmlFor="confirmpassword" className="text-sm font-medium">
//                                         Confirm Password
//                                     </label>
//                                     <input
//                                         id="confirmpassword"
//                                         name="confirmpassword"
//                                         type="password"
//                                         placeholder="Confirm password"
//                                         className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
//                                         autoComplete="new-password"
//                                         required
//                                         value={passwordConfirmation}
//                                         onChange={(e) => setPasswordConfirmation(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="mt-5 w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? "Creating..." : "Create Account"}
//                             </button>

//                             {err ? (
//                                 <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                                     {err}
//                                 </div>
//                             ) : null}

//                             {msg ? (
//                                 <div className="mt-4 rounded-xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-black/70">
//                                     {msg}
//                                 </div>
//                             ) : null}

//                             <p className="mt-4 text-center text-sm text-black/70">
//                                 Already have an account?{" "}
//                                 <Link href="/admin/login" className="font-semibold text-primary hover:underline">
//                                     Login
//                                 </Link>
//                             </p>
//                         </form>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { apiUrl } from "@/config";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ApiResponse = {
    status?: boolean | number | string;
    success?: boolean | number | string;
    message?: string;
    msg?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
};

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
    const msg = pickMessage(e.response?.data);
    return msg || e.message || "Network error. Please try again.";
}

export default function AdminRegisterPage() {
    const router = useRouter();

    const [groupName, setGroupName] = useState("");
    const [leaderName, setLeaderName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [loading, setLoading] = useState(false);

    // (optional) keep these if you still want inline messages
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");
        setErr("");

        if (groupName.trim().length < 2) {
            const m = "Please enter group name.";
            setErr(m);
            toast.error(m);
            return;
        }
        if (leaderName.trim().length < 2) {
            const m = "Please enter name.";
            setErr(m);
            toast.error(m);
            return;
        }
        if (mobileNumber.trim().length < 8) {
            const m = "Please enter valid contact number.";
            setErr(m);
            toast.error(m);
            return;
        }
        if (!email.trim()) {
            const m = "Please enter email.";
            setErr(m);
            toast.error(m);
            return;
        }
        if (password.length < 6) {
            const m = "Password must be at least 6 characters.";
            setErr(m);
            toast.error(m);
            return;
        }
        if (password !== passwordConfirmation) {
            const m = "Password & Confirm Password must match.";
            setErr(m);
            toast.error(m);
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Creating account...");

        try {
            const payload = {
                group_name: groupName.trim(),
                leader_name: leaderName.trim(),
                mobile_number: mobileNumber.trim(),
                email: email.trim(),
                password,
                password_confirmation: passwordConfirmation,
            };

            const res = await axios.post<ApiResponse>(`${apiUrl}/admin/register`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                validateStatus: () => true,
            });

            const data = res.data;
            const message = pickMessage(data);

            if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
                const okMsg = message || "OTP sent. Please verify.";
                setMsg(okMsg);

                toast.update(toastId, {
                    render: okMsg,
                    type: "success",
                    isLoading: false,
                    autoClose: 1500,
                });

                try {
                    localStorage.setItem(
                        "pending_admin_register",
                        JSON.stringify({
                            group_name: groupName.trim(),
                            leader_name: leaderName.trim(),
                            mobile_number: mobileNumber.trim(),
                            email: email.trim(),
                        })
                    );
                } catch { }

                router.push("/admin/otp");
                return;
            }

            const errMsg = message || `Registration failed (${res.status}).`;
            setErr(errMsg);

            toast.update(toastId, {
                render: errMsg,
                type: "error",
                isLoading: false,
                autoClose: 2500,
            });
        } catch (error) {
            const errMsg = getApiErrorMessage(error);
            setErr(errMsg);

            toast.update(toastId, {
                render: errMsg,
                type: "error",
                isLoading: false,
                autoClose: 2500,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden">
            <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick pauseOnHover draggable />

            <div className="lg:flex lg:h-screen">
                {/* LEFT */}
                <aside className="relative bg-linear-to-br from-primary to-secondary text-white lg:w-1/2 lg:h-screen lg:sticky lg:top-0">
                    <div className="flex h-full items-center justify-center px-8 py-14">
                        <div className="max-w-md">
                            <Link href="/" className="inline-flex items-center gap-2">
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xl">
                                    m
                                </span>
                                <span className="text-3xl font-bold">myshow</span>
                            </Link>

                            <h2 className="mt-8 text-4xl font-semibold leading-tight">Create your account</h2>
                            <p className="mt-3 text-white/80">Register to start using myshow. Fill in your details on the right.</p>
                        </div>
                    </div>
                </aside>

                {/* RIGHT */}
                <main className="lg:w-1/2 lg:h-screen bg-white px-4 py-6 overflow-y-auto lg:overflow-hidden">
                    <div className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg border border-black/10 lg:mt-10">
                        <h1 className="text-2xl font-semibold text-center">Register</h1>
                        <p className="text-center text-sm mt-1 text-black/70">Create your account to continue</p>

                        <form className="mt-6" onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="groupname" className="text-sm font-medium">
                                        Group Name
                                    </label>
                                    <input
                                        id="groupname"
                                        name="groupname"
                                        type="text"
                                        placeholder="Enter group name"
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        value={leaderName}
                                        onChange={(e) => setLeaderName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="contact" className="text-sm font-medium">
                                        Contact
                                    </label>
                                    <input
                                        id="contact"
                                        name="contact"
                                        type="tel"
                                        placeholder="Enter contact number"
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                        autoComplete="tel"
                                        required
                                        value={mobileNumber}
                                        inputMode="numeric"
                                        maxLength={10}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter email"
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
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
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="confirmpassword" className="text-sm font-medium">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmpassword"
                                        name="confirmpassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                        autoComplete="new-password"
                                        required
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-5 w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating..." : "Create Account"}
                            </button>

                            {/* optional inline messages (you can remove if you want only toast) */}
                            {err ? (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {err}
                                </div>
                            ) : null}

                            {msg ? (
                                <div className="mt-4 rounded-xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-black/70">
                                    {msg}
                                </div>
                            ) : null}

                            <p className="mt-4 text-center text-sm text-black/70">
                                Already have an account?{" "}
                                <Link href="/admin/login" className="font-semibold text-primary hover:underline">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
