// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import {
//     FiChevronDown,
//     FiMenu,
//     FiX,
//     FiUser,
//     FiLogOut,
//     FiCalendar,
//     FiUsers,
// } from "react-icons/fi";

// export default function AdminHeader() {
//     const pathname = usePathname();
//     const router = useRouter();

//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [profileOpen, setProfileOpen] = useState(false);

//     const profileRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const onClick = (e: MouseEvent) => {
//             const t = e.target as Node;
//             if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
//         };

//         const onEsc = (e: KeyboardEvent) => {
//             if (e.key === "Escape") {
//                 setProfileOpen(false);
//                 setMobileOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", onClick);
//         document.addEventListener("keydown", onEsc);
//         return () => {
//             document.removeEventListener("mousedown", onClick);
//             document.removeEventListener("keydown", onEsc);
//         };
//     }, []);

//     const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

//     const linkCls = (active: boolean) =>
//         [
//             "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
//             active ? "bg-primary/10 text-primary" : "text-black/70 hover:bg-black/5 hover:text-black",
//         ].join(" ");

//     const logout = () => {
//         try {
//             localStorage.removeItem("token");
//             localStorage.removeItem("adminToken");
//             localStorage.removeItem("user");
//         } catch { }
//         setProfileOpen(false);
//         setMobileOpen(false);
//         router.push("/admin/logout");
//     };

//     return (
//         <header className="sticky top-0 z-50 border-b border-black/10 bg-white/85 backdrop-blur">
//             <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
//                 {/* Left: Brand + Desktop Nav */}
//                 <div className="flex items-center gap-3">
//                     {/* Mobile hamburger */}
//                     <button
//                         type="button"
//                         className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white hover:bg-black/5 lg:hidden"
//                         onClick={() => {
//                             setMobileOpen((s) => !s);
//                             setProfileOpen(false);
//                         }}
//                         aria-label="Toggle menu"
//                         title="Menu"
//                     >
//                         {mobileOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
//                     </button>

//                     {/* Brand */}
//                     <Link href="/admin/dashboard" className="flex items-center gap-2">
//                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">
//                             m
//                         </span>
//                         <span className="text-xl font-semibold text-primary">myshow</span>
//                     </Link>

//                     {/* Desktop Nav */}
//                     <nav className="ml-2 hidden items-center gap-1 lg:flex">
//                         <Link href="/admin/events" className={linkCls(isActive("/admin/events"))}>
//                             <FiCalendar />
//                             Events
//                         </Link>

//                         <Link
//                             href="/admin/group-members"
//                             className={linkCls(isActive("/admin/group-members"))}
//                         >
//                             <FiUsers />
//                             Group Members
//                         </Link>
//                     </nav>
//                 </div>

//                 {/* Right: Welcome + Profile dropdown */}
//                 <div className="flex items-center gap-3">
//                     <span className="hidden sm:block text-sm font-semibold text-primary">
//                         Welcome Admin
//                     </span>

//                     <div className="relative" ref={profileRef}>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setProfileOpen((s) => !s);
//                             }}
//                             className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-black/5"
//                             aria-haspopup="menu"
//                             aria-expanded={profileOpen}
//                         >
//                             <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
//                                 A
//                             </span>
//                             <span className="hidden sm:block">Admin</span>
//                             <FiChevronDown className={`transition ${profileOpen ? "rotate-180" : ""}`} />
//                         </button>

//                         {profileOpen ? (
//                             <div
//                                 role="menu"
//                                 className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
//                             >
//                                 <div className="px-3 py-2 text-xs font-semibold text-black/50">Account</div>
//                                 <div className="h-px bg-black/10" />

//                                 <div className="p-2">
//                                     <Link
//                                         href="/admin/profile"
//                                         onClick={() => setProfileOpen(false)}
//                                         className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-black/70 hover:bg-black/5 hover:text-black"
//                                     >
//                                         <FiUser className="text-base" />
//                                         Profile
//                                     </Link>

//                                     <button
//                                         type="button"
//                                         onClick={logout}
//                                         className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
//                                     >
//                                         <FiLogOut className="text-base" />
//                                         Logout
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : null}
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile panel (same behavior like SuperAdminHeader) */}
//             {mobileOpen ? (
//                 <div className="border-t border-black/10 bg-white/90 backdrop-blur lg:hidden">
//                     <div className="mx-auto w-full max-w-7xl px-4 py-3">
//                         <div className="flex flex-col gap-1">
//                             <Link
//                                 href="/admin/events"
//                                 onClick={() => setMobileOpen(false)}
//                                 className={linkCls(isActive("/admin/events"))}
//                             >
//                                 <FiCalendar />
//                                 Events
//                             </Link>

//                             <Link
//                                 href="/admin/group-members"
//                                 onClick={() => setMobileOpen(false)}
//                                 className={linkCls(isActive("/admin/group-members"))}
//                             >
//                                 <FiUsers />
//                                 Group Members
//                             </Link>

//                             <Link
//                                 href="/admin/profile"
//                                 onClick={() => setMobileOpen(false)}
//                                 className={linkCls(isActive("/admin/profile"))}
//                             >
//                                 <FiUser />
//                                 Profile
//                             </Link>

//                             <button
//                                 type="button"
//                                 onClick={logout}
//                                 className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
//                             >
//                                 <FiLogOut />
//                                 Logout
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             ) : null}
//         </header>
//     );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    FiChevronDown,
    FiMenu,
    FiX,
    FiUser,
    FiLogOut,
    FiCalendar,
    FiUsers,
} from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";
import { apiUrl } from "@/config";

// ✅ axios instance
const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const profileRef = useRef<HTMLDivElement | null>(null);

    const auth = useAuth(); // ✅ use AuthProvider (token + logout)

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const t = e.target as Node;
            if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
        };

        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setProfileOpen(false);
                setMobileOpen(false);
            }
        };

        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

    const linkCls = (active: boolean) =>
        [
            "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
            active ? "bg-primary/10 text-primary" : "text-black/70 hover:bg-black/5 hover:text-black",
        ].join(" ");

    // ✅ Logout API call + clear storage + redirect
    const logout = async () => {
        if (logoutLoading) return;

        setLogoutLoading(true);
        setProfileOpen(false);
        setMobileOpen(false);

        // token from AuthProvider or fallback from storage
        const token =
            auth.token ||
            (typeof window !== "undefined"
                ? localStorage.getItem("adminToken") || localStorage.getItem("token")
                : null);

        try {
            // ✅ call backend logout
            await api.post(
                "/admin/logout",
                {},
                {
                    validateStatus: () => true,
                    headers: token
                        ? {
                            Authorization: `Bearer ${token}`, // ✅ most common
                        }
                        : undefined,
                }
            );
            router.push("/admin/logout");
        } catch {
            // even if API fails, we still logout locally
        } finally {
            // ✅ clear local session using AuthProvider
            auth.logout();

            // ✅ if you still have any legacy keys anywhere
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("adminToken");
                localStorage.removeItem("user");
                localStorage.removeItem("adminUser");
                localStorage.removeItem("role");
            } catch { }

            setLogoutLoading(false);
            router.push("/admin/logout");
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white hover:bg-black/5 lg:hidden"
                        onClick={() => {
                            setMobileOpen((s) => !s);
                            setProfileOpen(false);
                        }}
                        aria-label="Toggle menu"
                        title="Menu"
                    >
                        {mobileOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
                    </button>

                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">
                            m
                        </span>
                        <span className="text-xl font-semibold text-primary">myshow</span>
                    </Link>

                    <nav className="ml-2 hidden items-center gap-1 lg:flex">
                        <Link href="/admin/events" className={linkCls(isActive("/admin/events"))}>
                            <FiCalendar />
                            Events
                        </Link>

                        <Link href="/admin/group-members" className={linkCls(isActive("/admin/group-members"))}>
                            <FiUsers />
                            Group Members
                        </Link>
                    </nav>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <span className="hidden sm:block text-sm font-semibold text-primary">Welcome Admin</span>

                    <div className="relative" ref={profileRef}>
                        <button
                            type="button"
                            onClick={() => setProfileOpen((s) => !s)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-black/5"
                            aria-haspopup="menu"
                            aria-expanded={profileOpen}
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                A
                            </span>
                            <span className="hidden sm:block">Admin</span>
                            <FiChevronDown className={`transition ${profileOpen ? "rotate-180" : ""}`} />
                        </button>

                        {profileOpen ? (
                            <div
                                role="menu"
                                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
                            >
                                <div className="px-3 py-2 text-xs font-semibold text-black/50">Account</div>
                                <div className="h-px bg-black/10" />

                                <div className="p-2">
                                    <Link
                                        href="/admin/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-black/70 hover:bg-black/5 hover:text-black"
                                    >
                                        <FiUser className="text-base" />
                                        Profile
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={logout}
                                        disabled={logoutLoading}
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <FiLogOut className="text-base" />
                                        {logoutLoading ? "Logging out..." : "Logout"}
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Mobile panel */}
            {mobileOpen ? (
                <div className="border-t border-black/10 bg-white/90 backdrop-blur lg:hidden">
                    <div className="mx-auto w-full max-w-7xl px-4 py-3">
                        <div className="flex flex-col gap-1">
                            <Link
                                href="/admin/events"
                                onClick={() => setMobileOpen(false)}
                                className={linkCls(isActive("/admin/events"))}
                            >
                                <FiCalendar />
                                Events
                            </Link>

                            <Link
                                href="/admin/group-members"
                                onClick={() => setMobileOpen(false)}
                                className={linkCls(isActive("/admin/group-members"))}
                            >
                                <FiUsers />
                                Group Members
                            </Link>

                            <Link
                                href="/admin/profile"
                                onClick={() => setMobileOpen(false)}
                                className={linkCls(isActive("/admin/profile"))}
                            >
                                <FiUser />
                                Profile
                            </Link>

                            <button
                                type="button"
                                onClick={logout}
                                disabled={logoutLoading}
                                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <FiLogOut />
                                {logoutLoading ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </header>
    );
}

