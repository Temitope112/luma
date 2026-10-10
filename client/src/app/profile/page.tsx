"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarPlus,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] px-5 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-4 w-24 animate-pulse rounded bg-black/5" />

          <div className="mt-8 h-24 w-full animate-pulse rounded-[24px] bg-black/5" />

          <div className="mt-6 h-72 w-full animate-pulse rounded-[28px] bg-black/5" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EEE9FF] text-[#8A6DF6]">
            <UserRound size={22} />
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
            Sign in to continue.
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Your profile is linked to your
            Luma account.
          </p>

          <Link
            href="/login?redirect=/profile"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#171717] px-6 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const fullName =
    `${user.firstName} ${user.lastName}`.trim();

  const initials =
    `${user.firstName?.[0] ?? ""}${
      user.lastName?.[0] ?? ""
    }`.toUpperCase();

  const isOrganizer =
    user.role === "ORGANIZER" ||
    user.role === "ADMIN";

  return (
    <main className="min-h-screen bg-[#FCFBF8] pb-20">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={15} />
          Back home
        </Link>

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
          className="mt-8 overflow-hidden rounded-[30px] bg-[#171717] text-white"
        >
          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <div className="absolute right-[-40px] top-[-40px] h-48 w-48 rounded-full bg-[#8A6DF6]/20 blur-[70px]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#8A6DF6] text-lg font-bold">
                  {initials}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                    My account
                  </p>

                  <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                    {fullName}
                  </h1>

                  <div className="mt-2 flex items-center gap-2">
                    <ShieldCheck
                      size={14}
                      className="text-[#A996FF]"
                    />

                    <span className="text-xs text-white/55">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white transition hover:bg-white/[0.1]"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        </motion.section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* DETAILS */}

          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.08,
              duration: 0.5,
            }}
            className="rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(40,30,70,0.05)] sm:p-7"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Account details
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-[#F7F5F1] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#8A6DF6]">
                  <UserRound size={16} />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.13em] text-neutral-400">
                    Name
                  </span>

                  <p className="mt-1 truncate text-sm font-semibold text-[#171717]">
                    {fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-[#F7F5F1] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#8A6DF6]">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.13em] text-neutral-400">
                    Email
                  </span>

                  <p className="mt-1 truncate text-sm font-semibold text-[#171717]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-[#F7F5F1] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#8A6DF6]">
                  <Phone size={16} />
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-[0.13em] text-neutral-400">
                    Phone
                  </span>

                  <p className="mt-1 text-sm font-semibold text-[#171717]">
                    {user.phone ||
                      "Not added yet"}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* QUICK ACTIONS */}

          <motion.aside
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.14,
              duration: 0.5,
            }}
            className="rounded-[28px] bg-[#F4F1EC] p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Quick actions
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/tickets"
                className="flex items-center justify-between rounded-2xl bg-white p-4 transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EEE9FF] text-[#8A6DF6]">
                    <Ticket size={15} />
                  </div>

                  <span className="text-sm font-semibold text-[#171717]">
                    My tickets
                  </span>
                </div>
              </Link>

              {isOrganizer && (
                <Link
                  href="/create-event"
                  className="flex items-center justify-between rounded-2xl bg-[#171717] p-4 text-white transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[#A996FF]">
                      <CalendarPlus size={15} />
                    </div>

                    <span className="text-sm font-semibold">
                      Create event
                    </span>
                  </div>
                </Link>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-white/60 p-4">
              <span className="text-[10px] uppercase tracking-[0.13em] text-neutral-400">
                Account type
              </span>

              <p className="mt-2 text-sm font-semibold text-[#171717]">
                {user.role === "ATTENDEE"
                  ? "Attendee"
                  : user.role === "ORGANIZER"
                    ? "Organizer"
                    : "Administrator"}
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}