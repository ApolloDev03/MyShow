"use client";

import Image from "next/image";

import banner from '@/app/assets/hero.avif'

export default function Hero() {
  return (
    <section className="relative h-[85vh] overflow-hidden m-8 rounded-3xl">
      <Image
        src={banner} 
        alt="MyShow banner"
        fill
        priority
        className="object-cover object-center brightness-90"
      />
      {/* Overlay gradient */}
      {/* <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" /> */}
    </section>
  );
}
