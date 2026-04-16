import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { uiRound } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[min(60vh,28rem)] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[min(65vh,32rem)] sm:py-24">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500">
        404
      </p>
      <h1 className="type-h1 mt-4 text-stone-900">
        Page not found
      </h1>
      <p className="type-p mt-4 max-w-md text-stone-600">
        Sorry, we could not find the page you are looking for. It may have been
        moved or the link may be incorrect.
      </p>
      <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
        <Link
          href="/"
          className={`inline-flex h-11 items-center justify-center gap-2 bg-stone-900 px-8 text-sm font-medium tracking-wide text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 ${uiRound}`}
        >
          <span>Back To Home</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <Link
          href="/products"
          className={`inline-flex h-11 items-center justify-center gap-2 border border-stone-300 bg-transparent px-8 text-sm font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 ${uiRound}`}
        >
          <span>View Collection</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
