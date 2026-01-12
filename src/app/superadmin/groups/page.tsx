// // "use client";

// // import React, { useMemo, useState } from "react";

// // type Group = {
// //     id: string;
// //     name: string;
// //     description: string;
// //     membersCount: number;
// //     isActive: boolean;
// //     updatedAt: string; // ISO
// // };

// // type StatusFilter = "all" | "active" | "inactive";

// // const initialGroups: Group[] = [
// //     {
// //         id: "g1",
// //         name: "Apollo Coders Community",
// //         description: "Developers group for sharing events, meetups, and updates.",
// //         membersCount: 34,
// //         isActive: true,
// //         updatedAt: new Date().toISOString(),
// //     },
// //     {
// //         id: "g2",
// //         name: "Marketing Team",
// //         description: "Internal marketing announcements and weekly sync.",
// //         membersCount: 12,
// //         isActive: false,
// //         updatedAt: new Date().toISOString(),
// //     },
// // ];

// // function makeId(): string {
// //     if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
// //         return (crypto as Crypto).randomUUID();
// //     }
// //     return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
// // }

// // function formatDate(iso: string): string {
// //     return new Date(iso).toLocaleString();
// // }

// // type GroupPayload = Pick<Group, "name" | "description" | "membersCount" | "isActive">;

// // type GroupModalProps = {
// //     initial: Group | null;
// //     onClose: () => void;
// //     onSave: (payload: GroupPayload) => void;
// // };

// // type ConfirmDialogProps = {
// //     title: string;
// //     message: string;
// //     onCancel: () => void;
// //     onConfirm: () => void;
// // };

// // function Toggle({
// //     checked,
// //     onChange,
// //     label,
// // }: {
// //     checked: boolean;
// //     onChange: (next: boolean) => void;
// //     label?: string;
// // }) {
// //     return (
// //         <button
// //             type="button"
// //             aria-label={label ?? "Toggle"}
// //             aria-pressed={checked}
// //             onClick={() => onChange(!checked)}
// //             className={[
// //                 "relative inline-flex h-7 w-12 items-center rounded-full ring-1 transition",
// //                 checked
// //                     ? "bg-primary ring-primary/30"
// //                     : "bg-slate-200 ring-slate-300 hover:bg-slate-300",
// //             ].join(" ")}
// //         >
// //             <span
// //                 className={[
// //                     "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition",
// //                     checked ? "translate-x-6" : "translate-x-1",
// //                 ].join(" ")}
// //             />
// //         </button>
// //     );
// // }

// // export default function GroupsMasterPage() {
// //     const [groups, setGroups] = useState<Group[]>(initialGroups);

// //     const [search, setSearch] = useState("");
// //     const [status, setStatus] = useState<StatusFilter>("all");

// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [editing, setEditing] = useState<Group | null>(null);
// //     const [confirmDelete, setConfirmDelete] = useState<Group | null>(null);

// //     const counts = useMemo(() => {
// //         const active = groups.filter((g) => g.isActive).length;
// //         const inactive = groups.length - active;
// //         return { total: groups.length, active, inactive };
// //     }, [groups]);

// //     const filtered = useMemo(() => {
// //         const q = search.trim().toLowerCase();

// //         let data = [...groups];

// //         if (q) {
// //             data = data.filter(
// //                 (g) =>
// //                     g.name.toLowerCase().includes(q) ||
// //                     g.description.toLowerCase().includes(q)
// //             );
// //         }

// //         if (status === "active") data = data.filter((g) => g.isActive);
// //         if (status === "inactive") data = data.filter((g) => !g.isActive);

// //         data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
// //         return data;
// //     }, [groups, search, status]);

// //     function openAdd() {
// //         setEditing(null);
// //         setIsModalOpen(true);
// //     }

// //     function openEdit(g: Group) {
// //         setEditing(g);
// //         setIsModalOpen(true);
// //     }

// //     function saveGroup(payload: GroupPayload) {
// //         const nowIso = new Date().toISOString();

// //         if (!editing) {
// //             const newItem: Group = {
// //                 id: makeId(),
// //                 ...payload,
// //                 updatedAt: nowIso,
// //             };
// //             setGroups((prev) => [newItem, ...prev]);
// //             setIsModalOpen(false);
// //             return;
// //         }

// //         setGroups((prev) =>
// //             prev.map((x) =>
// //                 x.id === editing.id ? { ...x, ...payload, updatedAt: nowIso } : x
// //             )
// //         );

// //         setIsModalOpen(false);
// //         setEditing(null);
// //     }

// //     function toggleActive(id: string, next: boolean) {
// //         const nowIso = new Date().toISOString();
// //         setGroups((prev) =>
// //             prev.map((g) => (g.id === id ? { ...g, isActive: next, updatedAt: nowIso } : g))
// //         );
// //     }

// //     function doDelete(g: Group) {
// //         setGroups((prev) => prev.filter((x) => x.id !== g.id));
// //         setConfirmDelete(null);
// //     }

// //     return (
// //         <div className="min-h-screen bg-slate-50 p-6">
// //             <div className="mx-auto max-w-6xl">
// //                 {/* Header */}
// //                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //                     <div>
// //                         <h1 className="text-2xl font-semibold text-slate-900">Groups Master</h1>
// //                         <p className="text-slate-600">Add, update, and manage groups.</p>
// //                     </div>

// //                     <button
// //                         onClick={openAdd}
// //                         className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
// //                     >
// //                         + Create Group
// //                     </button>
// //                 </div>

// //                 {/* KPI row (same card vibe) */}
// //                 <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
// //                     <KpiCard title="Total" value={counts.total} />
// //                     <KpiCard title="Active" value={counts.active} />
// //                     <KpiCard title="Inactive" value={counts.inactive} />
// //                 </div>

// //                 {/* List Card */}
// //                 <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
// //                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //                         <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
// //                             <input
// //                                 value={search}
// //                                 onChange={(e) => setSearch(e.target.value)}
// //                                 placeholder="Search groups..."
// //                                 className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-sm"
// //                             />

// //                             <div className="inline-flex w-full items-center gap-2 sm:w-auto">
// //                                 <FilterPill active={status === "all"} onClick={() => setStatus("all")}>
// //                                     All
// //                                 </FilterPill>
// //                                 <FilterPill active={status === "active"} onClick={() => setStatus("active")}>
// //                                     Active
// //                                 </FilterPill>
// //                                 <FilterPill active={status === "inactive"} onClick={() => setStatus("inactive")}>
// //                                     Inactive
// //                                 </FilterPill>
// //                             </div>
// //                         </div>

// //                         <div className="text-sm text-slate-600">
// //                             Showing{" "}
// //                             <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
// //                             groups
// //                         </div>
// //                     </div>

// //                     <div className="mt-4 overflow-x-auto">
// //                         <table className="w-full text-left text-sm">
// //                             <thead className="text-slate-600">
// //                                 <tr className="border-b border-slate-200">
// //                                     <th className="py-3 pr-3">Group</th>
// //                                     <th className="py-3 pr-3">Members</th>
// //                                     <th className="py-3 pr-3">Status</th>
// //                                     <th className="py-3 pr-3">Updated</th>
// //                                     <th className="py-3 text-right">Actions</th>
// //                                 </tr>
// //                             </thead>

// //                             <tbody>
// //                                 {filtered.length === 0 ? (
// //                                     <tr>
// //                                         <td colSpan={5} className="py-10 text-center text-slate-500">
// //                                             No groups found.
// //                                         </td>
// //                                     </tr>
// //                                 ) : (
// //                                     filtered.map((g) => (
// //                                         <tr key={g.id} className="border-b border-slate-100">
// //                                             <td className="py-3 pr-3">
// //                                                 <div className="min-w-[240px]">
// //                                                     <div className="font-semibold text-slate-900">{g.name}</div>
// //                                                     <div className="mt-0.5 max-w-xl truncate text-slate-600">
// //                                                         {g.description}
// //                                                     </div>
// //                                                 </div>
// //                                             </td>

// //                                             <td className="py-3 pr-3 text-slate-700">{g.membersCount}</td>

// //                                             <td className="py-3 pr-3">
// //                                                 <div className="flex items-center gap-3">
// //                                                     <Toggle
// //                                                         checked={g.isActive}
// //                                                         onChange={(next) => toggleActive(g.id, next)}
// //                                                         label={`Set ${g.name} ${g.isActive ? "inactive" : "active"}`}
// //                                                     />
// //                                                     <span
// //                                                         className={[
// //                                                             "inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1",
// //                                                             g.isActive
// //                                                                 ? "bg-primary/10 text-primary ring-primary/20"
// //                                                                 : "bg-slate-100 text-slate-700 ring-slate-200",
// //                                                         ].join(" ")}
// //                                                     >
// //                                                         {g.isActive ? "Active" : "Inactive"}
// //                                                     </span>
// //                                                 </div>
// //                                             </td>

// //                                             <td className="py-3 pr-3 text-slate-600">{formatDate(g.updatedAt)}</td>

// //                                             <td className="py-3 text-right">
// //                                                 <div className="inline-flex gap-2">
// //                                                     <button
// //                                                         onClick={() => openEdit(g)}
// //                                                         className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
// //                                                     >
// //                                                         Edit
// //                                                     </button>

// //                                                     <button
// //                                                         onClick={() => setConfirmDelete(g)}
// //                                                         className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
// //                                                     >
// //                                                         Delete
// //                                                     </button>
// //                                                 </div>
// //                                             </td>
// //                                         </tr>
// //                                     ))
// //                                 )}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </div>

// //                 {isModalOpen && (
// //                     <GroupModal
// //                         initial={editing}
// //                         onClose={() => {
// //                             setIsModalOpen(false);
// //                             setEditing(null);
// //                         }}
// //                         onSave={saveGroup}
// //                     />
// //                 )}

// //                 {confirmDelete && (
// //                     <ConfirmDialog
// //                         title="Delete Group?"
// //                         message="This action can’t be undone."
// //                         onCancel={() => setConfirmDelete(null)}
// //                         onConfirm={() => doDelete(confirmDelete)}
// //                     />
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// // /* ---------- UI Parts ---------- */

// // function KpiCard({ title, value }: { title: string; value: number }) {
// //     return (
// //         <div className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
// //             <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-primary" />
// //             <div className="flex items-start justify-between">
// //                 <div>
// //                     <p className="text-sm font-semibold text-slate-900">{title}</p>
// //                     <p className="mt-1 text-xs text-slate-500">Groups</p>
// //                 </div>
// //                 <div className="text-3xl font-semibold text-slate-900">{value}</div>
// //             </div>
// //         </div>
// //     );
// // }

// // function FilterPill({
// //     active,
// //     onClick,
// //     children,
// // }: {
// //     active: boolean;
// //     onClick: () => void;
// //     children: React.ReactNode;
// // }) {
// //     return (
// //         <button
// //             type="button"
// //             onClick={onClick}
// //             className={[
// //                 "rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition",
// //                 active
// //                     ? "bg-primary text-white ring-primary"
// //                     : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
// //             ].join(" ")}
// //         >
// //             {children}
// //         </button>
// //     );
// // }

// // function GroupModal({ initial, onClose, onSave }: GroupModalProps) {
// //     const [name, setName] = useState(initial?.name ?? "");
// //     const [description, setDescription] = useState(initial?.description ?? "");
// //     const [membersCount, setMembersCount] = useState<number>(initial?.membersCount ?? 0);
// //     const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
// //     const [error, setError] = useState("");

// //     function submit() {
// //         if (name.trim().length < 2) return setError("Group name is required (min 2 chars).");
// //         if (description.trim().length < 10)
// //             return setError("Description is required (min 10 chars).");
// //         if (Number.isNaN(membersCount) || membersCount < 0)
// //             return setError("Members count must be 0 or more.");

// //         onSave({
// //             name: name.trim(),
// //             description: description.trim(),
// //             membersCount: Math.floor(membersCount),
// //             isActive,
// //         });
// //     }

// //     return (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
// //             <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
// //                 <div className="flex items-start justify-between gap-4">
// //                     <div>
// //                         <h2 className="text-lg font-semibold text-slate-900">
// //                             {initial ? "Edit Group" : "Create Group"}
// //                         </h2>
// //                         <p className="text-sm text-slate-600">Set group details and status.</p>
// //                     </div>

// //                     <button
// //                         onClick={onClose}
// //                         className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
// //                         aria-label="Close modal"
// //                     >
// //                         ✕
// //                     </button>
// //                 </div>

// //                 <div className="mt-4 space-y-4">
// //                     <div>
// //                         <label className="text-sm font-medium text-slate-800">Group Name</label>
// //                         <input
// //                             value={name}
// //                             onChange={(e) => setName(e.target.value)}
// //                             placeholder="e.g., Pune Developers"
// //                             className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
// //                         />
// //                     </div>

// //                     <div>
// //                         <label className="text-sm font-medium text-slate-800">Description</label>
// //                         <textarea
// //                             value={description}
// //                             onChange={(e) => setDescription(e.target.value)}
// //                             placeholder="Write group description..."
// //                             rows={4}
// //                             className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
// //                         />
// //                         <div className="mt-1 flex justify-between text-xs text-slate-500">
// //                             <span>Min 10 characters</span>
// //                             <span>{description.length}/500</span>
// //                         </div>
// //                     </div>

// //                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                         <div>
// //                             <label className="text-sm font-medium text-slate-800">Members Count</label>
// //                             <input
// //                                 type="number"
// //                                 min={0}
// //                                 value={membersCount}
// //                                 onChange={(e) => setMembersCount(Number(e.target.value))}
// //                                 className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
// //                             />
// //                         </div>

// //                         <div>
// //                             <label className="text-sm font-medium text-slate-800">Status</label>
// //                             <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
// //                                 <Toggle checked={isActive} onChange={setIsActive} label="Toggle active" />
// //                                 <span className="text-sm font-semibold text-slate-800">
// //                                     {isActive ? "Active" : "Inactive"}
// //                                 </span>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {error && (
// //                         <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200">
// //                             {error}
// //                         </div>
// //                     )}
// //                 </div>

// //                 <div className="mt-5 flex justify-end gap-2">
// //                     <button
// //                         onClick={onClose}
// //                         className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
// //                     >
// //                         Cancel
// //                     </button>

// //                     <button
// //                         onClick={submit}
// //                         className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
// //                     >
// //                         {initial ? "Update" : "Save"}
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // function ConfirmDialog({ title, message, onCancel, onConfirm }: ConfirmDialogProps) {
// //     return (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
// //             <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
// //                 <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
// //                 <p className="mt-2 text-sm text-slate-600">{message}</p>

// //                 <div className="mt-5 flex justify-end gap-2">
// //                     <button
// //                         onClick={onCancel}
// //                         className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
// //                     >
// //                         Cancel
// //                     </button>

// //                     <button
// //                         onClick={onConfirm}
// //                         className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
// //                     >
// //                         Delete
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }



// "use client";

// import React, { useMemo, useState } from "react";
// import { FiEdit2, FiTrash2 } from "react-icons/fi";

// type Group = {
//     id: string;
//     name: string;
//     description: string;
//     membersCount: number;
//     isActive: boolean;
//     updatedAt: string; // ISO
// };

// type StatusFilter = "all" | "active" | "inactive";

// const initialGroups: Group[] = [
//     {
//         id: "g1",
//         name: "Apollo Coders Community",
//         description: "Developers group for sharing events, meetups, and updates.",
//         membersCount: 34,
//         isActive: true,
//         updatedAt: new Date().toISOString(),
//     },
//     {
//         id: "g2",
//         name: "Marketing Team",
//         description: "Internal marketing announcements and weekly sync.",
//         membersCount: 12,
//         isActive: false,
//         updatedAt: new Date().toISOString(),
//     },
// ];

// function makeId(): string {
//     if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
//         return (crypto as Crypto).randomUUID();
//     }
//     return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
// }

// function formatDate(iso: string): string {
//     return new Date(iso).toLocaleString();
// }

// type GroupPayload = Pick<Group, "name" | "description" | "membersCount" | "isActive">;

// type GroupModalProps = {
//     initial: Group | null;
//     onClose: () => void;
//     onSave: (payload: GroupPayload) => void;
// };

// type ConfirmDialogProps = {
//     title: string;
//     message: string;
//     onCancel: () => void;
//     onConfirm: () => void;
// };

// function IconEdit(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg viewBox="0 0 24 24" fill="none" {...props}>
//             <path
//                 d="M12 20h9"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//             />
//             <path
//                 d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinejoin="round"
//             />
//         </svg>
//     );
// }

// function IconTrash(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg viewBox="0 0 24 24" fill="none" {...props}>
//             <path
//                 d="M3 6h18"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//             />
//             <path
//                 d="M8 6V4h8v2"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//             />
//             <path
//                 d="M19 6l-1 14H6L5 6"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinejoin="round"
//             />
//             <path
//                 d="M10 11v6M14 11v6"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//             />
//         </svg>
//     );
// }

// function Toggle({
//     checked,
//     onChange,
//     label,
// }: {
//     checked: boolean;
//     onChange: (next: boolean) => void;
//     label?: string;
// }) {
//     return (
//         <button
//             type="button"
//             aria-label={label ?? "Toggle"}
//             aria-pressed={checked}
//             onClick={() => onChange(!checked)}
//             className={[
//                 "relative inline-flex h-7 w-12 items-center rounded-full ring-1 transition",
//                 checked
//                     ? "bg-primary ring-primary/30"
//                     : "bg-slate-200 ring-slate-300 hover:bg-slate-300",
//             ].join(" ")}
//         >
//             <span
//                 className={[
//                     "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition",
//                     checked ? "translate-x-6" : "translate-x-1",
//                 ].join(" ")}
//             />
//         </button>
//     );
// }

// export default function GroupsMasterPage() {
//     const [groups, setGroups] = useState<Group[]>(initialGroups);

//     const [search, setSearch] = useState("");
//     const [status, setStatus] = useState<StatusFilter>("all");

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editing, setEditing] = useState<Group | null>(null);
//     const [confirmDelete, setConfirmDelete] = useState<Group | null>(null);

//     const counts = useMemo(() => {
//         const active = groups.filter((g) => g.isActive).length;
//         const inactive = groups.length - active;
//         return { total: groups.length, active, inactive };
//     }, [groups]);

//     const filtered = useMemo(() => {
//         const q = search.trim().toLowerCase();

//         let data = [...groups];

//         if (q) {
//             data = data.filter(
//                 (g) =>
//                     g.name.toLowerCase().includes(q) ||
//                     g.description.toLowerCase().includes(q)
//             );
//         }

//         if (status === "active") data = data.filter((g) => g.isActive);
//         if (status === "inactive") data = data.filter((g) => !g.isActive);

//         data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
//         return data;
//     }, [groups, search, status]);

//     function openAdd() {
//         setEditing(null);
//         setIsModalOpen(true);
//     }

//     function openEdit(g: Group) {
//         setEditing(g);
//         setIsModalOpen(true);
//     }

//     function saveGroup(payload: GroupPayload) {
//         const nowIso = new Date().toISOString();

//         if (!editing) {
//             const newItem: Group = {
//                 id: makeId(),
//                 ...payload,
//                 updatedAt: nowIso,
//             };
//             setGroups((prev) => [newItem, ...prev]);
//             setIsModalOpen(false);
//             return;
//         }

//         setGroups((prev) =>
//             prev.map((x) =>
//                 x.id === editing.id ? { ...x, ...payload, updatedAt: nowIso } : x
//             )
//         );

//         setIsModalOpen(false);
//         setEditing(null);
//     }

//     function toggleActive(id: string, next: boolean) {
//         const nowIso = new Date().toISOString();
//         setGroups((prev) =>
//             prev.map((g) => (g.id === id ? { ...g, isActive: next, updatedAt: nowIso } : g))
//         );
//     }

//     function doDelete(g: Group) {
//         setGroups((prev) => prev.filter((x) => x.id !== g.id));
//         setConfirmDelete(null);
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 p-6">
//             <div className="mx-auto max-w-6xl">
//                 {/* Header */}
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <h1 className="text-2xl font-semibold text-slate-900">Groups Master</h1>
//                         <p className="text-slate-600">Add, update, and manage groups.</p>
//                     </div>

//                     <button
//                         onClick={openAdd}
//                         className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         + Create Group
//                     </button>
//                 </div>

//                 {/* KPI row */}
//                 <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//                     <KpiCard title="Total" value={counts.total} />
//                     <KpiCard title="Active" value={counts.active} />
//                     <KpiCard title="Inactive" value={counts.inactive} />
//                 </div>

//                 {/* List Card */}
//                 <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
//                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                         <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
//                             <input
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Search groups..."
//                                 className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-sm"
//                             />

//                             <div className="inline-flex w-full items-center gap-2 sm:w-auto">
//                                 <FilterPill active={status === "all"} onClick={() => setStatus("all")}>
//                                     All
//                                 </FilterPill>
//                                 <FilterPill active={status === "active"} onClick={() => setStatus("active")}>
//                                     Active
//                                 </FilterPill>
//                                 <FilterPill active={status === "inactive"} onClick={() => setStatus("inactive")}>
//                                     Inactive
//                                 </FilterPill>
//                             </div>
//                         </div>

//                         <div className="text-sm text-slate-600">
//                             Showing{" "}
//                             <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
//                             groups
//                         </div>
//                     </div>

//                     <div className="mt-4 overflow-x-auto">
//                         <table className="w-full text-left text-sm">
//                             <thead className="text-slate-600">
//                                 <tr className="border-b border-slate-200">
//                                     <th className="py-3 pr-3">Group</th>
//                                     <th className="py-3 pr-3">Members</th>
//                                     <th className="py-3 pr-3">Status</th>
//                                     <th className="py-3 pr-3">Updated</th>
//                                     <th className="py-3 text-right">Actions</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {filtered.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={5} className="py-10 text-center text-slate-500">
//                                             No groups found.
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filtered.map((g) => (
//                                         <tr key={g.id} className="border-b border-slate-100">
//                                             <td className="py-3 pr-3">
//                                                 <div className="min-w-60">
//                                                     <div className="font-semibold text-slate-900">{g.name}</div>
//                                                     <div className="mt-0.5 max-w-xl truncate text-slate-600">
//                                                         {g.description}
//                                                     </div>
//                                                 </div>
//                                             </td>

//                                             <td className="py-3 pr-3 text-slate-700">{g.membersCount}</td>

//                                             <td className="py-3 pr-3">
//                                                 <div className="flex items-center gap-3">
//                                                     <Toggle
//                                                         checked={g.isActive}
//                                                         onChange={(next) => toggleActive(g.id, next)}
//                                                         label={`Set ${g.name} ${g.isActive ? "inactive" : "active"}`}
//                                                     />
//                                                     <span
//                                                         className={[
//                                                             "inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1",
//                                                             g.isActive
//                                                                 ? "bg-primary/10 text-primary ring-primary/20"
//                                                                 : "bg-slate-100 text-slate-700 ring-slate-200",
//                                                         ].join(" ")}
//                                                     >
//                                                         {g.isActive ? "Active" : "Inactive"}
//                                                     </span>
//                                                 </div>
//                                             </td>

//                                             <td className="py-3 pr-3 text-slate-600">{formatDate(g.updatedAt)}</td>

//                                             {/* ✅ ICON ACTIONS */}
//                                             <td className="py-3 text-right">
//                                                 <div className="inline-flex items-center gap-2">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => openEdit(g)}
//                                                         className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                                                         aria-label="Edit event"
//                                                         title="Edit"
//                                                     >
//                                                         <FiEdit2 className="text-lg" />
//                                                     </button>

//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setConfirmDelete(g)}
//                                                         className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                                                         aria-label="Delete event"
//                                                         title="Delete"
//                                                     >
//                                                         <FiTrash2 className="text-lg" />
//                                                     </button>

//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {isModalOpen && (
//                     <GroupModal
//                         initial={editing}
//                         onClose={() => {
//                             setIsModalOpen(false);
//                             setEditing(null);
//                         }}
//                         onSave={saveGroup}
//                     />
//                 )}

//                 {confirmDelete && (
//                     <ConfirmDialog
//                         title="Delete Group?"
//                         message="This action can’t be undone."
//                         onCancel={() => setConfirmDelete(null)}
//                         onConfirm={() => doDelete(confirmDelete)}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }

// /* ---------- UI Parts ---------- */

// function KpiCard({ title, value }: { title: string; value: number }) {
//     return (
//         <div className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
//             <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-primary" />
//             <div className="flex items-start justify-between">
//                 <div>
//                     <p className="text-sm font-semibold text-slate-900">{title}</p>
//                     <p className="mt-1 text-xs text-slate-500">Groups</p>
//                 </div>
//                 <div className="text-3xl font-semibold text-slate-900">{value}</div>
//             </div>
//         </div>
//     );
// }

// function FilterPill({
//     active,
//     onClick,
//     children,
// }: {
//     active: boolean;
//     onClick: () => void;
//     children: React.ReactNode;
// }) {
//     return (
//         <button
//             type="button"
//             onClick={onClick}
//             className={[
//                 "rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition",
//                 active
//                     ? "bg-primary text-white ring-primary"
//                     : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
//             ].join(" ")}
//         >
//             {children}
//         </button>
//     );
// }

// function GroupModal({ initial, onClose, onSave }: GroupModalProps) {
//     const [name, setName] = useState(initial?.name ?? "");
//     const [description, setDescription] = useState(initial?.description ?? "");
//     const [membersCount, setMembersCount] = useState<number>(initial?.membersCount ?? 0);
//     const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
//     const [error, setError] = useState("");

//     function submit() {
//         if (name.trim().length < 2) return setError("Group name is required (min 2 chars).");
//         if (description.trim().length < 10)
//             return setError("Description is required (min 10 chars).");
//         if (Number.isNaN(membersCount) || membersCount < 0)
//             return setError("Members count must be 0 or more.");

//         onSave({
//             name: name.trim(),
//             description: description.trim(),
//             membersCount: Math.floor(membersCount),
//             isActive,
//         });
//     }

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
//             <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
//                 <div className="flex items-start justify-between gap-4">
//                     <div>
//                         <h2 className="text-lg font-semibold text-slate-900">
//                             {initial ? "Edit Group" : "Create Group"}
//                         </h2>
//                         <p className="text-sm text-slate-600">Set group details and status.</p>
//                     </div>

//                     <button
//                         onClick={onClose}
//                         className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
//                         aria-label="Close modal"
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 <div className="mt-4 space-y-4">
//                     <div>
//                         <label className="text-sm font-medium text-slate-800">Group Name</label>
//                         <input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="e.g., Pune Developers"
//                             className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
//                         />
//                     </div>

//                     <div>
//                         <label className="text-sm font-medium text-slate-800">Description</label>
//                         <textarea
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Write group description..."
//                             rows={4}
//                             className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
//                         />
//                         <div className="mt-1 flex justify-between text-xs text-slate-500">
//                             <span>Min 10 characters</span>
//                             <span>{description.length}/500</span>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <div>
//                             <label className="text-sm font-medium text-slate-800">Members Count</label>
//                             <input
//                                 type="number"
//                                 min={0}
//                                 value={membersCount}
//                                 onChange={(e) => setMembersCount(Number(e.target.value))}
//                                 className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
//                             />
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium text-slate-800">Status</label>
//                             <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
//                                 <Toggle checked={isActive} onChange={setIsActive} label="Toggle active" />
//                                 <span className="text-sm font-semibold text-slate-800">
//                                     {isActive ? "Active" : "Inactive"}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {error && (
//                         <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200">
//                             {error}
//                         </div>
//                     )}
//                 </div>

//                 <div className="mt-5 flex justify-end gap-2">
//                     <button
//                         onClick={onClose}
//                         className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         onClick={submit}
//                         className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         {initial ? "Update" : "Save"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function ConfirmDialog({ title, message, onCancel, onConfirm }: ConfirmDialogProps) {
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
//             <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
//                 <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
//                 <p className="mt-2 text-sm text-slate-600">{message}</p>

//                 <div className="mt-5 flex justify-end gap-2">
//                     <button
//                         onClick={onCancel}
//                         className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         onClick={onConfirm}
//                         className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
//                     >
//                         Delete
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import { apiUrl } from "@/config";

type StatusFilter = "all" | "active" | "inactive";

type GroupRow = {
    id: string; // group_id
    name: string; // group_name
    leaderName: string;
    mobile: string;
    email: string;

    membersCount: number | null; // not available in list API, we fill after "show" call
    isActive: boolean; // status === 1 && is_deleted === 0
    updatedAt: string; // ISO
};

type ApiGroupsListItem = {
    group_id: number;
    group_name: string;
    leader_name: string;
    mobile_number: string;
    email: string;
    otp_verified_at: string | null;
    email_verified: boolean;
    status: number; // 1/0
    is_deleted: number; // 0/1
    created_at: string;
    updated_at: string;
};

type ApiGroupsListResponse = {
    status: boolean;
    message: string;
    data: ApiGroupsListItem[];
};

type ApiGroupShowMember = {
    id: number;
    group_id: number;
    name: string;
    description: string;
    photo: string | null;
    created_at: string;
    updated_at: string;
};

type ApiGroupShowResponse = {
    status: boolean;
    message: string;
    data: {
        group: ApiGroupsListItem;
        total_members: number;
        members: ApiGroupShowMember[];
    };
};

const inputCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary";
const labelCls = "text-sm font-medium text-slate-800";

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

function buildMemberPhotoUrl(API_URL: string, groupId: number, photo?: string | null) {
    if (!photo) return "";
    if (photo.startsWith("http")) return photo;

    // apiUrl usually: https://getdemo.in/My_show/api
    const base = API_URL.replace(/\/api\/?$/, "");
    // based on your earlier response photo_url: http://127.0.0.1:8000/group_members/1/xxx.webp
    return `${base}/group_members/${groupId}/${photo}`;
}

export default function GroupsMasterPage() {
    const API_URL = apiUrl ?? "";

    const [groups, setGroups] = useState<GroupRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");

    // View modal
    const [viewOpen, setViewOpen] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");
    const [viewGroupId, setViewGroupId] = useState<string | null>(null);
    const [viewData, setViewData] = useState<{
        group: ApiGroupsListItem;
        totalMembers: number;
        members: ApiGroupShowMember[];
    } | null>(null);

    // ✅ Fetch groups list
    useEffect(() => {
        const fetchGroups = async () => {
            if (!API_URL) {
                setError("apiUrl not configured in /config");
                return;
            }

            try {
                setLoading(true);
                setError("");

                const res = await axios.post<ApiGroupsListResponse>(`${API_URL}/v1/groups`, {});
                if (!res.data?.status) {
                    setGroups([]);
                    setError(res.data?.message || "Failed to fetch groups");
                    return;
                }

                const normalized: GroupRow[] = (res.data.data || []).map((g) => ({
                    id: String(g.group_id),
                    name: g.group_name || "",
                    leaderName: g.leader_name || "",
                    mobile: g.mobile_number || "",
                    email: g.email || "",
                    membersCount: null, // not in list response
                    isActive: Number(g.status) === 1 && Number(g.is_deleted) === 0,
                    updatedAt: g.updated_at || g.created_at || new Date().toISOString(),
                }));

                // newest first
                normalized.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
                setGroups(normalized);
            } catch (e: any) {
                console.error(e);
                setGroups([]);
                setError(e?.response?.data?.message || "Failed to fetch groups");
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [API_URL]);

    const counts = useMemo(() => {
        const active = groups.filter((g) => g.isActive).length;
        const inactive = groups.length - active;
        return { total: groups.length, active, inactive };
    }, [groups]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        let data = [...groups];

        if (q) {
            data = data.filter((g) => {
                return (
                    g.name.toLowerCase().includes(q) ||
                    g.leaderName.toLowerCase().includes(q) ||
                    g.email.toLowerCase().includes(q) ||
                    g.mobile.toLowerCase().includes(q)
                );
            });
        }

        if (status === "active") data = data.filter((g) => g.isActive);
        if (status === "inactive") data = data.filter((g) => !g.isActive);

        data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        return data;
    }, [groups, search, status]);

    // ✅ View group details + members
    const openView = async (groupId: string) => {
        if (!API_URL) return;

        setViewOpen(true);
        setViewGroupId(groupId);
        setViewLoading(true);
        setViewError("");
        setViewData(null);

        try {
            const res = await axios.post<ApiGroupShowResponse>(`${API_URL}/v1/groups/show/${groupId}`, {});
            if (!res.data?.status) {
                setViewError(res.data?.message || "Failed to fetch group details");
                return;
            }

            const payload = res.data.data;
            setViewData({
                group: payload.group,
                totalMembers: payload.total_members ?? 0,
                members: payload.members ?? [],
            });

            // update membersCount in list for this group
            setGroups((prev) =>
                prev.map((g) => (g.id === groupId ? { ...g, membersCount: payload.total_members ?? 0 } : g))
            );
        } catch (e: any) {
            console.error(e);
            setViewError(e?.response?.data?.message || "Failed to fetch group details");
        } finally {
            setViewLoading(false);
        }
    };

    const closeView = () => {
        setViewOpen(false);
        setViewGroupId(null);
        setViewData(null);
        setViewError("");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Groups</h1>
                        <p className="text-slate-600">Groups listing + view members (API v1).</p>
                        {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
                    </div>
                </div>

                {/* KPI row */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KpiCard title="Total" value={counts.total} />
                    <KpiCard title="Active" value={counts.active} />
                    <KpiCard title="Inactive" value={counts.inactive} />
                </div>

                {/* List Card */}
                <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by group / leader / email / mobile..."
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-md"
                            />

                            <div className="inline-flex w-full items-center gap-2 sm:w-auto">
                                <FilterPill active={status === "all"} onClick={() => setStatus("all")}>
                                    All
                                </FilterPill>
                                <FilterPill active={status === "active"} onClick={() => setStatus("active")}>
                                    Active
                                </FilterPill>
                                <FilterPill active={status === "inactive"} onClick={() => setStatus("inactive")}>
                                    Inactive
                                </FilterPill>
                            </div>
                        </div>

                        <div className="text-sm text-slate-600">
                            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> groups
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-600">
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 pr-3">Group</th>
                                    <th className="py-3 pr-3">Leader</th>
                                    <th className="py-3 pr-3">Members</th>
                                    <th className="py-3 pr-3">Status</th>
                                    <th className="py-3 pr-3">Updated</th>
                                    <th className="py-3 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-slate-500">
                                            Loading groups...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-slate-500">
                                            No groups found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((g) => (
                                        <tr key={g.id} className="border-b border-slate-100">
                                            <td className="py-3 pr-3">
                                                <div className="min-w-60">
                                                    <div className="font-semibold text-slate-900">{g.name}</div>
                                                    <div className="mt-0.5 max-w-xl truncate text-slate-600">
                                                        {g.email} • {g.mobile}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 pr-3 text-slate-700">{g.leaderName || "-"}</td>

                                            <td className="py-3 pr-3 text-slate-700">
                                                {g.membersCount == null ? <span className="text-slate-400">—</span> : g.membersCount}
                                            </td>

                                            <td className="py-3 pr-3">
                                                <span
                                                    className={[
                                                        "inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1",
                                                        g.isActive
                                                            ? "bg-primary/10 text-primary ring-primary/20"
                                                            : "bg-slate-100 text-slate-700 ring-slate-200",
                                                    ].join(" ")}
                                                >
                                                    {g.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="py-3 pr-3 text-slate-600">{formatDate(g.updatedAt)}</td>

                                            {/* ✅ Eye action */}
                                            <td className="py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => openView(g.id)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
                                                    aria-label="View group"
                                                    title="View"
                                                >
                                                    <FiEye className="text-lg" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                        Note: Members count appears after you open a group once (because list API doesn’t return total_members).
                    </div>
                </div>

                {/* View Modal */}
                {viewOpen ? (
                    <GroupViewModal
                        apiUrl={API_URL}
                        groupId={viewGroupId}
                        loading={viewLoading}
                        error={viewError}
                        data={viewData}
                        onClose={closeView}
                    />
                ) : null}
            </div>
        </div>
    );
}

/* ---------- UI Parts ---------- */

function KpiCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-primary" />
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">Groups</p>
                </div>
                <div className="text-3xl font-semibold text-slate-900">{value}</div>
            </div>
        </div>
    );
}

function FilterPill({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition",
                active
                    ? "bg-primary text-white ring-primary"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function MemberAvatar({
    apiUrl,
    groupId,
    member,
}: {
    apiUrl: string;
    groupId: number;
    member: ApiGroupShowMember;
}) {
    const photoUrl = buildMemberPhotoUrl(apiUrl, groupId, member.photo);

    const initials = (member.name || "M")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((x) => x[0]?.toUpperCase())
        .join("");

    return (
        <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
            {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={photoUrl}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        // fallback to initials
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                />
            ) : (
                <span className="text-xs font-semibold text-slate-600">{initials}</span>
            )}
        </div>
    );
}

function GroupViewModal({
    apiUrl,
    groupId,
    loading,
    error,
    data,
    onClose,
}: {
    apiUrl: string;
    groupId: string | null;
    loading: boolean;
    error: string;
    data: { group: ApiGroupsListItem; totalMembers: number; members: ApiGroupShowMember[] } | null;
    onClose: () => void;
}) {
    // close on ESC
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    const group = data?.group;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Group Details</h2>
                        <p className="text-sm text-slate-600">Group ID: {groupId ?? "-"}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
                        aria-label="Close modal"
                        title="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
                    {loading ? (
                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
                            Loading group information...
                        </div>
                    ) : error ? (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
                    ) : !data || !group ? (
                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
                            No data.
                        </div>
                    ) : (
                        <>
                            {/* Group info */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <InfoField label="Group Name" value={group.group_name} />
                                <InfoField label="Leader" value={group.leader_name} />
                                <InfoField label="Mobile" value={group.mobile_number} />
                                <InfoField label="Email" value={group.email} />
                                <InfoField label="Email Verified" value={group.email_verified ? "Yes" : "No"} />
                                <InfoField label="Status" value={Number(group.status) === 1 ? "Active" : "Inactive"} />
                                <InfoField label="Updated" value={formatDate(group.updated_at)} />
                                <InfoField label="Total Members" value={String(data.totalMembers)} />
                            </div>

                            {/* Members */}
                            <div className="mt-6">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Members</p>
                                        <p className="text-xs text-slate-500">Showing {data.members.length} members</p>
                                    </div>
                                </div>

                                {data.members.length === 0 ? (
                                    <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600">
                                        No members found.
                                    </div>
                                ) : (
                                    <div className="mt-3 space-y-2">
                                        {data.members.map((m) => (
                                            <div
                                                key={m.id}
                                                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                                            >
                                                <MemberAvatar apiUrl={apiUrl} groupId={m.group_id} member={m} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                                                    <p className="text-xs text-slate-600">{m.description || "-"}</p>
                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        Updated: {formatDate(m.updated_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-slate-200 px-5 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className={labelCls}>{label}</p>
            <p className="mt-1 text-sm text-slate-900">{value || "-"}</p>
        </div>
    );
}
