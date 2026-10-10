import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-10 border-b border-white/8 pb-10 md:grid-cols-[1fr_auto_auto] md:items-start md:gap-16">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-[-0.06em]"
            >
              luma.
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
              Discover meaningful events,
              connect with people, and create
              experiences worth remembering.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Explore
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/65">
              <Link
                href="/events"
                className="transition hover:text-white"
              >
                Discover
              </Link>

              <Link
                href="/create-event"
                className="transition hover:text-white"
              >
                Create event
              </Link>

              <Link
                href="/pricing"
                className="transition hover:text-white"
              >
                Pricing
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Account
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/65">
              <Link
                href="/login"
                className="transition hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="transition hover:text-white"
              >
                Get started
              </Link>

              <Link
                href="/dashboard"
                className="transition hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026 Luma. All rights reserved.
          </span>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-white/60"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white/60"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}