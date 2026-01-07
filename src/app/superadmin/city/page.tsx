// // "use client";

// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave } from "react-icons/fi";

// // type StateItem = {
// //     id: string;
// //     name: string;
// // };

// // type CityItem = {
// //     id: string;
// //     stateId: string;
// //     cityName: string;
// //     createdAt: string; // dummy display
// // };

// // const inputCls =
// //     "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// // const labelCls = "text-sm font-medium text-black";

// // export default function CityMasterPage() {
// //     // Dummy states (API later)
// //     const states: StateItem[] = useMemo(
// //         () => [
// //             { id: "ST-1", name: "Gujarat" },
// //             { id: "ST-2", name: "Maharashtra" },
// //             { id: "ST-3", name: "Rajasthan" },
// //             { id: "ST-4", name: "Madhya Pradesh" },
// //         ],
// //         []
// //     );

// //     // Dummy cities (API later)
// //     const [cities, setCities] = useState<CityItem[]>([
// //         { id: "CT-1001", stateId: "ST-1", cityName: "Ahmedabad", createdAt: "2 hours ago" },
// //         { id: "CT-1002", stateId: "ST-1", cityName: "Surat", createdAt: "Yesterday" },
// //         { id: "CT-1003", stateId: "ST-1", cityName: "Vadodara", createdAt: "2 days ago" },
// //         { id: "CT-1004", stateId: "ST-2", cityName: "Mumbai", createdAt: "4 days ago" },
// //     ]);

// //     // Add form
// //     const [stateId, setStateId] = useState<string>("");
// //     const [cityName, setCityName] = useState<string>("");
// //     const [error, setError] = useState<string>("");

// //     // Filters
// //     const [search, setSearch] = useState("");
// //     const [stateFilter, setStateFilter] = useState<string | "All">("All");

// //     // Edit modal
// //     const [editOpen, setEditOpen] = useState(false);
// //     const [editItem, setEditItem] = useState<CityItem | null>(null);

// //     const addFormRef = useRef<HTMLDivElement | null>(null);

// //     const stateNameById = useMemo(() => {
// //         const map = new Map<string, string>();
// //         states.forEach((s) => map.set(s.id, s.name));
// //         return map;
// //     }, [states]);

// //     const filtered = useMemo(() => {
// //         const s = search.trim().toLowerCase();

// //         return cities.filter((c) => {
// //             const stateOk = stateFilter === "All" ? true : c.stateId === stateFilter;

// //             const stName = (stateNameById.get(c.stateId) || "").toLowerCase();
// //             const city = c.cityName.toLowerCase();

// //             const searchOk =
// //                 !s ||
// //                 city.includes(s) ||
// //                 stName.includes(s) ||
// //                 c.id.toLowerCase().includes(s);

// //             return stateOk && searchOk;
// //         });
// //     }, [cities, search, stateFilter, stateNameById]);

// //     const resetAdd = () => {
// //         setStateId("");
// //         setCityName("");
// //         setError("");
// //     };

// //     const addCity = (e: React.FormEvent) => {
// //         e.preventDefault();
// //         setError("");

// //         if (!stateId) return setError("Please select State.");
// //         if (!cityName.trim()) return setError("Please enter City name.");

// //         // duplicate check (state+city)
// //         const exists = cities.some(
// //             (c) =>
// //                 c.stateId === stateId &&
// //                 c.cityName.trim().toLowerCase() === cityName.trim().toLowerCase()
// //         );
// //         if (exists) return setError("This city already exists in selected state.");

// //         const newItem: CityItem = {
// //             id: `CT-${Math.floor(1000 + Math.random() * 9000)}`,
// //             stateId,
// //             cityName: cityName.trim(),
// //             createdAt: "Just now",
// //         };

// //         setCities((prev) => [newItem, ...prev]);
// //         resetAdd();
// //     };

// //     const openEdit = (item: CityItem) => {
// //         setEditItem({ ...item });
// //         setEditOpen(true);
// //     };

// //     const closeEdit = () => {
// //         setEditOpen(false);
// //         setEditItem(null);
// //     };

// //     const updateCity = () => {
// //         if (!editItem) return;

// //         if (!editItem.stateId) return alert("Please select State");
// //         if (!editItem.cityName.trim()) return alert("Please enter City name");

// //         const exists = cities.some(
// //             (c) =>
// //                 c.id !== editItem.id &&
// //                 c.stateId === editItem.stateId &&
// //                 c.cityName.trim().toLowerCase() === editItem.cityName.trim().toLowerCase()
// //         );
// //         if (exists) return alert("This city already exists in selected state.");

// //         setCities((prev) => prev.map((c) => (c.id === editItem.id ? editItem : c)));
// //         closeEdit();
// //     };

// //     const deleteCity = (id: string) => {
// //         const ok = window.confirm("Are you sure you want to delete this city?");
// //         if (!ok) return;
// //         setCities((prev) => prev.filter((c) => c.id !== id));
// //     };

// //     return (
// //         <main className="min-h-screen bg-[#f6f7fb] text-black">
// //             <div className="mx-auto w-full max-w-7xl px-4 py-8">
// //                 {/* Header */}
// //                 <div className="flex items-start justify-between gap-3">
// //                     <div className="flex flex-col gap-1">
// //                         <h1 className="text-2xl font-semibold tracking-tight">City Master</h1>
// //                         <p className="text-sm text-black/60">Add, edit and delete cities.</p>
// //                     </div>

// //                     <button
// //                         type="button"
// //                         onClick={() => addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
// //                         className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
// //                     >
// //                         <FiPlus className="text-base" />
// //                         Add City
// //                     </button>
// //                 </div>

// //                 {/* Add City */}
// //                 <section ref={addFormRef} className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
// //                     <div className="flex items-center justify-between gap-3">
// //                         <div>
// //                             <h2 className="text-base font-semibold">Add City</h2>
// //                             <p className="mt-1 text-sm text-black/60">Select state and enter city name.</p>
// //                         </div>

// //                         <button
// //                             type="button"
// //                             onClick={resetAdd}
// //                             className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
// //                         >
// //                             Clear
// //                         </button>
// //                     </div>

// //                     <form onSubmit={addCity} className="mt-5 grid gap-4 sm:grid-cols-12 sm:items-end">
// //                         <div className="sm:col-span-5">
// //                             <label className={labelCls}>State <span className="text-red-500">*</span></label>
// //                             <select
// //                                 value={stateId}
// //                                 onChange={(e) => setStateId(e.target.value)}
// //                                 className={`${inputCls} mt-2`}
// //                             >
// //                                 <option value="">Select state</option>
// //                                 {states.map((s) => (
// //                                     <option key={s.id} value={s.id}>
// //                                         {s.name}
// //                                     </option>
// //                                 ))}
// //                             </select>
// //                         </div>

// //                         <div className="sm:col-span-5">
// //                             <label className={labelCls}>City <span className="text-red-500">*</span></label>
// //                             <input
// //                                 value={cityName}
// //                                 onChange={(e) => setCityName(e.target.value)}
// //                                 placeholder="Enter city name"
// //                                 className={`${inputCls} mt-2`}
// //                             />
// //                         </div>

// //                         <div className="sm:col-span-2">
// //                             <button
// //                                 type="submit"
// //                                 className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
// //                             >
// //                                 <FiPlus className="text-base" />
// //                                 Add
// //                             </button>
// //                         </div>

// //                         {error ? (
// //                             <div className="sm:col-span-12">
// //                                 <p className="text-sm text-red-600">{error}</p>
// //                             </div>
// //                         ) : null}
// //                     </form>
// //                 </section>

// //                 {/* Filters */}
// //                 <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
// //                     <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
// //                         <div className="sm:col-span-8">
// //                             <label className={labelCls}>Search</label>
// //                             <input
// //                                 value={search}
// //                                 onChange={(e) => setSearch(e.target.value)}
// //                                 placeholder="Search by city / state / id..."
// //                                 className={`${inputCls} mt-2`}
// //                             />
// //                         </div>

// //                         <div className="sm:col-span-4">
// //                             <label className={labelCls}>State Filter</label>
// //                             <select
// //                                 value={stateFilter}
// //                                 onChange={(e) => setStateFilter(e.target.value as any)}
// //                                 className={`${inputCls} mt-2`}
// //                             >
// //                                 <option value="All">All</option>
// //                                 {states.map((s) => (
// //                                     <option key={s.id} value={s.id}>
// //                                         {s.name}
// //                                     </option>
// //                                 ))}
// //                             </select>
// //                         </div>
// //                     </div>
// //                 </section>

// //                 {/* Listing Table */}
// //                 <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
// //                     <div className="overflow-x-auto">
// //                         <table className="min-w-[820px] w-full">
// //                             <thead className="bg-black/[0.03]">
// //                                 <tr className="text-left text-sm font-semibold text-black">
// //                                     <th className="px-4 py-3">ID</th>
// //                                     <th className="px-4 py-3">State</th>
// //                                     <th className="px-4 py-3">City</th>
// //                                     <th className="px-4 py-3">Created</th>
// //                                     <th className="px-4 py-3 text-right">Actions</th>
// //                                 </tr>
// //                             </thead>

// //                             <tbody className="divide-y divide-black/10">
// //                                 {filtered.map((c) => (
// //                                     <tr key={c.id} className="hover:bg-black/[0.02]">
// //                                         <td className="px-4 py-3 text-sm text-black/70">{c.id}</td>
// //                                         <td className="px-4 py-3 text-sm font-semibold text-black">
// //                                             {stateNameById.get(c.stateId) || "—"}
// //                                         </td>
// //                                         <td className="px-4 py-3 text-sm text-black/80">{c.cityName}</td>
// //                                         <td className="px-4 py-3 text-sm text-black/60">{c.createdAt}</td>

// //                                         <td className="px-4 py-3">
// //                                             <div className="flex justify-end gap-2">
// //                                                 <button
// //                                                     type="button"
// //                                                     onClick={() => openEdit(c)}
// //                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
// //                                                     aria-label="Edit city"
// //                                                     title="Edit"
// //                                                 >
// //                                                     <FiEdit2 className="text-lg" />
// //                                                 </button>

// //                                                 <button
// //                                                     type="button"
// //                                                     onClick={() => deleteCity(c.id)}
// //                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
// //                                                     aria-label="Delete city"
// //                                                     title="Delete"
// //                                                 >
// //                                                     <FiTrash2 className="text-lg" />
// //                                                 </button>
// //                                             </div>
// //                                         </td>
// //                                     </tr>
// //                                 ))}

// //                                 {filtered.length === 0 ? (
// //                                     <tr>
// //                                         <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
// //                                             No cities found.
// //                                         </td>
// //                                     </tr>
// //                                 ) : null}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </section>

// //                 {/* Mobile Add Button */}
// //                 <button
// //                     type="button"
// //                     onClick={() => addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
// //                     className="mt-6 inline-flex w-full sm:hidden items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
// //                 >
// //                     <FiPlus className="text-base" />
// //                     Add City
// //                 </button>
// //             </div>

// //             {/* Edit Modal */}
// //             {editOpen && editItem ? (
// //                 <EditCityModal
// //                     item={editItem}
// //                     states={states}
// //                     onChange={setEditItem}
// //                     onClose={closeEdit}
// //                     onUpdate={updateCity}
// //                 />
// //             ) : null}
// //         </main>
// //     );
// // }

// // function EditCityModal({
// //     item,
// //     states,
// //     onChange,
// //     onClose,
// //     onUpdate,
// // }: {
// //     item: CityItem;
// //     states: StateItem[];
// //     onChange: (next: CityItem) => void;
// //     onClose: () => void;
// //     onUpdate: () => void;
// // }) {
// //     // close on ESC
// //     useEffect(() => {
// //         const onEsc = (e: KeyboardEvent) => {
// //             if (e.key === "Escape") onClose();
// //         };
// //         document.addEventListener("keydown", onEsc);
// //         return () => document.removeEventListener("keydown", onEsc);
// //     }, [onClose]);

// //     return (
// //         <div
// //             className="fixed inset-0 z-[999] bg-black/40 px-4 py-6 sm:py-10"
// //             onMouseDown={(e) => {
// //                 if (e.target === e.currentTarget) onClose();
// //             }}
// //         >
// //             <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
// //                 {/* Header */}
// //                 <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
// //                     <div>
// //                         <p className="text-base font-semibold">Edit City</p>
// //                         <p className="text-xs text-black/50">ID: {item.id}</p>
// //                     </div>

// //                     <button
// //                         type="button"
// //                         onClick={onClose}
// //                         className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
// //                         aria-label="Close"
// //                         title="Close"
// //                     >
// //                         <FiX className="text-lg" />
// //                     </button>
// //                 </div>

// //                 {/* Body */}
// //                 <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
// //                     <div className="grid gap-4 sm:grid-cols-2">
// //                         <div className="sm:col-span-2">
// //                             <label className={labelCls}>State *</label>
// //                             <select
// //                                 value={item.stateId}
// //                                 onChange={(e) => onChange({ ...item, stateId: e.target.value })}
// //                                 className={`${inputCls} mt-2`}
// //                             >
// //                                 <option value="">Select state</option>
// //                                 {states.map((s) => (
// //                                     <option key={s.id} value={s.id}>
// //                                         {s.name}
// //                                     </option>
// //                                 ))}
// //                             </select>
// //                         </div>

// //                         <div className="sm:col-span-2">
// //                             <label className={labelCls}>City *</label>
// //                             <input
// //                                 value={item.cityName}
// //                                 onChange={(e) => onChange({ ...item, cityName: e.target.value })}
// //                                 className={`${inputCls} mt-2`}
// //                                 placeholder="Enter city"
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Footer */}
// //                 <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 sm:flex-row sm:justify-end">
// //                     <button
// //                         type="button"
// //                         onClick={onClose}
// //                         className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
// //                     >
// //                         Cancel
// //                     </button>

// //                     <button
// //                         type="button"
// //                         onClick={onUpdate}
// //                         className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
// //                     >
// //                         <FiSave className="text-base" />
// //                         Update
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }


// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave } from "react-icons/fi";

// type StateItem = { id: string; name: string };

// type CityItem = {
//     id: string;
//     stateId: string;
//     cityName: string;
//     createdAt: string;
// };

// const inputCls =
//     "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";

// export default function CityMasterPage() {
//     // Dummy states (API later)
//     const states: StateItem[] = useMemo(
//         () => [
//             { id: "ST-1", name: "Gujarat" },
//             { id: "ST-2", name: "Maharashtra" },
//             { id: "ST-3", name: "Rajasthan" },
//             { id: "ST-4", name: "Madhya Pradesh" },
//         ],
//         []
//     );

//     // Dummy cities (API later)
//     const [cities, setCities] = useState<CityItem[]>([
//         { id: "CT-1001", stateId: "ST-1", cityName: "Ahmedabad", createdAt: "2 hours ago" },
//         { id: "CT-1002", stateId: "ST-1", cityName: "Surat", createdAt: "Yesterday" },
//         { id: "CT-1003", stateId: "ST-1", cityName: "Vadodara", createdAt: "2 days ago" },
//         { id: "CT-1004", stateId: "ST-2", cityName: "Mumbai", createdAt: "4 days ago" },
//     ]);

//     // Filters
//     const [search, setSearch] = useState("");
//     const [stateFilter, setStateFilter] = useState<string | "All">("All");

//     // ADD modal
//     const [addOpen, setAddOpen] = useState(false);
//     const [addStateId, setAddStateId] = useState("");
//     const [addCityName, setAddCityName] = useState("");
//     const [addError, setAddError] = useState("");

//     // EDIT modal
//     const [editOpen, setEditOpen] = useState(false);
//     const [editItem, setEditItem] = useState<CityItem | null>(null);

//     const stateNameById = useMemo(() => {
//         const map = new Map<string, string>();
//         states.forEach((s) => map.set(s.id, s.name));
//         return map;
//     }, [states]);

//     const filtered = useMemo(() => {
//         const s = search.trim().toLowerCase();

//         return cities.filter((c) => {
//             const stateOk = stateFilter === "All" ? true : c.stateId === stateFilter;
//             const stName = (stateNameById.get(c.stateId) || "").toLowerCase();
//             const city = c.cityName.toLowerCase();

//             const searchOk =
//                 !s ||
//                 city.includes(s) ||
//                 stName.includes(s) ||
//                 c.id.toLowerCase().includes(s);

//             return stateOk && searchOk;
//         });
//     }, [cities, search, stateFilter, stateNameById]);

//     // ---------- ADD ----------
//     const openAdd = () => {
//         setAddStateId("");
//         setAddCityName("");
//         setAddError("");
//         setAddOpen(true);
//     };

//     const closeAdd = () => {
//         setAddOpen(false);
//         setAddError("");
//     };

//     const addCity = () => {
//         setAddError("");

//         if (!addStateId) return setAddError("Please select State.");
//         if (!addCityName.trim()) return setAddError("Please enter City name.");

//         const exists = cities.some(
//             (c) =>
//                 c.stateId === addStateId &&
//                 c.cityName.trim().toLowerCase() === addCityName.trim().toLowerCase()
//         );
//         if (exists) return setAddError("This city already exists in selected state.");

//         const newItem: CityItem = {
//             id: `CT-${Math.floor(1000 + Math.random() * 9000)}`,
//             stateId: addStateId,
//             cityName: addCityName.trim(),
//             createdAt: "Just now",
//         };

//         setCities((prev) => [newItem, ...prev]);
//         closeAdd();
//     };

//     // ---------- EDIT ----------
//     const openEdit = (item: CityItem) => {
//         setEditItem({ ...item });
//         setEditOpen(true);
//     };

//     const closeEdit = () => {
//         setEditOpen(false);
//         setEditItem(null);
//     };

//     const updateCity = () => {
//         if (!editItem) return;

//         if (!editItem.stateId) return alert("Please select State");
//         if (!editItem.cityName.trim()) return alert("Please enter City name");

//         const exists = cities.some(
//             (c) =>
//                 c.id !== editItem.id &&
//                 c.stateId === editItem.stateId &&
//                 c.cityName.trim().toLowerCase() === editItem.cityName.trim().toLowerCase()
//         );
//         if (exists) return alert("This city already exists in selected state.");

//         setCities((prev) => prev.map((c) => (c.id === editItem.id ? editItem : c)));
//         closeEdit();
//     };

//     const deleteCity = (id: string) => {
//         const ok = window.confirm("Are you sure you want to delete this city?");
//         if (!ok) return;
//         setCities((prev) => prev.filter((c) => c.id !== id));
//     };

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-7xl px-4 py-8">
//                 {/* Header */}
//                 <div className="flex items-start justify-between gap-3">
//                     <div className="flex flex-col gap-1">
//                         <h1 className="text-2xl font-semibold tracking-tight">City Master</h1>
//                         <p className="text-sm text-black/60">Add, edit and delete cities.</p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={openAdd}
//                         className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         <FiPlus className="text-base" />
//                         Add City
//                     </button>
//                 </div>

//                 {/* Filters */}
//                 <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//                     <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//                         <div className="sm:col-span-8">
//                             <label className={labelCls}>Search</label>
//                             <input
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Search by city / state / id..."
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div className="sm:col-span-4">
//                             <label className={labelCls}>State Filter</label>
//                             <select
//                                 value={stateFilter}
//                                 onChange={(e) => setStateFilter(e.target.value as any)}
//                                 className={`${inputCls} mt-2`}
//                             >
//                                 <option value="All">All</option>
//                                 {states.map((s) => (
//                                     <option key={s.id} value={s.id}>
//                                         {s.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Listing Table */}
//                 <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-[820px] w-full">
//                             <thead className="bg-black/[0.03]">
//                                 <tr className="text-left text-sm font-semibold text-black">
//                                     <th className="px-4 py-3">ID</th>
//                                     <th className="px-4 py-3">State</th>
//                                     <th className="px-4 py-3">City</th>
//                                     <th className="px-4 py-3">Created</th>
//                                     <th className="px-4 py-3 text-right">Actions</th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-black/10">
//                                 {filtered.map((c) => (
//                                     <tr key={c.id} className="hover:bg-black/[0.02]">
//                                         <td className="px-4 py-3 text-sm text-black/70">{c.id}</td>
//                                         <td className="px-4 py-3 text-sm font-semibold text-black">
//                                             {stateNameById.get(c.stateId) || "—"}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-black/80">{c.cityName}</td>
//                                         <td className="px-4 py-3 text-sm text-black/60">{c.createdAt}</td>

//                                         <td className="px-4 py-3">
//                                             <div className="flex justify-end gap-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => openEdit(c)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                                                     aria-label="Edit city"
//                                                     title="Edit"
//                                                 >
//                                                     <FiEdit2 className="text-lg" />
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     onClick={() => deleteCity(c.id)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                                                     aria-label="Delete city"
//                                                     title="Delete"
//                                                 >
//                                                     <FiTrash2 className="text-lg" />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}

//                                 {filtered.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
//                                             No cities found.
//                                         </td>
//                                     </tr>
//                                 ) : null}
//                             </tbody>
//                         </table>
//                     </div>
//                 </section>

//                 {/* Mobile Add Button */}
//                 <button
//                     type="button"
//                     onClick={openAdd}
//                     className="mt-6 inline-flex w-full sm:hidden items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
//                 >
//                     <FiPlus className="text-base" />
//                     Add City
//                 </button>
//             </div>

//             {/* ADD Modal */}
//             {addOpen ? (
//                 <AddCityModal
//                     states={states}
//                     stateId={addStateId}
//                     cityName={addCityName}
//                     error={addError}
//                     onStateChange={setAddStateId}
//                     onCityChange={setAddCityName}
//                     onClose={closeAdd}
//                     onAdd={addCity}
//                 />
//             ) : null}

//             {/* EDIT Modal */}
//             {editOpen && editItem ? (
//                 <EditCityModal
//                     item={editItem}
//                     states={states}
//                     onChange={setEditItem}
//                     onClose={closeEdit}
//                     onUpdate={updateCity}
//                 />
//             ) : null}
//         </main>
//     );
// }

// function AddCityModal({
//     states,
//     stateId,
//     cityName,
//     error,
//     onStateChange,
//     onCityChange,
//     onClose,
//     onAdd,
// }: {
//     states: StateItem[];
//     stateId: string;
//     cityName: string;
//     error: string;
//     onStateChange: (v: string) => void;
//     onCityChange: (v: string) => void;
//     onClose: () => void;
//     onAdd: () => void;
// }) {
//     useEffect(() => {
//         const onEsc = (e: KeyboardEvent) => {
//             if (e.key === "Escape") onClose();
//         };
//         document.addEventListener("keydown", onEsc);
//         return () => document.removeEventListener("keydown", onEsc);
//     }, [onClose]);

//     return (
//         <div
//             className="fixed inset-0 z-[999] bg-black/40 px-4 py-6 sm:py-10"
//             onMouseDown={(e) => {
//                 if (e.target === e.currentTarget) onClose();
//             }}
//         >
//             <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
//                 {/* Header */}
//                 <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
//                     <div>
//                         <p className="text-base font-semibold">Add City</p>
//                         <p className="text-xs text-black/50">Select state and enter city name</p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
//                         aria-label="Close"
//                         title="Close"
//                     >
//                         <FiX className="text-lg" />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="px-5 py-5">
//                     <div className="grid gap-4">
//                         <div>
//                             <label className={labelCls}>State *</label>
//                             <select
//                                 value={stateId}
//                                 onChange={(e) => onStateChange(e.target.value)}
//                                 className={`${inputCls} mt-2`}
//                             >
//                                 <option value="">Select state</option>
//                                 {states.map((s) => (
//                                     <option key={s.id} value={s.id}>
//                                         {s.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label className={labelCls}>City *</label>
//                             <input
//                                 value={cityName}
//                                 onChange={(e) => onCityChange(e.target.value)}
//                                 className={`${inputCls} mt-2`}
//                                 placeholder="Enter city"
//                             />
//                         </div>

//                         {error ? <p className="text-sm text-red-600">{error}</p> : null}
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 sm:flex-row sm:justify-end">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         type="button"
//                         onClick={onAdd}
//                         className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         <FiPlus className="text-base" />
//                         Add
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function EditCityModal({
//     item,
//     states,
//     onChange,
//     onClose,
//     onUpdate,
// }: {
//     item: CityItem;
//     states: StateItem[];
//     onChange: (next: CityItem) => void;
//     onClose: () => void;
//     onUpdate: () => void;
// }) {
//     useEffect(() => {
//         const onEsc = (e: KeyboardEvent) => {
//             if (e.key === "Escape") onClose();
//         };
//         document.addEventListener("keydown", onEsc);
//         return () => document.removeEventListener("keydown", onEsc);
//     }, [onClose]);

//     return (
//         <div
//             className="fixed inset-0 z-[999] bg-black/40 px-4 py-6 sm:py-10"
//             onMouseDown={(e) => {
//                 if (e.target === e.currentTarget) onClose();
//             }}
//         >
//             <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
//                 {/* Header */}
//                 <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
//                     <div>
//                         <p className="text-base font-semibold">Edit City</p>
//                         <p className="text-xs text-black/50">ID: {item.id}</p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
//                         aria-label="Close"
//                         title="Close"
//                     >
//                         <FiX className="text-lg" />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="px-5 py-5">
//                     <div className="grid gap-4">
//                         <div>
//                             <label className={labelCls}>State *</label>
//                             <select
//                                 value={item.stateId}
//                                 onChange={(e) => onChange({ ...item, stateId: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                             >
//                                 <option value="">Select state</option>
//                                 {states.map((s) => (
//                                     <option key={s.id} value={s.id}>
//                                         {s.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div>
//                             <label className={labelCls}>City *</label>
//                             <input
//                                 value={item.cityName}
//                                 onChange={(e) => onChange({ ...item, cityName: e.target.value })}
//                                 className={`${inputCls} mt-2`}
//                                 placeholder="Enter city"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 sm:flex-row sm:justify-end">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         type="button"
//                         onClick={onUpdate}
//                         className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         <FiSave className="text-base" />
//                         Update
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


// app/superadmin/city/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

type CityItem = {
    id: string;
    state: string;
    city: string;
    createdAt: string;
};

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

export default function CityMasterPage() {
    // Dummy state list (API later)
    const states = ["Gujarat", "Maharashtra", "Rajasthan", "Delhi", "MP"];

    // Dummy cities list (API later)
    const [cities, setCities] = useState<CityItem[]>([
        { id: "CT-1001", state: "Gujarat", city: "Ahmedabad", createdAt: "2 hours ago" },
        { id: "CT-1002", state: "Gujarat", city: "Surat", createdAt: "Yesterday" },
        { id: "CT-1003", state: "Gujarat", city: "Vadodara", createdAt: "2 days ago" },
        { id: "CT-1004", state: "Maharashtra", city: "Mumbai", createdAt: "4 days ago" },
    ]);

    // Filters
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState<string | "All">("All");

    // Modal (Add/Edit)
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [draft, setDraft] = useState<{ id?: string; state: string; city: string }>({
        state: "",
        city: "",
    });

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return cities.filter((c) => {
            const stateOk = stateFilter === "All" ? true : c.state === stateFilter;
            const searchOk =
                !s ||
                c.city.toLowerCase().includes(s) ||
                c.state.toLowerCase().includes(s) ||
                c.id.toLowerCase().includes(s);
            return stateOk && searchOk;
        });
    }, [cities, search, stateFilter]);

    const openAdd = () => {
        setMode("add");
        setDraft({ state: "", city: "" });
        setOpen(true);
    };

    const openEdit = (item: CityItem) => {
        setMode("edit");
        setDraft({ id: item.id, state: item.state, city: item.city });
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setDraft({ state: "", city: "" });
    };

    const saveCity = () => {
        const state = draft.state.trim();
        const city = draft.city.trim();

        if (!state) return alert("Please select state");
        if (!city) return alert("Please enter city");

        // Duplicate check (same state + city)
        const dup = cities.some(
            (x) =>
                x.state.toLowerCase() === state.toLowerCase() &&
                x.city.toLowerCase() === city.toLowerCase() &&
                (mode === "add" ? true : x.id !== draft.id)
        );
        if (dup) return alert("This city already exists in selected state.");

        if (mode === "add") {
            const newItem: CityItem = {
                id: `CT-${Math.floor(1000 + Math.random() * 9000)}`,
                state,
                city,
                createdAt: "Just now",
            };
            setCities((prev) => [newItem, ...prev]);
        } else {
            setCities((prev) =>
                prev.map((x) =>
                    x.id === draft.id ? { ...x, state, city } : x
                )
            );
        }

        closeModal();
    };

    const deleteCity = (id: string) => {
        const ok = window.confirm("Are you sure you want to delete this city?");
        if (!ok) return;
        setCities((prev) => prev.filter((x) => x.id !== id));
    };

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
                        <div className="sm:col-span-8">
                            <label className={labelCls}>Search</label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by city / state / id..."
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div className="sm:col-span-4">
                            <label className={labelCls}>State</label>
                            <select
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value as any)}
                                className={`${inputCls} mt-2`}
                            >
                                <option value="All">All</option>
                                {states.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Table */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-[900px] w-full">
                            <thead className="bg-black/[0.03]">
                                <tr className="text-left text-sm font-semibold text-black">
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">State</th>
                                    <th className="px-4 py-3">City</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-black/[0.02]">
                                        <td className="px-4 py-3 text-sm text-black/70">{c.id}</td>
                                        <td className="px-4 py-3 font-semibold">{c.state}</td>
                                        <td className="px-4 py-3 text-sm text-black/70">{c.city}</td>
                                        <td className="px-4 py-3 text-sm text-black/60">{c.createdAt}</td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(c)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
                                                    aria-label="Edit"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="text-lg" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteCity(c.id)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
                                                    aria-label="Delete"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
                                            No cities found.
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
                <CityModal
                    mode={mode}
                    draft={draft}
                    setDraft={setDraft}
                    states={states}
                    onClose={closeModal}
                    onSave={saveCity}
                />
            ) : null}
        </main>
    );
}

function CityModal({
    mode,
    draft,
    setDraft,
    states,
    onClose,
    onSave,
}: {
    mode: "add" | "edit";
    draft: { id?: string; state: string; city: string };
    setDraft: (next: { id?: string; state: string; city: string }) => void;
    states: string[];
    onClose: () => void;
    onSave: () => void;
}) {
    const panelRef = useRef<HTMLDivElement | null>(null);

    // ESC close
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    return (
        <div
            className="
        fixed inset-0 z-[999]
        bg-black/40
        p-4 sm:p-6
        flex items-center justify-center
      "
            onMouseDown={(e) => {
                // click outside
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={panelRef}
                className="
          w-full max-w-2xl
          overflow-hidden
          rounded-2xl
          border border-black/10
          bg-white
          shadow-xl
        "
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-black/10 px-5 py-4">
                    <div>
                        <h3 className="text-lg font-semibold">{mode === "add" ? "Add City" : "Edit City"}</h3>
                        <p className="text-sm text-black/60">Select state and enter city name</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5"
                        aria-label="Close"
                        title="Close"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                {/* Body (scroll inside) */}
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-5 py-5">
                    <div className="grid gap-4">
                        <div>
                            <label className="text-sm font-medium text-black">
                                State <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={draft.state}
                                onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select state</option>
                                {states.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-black">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={draft.city}
                                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                                placeholder="Enter city"
                                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-black/10 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-black/5"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                    >
                        <FiPlus className="text-base" />
                        {mode === "add" ? "Add" : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
