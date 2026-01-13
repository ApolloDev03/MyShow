"use client";

import axios from "axios";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiUser } from "react-icons/fi";
import { apiUrl } from "@/config";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

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
            toast.error("Token not found. Please login first.");
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

    // ✅ if user removes existing photo during edit
    const [removePhoto, setRemovePhoto] = useState(false);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");

    // ✅ Delete confirm popup
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

    const askDelete = (m: Member) => {
        setPendingDelete(m);
        setConfirmDeleteOpen(true);
    };

    const closeDeleteConfirm = () => {
        if (deletingId) return;
        setConfirmDeleteOpen(false);
        setPendingDelete(null);
    };

    // Preview for photoFile (only when user selects new file)
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

    // ====== LIST API ======
    const fetchMembers = async () => {
        try {
            setLoadingList(true);
            setError("");

            if (!ensureTokenOrError()) {
                setMembers([]);
                return;
            }

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
                const msg = res.data?.message || "Failed to load members.";
                setError(msg);
                toast.error(msg);
            }
        } catch (err: any) {
            console.error("Members fetch error:", err);
            setMembers([]);
            const msg = err?.response?.data?.message || "Failed to load members.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ====== DETAIL API ======
    const fetchMemberDetail = async (id: number) => {
        try {
            if (!ensureTokenOrError()) return null;

            const res = await axios.post(`${apiUrl}/admin/group-members/edit/${id}`, {}, authConfig());

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
        setRemovePhoto(false);
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

        // ✅ reset file state for edit
        setPhotoFile(null);
        setRemovePhoto(false);

        // ✅ show existing photo url
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
        setRemovePhoto(false);
        setError("");
    };

    // ====== STORE API ======
    const createMember = async () => {
        if (!ensureTokenOrError()) return null;

        const fd = new FormData();
        fd.append("group_id", String(groupId));
        fd.append("name", name.trim());
        fd.append("description", description.trim());
        if (photoFile) fd.append("photo", photoFile);

        const res = await axios.post(`${apiUrl}/admin/group-members/store`, fd, authConfig());
        return res.data;
    };

    // ====== UPDATE API (photo handled correctly) ======
    const updateMember = async (id: number) => {
        if (!ensureTokenOrError()) return null;

        const fd = new FormData();
        fd.append("group_id", String(groupId));
        fd.append("name", name.trim());
        fd.append("description", description.trim());

        // ✅ if user removed old photo, send remove flag
        if (removePhoto) {
            fd.append("remove_photo", "1");
        } else if (photoFile) {
            // ✅ if user selected new file, send file
            fd.append("photo", photoFile);
        }
        // ✅ else don't send photo => keep old photo

        const res = await axios.post(`${apiUrl}/admin/group-members/update/${id}`, fd, authConfig());
        return res.data;
    };

    const saveMember = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Please enter member name.");
            toast.error("Please enter member name.");
            return;
        }

        const toastId = toast.loading(mode === "create" ? "Adding member..." : "Updating member...");

        try {
            setSaving(true);

            if (mode === "create") {
                const data = await createMember();
                if (data?.status) {
                    toast.update(toastId, {
                        render: data?.message || "Member added successfully!",
                        type: "success",
                        isLoading: false,
                        autoClose: 2000,
                    });
                    await fetchMembers();
                    closeModal();
                } else {
                    const msg = data?.message || "Failed to create member.";
                    setError(msg);
                    toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 2500 });
                }
                return;
            }

            if (mode === "edit" && editItem) {
                const data = await updateMember(editItem.id);
                if (data?.status) {
                    toast.update(toastId, {
                        render: data?.message || "Member updated successfully!",
                        type: "success",
                        isLoading: false,
                        autoClose: 2000,
                    });
                    await fetchMembers();
                    closeModal();
                } else {
                    const msg = data?.message || "Failed to update member.";
                    setError(msg);
                    toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 2500 });
                }
            }
        } catch (err: any) {
            console.error("Save member error:", err);
            const msg = err?.response?.data?.message || "Something went wrong.";
            setError(msg);
            toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 2500 });
        } finally {
            setSaving(false);
        }
    };

    // ✅ DELETE API (NO window.confirm) + toast + loader + confirm popup close
    const deleteMember = async (id: number) => {
        try {
            setError("");
            if (!ensureTokenOrError()) return;

            setDeletingId(id);

            const res = await axios.post(`${apiUrl}/admin/group-members/delete/${id}`, {}, authConfig());

            if (res.data?.status) {
                toast.success(res.data?.message || "Member deleted successfully!");
                await fetchMembers();
                closeDeleteConfirm();
            } else {
                const msg = res.data?.message || "Failed to delete member.";
                setError(msg);
                toast.error(msg);
            }
        } catch (err: any) {
            console.error("Delete member error:", err);
            const msg = err?.response?.data?.message || "Failed to delete member.";
            setError(msg);
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick pauseOnHover draggable />

            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Group Members</h1>
                       
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
                                placeholder="Search by name / description..."
                                className={`${inputCls} mt-2`}
                            />
                        </div>

                        <div className="sm:col-span-12 flex items-center justify-between">
                            <p className="mt-3 text-xs text-black/60">{loadingList ? "Loading..." : `Total: ${members.length}`}</p>

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
                                                    <span className="text-sm font-bold text-primary">{m.name?.trim()?.[0]?.toUpperCase() || "M"}</span>
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


                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(m)}
                                                    disabled={deletingId === m.id}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5 disabled:opacity-60"
                                                    aria-label="Edit member"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="text-lg" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => askDelete(m)}
                                                    disabled={deletingId === m.id}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                    aria-label="Delete member"
                                                    title="Delete"
                                                >
                                                    {deletingId === m.id ? <Spinner className="h-5 w-5" /> : <FiTrash2 className="text-lg" />}
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
                                            <span className="inline-flex items-center gap-2">
                                                <Spinner className="h-4 w-4" />
                                                Loading members...
                                            </span>
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

            {/* ✅ DELETE CONFIRM POPUP */}
            {confirmDeleteOpen && pendingDelete ? (
                <ConfirmDeleteModal
                    name={pendingDelete.name}
                    loading={deletingId === pendingDelete.id}
                    onCancel={closeDeleteConfirm}
                    onConfirm={() => deleteMember(pendingDelete.id)}
                />
            ) : null}

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
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            setPhotoFile(file);

                                            // if user selects a file, cancel remove flag
                                            if (file) setRemovePhoto(false);
                                        }}
                                        className="hidden"
                                        disabled={saving}
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
                                            <p className="text-sm font-medium">{photoPreview ? "Photo selected" : "Upload member photo"}</p>
                                            <p className="text-xs text-black/60">Click to choose (optional)</p>
                                            {removePhoto ? <p className="text-xs text-red-600 mt-1">Photo will be removed on update</p> : null}
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
                                            setRemovePhoto(true);
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
                                    className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Spinner className="h-4 w-4" />
                                            Saving...
                                        </>
                                    ) : mode === "create" ? (
                                        "Add Member"
                                    ) : (
                                        "Update Member"
                                    )}
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

function ConfirmDeleteModal({
    name,
    loading,
    onCancel,
    onConfirm,
}: {
    name: string;
    loading: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onCancel();
        };
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [onCancel, loading]);

    return (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loading) onCancel();
            }}
        >
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10 overflow-hidden">
                <div className="p-5 border-b border-black/10">
                    <p className="text-base font-semibold text-black">Confirm Delete</p>
                    <p className="mt-1 text-sm text-black/60">
                        Are you sure you want to delete <span className="font-semibold text-black">{name}</span>?
                    </p>
                </div>

                <div className="p-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Spinner className="h-4 w-4" />
                                Deleting...
                            </>
                        ) : (
                            "Yes, Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
