import { Suspense } from "react";
import TicketDetailsClient from "./TicketDetailsClient";

type TicketPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function TicketPageFallback() {
  return (
    <main className="min-h-screen bg-[#FCFBF8] px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="h-4 w-24 animate-pulse rounded bg-black/5" />

        <div className="mt-8 h-[650px] animate-pulse rounded-[30px] bg-black/5" />
      </div>
    </main>
  );
}

async function TicketPageContent({
  params,
}: TicketPageProps) {
  const { id } = await params;

  return (
    <TicketDetailsClient
      orderId={id}
    />
  );
}

export default function TicketPage({
  params,
}: TicketPageProps) {
  return (
    <Suspense fallback={<TicketPageFallback />}>
      <TicketPageContent
        params={params}
      />
    </Suspense>
  );
}