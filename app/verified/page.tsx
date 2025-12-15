'use client';

import { useSearchParams } from 'next/navigation';

export default function VerifiedPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-semibold text-black dark:text-zinc-50">
            Email Verified!
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            {email ? (
              <>
                Your email <strong className="text-black dark:text-zinc-50">{email}</strong> has been
                successfully verified.
              </>
            ) : (
              'Your email has been successfully verified.'
            )}
          </p>
          <a
            href="/"
            className="inline-block rounded-md bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Continue
          </a>
        </div>
      </main>
    </div>
  );
}

