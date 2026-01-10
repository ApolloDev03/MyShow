"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaStar } from "react-icons/fa";
import image1 from '@/app/assets/event-1.webp'
import Link from "next/link";

export default function EventDetail() {
  const [showAllImages, setShowAllImages] = useState(false);

  const images = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", // AWS cloud conference
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80", // people collaborating
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // tech event
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80", // developer
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", // cloud
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", // coding workspace
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", // cloud visual
];


  const displayedImages = showAllImages ? images : images.slice(0, 4);
  return (
    <div className="bg-white text-gray-900">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        {/* Title */}
        <div>
          <h1 className="mb-2 text-4xl font-bold">
            AWS re:Invent 2025 Recap - Community Expert Edition
          </h1>
          <p className="text-gray-600">
            Hosted by <span className="font-medium">Nilesh V.</span> and 2 others
          </p>
        </div>



        {/* Main grid */}
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <section>
              <h2 className="mb-2 text-xl font-semibold">Event Overview</h2>
              <p className="text-gray-700">
                Join us for an exclusive AWS re:Invent 2025 Recap session where our community experts
                will share the most exciting announcements, innovations, and insights from the world’s
                premier cloud computing conference!
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold">Event Details</h2>
              <ul className="space-y-1 text-gray-700">
                <li>
                  📅 <strong>Date:</strong> Saturday, January 24th, 2026
                </li>
                <li>
                  🏢 <strong>Format:</strong> In-person community meetup
                </li>
                <li>
                  👥 <strong>Audience:</strong> AWS enthusiasts, developers, architects, and cloud professionals
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold">What You'll Learn</h2>
              <p className="text-gray-700">Our community experts who attended re:Invent 2025 will cover:</p>
              <ul className="mt-2 list-disc pl-6 text-gray-700">
                <li>Latest AWS service launches and updates</li>
                <li>Game-changing features and capabilities</li>
              </ul>
            </section>


            <section>
              <h2 className="mb-2 text-xl font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Events in Ahmedabad, IN",
                  "Network Security",
                  "Amazon Web Services",
                  "Cloud Computing",
                  "Professional Networking",
                ].map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Images Section */}
            <section>
              <div className="mb-3 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Images</h2>
                <button
                  onClick={() => setShowAllImages(!showAllImages)}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {showAllImages ? "Show less" : "Show more"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {displayedImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Event image ${idx + 1}`}
                    className="h-40 w-full rounded-lg object-cover hover:scale-[1.02] transition"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right */}
          <aside className="space-y-6">
            <div className="rounded-3xl">
              <Image
                src={image1}
                height={350}
                width={350}
                alt="image1"
                className="rounded-2xl"
              />
            </div>
            <div className="rounded-xl border p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <FaCalendarAlt />
                <span>Reservation opens Sat, Jan 3 - 8:00 PM</span>
              </div>

              <div className="flex items-start gap-2 text-sm font-medium text-gray-900">
                <FaClock className="mt-0.5" />
                <span>Saturday, Jan 24 - 9:30 AM to 1:00 PM IST</span>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-0.5" />
                  <div>
                    <div className="font-medium">Tech Holding</div>
                    <div className="text-gray-600">
                      11th Floor, The Ridge, Iscon, Opp. Wide Angle - Ahmedabad
                    </div>
                    <button className="mt-1 text-sm font-medium text-blue-600 hover:underline">
                      How to find us
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </aside>
        </div>

        {/* Members are also interested in */}
        <section className="border-t pt-8">
          <h2 className="mb-4 text-xl font-semibold">Members are also interested in</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "HashiCorp Meetup - January Edition", date: "Sun, Jan 25 - 10:00 AM IST" },
              { title: "Meet Magento India 2026", date: "Sun, Jan 25 - 7:00 AM IST" },
              { title: "Primewise Founders Club VC Connect and Networking Event - Ahmedabad", date: "Sat, Jan 17 - 12:00 PM IST" },
            ].map((e, i) => (
              <div key={i} className="rounded-xl border p-4 transition hover:shadow-md">
                <div className="mb-3 h-32 rounded-lg bg-gray-100" />
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-gray-600">{e.date}</p>
              </div>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
}
