// app/superadmin/master/blog/_lib/blogStore.ts
export type BlogItem = {
  id: string;

  title: string;
  photoUrl?: string; // preview only
  description: string;

  // SEO
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  seoHead: string;
  seoBody: string;
  focusKeyword: string;

  createdAt: string; // ISO
};

const STORAGE_KEY = "myshow_superadmin_blog_master_v1";

export const seedBlogs: BlogItem[] = [
  {
    id: "BL-1001",
    title: "Top 10 Event Ideas for 2026",
    photoUrl: "",
    description: "A quick list of trending event ideas that work great for any city.",
    metaTitle: "Top 10 Event Ideas for 2026",
    metaKeywords: "events, event ideas, 2026, myshow",
    metaDescription: "Explore top 10 event ideas for 2026 to make your show successful.",
    seoHead: "<!-- optional custom head tags -->",
    seoBody: "<!-- optional schema / scripts -->",
    focusKeyword: "event ideas 2026",
    createdAt: new Date().toISOString(),
  },
  {
    id: "BL-1002",
    title: "How to Promote Your Show",
    photoUrl: "",
    description: "Simple marketing steps to sell more tickets and reach more audience.",
    metaTitle: "How to Promote Your Show",
    metaKeywords: "promotion, marketing, tickets, show",
    metaDescription: "Learn how to promote your show with easy strategies.",
    seoHead: "",
    seoBody: "",
    focusKeyword: "promote show",
    createdAt: new Date().toISOString(),
  },
];

export function loadBlogs(): BlogItem[] {
  if (typeof window === "undefined") return seedBlogs;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBlogs));
      return seedBlogs;
    }
    const parsed = JSON.parse(raw) as BlogItem[];
    return Array.isArray(parsed) ? parsed : seedBlogs;
  } catch {
    return seedBlogs;
  }
}

export function saveBlogs(items: BlogItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addBlog(payload: Omit<BlogItem, "id" | "createdAt">) {
  const all = loadBlogs();
  const newItem: BlogItem = {
    ...payload,
    id: `BL-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [newItem, ...all];
  saveBlogs(next);
  return newItem;
}

export function updateBlog(id: string, payload: Omit<BlogItem, "id" | "createdAt">) {
  const all = loadBlogs();
  const next = all.map((x) => (x.id === id ? { ...x, ...payload } : x));
  saveBlogs(next);
  return next.find((x) => x.id === id) || null;
}

export function deleteBlog(id: string) {
  const all = loadBlogs();
  const next = all.filter((x) => x.id !== id);
  saveBlogs(next);
}
