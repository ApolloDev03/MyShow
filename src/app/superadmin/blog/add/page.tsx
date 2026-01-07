// app/superadmin/master/blog/add/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiSave, FiImage } from "react-icons/fi";
import { addBlog } from "../../../context/blogStore";

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary";
const labelCls = "text-sm font-medium text-black";
const helperCls = "text-xs text-black/60";

type Draft = {
    title: string;
    photoUrl: string;
    description: string;
    metaTitle: string;
    metaKeywords: string;
    metaDescription: string;
    seoHead: string;
    seoBody: string;
    focusKeyword: string;
};

export default function AddBlogPage() {
    const router = useRouter();

    const [draft, setDraft] = useState<Draft>({
        title: "",
        photoUrl: "",
        description: "",
        metaTitle: "",
        metaKeywords: "",
        metaDescription: "",
        seoHead: "",
        seoBody: "",
        focusKeyword: "",
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState("");

    useEffect(() => {
        if (!photoFile) {
            setPhotoPreview("");
            return;
        }
        const url = URL.createObjectURL(photoFile);
        setPhotoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [photoFile]);

    useEffect(() => {
        if (photoPreview) setDraft((p) => ({ ...p, photoUrl: photoPreview }));
    }, [photoPreview]);

    const canSave = useMemo(() => {
        return (
            draft.title.trim() &&
            draft.description.trim() &&
            draft.metaTitle.trim() &&
            draft.metaDescription.trim()
        );
    }, [draft]);

    const onSave = () => {
        if (!draft.title.trim()) return alert("Please enter Title");
        if (!draft.description.trim()) return alert("Please enter Description");
        if (!draft.metaTitle.trim()) return alert("Please enter Meta Title");
        if (!draft.metaDescription.trim()) return alert("Please enter Meta Description");

        addBlog({
            title: draft.title,
            photoUrl: draft.photoUrl,
            description: draft.description,
            metaTitle: draft.metaTitle,
            metaKeywords: draft.metaKeywords,
            metaDescription: draft.metaDescription,
            seoHead: draft.seoHead,
            seoBody: draft.seoBody,
            focusKeyword: draft.focusKeyword,
        });

        router.push("/superadmin/blog");
    };

    const shownPhoto = photoPreview || draft.photoUrl;

    return (
        <main className="min-h-screen bg-[#f6f7fb] text-black">
            <div className="mx-auto w-full max-w-5xl px-4 py-8">
                {/* Card */}
                <section className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-5 flex justify-between items-center border-b border-black/10">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Add Blog</h1>
                            <p className="mt-1 text-sm text-black/60">
                                Create blog with title, photo, description and SEO.
                            </p>
                        </div>
                        <Link
                            href="/superadmin/blog"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5"
                        >
                            <FiArrowLeft />
                            Back
                        </Link>

                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSave();
                        }}
                        className="p-5"
                    >
                        <div className="grid gap-6 lg:grid-cols-12">
                            {/* Photo */}
                            <div className="lg:col-span-5">
                                <p className={labelCls}>Photo</p>

                                <label className="mt-2 block cursor-pointer rounded-2xl border border-dashed border-black/20 bg-black/[0.02] p-4 hover:bg-black/[0.04]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                                    />

                                    {!shownPhoto ? (
                                        <div className="flex items-center gap-3">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <FiImage className="text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Upload blog photo</p>
                                                <p className={helperCls}>Click to choose (optional)</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={shownPhoto} alt="Blog" className="h-44 w-full object-cover" />
                                        </div>
                                    )}
                                </label>

                                {shownPhoto ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhotoFile(null);
                                            setPhotoPreview("");
                                            setDraft((p) => ({ ...p, photoUrl: "" }));
                                        }}
                                        className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
                                    >
                                        Remove photo
                                    </button>
                                ) : null}
                            </div>

                            {/* Main */}
                            <div className="lg:col-span-7 grid gap-4">
                                <div>
                                    <label className={labelCls}>
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={draft.title}
                                        onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                                        className={`${inputCls} mt-2`}
                                        placeholder="Enter blog title"
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={draft.description}
                                        onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                                        className={`${inputCls} mt-2 resize-none`}
                                        placeholder="Write blog description..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEO */}
                        <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">SEO</p>
                                <p className="text-xs text-black/50">Meta + Head/Body + Keywords</p>
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                <div>
                                    <label className={labelCls}>
                                        Meta Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={draft.metaTitle}
                                        onChange={(e) => setDraft((p) => ({ ...p, metaTitle: e.target.value }))}
                                        className={`${inputCls} mt-2`}
                                        placeholder="Meta title"
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>Meta Keywords</label>
                                    <input
                                        value={draft.metaKeywords}
                                        onChange={(e) => setDraft((p) => ({ ...p, metaKeywords: e.target.value }))}
                                        className={`${inputCls} mt-2`}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className={labelCls}>
                                        Meta Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={draft.metaDescription}
                                        onChange={(e) => setDraft((p) => ({ ...p, metaDescription: e.target.value }))}
                                        className={`${inputCls} mt-2 resize-none`}
                                        placeholder="Meta description..."
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>Focus Keyword</label>
                                    <input
                                        value={draft.focusKeyword}
                                        onChange={(e) => setDraft((p) => ({ ...p, focusKeyword: e.target.value }))}
                                        className={`${inputCls} mt-2`}
                                        placeholder="Focus keyword"
                                    />
                                </div>

                                <div />

                                <div className="lg:col-span-2">
                                    <label className={labelCls}>SEO Head</label>
                                    <textarea
                                        rows={4}
                                        value={draft.seoHead}
                                        onChange={(e) => setDraft((p) => ({ ...p, seoHead: e.target.value }))}
                                        className={`${inputCls} mt-2 resize-none font-mono text-sm`}
                                        placeholder="Optional: custom head tags..."
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className={labelCls}>SEO Body</label>
                                    <textarea
                                        rows={4}
                                        value={draft.seoBody}
                                        onChange={(e) => setDraft((p) => ({ ...p, seoBody: e.target.value }))}
                                        className={`${inputCls} mt-2 resize-none font-mono text-sm`}
                                        placeholder="Optional: schema, script, body content..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FOOTER BUTTONS (LAST) */}
                        <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

                            <button
                                type="submit"
                                disabled={!canSave}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FiSave />
                                Save Blog
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}
