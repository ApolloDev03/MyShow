"use client";

import { useEffect, useRef, useState } from "react";
import photo1 from "@/app/assets/event-1.avif";
import photo2 from "@/app/assets/events-2.avif";
import photo3 from "@/app/assets/events-3.avif";
import photo4 from "@/app/assets/first-article.webp";
import photo5 from "@/app/assets/second-article.webp";
import photo6 from "@/app/assets/third-article.webp";
import Image from "next/image";


const tags = [
  "Events in Ahmedabad, IN",
  "Network Security",
  "Amazon Web Services",
  "Cloud Computing",
  "Professional Networking",
];

const attendees = [
  { name: "Kelvi Manavadaria", role: "Member" },
  { name: "dimple vaghela", role: "Co-organizer" },
  { name: "Nilesh Vaghela", role: "Organizer" },
];

const relatedEvents = [
  {
    title: "HashiCorp Meetup – January Edition",
    date: "Sun, Jan 25 · 10:00 AM IST",
    group: "Ahmedabad HashiCorp User Group",
  },
  {
    title: "Meet Magento India 2026",
    date: "Sun, Jan 25 · 7:00 AM IST",
    group: "Meet Magento India",
  },
  {
    title: "Primewise Founders Club VC Connect",
    date: "Sat, Jan 17 · 12:00 PM IST",
    group: "Primewise Founders Club",
  },
];

export default function EventPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showBottomBar, setShowBottomBar] = useState(false);

  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const photos = [
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    photo6,
  ];



  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBottomBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* MAIN GRID */}
      <section
        ref={sectionRef}
        className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-3">
            <h1 className="text-2xl lg:text-3xl font-bold">
              AWS re:Invent 2025 Recap – Community Expert Edition
            </h1>
            <p className="text-sm text-gray-600">
              Hosted by <span className="font-medium">Nilesh V.</span> and 2 others
            </p>

            <Image src={photo5} width={0} height={0} className="w-full" alt="main" />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Details</h2>

            <div className="space-y-4 text-sm text-gray-700">
              <p>
                Join us for an exclusive AWS re:Invent 2025 Recap session where
                our community experts will share the most exciting announcements,
                innovations, and insights from the world’s premier cloud
                computing conference.
              </p>

              <ul className="space-y-1">
                <li><strong>Date:</strong> Saturday, January 24th, 2026</li>
                <li><strong>Time:</strong> 9:30 AM – 1:00 PM IST</li>
                <li><strong>Format:</strong> In-person community meetup</li>
                <li><strong>Audience:</strong> AWS enthusiasts, developers, architects</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full border bg-gray-50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Tech Holding</h3>
            <p className="text-sm text-gray-600">
              11th Floor, The Ridge, Iscon, Opp. Wide Angle · Ahmedabad
            </p>

            <div className="h-56 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-500">
              Google Map Embed
            </div>
          </div>

          {/* PHOTOS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Photos</h3>

              <button
                onClick={() => setShowAllPhotos(prev => !prev)}
                className="text-sm text-blue-600"
              >
                {showAllPhotos ? "Show less" : "See all"}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(showAllPhotos ? photos : photos.slice(0, 4)).map((src, index) => (
                <img
                  key={index}
                  src={src.src}
                  alt={`Event photo ${index + 1}`}
                  className="aspect-square rounded-lg"
                />
              ))}
            </div>
          </div>



          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Members are also interested in</h3>
              <span className="text-sm text-blue-600 cursor-pointer">See all</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {relatedEvents.map(event => (
                <div
                  key={event.title}
                  className="border rounded-xl p-3 space-y-2"
                >
                  <div className="h-28 bg-gray-200 rounded-lg" />
                  <p className="text-xs text-gray-500">{event.date}</p>
                  <p className="text-sm font-semibold">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.group}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="border rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">Reservation opens</p>
              <p className="text-sm text-gray-600">Sat, Jan 3 · 8:00 PM</p>
              <hr/>
              <p className="text-sm font-medium">
                Saturday, Jan 24 · 9:30 AM – 1:00 PM IST
              </p>
              <p className="text-sm text-gray-600">Tech Holding</p>
            </div>
          </div>
        </aside>
      </section>

      {/* SECTION-BASED BOTTOM BAR */}
      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                AWS re:Invent 2025 Recap – Community Expert Edition
              </p>
              <p className="text-xs text-gray-500">
                Sat, Jan 24 · 9:30 AM IST
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 border rounded-full">FREE</span>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
                Attend
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
