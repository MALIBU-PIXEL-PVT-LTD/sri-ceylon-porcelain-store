import type { ReactNode } from "react";

/**
 * Breaks out of the root layout Container so the sign-in split view can span the viewport width.
 */
export default function SignInLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2">
      <div className="-my-10 min-h-[calc(100dvh-5rem)]">{children}</div>
    </div>
  );
}
