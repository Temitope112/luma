"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type LoginClientProps = {
  redirectTo: string;
};

export default function LoginClient({ redirectTo }: LoginClientProps) {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const formIsValid = useMemo(() => {
    return email.trim().length > 0 && password.length > 0;
  }, [email, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formIsValid || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const loggedInUser = await login({
        email: email.trim(),
        password,
      });

      const hasExplicitRedirect = redirectTo && redirectTo !== "/";

      if (hasExplicitRedirect) {
        router.push(redirectTo);
      } else if (
        loggedInUser.role === "ORGANIZER" ||
        loggedInUser.role === "ADMIN"
      ) {
        router.push("/dashboard");
      } else {
        router.push("/tickets");
      }

      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to sign in. Please check your details.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const registerHref =
    redirectTo !== "/"
      ? `/register?redirect=${encodeURIComponent(redirectTo)}`
      : "/register";

  return (
    <main className="min-h-screen overflow-hidden bg-[#FCFBF8]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        {/* FORM SIDE */}

        <section className="flex min-h-screen flex-col px-5 py-7 sm:px-8 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold tracking-[-0.06em] text-[#171717]"
            >
              luma.
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-neutral-500 transition hover:text-black"
            >
              <ArrowLeft size={14} />
              Back home
            </Link>
          </div>

          <div className="flex flex-1 items-center py-14">
            <motion.div
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto w-full max-w-[460px]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6DF6]">
                Welcome back
              </p>

              <h1 className="mt-4 text-[44px] font-semibold leading-[0.96] tracking-[-0.06em] text-[#171717] sm:text-5xl">
                Pick up where
                <span className="block">you left off.</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-neutral-500">
                Sign in to manage your tickets, discover events, and keep
                everything in one place.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-neutral-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-13 w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-semibold text-neutral-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-[#7459E8] transition hover:text-[#6247D7]"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-13 w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-black"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-[14px] bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!formIsValid || submitting}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-[14px] bg-[#171717] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                >
                  {submitting ? "Signing you in..." : "Sign in"}

                  {!submitting && <ArrowRight size={15} />}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-500">
                New to Luma?{" "}
                <Link
                  href={registerHref}
                  className="font-semibold text-[#7459E8] transition hover:text-[#6247D7]"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          </div>
        </section>

        {/* VISUAL SIDE */}

        <section className="relative hidden min-h-screen overflow-hidden bg-[#171717] lg:block">
          <motion.div
            className="absolute left-[15%] top-[10%] h-80 w-80 rounded-full bg-[#8A6DF6]/25 blur-[110px]"
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center px-14">
            <motion.div
              initial={{
                opacity: 0,
                rotate: 5,
                y: 30,
              }}
              animate={{
                opacity: 1,
                rotate: 3,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="relative w-full max-w-[520px] overflow-hidden rounded-[32px] bg-[#232323] p-4 shadow-2xl"
            >
              <div className="relative h-[340px] overflow-hidden rounded-[24px]">
                <img
                  src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=90"
                  alt="Live event"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                    Saturday night
                  </span>

                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                    Somewhere worth showing up for.
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="rounded-[20px] bg-white/[0.06] p-4 text-white">
                  <span className="text-[10px] text-white/35">Your ticket</span>

                  <strong className="mt-3 block text-sm">
                    Ready when you are
                  </strong>
                </div>

                <div className="rounded-[20px] bg-[#8A6DF6] p-4 text-white">
                  <span className="text-[10px] text-white/60">Explore</span>

                  <strong className="mt-3 block text-sm">
                    Find your people
                  </strong>
                </div>
              </div>
            </motion.div>
          </div>

          <p className="absolute bottom-10 left-1/2 w-full -translate-x-1/2 text-center text-xs text-white/30">
            Events feel better when everything else feels easy.
          </p>
        </section>
      </div>
    </main>
  );
}
