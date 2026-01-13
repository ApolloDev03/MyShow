// src/app/components/EventsNear.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import event1 from "@/app/assets/event-1.webp";
import event2 from "@/app/assets/events-2.webp";
import event3 from "@/app/assets/events-3.webp";
import event4 from "@/app/assets/events-4.webp";
import Link from "next/link";

type EventCard = {
  id: number;
  title: string;
  date: string;
  isFree: boolean;
  image: string | StaticImageData;
};

const events: EventCard[] = [
  {
    id: 1,
    title: "AWS re:Invent 2025 Recap - Community Expert Edition",
    date: "Sat, Jan 24",
    isFree: true,
    image: event1,
  },
  {
    id: 2,
    title: "HashiCorp Meetup - January Edition",
    date: "Sun, Jan 25",
    isFree: true,
    image: event2,
  },
  {
    id: 3,
    title: "Join Biggest Community | Investors Founders | Ahmedabad",
    date: "Wed, Jan 21",
    isFree: true,
    image: event3
  },
  {
    id: 4,
    title: "Docker Ahmedabad Meetup January Edition",
    date: "Sat, Jan 31",
    isFree: true,
    image: event4
  },
  {
    id: 5,
    title: "AWS re:Invent 2025 Recap - Community Expert Edition",
    date: "Sat, Jan 24",
    isFree: true,
    image: event1,
  },
  {
    id: 6,
    title: "HashiCorp Meetup - January Edition",
    date: "Sun, Jan 25",
    isFree: true,
    image: event2,
  },
  {
    id: 7,
    title: "Join Biggest Community | Investors Founders | Ahmedabad",
    date: "Wed, Jan 21",
    isFree: true,
    image: event3
  },
  {
    id: 8,
    title: "Docker Ahmedabad Meetup January Edition",
    date: "Sat, Jan 31",
    isFree: true,
    image: event4
  },
];

export default function EventsNear() {
  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-[28px] font-extrabold text-[#111827]">
              Events near{" "}
              <span className="text-[28px] text-primary underline-offset-4">
                Ahmedabad, IN
              </span>
            </h2>
          </div>
          <Link href="/" className="text-sm font-medium text-primary hover:text-shadow-primary">
            See all events
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/90 shadow-sm ring-1 ring-black/5  duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              {/* Image + badges */}
              <div className="relative h-45 w-full overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-contain border rounded-4xl p-3 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Free pill */}
                {event.isFree && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#111827] shadow-sm">
                    Free
                  </span>
                )}


                {/* Gradient overlay bottom for readability */}
                {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent" /> */}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {event.date} 
                </p>

                <Link href="/events-detail" className="line-clamp-2 text-[15px] font-semibold leading-snug text-black hover:text-primary">
                  {event.title}
                </Link>

                
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
