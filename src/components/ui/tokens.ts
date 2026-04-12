/**
 * Shared corner treatment: slightly squared (never pill, circle, or sharp-none).
 * Use for buttons, inputs, badges, cards, and icon hit targets.
 */
export const uiRound = "rounded-sm" as const;

/** Default text input / textarea surface (merge with `className` as needed). */
export const inputFieldClassName =
  "w-full rounded-sm border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-none outline-none transition-colors placeholder:text-stone-400 focus:border-stone-900 focus:ring-1 focus:ring-stone-900";
