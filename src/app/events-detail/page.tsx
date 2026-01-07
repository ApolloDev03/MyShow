"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function EventDetailPage() {
  const [attending, setAttending] = useState(false);

  return (
    <main className="relative min-h-screen bg-white text-foreground">
      {/* Cover Section */}
      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8">
            {/* Left Column */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
                FuckUp Night: Startup Failure Stories (Open Mic)
              </h1>

              <p className="mt-2 text-foreground/70 font-medium">
                Hosted by <Link href="#" className="text-primary hover:underline">Solopreneurs L.</Link>
              </p>

              <div className="mt-6 relative aspect-video w-full overflow-hidden rounded-2xl border bg-gray-100">
                <Image
                  src="/demo/event-1.jpg"
                  alt="Event banner"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-foreground/80">
                <p>
                  Open mic for honest founder failures. No speakers list, no prep — take the live,
                  share your story & chat with like-minded people who understand the pains of
                  building a startup.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>what went wrong & how we recovered</li>
                  <li>speak if you want, listen if you prefer</li>
                  <li>stay anonymous if you want</li>
                </ul>

                <p>
                  Think of it as an informal startup therapy session focused on learning,
                  reflection, and support.
                </p>
              </div>

              

              {/* Photos */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">Photos</h2>
                  <Link href="#" className="text-primary text-sm hover:underline">
                    See all
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["/demo/event-2.jpg", "/demo/event-3.jpg"].map((photo, idx) => (
                    <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image src={photo} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Events */}
              <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-extrabold mb-5">Members are also interested in</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => (
                    <Link
                      key={i}
                      href="#"
                      className="group block rounded-2xl border bg-white p-3 hover:shadow-md transition"
                    >
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                        <Image
                          src={`/demo/event-${i}.jpg`}
                          alt="event"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                          Example Event {i}
                        </p>
                        <p className="text-xs text-foreground/60">Online</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Sticky Card) */}
            <div className="space-y-5">
              <div className="rounded-2xl border bg-white p-4 shadow-sm sticky top-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                  <Image
                    src="/demo/event-1.jpg"
                    alt="Event"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm text-foreground/70 font-medium">Online event</p>
                  <h3 className="text-base font-extrabold text-foreground">
                    FuckUp Night: Startup Failure Stories (Open Mic)
                  </h3>

                  <p className="mt-2 text-sm text-foreground/60">
                    Wed, Jan 7 · 8:30 PM IST
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold">
                      Free
                    </span>
                    <button
                      onClick={() => setAttending(!attending)}
                      className={`flex-1 rounded-full ${
                        attending
                          ? "bg-gray-200 text-foreground"
                          : "bg-primary text-white"
                      } font-semibold text-sm py-2.5 transition hover:opacity-90`}
                    >
                      {attending ? "Attending" : "Attend online"}
                    </button>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-md px-4 py-3 md:hidden flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-xs text-foreground/60">Wed, Jan 7 · 8:30 PM IST</p>
          <p className="text-sm font-semibold text-foreground truncate w-[180px]">
            FuckUp Night: Startup Failure Stories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold">
            Free
          </span>
          <button
            onClick={() => setAttending(!attending)}
            className={`rounded-full ${
              attending
                ? "bg-gray-200 text-foreground"
                : "bg-primary text-white"
            } font-semibold text-sm px-4 py-2 transition`}
          >
            {attending ? "Attending" : "Attend online"}
          </button>
        </div>
      </div>
    </main>
  );
}
