"use client";

import React, { useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type SortType = "newest" | "oldest" | "name";

type Testimonial = {
    id: string;
    name: string;
    description: string;
    photo: string; // base64 or URL
    updatedAt: string; // ISO string
};

const initialData: Testimonial[] = [
    {
        id: "1",
        name: "Apollo Coders",
        description: "Great service and fast delivery. Highly recommended!",
        photo: "",
        updatedAt: new Date().toISOString(),
    },
];

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString();
}

function makeId(): string {
    // Browser-safe UUID with fallback
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return (crypto as Crypto).randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type TestimonialPayload = Pick<Testimonial, "name" | "description" | "photo">;

type TestimonialModalProps = {
    initial: Testimonial | null;
    onClose: () => void;
    onSave: (payload: TestimonialPayload) => void;
};

type ConfirmDialogProps = {
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function TestimonialMasterPage() {
    const [items, setItems] = useState<Testimonial[]>(initialData);
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<SortType>("newest");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null);

    const filtered = useMemo<Testimonial[]>(() => {
        let data = [...items].filter((x) =>
            x.name.toLowerCase().includes(search.toLowerCase())
        );

        if (sort === "newest")
            data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        if (sort === "oldest")
            data.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
        if (sort === "name") data.sort((a, b) => a.name.localeCompare(b.name));

        return data;
    }, [items, search, sort]);

    function openAdd(): void {
        setEditing(null);
        setIsModalOpen(true);
    }

    function openEdit(item: Testimonial): void {
        setEditing(item);
        setIsModalOpen(true);
    }

    function saveItem(payload: TestimonialPayload): void {
        const nowIso = new Date().toISOString();

        // Add
        if (!editing) {
            const newItem: Testimonial = {
                id: makeId(),
                ...payload,
                updatedAt: nowIso,
            };
            setItems((prev) => [newItem, ...prev]);
            setIsModalOpen(false);
            return;
        }

        // Update
        setItems((prev) =>
            prev.map((x) =>
                x.id === editing.id ? { ...x, ...payload, updatedAt: nowIso } : x
            )
        );

        setIsModalOpen(false);
        setEditing(null);
    }

    function doDelete(item: Testimonial): void {
        setItems((prev) => prev.filter((x) => x.id !== item.id));
        setConfirmDelete(null);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Testimonial Master
                        </h1>
                        <p className="text-slate-600">Add, update, and manage testimonials.</p>
                    </div>

                    <button
                        onClick={openAdd}
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        + Add Testimonial
                    </button>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 sm:max-w-sm"
                        />

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">Sort:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortType)}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="name">Name (A–Z)</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-600">
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 pr-3">Photo</th>
                                    <th className="py-3 pr-3">Name</th>
                                    <th className="py-3 pr-3">Description</th>
                                    <th className="py-3 pr-3">Updated</th>
                                    <th className="py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-slate-500">
                                            No testimonials found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-100">
                                            <td className="py-3 pr-3">
                                                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                                                    {item.photo ? (
                                                        <img
                                                            src={item.photo}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                                            N/A
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3 pr-3 font-medium text-slate-900">
                                                {item.name}
                                            </td>

                                            <td className="py-3 pr-3 text-slate-700">
                                                <div className="max-w-xl truncate">{item.description}</div>
                                            </td>

                                            <td className="py-3 pr-3 text-slate-600">
                                                {formatDate(item.updatedAt)}
                                            </td>

                                            <td className="py-3 text-right">

                                                <div className="flex justify-end gap-2">
                                                    {/* EDIT PAGE */}
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
                                                        aria-label="Edit"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDelete(item)}
                                                        className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
                                                        aria-label="Delete"
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
                    <TestimonialModal
                        initial={editing}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditing(null);
                        }}
                        onSave={saveItem}
                    />
                )}

                {confirmDelete && (
                    <ConfirmDialog
                        title="Delete Testimonial?"
                        message="This action can’t be undone."
                        onCancel={() => setConfirmDelete(null)}
                        onConfirm={() => doDelete(confirmDelete)}
                    />
                )}
            </div>
        </div>
    );
}

function TestimonialModal({
    initial,
    onClose,
    onSave,
}: TestimonialModalProps) {
    const [name, setName] = useState<string>(initial?.name ?? "");
    const [description, setDescription] = useState<string>(
        initial?.description ?? ""
    );
    const [photo, setPhoto] = useState<string>(initial?.photo ?? "");
    const [error, setError] = useState<string>("");

    function onPickFile(file?: File): void {
        if (!file) return;

        if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setError("Only JPG/PNG files are allowed.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Max file size is 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(String(reader.result));
            setError("");
        };
        reader.readAsDataURL(file);
    }

    function submit(): void {
        if (name.trim().length < 2) return setError("Name is required (min 2 chars).");
        if (description.trim().length < 10)
            return setError("Description is required (min 10 chars).");

        // photo required on add; optional on edit
        if (!initial && !photo) return setError("Photo is required for new testimonial.");

        onSave({ name: name.trim(), description: description.trim(), photo });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {initial ? "Edit Testimonial" : "Add Testimonial"}
                        </h2>
                        <p className="text-sm text-slate-600">Set photo, name, and description.</p>
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
                        <label className="text-sm font-medium text-slate-800">Photo</label>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                                {photo ? (
                                    <img
                                        src={photo}
                                        alt="preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                        Preview
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        onPickFile(e.target.files?.[0])
                                    }
                                    className="block w-full text-sm"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    JPG/PNG, max 2MB, recommended 400×400.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-800">Name</label>
                        <input
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setName(e.target.value)
                            }
                            placeholder="e.g., Rahul Sharma"
                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-800">Description</label>
                        <textarea
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Write the testimonial message..."
                            rows={4}
                            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                        <div className="mt-1 flex justify-between text-xs text-slate-500">
                            <span>Min 10 characters</span>
                            <span>{description.length}/500</span>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={submit}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        {initial ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfirmDialog({
    title,
    message,
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{message}</p>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
