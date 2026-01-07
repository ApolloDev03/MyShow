"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2 } from "react-icons/fi";

type Profile = {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    photoUrl?: string; // base64/dataURL
};

const STORAGE_KEY = "admin_profile_v1";

const labelCls = "text-sm font-medium text-black";
const inputView =
    "mt-2 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-black/80 outline-none";

function loadProfile(): Profile {
    if (typeof window === "undefined") {
        return {
            fullName: "Nisha12345",
            email: "admin@admin.com",
            phone: "7486984607",
            role: "Administrator",
            photoUrl: "",
        };
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return {
            fullName: "Nisha12345",
            email: "admin@admin.com",
            phone: "7486984607",
            role: "Administrator",
            photoUrl: "",
        };
    }

    try {
        return JSON.parse(raw) as Profile;
    } catch {
        return {
            fullName: "Nisha12345",
            email: "admin@admin.com",
            phone: "7486984607",
            role: "Administrator",
            photoUrl: "",
        };
    }
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<Profile>(() => loadProfile());

    useEffect(() => {
        // keep in sync if edit page updates localStorage
        const onStorage = () => setProfile(loadProfile());
        window.addEventListener("storage", onStorage);
        // also refresh on focus (nice for same-tab navigation)
        const onFocus = () => setProfile(loadProfile());
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
                {/* Card */}
                <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="p-6 sm:p-10">
                        {/* Avatar */}
                        <div className="flex flex-col items-center text-center">
                            <div className="h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-black/3 shadow-sm flex items-center justify-center">
                                {profile.photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profile.photoUrl}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-primary">{initials}</span>
                                )}
                            </div>

                            <h1 className="mt-4 text-3xl font-bold">{profile.fullName}</h1>
                            <p className="mt-1 text-sm text-black/60">{profile.role}</p>
                        </div>

                        {/* Fields */}
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
