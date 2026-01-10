// "use client";

// import React, { useMemo, useState } from "react";

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

//                 {/* KPI row (same card vibe) */}
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
//                                                 <div className="min-w-[240px]">
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

//                                             <td className="py-3 text-right">
//                                                 <div className="inline-flex gap-2">
//                                                     <button
//                                                         onClick={() => openEdit(g)}
//                                                         className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
//                                                     >
//                                                         Edit
//                                                     </button>

//                                                     <button
//                                                         onClick={() => setConfirmDelete(g)}
//                                                         className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
//                                                     >
//                                                         Delete
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
//                         className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
//                     >
//                         Delete
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }



"use client";

import React, { useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type Group = {
    id: string;
    name: string;
    description: string;
    membersCount: number;
    isActive: boolean;
    updatedAt: string; // ISO
};

type StatusFilter = "all" | "active" | "inactive";

const initialGroups: Group[] = [
    {
        id: "g1",
        name: "Apollo Coders Community",
        description: "Developers group for sharing events, meetups, and updates.",
        membersCount: 34,
        isActive: true,
        updatedAt: new Date().toISOString(),
    },
    {
        id: "g2",
        name: "Marketing Team",
        description: "Internal marketing announcements and weekly sync.",
        membersCount: 12,
        isActive: false,
        updatedAt: new Date().toISOString(),
    },
];

function makeId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return (crypto as Crypto).randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
}

type GroupPayload = Pick<Group, "name" | "description" | "membersCount" | "isActive">;

type GroupModalProps = {
    initial: Group | null;
    onClose: () => void;
    onSave: (payload: GroupPayload) => void;
};

type ConfirmDialogProps = {
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
};

function IconEdit(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 20h9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconTrash(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M3 6h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M8 6V4h8v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M19 6l-1 14H6L5 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M10 11v6M14 11v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label?: string;
}) {
    return (
        <button
            type="button"
            aria-label={label ?? "Toggle"}
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
            className={[
                "relative inline-flex h-7 w-12 items-center rounded-full ring-1 transition",
                checked
                    ? "bg-primary ring-primary/30"
                    : "bg-slate-200 ring-slate-300 hover:bg-slate-300",
            ].join(" ")}
        >
            <span
                className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition",
                    checked ? "translate-x-6" : "translate-x-1",
                ].join(" ")}
            />
        </button>
    );
}

export default function GroupsMasterPage() {
    const [groups, setGroups] = useState<Group[]>(initialGroups);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Group | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Group | null>(null);

    const counts = useMemo(() => {
        const active = groups.filter((g) => g.isActive).length;
        const inactive = groups.length - active;
        return { total: groups.length, active, inactive };
    }, [groups]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        let data = [...groups];

        if (q) {
            data = data.filter(
                (g) =>
                    g.name.toLowerCase().includes(q) ||
                    g.description.toLowerCase().includes(q)
            );
        }

        if (status === "active") data = data.filter((g) => g.isActive);
        if (status === "inactive") data = data.filter((g) => !g.isActive);

        data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        return data;
    }, [groups, search, status]);

    function openAdd() {
        setEditing(null);
        setIsModalOpen(true);
    }

    function openEdit(g: Group) {
        setEditing(g);
        setIsModalOpen(true);
    }

    function saveGroup(payload: GroupPayload) {
        const nowIso = new Date().toISOString();

        if (!editing) {
            const newItem: Group = {
                id: makeId(),
                ...payload,
                updatedAt: nowIso,
            };
            setGroups((prev) => [newItem, ...prev]);
            setIsModalOpen(false);
            return;
        }

        setGroups((prev) =>
            prev.map((x) =>
                x.id === editing.id ? { ...x, ...payload, updatedAt: nowIso } : x
            )
        );

        setIsModalOpen(false);
        setEditing(null);
    }

    function toggleActive(id: string, next: boolean) {
        const nowIso = new Date().toISOString();
        setGroups((prev) =>
            prev.map((g) => (g.id === id ? { ...g, isActive: next, updatedAt: nowIso } : g))
        );
    }

    function doDelete(g: Group) {
        setGroups((prev) => prev.filter((x) => x.id !== g.id));
        setConfirmDelete(null);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Groups Master</h1>
                        <p className="text-slate-600">Add, update, and manage groups.</p>
                    </div>

                    {/* <button
                        onClick={openAdd}
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        + Create Group
                    </button> */}
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
                                placeholder="Search groups..."
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-sm"
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
                            Showing{" "}
                            <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
                            groups
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-600">
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 pr-3">Group</th>
                                    <th className="py-3 pr-3">Members</th>
                                    <th className="py-3 pr-3">Status</th>
                                    <th className="py-3 pr-3">Updated</th>
                                    <th className="py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-slate-500">
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
                                                        {g.description}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 pr-3 text-slate-700">{g.membersCount}</td>

                                            <td className="py-3 pr-3">
                                                <div className="flex items-center gap-3">
                                                    <Toggle
                                                        checked={g.isActive}
                                                        onChange={(next) => toggleActive(g.id, next)}
                                                        label={`Set ${g.name} ${g.isActive ? "inactive" : "active"}`}
                                                    />
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
                                                </div>
                                            </td>

                                            <td className="py-3 pr-3 text-slate-600">{formatDate(g.updatedAt)}</td>

                                            {/* ✅ ICON ACTIONS */}
                                            <td className="py-3 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(g)}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
                                                        aria-label="Edit event"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDelete(g)}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
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
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen && (
                    <GroupModal
                        initial={editing}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditing(null);
                        }}
                        onSave={saveGroup}
                    />
                )}

                {confirmDelete && (
                    <ConfirmDialog
                        title="Delete Group?"
                        message="This action can’t be undone."
                        onCancel={() => setConfirmDelete(null)}
                        onConfirm={() => doDelete(confirmDelete)}
                    />
                )}
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

function GroupModal({ initial, onClose, onSave }: GroupModalProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [membersCount, setMembersCount] = useState<number>(initial?.membersCount ?? 0);
    const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
    const [error, setError] = useState("");

    function submit() {
        if (name.trim().length < 2) return setError("Group name is required (min 2 chars).");
        if (description.trim().length < 10)
            return setError("Description is required (min 10 chars).");
        if (Number.isNaN(membersCount) || membersCount < 0)
            return setError("Members count must be 0 or more.");

        onSave({
            name: name.trim(),
            description: description.trim(),
            membersCount: Math.floor(membersCount),
            isActive,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {initial ? "Edit Group" : "Create Group"}
                        </h2>
                        <p className="text-sm text-slate-600">Set group details and status.</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-800">Group Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Pune Developers"
                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-800">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write group description..."
                            rows={4}
                            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <div className="mt-1 flex justify-between text-xs text-slate-500">
                            <span>Min 10 characters</span>
                            <span>{description.length}/500</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-800">Members Count</label>
                            <input
                                type="number"
                                min={0}
                                value={membersCount}
                                onChange={(e) => setMembersCount(Number(e.target.value))}
                                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-800">Status</label>
                            <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
                                <Toggle checked={isActive} onChange={setIsActive} label="Toggle active" />
                                <span className="text-sm font-semibold text-slate-800">
                                    {isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={submit}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        {initial ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfirmDialog({ title, message, onCancel, onConfirm }: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{message}</p>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
