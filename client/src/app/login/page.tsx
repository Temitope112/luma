import { Suspense } from "react";
import LoginClient from "./LoginClient";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

function LoginFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FCFBF8] px-5">
      <div className="w-full max-w-md">
        <div className="h-10 w-48 animate-pulse rounded bg-black/5" />

        <div className="mt-4 h-4 w-72 animate-pulse rounded bg-black/5" />

        <div className="mt-10 h-[360px] animate-pulse rounded-[28px] bg-black/5" />
      </div>
    </main>
  );
}

async function LoginContent({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

 return (
  <LoginClient
    redirectTo={
  params.redirect ?? "/"
}
  />
);
}

export default function LoginPage({
  searchParams,
}: LoginPageProps) {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}