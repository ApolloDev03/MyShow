import Image, {StaticImageData} from "next/image";
import Link from "next/link";
import { PiMicrophoneStageFill } from "react-icons/pi";
import upcoming1 from '@/app/assets/upcoming1.webp'
import upcoming2 from '@/app/assets/upcoming2.webp'

type Event = {
  id: string;
  title: string;
  datetimeLabel: string; // e.g. "Wed, Jan 7 · 8:30 PM IST"
  isOnline?: boolean;
  priceLabel?: string; // e.g. "Free"
  coverSrc: string | StaticImageData; // "/events/1.jpg"
};

const events: Event[] = [
  {
    id: "1",
    title: "MyShow Night: Startup Failure Stories (Open Mic)",
    datetimeLabel: "Wed, Jan 7 ",
    isOnline: true,
    priceLabel: "Free",
    coverSrc: upcoming1,
  },
  {
    id: "2",
    title: "TechConnect: Global Virtual Job & Networking Event for Data, AI...",
    datetimeLabel: "Wed, Jan 7",
    isOnline: true,
    priceLabel: "Free",
    coverSrc: upcoming2,
  },
  {
    id: "3",
    title: "Rust Club – Build Bitcoin Projects with Rust",
    datetimeLabel: "Wed, Jan 7",
    isOnline: true,
    priceLabel: "Free",
    coverSrc: upcoming1,
  },
  {
    id: "4",
    title: "Weekly Virtual Book Club | Chapter 6 & 7 'Breaking the...'",
    datetimeLabel: "Wed, Jan 7",
    isOnline: true,
    priceLabel: "Free",
    coverSrc: upcoming2,
  },
];

export default function UpcomingOnlineEvents() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Upcoming events
            </h2>

            {/* small “sparkle” accent */}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg  text-secondary">
              <PiMicrophoneStageFill className="h-7 w-7 text-primary" />
            </span>
          </div>

          <Link
            href="/events"
            className="text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            See all events
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-8">
          {/* Desktop: 4 columns | Mobile: horizontal scroll */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>

          <div className="md:hidden -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-4 w-max pb-2">
              {events.map((e) => (
                <div key={e.id} className="w-70">
                  <EventCard event={e} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block rounded-2xl"
      aria-label={event.title}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/5">
        <Image
          src={event.coverSrc}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 280px, (max-width: 1200px) 50vw, 25vw"
        />

        {event.priceLabel ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
            {event.priceLabel}
          </span>
        ) : null}

        {/* subtle gradient for “premium” look */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Meta */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-foreground/70">
          <span>{event.datetimeLabel}</span>
        </div>

        <h3 className="text-[15px] font-extrabold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
      </div>
    </Link>
  );
}

function AvatarStack({ avatars }: { avatars: string[] }) {
  return (
    <div className="flex -space-x-2">
      {avatars.slice(0, 3).map((src, idx) => (
        <span
          key={`${src}-${idx}`}
          className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-white bg-black/10"
        >
          <Image src={src} alt="" fill className="object-cover" />
        </span>
      ))}
    </div>
  );
}

