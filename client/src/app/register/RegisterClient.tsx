"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
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
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type RegisterClientProps = {
  redirectTo: string;
};

const getSafeRedirect = (
  redirectTo: string
) => {
  if (
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
  ) {
    return redirectTo;
  }

  return "/tickets";
};

export default function RegisterClient({
  redirectTo,
}: RegisterClientProps) {
  const router = useRouter();

  const { register } = useAuth();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const formIsValid = useMemo(() => {
    return (
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 2 &&
      email.trim().length > 0 &&
      password.length >= 8
    );
  }, [
    firstName,
    lastName,
    email,
    password,
  ]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !formIsValid ||
      submitting
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await register({
        firstName:
          firstName.trim(),
        lastName:
          lastName.trim(),
        email:
          email.trim(),
        password,
      });

      const destination =
        redirectTo &&
        redirectTo !== "/"
          ? getSafeRedirect(
              redirectTo
            )
          : "/tickets";

      router.push(destination);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to create your account."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const loginHref =
    redirectTo &&
    redirectTo !== "/"
      ? `/login?redirect=${encodeURIComponent(
          getSafeRedirect(
            redirectTo
          )
        )}`
      : "/login";

  return (
    <main className="min-h-screen overflow-hidden bg-[#FCFBF8]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* VISUAL */}

        <section className="relative hidden min-h-screen overflow-hidden bg-[#171717] lg:block">
          <motion.div
            className="absolute right-[10%] top-[8%] h-80 w-80 rounded-full bg-[#8A6DF6]/25 blur-[110px]"
            animate={{
              scale: [1, 1.16, 1],
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
                rotate: -5,
                y: 30,
              }}
              animate={{
                opacity: 1,
                rotate: -3,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="w-full max-w-[500px]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A996FF]">
                One account
              </p>

              <h2 className="mt-5 text-6xl font-semibold leading-[0.93] tracking-[-0.065em] text-white">
                Find it.

                <span className="block text-[#A996FF]">
                  Book it.
                </span>

                Be there.
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/45">
                Keep your events, tickets,
                payments, and experiences
                together in one simple place.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  "Discover",
                  "Book",
                  "Attend",
                ].map(
                  (item, index) => (
                    <motion.div
                      key={item}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          0.5 +
                          index * 0.08,
                      }}
                      className="rounded-[18px] bg-white/[0.06] p-4"
                    >
                      <span className="text-[10px] text-white/25">
                        0{index + 1}
                      </span>

                      <strong className="mt-5 block text-xs font-semibold text-white">
                        {item}
                      </strong>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FORM */}

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

          <div className="flex flex-1 items-center py-12">
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
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="mx-auto w-full max-w-[480px]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6DF6]">
                Join Luma
              </p>

              <h1 className="mt-4 text-[44px] font-semibold leading-[0.96] tracking-[-0.06em] text-[#171717] sm:text-5xl">
                Your next event

                <span className="block">
                  starts here.
                </span>
              </h1>

              <p className="mt-5 text-sm leading-6 text-neutral-500">
                Create your account and start
                discovering experiences worth
                showing up for.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-xs font-semibold text-neutral-700"
                    >
                      First name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                      />

                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(
                          event
                        ) =>
                          setFirstName(
                            event.target
                              .value
                          )
                        }
                        autoComplete="given-name"
                        placeholder="Marvelous"
                        className="h-[52px] w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-xs font-semibold text-neutral-700"
                    >
                      Last name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                      />

                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(
                          event
                        ) =>
                          setLastName(
                            event.target
                              .value
                          )
                        }
                        autoComplete="family-name"
                        placeholder="Adeoye"
                        className="h-[52px] w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                      />
                    </div>
                  </div>
                </div>

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
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event.target
                            .value
                        )
                      }
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-[52px] w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold text-neutral-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event.target
                            .value
                        )
                      }
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="h-[52px] w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            current
                          ) =>
                            !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-black"
                    >
                      {showPassword ? (
                        <EyeOff
                          size={16}
                        />
                      ) : (
                        <Eye
                          size={16}
                        />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-[10px] text-neutral-400">
                    Use at least 8 characters.
                  </p>
                </div>

                {error && (
                  <div className="rounded-[14px] bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    !formIsValid ||
                    submitting
                  }
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#171717] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                >
                  {submitting
                    ? "Creating account..."
                    : "Create account"}

                  {!submitting && (
                    <ArrowRight
                      size={15}
                    />
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                  href={loginHref}
                  className="font-semibold text-[#7459E8] transition hover:text-[#6247D7]"
                >
                  Sign in
                </Link>
              </p>

              <p className="mx-auto mt-5 max-w-sm text-center text-[10px] leading-5 text-neutral-400">
                By creating an account,
                you agree to Luma&apos;s
                Terms and Privacy Policy.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}