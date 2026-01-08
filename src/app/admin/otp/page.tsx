// // // // app/(auth)/user/otp/page.tsx
// // // "use client";

// // // import Link from "next/link";
// // // import { useRouter } from "next/navigation";
// // // import { useMemo, useRef, useState } from "react";

// // // export default function UserOtpPage() {
// // //     const OTP_LEN = 6;
// // //     const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
// // //     const [error, setError] = useState<string>("");
// // //     const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
// // //     const router = useRouter();
// // //     const otpValue = useMemo(() => otp.join(""), [otp]);

// // //     const focusIndex = (i: number) => {
// // //         const el = inputsRef.current[i];
// // //         el?.focus();
// // //         el?.select();
// // //     };

// // //     const handleChange = (i: number, v: string) => {
// // //         setError("");
// // //         const digit = v.replace(/\D/g, "").slice(-1); // only last digit
// // //         const next = [...otp];
// // //         next[i] = digit;
// // //         setOtp(next);

// // //         if (digit && i < OTP_LEN - 1) focusIndex(i + 1);
// // //     };

// // //     const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
// // //         if (e.key === "Backspace") {
// // //             if (otp[i]) {
// // //                 const next = [...otp];
// // //                 next[i] = "";
// // //                 setOtp(next);
// // //             } else if (i > 0) {
// // //                 focusIndex(i - 1);
// // //             }
// // //         }
// // //     };

// // //     const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
// // //         e.preventDefault();
// // //         setError("");
// // //         const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
// // //         if (!pasted) return;

// // //         const next = Array(OTP_LEN).fill("");
// // //         for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
// // //         setOtp(next);

// // //         const lastIndex = Math.min(pasted.length, OTP_LEN) - 1;
// // //         if (lastIndex >= 0) focusIndex(lastIndex);
// // //     };

// // //     const handleSubmit = (e: React.FormEvent) => {
// // //         e.preventDefault();

// // //         if (otpValue.length !== OTP_LEN || otp.includes("")) {
// // //             setError(`Please enter ${OTP_LEN}-digit OTP`);
// // //             return;
// // //         }

// // //         // TODO: verify OTP API
// // //         // console.log("OTP:", otpValue);
// // //     };

// // //     return (
// // //         <section className="min-h-screen bg-linear-to-r from-primary to-secondary flex items-center justify-center px-4 py-10">
// // //             <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
// // //                 {/* Centered Brand */}
// // //                 <div className="w-full flex justify-center ">
// // //                     <Link href="/" className="flex items-center gap-2">
// // //                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
// // //                             m
// // //                         </span>
// // //                         <span className="text-2xl font-semibold text-primary">myshow</span>
// // //                     </Link>
// // //                 </div>

// // //                 <h1 className="mt-5 text-xl font-semibold text-center text-black">
// // //                     OTP Verification
// // //                 </h1>
// // //                 <p className="text-center text-sm mt-1 text-black/70">
// // //                     Enter the {OTP_LEN}-digit code
// // //                 </p>

// // //                 <form onSubmit={handleSubmit} className="mt-6 space-y-5">
// // //                     <div className="flex justify-center gap-2">
// // //                         {otp.map((val, i) => (
// // //                             <input
// // //                                 key={i}
// // //                                 ref={(el) => {
// // //                                     inputsRef.current[i] = el;
// // //                                 }}
// // //                                 value={val}
// // //                                 onChange={(e) => handleChange(i, e.target.value)}
// // //                                 onKeyDown={(e) => handleKeyDown(i, e)}
// // //                                 onPaste={handlePaste}
// // //                                 inputMode="numeric"
// // //                                 pattern="[0-9]*"
// // //                                 maxLength={1}
// // //                                 className="h-12 w-12 rounded-xl border border-black/15 bg-white text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
// // //                             />
// // //                         ))}
// // //                     </div>

// // //                     {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

// // //                     <button
// // //                         type="submit"
// // //                         onClick={() => router.push("/admin/login")}
// // //                         className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90"
// // //                     >
// // //                         Verify OTP
// // //                     </button>

// // //                     <div className="flex items-center justify-center text-sm">


// // //                         <button
// // //                             type="button"
// // //                             className="text-primary hover:underline font-medium"
// // //                             onClick={() => {
// // //                                 // TODO: resend OTP API call
// // //                             }}
// // //                         >
// // //                             Resend OTP
// // //                         </button>
// // //                     </div>
// // //                 </form>
// // //             </div>
// // //         </section>
// // //     );
// // // }


// // // app/admin/otp/page.tsx  (or your otp page file)
// // "use client";

// // import Link from "next/link";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { useEffect, useMemo, useRef, useState } from "react";

// // type ApiResponse = {
// //     status?: boolean;
// //     message?: string;
// //     errors?: Record<string, string[] | string>;
// // };

// // export default function UserOtpPage() {
// //     const OTP_LEN = 6;

// //     const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
// //     const [email, setEmail] = useState<string>("");

// //     const [error, setError] = useState<string>("");
// //     const [msg, setMsg] = useState<string>("");
// //     const [loading, setLoading] = useState<boolean>(false);

// //     const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
// //     const router = useRouter();
// //     const searchParams = useSearchParams();

// //     const otpValue = useMemo(() => otp.join(""), [otp]);

// //     // get email from localStorage (saved from register page) OR query param (?email=)
// //     useEffect(() => {
// //         let fromQuery = searchParams?.get("email") || "";
// //         let fromStorage = "";

// //         try {
// //             const raw = localStorage.getItem("pending_admin_register");
// //             if (raw) {
// //                 const parsed = JSON.parse(raw);
// //                 fromStorage = parsed?.email || "";
// //             }
// //         } catch { }

// //         setEmail((fromStorage || fromQuery || "").trim());
// //     }, [searchParams]);

// //     const focusIndex = (i: number) => {
// //         const el = inputsRef.current[i];
// //         el?.focus();
// //         el?.select();
// //     };

// //     const handleChange = (i: number, v: string) => {
// //         setError("");
// //         setMsg("");

// //         const digit = v.replace(/\D/g, "").slice(-1);
// //         const next = [...otp];
// //         next[i] = digit;
// //         setOtp(next);

// //         if (digit && i < OTP_LEN - 1) focusIndex(i + 1);
// //     };

// //     const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
// //         if (e.key === "Backspace") {
// //             if (otp[i]) {
// //                 const next = [...otp];
// //                 next[i] = "";
// //                 setOtp(next);
// //             } else if (i > 0) {
// //                 focusIndex(i - 1);
// //             }
// //         }
// //     };

// //     const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
// //         e.preventDefault();
// //         setError("");
// //         setMsg("");

// //         const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
// //         if (!pasted) return;

// //         const next = Array(OTP_LEN).fill("");
// //         for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
// //         setOtp(next);

// //         const lastIndex = Math.min(pasted.length, OTP_LEN) - 1;
// //         if (lastIndex >= 0) focusIndex(lastIndex);
// //     };

// //     async function safeJson(res: Response) {
// //         try {
// //             return await res.json();
// //         } catch {
// //             return null;
// //         }
// //     }

// //     const handleSubmit = async (e: React.FormEvent) => {
// //         e.preventDefault();
// //         setError("");
// //         setMsg("");

// //         if (!email) {
// //             setError("Email not found. Please register again.");
// //             return;
// //         }

// //         if (otpValue.length !== OTP_LEN || otp.includes("")) {
// //             setError(`Please enter ${OTP_LEN}-digit OTP`);
// //             return;
// //         }

// //         setLoading(true);
// //         try {
// //             const res = await fetch("https://getdemo.in/My_show/api/admin/verify-otp", {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Accept: "application/json",
// //                 },
// //                 body: JSON.stringify({
// //                     email,
// //                     otp: otpValue,
// //                 }),
// //             });

// //             const data = (await safeJson(res)) as ApiResponse | null;

// //             if (!res.ok) {
// //                 const apiMsg =
// //                     data?.message ||
// //                     (data?.errors
// //                         ? Object.values(data.errors)
// //                             .flat()
// //                             .join(", ")
// //                         : null) ||
// //                     `Request failed (${res.status})`;
// //                 setError(apiMsg);
// //                 setLoading(false);
// //                 return;
// //             }

// //             if (data?.status) {
// //                 setMsg(data.message || "Email verified successfully. You can now login..");

// //                 // optional: clear pending register email
// //                 try {
// //                     localStorage.removeItem("pending_admin_register");
// //                 } catch { }

// //                 router.push("/admin/login");
// //                 return;
// //             }

// //             setError(data?.message || "OTP verification failed. Please try again.");
// //         } catch (err: any) {
// //             setError(err?.message || "Network error. Please try again.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <section className="min-h-screen bg-linear-to-r from-primary to-secondary flex items-center justify-center px-4 py-10">
// //             <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
// //                 {/* Centered Brand */}
// //                 <div className="w-full flex justify-center ">
// //                     <Link href="/" className="flex items-center gap-2">
// //                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
// //                             m
// //                         </span>
// //                         <span className="text-2xl font-semibold text-primary">myshow</span>
// //                     </Link>
// //                 </div>

// //                 <h1 className="mt-5 text-xl font-semibold text-center text-black">
// //                     OTP Verification
// //                 </h1>
// //                 <p className="text-center text-sm mt-1 text-black/70">
// //                     Enter the {OTP_LEN}-digit code
// //                 </p>

// //                 <form onSubmit={handleSubmit} className="mt-6 space-y-5">
// //                     <div className="flex justify-center gap-2">
// //                         {otp.map((val, i) => (
// //                             <input
// //                                 key={i}
// //                                 ref={(el) => {
// //                                     inputsRef.current[i] = el;
// //                                 }}
// //                                 value={val}
// //                                 onChange={(e) => handleChange(i, e.target.value)}
// //                                 onKeyDown={(e) => handleKeyDown(i, e)}
// //                                 onPaste={handlePaste}
// //                                 inputMode="numeric"
// //                                 pattern="[0-9]*"
// //                                 maxLength={1}
// //                                 className="h-12 w-12 rounded-xl border border-black/15 bg-white text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
// //                             />
// //                         ))}
// //                     </div>

// //                     {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
// //                     {msg ? <p className="text-center text-sm text-green-600">{msg}</p> : null}

// //                     <button
// //                         type="submit"
// //                         disabled={loading}
// //                         className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
// //                     >
// //                         {loading ? "Verifying..." : "Verify OTP"}
// //                     </button>

// //                     <div className="flex items-center justify-center text-sm">
// //                         <button
// //                             type="button"
// //                             className="text-primary hover:underline font-medium"
// //                             onClick={() => {
// //                                 // TODO: resend OTP API call (when you give endpoint)
// //                                 setError("");
// //                                 setMsg("Resend OTP API not connected yet.");
// //                             }}
// //                         >
// //                             Resend OTP
// //                         </button>
// //                     </div>
// //                 </form>
// //             </div>
// //         </section>
// //     );
// // }


// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useMemo, useRef, useState } from "react";
// import axios, { AxiosError } from "axios";
// import { apiUrl } from "@/config";

// type ApiResponse = {
//   status?: boolean;
//   message?: string;
//   errors?: Record<string, string[] | string>;
// };

// // Optional: axios instance
// const api = axios.create({
//   baseURL: apiUrl,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// function getApiErrorMessage(err: unknown) {
//   const e = err as AxiosError<ApiResponse>;
//   const data = e?.response?.data;

//   return (
//     data?.message ||
//     (data?.errors
//       ? Object.values(data.errors)
//           .flat()
//           .join(", ")
//       : null) ||
//     e?.message ||
//     "Network error. Please try again."
//   );
// }

// export default function UserOtpPage() {
//   const OTP_LEN = 6;

//   const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
//   const [email, setEmail] = useState<string>("");

//   const [error, setError] = useState<string>("");
//   const [msg, setMsg] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const otpValue = useMemo(() => otp.join(""), [otp]);

//   // get email from localStorage (saved from register page) OR query param (?email=)
//   useEffect(() => {
//     const fromQuery = searchParams?.get("email") || "";
//     let fromStorage = "";

//     try {
//       const raw = localStorage.getItem("pending_admin_register");
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         fromStorage = parsed?.email || "";
//       }
//     } catch {}

//     setEmail((fromStorage || fromQuery || "").trim());
//   }, [searchParams]);

//   const focusIndex = (i: number) => {
//     const el = inputsRef.current[i];
//     el?.focus();
//     el?.select();
//   };

//   const handleChange = (i: number, v: string) => {
//     setError("");
//     setMsg("");

//     const digit = v.replace(/\D/g, "").slice(-1);
//     const next = [...otp];
//     next[i] = digit;
//     setOtp(next);

//     if (digit && i < OTP_LEN - 1) focusIndex(i + 1);
//   };

//   const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Backspace") {
//       if (otp[i]) {
//         const next = [...otp];
//         next[i] = "";
//         setOtp(next);
//       } else if (i > 0) {
//         focusIndex(i - 1);
//       }
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     setError("");
//     setMsg("");

//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
//     if (!pasted) return;

//     const next = Array(OTP_LEN).fill("");
//     for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
//     setOtp(next);

//     const lastIndex = Math.min(pasted.length, OTP_LEN) - 1;
//     if (lastIndex >= 0) focusIndex(lastIndex);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMsg("");

//     if (!email) {
//       setError("Email not found. Please register again.");
//       return;
//     }

//     if (otpValue.length !== OTP_LEN || otp.includes("")) {
//       setError(`Please enter ${OTP_LEN}-digit OTP`);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.post<ApiResponse>("/admin/verify-otp", {
//         email,
//         otp: otpValue,
//       });

//       const data = res.data;

//       if (data?.status) {
//         setMsg(data.message || "Email verified successfully. You can now login..");

//         try {
//           localStorage.removeItem("pending_admin_register");
//         } catch {}

//         router.push("/admin/login");
//         return;
//       }

//       setError(data?.message || "OTP verification failed. Please try again.");
//     } catch (err) {
//       setError(getApiErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="min-h-screen bg-linear-to-r from-primary to-secondary flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
//         {/* Centered Brand */}
//         <div className="w-full flex justify-center ">
//           <Link href="/" className="flex items-center gap-2">
//             <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
//               m
//             </span>
//             <span className="text-2xl font-semibold text-primary">myshow</span>
//           </Link>
//         </div>

//         <h1 className="mt-5 text-xl font-semibold text-center text-black">OTP Verification</h1>
//         <p className="text-center text-sm mt-1 text-black/70">Enter the {OTP_LEN}-digit code</p>

//         <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//           <div className="flex justify-center gap-2">
//             {otp.map((val, i) => (
//               <input
//                 key={i}
//                 ref={(el) => {
//                   inputsRef.current[i] = el;
//                 }}
//                 value={val}
//                 onChange={(e) => handleChange(i, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(i, e)}
//                 onPaste={handlePaste}
//                 inputMode="numeric"
//                 pattern="[0-9]*"
//                 maxLength={1}
//                 className="h-12 w-12 rounded-xl border border-black/15 bg-white text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
//               />
//             ))}
//           </div>

//           {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
//           {msg ? <p className="text-center text-sm text-green-600">{msg}</p> : null}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>

//           <div className="flex items-center justify-center text-sm">
//             <button
//               type="button"
//               className="text-primary hover:underline font-medium"
//               onClick={() => {
//                 // TODO: resend OTP API call (when you give endpoint)
//                 setError("");
//                 setMsg("Resend OTP API not connected yet.");
//               }}
//             >
//               Resend OTP
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }




"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { apiUrl } from "@/config";

type ApiResponse = {
    status?: boolean | number | string;
    success?: boolean | number | string;
    message?: string;
    msg?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
};

// ✅ axios instance (same as register)
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
    const msg = pickMessage(e.response?.data);
    return msg || e.message || "Network error. Please try again.";
}

export default function UserOtpPage() {
    const OTP_LEN = 6;

    const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
    const [email, setEmail] = useState<string>("");

    const [error, setError] = useState<string>("");
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    const otpValue = useMemo(() => otp.join(""), [otp]);

    useEffect(() => {
        const fromQuery = searchParams?.get("email") || "";
        let fromStorage = "";

        try {
            const raw = localStorage.getItem("pending_admin_register");
            if (raw) {
                const parsed = JSON.parse(raw);
                fromStorage = parsed?.email || "";
            }
        } catch { }

        setEmail((fromStorage || fromQuery || "").trim());
    }, [searchParams]);

    const focusIndex = (i: number) => {
        const el = inputsRef.current[i];
        el?.focus();
        el?.select();
    };

    const handleChange = (i: number, v: string) => {
        setError("");
        setMsg("");

        const digit = v.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[i] = digit;
        setOtp(next);

        if (digit && i < OTP_LEN - 1) focusIndex(i + 1);
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[i]) {
                const next = [...otp];
                next[i] = "";
                setOtp(next);
            } else if (i > 0) {
                focusIndex(i - 1);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError("");
        setMsg("");

        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
        if (!pasted) return;

        const next = Array(OTP_LEN).fill("");
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setOtp(next);

        const lastIndex = Math.min(pasted.length, OTP_LEN) - 1;
        if (lastIndex >= 0) focusIndex(lastIndex);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMsg("");

        if (!email) {
            setError("Email not found. Please register again.");
            return;
        }

        if (otpValue.length !== OTP_LEN || otp.includes("")) {
            setError(`Please enter ${OTP_LEN}-digit OTP`);
            return;
        }

        setLoading(true);
        try {
            // ✅ send multiple common key names to avoid backend mismatch
            const payload = {
                email,
                otp: otpValue,
                code: otpValue,
                otp_code: otpValue,
            };

            // ✅ same structure as register: validateStatus + message parsing
            const res = await api.post<ApiResponse>("/admin/verify-otp", payload, {
                validateStatus: () => true,
            });

            const data = res.data;
            const message = pickMessage(data);

            if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
                setMsg(message || "Email verified successfully. You can now login.");

                try {
                    localStorage.removeItem("pending_admin_register");
                } catch { }

                router.push("/admin/login");
                return;
            }

            setError(message || `OTP verification failed (${res.status}).`);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-linear-to-r from-primary to-secondary flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
                <div className="w-full flex justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                            m
                        </span>
                        <span className="text-2xl font-semibold text-primary">myshow</span>
                    </Link>
                </div>

                <h1 className="mt-5 text-xl font-semibold text-center text-black">OTP Verification</h1>
                <p className="text-center text-sm mt-1 text-black/70">Enter the {OTP_LEN}-digit code</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="flex justify-center gap-2">
                        {otp.map((val, i) => (
                            <input
                                key={i}
                                ref={(el) => {
                                    inputsRef.current[i] = el;
                                }}
                                value={val}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                onPaste={handlePaste}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                className="h-12 w-12 rounded-xl border border-black/15 bg-white text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
                            />
                        ))}
                    </div>

                    {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
                    {msg ? <p className="text-center text-sm text-green-600">{msg}</p> : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <div className="flex items-center justify-center text-sm">
                        <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => {
                                setError("");
                                setMsg("Resend OTP API not connected yet.");
                            }}
                        >
                            Resend OTP
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
