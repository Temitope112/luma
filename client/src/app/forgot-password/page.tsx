"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import axios from "axios";

import {
  forgotPassword,
} from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    success,
    setSuccess,
  ] = useState(false);

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !email.trim() ||
        submitting
      ) {
        return;
      }

      try {
        setSubmitting(true);
        setError(null);

        await forgotPassword(
          email.trim()
        );

        setSuccess(true);
      } catch (error) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          setError(
            error.response
              ?.data
              ?.message ??
              "Unable to process your request."
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

  return (
    <main className="min-h-screen bg-[#FCFBF8] px-5">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col py-7">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold tracking-[-0.06em] text-[#171717]"
          >
            luma.
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft
              size={14}
            />

            Sign in
          </Link>
        </div>

        <div className="flex flex-1 items-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="w-full"
          >
            {!success ? (
              <>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#EEE9FF] text-[#7459E8]">
                  <Mail
                    size={19}
                  />
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-[-0.055em] text-[#171717]">
                  Forgot your
                  password?
                </h1>

                <p className="mt-4 text-sm leading-6 text-neutral-500">
                  Enter your email
                  address and
                  we&apos;ll send
                  you instructions
                  to continue.
                </p>

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="mt-8"
                >
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
                      value={
                        email
                      }
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event
                            .target
                            .value
                        )
                      }
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-[52px] w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                    />
                  </div>

                  {error && (
                    <div className="mt-4 rounded-[14px] bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      !email.trim() ||
                      submitting
                    }
                    className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#171717] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                  >
                    {submitting
                      ? "Sending..."
                      : "Continue"}

                    {!submitting && (
                      <ArrowRight
                        size={15}
                      />
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs leading-5 text-neutral-400">
                  For security,
                  we won&apos;t
                  confirm whether
                  an email address
                  is registered.
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EEE9FF] text-[#7459E8]">
                  <CheckCircle2
                    size={22}
                  />
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-[-0.055em] text-[#171717]">
                  Request received.
                </h1>

                <p className="mt-4 text-sm leading-6 text-neutral-500">
                  We&apos;ve
                  received your
                  request. Please
                  check your inbox
                  for the next
                  steps.
                </p>

                <Link
                  href="/login"
                  className="mt-8 inline-flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#171717] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Back to sign in
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}