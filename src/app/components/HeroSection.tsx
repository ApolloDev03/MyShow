import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { GiMicrophone, GiMusicalNotes } from "react-icons/gi";
type StickerTag = {
  text: string;
  variant: "lav" | "pink" | "coral" | "yellow";
  icon?: string; // emoji
};

type StickerProps = {
  imgSrc: string;
  imgAlt: string;
  blobVariant: "purple" | "pink" | "coral" | "yellow";
  tag: StickerTag;
  position: string; // tailwind position classes
  rotate?: string; // tailwind rotate class
  delay?: string; // tailwind delay class
  doodle?: { text: string; position: string };
};

const blobClasses: Record<StickerProps["blobVariant"], string> = {
  purple: "bg-[radial-gradient(circle_at_30%_30%,#b9a9ff,#e9e4ff_70%)]",
  pink: "bg-[radial-gradient(circle_at_30%_30%,#ff7aa8,#ffe3ee_70%)]",
  coral: "bg-[radial-gradient(circle_at_30%_30%,#ff7c7c,#ffe4e4_70%)]",
  yellow: "bg-[radial-gradient(circle_at_30%_30%,#ffd66b,#fff1c9_70%)]",
};

const tagClasses: Record<StickerTag["variant"], string> = {
  lav: "bg-[#e9e4ff] text-[#2c2266]",
  pink: "bg-[#ffe3ee] text-[#6a1538]",
  coral: "bg-[#ffe4e4] text-[#6a1b1b]",
  yellow: "bg-[#fff1c9] text-[#5a3f00]",
};

function Sticker({
  imgSrc,
  imgAlt,
  blobVariant,
  tag,
  position,
  rotate = "",
  delay = "",
  doodle,
}: StickerProps) {
  return (
    <div
      className={[
        "hidden md:block absolute z-1",
        "w-55 lg:w-65 aspect-[1.35/1]",
        "animate-floaty",
        delay,
        position,
        rotate,
      ].join(" ")}
    >
      {/* blob */}
      <div
        className={[
          "absolute -inset-6 opacity-95",
          "rounded-[38%_62%_58%_42%/50%_35%_65%_50%]",
          "-rotate-6",
          blobClasses[blobVariant],
        ].join(" ")}
      />

      {/* image */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 220px, 260px"
        />
      </div>

      {/* tag */}
      {/* <div
        className={[
          "absolute left-3 -bottom-4",
          "inline-flex items-center gap-2",
          "px-3 py-2 rounded-full",
          "text-xs font-extrabold shadow-[0_10px_20px_rgba(0,0,0,0.12)]",
          "whitespace-nowrap",
          tagClasses[tag.variant],
        ].join(" ")}
      >
        {tag.icon ? <span className="text-sm">{tag.icon}</span> : null}
        <span>{tag.text}</span>
      </div> */}

      {/* doodle */}
      {doodle ? (
        <div
          className={[
            "absolute select-none font-black opacity-70",
            doodle.position,
          ].join(" ")}
        >
          {doodle.text}
        </div>
      ) : null}
    </div>
  );
}

export default function HeroBanner() {
  return (
    <section className="relative mx-auto overflow-hidden bg-white px-4 py-14 sm:py-20">
      <div className="relative mx-auto max-w-7xl min-h-130 px-5 grid place-items-center">
        {/* Left stickers */}
        <Sticker
          imgSrc="https://images.unsplash.com/photo-1535146851324-6571dc3f2672?auto=format&fit=crop&w=1200&q=70"
          imgAlt="People chatting"
          blobVariant="purple"
          tag={{ text: "Near you", variant: "lav", icon: "📍" }}

          position="left-0 top-6 lg:left-2"
          rotate="-rotate-6"
        />

        <Sticker
          imgSrc="https://images.unsplash.com/photo-1761901219315-bfe7d72340b9?auto=format&fit=crop&w=1200&q=70"
          imgAlt="Dance class"
          blobVariant="pink"
          tag={{ text: "Dance class", variant: "pink" }}
          position="left-0 bottom-4 lg:left-2"
          rotate="rotate-6"
          delay="animation-delay-[0.8s]"
          doodle={{ text: "♪", position: "right-2 -bottom-10 -rotate-12 text-lg" }}
        />

        {/* Center content */}
        <div className="relative z-2 text-center max-w-2xl px-2">
          <h1 className="text-[#121212] font-extrabold tracking-[-0.02em] leading-[1.05] text-4xl sm:text-5xl lg:text-[45px]">
            The <span className="align-[-2px] inline-block"><GiMicrophone className="text-primary"/></span> singer platform.
            <br />
            Where <span className="align-[-2px] inline-block"><GiMusicalNotes className="text-red-600 text-4xl"/></span> songs
            <br />
            become <span className="align-[-2px] inline-block"><FaStar className="text-pink-300"/></span> stages.
          </h1>

          <p className="mt-4 mx-auto max-w-140 text-[15px] leading-7 text-[#5c5c5c]">
            Whether you sing pop, classical, indie, or gospel—connect with vocalists near you,
            join jam sessions, find collabs, and level up your voice with workshops and open mics.
            New sessions drop every week—jump in and sing with the community.
          </p>

          <Link
            href="/admin/register"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1f1f1f] px-6 py-3 font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(0,0,0,0.18)]"
          >
            Join the Stage
          </Link>
        </div>


        {/* Right stickers */}
        <Sticker
          imgSrc="https://images.unsplash.com/photo-1731007733979-6f3d7b8632ae?auto=format&fit=crop&w=1200&q=70"
          imgAlt="Speaking club"
          blobVariant="coral"
          tag={{ text: "Speaking club", variant: "coral" }}
          position="right-0 top-6 lg:right-2"
          rotate="rotate-6"
          delay="animation-delay-[0.4s]"
          doodle={{ text: "✦", position: "left-2 -top-8 rotate-12 text-lg" }}
        />

        <Sticker
          imgSrc="https://images.unsplash.com/photo-1696946909078-184cd94d3d45?auto=format&fit=crop&w=1200&q=70"
          imgAlt="Dinner group"
          blobVariant="yellow"
          tag={{ text: "Every Thursday", variant: "yellow", icon: "📅" }}
          position="right-0 bottom-4 lg:right-2"
          rotate="-rotate-3"
          delay="animation-delay-[1.1s]"
        />

        {/* little line doodles */}
        <div className="hidden md:block absolute left-40 top-48 z-0 h-30 w-30 rotate-160deg rounded-tr-[120px] border-2 border-black/10 border-l-0 border-b-0" />
        <div className="hidden md:block absolute right-40 top-52 z-0 h-30 w-30 -rotate-20deg rounded-tr-[120px] border-2 border-black/10 border-l-0 border-b-0" />
      </div>
    </section>
  );
}
