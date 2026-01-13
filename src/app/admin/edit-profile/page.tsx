// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import axios, { AxiosError } from "axios";
// import { FiArrowLeft, FiCamera, FiLock, FiSave, FiUser } from "react-icons/fi";
// import { apiUrl } from "@/config";

// type TabKey = "details" | "password";

// type ApiResponse = {
//     status?: boolean | number | string;
//     success?: boolean | number | string;
//     message?: string;
//     msg?: string;
//     error?: string;
//     errors?: Record<string, string[] | string>;
// };

// type Profile = {
//     fullName: string; // leader_name
//     email: string;
//     phone: string; // mobile_number
//     role: string; // ✅ we use this as group_name (same as your profile page)
//     photoUrl?: string; // local only
// };

// const STORAGE_KEY = "admin_profile_v1";

// const labelCls = "text-sm font-medium text-black";
// const inputCls =
//     "mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";

// const api = axios.create({
//     baseURL: apiUrl,
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// });

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
//     return pickMessage(e.response?.data) || e.message || "Network error. Please try again.";
// }

// function getToken() {
//     if (typeof window === "undefined") return "";
//     return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
// }

// function loadProfile(): Profile {
//     const fallback: Profile = {
//         fullName: "Admin",
//         email: "",
//         phone: "",
//         role: "Administrator",
//         photoUrl: "",
//     };

//     if (typeof window === "undefined") return fallback;

//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return fallback;

//     try {
//         return JSON.parse(raw) as Profile;
//     } catch {
//         return fallback;
//     }
// }

// function saveProfileToStorage(p: Profile) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
// }

// function fileToDataUrl(file: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(String(reader.result || ""));
//         reader.onerror = () => reject(new Error("Failed to read file"));
//         reader.readAsDataURL(file);
//     });
// }

// export default function AdminEditProfilePage() {
//     const router = useRouter();
//     const [tab, setTab] = useState<TabKey>("details");

//     // Profile
//     const [draft, setDraft] = useState<Profile>(() => loadProfile());
//     const [photoFile, setPhotoFile] = useState<File | null>(null);
//     const [photoPreview, setPhotoPreview] = useState<string>("");

//     const [detailsLoading, setDetailsLoading] = useState(false);
//     const [detailsErr, setDetailsErr] = useState("");
//     const [detailsMsg, setDetailsMsg] = useState("");

//     // Password form
//     const [oldPass, setOldPass] = useState("");
//     const [newPass, setNewPass] = useState("");
//     const [confirmPass, setConfirmPass] = useState("");

//     const [passLoading, setPassLoading] = useState(false);
//     const [passErr, setPassErr] = useState("");
//     const [passMsg, setPassMsg] = useState("");

//     useEffect(() => {
//         if (!photoFile) {
//             setPhotoPreview("");
//             return;
//         }
//         const url = URL.createObjectURL(photoFile);
//         setPhotoPreview(url);
//         return () => URL.revokeObjectURL(url);
//     }, [photoFile]);

//     const initials = useMemo(() => {
//         const n = draft.fullName?.trim();
//         if (!n) return "A";
//         return n[0].toUpperCase();
//     }, [draft.fullName]);

//     const shownPhoto = photoPreview || draft.photoUrl || "";

//     // ✅ 6) Profile update API
//     // PUT https://getdemo.in/My_show/api/admin/profile/update
//     const onUpdateDetails = async () => {
//         setDetailsErr("");
//         setDetailsMsg("");

//         if (!draft.role.trim()) return setDetailsErr("Please enter Group Name");
//         if (!draft.fullName.trim()) return setDetailsErr("Please enter Name");
//         if (!draft.email.trim()) return setDetailsErr("Please enter Email");
//         if (!draft.phone.trim()) return setDetailsErr("Please enter Phone");

//         const token = getToken();
//         if (!token) {
//             router.push("/admin/login");
//             return;
//         }

//         setDetailsLoading(true);
//         try {
//             let next: Profile = { ...draft };

//             // local-only photo save
//             if (photoFile) {
//                 const dataUrl = await fileToDataUrl(photoFile);
//                 next.photoUrl = dataUrl;
//             }

//             const payload = {
//                 group_name: next.role.trim(),
//                 leader_name: next.fullName.trim(),
//                 mobile_number: next.phone.trim(),
//                 email: next.email.trim(),
//             };

//             const res = await api.put<ApiResponse>("/admin/profile/update", payload, {
//                 validateStatus: () => true,
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const data = res.data;
//             const message = pickMessage(data);

//             if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
//                 saveProfileToStorage(next);
//                 setDraft(next);
//                 setPhotoFile(null);
//                 setDetailsMsg(message || "Profile updated successfully");
//                 return;
//             }

//             if (res.status === 401 || res.status === 403) {
//                 try {
//                     localStorage.removeItem("adminToken");
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("role");
//                     localStorage.removeItem("user");
//                     localStorage.removeItem("adminUser");
//                 } catch { }
//                 router.push("/admin/login");
//                 return;
//             }

//             setDetailsErr(message || `Profile update failed (${res.status}).`);
//         } catch (err) {
//             setDetailsErr(getApiErrorMessage(err));
//         } finally {
//             setDetailsLoading(false);
//         }
//     };

//     // ✅ 8) Change password API
//     // POST https://getdemo.in/My_show/api/admin/change-password
//     const onChangePassword = async () => {
//         setPassErr("");
//         setPassMsg("");

//         if (!oldPass.trim()) return setPassErr("Enter old password");
//         if (!newPass.trim()) return setPassErr("Enter new password");
//         if (newPass.length < 6) return setPassErr("New password must be at least 6 characters");
//         if (newPass !== confirmPass) return setPassErr("Confirm password does not match");

//         const token = getToken();
//         if (!token) {
//             router.push("/admin/login");
//             return;
//         }

//         setPassLoading(true);
//         try {
//             const payload = {
//                 old_password: oldPass,
//                 new_password: newPass,
//                 new_password_confirmation: confirmPass,
//             };

//             const res = await api.post<ApiResponse>("/admin/change-password", payload, {
//                 validateStatus: () => true,
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const data = res.data;
//             const message = pickMessage(data);

//             if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
//                 setPassMsg(message || "Password changed successfully");
//                 setOldPass("");
//                 setNewPass("");
//                 setConfirmPass("");
//                 return;
//             }

//             if (res.status === 401 || res.status === 403) {
//                 try {
//                     localStorage.removeItem("adminToken");
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("role");
//                     localStorage.removeItem("user");
//                     localStorage.removeItem("adminUser");
//                 } catch { }
//                 router.push("/admin/login");
//                 return;
//             }

//             setPassErr(message || `Password change failed (${res.status}).`);
//         } catch (err) {
//             setPassErr(getApiErrorMessage(err));
//         } finally {
//             setPassLoading(false);
//         }
//     };

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-4xl px-4 py-8">
//                 {/* Back button */}
//                 <div className="mb-4">
//                     <Link
//                         href="/admin/profile"
//                         className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
//                     >
//                         <FiArrowLeft className="text-base" />
//                         Back to Profile
//                     </Link>
//                 </div>

//                 {/* Main card */}
//                 <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
//                     {/* Tabs */}
//                     <div className="px-6 pt-6 sm:px-10 sm:pt-8">
//                         <div className="flex items-center gap-2">
//                             <button
//                                 type="button"
//                                 onClick={() => setTab("details")}
//                                 className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === "details"
//                                         ? "border border-black/10 bg-white shadow-sm"
//                                         : "text-black/60 hover:text-black"
//                                     }`}
//                             >
//                                 <FiUser />
//                                 Personal Details
//                             </button>

//                             <button
//                                 type="button"
//                                 onClick={() => setTab("password")}
//                                 className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === "password"
//                                         ? "border border-black/10 bg-white shadow-sm"
//                                         : "text-black/60 hover:text-black"
//                                     }`}
//                             >
//                                 <FiLock />
//                                 Change Password
//                             </button>
//                         </div>

//                         <div className="mt-4 h-px w-full bg-black/10" />
//                     </div>

//                     {/* Content */}
//                     <div className="px-6 pb-6 sm:px-10 sm:pb-10">
//                         {tab === "details" ? (
//                             <>
//                                 {/* Avatar row */}
//                                 <div className="mt-6 flex flex-col items-center text-center">
//                                     <div className="relative">
//                                         <div className="h-24 w-24 overflow-hidden rounded-full border border-black/10 bg-black/3 flex items-center justify-center">
//                                             {shownPhoto ? (
//                                                 // eslint-disable-next-line @next/next/no-img-element
//                                                 <img src={shownPhoto} alt="Profile" className="h-full w-full object-cover" />
//                                             ) : (
//                                                 <span className="text-3xl font-bold text-primary">{initials}</span>
//                                             )}
//                                         </div>

//                                         <label
//                                             className="absolute -bottom-2 right-0 inline-flex cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white p-2 shadow-sm hover:bg-black/5"
//                                             title="Change photo"
//                                         >
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 className="hidden"
//                                                 onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
//                                             />
//                                             <FiCamera className="text-lg" />
//                                         </label>
//                                     </div>

//                                     <p className="mt-3 text-sm text-black/60">{draft.role}</p>
//                                 </div>

//                                 {/* Fields */}
//                                 <div className="mx-auto mt-6 max-w-2xl space-y-5">
//                                     {/* ✅ Group Name (API needs group_name) */}
//                                     <div>
//                                         <label className={labelCls}>Group Name</label>
//                                         <input
//                                             value={draft.role}
//                                             onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))}
//                                             className={inputCls}
//                                             placeholder="Enter group name"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>Name</label>
//                                         <input
//                                             value={draft.fullName}
//                                             onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))}
//                                             className={inputCls}
//                                             placeholder="Enter name"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>Email</label>
//                                         <input
//                                             type="email"
//                                             value={draft.email}
//                                             onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
//                                             className={inputCls}
//                                             placeholder="Enter email"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>Phone Number</label>
//                                         <input
//                                             value={draft.phone}
//                                             onChange={(e) =>
//                                                 setDraft((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))
//                                             }
//                                             className={inputCls}
//                                             placeholder="Enter phone"
//                                             inputMode="numeric"
//                                             maxLength={10}
//                                         />
//                                     </div>

//                                     <button
//                                         type="button"
//                                         onClick={onUpdateDetails}
//                                         disabled={detailsLoading}
//                                         className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
//                                     >
//                                         <FiSave className="text-base" />
//                                         {detailsLoading ? "Updating..." : "Update Details"}
//                                     </button>

//                                     {detailsErr ? (
//                                         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                                             {detailsErr}
//                                         </div>
//                                     ) : null}

//                                     {detailsMsg ? (
//                                         <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                                             {detailsMsg}
//                                         </div>
//                                     ) : null}
//                                 </div>
//                             </>
//                         ) : (
//                             <>
//                                 {/* Change password */}
//                                 <div className="mx-auto mt-6 max-w-2xl space-y-5">
//                                     <div>
//                                         <label className={labelCls}>
//                                             Old Password <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="password"
//                                             value={oldPass}
//                                             onChange={(e) => setOldPass(e.target.value)}
//                                             className={inputCls}
//                                             placeholder="Enter old password"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>
//                                             New Password <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="password"
//                                             value={newPass}
//                                             onChange={(e) => setNewPass(e.target.value)}
//                                             className={inputCls}
//                                             placeholder="Enter new password"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className={labelCls}>
//                                             Confirm Password <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="password"
//                                             value={confirmPass}
//                                             onChange={(e) => setConfirmPass(e.target.value)}
//                                             className={inputCls}
//                                             placeholder="Confirm password"
//                                         />
//                                     </div>

//                                     <button
//                                         type="button"
//                                         onClick={onChangePassword}
//                                         disabled={passLoading}
//                                         className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
//                                     >
//                                         <FiLock className="text-base" />
//                                         {passLoading ? "Changing..." : "Change Password"}
//                                     </button>

//                                     {passErr ? (
//                                         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                                             {passErr}
//                                         </div>
//                                     ) : null}

//                                     {passMsg ? (
//                                         <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                                             {passMsg}
//                                         </div>
//                                     ) : null}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </section>
//             </div>
//         </main>
//     );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { FiArrowLeft, FiCamera, FiLock, FiSave, FiUser } from "react-icons/fi";
import { apiUrl } from "@/config";
import { toast } from "react-toastify";

type TabKey = "details" | "password";

type ApiResponse = {
    status?: boolean | number | string;
    success?: boolean | number | string;
    message?: string;
    msg?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
};

type Profile = {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    photoUrl?: string;
};

const STORAGE_KEY = "admin_profile_v1";

const labelCls = "text-sm font-medium text-black";
const inputCls =
    "mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";

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

function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
}

function loadProfile(): Profile {
    const fallback: Profile = {
        fullName: "Admin",
        email: "",
        phone: "",
        role: "Administrator",
        photoUrl: "",
    };

    if (typeof window === "undefined") return fallback;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    try {
        return JSON.parse(raw) as Profile;
    } catch {
        return fallback;
    }
}

function saveProfileToStorage(p: Profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

function Spinner({ className = "" }: { className?: string }) {
    return (
        <span
            className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`}
            aria-hidden="true"
        />
    );
}

export default function AdminEditProfilePage() {
    const router = useRouter();
    const [tab, setTab] = useState<TabKey>("details");

    // Profile
    const [draft, setDraft] = useState<Profile>(() => loadProfile());
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    const [detailsLoading, setDetailsLoading] = useState(false);

    // Password form
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [passLoading, setPassLoading] = useState(false);

    useEffect(() => {
        if (!photoFile) {
            setPhotoPreview("");
            return;
        }
        const url = URL.createObjectURL(photoFile);
        setPhotoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [photoFile]);

    const initials = useMemo(() => {
        const n = draft.fullName?.trim();
        if (!n) return "A";
        return n[0].toUpperCase();
    }, [draft.fullName]);

    const shownPhoto = photoPreview || draft.photoUrl || "";

    const forceLogoutAndGoLogin = () => {
        try {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            localStorage.removeItem("adminUser");
        } catch { }
        router.push("/admin/login");
    };

    // ✅ Profile update API
    const onUpdateDetails = async () => {
        if (detailsLoading) return;

        if (!draft.role.trim()) return toast.error("Please enter Group Name");
        if (!draft.fullName.trim()) return toast.error("Please enter Name");
        if (!draft.email.trim()) return toast.error("Please enter Email");
        if (!draft.phone.trim()) return toast.error("Please enter Phone");

        const token = getToken();
        if (!token) {
            toast.error("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        setDetailsLoading(true);
        const toastId = toast.loading("Updating profile...");

        try {
            let next: Profile = { ...draft };

            // local-only photo save
            if (photoFile) {
                const dataUrl = await fileToDataUrl(photoFile);
                next.photoUrl = dataUrl;
            }

            const payload = {
                group_name: next.role.trim(),
                leader_name: next.fullName.trim(),
                mobile_number: next.phone.trim(),
                email: next.email.trim(),
            };

            const res = await api.post<ApiResponse>("/admin/profile/update", payload, {
                validateStatus: () => true,
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = res.data;
            const message = pickMessage(data);

            if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
                saveProfileToStorage(next);
                setDraft(next);
                setPhotoFile(null);
                toast.success(message || "Profile updated successfully");
                return;
            }

            if (res.status === 401 || res.status === 403) {
                toast.error("Session expired. Please login again.");
                forceLogoutAndGoLogin();
                return;
            }

            toast.error(message);
        } catch (err) {
            toast.error(getApiErrorMessage(err));
        } finally {
            setDetailsLoading(false);
        }
    };

    // ✅ Change password API
    const onChangePassword = async () => {
        if (passLoading) return;

        if (!oldPass.trim()) return toast.error("Enter old password");
        if (!newPass.trim()) return toast.error("Enter new password");
        if (newPass.length < 6) return toast.error("New password must be at least 6 characters");
        if (newPass !== confirmPass) return toast.error("Confirm password does not match");

        const token = getToken();
        if (!token) {
            toast.error("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        setPassLoading(true);
        const toastId = toast.loading("Changing password...");

        try {
            const payload = {
                old_password: oldPass,
                new_password: newPass,
                new_password_confirmation: confirmPass,
            };

            const res = await api.post<ApiResponse>("/admin/change-password", payload, {
                validateStatus: () => true,
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = res.data;
            const message = pickMessage(data);

            if (res.status >= 200 && res.status < 300 && isSuccess(data)) {
                toast.success(message || "Password changed successfully");
                setOldPass("");
                setNewPass("");
                setConfirmPass("");
                return;
            }

            if (res.status === 401 || res.status === 403) {
                toast.error("Session expired. Please login again.");
                forceLogoutAndGoLogin();
                return;
            }

            toast.error(message);
        } catch (err) {
            toast.error(getApiErrorMessage(err));
        } finally {
            setPassLoading(false);
        }
    };

    const showOverlayLoader = detailsLoading || passLoading;

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-4xl px-4 py-8">
                {/* Back button */}
                <div className="mb-4">
                    <Link
                        href="/admin/profile"
                        className="inline-flex text-black  items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                    >
                        <FiArrowLeft className="text-black " />
                        Back to Profile
                    </Link>
                </div>

                {/* Main card */}
                <section className="relative rounded-2xl border border-black/10 bg-white shadow-sm">
                    {/* Optional overlay loader */}
                    {showOverlayLoader ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                            <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm">
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                <span className="text-sm font-semibold text-black">Please wait...</span>
                            </div>
                        </div>
                    ) : null}

                    {/* Tabs */}
                    <div className="px-6 pt-6 sm:px-10 sm:pt-8">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setTab("details")}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === "details"
                                    ? "border border-black/10 bg-white shadow-sm"
                                    : "text-black/60 hover:text-black"
                                    }`}
                            >
                                <FiUser />
                                Personal Details
                            </button>

                            <button
                                type="button"
                                onClick={() => setTab("password")}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === "password"
                                    ? "border border-black/10 bg-white shadow-sm"
                                    : "text-black/60 hover:text-black"
                                    }`}
                            >
                                <FiLock />
                                Change Password
                            </button>
                        </div>

                        <div className="mt-4 h-px w-full bg-black/10" />
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 sm:px-10 sm:pb-10">
                        {tab === "details" ? (
                            <>
                                {/* Avatar row */}
                                <div className="mt-6 flex flex-col items-center text-center">
                                    <div className="relative">
                                        <div className="h-24 w-24 overflow-hidden rounded-full border border-black/10 bg-black/3 flex items-center justify-center">
                                            {shownPhoto ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={shownPhoto} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-bold text-primary">{initials}</span>
                                            )}
                                        </div>

                                        <label
                                            className="absolute -bottom-2 right-0 inline-flex cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white p-2 shadow-sm hover:bg-black/5"
                                            title="Change photo"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={detailsLoading}
                                                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                                            />
                                            <FiCamera className="text-lg" />
                                        </label>
                                    </div>

                                    <p className="mt-3 text-sm text-black/60">{draft.role}</p>
                                </div>

                                {/* Fields */}
                                <div className="mx-auto mt-6 max-w-2xl space-y-5">
                                    <div>
                                        <label className={labelCls}>Group Name</label>
                                        <input
                                            value={draft.role}
                                            disabled={detailsLoading}
                                            onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))}
                                            className={inputCls}
                                            placeholder="Enter group name"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Name</label>
                                        <input
                                            value={draft.fullName}
                                            disabled={detailsLoading}
                                            onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))}
                                            className={inputCls}
                                            placeholder="Enter name"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Email</label>
                                        <input
                                            type="email"
                                            value={draft.email}
                                            disabled={detailsLoading}
                                            onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                                            className={inputCls}
                                            placeholder="Enter email"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Phone Number</label>
                                        <input
                                            value={draft.phone}
                                            disabled={detailsLoading}
                                            onChange={(e) =>
                                                setDraft((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))
                                            }
                                            className={inputCls}
                                            placeholder="Enter phone"
                                            inputMode="numeric"
                                            maxLength={10}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onUpdateDetails}
                                        disabled={detailsLoading}
                                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {detailsLoading ? <Spinner /> : <FiSave className="text-base" />}
                                        {detailsLoading ? "Updating..." : "Update Details"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Change password */}
                                <div className="mx-auto mt-6 max-w-2xl space-y-5">
                                    <div>
                                        <label className={labelCls}>
                                            Old Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={oldPass}
                                            disabled={passLoading}
                                            onChange={(e) => setOldPass(e.target.value)}
                                            className={inputCls}
                                            placeholder="Enter old password"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={newPass}
                                            disabled={passLoading}
                                            onChange={(e) => setNewPass(e.target.value)}
                                            className={inputCls}
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPass}
                                            disabled={passLoading}
                                            onChange={(e) => setConfirmPass(e.target.value)}
                                            className={inputCls}
                                            placeholder="Confirm password"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onChangePassword}
                                        disabled={passLoading}
                                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {passLoading ? <Spinner /> : <FiLock className="text-base" />}
                                        {passLoading ? "Changing..." : "Change Password"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
