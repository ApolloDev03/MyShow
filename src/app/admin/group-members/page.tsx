// "use client";

// import { useEffect, useMemo, useState } from "react";

// type Member = {
//   id: string;
//   name: string;
//   description: string;
//   photoUrl?: string; // preview URL
// };

// const inputCls =
//   "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";
// const helperCls = "text-xs text-black/60";

// export default function GroupMembersPage() {
//   // Form state
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");

//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string>("");

//   const [error, setError] = useState("");

//   // Dummy members list
//   const [members, setMembers] = useState<Member[]>([
//     {
//       id: "M-1001",
//       name: "Apollo Coders",
//       description: "Organizer • Event planning and execution.",
//     },
//     {
//       id: "M-1002",
//       name: "Komal Desai",
//       description: "Volunteer • Guest management and support.",
//     },
//     {
//       id: "M-1003",
//       name: "Mehul Shah",
//       description: "Coordinator • Venue & logistics handling.",
//     },
//   ]);

//   // Photo preview
//   useEffect(() => {
//     if (!photoFile) {
//       setPhotoPreview("");
//       return;
//     }
//     const url = URL.createObjectURL(photoFile);
//     setPhotoPreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [photoFile]);

//   const canSubmit = useMemo(() => {
//     return name.trim().length > 0;
//   }, [name]);

//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setPhotoFile(null);
//     setError("");
//   };

//   const addMember = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!canSubmit) {
//       setError("Please enter member name.");
//       return;
//     }

//     const newMember: Member = {
//       id: `M-${Math.floor(1000 + Math.random() * 9000)}`,
//       name: name.trim(),
//       description: description.trim(),
//       photoUrl: photoPreview || undefined, // preview only (API later)
//     };

//     setMembers((prev) => [newMember, ...prev]);
//     resetForm();

//     // TODO: call API with FormData (photoFile) later
//   };

//   const deleteMember = (id: string) => {
//     setMembers((prev) => prev.filter((m) => m.id !== id));
//   };

//   return (
//     <main className="min-h-screen bg-[#f6f7fb] text-black">
//       <div className="mx-auto w-full max-w-7xl px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col gap-1">
//           <h1 className="text-2xl font-semibold tracking-tight">Group Members</h1>
//           <p className="text-sm text-black/60">Add and manage your team members.</p>
//         </div>

//         <section className="mt-6 grid gap-6 lg:grid-cols-12">
//           {/* LEFT: Add Member */}
//           <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//             <h2 className="text-base font-semibold">Add Member</h2>
//             <p className="mt-1 text-sm text-black/60">Add name, photo and description.</p>

//             <form onSubmit={addMember} className="mt-5 space-y-4">
//               {/* Photo */}
//               <div>
//                 <p className={labelCls}>Photo</p>

//                 <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/[0.02] p-4 hover:bg-black/[0.04]">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
//                     className="hidden"
//                   />

//                   {!photoPreview ? (
//                     <div className="flex items-center gap-3">
//                       <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//                         <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
//                           <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2-8 4.5V21h16v-2.5c0-2.5-3.58-4.5-8-4.5Z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">Upload member photo</p>
//                         <p className={helperCls}>Click to choose (optional)</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-3">
//                       <div className="h-14 w-14 overflow-hidden rounded-2xl border border-black/10 bg-white">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img src={photoPreview} alt="Member preview" className="h-full w-full object-cover" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">Photo selected</p>
//                         <p className={helperCls}>Click again to change photo</p>
//                       </div>
//                     </div>
//                   )}
//                 </label>

//                 {photoPreview ? (
//                   <button
//                     type="button"
//                     onClick={() => setPhotoFile(null)}
//                     className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
//                   >
//                     Remove photo
//                   </button>
//                 ) : null}
//               </div>

//               {/* Name */}
//               <div>
//                 <label className={labelCls}>
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter member name"
//                   className={inputCls}
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className={labelCls}>Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Write member role/notes..."
//                   rows={4}
//                   className={`${inputCls} resize-none`}
//                 />
//               </div>

//               {error ? <p className="text-sm text-red-600">{error}</p> : null}

//               <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                 >
//                   Clear
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={!canSubmit}
//                   className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   Add Member
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* RIGHT: Members List */}
//           <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <h2 className="text-base font-semibold">Members</h2>
//               <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
//                 Total: {members.length}
//               </span>
//             </div>

//             <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
//               <div className="grid grid-cols-12 bg-black/[0.03] px-4 py-3 text-sm font-semibold">
//                 <div className="col-span-6">Member</div>
//                 <div className="col-span-4">Description</div>
//                 <div className="col-span-2 text-right">Action</div>
//               </div>

//               <div className="divide-y divide-black/10">
//                 {members.map((m) => (
//                   <div key={m.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3">
//                     <div className="col-span-6 flex items-center gap-3 min-w-0">
//                       <div className="h-10 w-10 overflow-hidden rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-center">
//                         {m.photoUrl ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
//                         ) : (
//                           <span className="text-sm font-bold text-primary">
//                             {m.name?.trim()?.[0]?.toUpperCase() || "M"}
//                           </span>
//                         )}
//                       </div>

//                       <div className="min-w-0">
//                         <p className="font-semibold truncate">{m.name}</p>
//                         <p className="text-xs text-black/50">ID: {m.id}</p>
//                       </div>
//                     </div>

//                     <div className="col-span-4">
//                       <p className="text-sm text-black/70 line-clamp-2">
//                         {m.description || "—"}
//                       </p>
//                     </div>

//                     <div className="col-span-2 flex justify-end">
//                       <button
//                         type="button"
//                         onClick={() => deleteMember(m.id)}
//                         className="rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}

//                 {members.length === 0 ? (
//                   <div className="p-8 text-center text-sm text-black/60">
//                     No members found. Add your first member.
//                   </div>
//                 ) : null}
//               </div>
//             </div>

//             <p className="mt-3 text-xs text-black/50">
//               * Photo preview is local only. For real save, upload using API (FormData).
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiUser } from "react-icons/fi";

type Member = {
    id: string;
    name: string;
    description: string;
    photoUrl?: string; // preview URL (dummy for now)
    createdAt: string;
};

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

export default function GroupMembersPage() {
    // Dummy data (API later)
    const [members, setMembers] = useState<Member[]>([
        {
            id: "M-1001",
            name: "Apollo Coders",
            description: "Organizer • Event planning and execution.",
            createdAt: "2 hours ago",
        },
        {
            id: "M-1002",
            name: "Komal Desai",
            description: "Volunteer • Guest management and support.",
            createdAt: "Yesterday",
        },
        {
            id: "M-1003",
            name: "Mehul Shah",
            description: "Coordinator • Venue & logistics handling.",
            createdAt: "2 days ago",
        },
    ]);

    // Search
    const [search, setSearch] = useState("");

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [editItem, setEditItem] = useState<Member | null>(null);

    // Form state (used inside modal)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    const [error, setError] = useState("");

    // Preview for photoFile
    useEffect(() => {
        if (!photoFile) return;

        const url = URL.createObjectURL(photoFile);
        setPhotoPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [photoFile]);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return members;

        return members.filter((m) => {
            return (
                m.name.toLowerCase().includes(s) ||
                m.description.toLowerCase().includes(s) ||
                m.id.toLowerCase().includes(s)
            );
        });
    }, [members, search]);

    const openCreate = () => {
        setMode("create");
        setEditItem(null);
        setName("");
        setDescription("");
        setPhotoFile(null);
        setPhotoPreview("");
        setError("");
        setModalOpen(true);
    };

    const openEdit = (m: Member) => {
        setMode("edit");
        setEditItem(m);

        setName(m.name);
        setDescription(m.description);
        setPhotoFile(null); // only set if user chooses new file
        setPhotoPreview(m.photoUrl || "");
        setError("");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditItem(null);
        setName("");
        setDescription("");
        setPhotoFile(null);
        setPhotoPreview("");
        setError("");
    };

    const saveMember = (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Please enter member name.");
            return;
        }

        if (mode === "create") {
            const newMember: Member = {
                id: `M-${Math.floor(1000 + Math.random() * 9000)}`,
                name: name.trim(),
                description: description.trim(),
                photoUrl: photoPreview || undefined,
                createdAt: "Just now",
            };

            setMembers((prev) => [newMember, ...prev]);
            closeModal();
            return;
        }

        // edit
        if (!editItem) return;

        const updated: Member = {
            ...editItem,
            name: name.trim(),
            description: description.trim(),
            photoUrl: photoPreview || undefined,
        };

        setMembers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        closeModal();
    };

    const deleteMember = (id: string) => {
        const ok = window.confirm("Are you sure you want to delete this member?");
        if (!ok) return;

        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Group Members</h1>
                        <p className="text-sm text-black/60">Manage your team members </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        <FiPlus className="text-base" />
                        Add Member
                    </button>
                </div>



                {/* Filters */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                        <div className="sm:col-span-12">
                            <label className={labelCls}>Search</label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name / id / description..."
                                className={`${inputCls} mt-2`}
                            />
                        </div>
                    </div>
                </section>

                {/* TABLE LISTING */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-215 w-full">
                            <thead className="bg-black/3">
                                <tr className="text-left text-sm font-semibold text-black">
                                    <th className="px-4 py-3">Photo</th>
                                    <th className="px-4 py-3">Member</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {filtered.map((m) => (
                                    <tr key={m.id} className="hover:bg-black/2">
                                        {/* Photo */}
                                        <td className="px-4 py-3">
                                            <div className="h-12 w-12 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
                                                {m.photoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold text-primary">
                                                        {m.name?.trim()?.[0]?.toUpperCase() || "M"}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Member */}
                                        <td className="px-4 py-3">
                                            <div className="min-w-0">
                                                <p className="font-semibold truncate max-w-65">{m.name}</p>
                                                <p className="text-xs text-black/50">ID: {m.id}</p>
                                            </div>
                                        </td>

                                        {/* Description */}
                                        <td className="px-4 py-3 text-sm text-black/70">
                                            <p className="line-clamp-2">{m.description || "—"}</p>
                                        </td>

                                        {/* Created */}
                                        <td className="px-4 py-3 text-sm text-black/60">{m.createdAt}</td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(m)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
                                                    aria-label="Edit member"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="text-lg" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteMember(m.id)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
                                                    aria-label="Delete member"
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
                                            No members found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Mobile Add Button */}
                <button
                    type="button"
                    onClick={openCreate}
                    className="mt-6 inline-flex w-full sm:hidden items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                    <FiPlus className="text-base" />
                    Add Member
                </button>
            </div>

            {/* CREATE / EDIT MODAL */}
            {modalOpen ? (
                <div
                    className="fixed inset-0 z-999 bg-black/40 px-4 py-10"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                            <div>
                                <p className="text-base font-semibold">
                                    {mode === "create" ? "Add Member" : "Edit Member"}
                                </p>
                                {mode === "edit" && editItem ? (
                                    <p className="text-xs text-black/50">ID: {editItem.id}</p>
                                ) : null}
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
                                aria-label="Close"
                                title="Close"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        <form onSubmit={saveMember} className="px-5 py-5">
                            {/* Photo */}
                            <div>
                                <label className={labelCls}>Photo</label>

                                <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                                        className="hidden"
                                    />

                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white">
                                            {photoPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <FiUser className="text-xl text-primary" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium">
                                                {photoPreview ? "Photo selected" : "Upload member photo"}
                                            </p>
                                            <p className="text-xs text-black/60">Click to choose (optional)</p>
                                        </div>
                                    </div>
                                </label>

                                {photoPreview ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhotoFile(null);
                                            setPhotoPreview("");
                                        }}
                                        className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
                                    >
                                        Remove photo
                                    </button>
                                ) : null}
                            </div>

                            {/* Name */}
                            <div className="mt-4">
                                <label className={labelCls}>
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter member name"
                                    className={`${inputCls} mt-2`}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mt-4">
                                <label className={labelCls}>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Write member role/notes..."
                                    rows={4}
                                    className={`${inputCls} mt-2 resize-none`}
                                />
                            </div>

                            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                                >
                                    {mode === "create" ? "Add Member" : "Update Member"}
                                </button>
                            </div>

                            <p className="mt-3 text-xs text-black/50">
                                * Photo preview is local only. Later you can upload via API using FormData.
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}
        </main>
    );
}

function MiniStat({ title, value, accent }: { title: string; value: number; accent: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <span className={`absolute left-0 top-0 h-full w-1.5 ${accent}`} />
            <p className="text-sm font-semibold text-black">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}
