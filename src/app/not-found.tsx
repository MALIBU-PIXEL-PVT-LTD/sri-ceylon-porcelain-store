import Link from "next/link";

import { uiRound } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[min(60vh,28rem)] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[min(65vh,32rem)] sm:py-24">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500">
        404
      </p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600 sm:text-base">
        Sorry, we could not find the page you are looking for. It may have been
        moved or the link may be incorrect.
      </p>
      <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
        <Link
          href="/"
          className={`inline-flex h-11 items-center justify-center bg-stone-900 px-8 text-sm font-medium tracking-wide text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 ${uiRound}`}
        >
          Back to home
        </Link>
        <Link
          href="/products"
          className={`inline-flex h-11 items-center justify-center border border-stone-300 bg-transparent px-8 text-sm font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 ${uiRound}`}
        >
          View collection
        </Link>
      </div>
    </div>
  );
}
