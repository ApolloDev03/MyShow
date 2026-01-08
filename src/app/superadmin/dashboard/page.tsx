"use client";

import React, { useMemo, useState } from "react";

type EventItem = {
    id: string;
    title: string;
    startAt: string; // ISO
    location?: string;
    createdBy?: string;
};

type FilterType = "all" | "today" | "upcoming";

const initialEvents: EventItem[] = [
    {
        id: "e1",
        title: "Team Standup",
        startAt: new Date().toISOString(), // today
        location: "Google Meet",
        createdBy: "Admin",
    },
    {
        id: "e2",
        title: "Client Demo",
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(), // today (later)
        location: "Zoom",
        createdBy: "Apollo Coders",
    },
    {
        id: "e3",
        title: "Weekly Review",
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // upcoming
        location: "Office",
        createdBy: "Admin",
    },
    {
        id: "e4",
        title: "Planning Session",
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // upcoming
        location: "Board Room",
        createdBy: "Admin",
    },
];

function formatDateTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString();
}

function startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/* --- small icons (no extra library) --- */
function IconPlus(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function IconClock(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 8v5l3 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

type StatCardProps = {
    title: string;
    subtitle: string;
    value: number;
    icon: React.ReactNode;
    badge: string;
};

function StatCard({ title, subtitle, value, icon, badge }: StatCardProps) {
    return (
        <div className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            {/* left green line like screenshot */}
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-emerald-600" />

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        {icon}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-500">{subtitle}</p>
                    </div>
                </div>

                <div className="text-3xl font-semibold text-slate-900">{value}</div>
            </div>

            <div className="mt-3">
                <span className="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    {badge}
                </span>
            </div>
        </div>
    );
}

export default function SuperAdminDashboard() {
    const [events] = useState<EventItem[]>(initialEvents);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");

    const now = new Date();

    const todayCount = useMemo(() => {
        return events.filter((e) => isSameDay(new Date(e.startAt), now)).length;
    }, [events, now]);

    const upcomingCount = useMemo(() => {
        const todayStart = startOfDay(now).getTime();
        const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
        return events.filter((e) => new Date(e.startAt).getTime() >= tomorrowStart).length;
    }, [events, now]);

    const visibleEvents = useMemo(() => {
        const q = search.trim().toLowerCase();
        const today = now;

        let data = [...events];

        if (q) data = data.filter((e) => e.title.toLowerCase().includes(q));

        if (filter === "today") data = data.filter((e) => isSameDay(new Date(e.startAt), today));

        if (filter === "upcoming") {
            const todayStart = startOfDay(today).getTime();
            const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
            data = data.filter((e) => new Date(e.startAt).getTime() >= tomorrowStart);
        }

        data.sort((a, b) => (a.startAt > b.startAt ? 1 : -1));
        return data;
    }, [events, search, filter, now]);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-600">Overview of today’s and upcoming events.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
                            {new Date().toLocaleDateString()}
                        </div>

                        {/* same green button like screenshot */}
                        <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                            + Create Event
                        </button>
                    </div>
                </div>

                {/* KPI Cards (same card look as screenshot) */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard
                        title="Today"
                        subtitle="Scheduled shows"
                        value={todayCount}
                        icon={<IconPlus className="h-5 w-5" />}
                        badge="Today"
                    />

                    <StatCard
                        title="Upcoming"
                        subtitle="Scheduled shows"
                        value={upcomingCount}
                        icon={<IconClock className="h-5 w-5" />}
                        badge="Upcoming"
                    />
                </div>

                {/* Events List */}
                <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search events by title..."
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 sm:max-w-sm"
                            />

                            <div className="inline-flex w-full items-center gap-2 sm:w-auto">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold ring-1 ${filter === "all"
                                            ? "bg-emerald-600 text-white ring-emerald-600"
                                            : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    All
                                </button>

                                <button
                                    onClick={() => setFilter("today")}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold ring-1 ${filter === "today"
                                            ? "bg-emerald-600 text-white ring-emerald-600"
                                            : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Today
                                </button>

                                <button
                                    onClick={() => setFilter("upcoming")}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold ring-1 ${filter === "upcoming"
                                            ? "bg-emerald-600 text-white ring-emerald-600"
                                            : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Upcoming
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-slate-600">
                            Showing <span className="font-semibold text-slate-900">{visibleEvents.length}</span>{" "}
                            events
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-600">
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 pr-3">Title</th>
                                    <th className="py-3 pr-3">Date & Time</th>
                                    <th className="py-3 pr-3">Location</th>
                                    <th className="py-3 pr-3">Created By</th>
                                    <th className="py-3 text-right">Tag</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-slate-500">
                                            No events found.
                                        </td>
                                    </tr>
                                ) : (
                                    visibleEvents.map((e) => {
                                        const isToday = isSameDay(new Date(e.startAt), now);
                                        const isUpcoming =
                                            !isToday && new Date(e.startAt).getTime() >= startOfDay(now).getTime();

                                        const tag = isToday ? "Today" : isUpcoming ? "Upcoming" : "Past";
                                        const tagClass =
                                            tag === "Past"
                                                ? "bg-slate-100 text-slate-700 ring-slate-200"
                                                : "bg-emerald-50 text-emerald-700 ring-emerald-100";

                                        return (
                                            <tr key={e.id} className="border-b border-slate-100">
                                                <td className="py-3 pr-3 font-medium text-slate-900">{e.title}</td>
                                                <td className="py-3 pr-3 text-slate-700">{formatDateTime(e.startAt)}</td>
                                                <td className="py-3 pr-3 text-slate-700">{e.location ?? "—"}</td>
                                                <td className="py-3 pr-3 text-slate-700">{e.createdBy ?? "—"}</td>
                                                <td className="py-3 text-right">
                                                    <span
                                                        className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1 ${tagClass}`}
                                                    >
                                                        {tag}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
