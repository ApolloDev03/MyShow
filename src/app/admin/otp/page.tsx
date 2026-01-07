// app/(auth)/user/otp/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function UserOtpPage() {
    const OTP_LEN = 6;
    const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
    const [error, setError] = useState<string>("");
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const router = useRouter();
    const otpValue = useMemo(() => otp.join(""), [otp]);

    const focusIndex = (i: number) => {
        const el = inputsRef.current[i];
        el?.focus();
        el?.select();
    };

    const handleChange = (i: number, v: string) => {
        setError("");
        const digit = v.replace(/\D/g, "").slice(-1); // only last digit
        const next = [...otp];
        next[i] = digit;
        setOtp(next);

        if (digit && i < OTP_LEN - 1) focusIndex(i + 1);
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[i]) {
                const next = [...otp];
                next[i] = "";
                setOtp(next);
            } else if (i > 0) {
                focusIndex(i - 1);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError("");
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
        if (!pasted) return;

        const next = Array(OTP_LEN).fill("");
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setOtp(next);

        const lastIndex = Math.min(pasted.length, OTP_LEN) - 1;
        if (lastIndex >= 0) focusIndex(lastIndex);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (otpValue.length !== OTP_LEN || otp.includes("")) {
            setError(`Please enter ${OTP_LEN}-digit OTP`);
            return;
        }

        // TODO: verify OTP API
        // console.log("OTP:", otpValue);
    };

    return (
        <section className="min-h-screen bg-linear-to-r from-primary to-secondary flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur p-6 shadow-lg">
                {/* Centered Brand */}
                <div className="w-full flex justify-center ">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                            m
                        </span>
                        <span className="text-2xl font-semibold text-primary">myshow</span>
                    </Link>
                </div>

                <h1 className="mt-5 text-xl font-semibold text-center text-black">
                    OTP Verification
                </h1>
                <p className="text-center text-sm mt-1 text-black/70">
                    Enter the {OTP_LEN}-digit code
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="flex justify-center gap-2">
                        {otp.map((val, i) => (
                            <input
                                key={i}
                                ref={(el) => {
                                    inputsRef.current[i] = el;
                                }}
                                value={val}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                onPaste={handlePaste}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                className="h-12 w-12 rounded-xl border border-black/15 bg-white text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-primary"
                            />
                        ))}
                    </div>

                    {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

                    <button
                        type="submit"
                        onClick={() => router.push("/admin/login")}
                        className="w-full rounded-xl bg-primary hover:bg-secondary cursor-pointer px-4 py-3 font-semibold text-white hover:opacity-95 active:opacity-90"
                    >
                        Verify OTP
                    </button>

                    <div className="flex items-center justify-center text-sm">


                        <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => {
                                // TODO: resend OTP API call
                            }}
                        >
                            Resend OTP
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
