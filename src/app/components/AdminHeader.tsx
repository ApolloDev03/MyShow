"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    // ref should be on the WRAPPER div
    const menuRef = useRef<HTMLDivElement | null>(null);

    const nav = [
        { name: "Events", href: "/admin/events" },
        { name: "Group Members", href: "/admin/group-members" },
    ];

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    const logout = () => {
        router.push("/admin/logout");
        localStorage.removeItem("token");
        setOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4">
                {/* LEFT LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                        m
                    </span>
                    <span className="text-2xl font-semibold text-primary">myshow</span>
                </Link>

                {/* RIGHT: MENU + ADMIN */}
                <div className="flex items-center gap-3">
                    {/* MENU (desktop) */}
                    <nav className="hidden md:flex items-center gap-2">
                        {nav.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "rounded-xl px-3 py-2 transitio font-semibold",
                                        active
                                            ? " text-primary"
                                            : "text-black/70  h",
                                    ].join(" ")}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <span className="text-lg font-semibold text-primary">Welcome Admin</span>
                    {/* ADMIN DROPDOWN (ref on wrapper) */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
                            aria-expanded={open}
                            aria-label="Open profile menu"
                        >
                            {/* User icon */}
                            <svg
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2-8 4.5V21h16v-2.5c0-2.5-3.58-4.5-8-4.5Z" />
                            </svg>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
                                <Link
                                    href="/admin/profile"
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-3 text-sm text-black/80 hover:bg-black/5"
                                >
                                    Profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU ROW */}
            <div className="md:hidden border-t border-black/10 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-2 flex gap-2">
                    {nav.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "flex-1 text-center rounded-xl px-3 py-2 text-sm font-medium transition",
                                    active
                                        ? "bg-primary text-white"
                                        : "text-black/70 bg-black/5 hover:text-black",
                                ].join(" ")}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
