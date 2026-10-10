"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import axios from "axios";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  resetPassword,
} from "@/services/auth.service";

type ResetPasswordClientProps = {
  token:
    | string
    | null;
};

export default function ResetPasswordClient({
  token,
}: ResetPasswordClientProps) {
  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const valid =
    useMemo(
      () =>
        password.length >=
          8 &&
        password ===
          confirmPassword,
      [
        password,
        confirmPassword,
      ]
    );

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !token ||
        !valid ||
        submitting
      ) {
        return;
      }

      try {
        setSubmitting(
          true
        );

        setError(null);

        await resetPassword(
          token,
          password
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
              "Unable to reset your password."
          );
        } else {
          setError(
            "Something went wrong. Please try again."
          );
        }
      } finally {
        setSubmitting(
          false
        );
      }
    };

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">
            Invalid reset
            link.
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            This password
            reset link is
            incomplete.
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white"
          >
            Request a new link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFBF8] px-5">
      <div className="mx-auto flex min-h-screen max-w-md items-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full"
        >
          {!success ? (
            <>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#EEE9FF] text-[#7459E8]">
                <LockKeyhole
                  size={19}
                />
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.055em]">
                Set a new
                password.
              </h1>

              <p className="mt-4 text-sm leading-6 text-neutral-500">
                Choose a strong
                password you
                haven&apos;t used
                before.
              </p>

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-8 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        password
                      }
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event
                            .target
                            .value
                        )
                      }
                      autoComplete="new-password"
                      className="h-[52px] w-full rounded-[14px] border border-black/10 bg-white pl-11 pr-12 text-sm outline-none focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            value
                          ) =>
                            !value
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    >
                      {showPassword ? (
                        <EyeOff
                          size={
                            16
                          }
                        />
                      ) : (
                        <Eye
                          size={
                            16
                          }
                        />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Confirm
                    password
                  </label>

                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event
                    ) =>
                      setConfirmPassword(
                        event
                          .target
                          .value
                      )
                    }
                    autoComplete="new-password"
                    className="h-[52px] w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                  />

                  {confirmPassword &&
                    password !==
                      confirmPassword && (
                      <p className="mt-2 text-[11px] text-red-500">
                        Passwords
                        do not match.
                      </p>
                    )}
                </div>

                {error && (
                  <div className="rounded-[14px] bg-red-50 px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    !valid ||
                    submitting
                  }
                  className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#171717] text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {submitting
                    ? "Resetting..."
                    : "Reset password"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EEE9FF] text-[#7459E8]">
                <CheckCircle2
                  size={22}
                />
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.055em]">
                Password
                changed.
              </h1>

              <p className="mt-4 text-sm leading-6 text-neutral-500">
                Your password
                has been updated
                successfully.
              </p>

              <Link
                href="/login"
                className="mt-8 inline-flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#171717] text-sm font-semibold text-white"
              >
                Sign in
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}