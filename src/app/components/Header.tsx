import Link from "next/link";
import Button from "./Button";

export default function Header() {
  return (
    <header className="w-full bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="h-16 flex items-center justify-around gap-4">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold">
              m
            </span>
            <span className="text-2xl font-semibold text-primary">myshow</span>
          </Link>

          {/* Center: Search */}
          <div className=" flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="flex items-center rounded-full border bg-white shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
                {/* Search input */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <SearchIcon className="h-4 w-4 text-foreground/60" />
                  <label className="sr-only" htmlFor="search-events">
                    Search events
                  </label>
                  <input
                    id="search-events"
                    type="text"
                    placeholder="Search events..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/50 text-foreground"
                  />
                </div>

                {/* Search button */}
                <button
                  type="button"
                  className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow hover:opacity-90"
                  aria-label="Search"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/admin/login"
              className="text-md font-medium text-foreground p-3  hover:border hover:p-3 hover:rounded-3xl hover:bg-[#f2f0f0]"
            >
              Log in
            </Link>

            <Link
              href="/admin/register"
              className=""
            >
              <Button />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* Minimal inline icons (no extra libs needed) */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.3 16.3 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 22s7-4.4 7-12a7 7 0 1 0-14 0c0 7.6 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2 12h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 2c3 3 3 17 0 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 2c-3 3-3 17 0 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
