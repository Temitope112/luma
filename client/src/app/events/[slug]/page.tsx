import { Suspense } from "react";
import EventDetailsClient from "./EventDetailsClient";

function EventDetailsFallback() {
  return (
    <main className="min-h-screen bg-[#FCFBF8]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="h-5 w-24 animate-pulse rounded bg-black/5" />

        <div className="mt-10 h-[430px] animate-pulse rounded-[30px] bg-black/5" />

        <div className="mt-8 h-10 w-2/3 animate-pulse rounded bg-black/5" />
      </div>
    </main>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<EventDetailsFallback />}>
      <EventDetailsClient />
    </Suspense>
  );
}