'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [gmailLink, setGmailLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGmailLink = async () => {
      if (email) {
        try {
          // Fetch the Gmail link from the server to ensure it uses the correct from email
          const response = await fetch(`/api/gmail-link?email=${encodeURIComponent(email)}`);
          const data = await response.json();
          if (data.gmailLink) {
            setGmailLink(data.gmailLink);
          }
        } catch (error) {
          console.error('Failed to fetch Gmail link:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchGmailLink();
  }, [email]);

  if (!email || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-4 text-2xl font-semibold text-red-600 dark:text-red-400">
            Invalid Confirmation Link
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            The confirmation link is invalid or missing required parameters.
          </p>
          <a
            href="/register"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to registration
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-semibold text-black dark:text-zinc-50">
            Check Your Email
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            We&apos;ve sent a confirmation email to <strong className="text-black dark:text-zinc-50">{email}</strong>
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            Quick Access to Your Email
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Click the button below to open Gmail and find your confirmation email:
          </p>
          
          {isLoading ? (
            <div className="inline-flex items-center gap-2 rounded-md bg-gray-400 px-6 py-3 font-medium text-white">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          ) : gmailLink ? (
            <a
              href={gmailLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Open Gmail to Find Email
            </a>
          ) : null}

          <div className="mt-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>How it works:</strong> This link opens Gmail and automatically filters
              to show emails from the sender with the subject <code className="rounded bg-blue-100 px-1 dark:bg-blue-900/40">&quot;Confirm your email address&quot;</code> sent to your email in the last day.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 font-medium text-black dark:text-zinc-50">
              Manual Confirmation
            </h3>
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
              Or click the confirmation link in the email you received:
            </p>
            <a
              href={`/api/verify?token=${token}&email=${encodeURIComponent(email)}`}
              className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Confirm Email Address
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}

