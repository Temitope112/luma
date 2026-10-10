import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

type RegisterPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

function RegisterFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
      <div className="w-full max-w-md">
        <div className="h-10 w-52 animate-pulse rounded bg-black/5" />

        <div className="mt-4 h-4 w-72 animate-pulse rounded bg-black/5" />

        <div className="mt-10 h-[470px] animate-pulse rounded-[28px] bg-black/5" />
      </div>
    </main>
  );
}

async function RegisterContent({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  return (
    <RegisterClient
      redirectTo={params.redirect ?? "/tickets"}
    />
  );
}

export default function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterContent
        searchParams={searchParams}
      />
    </Suspense>
  );
}