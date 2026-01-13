"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { apiUrl } from "@/config";

type PaymentType = "free" | "paid";
type PaidMode = "online" | "offline";
type ShowStatus = "Upcoming" | "Draft" | "Completed";

type ApiEventListItem = {
    eventId: number;
    group_id: number;
    group_member_ids: null | string[];
    banner: string | null;
    banner_url?: string | null;

    title: string;
    event_date: string; // ISO
    event_time: string; // "HH:mm:ss"
    description: string;

    state_id: number;
    city_id: number;
    venue: string;

    created_at: string;
    updated_at: string;

    pricing_type: 1 | 2;
    ticket_count: number | null;
    price: string | null;
    ticket_info: string | null;

    status?: 0 | 1;
    is_deleted?: 0 | 1;
};

type ApiEditResponse = {
    status: boolean;
    message: string;
    data: {
        event: {
            eventId: number;
            group_id: number;
            group_member_ids: null | string[];
            banner: string | null;

            title: string;
            event_date: string;
            event_time: string;
            description: string;

            state_id: number;
            city_id: number;
            venue: string;
            banner_url: string;

            created_at: string;
            updated_at: string;

            pricing_type: 1 | 2;
            ticket_count: number | null;
            price: string | null;
            ticket_info: string | null;

            status?: 0 | 1;
            is_deleted?: 0 | 1;
        };
        photos: Array<{ id: number; photo: string; photo_url: string }>;
    };
};

type ApiState = { stateId: number; stateName: string };
type ApiCity = { id: number; name: string; stateid: number };

type EventItem = {
    id: string; // eventId

    title: string;
    startDate: string; // YYYY-MM-DD
    time: string; // HH:mm (UI)
    description: string;

    address: string;

    stateId: number | "";
    cityId: number | "";
    stateName: string;
    cityName: string;

    paymentType: PaymentType;
    ticketPrice: string;
    ticketCount: string;
    ticketInfo: string;

    // ✅ payment mode (fixed)
    paidMode?: PaidMode;
    onlineInfo?: string;
    offlineInfo?: string;

    selectedMemberIds: number[];

    status: ShowStatus;
    isActive: boolean;

    bannerUrl?: string;
    photoUrls?: string[];

    // ✅ NEW: files for update
    bannerFile?: File | null;
    galleryFiles?: File[];

    createdAt: string;
};

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

const toYYYYMMDD = (iso: string) => (iso ? iso.split("T")[0] : "");
const toHHMM = (t: string) => (t && t.length >= 5 ? t.slice(0, 5) : "");

// ✅ send to API as HH:mm:ss
const toHHMMSS = (t: string) => {
    if (!t) return "";
    if (t.length === 5) return `${t}:00`;
    if (t.length === 8) return t;
    return t;
};

const computeStatus = (eventDateISO: string): ShowStatus => {
    const d = toYYYYMMDD(eventDateISO);
    if (!d) return "Upcoming";
    const todayStr = new Date().toISOString().slice(0, 10);
    return d < todayStr ? "Completed" : "Upcoming";
};

export default function SuperAdminEventsPage() {
    const API_URL = apiUrl ?? "";

    const [states, setStates] = useState<ApiState[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<ShowStatus | "All">("All");

    // Edit modal
    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState<EventItem | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

    const getToken = () => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("superadminToken");
    };

    const authConfig = () => {
        const token = getToken();
        return {
            headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        };
    };

    const buildFileUrl = (path?: string | null) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;

        const base = API_URL.replace(/\/api\/?$/, "");

        if (path.startsWith("/")) return `${base}${path}`;
        if (path.includes("/")) return `${base}/${path}`;

        return `${base}/storage/${path}`;
    };

    // ✅ fetch states once
    useEffect(() => {
        const fetchStates = async () => {
            if (!API_URL) return;
            try {
                const res = await axios.post(`${API_URL}/admin/states/list`, {});
                if (res.data?.status) setStates(res.data.data || []);
            } catch (e) {
                console.error("States fetch error:", e);
            }
        };
        fetchStates();
    }, [API_URL]);

    // ✅ STATUS API: POST /v1/events/status/:id  { status: 0/1 }
    const toggleApiStatus = async (id: string, next: boolean) => {
        if (!API_URL) return;
        try {
            setStatusUpdatingId(id);
            setError("");

            const res = await axios.post(
                `${API_URL}/v1/events/status/${id}`,
                { status: next ? 1 : 0 },
                authConfig()
            );

            if (!res.data?.status) {
                setError(res.data?.message || "Failed to update status.");
                return;
            }

            setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, isActive: next } : e)));
            setEditItem((prev) => (prev && prev.id === id ? { ...prev, isActive: next } : prev));
        } catch (err: any) {
            console.error("Status update error:", err);
            setError(err?.response?.data?.message || "Failed to update status.");
        } finally {
            setStatusUpdatingId(null);
        }
    };

    // ✅ fetch events list
    const fetchAllEvents = async () => {
        if (!API_URL) {
            setError("API URL not configured. Please set apiUrl in config / .env.local");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const eventsRes = await axios.post(`${API_URL}/v1/events`, {}, authConfig());
            if (!eventsRes.data?.status) {
                setEvents([]);
                setError(eventsRes.data?.message);
                return;
            }
            const apiEvents: ApiEventListItem[] = eventsRes.data?.data || [];

            const stateNameById = new Map<number, string>(states.map((s) => [s.stateId, s.stateName]));
            const uniqueStateIds = Array.from(new Set(apiEvents.map((x) => x.state_id))).filter(Boolean);

            const cityNameById = new Map<number, string>();
            await Promise.all(
                uniqueStateIds.map(async (sid) => {
                    try {
                        const cityRes = await axios.post(`${API_URL}/city-by-state`, { stateid: sid });
                        if (cityRes.data?.success) {
                            const cities: ApiCity[] = cityRes.data?.data || [];
                            cities.forEach((c) => cityNameById.set(c.id, c.name));
                        }
                    } catch {
                        // ignore
                    }
                })
            );

            const normalized: EventItem[] = apiEvents
                .filter((x) => Number(x.is_deleted ?? 0) === 0)
                .map((x) => {
                    const paymentType: PaymentType = x.pricing_type === 1 ? "free" : "paid";
                    const stateName = stateNameById.get(x.state_id) || `State #${x.state_id}`;
                    const cityName = cityNameById.get(x.city_id) || `City #${x.city_id}`;

                    const bannerCandidate = x.banner_url || x.banner;
                    const apiActive = Number(x.status ?? 1) === 1 && Number(x.is_deleted ?? 0) === 0;

                    return {
                        id: String(x.eventId),

                        title: x.title || "",
                        startDate: toYYYYMMDD(x.event_date),
                        time: toHHMM(x.event_time),
                        description: x.description || "",

                        address: x.venue || "",

                        stateId: x.state_id ?? "",
                        cityId: x.city_id ?? "",
                        stateName,
                        cityName,

                        paymentType,
                        ticketPrice: paymentType === "paid" ? x.price ?? "" : "",
                        ticketCount: x.ticket_count != null ? String(x.ticket_count) : "",
                        ticketInfo: x.ticket_info ?? "",

                        paidMode: "online",
                        onlineInfo: "",
                        offlineInfo: "",

                        selectedMemberIds: (x.group_member_ids || []).map((s) => Number(s)).filter(Boolean),

                        status: computeStatus(x.event_date),
                        isActive: apiActive,

                        bannerUrl: buildFileUrl(bannerCandidate),
                        photoUrls: [],
                        bannerFile: null,
                        galleryFiles: [],

                        createdAt: x.created_at ? new Date(x.created_at).toLocaleString() : "",
                    };
                });

            setEvents(normalized);
        } catch (err: any) {
            console.error("Events fetch error:", err);
            setEvents([]);
            setError(err?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [API_URL, states.length]);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return events.filter((e) => {
            const statusOk = statusFilter === "All" ? true : e.status === statusFilter;
            const searchOk =
                !s ||
                e.title.toLowerCase().includes(s) ||
                e.cityName.toLowerCase().includes(s) ||
                e.stateName.toLowerCase().includes(s) ||
                e.id.toLowerCase().includes(s);
            return statusOk && searchOk;
        });
    }, [events, search, statusFilter]);

    // ✅ EDIT: fetch event details then open modal
    const openEdit = async (row: EventItem) => {
        if (!API_URL) return;

        try {
            setEditLoading(true);
            setError("");

            const res = await axios.post<ApiEditResponse>(`${API_URL}/v1/events/show/${row.id}`, {}, authConfig());

            if (!res.data?.status) {
                setError(res.data?.message || "Failed to fetch event.");
                return;
            }

            const ev = res.data.data?.event;
            const photos = res.data.data?.photos || [];

            const paymentType: PaymentType = ev.pricing_type === 1 ? "free" : "paid";

            const stateName = states.find((s) => s.stateId === ev.state_id)?.stateName || row.stateName;
            const cityName = row.cityName;

            const apiActive = Number(ev.status ?? (row.isActive ? 1 : 0)) === 1 && Number(ev.is_deleted ?? 0) === 0;

            const editReady: EventItem = {
                id: String(ev.eventId),

                title: ev.title || "",
                startDate: toYYYYMMDD(ev.event_date),
                time: toHHMM(ev.event_time),
                description: ev.description || "",

                address: ev.venue || "",

                stateId: ev.state_id || "",
                cityId: ev.city_id || "",
                stateName,
                cityName,

                paymentType,
                ticketPrice: paymentType === "paid" ? ev.price ?? "" : "",
                ticketCount: ev.ticket_count != null ? String(ev.ticket_count) : "",
                ticketInfo: ev.ticket_info ?? "",

                paidMode: row.paidMode ?? "online",
                onlineInfo: row.onlineInfo ?? "",
                offlineInfo: row.offlineInfo ?? "",

                selectedMemberIds: (ev.group_member_ids || []).map((s) => Number(s)).filter(Boolean),

                status: row.status,
                isActive: apiActive,

                bannerUrl: buildFileUrl(ev.banner_url),
                photoUrls: photos.map((p) => buildFileUrl(p.photo_url)),

                // ✅ reset file selections on open
                bannerFile: null,
                galleryFiles: [],

                createdAt: row.createdAt,
            };

            setEditItem(editReady);
            setEditOpen(true);
        } catch (err: any) {
            console.error("Edit fetch error:", err);
            setError(err?.response?.data?.message || "Failed to fetch event.");
        } finally {
            setEditLoading(false);
        }
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditItem(null);
    };

    // ✅ UPDATE API (time + images)
    const updateEvent = async () => {
        if (!editItem || !API_URL) return;

        if (!editItem.title || !editItem.startDate || !editItem.time || !editItem.description) {
            alert("Please fill Title, Date, Time and Description");
            return;
        }
        if (!editItem.address || !editItem.stateId || !editItem.cityId) {
            alert("Please fill Address, State and City");
            return;
        }
        if (editItem.paymentType === "paid" && !editItem.ticketPrice) {
            alert("Please enter Ticket Price");
            return;
        }
        if (editItem.paymentType === "paid" && !editItem.paidMode) {
            alert("Please select Payment Mode (Online/Offline)");
            return;
        }

        try {
            setUpdateLoading(true);
            setError("");

            const fd = new FormData();
            fd.append("title", editItem.title);
            fd.append("event_date", editItem.startDate);

            // ✅ time fix: send HH:mm:ss
            fd.append("event_time", toHHMMSS(editItem.time));

            fd.append("description", editItem.description);
            fd.append("state_id", String(editItem.stateId));
            fd.append("city_id", String(editItem.cityId));
            fd.append("venue", editItem.address);

            const pricing_type = editItem.paymentType === "free" ? "1" : "2";
            fd.append("pricing_type", pricing_type);

            if (editItem.paymentType === "paid") {
                fd.append("price", editItem.ticketPrice);
                fd.append("Price", editItem.ticketPrice);

                if (editItem.ticketCount) {
                    fd.append("ticket_count", editItem.ticketCount);
                    fd.append("Ticket_count", editItem.ticketCount);
                }
                if (editItem.ticketInfo) fd.append("ticket_info", editItem.ticketInfo);

                // ✅ paid mode fields (adjust keys if your backend uses different names)
                fd.append("paid_mode", editItem.paidMode ?? "online");
                fd.append("online_info", editItem.onlineInfo ?? "");
                fd.append("offline_info", editItem.offlineInfo ?? "");
            } else {
                fd.append("price", "");
                fd.append("ticket_count", "");
                fd.append("ticket_info", "");
                fd.append("paid_mode", "");
                fd.append("online_info", "");
                fd.append("offline_info", "");
            }

            editItem.selectedMemberIds.forEach((id) => fd.append("group_members[]", String(id)));

            // ✅ IMAGES UPDATE
            // Banner (single)
            if (editItem.bannerFile) {
                // common key names: "banner" OR "banner_image"
                fd.append("banner", editItem.bannerFile);
                // fd.append("banner_image", editItem.bannerFile); // uncomment if your backend expects this
            }

            // Gallery (multiple)
            if (editItem.galleryFiles && editItem.galleryFiles.length > 0) {
                editItem.galleryFiles.forEach((file) => {
                    // common key names: "photos[]" OR "images[]" OR "photos"
                    fd.append("photos[]", file);
                    // fd.append("images[]", file); // uncomment if needed
                });
            }

            const res = await axios.post(`${API_URL}/v1/events/update/${editItem.id}`, fd, authConfig());

            if (!res.data?.status) {
                setError(res.data?.message || "Event update failed.");
                return;
            }

            // ✅ easiest: refresh list so banner/photos updated in UI
            await fetchAllEvents();
            closeEdit();
        } catch (err: any) {
            console.error("Update error:", err);
            setError(err?.response?.data?.message || "Event update failed.");
        } finally {
            setUpdateLoading(false);
        }
    };

    // ✅ DELETE API
    const deleteEvent = async (id: string) => {
        if (!API_URL) return;

        const ok = window.confirm("Are you sure you want to delete this event?");
        if (!ok) return;

        try {
            setDeleteLoadingId(id);
            setError("");

            const res = await axios.post(`${API_URL}/admin/group-events/delete/${id}`, {}, authConfig());

            if (!res.data?.status) {
                setError(res.data?.message || "Delete failed.");
                return;
            }

            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (err: any) {
            console.error("Delete error:", err);
            setError(err?.response?.data?.message || "Delete failed.");
        } finally {
            setDeleteLoadingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
                        <p className="text-sm text-black/60">Manage your events (edit / delete).</p>
                        {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    </div>

                    <Link
                        href="/admin/create-event"
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        <FiPlus className="text-base" />
                        Create Event
                    </Link>
                </div>

                {/* Filters */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                        <div className="sm:col-span-8">
                            <label className={labelCls}>Search</label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title / city / id..."
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div className="sm:col-span-4">
                            <label className={labelCls}>Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ShowStatus | "All")}
                                className={`${inputCls} mt-2`}
                            >
                                <option value="All">All</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Draft">Draft</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* TABLE LISTING */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-245 w-full">
                            <thead className="bg-black/3">
                                <tr className="text-left text-sm font-semibold text-black">
                                    <th className="px-4 py-3">Banner</th>
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">Date / Time</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
                                            Loading events...
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((e) => (
                                        <tr key={e.id} className="hover:bg-black/2">
                                            {/* Banner */}
                                            <td className="px-4 py-3">
                                                <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
                                                    {e.bannerUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={e.bannerUrl} alt={e.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-sm font-bold text-primary">
                                                            {e.title?.trim()?.[0]?.toUpperCase() || "M"}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Event */}
                                            <td className="px-4 py-3">
                                                <div className="min-w-0">
                                                    <p className="font-semibold truncate max-w-[320px]">{e.title}</p>
                                                </div>
                                            </td>

                                            {/* Date / Time */}
                                            <td className="px-4 py-3 text-sm text-black/70">
                                                <p>{e.startDate}</p>
                                                <p className="text-xs text-black/50">{e.time}</p>
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-3 text-sm text-black/70">
                                                <p className="font-medium text-black">{e.cityName}</p>
                                                <p className="text-xs text-black/50">{e.stateName}</p>
                                            </td>

                                            {/* Type */}
                                            <td className="px-4 py-3 text-sm">
                                                {e.paymentType === "free" ? (
                                                    <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
                                                        Free
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full border border-black/10 bg-black/2 px-3 py-1 text-xs font-semibold">
                                                        Paid • ₹{e.ticketPrice || "-"}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Active/Inactive */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleApiStatus(e.id, !e.isActive)}
                                                        disabled={statusUpdatingId === e.id}
                                                        className={[
                                                            "inline-flex cursor-pointer items-center rounded-full border px-3 py-1 text-xs font-semibold",
                                                            e.isActive
                                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                : "border-red-200 bg-red-50 text-red-700",
                                                            statusUpdatingId === e.id ? "opacity-60" : "hover:opacity-90",
                                                        ].join(" ")}
                                                        title="Toggle Active/Inactive (API)"
                                                    >
                                                        {statusUpdatingId === e.id ? "Updating..." : e.isActive ? "Active" : "Inactive"}
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(e)}
                                                        disabled={editLoading}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5 disabled:opacity-60"
                                                        aria-label="Edit event"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => deleteEvent(e.id)}
                                                        disabled={deleteLoadingId === e.id}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                        aria-label="Delete event"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="text-lg" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}

                                {!loading && filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-sm text-black/60">
                                            No events found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Mobile Create Button */}
                <Link
                    href="/admin/create-event"
                    className="mt-6 inline-flex w-full sm:hidden justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                    <FiPlus className="text-base" />
                    Create Event
                </Link>
            </div>

            {/* Edit Modal */}
            {editOpen && editItem ? (
                <EditModal
                    item={editItem}
                    onChange={setEditItem}
                    onClose={closeEdit}
                    onUpdate={updateEvent}
                    updateLoading={updateLoading}
                    states={states}
                    apiUrl={API_URL}
                />
            ) : null}
        </main>
    );
}

function EditModal({
    item,
    onChange,
    onClose,
    onUpdate,
    updateLoading,
    states,
    apiUrl,
}: {
    item: EventItem;
    onChange: (next: EventItem | null) => void;
    onClose: () => void;
    onUpdate: () => void;
    updateLoading: boolean;
    states: ApiState[];
    apiUrl: string;
}) {
    const [cities, setCities] = useState<ApiCity[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    useEffect(() => {
        const fetchCities = async () => {
            if (!item.stateId) {
                setCities([]);
                return;
            }
            try {
                setLoadingCities(true);
                const res = await axios.post(`${apiUrl}/city-by-state`, { stateid: item.stateId });
                if (res.data?.success) setCities(res.data.data || []);
                else setCities([]);
            } catch (e) {
                console.error("City fetch error:", e);
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, [item.stateId, apiUrl]);

    const isPaid = item.paymentType === "paid";
    const paidMode: PaidMode = item.paidMode ?? "online";

    // ✅ previews for selected files
    const bannerPreview = useMemo(() => {
        if (item.bannerFile) return URL.createObjectURL(item.bannerFile);
        return item.bannerUrl || "";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.bannerFile, item.bannerUrl]);

    const galleryPreviews = useMemo(() => {
        const fromFiles = (item.galleryFiles || []).map((f) => URL.createObjectURL(f));
        return fromFiles;
    }, [item.galleryFiles]);

    useEffect(() => {
        return () => {
            // cleanup object urls
            if (item.bannerFile && bannerPreview.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
            galleryPreviews.forEach((u) => {
                if (u.startsWith("blob:")) URL.revokeObjectURL(u);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bannerPreview, galleryPreviews]);

    return (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4 py-10 overflow-y-auto"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl my-10 border border-black/10">
                {/* Header */}
                <div className="top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
                    <div>
                        <p className="text-base font-semibold">Edit Event</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
                        aria-label="Close"
                        title="Close"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Left: Banner + Photos */}
                        <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-4">
                            <p className="text-sm font-semibold">Images</p>

                            <div className="mt-3">
                                <p className="text-sm font-medium text-black">Banner</p>

                                <div className="mt-2 overflow-hidden rounded-xl border border-black/10 bg-black/2">
                                    {bannerPreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={bannerPreview} alt="Banner" className="h-40 w-full object-cover" />
                                    ) : (
                                        <div className="h-40 w-full flex items-center justify-center text-sm text-black/50">
                                            No banner
                                        </div>
                                    )}
                                </div>

                                {/* ✅ Banner upload */}
                                <div className="mt-3">
                                    <label className={labelCls}>Change Banner</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className={`${inputCls} mt-2`}
                                        onChange={(e) => {
                                            const f = e.target.files?.[0] || null;
                                            onChange({ ...item, bannerFile: f });
                                        }}
                                    />
                                    {item.bannerFile ? (
                                        <button
                                            type="button"
                                            className="mt-2 text-xs text-red-600 underline"
                                            onClick={() => onChange({ ...item, bannerFile: null })}
                                        >
                                            Remove selected banner
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-5">
                                <p className="text-sm font-medium text-black">Gallery Photos</p>

                                {/* existing photos */}
                                {item.photoUrls && item.photoUrls.length > 0 ? (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {item.photoUrls.map((u) => (
                                            <div key={u} className="overflow-hidden rounded-xl border border-black/10 bg-black/2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={u} alt="Photo" className="h-20 w-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-2 rounded-xl border border-dashed border-black/15 p-4 text-center text-sm text-black/60">
                                        No gallery photos
                                    </div>
                                )}

                                {/* ✅ newly selected photos preview */}
                                {galleryPreviews.length > 0 ? (
                                    <div className="mt-3">
                                        <p className="text-xs font-semibold text-black/70">New Selected Photos</p>
                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                            {galleryPreviews.map((u) => (
                                                <div key={u} className="overflow-hidden rounded-xl border border-black/10 bg-black/2">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={u} alt="New Photo" className="h-20 w-full object-cover" />
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-2 text-xs text-red-600 underline"
                                            onClick={() => onChange({ ...item, galleryFiles: [] })}
                                        >
                                            Remove selected gallery photos
                                        </button>
                                    </div>
                                ) : null}

                                {/* ✅ gallery upload */}
                                <div className="mt-3">
                                    <label className={labelCls}>Add Gallery Photos</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className={`${inputCls} mt-2`}
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            onChange({ ...item, galleryFiles: files });
                                        }}
                                    />
                                    <p className="mt-2 text-xs text-black/50">
                                        (These will be uploaded on Update Event)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-4">
                            <p className="text-sm font-semibold">Event Details</p>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                <div className="lg:col-span-2">
                                    <label className={labelCls}>Title *</label>
                                    <input
                                        value={item.title}
                                        onChange={(e) => onChange({ ...item, title: e.target.value })}
                                        className={`${inputCls} mt-2`}
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>Start Date *</label>
                                    <input
                                        type="date"
                                        value={item.startDate}
                                        onChange={(e) => onChange({ ...item, startDate: e.target.value })}
                                        className={`${inputCls} mt-2`}
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>Time *</label>
                                    <input
                                        type="time"
                                        value={item.time}
                                        onChange={(e) => onChange({ ...item, time: e.target.value })}
                                        className={`${inputCls} mt-2`}
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className={labelCls}>Description *</label>
                                    <textarea
                                        rows={4}
                                        value={item.description}
                                        onChange={(e) => onChange({ ...item, description: e.target.value })}
                                        className={`${inputCls} mt-2 resize-none`}
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className={labelCls}>Address / Venue *</label>
                                    <input
                                        value={item.address}
                                        onChange={(e) => onChange({ ...item, address: e.target.value })}
                                        className={`${inputCls} mt-2`}
                                    />
                                </div>

                                {/* State */}
                                <div>
                                    <label className={labelCls}>State *</label>
                                    <select
                                        className={`${inputCls} mt-2`}
                                        value={item.stateId}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (!v) {
                                                onChange({ ...item, stateId: "", cityId: "", stateName: "", cityName: "" });
                                                return;
                                            }
                                            const sid = Number(v);
                                            const sName = states.find((s) => s.stateId === sid)?.stateName || "";
                                            onChange({ ...item, stateId: sid, cityId: "", stateName: sName, cityName: "" });
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

                                {/* City */}
                                <div>
                                    <label className={labelCls}>City *</label>
                                    <select
                                        className={`${inputCls} mt-2`}
                                        value={item.cityId}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (!v) {
                                                onChange({ ...item, cityId: "", cityName: "" });
                                                return;
                                            }
                                            const cid = Number(v);
                                            const cName = cities.find((c) => c.id === cid)?.name || "";
                                            onChange({ ...item, cityId: cid, cityName: cName });
                                        }}
                                        disabled={!item.stateId || loadingCities}
                                    >
                                        <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
                                        {cities.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Payment */}
                                <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-black/2 p-4">
                                    <p className="text-sm font-semibold">Pricing</p>

                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                            <input
                                                type="radio"
                                                name="paymentTypeEdit"
                                                checked={item.paymentType === "free"}
                                                onChange={() =>
                                                    onChange({
                                                        ...item,
                                                        paymentType: "free",
                                                        ticketPrice: "",
                                                        ticketCount: "",
                                                        ticketInfo: "",
                                                        paidMode: "online",
                                                        onlineInfo: "",
                                                        offlineInfo: "",
                                                    })
                                                }
                                            />
                                            Free
                                        </label>

                                        <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                            <input
                                                type="radio"
                                                name="paymentTypeEdit"
                                                checked={item.paymentType === "paid"}
                                                onChange={() =>
                                                    onChange({
                                                        ...item,
                                                        paymentType: "paid",
                                                        paidMode: item.paidMode ?? "online",
                                                    })
                                                }
                                            />
                                            Paid
                                        </label>
                                    </div>

                                    {isPaid ? (
                                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                            <div>
                                                <label className={labelCls}>Ticket Price *</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={item.ticketPrice}
                                                    onChange={(e) => onChange({ ...item, ticketPrice: e.target.value })}
                                                    className={`${inputCls} mt-2`}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelCls}>Ticket Count</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={item.ticketCount}
                                                    onChange={(e) => onChange({ ...item, ticketCount: e.target.value })}
                                                    className={`${inputCls} mt-2`}
                                                />
                                            </div>

                                            <div className="lg:col-span-2">
                                                <label className={labelCls}>Ticket Info</label>
                                                <textarea
                                                    rows={3}
                                                    value={item.ticketInfo}
                                                    onChange={(e) => onChange({ ...item, ticketInfo: e.target.value })}
                                                    className={`${inputCls} mt-2 resize-none`}
                                                />
                                            </div>

                                            {/* Payment Mode */}
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
                                                            onChange={() => onChange({ ...item, paidMode: "online" })}
                                                        />
                                                        Online
                                                    </label>

                                                    <label className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm">
                                                        <input
                                                            type="radio"
                                                            name="paidMode"
                                                            checked={paidMode === "offline"}
                                                            onChange={() => onChange({ ...item, paidMode: "offline" })}
                                                        />
                                                        Offline
                                                    </label>
                                                </div>
                                            </div>

                                            {paidMode === "online" ? (
                                                <div className="lg:col-span-2">
                                                    <label className={labelCls}>Online Payment Info</label>
                                                    <textarea
                                                        rows={3}
                                                        value={item.onlineInfo ?? ""}
                                                        onChange={(e) => onChange({ ...item, onlineInfo: e.target.value })}
                                                        className={`${inputCls} mt-2 resize-none`}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="lg:col-span-2">
                                                    <label className={labelCls}>Offline Payment Info</label>
                                                    <textarea
                                                        rows={3}
                                                        value={item.offlineInfo ?? ""}
                                                        onChange={(e) => onChange({ ...item, offlineInfo: e.target.value })}
                                                        className={`${inputCls} mt-2 resize-none`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
                        disabled={updateLoading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onUpdate}
                        disabled={updateLoading}
                        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                    >
                        {updateLoading ? "Updating..." : "Update Event"}
                    </button>
                </div>
            </div>
        </div>
    );
}
