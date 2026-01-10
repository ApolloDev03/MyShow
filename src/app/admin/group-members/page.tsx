// "use client";

// import { useEffect, useMemo, useState, type FormEvent } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX, FiUser } from "react-icons/fi";

// type Member = {
//     id: string;
//     name: string;
//     description: string;
//     photoUrl?: string; // preview URL (dummy for now)
//     createdAt: string;
// };

// const inputCls =
//     "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";

// export default function GroupMembersPage() {
//     // Dummy data (API later)
//     const [members, setMembers] = useState<Member[]>([
//         {
//             id: "M-1001",
//             name: "Apollo Coders",
//             description: "Organizer • Event planning and execution.",
//             createdAt: "2 hours ago",
//         },
//         {
//             id: "M-1002",
//             name: "Komal Desai",
//             description: "Volunteer • Guest management and support.",
//             createdAt: "Yesterday",
//         },
//         {
//             id: "M-1003",
//             name: "Mehul Shah",
//             description: "Coordinator • Venue & logistics handling.",
//             createdAt: "2 days ago",
//         },
//     ]);

//     // Search
//     const [search, setSearch] = useState("");

//     // Modal state
//     const [modalOpen, setModalOpen] = useState(false);
//     const [mode, setMode] = useState<"create" | "edit">("create");
//     const [editItem, setEditItem] = useState<Member | null>(null);

//     // Form state (used inside modal)
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");

//     const [photoFile, setPhotoFile] = useState<File | null>(null);
//     const [photoPreview, setPhotoPreview] = useState<string>("");

//     const [error, setError] = useState("");

//     // Preview for photoFile
//     useEffect(() => {
//         if (!photoFile) return;

//         const url = URL.createObjectURL(photoFile);
//         setPhotoPreview(url);

//         return () => URL.revokeObjectURL(url);
//     }, [photoFile]);

//     const filtered = useMemo(() => {
//         const s = search.trim().toLowerCase();
//         if (!s) return members;

//         return members.filter((m) => {
//             return (
//                 m.name.toLowerCase().includes(s) ||
//                 m.description.toLowerCase().includes(s) ||
//                 m.id.toLowerCase().includes(s)
//             );
//         });
//     }, [members, search]);

//     const openCreate = () => {
//         setMode("create");
//         setEditItem(null);
//         setName("");
//         setDescription("");
//         setPhotoFile(null);
//         setPhotoPreview("");
//         setError("");
//         setModalOpen(true);
//     };

//     const openEdit = (m: Member) => {
//         setMode("edit");
//         setEditItem(m);

//         setName(m.name);
//         setDescription(m.description);
//         setPhotoFile(null); // only set if user chooses new file
//         setPhotoPreview(m.photoUrl || "");
//         setError("");
//         setModalOpen(true);
//     };

//     const closeModal = () => {
//         setModalOpen(false);
//         setEditItem(null);
//         setName("");
//         setDescription("");
//         setPhotoFile(null);
//         setPhotoPreview("");
//         setError("");
//     };

//     const saveMember = (e: FormEvent) => {
//         e.preventDefault();
//         setError("");

//         if (!name.trim()) {
//             setError("Please enter member name.");
//             return;
//         }

//         if (mode === "create") {
//             const newMember: Member = {
//                 id: `M-${Math.floor(1000 + Math.random() * 9000)}`,
//                 name: name.trim(),
//                 description: description.trim(),
//                 photoUrl: photoPreview || undefined,
//                 createdAt: "Just now",
//             };

//             setMembers((prev) => [newMember, ...prev]);
//             closeModal();
//             return;
//         }

//         // edit
//         if (!editItem) return;

//         const updated: Member = {
//             ...editItem,
//             name: name.trim(),
//             description: description.trim(),
//             photoUrl: photoPreview || undefined,
//         };

//         setMembers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
//         closeModal();
//     };

//     const deleteMember = (id: string) => {
//         const ok = window.confirm("Are you sure you want to delete this member?");
//         if (!ok) return;

//         setMembers((prev) => prev.filter((m) => m.id !== id));
//     };

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-7xl px-4 py-8">
//                 {/* Header */}
//                 <div className="flex items-start justify-between gap-3">
//                     <div className="flex flex-col gap-1">
//                         <h1 className="text-2xl font-semibold tracking-tight">Group Members</h1>
//                         <p className="text-sm text-black/60">Manage your team members </p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={openCreate}
//                         className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         <FiPlus className="text-base" />
//                         Add Member
//                     </button>
//                 </div>



//                 {/* Filters */}
//                 <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//                     <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//                         <div className="sm:col-span-12">
//                             <label className={labelCls}>Search</label>
//                             <input
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Search by name / id / description..."
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>
//                     </div>
//                 </section>

//                 {/* TABLE LISTING */}
//                 <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-215 w-full">
//                             <thead className="bg-black/3">
//                                 <tr className="text-left text-sm font-semibold text-black">
//                                     <th className="px-4 py-3">Photo</th>
//                                     <th className="px-4 py-3">Member</th>
//                                     <th className="px-4 py-3">Description</th>
//                                     <th className="px-4 py-3">Created</th>
//                                     <th className="px-4 py-3 text-right">Actions</th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-black/10">
//                                 {filtered.map((m) => (
//                                     <tr key={m.id} className="hover:bg-black/2">
//                                         {/* Photo */}
//                                         <td className="px-4 py-3">
//                                             <div className="h-12 w-12 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
//                                                 {m.photoUrl ? (
//                                                     // eslint-disable-next-line @next/next/no-img-element
//                                                     <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
//                                                 ) : (
//                                                     <span className="text-sm font-bold text-primary">
//                                                         {m.name?.trim()?.[0]?.toUpperCase() || "M"}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </td>

//                                         {/* Member */}
//                                         <td className="px-4 py-3">
//                                             <div className="min-w-0">
//                                                 <p className="font-semibold truncate max-w-65">{m.name}</p>
//                                                 <p className="text-xs text-black/50">ID: {m.id}</p>
//                                             </div>
//                                         </td>

//                                         {/* Description */}
//                                         <td className="px-4 py-3 text-sm text-black/70">
//                                             <p className="line-clamp-2">{m.description || "—"}</p>
//                                         </td>

//                                         {/* Created */}
//                                         <td className="px-4 py-3 text-sm text-black/60">{m.createdAt}</td>

//                                         {/* Actions */}
//                                         <td className="px-4 py-3">
//                                             <div className="flex justify-end gap-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => openEdit(m)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                                                     aria-label="Edit member"
//                                                     title="Edit"
//                                                 >
//                                                     <FiEdit2 className="text-lg" />
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     onClick={() => deleteMember(m.id)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                                                     aria-label="Delete member"
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
//                                             No members found.
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
//                     onClick={openCreate}
//                     className="mt-6 inline-flex w-full sm:hidden items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
//                 >
//                     <FiPlus className="text-base" />
//                     Add Member
//                 </button>
//             </div>

//             {/* CREATE / EDIT MODAL */}
//             {modalOpen ? (
//                 <div
//                     className="fixed inset-0 z-999 bg-black/40 px-4 py-10"
//                     onMouseDown={(e) => {
//                         if (e.target === e.currentTarget) closeModal();
//                     }}
//                 >
//                     <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
//                         <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
//                             <div>
//                                 <p className="text-base font-semibold">
//                                     {mode === "create" ? "Add Member" : "Edit Member"}
//                                 </p>
//                                 {mode === "edit" && editItem ? (
//                                     <p className="text-xs text-black/50">ID: {editItem.id}</p>
//                                 ) : null}
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={closeModal}
//                                 className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5"
//                                 aria-label="Close"
//                                 title="Close"
//                             >
//                                 <FiX className="text-lg" />
//                             </button>
//                         </div>

//                         <form onSubmit={saveMember} className="px-5 py-5">
//                             {/* Photo */}
//                             <div>
//                                 <label className={labelCls}>Photo</label>

//                                 <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
//                                         className="hidden"
//                                     />

//                                     <div className="flex items-center gap-3">
//                                         <div className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white">
//                                             {photoPreview ? (
//                                                 // eslint-disable-next-line @next/next/no-img-element
//                                                 <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
//                                             ) : (
//                                                 <FiUser className="text-xl text-primary" />
//                                             )}
//                                         </div>

//                                         <div className="min-w-0">
//                                             <p className="text-sm font-medium">
//                                                 {photoPreview ? "Photo selected" : "Upload member photo"}
//                                             </p>
//                                             <p className="text-xs text-black/60">Click to choose (optional)</p>
//                                         </div>
//                                     </div>
//                                 </label>

//                                 {photoPreview ? (
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setPhotoFile(null);
//                                             setPhotoPreview("");
//                                         }}
//                                         className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
//                                     >
//                                         Remove photo
//                                     </button>
//                                 ) : null}
//                             </div>

//                             {/* Name */}
//                             <div className="mt-4">
//                                 <label className={labelCls}>
//                                     Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     placeholder="Enter member name"
//                                     className={`${inputCls} mt-2`}
//                                     required
//                                 />
//                             </div>

//                             {/* Description */}
//                             <div className="mt-4">
//                                 <label className={labelCls}>Description</label>
//                                 <textarea
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     placeholder="Write member role/notes..."
//                                     rows={4}
//                                     className={`${inputCls} mt-2 resize-none`}
//                                 />
//                             </div>

//                             {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

//                             <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
//                                 <button
//                                     type="button"
//                                     onClick={closeModal}
//                                     className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     type="submit"
//                                     className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
//                                 >
//                                     {mode === "create" ? "Add Member" : "Update Member"}
//                                 </button>
//                             </div>

//                             <p className="mt-3 text-xs text-black/50">
//                                 * Photo preview is local only. Later you can upload via API using FormData.
//                             </p>
//                         </form>
//                     </div>
//                 </div>
//             ) : null}
//         </main>
//     );
// }

// function MiniStat({ title, value, accent }: { title: string; value: number; accent: string }) {
//     return (
//         <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
//             <span className={`absolute left-0 top-0 h-full w-1.5 ${accent}`} />
//             <p className="text-sm font-semibold text-black">{title}</p>
//             <p className="mt-2 text-3xl font-bold">{value}</p>
//         </div>
//     );
// }



// "use client";

// import axios from "axios";
// import { useEffect, useMemo, useState, type FormEvent } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX, FiUser } from "react-icons/fi";
// import { apiUrl } from "@/config";

// type ApiMember = {
//     id: number | string;
//     group_id?: number | string;
//     name?: string;
//     description?: string;
//     photo?: string;
//     photo_url?: string;
//     created_at?: string;
// };

// type Member = {
//     id: number;
//     groupId: number;
//     name: string;
//     description: string;
//     photoUrl?: string;
//     createdAt?: string;
// };

// const inputCls =
//     "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";

// export default function GroupMembersPage() {
//     // ====== TOKEN (change key if needed) ======
//     const getToken = () => {
//         if (typeof window === "undefined") return "";
//         return (
//             localStorage.getItem("token") ||
//             localStorage.getItem("Token") ||
//             localStorage.getItem("adminToken") ||
//             ""
//         );
//     };

//     // ====== DATA STATES ======
//     const [members, setMembers] = useState<Member[]>([]);
//     const [groupId, setGroupId] = useState<number>(1);
//     const [groupName, setGroupName] = useState<string>("");
//     const [leader, setLeader] = useState<string>("");

//     const [loadingList, setLoadingList] = useState(false);

//     // Search
//     const [search, setSearch] = useState("");

//     // Modal state
//     const [modalOpen, setModalOpen] = useState(false);
//     const [mode, setMode] = useState<"create" | "edit">("create");
//     const [editItem, setEditItem] = useState<Member | null>(null);

//     // Form state
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");

//     const [photoFile, setPhotoFile] = useState<File | null>(null);
//     const [photoPreview, setPhotoPreview] = useState<string>("");

//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");

//     // Preview for photoFile
//     useEffect(() => {
//         if (!photoFile) return;

//         const url = URL.createObjectURL(photoFile);
//         setPhotoPreview(url);

//         return () => URL.revokeObjectURL(url);
//     }, [photoFile]);

//     const normalizeMember = (x: ApiMember, fallbackGroupId: number): Member => ({
//         id: Number(x.id),
//         groupId: Number(x.group_id ?? fallbackGroupId),
//         name: x.name ?? "",
//         description: x.description ?? "",
//         photoUrl: x.photo_url ?? "",
//         createdAt: x.created_at ?? "",
//     });

//     // ====== LIST API: /admin/group-members (POST {Token}) ======
//     const fetchMembers = async () => {
//         try {
//             setLoadingList(true);
//             setError("");

//             const token = getToken();
//             if (!token) {
//                 setError("Token not found. Please login first.");
//                 setMembers([]);
//                 return;
//             }

//             const res = await axios.post(
//                 `${apiUrl}/admin/group-members`,
//                 { headers: { Accept: "application/json" } }
//             );

//             if (res.data?.status) {
//                 const g = res.data?.group;
//                 if (g?.group_id) setGroupId(Number(g.group_id));
//                 if (g?.group_name) setGroupName(String(g.group_name));
//                 if (g?.leader) setLeader(String(g.leader));

//                 const gid = Number(g?.group_id ?? groupId);
//                 const list: ApiMember[] = res.data?.data || [];
//                 setMembers(list.map((m) => normalizeMember(m, gid)));
//             } else {
//                 setMembers([]);
//                 setError(res.data?.message || "Failed to load members.");
//             }
//         } catch (err: any) {
//             console.error("Members fetch error:", err);
//             setError(err?.response?.data?.message || "Failed to load members.");
//             setMembers([]);
//         } finally {
//             setLoadingList(false);
//         }
//     };

//     useEffect(() => {
//         fetchMembers();
//     }, []);

//     const fetchMemberDetail = async (id: number) => {
//         try {
//             const token = getToken();

//             // Some backends may require Token here too; safe to send:
//             const res = await axios.post(
//                 `${apiUrl}/admin/group-members/${id}`,
//                 { headers: { Accept: "application/json" } }
//             );

//             if (res.data?.status && res.data?.data) {
//                 return normalizeMember(res.data.data as ApiMember, groupId);
//             }
//             return null;
//         } catch (err) {
//             console.error("Member detail fetch error:", err);
//             return null;
//         }
//     };

//     const filtered = useMemo(() => {
//         const s = search.trim().toLowerCase();
//         if (!s) return members;

//         return members.filter((m) => {
//             return (
//                 m.name.toLowerCase().includes(s) ||
//                 (m.description || "").toLowerCase().includes(s) ||
//                 String(m.id).toLowerCase().includes(s)
//             );
//         });
//     }, [members, search]);

//     const openCreate = () => {
//         setMode("create");
//         setEditItem(null);
//         setName("");
//         setDescription("");
//         setPhotoFile(null);
//         setPhotoPreview("");
//         setError("");
//         setModalOpen(true);
//     };

//     const openEdit = async (m: Member) => {
//         setMode("edit");
//         setEditItem(m);

//         setError("");
//         setModalOpen(true);

//         // set current values first
//         setName(m.name);
//         setDescription(m.description);
//         setPhotoFile(null);
//         setPhotoPreview(m.photoUrl || "");

//         // fetch latest detail (optional)
//         const detail = await fetchMemberDetail(m.id);
//         if (detail) {
//             setEditItem(detail);
//             setName(detail.name);
//             setDescription(detail.description);
//             setPhotoPreview(detail.photoUrl || "");
//             // photoFile remains null unless user selects new file
//         }
//     };

//     const closeModal = () => {
//         if (saving) return;
//         setModalOpen(false);
//         setEditItem(null);
//         setName("");
//         setDescription("");
//         setPhotoFile(null);
//         setPhotoPreview("");
//         setError("");
//     };

//     // ====== STORE API: /admin/group-members/store (POST multipart) ======
//     const createMember = async () => {
//         const token = getToken();
//         if (!token) {
//             setError("Token not found. Please login first.");
//             return;
//         }

//         const fd = new FormData();
//         fd.append("group_id", String(groupId)); // required in screenshot
//         fd.append("name", name.trim());
//         fd.append("description", description.trim());
//         if (photoFile) fd.append("photo", photoFile);


//         const res = await axios.post(`${apiUrl}/admin/group-members/store`, {
//             headers: { Accept: "application/json" },
//         });

//         return res.data;
//     };

//     // ====== UPDATE API: /admin/group-members/update/{id} (POST multipart) ======
//     const updateMember = async (id: number) => {
//         const token = getToken();
//         if (!token) {
//             setError("Token not found. Please login first.");
//             return;
//         }

//         const fd = new FormData();
//         fd.append("group_id", String(groupId));
//         fd.append("name", name.trim());
//         fd.append("description", description.trim());
//         if (photoFile) fd.append("photo", photoFile);


//         const res = await axios.post(`${apiUrl}/admin/group-members/update/${id}`, {
//             headers: { Accept: "application/json" },
//         });

//         return res.data;
//     };

//     const saveMember = async (e: FormEvent) => {
//         e.preventDefault();
//         setError("");

//         if (!name.trim()) {
//             setError("Please enter member name.");
//             return;
//         }

//         try {
//             setSaving(true);

//             if (mode === "create") {
//                 const data = await createMember();
//                 if (data?.status) {
//                     // easiest + safest: refresh list from API
//                     await fetchMembers();
//                     closeModal();
//                 } else {
//                     setError(data?.message || "Failed to create member.");
//                 }
//                 return;
//             }

//             if (mode === "edit" && editItem) {
//                 const data = await updateMember(editItem.id);
//                 if (data?.status) {
//                     await fetchMembers();
//                     closeModal();
//                 } else {
//                     setError(data?.message || "Failed to update member.");
//                 }
//             }
//         } catch (err: any) {
//             console.error("Save member error:", err);
//             setError(err?.response?.data?.message || "Something went wrong.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     // ====== DELETE (API not provided, so local only for now) ======
//     const deleteMember = (id: number) => {
//         const ok = window.confirm("Are you sure you want to delete this member?");
//         if (!ok) return;
//         // If you get delete API, replace this with API call.
//         setMembers((prev) => prev.filter((m) => m.id !== id));
//     };

//     return (
//         <main className="min-h-screen bg-[#f6f7fb] text-black">
//             <div className="mx-auto w-full max-w-7xl px-4 py-8">
//                 {/* Header */}
//                 <div className="flex items-start justify-between gap-3">
//                     <div className="flex flex-col gap-1">
//                         <h1 className="text-2xl font-semibold tracking-tight">Group Members</h1>
//                         <p className="text-sm text-black/60">
//                             Manage your team members
//                             {groupName ? (
//                                 <>
//                                     {" "}
//                                     • <span className="font-medium">{groupName}</span>
//                                     {leader ? <> (Leader: {leader})</> : null}
//                                 </>
//                             ) : null}
//                         </p>
//                         <p className="text-xs text-black/50">Group ID: {groupId}</p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={openCreate}
//                         className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//                     >
//                         <FiPlus className="text-base" />
//                         Add Member
//                     </button>
//                 </div>

//                 {/* Filters */}
//                 <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//                     <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//                         <div className="sm:col-span-12">
//                             <label className={labelCls}>Search</label>
//                             <input
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Search by name / id / description..."
//                                 className={`${inputCls} mt-2`}
//                             />
//                         </div>

//                         <div className="sm:col-span-12 flex items-center justify-between">
//                             <p className="mt-3 text-xs text-black/60">
//                                 {loadingList ? "Loading..." : `Total: ${members.length}`}
//                             </p>
//                             <button
//                                 type="button"
//                                 onClick={fetchMembers}
//                                 className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
//                             >
//                                 Refresh
//                             </button>
//                         </div>
//                     </div>

//                     {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
//                 </section>

//                 {/* TABLE LISTING */}
//                 <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-215 w-full">
//                             <thead className="bg-black/3">
//                                 <tr className="text-left text-sm font-semibold text-black">
//                                     <th className="px-4 py-3">Photo</th>
//                                     <th className="px-4 py-3">Member</th>
//                                     <th className="px-4 py-3">Description</th>
//                                     <th className="px-4 py-3">Created</th>
//                                     <th className="px-4 py-3 text-right">Actions</th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-black/10">
//                                 {filtered.map((m) => (
//                                     <tr key={m.id} className="hover:bg-black/2">
//                                         {/* Photo */}
//                                         <td className="px-4 py-3">
//                                             <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/3">
//                                                 {m.photoUrl ? (
//                                                     // eslint-disable-next-line @next/next/no-img-element
//                                                     <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
//                                                 ) : (
//                                                     <span className="text-sm font-bold text-primary">
//                                                         {m.name?.trim()?.[0]?.toUpperCase() || "M"}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </td>

//                                         {/* Member */}
//                                         <td className="px-4 py-3">
//                                             <div className="min-w-0">
//                                                 <p className="max-w-65 truncate font-semibold">{m.name}</p>
//                                                 <p className="text-xs text-black/50">ID: {m.id}</p>
//                                             </div>
//                                         </td>

//                                         {/* Description */}
//                                         <td className="px-4 py-3 text-sm text-black/70">
//                                             <p className="line-clamp-2">{m.description || "—"}</p>
//                                         </td>

//                                         {/* Created */}
//                                         <td className="px-4 py-3 text-sm text-black/60">{m.createdAt || "—"}</td>

//                                         {/* Actions */}
//                                         <td className="px-4 py-3">
//                                             <div className="flex justify-end gap-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => openEdit(m)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                                                     aria-label="Edit member"
//                                                     title="Edit"
//                                                 >
//                                                     <FiEdit2 className="text-lg" />
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     onClick={() => deleteMember(m.id)}
//                                                     className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                                                     aria-label="Delete member"
//                                                     title="Delete"
//                                                 >
//                                                     <FiTrash2 className="text-lg" />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}

//                                 {!loadingList && filtered.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
//                                             No members found.
//                                         </td>
//                                     </tr>
//                                 ) : null}

//                                 {loadingList ? (
//                                     <tr>
//                                         <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
//                                             Loading members...
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
//                     onClick={openCreate}
//                     className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95 sm:hidden"
//                 >
//                     <FiPlus className="text-base" />
//                     Add Member
//                 </button>
//             </div>

//             {/* CREATE / EDIT MODAL */}
//             {modalOpen ? (
//                 <div
//                     className="fixed inset-0 z-999 bg-black/40 px-4 py-10"
//                     onMouseDown={(e) => {
//                         if (e.target === e.currentTarget) closeModal();
//                     }}
//                 >
//                     <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
//                         <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
//                             <div>
//                                 <p className="text-base font-semibold">{mode === "create" ? "Add Member" : "Edit Member"}</p>
//                                 {mode === "edit" && editItem ? <p className="text-xs text-black/50">ID: {editItem.id}</p> : null}
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={closeModal}
//                                 disabled={saving}
//                                 className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5 disabled:opacity-60"
//                                 aria-label="Close"
//                                 title="Close"
//                             >
//                                 <FiX className="text-lg" />
//                             </button>
//                         </div>

//                         <form onSubmit={saveMember} className="px-5 py-5">
//                             {/* Photo */}
//                             <div>
//                                 <label className={labelCls}>Photo</label>

//                                 <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/2 p-4 hover:bg-black/4">
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
//                                         className="hidden"
//                                     />

//                                     <div className="flex items-center gap-3">
//                                         <div className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white">
//                                             {photoPreview ? (
//                                                 // eslint-disable-next-line @next/next/no-img-element
//                                                 <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
//                                             ) : (
//                                                 <FiUser className="text-xl text-primary" />
//                                             )}
//                                         </div>

//                                         <div className="min-w-0">
//                                             <p className="text-sm font-medium">
//                                                 {photoPreview ? "Photo selected" : "Upload member photo"}
//                                             </p>
//                                             <p className="text-xs text-black/60">Click to choose (optional)</p>
//                                         </div>
//                                     </div>
//                                 </label>

//                                 {photoPreview ? (
//                                     <button
//                                         type="button"
//                                         disabled={saving}
//                                         onClick={() => {
//                                             setPhotoFile(null);
//                                             setPhotoPreview("");
//                                         }}
//                                         className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60"
//                                     >
//                                         Remove photo
//                                     </button>
//                                 ) : null}
//                             </div>

//                             {/* Name */}
//                             <div className="mt-4">
//                                 <label className={labelCls}>
//                                     Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     placeholder="Enter member name"
//                                     className={`${inputCls} mt-2`}
//                                     required
//                                     disabled={saving}
//                                 />
//                             </div>

//                             {/* Description */}
//                             <div className="mt-4">
//                                 <label className={labelCls}>Description</label>
//                                 <textarea
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     placeholder="Write member role/notes..."
//                                     rows={4}
//                                     className={`${inputCls} mt-2 resize-none`}
//                                     disabled={saving}
//                                 />
//                             </div>

//                             {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

//                             <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
//                                 <button
//                                     type="button"
//                                     onClick={closeModal}
//                                     disabled={saving}
//                                     className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     type="submit"
//                                     disabled={saving}
//                                     className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
//                                 >
//                                     {saving ? "Saving..." : mode === "create" ? "Add Member" : "Update Member"}
//                                 </button>
//                             </div>

//                             <p className="mt-3 text-xs text-black/50">
//                                 This form calls API:
//                                 <br />• List: <span className="font-medium">/admin/group-members</span> (POST Token)
//                                 <br />• Store: <span className="font-medium">/admin/group-members/store</span> (FormData)
//                                 <br />• Detail: <span className="font-medium">/admin/group-members/:id</span> (POST)
//                                 <br />• Update: <span className="font-medium">/admin/group-members/update/:id</span> (FormData)
//                             </p>
//                         </form>
//                     </div>
//                 </div>
//             ) : null}
//         </main>
//     );
// }


"use client";

import axios from "axios";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiUser } from "react-icons/fi";
import { apiUrl } from "@/config";

type ApiMember = {
    id: number | string;
    group_id?: number | string;
    name?: string;
    description?: string;
    photo?: string;
    photo_url?: string;
    created_at?: string;
};

type Member = {
    id: number;
    groupId: number;
    name: string;
    description: string;
    photoUrl?: string;
    createdAt?: string;
};

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

export default function GroupMembersPage() {
    // ====== TOKEN (Bearer in headers) ======
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
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const ensureTokenOrError = () => {
        const token = getToken();
        if (!token) {
            setError("Token not found. Please login first.");
            return false;
        }
        return true;
    };

    // ====== DATA STATES ======
    const [members, setMembers] = useState<Member[]>([]);
    const [groupId, setGroupId] = useState<number>(1);
    const [groupName, setGroupName] = useState<string>("");
    const [leader, setLeader] = useState<string>("");

    const [loadingList, setLoadingList] = useState(false);

    // Search
    const [search, setSearch] = useState("");

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [editItem, setEditItem] = useState<Member | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Preview for photoFile
    useEffect(() => {
        if (!photoFile) return;
        const url = URL.createObjectURL(photoFile);
        setPhotoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [photoFile]);

    const normalizeMember = (x: ApiMember, fallbackGroupId: number): Member => ({
        id: Number(x.id),
        groupId: Number(x.group_id ?? fallbackGroupId),
        name: x.name ?? "",
        description: x.description ?? "",
        photoUrl: x.photo_url ?? "",
        createdAt: x.created_at ?? "",
    });

    // ====== LIST API: /admin/group-members (POST) with Bearer token header ======
    const fetchMembers = async () => {
        try {
            setLoadingList(true);
            setError("");

            if (!ensureTokenOrError()) {
                setMembers([]);
                return;
            }

            // ✅ IMPORTANT: axios.post(url, data, config)
            const res = await axios.post(`${apiUrl}/admin/group-members`, {}, authConfig());

            if (res.data?.status) {
                const g = res.data?.group;
                if (g?.group_id) setGroupId(Number(g.group_id));
                if (g?.group_name) setGroupName(String(g.group_name));
                if (g?.leader) setLeader(String(g.leader));

                const gid = Number(g?.group_id ?? groupId);
                const list: ApiMember[] = res.data?.data || [];
                setMembers(list.map((m) => normalizeMember(m, gid)));
            } else {
                setMembers([]);
                setError(res.data?.message || "Failed to load members.");
            }
        } catch (err: any) {
            console.error("Members fetch error:", err);
            setMembers([]);
            setError(err?.response?.data?.message || "Failed to load members.");
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ====== DETAIL API: /admin/group-members/{id} (POST) with Bearer token header ======
    const fetchMemberDetail = async (id: number) => {
        try {
            if (!ensureTokenOrError()) return null;

            // ✅ axios.post(url, data, config)
            const res = await axios.post(`${apiUrl}/admin/group-members/${id}`, {}, authConfig());

            if (res.data?.status && res.data?.data) {
                return normalizeMember(res.data.data as ApiMember, groupId);
            }
            return null;
        } catch (err) {
            console.error("Member detail fetch error:", err);
            return null;
        }
    };

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return members;
        return members.filter((m) => {
            return (
                m.name.toLowerCase().includes(s) ||
                (m.description || "").toLowerCase().includes(s) ||
                String(m.id).toLowerCase().includes(s)
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

    const openEdit = async (m: Member) => {
        setMode("edit");
        setEditItem(m);

        setError("");
        setModalOpen(true);

        setName(m.name);
        setDescription(m.description);
        setPhotoFile(null);
        setPhotoPreview(m.photoUrl || "");

        const detail = await fetchMemberDetail(m.id);
        if (detail) {
            setEditItem(detail);
            setName(detail.name);
            setDescription(detail.description);
            setPhotoPreview(detail.photoUrl || "");
        }
    };

    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
        setEditItem(null);
        setName("");
        setDescription("");
        setPhotoFile(null);
        setPhotoPreview("");
        setError("");
    };

    // ====== STORE API: /admin/group-members/store (POST multipart) with Bearer token header ======
    const createMember = async () => {
        if (!ensureTokenOrError()) return null;

        const fd = new FormData();
        fd.append("group_id", String(groupId));
        fd.append("name", name.trim());
        fd.append("description", description.trim());
        if (photoFile) fd.append("photo", photoFile);

        // ✅ axios.post(url, formData, config)
        const res = await axios.post(`${apiUrl}/admin/group-members/store`, fd, authConfig());
        return res.data;
    };

    // ====== UPDATE API: /admin/group-members/update/{id} (POST multipart) with Bearer token header ======
    const updateMember = async (id: number) => {
        if (!ensureTokenOrError()) return null;

        const fd = new FormData();
        fd.append("group_id", String(groupId));
        fd.append("name", name.trim());
        fd.append("description", description.trim());
        if (photoFile) fd.append("photo", photoFile);

        // ✅ axios.post(url, formData, config)
        const res = await axios.post(`${apiUrl}/admin/group-members/update/${id}`, fd, authConfig());
        return res.data;
    };

    const saveMember = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Please enter member name.");
            return;
        }

        try {
            setSaving(true);

            if (mode === "create") {
                const data = await createMember();
                if (data?.status) {
                    await fetchMembers();
                    closeModal();
                } else {
                    setError(data?.message || "Failed to create member.");
                }
                return;
            }

            if (mode === "edit" && editItem) {
                const data = await updateMember(editItem.id);
                if (data?.status) {
                    await fetchMembers();
                    closeModal();
                } else {
                    setError(data?.message || "Failed to update member.");
                }
            }
        } catch (err: any) {
            console.error("Save member error:", err);
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    // DELETE API not provided (still local)
    const deleteMember = (id: number) => {
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
                        <p className="text-sm text-black/60">
                            Manage your team members
                            {groupName ? (
                                <>
                                    {" "}
                                    • <span className="font-medium">{groupName}</span>
                                    {leader ? <> (Leader: {leader})</> : null}
                                </>
                            ) : null}
                        </p>
                        <p className="text-xs text-black/50">Group ID: {groupId}</p>
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

                        <div className="sm:col-span-12 flex items-center justify-between">
                            <p className="mt-3 text-xs text-black/60">
                                {loadingList ? "Loading..." : `Total: ${members.length}`}
                            </p>
                            <button
                                type="button"
                                onClick={fetchMembers}
                                className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
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
                                        <td className="px-4 py-3">
                                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/3">
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

                                        <td className="px-4 py-3">
                                            <div className="min-w-0">
                                                <p className="max-w-65 truncate font-semibold">{m.name}</p>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-black/70">
                                            <p className="line-clamp-2">{m.description || "—"}</p>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-black/60">{m.createdAt || "—"}</td>

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

                                {!loadingList && filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
                                            No members found.
                                        </td>
                                    </tr>
                                ) : null}

                                {loadingList ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
                                            Loading members...
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
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95 sm:hidden"
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
                                <p className="text-base font-semibold">{mode === "create" ? "Add Member" : "Edit Member"}</p>
                                {mode === "edit" && editItem ? (
                                    <p className="text-xs text-black/50">ID: {editItem.id}</p>
                                ) : null}
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 hover:bg-black/5 disabled:opacity-60"
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
                                        disabled={saving}
                                        onClick={() => {
                                            setPhotoFile(null);
                                            setPhotoPreview("");
                                        }}
                                        className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60"
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
                                    disabled={saving}
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
                                    disabled={saving}
                                />
                            </div>

                            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : mode === "create" ? "Add Member" : "Update Member"}
                                </button>
                            </div>

                            <p className="mt-3 text-xs text-black/50">
                                Token is sent in header as:
                                <br />
                                <span className="font-medium">Authorization: Bearer {"<token>"}</span>
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}
        </main>
    );
}

