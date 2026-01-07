"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiUser,
  FiLock,
  FiSave,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
};

const labelCls = "text-sm font-medium text-black";
const inputCls =
  "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";

export default function SuperAdminEditProfilePage() {
  const router = useRouter();

  const [tab, setTab] = useState<"details" | "password">("details");

  // ✅ Dummy data (API later)
  const [profile, setProfile] = useState<Profile>({
    fullName: "Nisha12345",
    email: "admin@admin.com",
    phone: "7486984607",
  });

  // Password fields
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canSaveDetails = useMemo(() => {
    return !!profile.fullName.trim() && !!profile.email.trim() && !!profile.phone.trim();
  }, [profile]);

  const canChangePassword = useMemo(() => {
    return !!oldPass && !!newPass && !!confirmPass && newPass === confirmPass;
  }, [oldPass, newPass, confirmPass]);

  const saveDetails = () => {
    if (!canSaveDetails) return alert("Please fill all fields");
    console.log("Update Details:", profile);
    alert("Details updated (dummy)");
    router.push("/superadmin/profile");
  };

  const changePassword = () => {
    if (!canChangePassword) return alert("Check password fields");
    console.log("Change Password:", { oldPass, newPass });
    alert("Password changed (dummy)");
    router.push("/superadmin/profile");
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-black">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.push("/superadmin/profile")}
          className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-black/5"
        >
          <FiArrowLeft className="text-lg" />
          Back to Profile
        </button>

        {/* Card */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          {/* Tabs header */}
          <div className="flex items-center gap-3 border-b border-black/10 px-5 py-4">
            <button
              type="button"
              onClick={() => setTab("details")}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
                tab === "details"
                  ? "border border-black/20 bg-white text-primary shadow-sm"
                  : "text-black/60 hover:bg-black/5",
              ].join(" ")}
            >
              <FiUser />
              Personal Details
            </button>

            <button
              type="button"
              onClick={() => setTab("password")}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
                tab === "password"
                  ? "border border-black/20 bg-white text-primary shadow-sm"
                  : "text-black/60 hover:bg-black/5",
              ].join(" ")}
            >
              <FiLock />
              Change Password
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-6">
            {tab === "details" ? (
              <div className="mx-auto max-w-2xl space-y-5">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    value={profile.fullName}
                    onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter phone"
                  />
                </div>

                <button
                  type="button"
                  onClick={saveDetails}
                  disabled={!canSaveDetails}
                  className="mt-3 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <FiSave />
                    Update Details
                  </span>
                </button>
              </div>
            ) : (
              <div className="mx-auto max-w-2xl space-y-5">
                {/* Old */}
                <div>
                  <label className={labelCls}>
                    Old Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      className={`${inputCls} pr-12`}
                      placeholder="Enter old password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                      aria-label="Toggle old password"
                    >
                      {showOld ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* New */}
                <div>
                  <label className={labelCls}>
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className={`${inputCls} pr-12`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                      aria-label="Toggle new password"
                    >
                      {showNew ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label className={labelCls}>
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className={`${inputCls} pr-12`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                      aria-label="Toggle confirm password"
                    >
                      {showConfirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  {confirmPass && newPass !== confirmPass ? (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      Password does not match.
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={changePassword}
                  disabled={!canChangePassword}
                  className="mt-3 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
