// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { FiEdit2 } from "react-icons/fi";

// type Profile = {
//     fullName: string;
//     email: string;
//     phone: string;
//     role: string;
//     photoUrl?: string; // base64/dataURL
// };

// const STORAGE_KEY = "admin_profile_v1";

// const labelCls = "text-sm font-medium text-black";
// const inputView =
//     "mt-2 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-black/80 outline-none";

// function loadProfile(): Profile {
//     if (typeof window === "undefined") {
//         return {
//             fullName: "Nisha12345",
//             email: "admin@admin.com",
//             phone: "7486984607",
//             role: "Administrator",
//             photoUrl: "",
//         };
//     }

//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) {
//         return {
//             fullName: "Nisha12345",
//             email: "admin@admin.com",
//             phone: "7486984607",
//             role: "Administrator",
//             photoUrl: "",
//         };
//     }

//     try {
//         return JSON.parse(raw) as Profile;
//     } catch {
//         return {
//             fullName: "Nisha12345",
//             email: "admin@admin.com",
//             phone: "7486984607",
//             role: "Administrator",
//             photoUrl: "",
//         };
//     }
// }

// export default function AdminProfilePage() {
//     const [profile, setProfile] = useState<Profile>(() => loadProfile());

//     useEffect(() => {
//         // keep in sync if edit page updates localStorage
//         const onStorage = () => setProfile(loadProfile());
//         window.addEventListener("storage", onStorage);
//         // also refresh on focus (nice for same-tab navigation)
//         const onFocus = () => setProfile(loadProfile());
//         window.addEventListener("focus", onFocus);

//         return () => {
//             window.removeEventListener("storage", onStorage);
//             window.removeEventListener("focus", onFocus);
//         };
//     }, []);

//     const initials = useMemo(() => {
//         const n = profile.fullName?.trim();
//         if (!n) return "A";
//         return n[0].toUpperCase();
//     }, [profile.fullName]);

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-3xl px-4 py-8">
//                 {/* Card */}
//                 <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
//                     <div className="p-6 sm:p-10">
//                         {/* Avatar */}
//                         <div className="flex flex-col items-center text-center">
//                             <div className="h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-black/3 shadow-sm flex items-center justify-center">
//                                 {profile.photoUrl ? (
//                                     // eslint-disable-next-line @next/next/no-img-element
//                                     <img
//                                         src={profile.photoUrl}
//                                         alt="Profile"
//                                         className="h-full w-full object-cover"
//                                     />
//                                 ) : (
//                                     <span className="text-4xl font-bold text-primary">{initials}</span>
//                                 )}
//                             </div>

//                             <h1 className="mt-4 text-3xl font-bold">{profile.fullName}</h1>
//                             <p className="mt-1 text-sm text-black/60">{profile.role}</p>
//                         </div>

//                         {/* Fields */}
//                         <div className="mx-auto mt-8 max-w-xl space-y-5">
//                             <div>
//                                 <label className={labelCls}>Full Name</label>
//                                 <input value={profile.fullName} className={inputView} disabled />
//                             </div>

//                             <div>
//                                 <label className={labelCls}>Email Address</label>
//                                 <input value={profile.email} className={inputView} disabled />
//                             </div>

//                             <div>
//                                 <label className={labelCls}>Phone Number</label>
//                                 <input value={profile.phone} className={inputView} disabled />
//                             </div>

//                             <div className="pt-3 flex justify-center">
//                                 <Link
//                                     href="/admin/edit-profile"
//                                     className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
//                                 >
//                                     <FiEdit2 className="text-base" />
//                                     Edit Profile
//                                 </Link>
//                             </div>


//                         </div>
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
import { FiEdit2 } from "react-icons/fi";
import { apiUrl } from "@/config"; // keep your path

type ProfileApiResponse = {
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
        mobile_number: string;
        created_at: string;
    };
};

type Profile = {
    fullName: string;
    email: string;
    phone: string;
    role: string; // we will show group_name here
    photoUrl?: string;
    groupId?: number;
    createdAt?: string;
};

const STORAGE_KEY = "admin_profile_v1";

const labelCls = "text-sm font-medium text-black";
const inputView =
    "mt-2 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-black/80 outline-none";

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

function pickMessage(data?: ProfileApiResponse) {
    if (!data) return "";
    return (
        data.message ||
        data.msg ||
        data.error ||
        (data.errors ? Object.values(data.errors).flat().join(", ") : "") ||
        ""
    );
}

function isSuccess(data?: ProfileApiResponse) {
    const s = data?.status ?? data?.success;
    return s === true || s === 1 || s === "1" || s === "true" || s === "success";
}

function getApiErrorMessage(err: unknown) {
    const e = err as AxiosError<ProfileApiResponse>;
    return pickMessage(e.response?.data) || e.message || "Network error. Please try again.";
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

export default function AdminProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile>(() => loadProfile());
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // ✅ Call Profile API
    useEffect(() => {
        const run = async () => {
            setApiError("");

            const token =
                (typeof window !== "undefined" && (localStorage.getItem("adminToken") || localStorage.getItem("token"))) ||
                "";

            if (!token) {
                router.push("/admin/login");
                return;
            }

            setLoading(true);
            try {
                // ✅ send token in header + body (backend may expect either)
                const res = await api.post<ProfileApiResponse>(
                    "/admin/profile",
                    { token }, // some backends want token in body
                    {
                        validateStatus: () => true,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = res.data;
                const message = pickMessage(data);

                if (res.status >= 200 && res.status < 300 && isSuccess(data) && data?.data) {
                    const d = data.data;

                    const next: Profile = {
                        fullName: d.leader_name || "",
                        email: d.email || "",
                        phone: d.mobile_number || "",
                        role: d.group_name || "",
                        photoUrl: profile.photoUrl || "",
                        groupId: d.group_id,
                        createdAt: d.created_at,
                    };

                    setProfile(next);

                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                    } catch { }

                    return;
                }

                // if token invalid -> logout local and redirect
                if (res.status === 401 || res.status === 403) {
                    try {
                        localStorage.removeItem("adminToken");
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        localStorage.removeItem("user");
                        localStorage.removeItem("adminUser");
                    } catch { }
                    router.push("/admin/login");
                    return;
                }

                setApiError(message || `Failed to load profile (${res.status}).`);
            } catch (err) {
                setApiError(getApiErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // keep in sync if edit page updates localStorage
    useEffect(() => {
        const onStorage = () => setProfile(loadProfile());
        const onFocus = () => setProfile(loadProfile());

        window.addEventListener("storage", onStorage);
        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    const initials = useMemo(() => {
        const n = profile.fullName?.trim();
        if (!n) return "A";
        return n[0].toUpperCase();
    }, [profile.fullName]);

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-3xl px-4 py-8">
                <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="p-6 sm:p-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-black/3 shadow-sm flex items-center justify-center">
                                {profile.photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-primary">{initials}</span>
                                )}
                            </div>

                            <h1 className="mt-4 text-3xl font-bold">{profile.fullName}</h1>

                            {loading ? <p className="mt-2 text-sm text-black/50">Loading profile...</p> : null}
                            {apiError ? <p className="mt-2 text-sm text-red-600">{apiError}</p> : null}
                        </div>

                        <div className="mx-auto mt-8 max-w-xl space-y-5">
                            <div>
                                <label className={labelCls}>Full Name</label>
                                <input value={profile.fullName} className={inputView} disabled />
                            </div>

                            <div>
                                <label className={labelCls}>Email Address</label>
                                <input value={profile.email} className={inputView} disabled />
                            </div>

                            <div>
                                <label className={labelCls}>Phone Number</label>
                                <input value={profile.phone} className={inputView} disabled />
                            </div>

                            <div className="pt-3 flex justify-center">
                                <Link
                                    href="/admin/edit-profile"
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
                                >
                                    <FiEdit2 className="text-base" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
