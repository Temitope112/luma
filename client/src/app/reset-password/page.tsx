import {
  Suspense,
} from "react";

import ResetPasswordClient from "./ResetPasswordClient";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

function ResetFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
      <div className="w-full max-w-md">
        <div className="h-10 w-60 animate-pulse rounded bg-black/5" />

        <div className="mt-8 h-64 animate-pulse rounded-[24px] bg-black/5" />
      </div>
    </main>
  );
}

async function ResetPasswordContent({
  searchParams,
}: ResetPasswordPageProps) {
  const params =
    await searchParams;

  return (
    <ResetPasswordClient
      token={
        params.token ??
        null
      }
    />
  );
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return (
    <Suspense
      fallback={
        <ResetFallback />
      }
    >
      <ResetPasswordContent
        searchParams={
          searchParams
        }
      />
    </Suspense>
  );
}