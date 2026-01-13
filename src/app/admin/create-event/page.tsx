"use client";

import { apiUrl } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";

type PaymentType = "free" | "paid";
type PaidMode = "online" | "offline";

const inputCls =
    "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";
const helperCls = "text-xs text-black/60";

type StateType = {
    stateId: number;
    stateName: string;
};

type CityType = {
    id: number;
    name: string;
    stateid: number;
};

type GroupMember = {
    id: number;
    name: string;
    description: string;
    photo: string;
    photo_url: string;
    created_at: string;
};

function getTodayLocalYYYYMMDD() {
    // local date (avoids UTC off-by-1)
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
}

export default function CreateEventPage() {
    const router = useRouter();

    // ✅ today for date min
    const today = useMemo(() => getTodayLocalYYYYMMDD(), []);

    // Banner (single)
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");

    // Show images (multiple)
    const [showFiles, setShowFiles] = useState<File[]>([]);
    const [showPreviews, setShowPreviews] = useState<string[]>([]);

    // State/City
    const [states, setStates] = useState<StateType[]>([]);
    const [cities, setCities] = useState<CityType[]>([]);
    const [stateId, setStateId] = useState<number | "">("");
    const [stateName, setStateName] = useState("");
    const [cityId, setCityId] = useState<number | "">("");

    // Group Members (OPTIONAL)
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Dropdown state for members
    const [membersOpen, setMembersOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");
    const membersBoxRef = useRef<HTMLDivElement | null>(null);

    /** ---------------- FORM STATES ---------------- */
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");

    const [paymentType, setPaymentType] = useState<PaymentType>("free");
    const [ticketPrice, setTicketPrice] = useState("");
    const [ticketCount, setTicketCount] = useState("");
    const [ticketInfo, setTicketInfo] = useState("");
    const [paidMode, setPaidMode] = useState<PaidMode>("online");
    const [error, setError] = useState("");

    const isPaid = paymentType === "paid";

    const getToken = () => {
        if (typeof window === "undefined") return "";
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("access_token") ||
            localStorage.getItem("adminToken") ||
            ""
        );
    };

    // Close dropdown on outside click
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!membersBoxRef.current) return;
            if (!membersBoxRef.current.contains(e.target as Node)) {
                setMembersOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

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
        showPreviews.forEach((u) => URL.revokeObjectURL(u));
        const urls = showFiles.map((f) => URL.createObjectURL(f));
        setShowPreviews(urls);
        return () => urls.forEach((u) => URL.revokeObjectURL(u));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFiles]);

    // Reset paid fields when switching to free
    useEffect(() => {
        if (paymentType === "free") {
            setTicketPrice("");
            setTicketCount("");
            setTicketInfo("");
            setPaidMode("online");
        }
    }, [paymentType]);

    // ✅ Group members OPTIONAL now (no validation)
    const requiredOk = useMemo(() => {
        if (!title || !startDate || !time || !description) return false;

        // ✅ prevent past date
        if (startDate < today) return false;

        if (!address || !stateId || !cityId) return false;

        if (isPaid) {
            if (!ticketPrice) return false;
            if (!paidMode) return false;
        }
        return true;
    }, [title, startDate, time, description, address, stateId, cityId, isPaid, ticketPrice, paidMode, today]);

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

    // ✅ Fetch States
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await axios.post(`${apiUrl}/admin/states/list`, {});
                if (res.data?.status) setStates(res.data.data || []);
            } catch (err) {
                console.error("State fetch error", err);
            }
        };
        fetchStates();
    }, []);

    // ✅ Fetch Cities when State changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!stateId) return;

            try {
                const res = await axios.post(`${apiUrl}/city-by-state`, { stateid: stateId });
                if (res.data?.success) setCities(res.data.data || []);
            } catch (err) {
                console.error("City fetch error", err);
            }
        };

        setCityId("");
        setCities([]);

        if (stateId) fetchCities();
    }, [stateId]);

    // ✅ Fetch Group Members
    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                setLoadingMembers(true);

                const token = getToken();
                if (!token) {
                    setGroupMembers([]);
                    return;
                }

                const res = await axios.post(
                    `${apiUrl}/admin/group-members`,
                    {},
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data?.status) setGroupMembers(res.data.data || []);
                else setGroupMembers([]);
            } catch (err) {
                console.error("Group members fetch error:", err);
                setGroupMembers([]);
            } finally {
                setLoadingMembers(false);
            }
        };

        fetchGroupMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleMember = (id: number) => {
        setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const filteredMembers = useMemo(() => {
        const s = memberSearch.trim().toLowerCase();
        if (!s) return groupMembers;
        return groupMembers.filter((m) => {
            return (
                m.name.toLowerCase().includes(s) ||
                (m.description || "").toLowerCase().includes(s) ||
                String(m.id).includes(s)
            );
        });
    }, [groupMembers, memberSearch]);

    // ✅ STORE API submit
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!requiredOk) {
            if (startDate && startDate < today) {
                toast.error("Past dates are not allowed. Please select today or a future date.");
            } else {
                setError("Please fill all required fields.");
            }
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("event_date", startDate);
            formData.append("event_time", time);
            formData.append("description", description);
            formData.append("state_id", String(stateId));
            formData.append("city_id", String(cityId));
            formData.append("venue", address);

            const pricing_type = paymentType === "free" ? "1" : "2";
            formData.append("pricing_type", pricing_type);
            formData.append("price", ticketPrice);
            if (ticketCount) formData.append("ticket_count", ticketCount);
            if (ticketInfo) formData.append("ticket_info", ticketInfo);
            if (paymentType === "paid") {
                formData.append("payment_mode", paidMode === "online" ? "1" : "2");
            }

            if (bannerFile) formData.append("banner", bannerFile);
            showFiles.forEach((file) => formData.append("photos[]", file));

            if (selectedMemberIds.length > 0) {
                selectedMemberIds.forEach((id) => formData.append("group_members[]", String(id)));
            }

            const token = getToken();

            const res = await axios.post(`${apiUrl}/admin/group-events/store`, formData, {
                headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (res.data?.status) {
                toast.success(`Event created successfully`);
                router.push("/admin/events");

                setTitle("");
                setStartDate("");
                setTime("");
                setDescription("");
                setAddress("");
                setPaymentType("free");
                setBannerFile(null);
                setShowFiles([]);
                setStateId("");
                setStateName("");
                setCityId("");
                setSelectedMemberIds([]);
                setMemberSearch("");
                setMembersOpen(false);
            } else {
                toast.error(res.data?.message || "Failed to create event");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
                        <p className="text-sm text-black/60">Fill details and publish your show.</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-black/10 bg-white p-3 text-black hover:bg-black/5"
                            aria-label="Go back"
                            title="Back"
                        >
                            <IoArrowBack className="text-xl" /> Back
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
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

                            {/* Show Images */}
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

                        {/* Basic details */}
                        <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-semibold">Basic Details</h2>

                            <div className="mt-5 grid gap-4 lg:grid-cols-12">
                                <div className="lg:col-span-7">
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

                                {/* Group Members (Optional) */}
                                <div className="lg:col-span-5 relative" ref={membersBoxRef}>
                                    <label className={labelCls}>
                                        Group Members <span className="text-xs text-black/50">(Optional)</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setMembersOpen((p) => !p)}
                                        className={`${inputCls} flex items-center justify-between`}
                                    >
                                        <span className="text-sm">
                                            {selectedMemberIds.length === 0
                                                ? loadingMembers
                                                    ? "Loading members..."
                                                    : "Select members (optional)"
                                                : `${selectedMemberIds.length} selected`}
                                        </span>
                                        <span className="text-black/50">▾</span>
                                    </button>

                                    {membersOpen ? (
                                        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg">
                                            <div className="p-3">
                                                <input
                                                    value={memberSearch}
                                                    onChange={(e) => setMemberSearch(e.target.value)}
                                                    placeholder="Search member..."
                                                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div className="max-h-64 overflow-auto p-2">
                                                {loadingMembers ? (
                                                    <p className="px-3 py-2 text-sm text-black/60">Loading...</p>
                                                ) : filteredMembers.length === 0 ? (
                                                    <p className="px-3 py-2 text-sm text-black/60">No members found</p>
                                                ) : (
                                                    filteredMembers.map((m) => {
                                                        const checked = selectedMemberIds.includes(m.id);
                                                        return (
                                                            <label
                                                                key={m.id}
                                                                className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 hover:bg-black/5"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={() => toggleMember(m.id)}
                                                                    className="mt-1"
                                                                />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium">{m.name}</p>
                                                                    <p className="text-xs text-black/60 line-clamp-1">{m.description}</p>
                                                                </div>
                                                            </label>
                                                        );
                                                    })
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-black/10 p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedMemberIds([])}
                                                    className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setMembersOpen(false)}
                                                    className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="lg:col-span-6">
                                    <label className={labelCls}>
                                        Event Date <span className="text-red-500">*</span>
                                    </label>

                                    {/* ✅ disable past dates */}
                                    <input
                                        type="date"
                                        value={startDate}
                                        min={today}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v && v < today) {
                                                toast.error("Past dates are not allowed.");
                                                setStartDate(today);
                                                return;
                                            }
                                            setStartDate(v);
                                        }}
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                <div className="lg:col-span-6">
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

                                <div className="lg:col-span-12">
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

                    {/* Location */}
                    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Location</h2>

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
                                <label className={labelCls}>State  <span className="text-red-500">*</span></label>
                                <select
                                    className={inputCls}
                                    value={stateId}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (!v) {
                                            setStateId("");
                                            setStateName("");
                                            return;
                                        }
                                        const id = Number(v);
                                        setStateId(id);
                                        const selected = states.find((s) => s.stateId === id);
                                        setStateName(selected?.stateName || "");
                                    }}
                                >
                                    <option value="">Select State</option>
                                    {states.map((s) => (
                                        <option key={s.stateId} value={s.stateId}>
                                            {s.stateName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelCls}>City  <span className="text-red-500">*</span></label>
                                <select
                                    className={inputCls}
                                    value={cityId}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setCityId(v ? Number(v) : "");
                                    }}
                                    disabled={!stateId}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Pricing</h2>

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
                                            onChange={(e) => {
                                                const onlyDigits = e.target.value.replace(/\D/g, "");
                                                setTicketPrice(onlyDigits);
                                            }}
                                            onKeyDown={(e) => {
                                                // block e/E/+/-/. (common in number inputs)
                                                if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                                            }}
                                            placeholder="Enter ticket price"
                                            className={inputCls}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelCls}>Ticket Count <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={ticketCount}
                                            onChange={(e) => {
                                                const onlyDigits = e.target.value.replace(/\D/g, "");
                                                setTicketCount(onlyDigits);
                                            }}
                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                                            }}
                                            placeholder="Total available tickets (optional)"
                                            className={inputCls}
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className={labelCls}>Ticket Info <span className="text-red-500">*</span></label>
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
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

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
