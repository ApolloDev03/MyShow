// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useMemo, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import {
//   FiChevronDown,
//   FiMenu,
//   FiX,
//   FiUser,
//   FiLogOut,
//   FiCalendar,
//   FiUsers,
//   FiMapPin,
//   FiFileText,
//   FiStar,
// } from "react-icons/fi";

// type MasterItem = { label: string; href: string; icon?: ReactNode };

// export default function SuperAdminHeader() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [masterOpen, setMasterOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const masterRef = useRef<HTMLDivElement | null>(null);
//   const profileRef = useRef<HTMLDivElement | null>(null);

//   const masterItems: MasterItem[] = useMemo(
//     () => [
//       { label: "City Master", href: "/superadmin/city", icon: <FiMapPin /> },
//       { label: "Blog Master", href: "/superadmin/blog", icon: <FiFileText /> },
//       { label: "Testimonial Master", href: "/superadmin/testimonial", icon: <FiStar /> },
//     ],
//     []
//   );

//   useEffect(() => {
//     const onClick = (e: MouseEvent) => {
//       const t = e.target as Node;
//       if (masterRef.current && !masterRef.current.contains(t)) setMasterOpen(false);
//       if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
//     };

//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setMasterOpen(false);
//         setProfileOpen(false);
//         setMobileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", onClick);
//     document.addEventListener("keydown", onEsc);
//     return () => {
//       document.removeEventListener("mousedown", onClick);
//       document.removeEventListener("keydown", onEsc);
//     };
//   }, []);

//   const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

//   const linkCls = (active: boolean) =>
//     [
//       "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
//       active ? "bg-primary/10 text-primary" : "text-black/70 hover:bg-black/5 hover:text-black",
//     ].join(" ");

//   const logout = () => {
//     try {
//       localStorage.removeItem("token");
//       localStorage.removeItem("adminToken");
//       localStorage.removeItem("user");
//     } catch { }
//     router.push("/admin/logout");
//   };

//   return (
//     <header className="sticky top-0 z-50 border-b border-black/10 bg-white/85 backdrop-blur">
//       <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
//         {/* Left: Brand + Desktop Nav */}
//         <div className="flex items-center gap-3">
//           {/* Mobile hamburger */}
//           <button
//             type="button"
//             className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white hover:bg-black/5 lg:hidden"
//             onClick={() => setMobileOpen((s) => !s)}
//             aria-label="Toggle menu"
//             title="Menu"
//           >
//             {mobileOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
//           </button>

//           {/* Brand */}
//           <Link href="/superadmin/dashboard" className="flex items-center gap-2">
//             <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">
//               m
//             </span>
//             <span className="text-xl font-semibold text-primary">myshow</span>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="ml-2 hidden items-center gap-1 lg:flex">
//             <Link href="/superadmin/events" className={linkCls(isActive("/superadmin/events"))}>
//               <FiCalendar />
//               Events
//             </Link>

//             <Link href="/superadmin/groups" className={linkCls(isActive("/superadmin/groups"))}>
//               <FiUsers />
//               Groups
//             </Link>

//             {/* Master dropdown */}
//             <div className="relative" ref={masterRef}>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setMasterOpen((s) => !s);
//                   setProfileOpen(false);
//                 }}
//                 className={linkCls(isActive("/admin/master"))}
//                 aria-haspopup="menu"
//                 aria-expanded={masterOpen}
//               >
//                 Master
//                 <FiChevronDown className={`transition ${masterOpen ? "rotate-180" : ""}`} />
//               </button>

//               {masterOpen ? (
//                 <div
//                   role="menu"
//                   className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
//                 >
//                   <div className="px-3 py-2 text-xs font-semibold text-black/50">Masters</div>
//                   <div className="h-px bg-black/10" />

//                   <div className="p-2">
//                     {masterItems.map((it) => (
//                       <Link
//                         key={it.href}
//                         href={it.href}
//                         onClick={() => setMasterOpen(false)}
//                         className={[
//                           "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
//                           isActive(it.href)
//                             ? "bg-primary/10 text-primary"
//                             : "text-black/70 hover:bg-black/5 hover:text-black",
//                         ].join(" ")}
//                       >
//                         <span className="text-base">{it.icon}</span>
//                         {it.label}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </nav>
//         </div>

//         {/* Right: Profile dropdown */}
//         <div className="relative" ref={profileRef}>
//           <button
//             type="button"
//             onClick={() => {
//               setProfileOpen((s) => !s);
//               setMasterOpen(false);
//             }}
//             className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-black/5"
//             aria-haspopup="menu"
//             aria-expanded={profileOpen}
//           >
//             <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
//               A
//             </span>
//             <span className="hidden sm:block">Admin</span>
//             <FiChevronDown className={`transition ${profileOpen ? "rotate-180" : ""}`} />
//           </button>

//           {profileOpen ? (
//             <div
//               role="menu"
//               className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
//             >
//               <div className="px-3 py-2 text-xs font-semibold text-black/50">Account</div>
//               <div className="h-px bg-black/10" />

//               <div className="p-2">
//                 <Link
//                   href="/superadmin/profile"
//                   onClick={() => setProfileOpen(false)}
//                   className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-black/70 hover:bg-black/5 hover:text-black"
//                 >
//                   <FiUser className="text-base" />
//                   Profile
//                 </Link>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setProfileOpen(false);
//                     logout();
//                     router.push("/superadmin/logout");
//                   }}
//                   className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
//                 >
//                   <FiLogOut className="text-base" />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           ) : null}
//         </div>
//       </div>

//       {/* Mobile panel */}
//       {mobileOpen ? (
//         <div className="border-t border-black/10 bg-white/90 backdrop-blur lg:hidden">
//           <div className="mx-auto w-full max-w-7xl px-4 py-3">
//             <div className="flex flex-col gap-1">
//               <Link
//                 href="/admin/events"
//                 onClick={() => setMobileOpen(false)}
//                 className={linkCls(isActive("/admin/events"))}
//               >
//                 <FiCalendar />
//                 Events
//               </Link>

//               <Link
//                 href="/admin/group-members"
//                 onClick={() => setMobileOpen(false)}
//                 className={linkCls(isActive("/admin/group-members"))}
//               >
//                 <FiUsers />
//                 Groups
//               </Link>

//               <button
//                 type="button"
//                 onClick={() => setMasterOpen((s) => !s)}
//                 className={linkCls(isActive("/admin/master"))}
//               >
//                 Master
//                 <FiChevronDown className={`ml-auto transition ${masterOpen ? "rotate-180" : ""}`} />
//               </button>

//               {masterOpen ? (
//                 <div className="ml-2 grid gap-1 rounded-2xl border border-black/10 bg-white p-2">
//                   {masterItems.map((it) => (
//                     <Link
//                       key={it.href}
//                       href={it.href}
//                       onClick={() => {
//                         setMobileOpen(false);
//                         setMasterOpen(false);
//                       }}
//                       className={[
//                         "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
//                         isActive(it.href)
//                           ? "bg-primary/10 text-primary"
//                           : "text-black/70 hover:bg-black/5 hover:text-black",
//                       ].join(" ")}
//                     >
//                       <span className="text-base">{it.icon}</span>
//                       {it.label}
//                     </Link>
//                   ))}
//                 </div>
//               ) : null}

//               <Link
//                 href="/superadmin/profile"
//                 onClick={() => setMobileOpen(false)}
//                 className={linkCls(isActive("/superadmin/profile"))}
//               >
//                 <FiUser />
//                 Profile
//               </Link>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setMobileOpen(false);
//                   logout();
//                 }}
//                 className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
//               >
//                 <FiLogOut />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import {
  FiChevronDown,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiFileText,
  FiStar,
} from "react-icons/fi";

type MasterItem = { label: string; href: string; icon?: ReactNode };

type LogoutResponse = {
  status?: string | boolean | number;
  message?: string;
  data?: any;
};

const API_BASE = "https://getdemo.in/My_show/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function isSuccess(data?: LogoutResponse) {
  const s = data?.status;
  return s === "success" || s === true || s === 1 || s === "1" || s === "true";
}

function getToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("superadminToken") || // ✅ your superadmin token key
    localStorage.getItem("token") || // fallback if you used this somewhere
    ""
  );
}

function clearAuthStorage() {
  try {
    localStorage.removeItem("superadminToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");

    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("superadminUser");
  } catch { }
}

export default function SuperAdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [masterOpen, setMasterOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const masterRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const masterItems: MasterItem[] = useMemo(
    () => [
      { label: "City Master", href: "/superadmin/city", icon: <FiMapPin /> },
      { label: "Blog Master", href: "/superadmin/blog", icon: <FiFileText /> },
      { label: "Testimonial Master", href: "/superadmin/testimonial", icon: <FiStar /> },
    ],
    []
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (masterRef.current && !masterRef.current.contains(t)) setMasterOpen(false);
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMasterOpen(false);
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

  const logout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);
    setProfileOpen(false);
    setMasterOpen(false);
    setMobileOpen(false);

    const token = getToken();

    router.replace("/superadmin/logout"); // or "/superadmin/login"

    try {
      await api.post(
        "/v1/logout",
        {}, // ✅ body
        {
          validateStatus: () => true,
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
              token, // optional if your backend reads this
            }
            : undefined,
        }
      );
    } catch {
      // ignore
    } finally {
      clearAuthStorage();
      setLogoutLoading(false);

      // ✅ after clearing, go to login
      router.replace("/superadmin/logout");
    }
  };


  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        {/* Left: Brand + Desktop Nav */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white hover:bg-black/5 lg:hidden"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
            title="Menu"
          >
            {mobileOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
          </button>

          {/* Brand */}
          <Link href="/superadmin/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">
              m
            </span>
            <span className="text-xl font-semibold text-primary">myshow</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            <Link href="/superadmin/events" className={linkCls(isActive("/superadmin/events"))}>
              <FiCalendar />
              Events
            </Link>

            <Link href="/superadmin/groups" className={linkCls(isActive("/superadmin/groups"))}>
              <FiUsers />
              Groups
            </Link>

            {/* Master dropdown */}
            <div className="relative" ref={masterRef}>
              <button
                type="button"
                onClick={() => {
                  setMasterOpen((s) => !s);
                  setProfileOpen(false);
                }}
                className={linkCls(isActive("/superadmin"))}
                aria-haspopup="menu"
                aria-expanded={masterOpen}
              >
                Master
                <FiChevronDown className={`transition ${masterOpen ? "rotate-180" : ""}`} />
              </button>

              {masterOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
                >
                  <div className="px-3 py-2 text-xs font-semibold text-black/50">Masters</div>
                  <div className="h-px bg-black/10" />

                  <div className="p-2">
                    {masterItems.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={() => setMasterOpen(false)}
                        className={[
                          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                          isActive(it.href)
                            ? "bg-primary/10 text-primary"
                            : "text-black/70 hover:bg-black/5 hover:text-black",
                        ].join(" ")}
                      >
                        <span className="text-base">{it.icon}</span>
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>
        </div>

        {/* Right: Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((s) => !s);
              setMasterOpen(false);
            }}
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
                  href="/superadmin/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-black/70 hover:bg-black/5 hover:text-black"
                >
                  <FiUser className="text-base" />
                  Profile
                </Link>

                <button
                  type="button"
                  disabled={logoutLoading}
                  onClick={logout}
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

      {/* Mobile panel */}
      {mobileOpen ? (
        <div className="border-t border-black/10 bg-white/90 backdrop-blur lg:hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-3">
            <div className="flex flex-col gap-1">
              <Link
                href="/superadmin/events"
                onClick={() => setMobileOpen(false)}
                className={linkCls(isActive("/superadmin/events"))}
              >
                <FiCalendar />
                Events
              </Link>

              <Link
                href="/superadmin/groups"
                onClick={() => setMobileOpen(false)}
                className={linkCls(isActive("/superadmin/groups"))}
              >
                <FiUsers />
                Groups
              </Link>

              <button
                type="button"
                onClick={() => setMasterOpen((s) => !s)}
                className={linkCls(isActive("/superadmin"))}
              >
                Master
                <FiChevronDown className={`ml-auto transition ${masterOpen ? "rotate-180" : ""}`} />
              </button>

              {masterOpen ? (
                <div className="ml-2 grid gap-1 rounded-2xl border border-black/10 bg-white p-2">
                  {masterItems.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => {
                        setMobileOpen(false);
                        setMasterOpen(false);
                      }}
                      className={[
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                        isActive(it.href)
                          ? "bg-primary/10 text-primary"
                          : "text-black/70 hover:bg-black/5 hover:text-black",
                      ].join(" ")}
                    >
                      <span className="text-base">{it.icon}</span>
                      {it.label}
                    </Link>
                  ))}
                </div>
              ) : null}

              <Link
                href="/superadmin/profile"
                onClick={() => setMobileOpen(false)}
                className={linkCls(isActive("/superadmin/profile"))}
              >
                <FiUser />
                Profile
              </Link>

              <button
                type="button"
                disabled={logoutLoading}
                onClick={logout}
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
