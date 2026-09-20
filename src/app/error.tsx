"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-32 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Something went wrong
      </h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Try again
      </button>
    </div>
  );
}
