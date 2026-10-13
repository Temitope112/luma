"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Keyboard,
  LoaderCircle,
  ScanLine,
  Ticket,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import axios from "axios";

import {
  checkInTicket,
  type CheckedInTicket,
} from "@/services/organizer.service";

import { useAuth } from "@/context/AuthContext";

type ResultState =
  | {
      type: "success";
      ticket: CheckedInTicket;
    }
  | {
      type: "error";
      message: string;
    }
  | null;

type ScannerRef = {
  stop: () => Promise<void>;
  clear: () => void;
};

export default function CheckInPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const scannerRef =
    useRef<ScannerRef | null>(
      null
    );

  const [
    value,
    setValue,
  ] = useState("");

  const [
    scanning,
    setScanning,
  ] = useState(false);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    result,
    setResult,
  ] =
    useState<ResultState>(
      null
    );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace(
        "/login?redirect=/dashboard/check-in"
      );

      return;
    }

    if (
      user.role !== "ORGANIZER" &&
      user.role !== "ADMIN"
    ) {
      router.replace(
        "/tickets"
      );
    }
  }, [
    user,
    authLoading,
    router,
  ]);

  useEffect(() => {
    return () => {
      const scanner =
        scannerRef.current;

      if (!scanner) {
        return;
      }

      scanner
        .stop()
        .catch(() => {});

      try {
        scanner.clear();
      } catch {
        // Scanner may already be cleared.
      }

      scannerRef.current =
        null;
    };
  }, []);

  const processTicket =
    async (
      ticketValue: string
    ) => {
      if (
        !ticketValue.trim() ||
        processing
      ) {
        return;
      }

      try {
        setProcessing(true);
        setResult(null);

        const ticket =
          await checkInTicket(
            ticketValue.trim()
          );

        setResult({
          type: "success",
          ticket,
        });

        setValue("");
      } catch (error) {
        let message =
          "Unable to check in this ticket.";

        if (
          axios.isAxiosError(
            error
          )
        ) {
          message =
            error.response
              ?.data
              ?.message ??
            message;
        }

        setResult({
          type: "error",
          message,
        });
      } finally {
        setProcessing(false);
      }
    };

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      await processTicket(
        value
      );
    };

  const startScanner =
    async () => {
      if (
        scanning ||
        processing
      ) {
        return;
      }

      setResult(null);

      try {
        const {
          Html5Qrcode,
        } = await import(
          "html5-qrcode"
        );

        const scanner =
          new Html5Qrcode(
            "luma-reader"
          );

        scannerRef.current =
          scanner;

        setScanning(true);

        await scanner.start(
          {
            facingMode:
              "environment",
          },

          {
            fps: 10,

            qrbox: {
              width: 240,
              height: 240,
            },
          },

          async (
            decodedText
          ) => {
            try {
              await scanner.stop();

              scanner.clear();
            } catch {
              // Scanner may already be stopped.
            }

            scannerRef.current =
              null;

            setScanning(false);

            await processTicket(
              decodedText
            );
          },

          () => {
            // Ignore frame-level
            // decoding failures.
          }
        );
      } catch (error) {
        console.error(
          "Scanner error:",
          error
        );

        if (
          scannerRef.current
        ) {
          try {
            scannerRef.current.clear();
          } catch {
            // Ignore cleanup error.
          }
        }

        scannerRef.current =
          null;

        setScanning(false);

        setResult({
          type: "error",
          message:
            "Unable to access the camera. Check camera permission or enter the ticket code manually.",
        });
      }
    };

  const stopScanner =
    async () => {
      const scanner =
        scannerRef.current;

      if (!scanner) {
        setScanning(false);
        return;
      }

      try {
        await scanner.stop();

        scanner.clear();
      } catch {
        // Scanner may already be stopped.
      } finally {
        scannerRef.current =
          null;

        setScanning(false);
      }
    };

  if (
    authLoading ||
    !user
  ) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#FCFBF8]">
        <LoaderCircle className="animate-spin text-[#8A6DF6]" />
      </main>
    );
  }

  if (
    user.role !== "ORGANIZER" &&
    user.role !== "ADMIN"
  ) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FCFBF8] pb-20">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft
            size={15}
          />
          Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A6DF6]">
            Organizer tools
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#171717] md:text-5xl">
            Ticket check-in
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
            Scan an attendee&apos;s QR
            code or enter their ticket
            code manually.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* SCANNER */}

          <section className="overflow-hidden rounded-[28px] bg-[#171717] p-5 text-white sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.17em] text-white/35">
                  Camera
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                  Scan QR code
                </h2>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07]">
                <ScanLine
                  size={18}
                />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[22px] bg-black/40">
              <div
                id="luma-reader"
                className="min-h-[360px] w-full"
              />

              {!scanning && (
                <div className="-mt-[360px] grid min-h-[360px] place-items-center px-5 text-center">
                  <div>
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/[0.07] text-[#A996FF]">
                      <Camera
                        size={22}
                      />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      Camera is off
                    </p>

                    <p className="mt-2 max-w-xs text-xs leading-5 text-white/40">
                      Start the scanner and
                      point the camera at the
                      attendee&apos;s QR code.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!scanning ? (
              <button
                type="button"
                onClick={
                  startScanner
                }
                disabled={
                  processing
                }
                className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#8A6DF6] text-sm font-semibold text-white transition hover:bg-[#795FE8] disabled:opacity-50"
              >
                <Camera
                  size={16}
                />

                Start scanner
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  stopScanner
                }
                className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-white/[0.08] text-sm font-semibold text-white"
              >
                <XCircle
                  size={16}
                />

                Stop scanner
              </button>
            )}
          </section>

          {/* MANUAL + RESULT */}

          <div className="space-y-6">
            <section className="rounded-[28px] bg-white p-6 shadow-[0_12px_40px_rgba(30,20,60,0.04)]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#EEE9FF] text-[#7459E8]">
                  <Keyboard
                    size={17}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Manual check-in
                  </h2>

                  <p className="mt-0.5 text-[11px] text-neutral-400">
                    Enter the ticket code
                  </p>
                </div>
              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-5"
              >
                <input
                  value={value}
                  onChange={(
                    event
                  ) =>
                    setValue(
                      event.target.value
                    )
                  }
                  placeholder="LUMA:TICKET:..."
                  className="h-[52px] w-full rounded-[14px] border border-black/10 bg-[#FCFBF8] px-4 text-sm outline-none transition placeholder:text-neutral-300 focus:border-[#8A6DF6] focus:ring-4 focus:ring-[#8A6DF6]/10"
                />

                <button
                  type="submit"
                  disabled={
                    !value.trim() ||
                    processing
                  }
                  className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#171717] text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {processing ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />

                      Checking...
                    </>
                  ) : (
                    <>
                      <Ticket
                        size={16}
                      />

                      Check in ticket
                    </>
                  )}
                </button>
              </form>
            </section>

            {result?.type ===
              "success" && (
              <section className="rounded-[28px] bg-[#EEE9FF] p-6">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#7459E8]">
                  <CheckCircle2
                    size={19}
                  />
                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7459E8]">
                  Checked in
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#171717]">
                  {
                    result.ticket.user
                      .firstName
                  }{" "}
                  {
                    result.ticket.user
                      .lastName
                  }
                </h2>

                <div className="mt-5 space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-500">
                      Event
                    </span>

                    <p className="mt-1 font-semibold">
                      {
                        result.ticket
                          .orderItem.order
                          .event.title
                      }
                    </p>
                  </div>

                  <div>
                    <span className="text-neutral-500">
                      Ticket
                    </span>

                    <p className="mt-1 font-semibold">
                      {
                        result.ticket
                          .orderItem
                          .ticketType.name
                      }
                    </p>
                  </div>

                  <div>
                    <span className="text-neutral-500">
                      Checked in
                    </span>

                    <p className="mt-1 font-semibold">
                      {result.ticket
                        .checkedInAt
                        ? new Date(
                            result.ticket
                              .checkedInAt
                          ).toLocaleString()
                        : "Just now"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {result?.type ===
              "error" && (
              <section className="rounded-[28px] bg-red-50 p-6">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-red-500">
                  <TriangleAlert
                    size={19}
                  />
                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-500">
                  Check-in failed
                </p>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  {
                    result.message
                  }
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}