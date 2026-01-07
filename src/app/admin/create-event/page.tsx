"use client";

import { useEffect, useMemo, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

type PaymentType = "free" | "paid";
type PaidMode = "online" | "offline";

const inputCls =
    "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";
const helperCls = "text-xs text-black/60";

export default function CreateEventPage() {
    // Banner (single)
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");

    // Show images (multiple)
    const [showFiles, setShowFiles] = useState<File[]>([]);
    const [showPreviews, setShowPreviews] = useState<string[]>([]);

    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");

    // Venue name removed ✅
    const [address, setAddress] = useState("");
    const [stateName, setStateName] = useState("");
    const [city, setCity] = useState("");

    const [paymentType, setPaymentType] = useState<PaymentType>("free");

    // Paid fields
    const [ticketPrice, setTicketPrice] = useState<string>("");
    const [ticketCount, setTicketCount] = useState<string>("");
    const [ticketInfo, setTicketInfo] = useState("");
    const [paidMode, setPaidMode] = useState<PaidMode>("online");
    const [onlineInfo, setOnlineInfo] = useState("");
    const [offlineInfo, setOfflineInfo] = useState("");

    const [error, setError] = useState("");

    // Banner preview
    useEffect(() => {
        if (!bannerFile) {
            setBannerPreview("");
            return;
        }
        const url = URL.createObjectURL(bannerFile);
        setBannerPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [bannerFile]);

    // Show images previews
    useEffect(() => {
        // cleanup old urls
        showPreviews.forEach((u) => URL.revokeObjectURL(u));

        const urls = showFiles.map((f) => URL.createObjectURL(f));
        setShowPreviews(urls);

        return () => {
            urls.forEach((u) => URL.revokeObjectURL(u));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFiles]);

    // Reset paid fields when switching to free
    useEffect(() => {
        if (paymentType === "free") {
            setTicketPrice("");
            setTicketCount("");
            setTicketInfo("");
            setOnlineInfo("");
            setOfflineInfo("");
            setPaidMode("online");
        }
    }, [paymentType]);

    const isPaid = paymentType === "paid";

    const requiredOk = useMemo(() => {
        if (!title || !startDate || !time || !description) return false;
        if (!address || !stateName || !city) return false;

        if (isPaid) {
            if (!ticketPrice) return false;
            if (paidMode === "online" && !onlineInfo) return false;
            if (paidMode === "offline" && !offlineInfo) return false;
        }
        return true;
    }, [
        title,
        startDate,
        time,
        description,
        address,
        stateName,
        city,
        isPaid,
        ticketPrice,
        paidMode,
        onlineInfo,
        offlineInfo,
    ]);

    const onSelectShowImages = (files: FileList | null) => {
        if (!files) return;
        const incoming = Array.from(files);
        const onlyImages = incoming.filter((f) => f.type.startsWith("image/"));
        setShowFiles((prev) => [...prev, ...onlyImages]);
    };

    const removeShowImage = (index: number) => {
        setShowFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const clearShowImages = () => setShowFiles([]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!requiredOk) {
            setError("Please fill all required fields.");
            return;
        }

        const formData = new FormData();

        if (bannerFile) formData.append("bannerImage", bannerFile);
        showFiles.forEach((f) => formData.append("showImages", f));

        formData.append("title", title);
        formData.append("startDate", startDate);
        formData.append("time", time);
        formData.append("description", description);

        formData.append("address", address);
        formData.append("state", stateName);
        formData.append("city", city);

        formData.append("paymentType", paymentType);

        if (isPaid) {
            formData.append("ticketPrice", ticketPrice);
            formData.append("ticketCount", ticketCount);
            formData.append("ticketInfo", ticketInfo);
            formData.append("paidMode", paidMode);
            formData.append("onlineInfo", onlineInfo);
            formData.append("offlineInfo", offlineInfo);
        }

        console.log("Create Event Submit:", Object.fromEntries(formData.entries()));
        alert("Dummy submit done (check console).");
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header (dashboard style) */}
                <div className="flex items-center justify-between  gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
                        <p className="text-sm text-black/60">Fill details and publish your show.</p>
                    </div>
                    <div className="">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex p-3 gap-1 items-center justify-center rounded-xl border border-black/10 bg-white text-black hover:bg-black/5"
                            aria-label="Go back"
                            title="Back"
                        >
                            <IoArrowBack className="text-xl" /> Back
                        </button>
                    </div>

                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    {/* Row 1: Images + Basic Details */}
                    <section className="grid gap-6 lg:grid-cols-12">
                        {/* Images card */}
                        <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-semibold">Images</h2>
                            <p className="mt-1 text-sm text-black/60">Add banner and show gallery.</p>

                            {/* Banner */}
                            <div className="mt-5">
                                <p className={labelCls}>Banner Image</p>

                                <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                                        className="hidden"
                                    />

                                    {!bannerPreview ? (
                                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                                                    <path d="M19 7h-1.17l-1.83-2H8L6.17 7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm1 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2.05l1.83-2h6.24l1.83 2H19a1 1 0 0 1 1 1z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium">Upload banner image</p>
                                            <p className={helperCls}>Click to choose (optional)</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-xl border border-black/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={bannerPreview} alt="Banner preview" className="h-44 w-full object-cover" />
                                        </div>
                                    )}
                                </label>

                                {bannerPreview ? (
                                    <button
                                        type="button"
                                        onClick={() => setBannerFile(null)}
                                        className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
                                    >
                                        Remove banner
                                    </button>
                                ) : null}
                            </div>

                            {/* Show Images (multiple) */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <p className={labelCls}>Show Images (Multiple)</p>
                                    {showFiles.length > 0 ? (
                                        <button
                                            type="button"
                                            onClick={clearShowImages}
                                            className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Clear all
                                        </button>
                                    ) : null}
                                </div>

                                <div className="mt-2 rounded-2xl border border-black/10 bg-black/2 p-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => onSelectShowImages(e.target.files)}
                                        className="block w-full text-sm"
                                    />
                                    <p className="mt-2 text-xs text-black/60">You can select multiple images.</p>

                                    {showPreviews.length > 0 ? (
                                        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                                            {showPreviews.map((src, i) => (
                                                <div key={src} className="relative overflow-hidden rounded-xl border border-black/10 bg-white">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={src} alt={`Show image ${i + 1}`} className="h-24 w-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeShowImage(i)}
                                                        className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                                                        aria-label="Remove image"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-xl border border-dashed border-black/15 p-6 text-center">
                                            <p className="text-sm text-black/60">No show images selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic details card */}
                        <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-semibold">Basic Details</h2>
                            <p className="mt-1 text-sm text-black/60">Title, date, time and description.</p>

                            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                <div className="lg:col-span-2">
                                    <label className={labelCls}>
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter show title"
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>
                                        Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className={labelCls}>
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Write event description..."
                                        rows={6}
                                        className={`${inputCls} resize-none`}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Location card */}
                    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Location</h2>
                        <p className="mt-1 text-sm text-black/60">Address, state and city.</p>

                        <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <div className="lg:col-span-2">
                                <label className={labelCls}>
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter full address"
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelCls}>
                                    State <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={stateName}
                                    onChange={(e) => setStateName(e.target.value)}
                                    placeholder="Enter state"
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelCls}>
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Enter city"
                                    className={inputCls}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Pricing card */}
                    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Pricing</h2>
                        <p className="mt-1 text-sm text-black/60">
                            Select Free / Paid. Agar paid ho to ticket + online/offline open hoga.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    checked={paymentType === "free"}
                                    onChange={() => setPaymentType("free")}
                                />
                                Free
                            </label>

                            <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    checked={paymentType === "paid"}
                                    onChange={() => setPaymentType("paid")}
                                />
                                Paid
                            </label>
                        </div>

                        {isPaid && (
                            <div className="mt-5 rounded-2xl border border-black/10 bg-black/2 p-4">
                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div>
                                        <label className={labelCls}>
                                            Ticket Price <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={ticketPrice}
                                            onChange={(e) => setTicketPrice(e.target.value)}
                                            placeholder="Enter ticket price"
                                            className={inputCls}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Ticket Count</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={ticketCount}
                                            onChange={(e) => setTicketCount(e.target.value)}
                                            placeholder="Total available tickets (optional)"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className={labelCls}>Ticket Info</label>
                                        <textarea
                                            value={ticketInfo}
                                            onChange={(e) => setTicketInfo(e.target.value)}
                                            placeholder="Seat info, terms, etc."
                                            rows={3}
                                            className={`${inputCls} resize-none`}
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className={labelCls}>
                                            Payment Mode <span className="text-red-500">*</span>
                                        </label>

                                        <div className="mt-2 flex flex-wrap gap-3">
                                            <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                                <input
                                                    type="radio"
                                                    name="paidMode"
                                                    checked={paidMode === "online"}
                                                    onChange={() => setPaidMode("online")}
                                                />
                                                Online
                                            </label>

                                            <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                                <input
                                                    type="radio"
                                                    name="paidMode"
                                                    checked={paidMode === "offline"}
                                                    onChange={() => setPaidMode("offline")}
                                                />
                                                Offline
                                            </label>
                                        </div>

                                        {paidMode === "online" ? (
                                            <div className="mt-4">
                                                <label className={labelCls}>
                                                    Online Payment Info <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    value={onlineInfo}
                                                    onChange={(e) => setOnlineInfo(e.target.value)}
                                                    placeholder="UPI ID / Payment link / Instructions"
                                                    className={inputCls}
                                                    required
                                                />
                                            </div>
                                        ) : (
                                            <div className="mt-4">
                                                <label className={labelCls}>
                                                    Offline Payment Info <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    value={offlineInfo}
                                                    onChange={(e) => setOfflineInfo(e.target.value)}
                                                    placeholder="Pay at venue/counter instructions"
                                                    className={inputCls}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Error + Actions (dashboard style) */}
                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!requiredOk}
                            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}