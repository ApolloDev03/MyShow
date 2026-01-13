"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { apiUrl } from "@/config";

type StateApi = {
    stateId: number;
    stateName: string;
    value?: string;
};

type CityListApi = {
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
};

type CityByStateApi = {
    id: number;
    name: string;
    stateid: number;
};

type CityRow = {
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
};

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

export default function CityMasterPage() {
    // ===== Token (Bearer) =====
    const getToken = () => {
        if (typeof window === "undefined") return "";
        return (
            localStorage.getItem("superadminToken") ||
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

    // ===== States + Cities =====
    const [states, setStates] = useState<StateApi[]>([]);
    const [cities, setCities] = useState<CityRow[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState<number | "All">("All");

    // Modal
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [draft, setDraft] = useState<{
        cityId?: number;
        stateId: number | "";
        cityName: string;
    }>({ stateId: "", cityName: "" });

    // UI
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const stateNameById = useMemo(() => {
        const map = new Map<number, string>();
        states.forEach((s) => map.set(Number(s.stateId), s.stateName));
        return map;
    }, [states]);

    // ===== API CALLS =====

    // 1) States list
    const fetchStates = async () => {
        const res = await axios.post(`${apiUrl}/admin/states/list`, {}, authConfig());
        if (res.data?.status) {
            setStates(res.data.data || []);
        } else {
            throw new Error(res.data?.message || "Failed to load states");
        }
    };

    // 2) City list (All)
    const fetchCityList = async () => {
        const res = await axios.post(`${apiUrl}/city-list`, {}, authConfig());
        if (res.data?.success) {
            const list: CityListApi[] = res.data.data || [];
            const normalized: CityRow[] = list.map((x) => ({
                cityId: Number(x.cityId),
                cityName: x.cityName,
                stateId: Number(x.stateId),
                stateName: x.stateName,
            }));
            setCities(normalized);
        } else {
            throw new Error(res.data?.message || "Failed to load city list");
        }
    };

    // 3) City by state
    const fetchCitiesByState = async (sid: number) => {
        const res = await axios.post(
            `${apiUrl}/city-by-state`,
            { stateid: sid },
            authConfig()
        );

        if (res.data?.success) {
            const list: CityByStateApi[] = res.data.data || [];
            const stName = stateNameById.get(sid) || "—";
            const normalized: CityRow[] = list.map((x) => ({
                cityId: Number(x.id),
                cityName: x.name,
                stateId: Number(x.stateid),
                stateName: stName,
            }));
            setCities(normalized);
        } else {
            throw new Error(res.data?.message || "Failed to load cities by state");
        }
    };

    const refreshCities = async (currentFilter = stateFilter) => {
        if (currentFilter === "All") return fetchCityList();
        return fetchCitiesByState(Number(currentFilter));
    };

    // Initial load
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");
                await fetchStates();
                await fetchCityList();
            } catch (e: any) {
                console.error(e);
                setError(e?.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When state filter changes -> call city-by-state / city-list
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");
                await refreshCities(stateFilter);
            } catch (e: any) {
                console.error(e);
                setError(e?.message || "Failed to refresh cities.");
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateFilter, stateNameById]);

    // ===== Modal helpers =====
    const openAdd = () => {
        setMode("add");
        setDraft({ stateId: "", cityName: "" });
        setError("");
        setOpen(true);
    };

    const openEdit = (item: CityRow) => {
        setMode("edit");
        setDraft({ cityId: item.cityId, stateId: item.stateId, cityName: item.cityName });
        setError("");
        setOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setOpen(false);
        setDraft({ stateId: "", cityName: "" });
    };

    // ===== CRUD =====

    // 2) Add City: /city-add
    const addCityApi = async (sid: number, name: string) => {
        const res = await axios.post(
            `${apiUrl}/city-add`,
            { stateid: sid, name },
            authConfig()
        );
        return res.data;
    };

    // 3) Update City: /city-update
    const updateCityApi = async (cityId: number, sid: number, name: string) => {
        const res = await axios.post(
            `${apiUrl}/city-update`,
            { city_id: cityId, stateid: sid, name },
            authConfig()
        );
        return res.data;
    };

    // 4) Delete City: /city-delete
    const deleteCityApi = async (cityId: number) => {
        const res = await axios.post(
            `${apiUrl}/city-delete`,
            { city_id: cityId },
            authConfig()
        );
        return res.data;
    };

    const saveCity = async () => {
        const sid = Number(draft.stateId);
        const name = draft.cityName.trim();

        if (!sid) return setError("Please select state.");
        if (!name) return setError("Please enter city name.");

        // duplicate check (same state + same city)
        const dup = cities.some(
            (x) =>
                x.stateId === sid &&
                x.cityName.trim().toLowerCase() === name.toLowerCase() &&
                (mode === "add" ? true : x.cityId !== draft.cityId)
        );
        if (dup) return setError("This city already exists in selected state.");

        try {
            setSaving(true);
            setError("");

            if (mode === "add") {
                const data = await addCityApi(sid, name);
                if (!data?.success) throw new Error(data?.message || "City add failed");
            } else {
                if (!draft.cityId) return;
                const data = await updateCityApi(draft.cityId, sid, name);
                if (!data?.success) throw new Error(data?.message || "City update failed");
            }

            await refreshCities(stateFilter);
            closeModal();
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (cityId: number) => {
        const ok = window.confirm("Are you sure you want to delete this city?");
        if (!ok) return;

        try {
            setSaving(true);
            setError("");
            const data = await deleteCityApi(cityId);
            if (!data?.success) throw new Error(data?.message || "City delete failed");
            await refreshCities(stateFilter);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Delete failed.");
        } finally {
            setSaving(false);
        }
    };

    // ===== Filtered (search only; state filter already server-driven) =====
    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return cities;

        return cities.filter((c) => {
            return (
                c.cityName.toLowerCase().includes(s) ||
                c.stateName.toLowerCase().includes(s) ||
                String(c.cityId).toLowerCase().includes(s)
            );
        });
    }, [cities, search]);

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">City Master</h1>
                        <p className="text-sm text-black/60">Add, edit and delete cities.</p>
                    </div>

                    <button
                        type="button"
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        <FiPlus className="text-base" />
                        Add City
                    </button>
                </div>

                {/* Filters */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                        <div className="sm:col-span-7">
                            <label className={labelCls}>Search</label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by city / state / id..."
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div className="sm:col-span-5">
                            <label className={labelCls}>State Filter</label>
                            <select
                                value={stateFilter === "All" ? "All" : String(stateFilter)}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setStateFilter(v === "All" ? "All" : Number(v));
                                }}
                                className={`${inputCls} mt-2`}
                            >
                                <option value="All">All</option>
                                {states.map((s) => (
                                    <option key={s.stateId} value={String(s.stateId)}>
                                        {s.stateName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-12 flex items-center justify-between">
                            <p className="mt-2 text-xs text-black/60">
                                {loading ? "Loading..." : `Total: ${cities.length}`}
                            </p>

                        </div>

                        {error ? (
                            <div className="sm:col-span-12">
                                <p className="mt-1 text-sm text-red-600">{error}</p>
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* Table */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-225 w-full">
                            <thead className="bg-black/3">
                                <tr className="text-left text-sm font-semibold text-black">
                                    <th className="px-4 py-3">Sr. No</th>
                                    <th className="px-4 py-3">State</th>
                                    <th className="px-4 py-3">City</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {filtered.map((c, index) => (
                                    <tr key={c.cityId} className="hover:bg-black/2">
                                        <td className="px-4 py-3 text-sm text-black/70">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-semibold">{c.stateName}</td>
                                        <td className="px-4 py-3 text-sm text-black/80">{c.cityName}</td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(c)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="text-lg" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(c.cityId)}
                                                    disabled={saving}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!loading && filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-black/60">
                                            No cities found.
                                        </td>
                                    </tr>
                                ) : null}

                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-black/60">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Modal */}
            {open ? (
                <div
                    className="fixed inset-0 z-999 bg-black/40 p-4 sm:p-6 flex items-center justify-center"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 border-b border-black/10 px-5 py-4">
                            <div>
                                <h3 className="text-lg font-semibold">{mode === "add" ? "Add City" : "Edit City"}</h3>
                                {mode === "edit" && draft.cityId ? (
                                    <p className="text-xs text-black/50">City ID: {draft.cityId}</p>
                                ) : null}
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5 disabled:opacity-60"
                                aria-label="Close"
                                title="Close"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-5">
                            <div className="grid gap-4">
                                <div>
                                    <label className={labelCls}>
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={draft.stateId === "" ? "" : String(draft.stateId)}
                                        onChange={(e) => setDraft({ ...draft, stateId: Number(e.target.value) })}
                                        className={`${inputCls} mt-2`}
                                        disabled={saving}
                                    >
                                        <option value="">Select state</option>
                                        {states.map((s) => (
                                            <option key={s.stateId} value={String(s.stateId)}>
                                                {s.stateName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelCls}>
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={draft.cityName}
                                        onChange={(e) => setDraft({ ...draft, cityName: e.target.value })}
                                        placeholder="Enter city"
                                        className={`${inputCls} mt-2`}
                                        disabled={saving}
                                    />
                                </div>

                                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-black/10 px-5 py-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={saveCity}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                            >
                                <FiPlus className="text-base" />
                                {saving ? "Saving..." : mode === "add" ? "Add" : "Update"}
                            </button>
                        </div>

                        
                    </div>
                </div>
            ) : null}
        </main>
    );
}

