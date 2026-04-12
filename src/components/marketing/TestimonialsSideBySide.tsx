/**
 * Side-by-side testimonials — layout inspired by
 * https://tailwindcss.com/plus/ui-blocks/marketing/sections/testimonials
 * (“Side-by-side”; original copy and markup, not proprietary kit code).
 */

const testimonials = [
  {
    quote:
      "We replaced a full table setting after five years of daily service. The glaze still reads calm under candlelight—our guests comment on it more than the wine list.",
    author: "Amaya Perera",
    role: "Owner, Wild Coast Table",
    initials: "AP",
  },
  {
    quote:
      "Sourcing for a boutique hotel means every piece has to survive brunch, room service, and scrutiny from designers. This line has held its line and its color.",
    author: "James Okonkwo",
    role: "Procurement, Harbour & Stone",
    initials: "JO",
  },
] as const;

export function TestimonialsSideBySide() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-stone-200/80 pt-16 sm:pt-20"
    >
      <h2
        id="testimonials-heading"
        className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-stone-500"
      >
        Testimonials
      </h2>
      <p className="mt-2 max-w-xl text-xl font-medium tracking-tight text-stone-900 sm:text-2xl">
        What people say at the table
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
        {testimonials.map((t) => (
          <figure key={t.author} className="flex flex-col">
            <blockquote className="relative text-pretty text-base leading-relaxed text-stone-700 sm:text-lg sm:leading-relaxed">
              <span
                className="absolute -left-1 -top-2 select-none font-serif text-5xl leading-none text-stone-200 sm:-left-2 sm:-top-3 sm:text-6xl"
                aria-hidden
              >
                “
              </span>
              <p className="relative pl-5 sm:pl-7">{t.quote}</p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t border-stone-200/90 pt-8">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-stone-200/90 bg-stone-100 text-xs font-semibold tracking-tight text-stone-600"
                aria-hidden
              >
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-medium text-stone-900">{t.author}</p>
                <p className="mt-0.5 text-sm text-stone-500">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
