import Image, {StaticImageData} from "next/image";
import Link from "next/link";
import blog1 from '@/app/assets/second-article.webp'
type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage: string | StaticImageData;
};

const mockArticle: Article = {
  slug: "turn-casual-connections-into-close-friendships",
  title: "How to Turn Casual Connections into Close Friendships",
  excerpt:
    "Close friendships can feel harder to build as an adult. Here are practical steps to make it simple, natural, and real.",
  publishedAt: "Jan 7, 2026",
  coverImage: blog1,
};

export default async function SpotlightDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // In real app: fetch by params.slug
  const article = mockArticle;

  return (
    <main className="bg-background text-foreground">
      {/* Top: Breadcrumb + Hero */}
      <section className="mx-auto max-w-7xl px-8 pt-8 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <Link href="/" className= "text-foreground/60 hover:text-primary">
            Home
          </Link>
          <span className="text-foreground/30">/</span>
          <Link href="/spotlight" className="text-foreground/60 hover:text-primary">
            Spotlight
          </Link>
          <span className="text-foreground/30">/</span>
          <span className="text-foreground/80 line-clamp-1">{article.title}</span>
        </div>

        {/* Title block */}
        <div className="mt-6 max-w-5xl ">

          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
            {article.title}
          </h1>

          <p className="mt-3 text-base md:text-lg text-foreground/70 leading-7">
            {article.excerpt}
          </p>

        </div>
      </section>

      {/* Cover image */}
      <section className="mx-auto max-w-7xl px-8 pb-10">
        <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="relative aspect-16/7">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
          </div>

        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="mx-auto max-w-7xl px-8 pb-16">
        <div className="">
          {/* Article */}
          <article className="p-6 md:p-10">
            {/* If you have @tailwindcss/typography, replace content wrapper with: className="prose prose-lg max-w-none" */}
            <div className="max-w-none">
              <h2 id="why-it-feels-hard" className="text-2xl font-extrabold">
                Why it feels harder now
              </h2>
              <p className="mt-3 text-foreground/75 leading-7">
                As schedules get busier, it’s easy to keep friendships at the “nice to see you”
                level. The good news: you don’t need a perfect strategy—just a repeatable one.
              </p>

              <blockquote className="mt-6 rounded-2xl border-l-4 border-primary bg-background px-5 py-4 text-foreground/80">
                Consistency beats intensity. Small, repeated moments build trust.
              </blockquote>

              <h2 id="simple-steps" className="mt-10 text-2xl font-extrabold">
                Simple steps that work
              </h2>
              <ul className="mt-4 space-y-3 text-foreground/75">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>
                    <span className="font-semibold text-foreground">Show up twice:</span>{" "}
                    go to the same meetup/event again—familiarity creates comfort.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>
                    <span className="font-semibold text-foreground">Ask one better question:</span>{" "}
                    “What are you excited about lately?” beats “What do you do?”
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>
                    <span className="font-semibold text-foreground">Make a tiny plan:</span>{" "}
                    “Coffee next week?” is easier than “Let’s hang sometime.”
                  </span>
                </li>
              </ul>

              <h2 id="turn-into-habit" className="mt-10 text-2xl font-extrabold">
                Turn it into a habit
              </h2>
              <p className="mt-3 text-foreground/75 leading-7">
                Keep it light: pick one recurring event each month. You’ll naturally see the same
                faces, and the friendships will feel effortless.
              </p>

              {/* CTA inside article */}
              <div className="mt-10 rounded-3xl border bg-background p-6">
                <h3 className="text-lg font-extrabold">Ready to meet people near you?</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Explore events on MyShow and join a group that matches your vibe.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/events"
                    className="inline-flex items-center rounded-full bg-linear-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90"
                  >
                    Explore events
                  </Link>
                  <Link
                    href="/create"
                    className="inline-flex items-center rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition"
                  >
                    Create a group
                  </Link>
                </div>
              </div>
            </div>
          </article> 
        </div>
      </section>
    </main>
  );
}

function RelatedItem({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="block rounded-2xl border px-4 py-3 hover:border-primary hover:bg-background transition">
      <p className="text-sm font-semibold line-clamp-2">{title}</p>
    </Link>
  );
}



/* Icons */
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 4Zm-6 8a3 3 0 1 0 2.83 4H12a3 3 0 0 0-3-4Zm0-2a3 3 0 0 0 2.12-.88l3.76 2.2a3 3 0 1 0 .9-1.79l-3.78-2.2a3.03 3.03 0 0 0 0-2.66l3.78-2.2A3 3 0 1 0 16.9 5.5l-3.76 2.2A3 3 0 1 0 9 14Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
