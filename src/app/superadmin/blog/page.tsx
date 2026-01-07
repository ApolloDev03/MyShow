// // app/superadmin/master/blog/page.tsx
// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage } from "react-icons/fi";

// type BlogItem = {
//   id: string;

//   title: string;
//   photoUrl?: string; // preview only
//   description: string;

//   // SEO
//   metaTitle: string;
//   metaKeywords: string;
//   metaDescription: string;
//   seoHead: string;
//   seoBody: string;
//   focusKeyword: string;

//   createdAt: string;
// };

// const inputCls =
//   "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
// const labelCls = "text-sm font-medium text-black";
// const helperCls = "text-xs text-black/60";

// export default function BlogMasterPage() {
//   // Dummy blogs (API later)
//   const [blogs, setBlogs] = useState<BlogItem[]>([
//     {
//       id: "BL-1001",
//       title: "Top 10 Event Ideas for 2026",
//       photoUrl: "",
//       description: "A quick list of trending event ideas that work great for any city.",
//       metaTitle: "Top 10 Event Ideas for 2026",
//       metaKeywords: "events, event ideas, 2026, myshow",
//       metaDescription: "Explore top 10 event ideas for 2026 to make your show successful.",
//       seoHead: "<!-- optional custom head tags -->",
//       seoBody: "<!-- optional schema / scripts -->",
//       focusKeyword: "event ideas 2026",
//       createdAt: "2 hours ago",
//     },
//     {
//       id: "BL-1002",
//       title: "How to Promote Your Show",
//       photoUrl: "",
//       description: "Simple marketing steps to sell more tickets and reach more audience.",
//       metaTitle: "How to Promote Your Show",
//       metaKeywords: "promotion, marketing, tickets, show",
//       metaDescription: "Learn how to promote your show with easy strategies.",
//       seoHead: "",
//       seoBody: "",
//       focusKeyword: "promote show",
//       createdAt: "Yesterday",
//     },
//   ]);

//   // Filters
//   const [search, setSearch] = useState("");

//   // Modal
//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState<"add" | "edit">("add");
//   const [draft, setDraft] = useState<BlogItem | null>(null);

//   const filtered = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return blogs.filter((b) => {
//       if (!s) return true;
//       return (
//         b.title.toLowerCase().includes(s) ||
//         b.id.toLowerCase().includes(s) ||
//         b.focusKeyword.toLowerCase().includes(s)
//       );
//     });
//   }, [blogs, search]);

//   const openAdd = () => {
//     setMode("add");
//     setDraft({
//       id: "",
//       title: "",
//       photoUrl: "",
//       description: "",
//       metaTitle: "",
//       metaKeywords: "",
//       metaDescription: "",
//       seoHead: "",
//       seoBody: "",
//       focusKeyword: "",
//       createdAt: "",
//     });
//     setOpen(true);
//   };

//   const openEdit = (item: BlogItem) => {
//     setMode("edit");
//     setDraft({ ...item });
//     setOpen(true);
//   };

//   const closeModal = () => {
//     setOpen(false);
//     setDraft(null);
//   };

//   const saveBlog = () => {
//     if (!draft) return;

//     // Required validation (you can change required rules)
//     if (!draft.title.trim()) return alert("Please enter Title");
//     if (!draft.description.trim()) return alert("Please enter Description");

//     // SEO validations (optional)
//     if (!draft.metaTitle.trim()) return alert("Please enter Meta Title");
//     if (!draft.metaDescription.trim()) return alert("Please enter Meta Description");

//     if (mode === "add") {
//       const newItem: BlogItem = {
//         ...draft,
//         id: `BL-${Math.floor(1000 + Math.random() * 9000)}`,
//         createdAt: "Just now",
//       };
//       setBlogs((prev) => [newItem, ...prev]);
//     } else {
//       setBlogs((prev) => prev.map((x) => (x.id === draft.id ? draft : x)));
//     }

//     // TODO (API):
//     // const fd = new FormData()
//     // fd.append("title", draft.title)
//     // fd.append("description", draft.description)
//     // fd.append("metaTitle", draft.metaTitle)
//     // fd.append("metaKeywords", draft.metaKeywords)
//     // fd.append("metaDescription", draft.metaDescription)
//     // fd.append("seoHead", draft.seoHead)
//     // fd.append("seoBody", draft.seoBody)
//     // fd.append("focusKeyword", draft.focusKeyword)
//     // fd.append("photo", photoFile) // from modal
//     // call API...

//     closeModal();
//   };

//   const deleteBlog = (id: string) => {
//     const ok = window.confirm("Are you sure you want to delete this blog?");
//     if (!ok) return;
//     setBlogs((prev) => prev.filter((x) => x.id !== id));
//   };

//   return (
//     <main className="min-h-screen bg-[#f6f7fb] text-black">
//       <div className="mx-auto w-full max-w-7xl px-4 py-8">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex flex-col gap-1">
//             <h1 className="text-2xl font-semibold tracking-tight">Blog Master</h1>
//             <p className="text-sm text-black/60">
//               Add, update and delete blog posts with SEO fields.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={openAdd}
//             className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
//           >
//             <FiPlus className="text-base" />
//             Add Blog
//           </button>
//         </div>

//         {/* Filters */}
//         <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
//           <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
//             <div className="sm:col-span-12">
//               <label className={labelCls}>Search</label>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by title / id / focus keyword..."
//                 className={`${inputCls} mt-2`}
//               />
//             </div>
//           </div>
//         </section>

//         {/* Table Listing */}
//         <section className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="min-w-[1050px] w-full">
//               <thead className="bg-black/[0.03]">
//                 <tr className="text-left text-sm font-semibold text-black">
//                   <th className="px-4 py-3">Photo</th>
//                   <th className="px-4 py-3">Blog</th>
//                   <th className="px-4 py-3">SEO</th>
//                   <th className="px-4 py-3">Created</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-black/10">
//                 {filtered.map((b) => (
//                   <tr key={b.id} className="hover:bg-black/[0.02]">
//                     {/* Photo */}
//                     <td className="px-4 py-3">
//                       <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/[0.03] flex items-center justify-center">
//                         {b.photoUrl ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={b.photoUrl} alt={b.title} className="h-full w-full object-cover" />
//                         ) : (
//                           <span className="text-xs text-black/50 inline-flex items-center gap-1">
//                             <FiImage /> No photo
//                           </span>
//                         )}
//                       </div>
//                     </td>

//                     {/* Blog */}
//                     <td className="px-4 py-3">
//                       <p className="font-semibold max-w-[420px] truncate">{b.title}</p>
//                       <p className="text-xs text-black/50">ID: {b.id}</p>
//                       <p className="mt-1 text-sm text-black/60 line-clamp-2 max-w-[520px]">
//                         {b.description}
//                       </p>
//                     </td>

//                     {/* SEO */}
//                     <td className="px-4 py-3">
//                       <p className="text-sm text-black/70 max-w-[340px] truncate">
//                         <span className="font-semibold text-black">Meta:</span> {b.metaTitle || "—"}
//                       </p>
//                       <p className="text-xs text-black/50 max-w-[340px] truncate">
//                         Focus: {b.focusKeyword || "—"}
//                       </p>
//                     </td>

//                     {/* Created */}
//                     <td className="px-4 py-3 text-sm text-black/60">{b.createdAt}</td>

//                     {/* Actions */}
//                     <td className="px-4 py-3">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEdit(b)}
//                           className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
//                           aria-label="Edit"
//                           title="Edit"
//                         >
//                           <FiEdit2 className="text-lg" />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => deleteBlog(b.id)}
//                           className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 text-red-600 hover:bg-red-50"
//                           aria-label="Delete"
//                           title="Delete"
//                         >
//                           <FiTrash2 className="text-lg" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-4 py-10 text-center text-sm text-black/60">
//                       No blogs found.
//                     </td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <p className="mt-3 text-xs text-black/50">
//           * Photo preview is local only. For real save, upload using API (FormData).
//         </p>
//       </div>

//       {/* Add/Edit Modal */}
//       {open && draft ? (
//         <BlogModal
//           mode={mode}
//           draft={draft}
//           setDraft={setDraft}
//           onClose={closeModal}
//           onSave={saveBlog}
//         />
//       ) : null}
//     </main>
//   );
// }

// function BlogModal({
//   mode,
//   draft,
//   setDraft,
//   onClose,
//   onSave,
// }: {
//   mode: "add" | "edit";
//   draft: BlogItem;
//   setDraft: (next: BlogItem) => void;
//   onClose: () => void;
//   onSave: () => void;
// }) {
//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string>("");

//   // ESC close
//   useEffect(() => {
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", onEsc);
//     return () => document.removeEventListener("keydown", onEsc);
//   }, [onClose]);

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

//   // Apply preview to draft (for listing)
//   useEffect(() => {
//     if (photoPreview) setDraft({ ...draft, photoUrl: photoPreview });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [photoPreview]);

//   const shownPhoto = photoPreview || draft.photoUrl || "";

//   return (
//     <div
//       className="fixed inset-0 z-[999] bg-black/40 p-4 sm:p-6 flex items-center justify-center"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-3 border-b border-black/10 px-5 py-4">
//           <div>
//             <h3 className="text-lg font-semibold">
//               {mode === "add" ? "Add Blog" : "Update Blog"}
//             </h3>
//             <p className="text-sm text-black/60">
//               Fill title, photo, description and SEO fields.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5"
//             aria-label="Close"
//             title="Close"
//           >
//             <FiX className="text-lg" />
//           </button>
//         </div>

//         {/* Body (scroll inside modal) */}
//         <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-5 py-5">
//           <div className="grid gap-6 lg:grid-cols-12">
//             {/* Left: Photo */}
//             <div className="lg:col-span-5">
//               <p className={labelCls}>Photo</p>

//               <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/[0.02] p-4 hover:bg-black/[0.04]">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
//                   className="hidden"
//                 />

//                 {!shownPhoto ? (
//                   <div className="flex items-center gap-3">
//                     <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//                       <FiImage className="text-xl" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold">Upload blog photo</p>
//                       <p className={helperCls}>Click to choose (optional)</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img src={shownPhoto} alt="Blog" className="h-44 w-full object-cover" />
//                   </div>
//                 )}
//               </label>

//               {shownPhoto ? (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setPhotoFile(null);
//                     setPhotoPreview("");
//                     setDraft({ ...draft, photoUrl: "" });
//                   }}
//                   className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
//                 >
//                   Remove photo
//                 </button>
//               ) : null}
//             </div>

//             {/* Right: Main fields */}
//             <div className="lg:col-span-7">
//               <div className="grid gap-4">
//                 <div>
//                   <label className={labelCls}>
//                     Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={draft.title}
//                     onChange={(e) => setDraft({ ...draft, title: e.target.value })}
//                     placeholder="Enter blog title"
//                     className={`${inputCls} mt-2`}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelCls}>
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={draft.description}
//                     onChange={(e) => setDraft({ ...draft, description: e.target.value })}
//                     placeholder="Write blog description..."
//                     className={`${inputCls} mt-2 resize-none`}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* SEO Section */}
//           <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-semibold">SEO</p>
//               <p className="text-xs text-black/50">Meta + Head/Body + Keywords</p>
//             </div>

//             <div className="mt-4 grid gap-4 lg:grid-cols-2">
//               <div>
//                 <label className={labelCls}>
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={draft.metaTitle}
//                   onChange={(e) => setDraft({ ...draft, metaTitle: e.target.value })}
//                   placeholder="Meta title"
//                   className={`${inputCls} mt-2`}
//                 />
//               </div>

//               <div>
//                 <label className={labelCls}>Meta Keywords</label>
//                 <input
//                   value={draft.metaKeywords}
//                   onChange={(e) => setDraft({ ...draft, metaKeywords: e.target.value })}
//                   placeholder="keyword1, keyword2, keyword3"
//                   className={`${inputCls} mt-2`}
//                 />
//               </div>

//               <div className="lg:col-span-2">
//                 <label className={labelCls}>
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   rows={3}
//                   value={draft.metaDescription}
//                   onChange={(e) => setDraft({ ...draft, metaDescription: e.target.value })}
//                   placeholder="Meta description..."
//                   className={`${inputCls} mt-2 resize-none`}
//                 />
//               </div>

//               <div>
//                 <label className={labelCls}>Focus Keyword</label>
//                 <input
//                   value={draft.focusKeyword}
//                   onChange={(e) => setDraft({ ...draft, focusKeyword: e.target.value })}
//                   placeholder="Focus keyword"
//                   className={`${inputCls} mt-2`}
//                 />
//               </div>

//               <div />

//               <div className="lg:col-span-2">
//                 <label className={labelCls}>SEO Head</label>
//                 <textarea
//                   rows={4}
//                   value={draft.seoHead}
//                   onChange={(e) => setDraft({ ...draft, seoHead: e.target.value })}
//                   placeholder="Optional: custom head tags, meta, etc."
//                   className={`${inputCls} mt-2 resize-none font-mono text-sm`}
//                 />
//               </div>

//               <div className="lg:col-span-2">
//                 <label className={labelCls}>SEO Body</label>
//                 <textarea
//                   rows={4}
//                   value={draft.seoBody}
//                   onChange={(e) => setDraft({ ...draft, seoBody: e.target.value })}
//                   placeholder="Optional: schema, script, body content"
//                   className={`${inputCls} mt-2 resize-none font-mono text-sm`}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 border-t border-black/10 px-5 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-black/5"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={onSave}
//             className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
//           >
//             <FiPlus className="text-base" />
//             {mode === "add" ? "Add Blog" : "Update Blog"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// app/superadmin/master/blog/page.tsx
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
                        <table className="min-w-[1050px] w-full">
                            <thead className="bg-black/[0.03]">
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
                                    <tr key={b.id} className="hover:bg-black/[0.02]">
                                        {/* Photo */}
                                        <td className="px-4 py-3">
                                            <div className="h-12 w-20 overflow-hidden rounded-xl border border-black/10 bg-black/[0.03] flex items-center justify-center">
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
                                            <p className="font-semibold max-w-[420px] truncate">{b.title}</p>
                                            <p className="text-xs text-black/50">ID: {b.id}</p>
                                            <p className="mt-1 text-sm text-black/60 line-clamp-2 max-w-[520px]">
                                                {b.description}
                                            </p>
                                        </td>

                                        {/* SEO */}
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-black/70 max-w-[340px] truncate">
                                                <span className="font-semibold text-black">Meta:</span> {b.metaTitle || "—"}
                                            </p>
                                            <p className="text-xs text-black/50 max-w-[340px] truncate">
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
                                                    href={`/superadmin/blog/${b.id}/edit`}
                                                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2 hover:bg-black/5"
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
