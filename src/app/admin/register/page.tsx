"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden">
            <div className="lg:flex lg:h-screen">
                {/* LEFT (Sticky / Not scrolling) */}
                <aside className="relative bg-linear-to-br from-primary to-secondary text-white lg:w-1/2 lg:h-screen lg:sticky lg:top-0">
                    <div className="flex h-full items-center justify-center px-8 py-14">
                        <div className="max-w-md">
                            <Link href="/" className="inline-flex items-center gap-2">
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xl">
                                    m
                                </span>
                                <span className="text-3xl font-bold">myshow</span>
                            </Link>

                            <h2 className="mt-8 text-4xl font-semibold leading-tight">
                                Create your account
                            </h2>
                            <p className="mt-3 text-white/80">
                                Register to start using myshow. Fill in your details on the right.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* RIGHT (Scrollable Form) */}
                <main className="lg:w-1/2 lg:h-screen overflow-y-auto bg-white px-4 py-10">
                    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-lg border border-black/10">
                        <h1 className="text-2xl font-semibold text-center">Register</h1>
                        <p className="text-center text-sm mt-1 text-black/70">
                            Create your account to continue
                        </p>

                        <form className="mt-6 space-y-4">
                            {/* Group Name */}
                            <div className="space-y-1">
                                <label htmlFor="groupname" className="text-sm font-medium">
                                    Group Name
                                </label>
                                <input
                                    id="groupname"
                                    name="groupname"
                                    type="text"
                                    placeholder="Enter group name"
                                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            {/* Name */}
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            {/* Contact */}
                            <div className="space-y-1">
                                <label htmlFor="contact" className="text-sm font-medium">
                                    Contact
                                </label>
                                <input
                                    id="contact"
                                    name="contact"
                                    type="tel"
                                    placeholder="Enter contact number"
                                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                    autoComplete="tel"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label htmlFor="confirmpassword" className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmpassword"
                                    name="confirmpassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={() => router.push("/admin/otp")}
                                className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90"
                            >
                                Create Account
                            </button>

                            <p className="text-center text-sm text-black/70">
                                Already have an account?{" "}
                                <Link href="/admin/login" className="font-semibold text-primary hover:underline">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
