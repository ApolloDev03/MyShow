"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FiEdit2, FiUser } from "react-icons/fi";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  photoUrl?: string;
};

const labelCls = "text-sm font-medium text-black";
const inputCls =
  "mt-2 w-full rounded-xl border border-black/15 bg-black/[0.02] px-4 py-3 text-black/80 outline-none";

export default function SuperAdminProfilePage() {
  // ✅ Dummy data (API later)
  const profile: Profile = {
    fullName: "Nisha12345",
    email: "admin@admin.com",
    phone: "7486984607",
    role: "Administrator",
    photoUrl: "",
  };

  const initials = useMemo(() => {
    const n = profile.fullName?.trim();
    if (!n) return "A";
    return n[0].toUpperCase();
  }, [profile.fullName]);

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-black">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <section className="mx-auto w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="p-6 sm:p-10">
            {/* Top avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-black/3 flex items-center justify-center">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FiUser className="text-3xl" />
                    </div>
                  </div>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-bold">{profile.fullName}</h1>
            </div>

            {/* Fields */}
            <div className="mx-auto mt-8 max-w-xl space-y-5">
              <div>
                <label className={labelCls}>Full Name</label>
                <input value={profile.fullName} className={inputCls} disabled />
              </div>

              <div>
                <label className={labelCls}>Email Address</label>
                <input value={profile.email} className={inputCls} disabled />
              </div>

              <div>
                <label className={labelCls}>Phone Number</label>
                <input value={profile.phone} className={inputCls} disabled />
              </div>

              <div className="pt-4 flex justify-center">
                <Link
                  href="/superadmin/edit-profile"
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
