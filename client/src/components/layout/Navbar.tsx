"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Ticket,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();

  const { user, loading, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const accountRef = useRef<HTMLDivElement | null>(null);

  const canCreateEvent = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logout();

      setAccountOpen(false);
      setOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-[#FCFBF8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        {/* LOGO */}

        <Link
          href="/"
          className="text-2xl font-bold tracking-[-0.06em] text-black"
        >
          luma.
        </Link>

        {/* DESKTOP NAV */}

        <nav className="hidden items-center gap-10 text-sm text-neutral-700 md:flex">
          <Link href="/events" className="transition hover:text-black">
            Discover
          </Link>

          <Link href="/pricing" className="transition hover:text-black">
            Pricing
          </Link>

          <Link href="/about" className="transition hover:text-black">
            About
          </Link>
        </nav>

        {/* DESKTOP AUTH */}

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-black/5" />
          ) : !user ? (
            <>
              <Link
                href="/login"
                className="px-2 text-sm text-neutral-700 transition hover:text-black"
              >
                Sign in
              </Link>

              <Link
                href="/create-event"
                className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Create event
              </Link>
              {canCreateEvent && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-neutral-700 transition hover:bg-black/[0.04] hover:text-black"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/tickets"
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-neutral-700 transition hover:bg-black/[0.04] hover:text-black"
              >
                <Ticket size={15} />
                My tickets
              </Link>

              {canCreateEvent && (
                <Link
                  href="/create-event"
                  className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  Create event
                </Link>
              )}

              {/* ACCOUNT DROPDOWN */}

              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white py-1.5 pl-1.5 pr-3 transition hover:border-black/[0.15]"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#EEE9FF] text-[11px] font-bold text-[#7459E8]">
                    {initials || user.firstName?.[0]}
                  </span>

                  <span className="max-w-[110px] truncate text-xs font-semibold text-neutral-800">
                    {user.firstName}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-neutral-400 transition ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.16,
                      }}
                      className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-[18px] border border-black/[0.06] bg-white p-2 shadow-[0_18px_55px_rgba(30,20,60,0.12)]"
                    >
                      <div className="px-3 py-3">
                        <p className="truncate text-sm font-semibold text-[#171717]">
                          {displayName}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-neutral-400">
                          {user.email}
                        </p>
                      </div>

                      <div className="my-1 h-px bg-black/[0.06]" />

                      <Link
                        href="/tickets"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-700 transition hover:bg-[#F7F5F1] hover:text-black"
                      >
                        <Ticket size={16} />
                        My tickets
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-700 transition hover:bg-[#F7F5F1] hover:text-black"
                      >
                        <UserRound size={16} />
                        Account
                      </Link>

                      <div className="my-1 h-px bg-black/[0.06]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <LogOut size={16} />

                        {loggingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((previous) => !previous)}
          className="grid h-10 w-10 place-items-center rounded-full border border-black/10 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -12,
            }}
            transition={{
              duration: 0.2,
            }}
            className="border-t border-black/5 bg-[#FCFBF8] px-5 pb-6 md:hidden"
          >
            {/* LOGGED-IN USER CARD */}

            {!loading && user && (
              <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-white p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EEE9FF] text-xs font-bold text-[#7459E8]">
                  {initials || user.firstName?.[0]}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#171717]">
                    {displayName}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-neutral-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-1 pt-4">
              <Link
                href="/events"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-neutral-800 hover:bg-black/5"
              >
                Discover
              </Link>

              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-neutral-800 hover:bg-black/5"
              >
                Pricing
              </Link>

              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-neutral-800 hover:bg-black/5"
              >
                About
              </Link>

              {!loading && !user && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base text-neutral-800 hover:bg-black/5"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/create-event"
                    onClick={() => setOpen(false)}
                    className="mt-3 rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white"
                  >
                    Create event
                  </Link>
                  {canCreateEvent && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-neutral-800 hover:bg-black/5"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>
                  )}
                </>
              )}

              {!loading && user && (
                <>
                  <div className="my-2 h-px bg-black/[0.06]" />

                  <Link
                    href="/tickets"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-neutral-800 hover:bg-black/5"
                  >
                    <Ticket size={17} />
                    My tickets
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-neutral-800 hover:bg-black/5"
                  >
                    <UserRound size={17} />
                    Account
                  </Link>

                  {canCreateEvent && (
                    <Link
                      href="/create-event"
                      onClick={() => setOpen(false)}
                      className="mt-2 rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white"
                    >
                      Create event
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-base text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={17} />

                    {loggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
