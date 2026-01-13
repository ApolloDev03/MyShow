"use client";

// app/admin/dashboard/page.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiUrl } from "@/config";

type StatItem = {
    label: string;
    value: number;
    sub: string;
    ring: string;
    accent: string;
    icon: ReactNode;
};

type EventCountResponse = {
    status?: boolean;
    message?: string;
    data?: {
        today_events?: number;
        upcoming_events?: number;
    };
};

export default function AdminDashboardPage() {
    const API_URL = apiUrl ?? "";

    const getToken = () => {
        if (typeof window === "undefined") return "";
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("access_token") ||
            localStorage.getItem("adminToken") ||
            ""
        );
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

    const [loadingCounts, setLoadingCounts] = useState(false);
    const [counts, setCounts] = useState({
        today_events: 0,
        upcoming_events: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            if (!API_URL) return;

            try {
                setLoadingCounts(true);

                const res = await axios.post<EventCountResponse>(
                    `${API_URL}/admin/event-count`,
                    {},
                    authConfig()
                );

                if (!res.data?.status) return;
                const today = Number(res.data?.data?.today_events ?? 0);
                const upcoming = Number(res.data?.data?.upcoming_events ?? 0);

                setCounts({ today_events: today, upcoming_events: upcoming });
            } catch (err) {
                console.error("event-count error:", err);
            } finally {
                setLoadingCounts(false);
            }
        };

        fetchCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [API_URL]);

    // ✅ ONLY TODAY + UPCOMING (no completed)
    const stats: StatItem[] = useMemo(
        () => [
            {
                label: "Today Events",
                value: counts.today_events,
                sub: "Events happening today",
                ring: "bg-primary/15 text-primary",
                accent: "bg-primary",
                icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                    </svg>
                ),
            },
            {
                label: "Upcoming Events",
                value: counts.upcoming_events,
                sub: "Events scheduled next",
                ring: "bg-secondary/20 text-secondary",
                accent: "bg-secondary",
                icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 6H6v12h14V8z" />
                    </svg>
                ),
            },
        ],
        [counts.today_events, counts.upcoming_events]
    );

    // Right-side quick stats (still dummy)
    const quickStats = [
        { label: "Total Bookings (Today)", value: 38 },
        { label: "Paid Tickets (Today)", value: 21 },
        { label: "Free Entries (Today)", value: 17 },
        { label: "Group Members", value: 34 },
    ];

    const todayBookings = [
        { name: "New Year Musical Night", count: 12 },
        { name: "Standup Comedy Live", count: 7 },
        { name: "Drama Night: The Stage", count: 9 },
    ];

    const todayUsers = [
        { name: "Ramesh Patel", count: 2 },
        { name: "Mehul Shah", count: 1 },
        { name: "Komal Desai", count: 3 },
    ];

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                        {loadingCounts ? <p className="text-xs text-black/50 mt-1">Loading counts...</p> : null}
                    </div>

                    <Link
                        href="/admin/create-event"
                        className="hidden sm:inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        + Create Event
                    </Link>
                </div>

                {/* Top stats */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2">
                    {stats.map((s) => (
                        <StatCard
                            key={s.label}
                            title={s.label}
                            value={s.value}
                            sub={s.sub}
                            icon={s.icon}
                            ring={s.ring}
                            accent={s.accent}
                        />
                    ))}
                </section>

                {/* Chart + Quick stats */}
                <section className="mt-6 grid gap-6 lg:grid-cols-12">
                    {/* Chart */}
                    <div className="lg:col-span-8 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">Bookings Overview</h2>
                            <Link href="/admin/create-event" className="text-sm font-medium text-primary hover:underline">
                                + Create Event
                            </Link>
                        </div>

                        <div className="mt-4 rounded-2xl border border-dashed border-black/15 bg-black/2 p-10 text-center">
                            <div className="mx-auto max-w-xs">
                                <p className="text-sm font-medium text-black/70">Chart Placeholder</p>
                                <p className="mt-1 text-xs text-black/50">(Later add booking chart here)</p>
                            </div>
                            <div className="mt-6 h-40 w-full rounded-xl bg-white/60" />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="lg:col-span-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Quick Stats</h2>

                        <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
                            {quickStats.map((s, idx) => (
                                <div
                                    key={s.label}
                                    className={[
                                        "flex items-center justify-between px-4 py-3",
                                        idx !== quickStats.length - 1 ? "border-b border-black/10" : "",
                                    ].join(" ")}
                                >
                                    <span className="text-sm text-black/70">{s.label}</span>
                                    <span className="text-sm font-semibold text-black">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Two tables */}
                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <TableCard title="Today Show Bookings" rows={todayBookings} />
                    <TableCard title="Today User Registrations" rows={todayUsers} />
                </section>

                {/* Mobile Create Button */}
                <Link
                    href="/admin/create-event"
                    className="mt-6 inline-flex w-full sm:hidden justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                    + Create Event
                </Link>
            </div>
        </main>
    );
}

function StatCard({
    title,
    value,
    sub,
    icon,
    ring,
    accent,
}: {
    title: string;
    value: number;
    sub: string;
    icon: ReactNode;
    ring: string;
    accent: string;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <span className={`absolute left-0 top-0 h-full w-1.5 ${accent}`} />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${ring}`}>
                        {icon}
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-black">{title}</p>
                        <p className="text-xs text-black/60">{sub}</p>
                    </div>
                </div>
                <p className="text-3xl font-bold text-black">{value}</p>
            </div>
        </div>
    );
}

function TableCard({
    title,
    rows,
}: {
    title: string;
    rows: { name: string; count: number }[];
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold">{title}</h2>

            <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
                <div className="grid grid-cols-2 bg-black/3 px-4 py-3 text-sm font-semibold">
                    <div>Name</div>
                    <div className="text-right">Count</div>
                </div>

                <div className="divide-y divide-black/10">
                    {rows.map((r) => (
                        <div key={r.name} className="grid grid-cols-2 px-4 py-3 text-sm">
                            <div className="text-black">{r.name}</div>
                            <div className="text-right font-semibold text-primary">{r.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
