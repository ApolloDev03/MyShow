import Image, {StaticImageData} from "next/image";
import Link from "next/link";
import blog1 from '@/app/assets/first-article.webp'
import blog2 from '@/app/assets/second-article.webp'
import blog3 from '@/app/assets/third-article.webp'

type SpotlightItem = {
    id: string;
    title: string;
    description: string;
    image: string | StaticImageData;
};

const items: SpotlightItem[] = [
    {
        id: "1",
        title: "I Used MyShow to Make Friends at Brunch",
        description:
            "New Jersey-based writer and college student Brianna Stryker wanted to meet friends in her hometown. Learn how she used MyShow to make connections by joining a Girls Night Out group.",
        image: blog1,
        
    },
    {
        id: "2",
        title: "How to Turn Casual Connections into Close Friendships",
        description:
            "It’s proven that close friendships are harder to make as an adult. But don’t sweat it: here’s what you can do to simplify the process.",
        image: blog2,
        
    },
    {
        id: "3",
        title: "Do You Have the “Right” Number of Friends?",
        description:
            "Studies from around the world have tried to help people answer this question. Learn about the three tiers of friendship and how to fulfill them.",
        image: blog3,
        
    },
];

export default function SpotlightSection() {
    return (
        <section className="w-full bg-white">
            <div className="mx-auto max-w-7xl px-8 py-12 md:py-16">
                {/* Heading */}
                <div className="max-w-3xl">
                    <div className="flex items-start gap-2">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                            MyShow{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                                Insights
                            </span>
                        </h2>
                        <Scribble className="mt-2 text-primary" />
                    </div>

                    <p className="mt-3 text-[15px] leading-6 text-foreground/70">
                        Fresh reads on events, communities, and social life—practical tips, thoughtful ideas, and
                        highlights from what people are doing on MyShow.
                    </p>
                </div>


                {/* Cards */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {items.map((item) => (
                        <article key={item.id} className="group">
                            {/* Image */}
                            <div className="relative aspect-video overflow-hidden rounded-3xl bg-black/5">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            {/* Text */}
                            <Link href="/spotlight-detail">
                            <h3 className="mt-6 text-lg font-extrabold leading-snug text-foreground hover:text-primary">
                                {item.title}
                            </h3>
                            </Link>

                            <p className="mt-3 text-sm leading-6 text-foreground/70 line-clamp-4">
                                {item.description}
                            </p>

                            <Link
                                href="/spotlight-detail"
                                className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline underline-offset-4"
                            >
                                Read more
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Scribble({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 64 32"
            className={className}
            width="34"
            height="18"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M6 18c8-10 16-10 24 0s16 10 28 0"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M42 6c4 2 7 5 10 9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.8"
            />
        </svg>
    );
}
