"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiCamera, FiLock, FiSave, FiUser } from "react-icons/fi";

type TabKey = "details" | "password";

type Profile = {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    photoUrl?: string; // base64/dataURL
};

const STORAGE_KEY = "admin_profile_v1";

const labelCls = "text-sm font-medium text-black";
const inputCls =
    "mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";

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

export default function AdminEditProfilePage() {
    const [tab, setTab] = useState<TabKey>("details");

    // Profile
    const [draft, setDraft] = useState<Profile>(() => loadProfile());
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    // Password form
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

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

    const onUpdateDetails = async () => {
        if (!draft.fullName.trim()) return alert("Please enter Full Name");
        if (!draft.email.trim()) return alert("Please enter Email");
        if (!draft.phone.trim()) return alert("Please enter Phone");

        let next: Profile = { ...draft };

        // If new photo selected => convert to dataURL and save
        if (photoFile) {
            try {
                const dataUrl = await fileToDataUrl(photoFile);
                next.photoUrl = dataUrl;
            } catch {
                return alert("Photo upload failed");
            }
        }

        saveProfileToStorage(next);
        alert("Profile updated (dummy).");
    };

    const onChangePassword = () => {
        if (!oldPass.trim()) return alert("Enter old password");
        if (!newPass.trim()) return alert("Enter new password");
        if (newPass.length < 6) return alert("New password must be at least 6 characters");
        if (newPass !== confirmPass) return alert("Confirm password does not match");

        // Dummy success
        console.log("Password changed:", { oldPass, newPass });
        alert("Password changed (dummy).");

        setOldPass("");
        setNewPass("");
        setConfirmPass("");
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-4xl px-4 py-8">
                {/* Back button */}
                <div className="mb-4">
                    <Link
                        href="/admin/profile"
                        className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                    >
                        <FiArrowLeft className="text-base" />
                        Back to Profile
                    </Link>
                </div>

                {/* Main card */}
                <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
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
                                        <label className={labelCls}>Name</label>
                                        <input
                                            value={draft.fullName}
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
                                            onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                                            className={inputCls}
                                            placeholder="Enter email"
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Phone Number</label>
                                        <input
                                            value={draft.phone}
                                            onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                                            className={inputCls}
                                            placeholder="Enter phone"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onUpdateDetails}
                                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                                    >
                                        <FiSave className="text-base" />
                                        Update Details
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
                                            onChange={(e) => setConfirmPass(e.target.value)}
                                            className={inputCls}
                                            placeholder="Confirm password"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onChangePassword}
                                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                                    >
                                        <FiLock className="text-base" />
                                        Change Password
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
