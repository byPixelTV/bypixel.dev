"use client";
export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="text-2xl font-semibold">The articles couldn&apos;t load.</h2>
      <p className="mt-4 text-white/60">Please try again in a moment.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-purple-600 px-6 py-3 text-white">
        Try again
      </button>
    </div>
  );
}
