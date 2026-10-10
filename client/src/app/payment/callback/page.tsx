import { Suspense } from "react";
import PaymentCallbackClient from "./PaymentCallbackClient";

type PaymentCallbackPageProps = {
  searchParams: Promise<{
    reference?: string;
    trxref?: string;
  }>;
};

function CallbackFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-[0_20px_70px_rgba(40,30,70,0.08)]">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-black/5" />

        <div className="mx-auto mt-6 h-7 w-48 animate-pulse rounded bg-black/5" />

        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-black/5" />

        <div className="mt-8 h-24 animate-pulse rounded-2xl bg-black/5" />
      </div>
    </main>
  );
}

async function PaymentCallbackContent({
  searchParams,
}: PaymentCallbackPageProps) {
  const params = await searchParams;

  const reference =
    params.reference ??
    params.trxref ??
    null;

  return (
    <PaymentCallbackClient
      reference={reference}
    />
  );
}

export default function PaymentCallbackPage({
  searchParams,
}: PaymentCallbackPageProps) {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <PaymentCallbackContent
        searchParams={searchParams}
      />
    </Suspense>
  );
}