"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiImage } from "react-icons/fi";
import { BlogItem, deleteBlog, loadBlogs } from "../../context/blogStore";

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";

function formatCreated(v: string) {
    try {
        return new Date(v).toLocaleString();
    } catch {
        return v;
    }
}

export default function BlogMasterPage() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setBlogs(loadBlogs());
    }, []);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return blogs.filter((b) => {
            if (!s) return true;
            return (
                b.title.toLowerCase().includes(s) ||
                b.id.toLowerCase().includes(s) ||
                (b.focusKeyword || "").toLowerCase().includes(s)
            );
        });
    }, [blogs, search]);

    const onDelete = (id: string) => {
        const ok = window.confirm("Are you sure you want to delete this blog?");
        if (!ok) return;
        deleteBlog(id);
        setBlogs(loadBlogs());
    };

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Blog Master</h1>
                        <p className="text-sm text-black/60">
                            Add, update and delete blog posts with SEO fields.
                        </p>
                    </div>

                    {/* CALL ADD PAGE */}
                    <Link
                        href="/superadmin/blog/add"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                    >
                        <FiPlus className="text-base" />
                        Add Blog
                    </Link>
                </div>

                {/* Filters */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                        <div className="sm:col-span-12">
                            <label className={labelCls}>Search</label>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title / id / focus keyword..."
                                className={`${inputCls} mt-2`}
                            />
                        </div>
                    </div>
                </section>

                {/* Table Listing */}
                <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-262.5 w-full">
                            <thead className="bg-black/3">
                                <tr className="text-left text-sm font-semibold text-black">
                                    <th className="px-4 py-3">Photo</th>
                                    <th className="px-4 py-3">Blog</th>
                                    <th className="px-4 py-3">SEO</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {filtered.map((b) => (
                                    <tr key={b.id} className="hover:bg-black/2">
                                        {/* Photo */}
                                        <td className="px-4 py-3">
                                            <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/3 flex items-center justify-center">
                                                {b.photoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={b.photoUrl} alt={b.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-xs text-black/50 inline-flex items-center gap-1">
                                                        <FiImage /> No photo
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Blog */}
                                        <td className="px-4 py-3">
                                            <p className="font-semibold max-w-105 truncate">{b.title}</p>
                                            <p className="text-xs text-black/50">ID: {b.id}</p>
                                            <p className="mt-1 text-sm text-black/60 line-clamp-2 max-w-130">
                                                {b.description}
                                            </p>
                                        </td>

                                        {/* SEO */}
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-black/70 max-w-85 truncate">
                                                <span className="font-semibold text-black">Meta:</span> {b.metaTitle || "—"}
                                            </p>
                                            <p className="text-xs text-black/50 max-w-85 truncate">
                                                Focus: {b.focusKeyword || "—"}
                                            </p>
                                        </td>

                                        {/* Created */}
                                        <td className="px-4 py-3 text-sm text-black/60">{formatCreated(b.createdAt)}</td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {/* EDIT PAGE */}
                                                <Link
                                                    href={`/superadmin/blog/${b.id}`}
                                                    className="inline-flex items-center justify-center rounded-xl text-black bg-white p-2 "
                                                    aria-label="Edit"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="text-lg" />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(b.id)}
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
                                            No blogs found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </section>

                <p className="mt-3 text-xs text-black/50">
                    * Photo preview is local only. For real save, upload using API (FormData).
                </p>
            </div>
        </main>
    );
}
